import { supabase } from './supabase';
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

// In-Memory Fast Cache
declare global {
  var __globalCmsCache: CmsContentSchema | undefined;
  var __globalModulesCache: Module[] | undefined;
  var __globalSuppliersCache: Supplier[] | undefined;
}

// -----------------------------------------------------------------------------
// 1. CMS SETTINGS (100% PURE SUPABASE)
// -----------------------------------------------------------------------------
export async function dbGetCmsSettings(): Promise<CmsContentSchema> {
  if (supabase) {
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
      console.error('Supabase get CMS error:', e);
    }
  }

  return global.__globalCmsCache || defaultCmsContent;
}

export async function dbSaveCmsSettings(patch: Partial<CmsContentSchema>): Promise<CmsContentSchema> {
  const existing = await dbGetCmsSettings();
  const updated: CmsContentSchema = {
    ...existing,
    ...patch
  };

  global.__globalCmsCache = updated;

  if (supabase) {
    try {
      const { error } = await supabase
        .from('cms_settings')
        .upsert({
          key: 'main_cms',
          value_json: JSON.stringify(updated),
          updated_at: new Date().toISOString()
        });
      if (error) console.error('Supabase CMS upsert error:', error);
    } catch (e) {
      console.error('Supabase save CMS error:', e);
    }
  }

  return updated;
}

// -----------------------------------------------------------------------------
// 2. LMS MODULES & LECTURES (100% PURE SUPABASE)
// -----------------------------------------------------------------------------
export async function dbGetModules(): Promise<Module[]> {
  if (supabase) {
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
    } catch (e) {
      console.error('Supabase get modules error:', e);
    }
  }

  return global.__globalModulesCache || initialModules;
}

export async function dbAddModule(module: Module): Promise<Module> {
  const current = await dbGetModules();
  const nextModules = [...current, module];
  global.__globalModulesCache = nextModules;

  if (supabase) {
    try {
      await supabase.from('lms_modules').upsert({
        id: module.id,
        title: module.title,
        duration: module.duration,
        description: module.description,
        lessons_json: JSON.stringify(module.lessons || []),
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Supabase add module error:', e);
    }
  }

  return module;
}

export async function dbUpdateModule(id: number, patch: Partial<Module>): Promise<Module | null> {
  const modules = await dbGetModules();
  const idx = modules.findIndex(m => m.id === id);
  if (idx === -1) return null;

  const updated = { ...modules[idx], ...patch };
  modules[idx] = updated;
  global.__globalModulesCache = modules;

  if (supabase) {
    try {
      await supabase.from('lms_modules').update({
        title: updated.title,
        duration: updated.duration,
        description: updated.description,
        lessons_json: JSON.stringify(updated.lessons || []),
        updated_at: new Date().toISOString()
      }).eq('id', id);
    } catch (e) {
      console.error('Supabase update module error:', e);
    }
  }

  return updated;
}

export async function dbDeleteModule(id: number): Promise<boolean> {
  const modules = await dbGetModules();
  const filtered = modules.filter(m => m.id !== id);
  global.__globalModulesCache = filtered;

  if (supabase) {
    try {
      await supabase.from('lms_modules').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase delete module error:', e);
    }
  }

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
// 3. WHOLESALE SUPPLIERS (100% PURE SUPABASE)
// -----------------------------------------------------------------------------
export async function dbGetSuppliers(): Promise<Supplier[]> {
  if (supabase) {
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
    } catch (e) {
      console.error('Supabase get suppliers error:', e);
    }
  }

  return global.__globalSuppliersCache || initialSuppliers;
}

export async function dbAddSupplier(supplier: Supplier): Promise<Supplier> {
  const current = await dbGetSuppliers();
  global.__globalSuppliersCache = [supplier, ...current];

  if (supabase) {
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
    } catch (e) {
      console.error('Supabase add supplier error:', e);
    }
  }

  return supplier;
}

export async function dbDeleteSupplier(id: string): Promise<boolean> {
  const current = await dbGetSuppliers();
  global.__globalSuppliersCache = current.filter(s => s.id !== id);

  if (supabase) {
    try {
      await supabase.from('lms_suppliers').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase delete supplier error:', e);
    }
  }

  return true;
}

// -----------------------------------------------------------------------------
// 4. STUDENTS (100% PURE SUPABASE)
// -----------------------------------------------------------------------------
export async function dbGetStudents(): Promise<Student[]> {
  if (supabase) {
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
    } catch (e) {
      console.error('Supabase get students error:', e);
    }
  }

  return initialStudents;
}

export async function dbGetStudentByEmail(email: string): Promise<Student | null> {
  if (supabase) {
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
    } catch (e) {
      console.error('Supabase get student by email error:', e);
    }
  }

  const students = await dbGetStudents();
  return students.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function dbAddStudent(student: Student): Promise<Student> {
  if (supabase) {
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
    } catch (e) {
      console.error('Supabase add student error:', e);
    }
  }

  return student;
}

export async function dbUpdateStudent(id: string, patch: Partial<Student>): Promise<Student | null> {
  const students = await dbGetStudents();
  const target = students.find(s => s.id === id);
  if (!target) return null;

  const updated: Student = { ...target, ...patch };

  if (supabase) {
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
    } catch (e) {
      console.error('Supabase update student error:', e);
    }
  }

  return updated;
}

// -----------------------------------------------------------------------------
// 5. ENROLLMENTS (100% PURE SUPABASE)
// -----------------------------------------------------------------------------
export async function dbGetEnrollments(): Promise<Enrollment[]> {
  if (supabase) {
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
    } catch (e) {
      console.error('Supabase get enrollments error:', e);
    }
  }

  return initialEnrollments;
}

export async function dbAddEnrollment(enr: Enrollment): Promise<Enrollment> {
  if (supabase) {
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
    } catch (e) {
      console.error('Supabase add enrollment error:', e);
    }
  }

  return enr;
}

export async function dbUpdateEnrollmentStatus(id: string, status: 'approved' | 'rejected'): Promise<Enrollment | null> {
  const enrollments = await dbGetEnrollments();
  const enr = enrollments.find(e => e.id === id || e.trackingCode === id);
  if (!enr) return null;

  enr.status = status;

  if (supabase) {
    try {
      await supabase.from('enrollments').update({ status }).eq('id', enr.id);
    } catch (e) {
      console.error('Supabase update enrollment status error:', e);
    }
  }

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
  if (supabase) {
    try {
      const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
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
    } catch (e) {}
  }
  return initialTickets;
}

export async function dbAddTicket(ticket: SupportTicket): Promise<SupportTicket> {
  if (supabase) {
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
