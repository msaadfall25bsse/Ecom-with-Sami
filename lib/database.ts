import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from './supabase';
import { defaultCmsContent, CmsContentSchema } from '@/utils/cmsStore';
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
} from '@/utils/db';

let sqliteDbInstance: any = null;

// Determine SQLite database path safely
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

// Initialize SQLite database instance as local fallback
function getSqliteDatabase() {
  if (sqliteDbInstance) return sqliteDbInstance;

  try {
    const { DatabaseSync } = require('node:sqlite');
    const dbFilePath = getDbPath();
    sqliteDbInstance = new DatabaseSync(dbFilePath);

    sqliteDbInstance.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS cms_settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS lms_modules (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        duration TEXT,
        description TEXT,
        lessons_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

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

    // Seed local SQLite tables if empty
    const cmsCheck = sqliteDbInstance.prepare("SELECT count(*) as count FROM cms_settings WHERE key = 'main_cms'").get();
    if (!cmsCheck || cmsCheck.count === 0) {
      sqliteDbInstance.prepare('INSERT INTO cms_settings (key, value_json, updated_at) VALUES (?, ?, ?)').run('main_cms', JSON.stringify(defaultCmsContent), new Date().toISOString());
    }

    return sqliteDbInstance;
  } catch (error) {
    return null;
  }
}

// In-Memory Global Cache
declare global {
  var __globalCmsCache: CmsContentSchema | undefined;
  var __globalModulesCache: Module[] | undefined;
  var __globalSuppliersCache: Supplier[] | undefined;
  var __globalStudentsCache: Student[] | undefined;
  var __globalEnrollmentsCache: Enrollment[] | undefined;
}

// -----------------------------------------------------------------------------
// 1. CMS SETTINGS (SUPABASE + SQLITE DUAL SYNC)
// -----------------------------------------------------------------------------
export async function dbGetCmsSettings(): Promise<CmsContentSchema> {
  // 1. Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('cms_settings')
        .select('value_json')
        .eq('key', 'main_cms')
        .maybeSingle();

      if (!error && data && data.value_json) {
        const parsed = typeof data.value_json === 'string' ? JSON.parse(data.value_json) : data.value_json;
        global.__globalCmsCache = parsed;
        return parsed;
      }
    } catch (e) {
      console.warn('Supabase get CMS error, falling back:', e);
    }
  }

  // 2. Try SQLite
  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      const row = sqlite.prepare("SELECT value_json FROM cms_settings WHERE key = 'main_cms'").get();
      if (row && row.value_json) {
        const parsed = JSON.parse(row.value_json);
        global.__globalCmsCache = parsed;
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Fallback to cache or default
  return global.__globalCmsCache || defaultCmsContent;
}

export async function dbSaveCmsSettings(patch: Partial<CmsContentSchema>): Promise<CmsContentSchema> {
  const existing = await dbGetCmsSettings();
  const updated: CmsContentSchema = {
    ...existing,
    ...patch
  };

  global.__globalCmsCache = updated;

  // 1. Save to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('cms_settings')
        .upsert({
          key: 'main_cms',
          value_json: JSON.stringify(updated),
          updated_at: new Date().toISOString()
        });
    } catch (e) {
      console.warn('Supabase save CMS error:', e);
    }
  }

  // 2. Save to SQLite
  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      sqlite.prepare(`
        INSERT INTO cms_settings (key, value_json, updated_at) 
        VALUES ('main_cms', ?, ?)
        ON CONFLICT(key) DO UPDATE SET 
          value_json = excluded.value_json,
          updated_at = excluded.updated_at
      `).run(JSON.stringify(updated), new Date().toISOString());
    }
  } catch (e) {}

  return updated;
}

// -----------------------------------------------------------------------------
// 2. LMS MODULES & LECTURES (SUPABASE + SQLITE)
// -----------------------------------------------------------------------------
export async function dbGetModules(): Promise<Module[]> {
  // 1. Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('lms_modules')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        const modules: Module[] = data.map((r: any) => ({
          id: Number(r.id),
          title: r.title,
          duration: r.duration,
          description: r.description,
          lessons: typeof r.lessons_json === 'string' ? JSON.parse(r.lessons_json || '[]') : (r.lessons_json || [])
        }));
        global.__globalModulesCache = modules;
        return modules;
      }
    } catch (e) {}
  }

  // 2. Try SQLite
  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      const rows = sqlite.prepare('SELECT id, title, duration, description, lessons_json FROM lms_modules ORDER BY id ASC').all();
      if (rows && rows.length > 0) {
        const modules = rows.map((r: any) => ({
          id: r.id,
          title: r.title,
          duration: r.duration,
          description: r.description,
          lessons: JSON.parse(r.lessons_json || '[]')
        }));
        global.__globalModulesCache = modules;
        return modules;
      }
    }
  } catch (e) {}

  return global.__globalModulesCache || initialModules;
}

export async function dbAddModule(module: Module): Promise<Module> {
  const current = await dbGetModules();
  const nextModules = [...current, module];
  global.__globalModulesCache = nextModules;

  // Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('lms_modules').upsert({
        id: module.id,
        title: module.title,
        duration: module.duration,
        description: module.description,
        lessons_json: JSON.stringify(module.lessons || []),
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
  }

  // SQLite
  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      sqlite.prepare('INSERT INTO lms_modules (id, title, duration, description, lessons_json, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
        .run(module.id, module.title, module.duration, module.description, JSON.stringify(module.lessons || []), new Date().toISOString());
    }
  } catch (e) {}

  return module;
}

export async function dbUpdateModule(id: number, patch: Partial<Module>): Promise<Module | null> {
  const modules = await dbGetModules();
  const idx = modules.findIndex(m => m.id === id);
  if (idx === -1) return null;

  const updated = { ...modules[idx], ...patch };
  modules[idx] = updated;
  global.__globalModulesCache = modules;

  // Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('lms_modules').update({
        title: updated.title,
        duration: updated.duration,
        description: updated.description,
        lessons_json: JSON.stringify(updated.lessons || []),
        updated_at: new Date().toISOString()
      }).eq('id', id);
    } catch (e) {}
  }

  // SQLite
  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      sqlite.prepare('UPDATE lms_modules SET title = ?, duration = ?, description = ?, lessons_json = ?, updated_at = ? WHERE id = ?')
        .run(updated.title, updated.duration, updated.description, JSON.stringify(updated.lessons || []), new Date().toISOString(), id);
    }
  } catch (e) {}

  return updated;
}

export async function dbDeleteModule(id: number): Promise<boolean> {
  const modules = await dbGetModules();
  const filtered = modules.filter(m => m.id !== id);
  global.__globalModulesCache = filtered;

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('lms_modules').delete().eq('id', id);
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) sqlite.prepare('DELETE FROM lms_modules WHERE id = ?').run(id);
  } catch (e) {}

  return true;
}

export async function dbAddLesson(moduleId: number, lesson: Lesson): Promise<Lesson | null> {
  const modules = await dbGetModules();
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return null;

  mod.lessons = mod.lessons || [];
  mod.lessons.push(lesson);
  await dbUpdateModule(moduleId, { lessons: mod.lessons });
  return lesson;
}

export async function dbUpdateLesson(moduleId: number, lessonId: string, patch: Partial<Lesson>): Promise<Lesson | null> {
  const modules = await dbGetModules();
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return null;

  const lIdx = mod.lessons.findIndex(l => l.id === lessonId);
  if (lIdx === -1) return null;

  mod.lessons[lIdx] = { ...mod.lessons[lIdx], ...patch };
  await dbUpdateModule(moduleId, { lessons: mod.lessons });
  return mod.lessons[lIdx];
}

export async function dbDeleteLesson(moduleId: number, lessonId: string): Promise<boolean> {
  const modules = await dbGetModules();
  const mod = modules.find(m => m.id === moduleId);
  if (!mod) return false;

  mod.lessons = mod.lessons.filter(l => l.id !== lessonId);
  await dbUpdateModule(moduleId, { lessons: mod.lessons });
  return true;
}

// -----------------------------------------------------------------------------
// 3. SUPPLIERS (SUPABASE + SQLITE)
// -----------------------------------------------------------------------------
export async function dbGetSuppliers(): Promise<Supplier[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('lms_suppliers').select('*').order('updated_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const suppliers: Supplier[] = data.map((r: any) => ({
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
        global.__globalSuppliersCache = suppliers;
        return suppliers;
      }
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      const rows = sqlite.prepare('SELECT * FROM lms_suppliers ORDER BY updated_at DESC').all();
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
    }
  } catch (e) {}

  return global.__globalSuppliersCache || initialSuppliers;
}

export async function dbAddSupplier(supplier: Supplier): Promise<Supplier> {
  const current = await dbGetSuppliers();
  global.__globalSuppliersCache = [supplier, ...current];

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('lms_suppliers').upsert({
        id: supplier.id,
        name: supplier.name,
        category: supplier.category,
        country: supplier.country,
        city: supplier.city,
        phone: supplier.phone,
        whatsapp_link: supplier.whatsappLink,
        min_order: supplier.minOrder,
        delivery_time: supplier.deliveryTime,
        cod_supported: supplier.codSupported,
        notes: supplier.notes,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      sqlite.prepare('INSERT INTO lms_suppliers (id, name, category, country, city, phone, whatsapp_link, min_order, delivery_time, cod_supported, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(supplier.id, supplier.name, supplier.category, supplier.country, supplier.city, supplier.phone, supplier.whatsappLink, supplier.minOrder, supplier.deliveryTime, supplier.codSupported ? 1 : 0, supplier.notes, new Date().toISOString());
    }
  } catch (e) {}

  return supplier;
}

export async function dbDeleteSupplier(id: string): Promise<boolean> {
  const current = await dbGetSuppliers();
  global.__globalSuppliersCache = current.filter(s => s.id !== id);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('lms_suppliers').delete().eq('id', id);
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) sqlite.prepare('DELETE FROM lms_suppliers WHERE id = ?').run(id);
  } catch (e) {}

  return true;
}

// -----------------------------------------------------------------------------
// 4. STUDENTS (SUPABASE + SQLITE)
// -----------------------------------------------------------------------------
export async function dbGetStudents(): Promise<Student[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('students').select('*').order('enrolled_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          phone: r.phone,
          city: r.city,
          password: r.password,
          isActive: Boolean(r.is_active),
          enrolledAt: r.enrolled_at,
          completedLessons: typeof r.completed_lessons_json === 'string' ? JSON.parse(r.completed_lessons_json || '[]') : (r.completed_lessons_json || []),
          lastLogin: r.last_login
        }));
      }
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      const rows = sqlite.prepare('SELECT * FROM students ORDER BY enrolled_at DESC').all();
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
    }
  } catch (e) {}

  return global.__globalStudentsCache || initialStudents;
}

export async function dbGetStudentByEmail(email: string): Promise<Student | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('students').select('*').ilike('email', email).maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          password: data.password,
          isActive: Boolean(data.is_active),
          enrolledAt: data.enrolled_at,
          completedLessons: typeof data.completed_lessons_json === 'string' ? JSON.parse(data.completed_lessons_json || '[]') : (data.completed_lessons_json || []),
          lastLogin: data.last_login
        };
      }
    } catch (e) {}
  }

  const students = await dbGetStudents();
  return students.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function dbAddStudent(student: Student): Promise<Student> {
  const current = await dbGetStudents();
  global.__globalStudentsCache = [student, ...current.filter(s => s.id !== student.id)];

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('students').upsert({
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        city: student.city,
        password: student.password,
        is_active: student.isActive,
        enrolled_at: student.enrolledAt,
        completed_lessons_json: JSON.stringify(student.completedLessons || []),
        last_login: student.lastLogin || null
      });
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      sqlite.prepare(`
        INSERT INTO students (id, name, email, phone, city, password, is_active, enrolled_at, completed_lessons_json, last_login)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          name = excluded.name,
          phone = excluded.phone,
          city = excluded.city,
          is_active = excluded.is_active
      `).run(student.id, student.name, student.email, student.phone, student.city, student.password, student.isActive ? 1 : 0, student.enrolledAt, JSON.stringify(student.completedLessons || []), student.lastLogin || null);
    }
  } catch (e) {}

  return student;
}

export async function dbUpdateStudent(id: string, patch: Partial<Student>): Promise<Student | null> {
  const students = await dbGetStudents();
  const idx = students.findIndex(s => s.id === id);
  if (idx === -1) return null;

  const updated: Student = { ...students[idx], ...patch };
  students[idx] = updated;
  global.__globalStudentsCache = students;

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('students').update({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        city: updated.city,
        password: updated.password,
        is_active: updated.isActive,
        completed_lessons_json: JSON.stringify(updated.completedLessons || []),
        last_login: updated.lastLogin || null
      }).eq('id', id);
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      sqlite.prepare('UPDATE students SET name = ?, email = ?, phone = ?, city = ?, password = ?, is_active = ?, completed_lessons_json = ?, last_login = ? WHERE id = ?')
        .run(updated.name, updated.email, updated.phone, updated.city, updated.password, updated.isActive ? 1 : 0, JSON.stringify(updated.completedLessons || []), updated.lastLogin || null, id);
    }
  } catch (e) {}

  return updated;
}

// -----------------------------------------------------------------------------
// 5. ENROLLMENTS (SUPABASE + SQLITE)
// -----------------------------------------------------------------------------
export async function dbGetEnrollments(): Promise<Enrollment[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('enrollments').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
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
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      const rows = sqlite.prepare('SELECT * FROM enrollments ORDER BY created_at DESC').all();
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
    }
  } catch (e) {}

  return global.__globalEnrollmentsCache || initialEnrollments;
}

export async function dbAddEnrollment(enr: Enrollment): Promise<Enrollment> {
  const current = await dbGetEnrollments();
  global.__globalEnrollmentsCache = [enr, ...current];

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enrollments').insert({
        id: enr.id,
        tracking_code: enr.trackingCode,
        student_id: enr.studentId,
        name: enr.name,
        email: enr.email,
        phone: enr.phone,
        city: enr.city,
        payment_method: enr.paymentMethod,
        transaction_id: enr.transactionId,
        where_heard: enr.whereHeard || 'TikTok',
        receipt_url: enr.receiptUrl || '',
        amount: enr.amount,
        status: enr.status,
        created_at: enr.createdAt
      });
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      sqlite.prepare('INSERT INTO enrollments (id, tracking_code, student_id, name, email, phone, city, payment_method, transaction_id, where_heard, receipt_url, amount, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(enr.id, enr.trackingCode, enr.studentId, enr.name, enr.email, enr.phone, enr.city, enr.paymentMethod, enr.transactionId, enr.whereHeard || 'TikTok', enr.receiptUrl || '', enr.amount, enr.status, enr.createdAt);
    }
  } catch (e) {}

  return enr;
}

export async function dbUpdateEnrollmentStatus(id: string, status: 'approved' | 'rejected'): Promise<Enrollment | null> {
  const enrollments = await dbGetEnrollments();
  const enr = enrollments.find(e => e.id === id || e.trackingCode === id);
  if (!enr) return null;

  enr.status = status;
  global.__globalEnrollmentsCache = enrollments;

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enrollments').update({ status }).eq('id', enr.id);
    } catch (e) {}
  }

  try {
    const sqlite = getSqliteDatabase();
    if (sqlite) {
      sqlite.prepare('UPDATE enrollments SET status = ? WHERE id = ?').run(status, enr.id);
    }
  } catch (e) {}

  if (status === 'approved') {
    const existing = await dbGetStudentByEmail(enr.email);
    if (existing) {
      await dbUpdateStudent(existing.id, { isActive: true });
    } else {
      await dbAddStudent({
        id: enr.studentId || `std_${Date.now()}`,
        name: enr.name,
        email: enr.email,
        phone: enr.phone,
        city: enr.city,
        password: 'studentpass2026',
        isActive: true,
        enrolledAt: new Date().toISOString().split('T')[0],
        completedLessons: []
      });
    }
  }

  return enr;
}

// -----------------------------------------------------------------------------
// 6. RESOURCES & TICKETS
// -----------------------------------------------------------------------------
export async function dbGetResources(): Promise<ResourceItem[]> {
  return initialResources;
}

export async function dbGetTickets(): Promise<SupportTicket[]> {
  return initialTickets;
}

export async function dbAddTicket(ticket: SupportTicket): Promise<SupportTicket> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('support_tickets').insert({
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        phone: ticket.phone,
        topic: ticket.topic,
        message: ticket.message,
        status: ticket.status,
        created_at: ticket.createdAt
      });
    } catch (e) {}
  }
  return ticket;
}
