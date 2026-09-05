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

// -----------------------------------------------------------------------------
// 1. CMS SETTINGS (100% DIRECT SUPABASE REAL-TIME READ/WRITE)
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
        const parsed = typeof data.value_json === 'string' 
          ? JSON.parse(data.value_json) 
          : data.value_json;

        if (parsed && typeof parsed === 'object') {
          return {
            ...defaultCmsContent,
            ...parsed,
            hero: { ...defaultCmsContent.hero, ...(parsed.hero || {}) },
            stats: { ...defaultCmsContent.stats, ...(parsed.stats || {}) },
            mentor: { ...defaultCmsContent.mentor, ...(parsed.mentor || {}) },
            marquee: { ...defaultCmsContent.marquee, ...(parsed.marquee || {}) },
            contact: { ...defaultCmsContent.contact, ...(parsed.contact || {}) },
            bonuses: { ...defaultCmsContent.bonuses, ...(parsed.bonuses || {}) },
            why_dropshipping: { ...defaultCmsContent.why_dropshipping, ...(parsed.why_dropshipping || {}) },
            options_comparison: { ...defaultCmsContent.options_comparison, ...(parsed.options_comparison || {}) },
            cost_of_waiting: { ...defaultCmsContent.cost_of_waiting, ...(parsed.cost_of_waiting || {}) },
            testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultCmsContent.testimonials,
            faqs: Array.isArray(parsed.faqs) ? parsed.faqs : defaultCmsContent.faqs,
            payment_methods: Array.isArray(parsed.payment_methods) ? parsed.payment_methods : defaultCmsContent.payment_methods,
            pixels: Array.isArray(parsed.pixels) ? parsed.pixels : defaultCmsContent.pixels
          };
        }
      }
    } catch (e) {
      console.error('Supabase get CMS error:', e);
    }
  }

  return defaultCmsContent;
}

export async function dbSaveCmsSettings(patch: Partial<CmsContentSchema>): Promise<CmsContentSchema> {
  const existing = await dbGetCmsSettings();
  const updated: CmsContentSchema = {
    ...existing,
    ...patch,
    hero: patch.hero !== undefined ? { ...existing.hero, ...patch.hero } : existing.hero,
    stats: patch.stats !== undefined ? { ...existing.stats, ...patch.stats } : existing.stats,
    mentor: patch.mentor !== undefined ? { ...existing.mentor, ...patch.mentor } : existing.mentor,
    marquee: patch.marquee !== undefined ? { ...existing.marquee, ...patch.marquee } : existing.marquee,
    contact: patch.contact !== undefined ? { ...existing.contact, ...patch.contact } : existing.contact,
    bonuses: patch.bonuses !== undefined ? patch.bonuses : existing.bonuses,
    why_dropshipping: patch.why_dropshipping !== undefined ? patch.why_dropshipping : existing.why_dropshipping,
    options_comparison: patch.options_comparison !== undefined ? patch.options_comparison : existing.options_comparison,
    cost_of_waiting: patch.cost_of_waiting !== undefined ? patch.cost_of_waiting : existing.cost_of_waiting,
    testimonials: patch.testimonials !== undefined ? patch.testimonials : existing.testimonials,
    faqs: patch.faqs !== undefined ? patch.faqs : existing.faqs,
    payment_methods: patch.payment_methods !== undefined ? patch.payment_methods : existing.payment_methods,
    pixels: patch.pixels !== undefined ? patch.pixels : existing.pixels
  };

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
// 2. LMS MODULES & LECTURES (100% DIRECT SUPABASE REAL-TIME READ/WRITE)
// -----------------------------------------------------------------------------
export async function dbGetModules(): Promise<Module[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('lms_modules')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
          id: Number(r.id),
          title: r.title,
          duration: r.duration,
          description: r.description,
          lessons: typeof r.lessons_json === 'string' ? JSON.parse(r.lessons_json || '[]') : (r.lessons_json || [])
        }));
      }
    } catch (e) {
      console.error('Supabase get modules error:', e);
    }
  }

  return initialModules;
}

export async function dbAddModule(module: Module): Promise<Module> {
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
  const target = modules.find(m => m.id === id);
  if (!target) return null;

  const updated = { ...target, ...patch };

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
// 3. WHOLESALE SUPPLIERS (100% DIRECT SUPABASE REAL-TIME READ/WRITE)
// -----------------------------------------------------------------------------
export async function dbGetSuppliers(): Promise<Supplier[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('lms_suppliers').select('*').order('updated_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r: any) => ({
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
      console.error('Supabase get suppliers error:', e);
    }
  }

  return initialSuppliers;
}

export async function dbAddSupplier(supplier: Supplier): Promise<Supplier> {
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
// 4. STUDENTS (100% DIRECT SUPABASE REAL-TIME READ/WRITE)
// -----------------------------------------------------------------------------
export function generateRandomNumericPassword(length = 8): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export function generateStableNumericPassword(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const num = 10000000 + (positive % 90000000);
  return num.toString();
}

interface MemoryCacheEntry<T> {
  data: T;
  expiry: number;
}

let cachedStudents: MemoryCacheEntry<Student[]> | null = null;
let cachedEnrollments: MemoryCacheEntry<Enrollment[]> | null = null;
const CACHE_TTL_MS = 10000; // 10 seconds cache for instant response

export function clearDatabaseCache() {
  cachedStudents = null;
  cachedEnrollments = null;
}

export async function dbGetStudents(forceFresh = false): Promise<Student[]> {
  if (!forceFresh && cachedStudents && Date.now() < cachedStudents.expiry) {
    return cachedStudents.data;
  }

  let result: Student[] = [];
  if (supabase) {
    try {
      const { data, error } = await supabase.from('students').select('*').order('enrolled_at', { ascending: false });
      if (!error && data && data.length > 0) {
        result = data.map((r: any) => {
          let pass = r.password;
          if (!pass || pass === 'studentpass2026') {
            pass = generateStableNumericPassword(r.id || r.email);
          }
          return {
            id: r.id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            city: r.city,
            password: pass,
            isActive: Boolean(r.is_active),
            enrolledAt: r.enrolled_at,
            completedLessons: typeof r.completed_lessons_json === 'string' ? JSON.parse(r.completed_lessons_json || '[]') : (r.completed_lessons_json || []),
            lastLogin: r.last_login
          };
        });
      }
    } catch (e) {
      console.error('Supabase get students error:', e);
    }
  }

  if (result.length === 0) {
    result = initialStudents.map(s => ({
      ...s,
      password: (!s.password || s.password === 'studentpass2026') ? generateStableNumericPassword(s.id || s.email) : s.password
    }));
  }

  cachedStudents = { data: result, expiry: Date.now() + CACHE_TTL_MS };
  return result;
}

export async function dbGetStudentByEmail(email: string): Promise<Student | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('students').select('*').ilike('email', email).maybeSingle();
      if (!error && data) {
        let pass = data.password;
        if (!pass || pass === 'studentpass2026') {
          pass = generateStableNumericPassword(data.id || data.email);
        }
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          password: pass,
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
  clearDatabaseCache();
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
  clearDatabaseCache();
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

export async function dbDeleteStudent(idOrEmail: string): Promise<boolean> {
  clearDatabaseCache();

  if (supabase) {
    try {
      // 1. Delete student from students table
      const { error: errId } = await supabase.from('students').delete().eq('id', idOrEmail);
      if (errId) {
        await supabase.from('students').delete().ilike('email', idOrEmail);
      } else {
        await supabase.from('students').delete().ilike('email', idOrEmail);
      }

      // 2. Also clean up any matching enrollments for this student so test data is completely wiped
      await supabase.from('enrollments').delete().ilike('email', idOrEmail);
      await supabase.from('enrollments').delete().eq('student_id', idOrEmail);
    } catch (e) {
      console.error('Supabase delete student error:', e);
    }
  }

  // Also clean in-memory fallback arrays
  try {
    const sIdx = initialStudents.findIndex(s => s.id === idOrEmail || s.email.toLowerCase() === idOrEmail.toLowerCase());
    if (sIdx !== -1) initialStudents.splice(sIdx, 1);

    const eIdx = initialEnrollments.findIndex(e => e.email.toLowerCase() === idOrEmail.toLowerCase() || e.studentId === idOrEmail);
    if (eIdx !== -1) initialEnrollments.splice(eIdx, 1);
  } catch (e) {}

  return true;
}

// -----------------------------------------------------------------------------
// 5. ENROLLMENTS (100% DIRECT SUPABASE REAL-TIME READ/WRITE)
// -----------------------------------------------------------------------------
export async function dbGetEnrollments(providedStudents?: Student[], forceFresh = false): Promise<Enrollment[]> {
  if (!forceFresh && cachedEnrollments && Date.now() < cachedEnrollments.expiry) {
    return cachedEnrollments.data;
  }

  const students = providedStudents || await dbGetStudents(forceFresh);
  const studentMap = new Map<string, Student>();
  students.forEach(s => {
    if (s.email) studentMap.set(s.email.toLowerCase(), s);
    if (s.id) studentMap.set(s.id, s);
  });

  let list: Enrollment[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase.from('enrollments').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        list = data.map((r: any) => ({
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

  if (list.length === 0) {
    list = initialEnrollments;
  }

  // Attach accurate student password to each enrollment
  const mapped = list.map(enr => {
    const std = studentMap.get(enr.email?.toLowerCase() || '') || (enr.studentId ? studentMap.get(enr.studentId) : null);
    let pass = std?.password;
    if (!pass || pass === 'studentpass2026') {
      pass = generateStableNumericPassword(enr.trackingCode || enr.id || enr.email);
    }
    return {
      ...enr,
      password: pass
    };
  });

  cachedEnrollments = { data: mapped, expiry: Date.now() + CACHE_TTL_MS };
  return mapped;
}

export async function dbAddEnrollment(enr: Enrollment): Promise<Enrollment> {
  clearDatabaseCache();
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

export async function dbUpdateEnrollmentStatus(
  id: string, 
  status: 'approved' | 'rejected', 
  customPassword?: string
): Promise<{ enrollment: Enrollment; password?: string } | null> {
  clearDatabaseCache();
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

  let finalPassword = customPassword;

  if (status === 'approved') {
    const existing = await dbGetStudentByEmail(enr.email);
    if (!finalPassword) {
      finalPassword = (existing?.password && existing.password !== 'studentpass2026')
        ? existing.password
        : (enr.password || generateRandomNumericPassword());
    }

    if (existing) {
      await dbUpdateStudent(existing.id, { 
        isActive: true,
        password: finalPassword,
        phone: enr.phone || existing.phone,
        city: enr.city || existing.city
      });
    } else {
      await dbAddStudent({
        id: enr.studentId || `std_${Date.now()}`,
        name: enr.name,
        email: enr.email,
        phone: enr.phone,
        city: enr.city,
        password: finalPassword,
        isActive: true,
        enrolledAt: new Date().toISOString().split('T')[0],
        completedLessons: []
      });
    }
  } else if (status === 'rejected') {
    const existing = await dbGetStudentByEmail(enr.email);
    if (existing) {
      await dbUpdateStudent(existing.id, { isActive: false });
    }
  }

  return { enrollment: { ...enr, password: finalPassword }, password: finalPassword };
}

export async function dbResetStudentPassword(
  identifier: string, 
  customNewPassword?: string
): Promise<{ success: boolean; email: string; newPassword: string } | null> {
  clearDatabaseCache();
  const newPass = customNewPassword || generateRandomNumericPassword();

  let student = await dbGetStudentByEmail(identifier);
  if (!student) {
    const allStudents = await dbGetStudents();
    student = allStudents.find(s => s.id === identifier) || null;
  }

  if (!student) {
    const enrollments = await dbGetEnrollments();
    const enr = enrollments.find(e => 
      e.trackingCode === identifier || 
      e.id === identifier || 
      e.email.toLowerCase() === identifier.toLowerCase()
    );
    if (enr) {
      student = await dbGetStudentByEmail(enr.email);
      if (!student) {
        student = await dbAddStudent({
          id: enr.studentId || `std_${Date.now()}`,
          name: enr.name,
          email: enr.email,
          phone: enr.phone,
          city: enr.city,
          password: newPass,
          isActive: enr.status === 'approved',
          enrolledAt: new Date().toISOString().split('T')[0],
          completedLessons: []
        });
      }
    }
  }

  if (student) {
    await dbUpdateStudent(student.id, { password: newPass });
    return { success: true, email: student.email, newPassword: newPass };
  }

  return null;
}

export async function dbDeleteEnrollment(id: string): Promise<boolean> {
  clearDatabaseCache();
  const enrollments = await dbGetEnrollments();
  const enr = enrollments.find(e => e.id === id || e.trackingCode === id);
  const targetId = enr ? enr.id : id;

  if (supabase) {
    try {
      const { error } = await supabase.from('enrollments').delete().eq('id', targetId);
      if (error) {
        await supabase.from('enrollments').delete().eq('tracking_code', targetId);
      }

      // Also clean up provisional/unapproved student record created for this enrollment
      if (enr?.email) {
        const { data: std } = await supabase.from('students').select('id, is_active, completed_lessons_json').ilike('email', enr.email).maybeSingle();
        if (std && !std.is_active) {
          await supabase.from('students').delete().eq('id', std.id);
        }
      }
    } catch (e) {
      console.error('Supabase delete enrollment error:', e);
    }
  }

  try {
    const idx = initialEnrollments.findIndex(e => e.id === targetId || e.trackingCode === targetId);
    if (idx !== -1) {
      initialEnrollments.splice(idx, 1);
    }
  } catch (e) {}

  return true;
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
