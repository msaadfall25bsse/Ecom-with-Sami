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
  country: string;
  city: string;
  phone: string;
  whatsappLink: string;
  minOrder: string;
  deliveryTime: string;
  codSupported: boolean;
  notes: string;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'PDF' | 'Excel' | 'ZIP' | 'Document';
  size: string;
  description: string;
  downloadUrl: string;
  value: string;
}

// Initial Seed Data
const initialModules: Module[] = [
  {
    id: 1,
    title: 'Module 1: Mindset & UAE/KSA Dropshipping Fundamentals',
    duration: '45 mins',
    description: 'Understand the GCC eCommerce landscape, COD mechanics, and how to start with minimum budget.',
    lessons: [
      { id: 'm1_l1', title: '1.1 GCC Dropshipping Overview vs Western Markets', duration: '12:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm1_l2', title: '1.2 Cash on Delivery (COD) Ecosystem in UAE & KSA', duration: '15:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm1_l3', title: '1.3 Required Tools, Budget & Setup Roadmap', duration: '17:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 2,
    title: 'Module 2: High-Margin Product Hunting & Research',
    duration: '60 mins',
    description: 'Find viral winning products using TikTok Creative Center, Ad Library, and Arab consumer demand indicators.',
    lessons: [
      { id: 'm2_l1', title: '2.1 TikTok Creative Center Deep Dive & Trend Spotting', duration: '18:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm2_l2', title: '2.2 Facebook Ad Library Spying on UAE Competitors', duration: '21:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm2_l3', title: '2.3 Validating Profit Margins & Return Rate Criteria', duration: '20:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 3,
    title: 'Module 3: High-Converting Shopify Store Creation',
    duration: '55 mins',
    description: 'Step-by-step store builder optimized for fast mobile loading and bilingual English/Arabic layouts.',
    lessons: [
      { id: 'm3_l1', title: '3.1 Shopify Store Setup & Domain Connection', duration: '16:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm3_l2', title: '3.2 Installing Fast High-Converting Premium Themes', duration: '19:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm3_l3', title: '3.3 Product Page Optimization & Urgency Triggers', duration: '19:05', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 4,
    title: 'Module 4: COD App Integration & Fast Checkout',
    duration: '40 mins',
    description: 'Install 1-click Cash On Delivery checkout form apps and configure automated WhatsApp confirmation triggers.',
    lessons: [
      { id: 'm4_l1', title: '4.1 1-Click COD Form Installation & Customization', duration: '14:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm4_l2', title: '4.2 Automated WhatsApp Order Confirmation Setup', duration: '15:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm4_l3', title: '4.3 Reducing Fake Orders & RTO Rate Optimization', duration: '10:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 5,
    title: 'Module 5: TikTok Video Creatives & 3-Second Hooks',
    duration: '50 mins',
    description: 'How to make viral UGC video ads using CapCut, AI voiceovers, and scroll-stopping hooks.',
    lessons: [
      { id: 'm5_l1', title: '5.1 Anatomy of a High-Converting TikTok Ad Video', duration: '15:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm5_l2', title: '5.2 CapCut Editing Masterclass for Dropshippers', duration: '18:50', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm5_l3', title: '5.3 ChatGPT Prompts for Viral Arabic & English Scripts', duration: '15:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 6,
    title: 'Module 6: TikTok Ads Manager & Media Buying',
    duration: '65 mins',
    description: 'Complete TikTok Ads tutorial from Pixel setup, Spark Ads, ABO testing, to CBO scaling.',
    lessons: [
      { id: 'm6_l1', title: '6.1 TikTok Business Center & Agency Account Setup', duration: '18:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm6_l2', title: '6.2 TikTok Events Pixel & Conversion API Setup', duration: '20:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm6_l3', title: '6.3 Testing Strategy: 5 Ad Groups ABO Blueprint', duration: '26:50', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 7,
    title: 'Module 7: Facebook & Instagram Ads for GCC',
    duration: '55 mins',
    description: 'Target high-purchasing expat and local demographics in Dubai, Abu Dhabi, Riyadh, and Jeddah.',
    lessons: [
      { id: 'm7_l1', title: '7.1 Meta Business Suite Setup & Safe Asset Security', duration: '16:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm7_l2', title: '7.2 Broad Targeting & Advantage+ Shopping Campaigns', duration: '20:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm7_l3', title: '7.3 Retargeting High-Intent COD Add to Carts', duration: '17:45', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 8,
    title: 'Module 8: Scaling to 50+ Orders/Day & Budget Control',
    duration: '45 mins',
    description: 'When and how to increase ad budgets without breaking CPA or getting account restricted.',
    lessons: [
      { id: 'm8_l1', title: '8.1 Vertical vs Horizontal Scaling Blueprints', duration: '15:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm8_l2', title: '8.2 Creative Refresh & Ad Fatigue Management', duration: '14:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm8_l3', title: '8.3 Managing Daily Cashflow with COD Remittances', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 9,
    title: 'Module 9: Courier Logistics & 2-Day Delivery in UAE/KSA',
    duration: '40 mins',
    description: 'Integrate top courier fulfillment portals in UAE (Fetchr, Jeebly, Emirates Post) and KSA (SMSA, Torod, J&T).',
    lessons: [
      { id: 'm9_l1', title: '9.1 Top GCC Logistics Companies Comparison', duration: '13:30', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm9_l2', title: '9.2 Automating AWB Shipping Labels & Tracking', duration: '14:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm9_l3', title: '9.3 NDR (Non-Delivery Report) Recovery Strategy', duration: '12:15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 10,
    title: 'Module 10: Direct Verified GCC Suppliers Directory',
    duration: '50 mins',
    description: 'Get direct phone numbers, warehouse addresses, and negotiation scripts for verified local warehouses.',
    lessons: [
      { id: 'm10_l1', title: '10.1 Accessing the Dubai & Sharjah Wholesale Warehouses', duration: '18:10', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm10_l2', title: '10.2 Riyadh & Jeddah Local Sourcing Contacts', duration: '16:50', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm10_l3', title: '10.3 Negotiating Supplier Credit & Faster Dispatch', duration: '15:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 11,
    title: 'Module 11: Profit Withdrawals to Pakistani Banks',
    duration: '35 mins',
    description: 'Seamlessly receive UAE Dirhams and Saudi Riyals payouts directly into Easypaisa, JazzCash, or Pakistani Bank accounts.',
    lessons: [
      { id: 'm11_l1', title: '11.1 Connecting Multi-Currency Accounts (Payoneer, Wise, SadaBiz)', duration: '14:20', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm11_l2', title: '11.2 Direct Remittance to Meezan, Nayapay & JazzCash', duration: '12:40', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'm11_l3', title: '11.3 Tax Compliance, Ledger Setup & Business Reinvestment', duration: '08:00', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  }
];

const initialSuppliers: Supplier[] = [
  {
    id: 'sup_1',
    name: 'Al-Madina Wholesale Electronics & Gadgets',
    category: 'Electronics & Smart Gadgets',
    country: 'UAE',
    city: 'Dubai (Deira Wholesale Market)',
    phone: '+971501234567',
    whatsappLink: 'https://wa.me/971501234567',
    minOrder: '1 Piece (Dropship Friendly)',
    deliveryTime: '24-48 Hours across UAE',
    codSupported: true,
    notes: 'Provides ready-stock video clips and direct box dispatch.'
  },
  {
    id: 'sup_2',
    name: 'Gulf Home & Kitchen Essentials Warehousing',
    category: 'Home, Kitchen & Cleaning',
    country: 'UAE',
    city: 'Sharjah Industrial Area 4',
    phone: '+971559876543',
    whatsappLink: 'https://wa.me/971559876543',
    minOrder: 'Zero MOQ',
    deliveryTime: '1-2 Days UAE & 3 Days KSA',
    codSupported: true,
    notes: 'Arabic instruction manual stickers available on request.'
  },
  {
    id: 'sup_3',
    name: 'Riyadh Express Beauty & Personal Care Sourcing',
    category: 'Health, Beauty & Skincare',
    country: 'Saudi Arabia',
    city: 'Riyadh (Al-Batha Wholesale)',
    phone: '+966541122334',
    whatsappLink: 'https://wa.me/966541122334',
    minOrder: 'No Minimum',
    deliveryTime: '24-48 Hours across KSA',
    codSupported: true,
    notes: '100% SFDA approved beauty products with invoice.'
  },
  {
    id: 'sup_4',
    name: 'Jeddah Auto & Car Accessories Direct Hub',
    category: 'Car Accessories & Tools',
    country: 'Saudi Arabia',
    city: 'Jeddah Wholesale District',
    phone: '+966567788990',
    whatsappLink: 'https://wa.me/966567788990',
    minOrder: 'Dropship Friendly',
    deliveryTime: '2-3 Days KSA',
    codSupported: true,
    notes: 'Best supplier for viral tire inflators, car vacuum cleaners.'
  }
];

const initialResources: ResourceItem[] = [
  {
    id: 'res_1',
    title: 'Facebook & TikTok Ads Zero to Hero Guide 2026',
    type: 'PDF',
    size: '14.2 MB',
    description: 'Complete 84-page visual e-book taking you through account security, bidding, and scaling.',
    downloadUrl: '#',
    value: 'Rs 3,500'
  },
  {
    id: 'res_2',
    title: 'Dropshipping P&L Margin & COD Calculator',
    type: 'Excel',
    size: '2.8 MB',
    description: 'Pre-formatted Excel sheet to calculate exact profit after product cost, ad spend, and RTO.',
    downloadUrl: '#',
    value: 'Rs 3,000'
  },
  {
    id: 'res_3',
    title: 'Ultra-Fast Premium Shopify Conversion Theme Pack',
    type: 'ZIP',
    size: '42.5 MB',
    description: 'High-converting mobile-optimized Shopify theme with Arabic RTL switch and sticky buy buttons.',
    downloadUrl: '#',
    value: 'Rs 4,000'
  },
  {
    id: 'res_4',
    title: '30+ High-Converting ChatGPT eCommerce Prompts Pack',
    type: 'Document',
    size: '1.5 MB',
    description: 'Ready-to-use prompts for viral ad copy, product titles, descriptions, and customer support scripts.',
    downloadUrl: '#',
    value: 'Rs 2,500'
  }
];

const initialStudents: Student[] = [
  {
    id: 'std_demo_1',
    name: 'Demo Student',
    email: 'student@samiecom.com',
    phone: '03001234567',
    city: 'Lahore',
    password: 'studentpass2026',
    isActive: true,
    enrolledAt: '2026-08-15',
    completedLessons: ['m1_l1', 'm1_l2', 'm1_l3', 'm2_l1']
  }
];

const initialEnrollments: Enrollment[] = [
  {
    id: 'enr_101',
    trackingCode: 'SAMI-ENR-98412',
    studentId: 'std_101',
    name: 'Muhammad Ali',
    email: 'ali.ecom@gmail.com',
    phone: '03001234567',
    city: 'Lahore',
    paymentMethod: 'Easypaisa',
    transactionId: '19283746501',
    amount: 'PKR 3,900',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'enr_102',
    trackingCode: 'SAMI-ENR-98411',
    studentId: 'std_102',
    name: 'Usman Ghani',
    email: 'usman.dropship@gmail.com',
    phone: '03129876543',
    city: 'Rawalpindi',
    paymentMethod: 'JazzCash',
    transactionId: '48201938475',
    amount: 'PKR 3,900',
    status: 'approved',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

const initialTickets: SupportTicket[] = [
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
        // Auto-activate corresponding student
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

