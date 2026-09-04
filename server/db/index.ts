import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const hashPassword = (pwd: string) => crypto.createHash('sha256').update(pwd).digest('hex');

// Use native Node.js SQLite (DatabaseSync) available in Node 22+ & 24+
let DatabaseSyncClass: any = null;
try {
  const nodeSqlite = require('node:sqlite');
  DatabaseSyncClass = nodeSqlite.DatabaseSync;
} catch {
  // Fallback if needed
}

export class NativeDatabase {
  private rawDb: any;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    if (DatabaseSyncClass) {
      this.rawDb = new DatabaseSyncClass(dbPath);
    } else {
      // In-memory mock fallback
      this.rawDb = {
        exec: () => {},
        prepare: () => ({
          all: () => [],
          get: () => undefined,
          run: () => ({ lastInsertRowid: 1, changes: 1 })
        })
      };
    }
  }

  exec(sql: string) {
    try {
      this.rawDb.exec(sql);
    } catch (err) {
      console.error('db.exec error:', err);
      throw err;
    }
  }

  pragma(sql: string) {
    try {
      return this.rawDb.exec(`PRAGMA ${sql}`);
    } catch {
      return [];
    }
  }

  prepare(sql: string) {
    const rawDb = this.rawDb;

    const normalizeParams = (params: any[]) => {
      if (params.length === 1 && Array.isArray(params[0])) {
        return params[0];
      }
      return params;
    };

    return {
      all(...rawParams: any[]): any[] {
        const params = normalizeParams(rawParams);
        try {
          const stmt = rawDb.prepare(sql);
          return stmt.all(...params);
        } catch (e) {
          console.error('db.all error:', e, sql);
          return [];
        }
      },

      get(...rawParams: any[]): any {
        const params = normalizeParams(rawParams);
        try {
          const stmt = rawDb.prepare(sql);
          return stmt.get(...params);
        } catch (e) {
          console.error('db.get error:', e, sql);
          return undefined;
        }
      },

      run(...rawParams: any[]): { lastInsertRowid: number; changes: number } {
        const params = normalizeParams(rawParams);
        try {
          const stmt = rawDb.prepare(sql);
          const res = stmt.run(...params);
          return {
            lastInsertRowid: Number(res.lastInsertRowid || 0),
            changes: Number(res.changes || 1)
          };
        } catch (e) {
          console.error('db.run error:', e, sql);
          return { lastInsertRowid: 0, changes: 0 };
        }
      }
    };
  }
}

const DB_PATH = path.join(process.cwd(), 'sami_database.sqlite');
export const db = new NativeDatabase(DB_PATH);

try {
  db.pragma('foreign_keys = ON');
} catch {}

export function initDatabase() {
  console.log('📦 Initializing Database at:', DB_PATH);

  // 1. Admins Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure default master admin exists
  try {
    const existingAdmin = db.prepare('SELECT id FROM admins LIMIT 1').get();
    if (!existingAdmin) {
      const defaultHash = hashPassword('SamiMaster@2026');
      db.prepare(`
        INSERT INTO admins (name, email, password, role)
        VALUES (?, ?, ?, 'admin')
      `).run('Sami Ur Rehman', 'sami@ecomwithsami.com', defaultHash);
      console.log('✅ Default master admin seeded: sami@ecomwithsami.com / SamiMaster@2026');
    }
  } catch (err) {
    console.error('Error ensuring master admin:', err);
  }

  // Helper to ensure new columns exist without breaking existing database
  function addColumnIfNotExists(table: string, column: string, typeDef: string) {
    try {
      const tableInfo = db.prepare(`PRAGMA table_info(${table})`).all() as any[];
      const exists = tableInfo.some((col: any) => col.name === column);
      if (!exists) {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${typeDef}`);
        console.log(`+ Added column ${column} to table ${table}`);
      }
    } catch (err) {
      console.error(`Failed checking/adding column ${column} to ${table}:`, err);
    }
  }

  // 2. Users / Students Table (LMS & Student Login)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      city TEXT,
      password TEXT NOT NULL,
      access_code TEXT,
      current_session_token TEXT,
      last_login_ip TEXT,
      device_info TEXT,
      role TEXT DEFAULT 'student',
      status TEXT DEFAULT 'active',
      external_user_id TEXT,
      last_active_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  addColumnIfNotExists('users', 'access_code', 'TEXT');
  addColumnIfNotExists('users', 'current_session_token', 'TEXT');
  addColumnIfNotExists('users', 'last_login_ip', 'TEXT');
  addColumnIfNotExists('users', 'device_info', 'TEXT');
  addColumnIfNotExists('users', 'security_strikes', 'INTEGER DEFAULT 0');
  addColumnIfNotExists('users', 'suspended_reason', 'TEXT');
  addColumnIfNotExists('users', 'last_strike_at', 'DATETIME');

  // 2.1. Security Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS security_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      event_type TEXT NOT NULL,
      strike_count INTEGER NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Courses Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      price REAL NOT NULL DEFAULT 3799,
      original_price REAL DEFAULT 32500,
      discount_percentage INTEGER DEFAULT 88,
      duration_hours INTEGER DEFAULT 8,
      total_lectures INTEGER DEFAULT 36,
      badge TEXT DEFAULT 'PAKISTAN’S #1 UAE/KSA DROPSHIPPING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Modules Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      module_number TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );
  `);

  // 5. Lessons Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      video_type TEXT DEFAULT 'bunny',
      bunny_video_id TEXT,
      vdocipher_id TEXT,
      duration TEXT DEFAULT '15:00',
      attachment_path TEXT,
      offline_zip_url TEXT,
      notes TEXT,
      sort_order INTEGER DEFAULT 0,
      is_preview INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    );
  `);

  addColumnIfNotExists('lessons', 'video_type', "TEXT DEFAULT 'bunny'");
  addColumnIfNotExists('lessons', 'vdocipher_id', 'TEXT');
  addColumnIfNotExists('lessons', 'notes', 'TEXT');

  // 6. User Learning Progress Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id INTEGER NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );
  `);

  // 7. Enrollment Requests Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS enrollment_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enrollment_id TEXT UNIQUE NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      hear_source TEXT,
      course_id INTEGER DEFAULT 1,
      payment_method TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 3799,
      currency TEXT DEFAULT 'PKR',
      screenshot_path TEXT,
      transaction_id TEXT,
      status TEXT DEFAULT 'pending',
      admin_note TEXT,
      user_id INTEGER,
      reviewed_by TEXT,
      reviewed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
    );
  `);

  // 8. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      course_id INTEGER,
      enrollment_request_id INTEGER,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'PKR',
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
      FOREIGN KEY (enrollment_request_id) REFERENCES enrollment_requests(id) ON DELETE SET NULL
    );
  `);

  // 9. Store Products / Inventory Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock_level INTEGER DEFAULT 100,
      stock_status TEXT DEFAULT 'In Stock',
      image_url TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Settings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // 11. Testimonials Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'Student',
      city TEXT DEFAULT 'Karachi',
      earning_text TEXT,
      video_url TEXT,
      screenshot_url TEXT,
      rating INTEGER DEFAULT 5,
      comment TEXT NOT NULL,
      is_featured INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 12. Audit Logs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_email TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 13. Tracking Pixels Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tracking_pixels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      platform_name TEXT NOT NULL,
      pixel_id TEXT,
      custom_code TEXT,
      is_active INTEGER DEFAULT 1,
      placement TEXT DEFAULT 'head',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 14. CMS Sections Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cms_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content_json TEXT NOT NULL,
      is_visible INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 15. Reviews Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'Karachi',
      market TEXT NOT NULL DEFAULT 'UAE Market',
      sales_text TEXT NOT NULL,
      orders_text TEXT NOT NULL DEFAULT '24 Orders',
      quote TEXT NOT NULL,
      video_url TEXT,
      thumbnail_url TEXT,
      rating INTEGER DEFAULT 5,
      is_featured INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 16. Blogs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS site_blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      author TEXT DEFAULT 'Mentor Sami',
      image_url TEXT,
      tags TEXT DEFAULT 'E-Commerce, Dropshipping, UAE',
      is_published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 17. Payment Methods Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_methods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      method_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'bank',
      badge TEXT DEFAULT '',
      account_title TEXT DEFAULT '',
      account_number TEXT DEFAULT '',
      iban_or_wallet TEXT DEFAULT '',
      checkout_url TEXT DEFAULT '',
      instructions TEXT DEFAULT '',
      price_display TEXT DEFAULT 'PKR 3,799',
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  // 0. Seed Default Tracking Pixels if table empty
  try {
    const pixelCount = db.prepare('SELECT count(*) as count FROM tracking_pixels').get() as { count: number };
    if (!pixelCount || pixelCount.count === 0) {
      const insertPixel = db.prepare(`
        INSERT INTO tracking_pixels (platform_name, pixel_id, custom_code, is_active, placement)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertPixel.run('Meta Pixel', '1084920489382109', null, 1, 'head');
      insertPixel.run('TikTok Pixel', 'CTIKTOK992019482', null, 1, 'head');
      insertPixel.run('Google Analytics 4', 'G-SAMI2026ECOM', null, 1, 'head');
      insertPixel.run('Snapchat Pixel', 'SNAP-893012-TRK', null, 0, 'head');
    }
  } catch {}

  // 1. Seed Admin
  try {
    const adminCount = db.prepare('SELECT count(*) as count FROM admins').get() as { count: number };
    if (!adminCount || adminCount.count === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.prepare(`
        INSERT INTO admins (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `).run('Sami Admin', 'admin@samiecom.com', hashedPassword, 'admin');
    }
  } catch {}

  // 2. Seed Settings
  try {
    const defaultSettings: Record<string, string> = {
      store_name: 'Ecom With Sami',
      contact_email: 'support@ecomwithsami.com',
      contact_phone: '+92 333 0093269',
      display_phone: '+92 333 0093269',
      whatsapp_number: '923330093269',
      admin_whatsapp: '+92 333 0093269',
      whatsapp_group_link: 'https://chat.whatsapp.com/sami-mentorship-mastermind',
      whatsapp_default_message: 'Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,799). Can you help me?',
      support_hours: 'Mon–Sat, 9:00 AM – 5:00 PM PKT',
      head_office: 'Mehdi Tower, Shahrah-e-Faisal, Karachi, Pakistan',
      regional_office: 'Business Bay, Dubai (UAE) & Olaya District, Riyadh (KSA)',
      base_currency: 'PKR',
      timezone: 'Asia/Karachi',
      course_fee_pkr: '3799',
      course_fee_usd: '15',
      original_fee_pkr: '32500',
      seats_left: '12',
      announcement_text: '🔥 Ramadan Special: UAE & KSA Dropshipping Course 88% OFF - Enroll for PKR 3,799 Today!'
    };

    const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
    for (const [k, v] of Object.entries(defaultSettings)) {
      insertSetting.run(k, v);
    }
  } catch {}
}
