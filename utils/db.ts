// Unified Persistent Backend Database Engine for Ecom With Sami

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  password: string;
  isActive: boolean;
  enrolledAt: string;
  completedLessons: string[]; // array of lesson IDs
  lastLogin?: string;
}

export interface Enrollment {
  id: string;
  trackingCode: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  paymentMethod: string;
  transactionId: string;
  whereHeard?: string;
  receiptUrl?: string;
  amount: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  notes?: string;
}

export interface Module {
  id: number;
  title: string;
  duration: string;
  description: string;
  lessons: Lesson[];
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  country: 'UAE' | 'Saudi Arabia';
  city: string;
  phone: string;
  whatsappLink: string;
  minOrder: string;
  deliveryTime: string;
  codSupported: boolean;
  notes: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: string;
  size: string;
  downloadUrl: string;
  value: string;
  description: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

// -------------------------------------------------------------
// INITIAL SEED DATA
// -------------------------------------------------------------
export const initialStudents: Student[] = [
  {
    id: 'std_demo1',
    name: 'Hamza Tariq',
    email: 'student@samiecom.com',
    phone: '03158960026',
    city: 'Lahore',
    password: 'studentpass2026',
    isActive: true,
    enrolledAt: '2026-08-28',
    completedLessons: ['m1_l1', 'm1_l2', 'm1_l3'],
    lastLogin: '2026-09-02'
  },
  {
    id: 'std_demo2',
    name: 'Bilal Ahmad',
    email: 'bilal@gmail.com',
    phone: '03001234567',
    city: 'Karachi',
    password: 'studentpass2026',
    isActive: true,
    enrolledAt: '2026-08-29',
    completedLessons: ['m1_l1', 'm1_l2', 'm1_l3', 'm2_l1', 'm2_l2'],
    lastLogin: '2026-09-01'
  }
];

export const initialEnrollments: Enrollment[] = [
  {
    id: 'enr_1',
    trackingCode: 'SAMI-ENR-98421',
    studentId: 'std_demo1',
    name: 'Hamza Tariq',
    email: 'student@samiecom.com',
    phone: '03158960026',
    city: 'Lahore',
    paymentMethod: 'Easypaisa',
    transactionId: 'TXN-984210984',
    whereHeard: 'TikTok',
    amount: 'PKR 3,900',
    status: 'approved',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'enr_2',
    trackingCode: 'SAMI-ENR-77312',
    studentId: 'std_demo2',
    name: 'Bilal Ahmad',
    email: 'bilal@gmail.com',
    phone: '03001234567',
    city: 'Karachi',
    paymentMethod: 'Meezan Bank Ltd',
    transactionId: 'FT-20260902-8812',
    whereHeard: 'Instagram',
    amount: 'PKR 3,900',
    status: 'approved',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 'enr_3',
    trackingCode: 'SAMI-ENR-65109',
    studentId: 'std_3',
    name: 'Usman Ghani',
    email: 'usman.ghani@yahoo.com',
    phone: '03219876543',
    city: 'Islamabad',
    paymentMethod: 'JazzCash',
    transactionId: 'JC-876234190',
    whereHeard: 'YouTube',
    amount: 'PKR 3,900',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const initialModules: Module[] = [
  {
    id: 1,
    title: 'Module 1: GCC Dropshipping Fundamentals & Opportunity',
    duration: '45 mins',
    description: 'Understand the business economics of UAE and Saudi markets, profit margin benchmarks, COD mechanics, and how to operate 100% remotely from Pakistan.',
    lessons: [
      { id: 'm1_l1', title: '1.1 GCC Dropshipping Overview & Market Arbitrage', duration: '12:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm1_l2', title: '1.2 Mindset, Capital Requirements & Legal Structure', duration: '15:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm1_l3', title: '1.3 Selecting Between UAE (AED) vs Saudi Arabia (SAR)', duration: '17:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 2,
    title: 'Module 2: High-Converting Shopify Store Architecture',
    duration: '60 mins',
    description: 'Building an ultra-fast, mobile-first Shopify storefront optimized for GCC Arabic & English buyers with 1-click Cash on Delivery (COD) checkouts.',
    lessons: [
      { id: 'm2_l1', title: '2.1 Shopify Account Creation & Partner Plan Setup', duration: '14:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm2_l2', title: '2.2 Installing the Free High-Converting Custom Theme', duration: '18:50', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm2_l3', title: '2.3 Setting Up Fast COD Form & WhatsApp Floating Chat', duration: '16:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm2_l4', title: '2.4 Currency Converters & Arabic Multi-language Integration', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 3,
    title: 'Module 3: Winning Product Research & Validation Criteria',
    duration: '55 mins',
    description: 'Master the 15-point criteria checklist to discover high-margin, viral winning products using TikTok Creative Center, PiPiADS, and Facebook Ad Library.',
    lessons: [
      { id: 'm3_l1', title: '3.1 The 15-Point Winning Product Matrix for GCC', duration: '19:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm3_l2', title: '3.2 Spying on Top Dubai Competitors via TikTok Ads Library', duration: '20:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm3_l3', title: '3.3 Product Margin & Break-Even ROAS Calculation', duration: '15:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 4,
    title: 'Module 4: Sourcing from Verified Wholesale UAE & KSA Suppliers',
    duration: '50 mins',
    description: 'Connect directly with wholesale warehouses in Dubai (Deira, Naif) and Riyadh for 24-48 hours local COD shipping with zero upfront stock purchases.',
    lessons: [
      { id: 'm4_l1', title: '4.1 How to Negotiate with Deira & Riyadh Warehouse Managers', duration: '16:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm4_l2', title: '4.2 Utilizing the Private Supplier Directory Included in Course', duration: '18:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm4_l3', title: '4.3 Handling Stock Availability, Packaging & QA Inspections', duration: '15:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 5,
    title: 'Module 5: TikTok Ads Mastery & Pixel Integration',
    duration: '75 mins',
    description: 'Comprehensive guide to TikTok Business Center setup from Pakistan, agency ad accounts, custom conversions, and budget testing strategies.',
    lessons: [
      { id: 'm5_l1', title: '5.1 Creating TikTok Agency Ad Accounts Without Bans', duration: '22:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm5_l2', title: '5.2 TikTok Pixel & Events API Setup via Google Tag Manager', duration: '20:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm5_l3', title: '5.3 The CBO Testing Framework (Rs 5,000 to 50 Orders)', duration: '18:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm5_l4', title: '5.4 UGC Video Creation & Hook Formulas That Print Dirhams', duration: '14:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 6,
    title: 'Module 6: Facebook & Instagram Ads Scaling Engine',
    duration: '65 mins',
    description: 'Structuring Advantage+ shopping campaigns, custom audience lookalikes, Arabic copywriting hooks, and retargeting high-intent GCC visitors.',
    lessons: [
      { id: 'm6_l1', title: '6.1 Meta Business Manager Verification & Pixel Setup', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm6_l2', title: '6.2 Advantage+ Campaigns vs Manual Broad Targeting', duration: '21:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm6_l3', title: '6.3 Retargeting Sequences & Dynamic Product Ads (DPA)', duration: '16:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm6_l4', title: '6.4 Scaling Winning Ad Sets to AED 5,000/Day Safely', duration: '10:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 7,
    title: 'Module 7: WhatsApp Automation & Order Confirmation Funnel',
    duration: '40 mins',
    description: 'Boost delivery success rates from 60% to 88%+ using automated WhatsApp confirmation bots, address validation, and audio note scripts in Gulf Arabic.',
    lessons: [
      { id: 'm7_l1', title: '7.1 Setting Up Automated WhatsApp Confirmation Flows', duration: '14:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm7_l2', title: '7.2 Gulf Arabic Voice Note Scripts That Reduce Cancellations', duration: '12:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm7_l3', title: '7.3 Address Verification Hacks (Dubai Al-Barsha, Riyadh Olaya)', duration: '13:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 8,
    title: 'Module 8: Courier Logistics, COD Remittance & Return Rate (RTO) Control',
    duration: '50 mins',
    description: 'Partnering with GCC delivery couriers (SMSA, Aramex, Zajil, Quiqup), managing COD cash remittances to Pakistan, and slashing return rates.',
    lessons: [
      { id: 'm8_l1', title: '8.1 Courier Onboarding (SMSA, Aramex, Zajil, Local Couriers)', duration: '16:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm8_l2', title: '8.2 Tracking Remittances & Withdrawing PKR to Pakistani Banks', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm8_l3', title: '8.3 RTO Minimization Strategies & Re-delivery Automation', duration: '15:50', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 9,
    title: 'Module 9: Financial Management, P&L Tracking & Currency Transfers',
    duration: '45 mins',
    description: 'Managing cash flow, calculating net margins, accounting for ad spend vs courier fees, and legal currency remittance into Pakistan bank accounts.',
    lessons: [
      { id: 'm9_l1', title: '9.1 E-Commerce Profit & Loss Spreadsheet Walkthrough', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm9_l2', title: '9.2 Managing Credit Limits for Ads & Working Capital', duration: '14:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm9_l3', title: '9.3 Tax Considerations & Long-Term Wealth Planning', duration: '15:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 10,
    title: 'Module 10: Building a Private Label Brand in UAE & Saudi Arabia',
    duration: '55 mins',
    description: 'Transitioning from generic dropshipping to custom branded packaging, private label manufacturing in China/Dubai, and establishing long-term enterprise value.',
    lessons: [
      { id: 'm10_l1', title: '10.1 When and How to Transition into Private Label', duration: '17:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm10_l2', title: '10.2 Custom Packaging & Arabic Labeling Regulations', duration: '18:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm10_l3', title: '10.3 Trademark Registration in UAE & Saudi Arabia (MOC)', duration: '19:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 11,
    title: 'Module 11: Scaling to 7-Figures & Team Hiring Blueprint',
    duration: '60 mins',
    description: 'Hiring virtual assistants (VAs) from Pakistan, delegating customer support and media buying, and building an automated e-commerce cash machine.',
    lessons: [
      { id: 'm11_l1', title: '11.1 Hiring & Training Customer Support VAs on Upwork', duration: '20:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm11_l2', title: '11.2 Standard Operating Procedures (SOPs) for Daily Store Ops', duration: '18:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm11_l3', title: '11.3 Final Words of Wisdom from Mentor Sardar Samiullah', duration: '21:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  }
];

export const initialSuppliers: Supplier[] = [
  {
    id: 'sup_1',
    name: 'Al-Madina Electronics & Gadgets Wholesale',
    category: 'Consumer Electronics & Smart Home',
    country: 'UAE',
    city: 'Dubai (Deira Wholesale Market)',
    phone: '+971508923411',
    whatsappLink: 'https://wa.me/971508923411',
    minOrder: '1 Piece (Dropshipping Enabled)',
    deliveryTime: '24-48 Hours Across UAE',
    codSupported: true,
    notes: 'Direct warehouse stock in Deira. Offers same-day dispatch for Dubai & Sharjah orders.'
  },
  {
    id: 'sup_2',
    name: 'Gulf Beauty & Personal Care Hub',
    category: 'Skincare, Haircare & Fragrances',
    country: 'UAE',
    city: 'Sharjah (Industrial Area 4)',
    phone: '+971561234567',
    whatsappLink: 'https://wa.me/971561234567',
    minOrder: '1 Piece (Dropshipping Enabled)',
    deliveryTime: '24-48 Hours Across UAE',
    codSupported: true,
    notes: 'Approved GCC cosmetics importer. High margin products with Arabic compliance packaging.'
  },
  {
    id: 'sup_3',
    name: 'Riyadh Prime Kitchen & Home Essentials',
    category: 'Kitchenware & Problem-Solving Home Products',
    country: 'Saudi Arabia',
    city: 'Riyadh (Al-Batha Wholesale Market)',
    phone: '+966509876543',
    whatsappLink: 'https://wa.me/966509876543',
    minOrder: '1 Piece (Dropshipping Enabled)',
    deliveryTime: '48 Hours Across Saudi Arabia (SMSA Courier)',
    codSupported: true,
    notes: 'Specializes in TikTok viral kitchen gadgets with local Riyadh stock.'
  },
  {
    id: 'sup_4',
    name: 'Jeddah Auto & Car Accessories Central',
    category: 'Automotive Accessories & Outdoor Gear',
    country: 'Saudi Arabia',
    city: 'Jeddah (Bab Makkah Wholesale)',
    phone: '+966551122334',
    whatsappLink: 'https://wa.me/966551122334',
    minOrder: '1 Piece (Dropshipping Enabled)',
    deliveryTime: '24-48 Hours Across Western Province',
    codSupported: true,
    notes: 'High average order value items. Great for Saudi male demographic targeting.'
  }
];

export const initialResources: ResourceItem[] = [
  {
    id: 'res_1',
    title: 'Verified GCC Suppliers Directory (Excel + WhatsApp Contacts)',
    type: 'XLSX Spreadsheet',
    size: '1.4 MB',
    downloadUrl: '/apps/WithSamiLMS_Windows_1.0.13.exe',
    value: 'Rs 10,000',
    description: 'Complete list of 40+ wholesale suppliers in Dubai, Sharjah, Riyadh and Jeddah with phone numbers.'
  },
  {
    id: 'res_2',
    title: 'Custom Fast-Converting Shopify Theme (ZIP File)',
    type: 'Shopify Theme ZIP',
    size: '8.2 MB',
    downloadUrl: '/apps/WithSamiLMS_Windows_1.0.13.exe',
    value: 'Rs 8,500',
    description: 'The exact custom code theme used on our 7-figure stores with built-in 1-click COD popup form.'
  },
  {
    id: 'res_3',
    title: 'Ready-to-Use Facebook & TikTok Ads Blueprint (PDF)',
    type: 'PDF Guide',
    size: '4.7 MB',
    downloadUrl: '/apps/WithSamiLMS_Windows_1.0.13.exe',
    value: 'Rs 5,000',
    description: 'Pre-written ad copy scripts in Arabic and English, campaign testing frameworks and hooks.'
  },
  {
    id: 'res_4',
    title: 'E-Commerce P&L Margin & Profit Calculator (Excel)',
    type: 'Excel Calculator',
    size: '650 KB',
    downloadUrl: '/apps/WithSamiLMS_Windows_1.0.13.exe',
    value: 'Rs 3,000',
    description: 'Automatically calculates advertising ROAS, courier COD deductions, product cost, and net PKR profit.'
  }
];

export const initialTickets: SupportTicket[] = [
  {
    id: 'tkt_1',
    name: 'Hamza Tariq',
    email: 'hamza@gmail.com',
    phone: '03451122334',
    topic: 'Course Access / LMS Activation',
    message: 'Hello Sami, I paid via Meezan Bank. Please check my receipt.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// In-memory Database Store with Global Singleton
class DatabaseStore {
  students: Student[] = [...initialStudents];
  enrollments: Enrollment[] = [...initialEnrollments];
  modules: Module[] = [...initialModules];
  suppliers: Supplier[] = [...initialSuppliers];
  resources: ResourceItem[] = [...initialResources];
  tickets: SupportTicket[] = [...initialTickets];

  // Students Methods
  getStudents() {
    return this.students;
  }

  getStudentByEmail(email: string) {
    return this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  getStudentById(id: string) {
    return this.students.find(s => s.id === id);
  }

  addStudent(student: Student) {
    this.students.unshift(student);
    return student;
  }

  updateStudent(id: string, patch: Partial<Student>) {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.students[idx] = { ...this.students[idx], ...patch };
      return this.students[idx];
    }
    return null;
  }

  // Enrollments Methods
  getEnrollments() {
    return this.enrollments;
  }

  addEnrollment(enr: Enrollment) {
    this.enrollments.unshift(enr);
    return enr;
  }

  updateEnrollmentStatus(id: string, status: 'approved' | 'rejected') {
    const enr = this.enrollments.find(e => e.id === id || e.trackingCode === id);
    if (enr) {
      enr.status = status;
      if (status === 'approved') {
        const student = this.getStudentByEmail(enr.email);
        if (student) {
          student.isActive = true;
        } else {
          this.addStudent({
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
    return null;
  }

  // Modules & LMS Methods
  getModules() {
    return this.modules;
  }

  getModuleById(id: number) {
    return this.modules.find(m => m.id === id);
  }

  addModule(module: Module) {
    this.modules.push(module);
    return module;
  }

  updateModule(id: number, patch: Partial<Module>) {
    const idx = this.modules.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.modules[idx] = { ...this.modules[idx], ...patch };
      return this.modules[idx];
    }
    return null;
  }

  deleteModule(id: number) {
    const idx = this.modules.findIndex(m => m.id === id);
    if (idx !== -1) {
      const removed = this.modules.splice(idx, 1);
      return removed[0];
    }
    return null;
  }

  addLessonToModule(moduleId: number, lesson: Lesson) {
    const mod = this.getModuleById(moduleId);
    if (mod) {
      mod.lessons.push(lesson);
      return lesson;
    }
    return null;
  }

  updateLesson(moduleId: number, lessonId: string, patch: Partial<Lesson>) {
    const mod = this.getModuleById(moduleId);
    if (mod) {
      const lIdx = mod.lessons.findIndex(l => l.id === lessonId);
      if (lIdx !== -1) {
        mod.lessons[lIdx] = { ...mod.lessons[lIdx], ...patch };
        return mod.lessons[lIdx];
      }
    }
    return null;
  }

  deleteLesson(moduleId: number, lessonId: string) {
    const mod = this.getModuleById(moduleId);
    if (mod) {
      const lIdx = mod.lessons.findIndex(l => l.id === lessonId);
      if (lIdx !== -1) {
        const removed = mod.lessons.splice(lIdx, 1);
        return removed[0];
      }
    }
    return null;
  }

  // Suppliers CRUD
  getSuppliers() {
    return this.suppliers;
  }

  addSupplier(supplier: Supplier) {
    this.suppliers.unshift(supplier);
    return supplier;
  }

  deleteSupplier(id: string) {
    const idx = this.suppliers.findIndex(s => s.id === id);
    if (idx !== -1) {
      const removed = this.suppliers.splice(idx, 1);
      return removed[0];
    }
    return null;
  }

  // Resources CRUD
  getResources() {
    return this.resources;
  }

  addResource(resource: ResourceItem) {
    this.resources.unshift(resource);
    return resource;
  }

  deleteResource(id: string) {
    const idx = this.resources.findIndex(r => r.id === id);
    if (idx !== -1) {
      const removed = this.resources.splice(idx, 1);
      return removed[0];
    }
    return null;
  }

  // Support Tickets
  getTickets() {
    return this.tickets;
  }

  addTicket(ticket: SupportTicket) {
    this.tickets.unshift(ticket);
    return ticket;
  }
}

// Global Singleton
declare global {
  var __ecomDbInstance: DatabaseStore | undefined;
}

export const db: DatabaseStore = global.__ecomDbInstance || (global.__ecomDbInstance = new DatabaseStore());
