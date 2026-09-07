import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;
let tablesInitialized = false;

// In-memory fallback if MySQL is temporarily unreachable (e.g. local build/dev)
const inMemoryVisitors = new Map<string, { visitorId: string; page: string; lastSeen: number }>();
const inMemorySessions = new Set<string>();
const inMemoryDaily = {
  totalSessions: 0,
  uniqueVisitors: 0,
  homeViews: 0,
  enrollmentViews: 0,
  lmsViews: 0,
  otherViews: 0,
  date: new Date().toISOString().slice(0, 10),
};

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

export async function ensureAnalyticsTables(): Promise<boolean> {
  if (tablesInitialized) return true;
  try {
    const p = getMysqlPool();

    // 1. Real-time active open tabs/devices table
    await p.query(`
      CREATE TABLE IF NOT EXISTS active_visitors (
        visitor_id VARCHAR(64) PRIMARY KEY,
        page VARCHAR(255) NOT NULL,
        last_seen BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Daily aggregate analytics (Shopify-style: exactly 1 row per day)
    await p.query(`
      CREATE TABLE IF NOT EXISTS analytics_daily (
        report_date DATE PRIMARY KEY,
        total_sessions INT DEFAULT 0,
        unique_visitors INT DEFAULT 0,
        home_views INT DEFAULT 0,
        enrollment_views INT DEFAULT 0,
        lms_views INT DEFAULT 0,
        other_views INT DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Deduplicated daily session IDs (cleans up older than 2 days automatically)
    await p.query(`
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        session_id VARCHAR(64) PRIMARY KEY,
        session_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session_date (session_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. CMS Settings table in Hostinger MySQL
    await p.query(`
      CREATE TABLE IF NOT EXISTS cms_settings (
        \`key\` VARCHAR(191) PRIMARY KEY,
        \`value_json\` LONGTEXT NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    tablesInitialized = true;
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Fetches CMS settings from Hostinger MySQL.
 */
export async function mysqlGetCmsSettings(): Promise<any | null> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT value_json FROM cms_settings WHERE \`key\` = 'main_cms' LIMIT 1`
      );
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.value_json) {
        const raw = rows[0].value_json;
        return typeof raw === 'string' ? JSON.parse(raw) : raw;
      }
    } catch {
      // Fall through
    }
  }
  return null;
}

/**
 * Saves CMS settings into Hostinger MySQL.
 */
export async function mysqlSaveCmsSettings(data: any): Promise<boolean> {
  const hasTables = await ensureAnalyticsTables();
  if (hasTables && pool) {
    try {
      const jsonStr = typeof data === 'string' ? data : JSON.stringify(data);
      await pool.query(
        `INSERT INTO cms_settings (\`key\`, \`value_json\`, \`updated_at\`)
         VALUES ('main_cms', ?, NOW())
         ON DUPLICATE KEY UPDATE \`value_json\` = VALUES(\`value_json\`), \`updated_at\` = NOW()`,
        [jsonStr]
      );
      return true;
    } catch (err) {
      console.error('MySQL CMS save error:', err);
    }
  }
  return false;
}

/**
 * Records or updates an active visitor in Hostinger MySQL.
 */
export async function recordVisitorPing(visitorId: string, page: string): Promise<void> {
  const now = Date.now();
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
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
  inMemoryVisitors.set(visitorId, { visitorId, page, lastSeen: now });
  const cutoff = now - 25000;
  for (const [key, item] of inMemoryVisitors.entries()) {
    if (item.lastSeen < cutoff) inMemoryVisitors.delete(key);
  }
}

/**
 * Records a page session hit and aggregates into analytics_daily.
 * - Deduplicates sessions so refreshing the page does not falsely inflate session count.
 * - Tracks which page (home, enrollment, lms, etc.) was viewed.
 */
export async function recordSessionHit(sessionId: string, page: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const cleanPage = (page || '/').toLowerCase();
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
    try {
      // 1. Check if this is a new unique session today
      let isNewSession = false;
      try {
        const [insertRes]: any = await pool.query(
          `INSERT IGNORE INTO analytics_sessions (session_id, session_date) VALUES (?, ?)`,
          [sessionId, today]
        );
        isNewSession = insertRes?.affectedRows > 0;
      } catch {
        // Ignore session insert error
      }

      // 2. Classify page view
      const isHome = cleanPage === '/' || cleanPage === '';
      const isEnrollment = cleanPage.startsWith('/enrollment') || cleanPage.startsWith('/checkout');
      const isLms = cleanPage.startsWith('/lms') || cleanPage.startsWith('/login');

      // 3. Upsert into analytics_daily
      await pool.query(
        `INSERT INTO analytics_daily (
          report_date, total_sessions, unique_visitors, home_views, enrollment_views, lms_views, other_views
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?
        ) ON DUPLICATE KEY UPDATE
          total_sessions = total_sessions + ?,
          unique_visitors = unique_visitors + ?,
          home_views = home_views + ?,
          enrollment_views = enrollment_views + ?,
          lms_views = lms_views + ?,
          other_views = other_views + ?`,
        [
          today,
          isNewSession ? 1 : 0,
          isNewSession ? 1 : 0,
          isHome ? 1 : 0,
          isEnrollment ? 1 : 0,
          isLms ? 1 : 0,
          !isHome && !isEnrollment && !isLms ? 1 : 0,
          // ON DUPLICATE updates:
          isNewSession ? 1 : 0,
          isNewSession ? 1 : 0,
          isHome ? 1 : 0,
          isEnrollment ? 1 : 0,
          isLms ? 1 : 0,
          !isHome && !isEnrollment && !isLms ? 1 : 0,
        ]
      );

      // 4. Auto-clean sessions table older than 2 days (keeps table tiny < 50 KB)
      await pool.query(
        `DELETE FROM analytics_sessions WHERE session_date < DATE_SUB(CURDATE(), INTERVAL 2 DAY)`
      );
      return;
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  const isNew = !inMemorySessions.has(sessionId);
  if (isNew) {
    inMemorySessions.add(sessionId);
    inMemoryDaily.totalSessions++;
    inMemoryDaily.uniqueVisitors++;
  }
  if (cleanPage === '/') inMemoryDaily.homeViews++;
  else if (cleanPage.startsWith('/enrollment')) inMemoryDaily.enrollmentViews++;
  else if (cleanPage.startsWith('/lms')) inMemoryDaily.lmsViews++;
  else inMemoryDaily.otherViews++;
}

/**
 * Deletes a visitor on tab close or navigation away.
 */
export async function removeVisitor(visitorId: string): Promise<void> {
  inMemoryVisitors.delete(visitorId);
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
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
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

  for (const [_, item] of inMemoryVisitors.entries()) {
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

/**
 * Returns today's Shopify-style daily aggregate analytics from Hostinger MySQL.
 */
export async function getTodayAnalytics(): Promise<{
  date: string;
  totalSessions: number;
  uniqueVisitors: number;
  homeViews: number;
  enrollmentViews: number;
  checkoutViews: number;
  lmsViews: number;
  enrollmentRate: string;
}> {
  const today = new Date().toISOString().slice(0, 10);
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT * FROM analytics_daily WHERE report_date = ? LIMIT 1`,
        [today]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0];
        const totalSessions = Number(r.total_sessions || 0);
        const enrollmentViews = Number(r.enrollment_views || 0);
        const rate = totalSessions > 0
          ? `${((enrollmentViews / totalSessions) * 100).toFixed(1)}%`
          : '0.0%';

        return {
          date: today,
          totalSessions,
          uniqueVisitors: Number(r.unique_visitors || 0),
          homeViews: Number(r.home_views || 0),
          enrollmentViews,
          checkoutViews: enrollmentViews,
          lmsViews: Number(r.lms_views || 0),
          enrollmentRate: rate,
        };
      }
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  const rate = inMemoryDaily.totalSessions > 0
    ? `${((inMemoryDaily.enrollmentViews / inMemoryDaily.totalSessions) * 100).toFixed(1)}%`
    : '0.0%';

  return {
    date: inMemoryDaily.date,
    totalSessions: inMemoryDaily.totalSessions,
    uniqueVisitors: inMemoryDaily.uniqueVisitors,
    homeViews: inMemoryDaily.homeViews,
    enrollmentViews: inMemoryDaily.enrollmentViews,
    checkoutViews: inMemoryDaily.enrollmentViews,
    lmsViews: inMemoryDaily.lmsViews,
    enrollmentRate: rate,
  };
}

/**
 * Returns cumulative analytics for the last 30 days from Hostinger MySQL.
 */
export async function getLast30DaysAnalytics(): Promise<{
  totalSessions: number;
  uniqueVisitors: number;
  homeViews: number;
  checkoutViews: number;
  lmsViews: number;
}> {
  const hasTables = await ensureAnalyticsTables();

  if (hasTables && pool) {
    try {
      const [rows]: any = await pool.query(
        `SELECT 
          COALESCE(SUM(total_sessions), 0) as totalSessions,
          COALESCE(SUM(unique_visitors), 0) as uniqueVisitors,
          COALESCE(SUM(home_views), 0) as homeViews,
          COALESCE(SUM(enrollment_views), 0) as checkoutViews,
          COALESCE(SUM(lms_views), 0) as lmsViews
        FROM analytics_daily 
        WHERE report_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0];
        return {
          totalSessions: Number(r.totalSessions || 0),
          uniqueVisitors: Number(r.uniqueVisitors || 0),
          homeViews: Number(r.homeViews || 0),
          checkoutViews: Number(r.checkoutViews || 0),
          lmsViews: Number(r.lmsViews || 0),
        };
      }
    } catch {
      // Fall through to memory
    }
  }

  // In-memory fallback
  return {
    totalSessions: inMemoryDaily.totalSessions,
    uniqueVisitors: inMemoryDaily.uniqueVisitors,
    homeViews: inMemoryDaily.homeViews,
    checkoutViews: inMemoryDaily.enrollmentViews,
    lmsViews: inMemoryDaily.lmsViews,
  };
}

