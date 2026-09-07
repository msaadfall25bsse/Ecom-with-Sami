import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;
let tableChecked = false;

// Fallback in-memory session store if MySQL is temporarily unreachable (e.g. local build/dev)
const inMemoryFallback = new Map<string, { visitorId: string; page: string; lastSeen: number }>();

export function getMysqlPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
      port: Number(process.env.DB_PORT || process.env.MYSQL_PORT || 3306),
      user: process.env.DB_USERNAME || process.env.MYSQL_USER || 'u787683477_samiadminnew',
      password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || 'Sardar@123890',
      database: process.env.DB_DATABASE || process.env.MYSQL_DATABASE || 'u787683477_ecomsaminew',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
    });
  }
  return pool;
}

export async function ensureActiveVisitorsTable(): Promise<boolean> {
  if (tableChecked) return true;
  try {
    const p = getMysqlPool();
    await p.query(`
      CREATE TABLE IF NOT EXISTS active_visitors (
        visitor_id VARCHAR(64) PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        last_seen BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    tableChecked = true;
    return true;
  } catch (error) {
    // MySQL may not be running locally; will use fallback seamlessly
    return false;
  }
}

/**
 * Records or updates an active visitor in Hostinger MySQL.
 */
export async function recordVisitorPing(visitorId: string, page: string): Promise<void> {
  const now = Date.now();
  const hasTable = await ensureActiveVisitorsTable();

  if (hasTable && pool) {
    try {
      await pool.query(
        `INSERT INTO active_visitors (visitor_id, page, last_seen)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE page = VALUES(page), last_seen = VALUES(last_seen)`,
        [visitorId, page.slice(0, 250), now]
      );

      // Auto-cleanup stale visitors older than 25 seconds
      const cutoff = now - 25000;
      await pool.query(`DELETE FROM active_visitors WHERE last_seen < ?`, [cutoff]);
      return;
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  inMemoryFallback.set(visitorId, { visitorId, page, lastSeen: now });
  const cutoff = now - 25000;
  for (const [key, item] of inMemoryFallback.entries()) {
    if (item.lastSeen < cutoff) inMemoryFallback.delete(key);
  }
}

/**
 * Deletes a visitor on tab close or navigation away.
 */
export async function removeVisitor(visitorId: string): Promise<void> {
  inMemoryFallback.delete(visitorId);
  try {
    if (pool) {
      await pool.query(`DELETE FROM active_visitors WHERE visitor_id = ?`, [visitorId]);
    }
  } catch {
    // Ignore error
  }
}

/**
 * Returns current live visitor count and active pages.
 */
export async function getLiveVisitors(): Promise<{
  activeCount: number;
  topPages: { path: string; activeUsers: number }[];
}> {
  const now = Date.now();
  const cutoff = now - 25000;
  const hasTable = await ensureActiveVisitorsTable();

  if (hasTable && pool) {
    try {
      const [countRows]: any = await pool.query(
        `SELECT COUNT(*) as activeCount FROM active_visitors WHERE last_seen >= ?`,
        [cutoff]
      );

      const [pageRows]: any = await pool.query(
        `SELECT page, COUNT(*) as activeUsers 
         FROM active_visitors 
         WHERE last_seen >= ? 
         GROUP BY page 
         ORDER BY activeUsers DESC 
         LIMIT 5`,
        [cutoff]
      );

      const activeCount = Number(countRows[0]?.activeCount || 0);
      const topPages = (pageRows || []).map((r: any) => ({
        path: r.page || '/',
        activeUsers: Number(r.activeUsers || 1),
      }));

      return { activeCount, topPages };
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  const pagesMap: Record<string, number> = {};
  let activeCount = 0;

  for (const [_, item] of inMemoryFallback.entries()) {
    if (item.lastSeen >= cutoff) {
      activeCount++;
      pagesMap[item.page] = (pagesMap[item.page] || 0) + 1;
    }
  }

  const topPages = Object.entries(pagesMap)
    .map(([path, users]) => ({ path, activeUsers: users }))
    .sort((a, b) => b.activeUsers - a.activeUsers)
    .slice(0, 5);

  return { activeCount, topPages };
}
