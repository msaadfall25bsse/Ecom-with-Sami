import fs from 'fs';
import path from 'path';
import { defaultCmsContent, CmsContentSchema } from '../utils/cmsStore';
import { 
  initialStudents, 
  initialEnrollments, 
  initialModules, 
  initialSuppliers, 
  initialResources, 
  initialTickets, 
  Student, 
  Enrollment, 
  Module, 
  Supplier, 
  ResourceItem, 
  SupportTicket,
  Lesson 
} from '../utils/db';

let dbInstance: any = null;

// Determine database path safely
function getDbPath(): string {
  const dbDir = path.join(process.cwd(), 'database');
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    return path.join(dbDir, 'ecom_sami.db');
  } catch (e) {
    const tmpDir = path.join('/tmp', 'ecom_sami');
    try {
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    } catch (err) {}
    return path.join(tmpDir, 'ecom_sami.db');
  }
}

// Initialize SQLite database instance
function getDatabase() {
  if (dbInstance) return dbInstance;

  try {
    const { DatabaseSync } = require('node:sqlite');
    const dbFilePath = getDbPath();
    dbInstance = new DatabaseSync(dbFilePath);

    // Enable WAL mode for high performance concurrent reads and writes
    dbInstance.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      -- 1. CMS Settings Table
      CREATE TABLE IF NOT EXISTS cms_settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      -- 2. LMS Modules Table
      CREATE TABLE IF NOT EXISTS lms_modules (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        duration TEXT,
        description TEXT,
        lessons_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      -- 3. Suppliers Table
      CREATE TABLE IF NOT EXISTS lms_suppliers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        country TEXT,
        city TEXT,
        phone TEXT,
        whatsapp_link TEXT,
        min_order TEXT,
        delivery_time TEXT,
        cod_supported INTEGER,
        notes TEXT,
        updated_at TEXT NOT NULL
      );

      -- 4. Students Table
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        city TEXT,
        password TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        enrolled_at TEXT,
        completed_lessons_json TEXT,
        last_login TEXT
      );

      -- 5. Enrollments Table
      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY,
        tracking_code TEXT UNIQUE NOT NULL,
        student_id TEXT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        city TEXT,
        payment_method TEXT,
        transaction_id TEXT,
        where_heard TEXT,
        receipt_url TEXT,
        amount TEXT,
        status TEXT DEFAULT 'pending',
        created_at TEXT NOT NULL
      );

      -- 6. Resources Table
      CREATE TABLE IF NOT EXISTS lms_resources (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        type TEXT,
        size TEXT,
        download_url TEXT,
        value TEXT,
        description TEXT,
        updated_at TEXT NOT NULL
      );

      -- 7. Support Tickets Table
      CREATE TABLE IF NOT EXISTS support_tickets (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        topic TEXT,
        message TEXT,
        status TEXT DEFAULT 'open',
        created_at TEXT NOT NULL
      );
    `);

    // Seed database on first creation if empty
    seedDatabaseIfEmpty(dbInstance);

    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error);
    return null;
  }
}

// Seed tables with initial verified data if fresh database
function seedDatabaseIfEmpty(db: any) {
  try {
    // 1. Seed CMS Settings
    const cmsCheck = db.prepare("SELECT count(*) as count FROM cms_settings WHERE key = 'main_cms'").get();
    if (!cmsCheck || cmsCheck.count === 0) {
      const stmt = db.prepare('INSERT INTO cms_settings (key, value_json, updated_at) VALUES (?, ?, ?)');
      stmt.run('main_cms', JSON.stringify(defaultCmsContent), new Date().toISOString());
    }

    // 2. Seed LMS Modules
    const modCheck = db.prepare('SELECT count(*) as count FROM lms_modules').get();
    if (!modCheck || modCheck.count === 0) {
      const stmt = db.prepare('INSERT INTO lms_modules (id, title, duration, description, lessons_json, updated_at) VALUES (?, ?, ?, ?, ?, ?)');
      for (const mod of initialModules) {
        stmt.run(mod.id, mod.title, mod.duration, mod.description, JSON.stringify(mod.lessons), new Date().toISOString());
      }
    }

    // 3. Seed Suppliers
    const supCheck = db.prepare('SELECT count(*) as count FROM lms_suppliers').get();
    if (!supCheck || supCheck.count === 0) {
      const stmt = db.prepare('INSERT INTO lms_suppliers (id, name, category, country, city, phone, whatsapp_link, min_order, delivery_time, cod_supported, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      for (const sup of initialSuppliers) {
        stmt.run(sup.id, sup.name, sup.category, sup.country, sup.city, sup.phone, sup.whatsappLink, sup.minOrder, sup.deliveryTime, sup.codSupported ? 1 : 0, sup.notes, new Date().toISOString());
      }
    }

    // 4. Seed Students
    const stdCheck = db.prepare('SELECT count(*) as count FROM students').get();
    if (!stdCheck || stdCheck.count === 0) {
      const stmt = db.prepare('INSERT INTO students (id, name, email, phone, city, password, is_active, enrolled_at, completed_lessons_json, last_login) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      for (const std of initialStudents) {
        stmt.run(std.id, std.name, std.email, std.phone, std.city, std.password, std.isActive ? 1 : 0, std.enrolledAt, JSON.stringify(std.completedLessons), std.lastLogin || null);
      }
    }

    // 5. Seed Enrollments
    const enrCheck = db.prepare('SELECT count(*) as count FROM enrollments').get();
    if (!enrCheck || enrCheck.count === 0) {
      const stmt = db.prepare('INSERT INTO enrollments (id, tracking_code, student_id, name, email, phone, city, payment_method, transaction_id, where_heard, receipt_url, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      for (const enr of initialEnrollments) {
        stmt.run(enr.id, enr.trackingCode, enr.studentId, enr.name, enr.email, enr.phone, enr.city, enr.paymentMethod, enr.transactionId, enr.whereHeard || 'TikTok', enr.receiptUrl || '', enr.amount, enr.status, enr.createdAt);
      }
    }

    // 6. Seed Resources
    const resCheck = db.prepare('SELECT count(*) as count FROM lms_resources').get();
    if (!resCheck || resCheck.count === 0) {
      const stmt = db.prepare('INSERT INTO lms_resources (id, title, type, size, download_url, value, description, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      for (const res of initialResources) {
        stmt.run(res.id, res.title, res.type, res.size, res.downloadUrl, res.value, res.description, new Date().toISOString());
      }
    }

    // 7. Seed Tickets
    const tktCheck = db.prepare('SELECT count(*) as count FROM support_tickets').get();
    if (!tktCheck || tktCheck.count === 0) {
      const stmt = db.prepare('INSERT INTO support_tickets (id, name, email, phone, topic, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      for (const tkt of initialTickets) {
        stmt.run(tkt.id, tkt.name, tkt.email, tkt.phone, tkt.topic, tkt.message, tkt.status, tkt.createdAt);
      }
    }
  } catch (e) {
    console.error('Error seeding SQLite database:', e);
  }
}

// -----------------------------------------------------------------------------
// PUBLIC DATABASE API METHODS (ACID Compliant, Fast & Permanent)
// -----------------------------------------------------------------------------

// --- CMS SETTINGS ---
export function dbGetCmsSettings(): CmsContentSchema {
  const db = getDatabase();
  if (!db) return defaultCmsContent;

  try {
    const row = db.prepare("SELECT value_json FROM cms_settings WHERE key = 'main_cms'").get();
    if (row && row.value_json) {
      return JSON.parse(row.value_json);
    }
  } catch (e) {
    console.error('SQLite dbGetCmsSettings error:', e);
  }
  return defaultCmsContent;
}

export function dbSaveCmsSettings(patch: Partial<CmsContentSchema>): CmsContentSchema {
  const db = getDatabase();
  const existing = dbGetCmsSettings();
  const updated: CmsContentSchema = {
    ...existing,
    ...patch
  };

  if (db) {
    try {
      const stmt = db.prepare(`
        INSERT INTO cms_settings (key, value_json, updated_at) 
        VALUES ('main_cms', ?, ?)
        ON CONFLICT(key) DO UPDATE SET 
          value_json = excluded.value_json,
          updated_at = excluded.updated_at
      `);
      stmt.run(JSON.stringify(updated), new Date().toISOString());
    } catch (e) {
      console.error('SQLite dbSaveCmsSettings error:', e);
    }
  }

  return updated;
}

// --- LMS MODULES ---
export function dbGetModules(): Module[] {
  const db = getDatabase();
  if (!db) return initialModules;

  try {
    const rows = db.prepare('SELECT id, title, duration, description, lessons_json FROM lms_modules ORDER BY id ASC').all();
    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        duration: r.duration,
        description: r.description,
        lessons: JSON.parse(r.lessons_json || '[]')
      }));
    }
  } catch (e) {
    console.error('SQLite dbGetModules error:', e);
  }
  return initialModules;
}

export function dbAddModule(module: Module): Module {
  const db = getDatabase();
  if (db) {
    try {
      const stmt = db.prepare('INSERT INTO lms_modules (id, title, duration, description, lessons_json, updated_at) VALUES (?, ?, ?, ?, ?, ?)');
      stmt.run(module.id, module.title, module.duration, module.description, JSON.stringify(module.lessons || []), new Date().toISOString());
    } catch (e) {
      console.error('SQLite dbAddModule error:', e);
    }
  }
  return module;
}

export function dbUpdateModule(id: number, patch: Partial<Module>): Module | null {
  const db = getDatabase();
  if (!db) return null;

  try {
    const existing = db.prepare('SELECT id, title, duration, description, lessons_json FROM lms_modules WHERE id = ?').get(id);
    if (!existing) return null;

    const currentLessons = JSON.parse(existing.lessons_json || '[]');
    const newTitle = patch.title !== undefined ? patch.title : existing.title;
    const newDuration = patch.duration !== undefined ? patch.duration : existing.duration;
    const newDesc = patch.description !== undefined ? patch.description : existing.description;
    const newLessons = patch.lessons !== undefined ? patch.lessons : currentLessons;

    const stmt = db.prepare('UPDATE lms_modules SET title = ?, duration = ?, description = ?, lessons_json = ?, updated_at = ? WHERE id = ?');
    stmt.run(newTitle, newDuration, newDesc, JSON.stringify(newLessons), new Date().toISOString(), id);

    return {
      id,
      title: newTitle,
      duration: newDuration,
      description: newDesc,
      lessons: newLessons
    };
  } catch (e) {
    console.error('SQLite dbUpdateModule error:', e);
    return null;
  }
}

export function dbDeleteModule(id: number): boolean {
  const db = getDatabase();
  if (!db) return false;

  try {
    const stmt = db.prepare('DELETE FROM lms_modules WHERE id = ?');
    stmt.run(id);
    return true;
  } catch (e) {
    console.error('SQLite dbDeleteModule error:', e);
    return false;
  }
}

export function dbAddLesson(moduleId: number, lesson: Lesson): Lesson | null {
  const db = getDatabase();
  if (!db) return null;

  try {
    const row = db.prepare('SELECT lessons_json FROM lms_modules WHERE id = ?').get(moduleId);
    if (!row) return null;

    const lessons: Lesson[] = JSON.parse(row.lessons_json || '[]');
    lessons.push(lesson);

    const stmt = db.prepare('UPDATE lms_modules SET lessons_json = ?, updated_at = ? WHERE id = ?');
    stmt.run(JSON.stringify(lessons), new Date().toISOString(), moduleId);
    return lesson;
  } catch (e) {
    console.error('SQLite dbAddLesson error:', e);
    return null;
  }
}

export function dbUpdateLesson(moduleId: number, lessonId: string, patch: Partial<Lesson>): Lesson | null {
  const db = getDatabase();
  if (!db) return null;

  try {
    const row = db.prepare('SELECT lessons_json FROM lms_modules WHERE id = ?').get(moduleId);
    if (!row) return null;

    const lessons: Lesson[] = JSON.parse(row.lessons_json || '[]');
    const idx = lessons.findIndex(l => l.id === lessonId);
    if (idx === -1) return null;

    lessons[idx] = { ...lessons[idx], ...patch };

    const stmt = db.prepare('UPDATE lms_modules SET lessons_json = ?, updated_at = ? WHERE id = ?');
    stmt.run(JSON.stringify(lessons), new Date().toISOString(), moduleId);
    return lessons[idx];
  } catch (e) {
    console.error('SQLite dbUpdateLesson error:', e);
    return null;
  }
}

export function dbDeleteLesson(moduleId: number, lessonId: string): boolean {
  const db = getDatabase();
  if (!db) return false;

  try {
    const row = db.prepare('SELECT lessons_json FROM lms_modules WHERE id = ?').get(moduleId);
    if (!row) return false;

    const lessons: Lesson[] = JSON.parse(row.lessons_json || '[]');
    const filtered = lessons.filter(l => l.id !== lessonId);

    const stmt = db.prepare('UPDATE lms_modules SET lessons_json = ?, updated_at = ? WHERE id = ?');
    stmt.run(JSON.stringify(filtered), new Date().toISOString(), moduleId);
    return true;
  } catch (e) {
    console.error('SQLite dbDeleteLesson error:', e);
    return false;
  }
}

// --- SUPPLIERS ---
export function dbGetSuppliers(): Supplier[] {
  const db = getDatabase();
  if (!db) return initialSuppliers;

  try {
    const rows = db.prepare('SELECT * FROM lms_suppliers ORDER BY updated_at DESC').all();
    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        country: r.country,
        city: r.city,
        phone: r.phone,
        whatsappLink: r.whatsapp_link,
        minOrder: r.min_order,
        deliveryTime: r.delivery_time,
        codSupported: Boolean(r.cod_supported),
        notes: r.notes
      }));
    }
  } catch (e) {
    console.error('SQLite dbGetSuppliers error:', e);
  }
  return initialSuppliers;
}

export function dbAddSupplier(supplier: Supplier): Supplier {
  const db = getDatabase();
  if (db) {
    try {
      const stmt = db.prepare('INSERT INTO lms_suppliers (id, name, category, country, city, phone, whatsapp_link, min_order, delivery_time, cod_supported, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      stmt.run(supplier.id, supplier.name, supplier.category, supplier.country, supplier.city, supplier.phone, supplier.whatsappLink, supplier.minOrder, supplier.deliveryTime, supplier.codSupported ? 1 : 0, supplier.notes, new Date().toISOString());
    } catch (e) {
      console.error('SQLite dbAddSupplier error:', e);
    }
  }
  return supplier;
}

export function dbDeleteSupplier(id: string): boolean {
  const db = getDatabase();
  if (!db) return false;

  try {
    const stmt = db.prepare('DELETE FROM lms_suppliers WHERE id = ?');
    stmt.run(id);
    return true;
  } catch (e) {
    console.error('SQLite dbDeleteSupplier error:', e);
    return false;
  }
}

// --- STUDENTS ---
export function dbGetStudents(): Student[] {
  const db = getDatabase();
  if (!db) return initialStudents;

  try {
    const rows = db.prepare('SELECT * FROM students ORDER BY enrolled_at DESC').all();
    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        city: r.city,
        password: r.password,
        isActive: Boolean(r.is_active),
        enrolledAt: r.enrolled_at,
        completedLessons: JSON.parse(r.completed_lessons_json || '[]'),
        lastLogin: r.last_login
      }));
    }
  } catch (e) {
    console.error('SQLite dbGetStudents error:', e);
  }
  return initialStudents;
}

export function dbGetStudentByEmail(email: string): Student | null {
  const db = getDatabase();
  if (!db) return initialStudents.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;

  try {
    const r = db.prepare('SELECT * FROM students WHERE LOWER(email) = LOWER(?)').get(email);
    if (r) {
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        city: r.city,
        password: r.password,
        isActive: Boolean(r.is_active),
        enrolledAt: r.enrolled_at,
        completedLessons: JSON.parse(r.completed_lessons_json || '[]'),
        lastLogin: r.last_login
      };
    }
  } catch (e) {
    console.error('SQLite dbGetStudentByEmail error:', e);
  }
  return null;
}

export function dbAddStudent(student: Student): Student {
  const db = getDatabase();
  if (db) {
    try {
      const stmt = db.prepare(`
        INSERT INTO students (id, name, email, phone, city, password, is_active, enrolled_at, completed_lessons_json, last_login)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          name = excluded.name,
          phone = excluded.phone,
          city = excluded.city,
          is_active = excluded.is_active
      `);
      stmt.run(
        student.id,
        student.name,
        student.email,
        student.phone,
        student.city,
        student.password,
        student.isActive ? 1 : 0,
        student.enrolledAt,
        JSON.stringify(student.completedLessons || []),
        student.lastLogin || null
      );
    } catch (e) {
      console.error('SQLite dbAddStudent error:', e);
    }
  }
  return student;
}

export function dbUpdateStudent(id: string, patch: Partial<Student>): Student | null {
  const db = getDatabase();
  if (!db) return null;

  try {
    const existing = db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    if (!existing) return null;

    const updatedStudent: Student = {
      id: existing.id,
      name: patch.name !== undefined ? patch.name : existing.name,
      email: patch.email !== undefined ? patch.email : existing.email,
      phone: patch.phone !== undefined ? patch.phone : existing.phone,
      city: patch.city !== undefined ? patch.city : existing.city,
      password: patch.password !== undefined ? patch.password : existing.password,
      isActive: patch.isActive !== undefined ? patch.isActive : Boolean(existing.is_active),
      enrolledAt: patch.enrolledAt !== undefined ? patch.enrolledAt : existing.enrolled_at,
      completedLessons: patch.completedLessons !== undefined ? patch.completedLessons : JSON.parse(existing.completed_lessons_json || '[]'),
      lastLogin: patch.lastLogin !== undefined ? patch.lastLogin : existing.last_login
    };

    const stmt = db.prepare(`
      UPDATE students SET 
        name = ?, email = ?, phone = ?, city = ?, password = ?, is_active = ?, completed_lessons_json = ?, last_login = ?
      WHERE id = ?
    `);
    stmt.run(
      updatedStudent.name,
      updatedStudent.email,
      updatedStudent.phone,
      updatedStudent.city,
      updatedStudent.password,
      updatedStudent.isActive ? 1 : 0,
      JSON.stringify(updatedStudent.completedLessons),
      updatedStudent.lastLogin || null,
      id
    );

    return updatedStudent;
  } catch (e) {
    console.error('SQLite dbUpdateStudent error:', e);
    return null;
  }
}

// --- ENROLLMENTS ---
export function dbGetEnrollments(): Enrollment[] {
  const db = getDatabase();
  if (!db) return initialEnrollments;

  try {
    const rows = db.prepare('SELECT * FROM enrollments ORDER BY created_at DESC').all();
    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        trackingCode: r.tracking_code,
        studentId: r.student_id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        city: r.city,
        paymentMethod: r.payment_method,
        transactionId: r.transaction_id,
        whereHeard: r.where_heard,
        receiptUrl: r.receipt_url,
        amount: r.amount,
        status: r.status,
        createdAt: r.created_at
      }));
    }
  } catch (e) {
    console.error('SQLite dbGetEnrollments error:', e);
  }
  return initialEnrollments;
}

export function dbAddEnrollment(enr: Enrollment): Enrollment {
  const db = getDatabase();
  if (db) {
    try {
      const stmt = db.prepare('INSERT INTO enrollments (id, tracking_code, student_id, name, email, phone, city, payment_method, transaction_id, where_heard, receipt_url, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      stmt.run(
        enr.id,
        enr.trackingCode,
        enr.studentId,
        enr.name,
        enr.email,
        enr.phone,
        enr.city,
        enr.paymentMethod,
        enr.transactionId,
        enr.whereHeard || 'TikTok',
        enr.receiptUrl || '',
        enr.amount,
        enr.status,
        enr.createdAt
      );
    } catch (e) {
      console.error('SQLite dbAddEnrollment error:', e);
    }
  }
  return enr;
}

export function dbUpdateEnrollmentStatus(id: string, status: 'approved' | 'rejected'): Enrollment | null {
  const db = getDatabase();
  if (!db) return null;

  try {
    const row = db.prepare('SELECT * FROM enrollments WHERE id = ? OR tracking_code = ?').get(id, id);
    if (!row) return null;

    const stmt = db.prepare('UPDATE enrollments SET status = ? WHERE id = ?');
    stmt.run(status, row.id);

    // If approved, auto-activate or create student
    if (status === 'approved') {
      const existingStudent = dbGetStudentByEmail(row.email);
      if (existingStudent) {
        dbUpdateStudent(existingStudent.id, { isActive: true });
      } else {
        dbAddStudent({
          id: row.student_id || `std_${Date.now()}`,
          name: row.name,
          email: row.email,
          phone: row.phone,
          city: row.city,
          password: 'studentpass2026',
          isActive: true,
          enrolledAt: new Date().toISOString().split('T')[0],
          completedLessons: []
        });
      }
    }

    return {
      id: row.id,
      trackingCode: row.tracking_code,
      studentId: row.student_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      city: row.city,
      paymentMethod: row.payment_method,
      transactionId: row.transaction_id,
      whereHeard: row.where_heard,
      receiptUrl: row.receipt_url,
      amount: row.amount,
      status,
      createdAt: row.created_at
    };
  } catch (e) {
    console.error('SQLite dbUpdateEnrollmentStatus error:', e);
    return null;
  }
}

// --- RESOURCES ---
export function dbGetResources(): ResourceItem[] {
  const db = getDatabase();
  if (!db) return initialResources;

  try {
    const rows = db.prepare('SELECT * FROM lms_resources ORDER BY updated_at DESC').all();
    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        size: r.size,
        downloadUrl: r.download_url,
        value: r.value,
        description: r.description
      }));
    }
  } catch (e) {
    console.error('SQLite dbGetResources error:', e);
  }
  return initialResources;
}

// --- SUPPORT TICKETS ---
export function dbGetTickets(): SupportTicket[] {
  const db = getDatabase();
  if (!db) return initialTickets;

  try {
    const rows = db.prepare('SELECT * FROM support_tickets ORDER BY created_at DESC').all();
    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        topic: r.topic,
        message: r.message,
        status: r.status,
        createdAt: r.created_at
      }));
    }
  } catch (e) {
    console.error('SQLite dbGetTickets error:', e);
  }
  return initialTickets;
}

export function dbAddTicket(ticket: SupportTicket): SupportTicket {
  const db = getDatabase();
  if (db) {
    try {
      const stmt = db.prepare('INSERT INTO support_tickets (id, name, email, phone, topic, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
      stmt.run(ticket.id, ticket.name, ticket.email, ticket.phone, ticket.topic, ticket.message, ticket.status, ticket.createdAt);
    } catch (e) {
      console.error('SQLite dbAddTicket error:', e);
    }
  }
  return ticket;
}
