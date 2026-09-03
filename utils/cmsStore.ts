// Central CMS Data Store & In-Memory / File Persistent Helper

export interface CmsContentSchema {
  marquee: {
    is_active: boolean;
    items: string[];
  };
  hero: {
    badge: string;
    title_line1: string;
    title_highlight: string;
    subtitle: string;
    video_url: string;
    video_title: string;
    original_price: string;
    current_price: string;
    seats_left: number;
    cta_text: string;
  };
  stats: {
    training_hours: string;
    lectures_count: string;
    access_type: string;
    mentorship_type: string;
  };
  mentor: {
    name: string;
    title: string;
    bio: string;
    students_count: string;
    primary_markets: string;
    access_badge: string;
  };
  bonuses: {
    tag: string;
    title: string;
    highlight_value: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
      value: string;
    }[];
  };
  why_dropshipping: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  options_comparison: {
    diy_title: string;
    diy_points: string[];
    sami_title: string;
    sami_points: string[];
  };
  cost_of_waiting: {
    title: string;
    subtitle: string;
    cards: {
      label: string;
      title: string;
      desc: string;
    }[];
  };
  faqs: {
    q: string;
    a: string;
  }[];
  testimonials: {
    name: string;
    city: string;
    sales: string;
    orders: string;
    quote: string;
    market: string;
    initials: string;
  }[];
  payment_methods: {
    id: string;
    name: string;
    accountTitle: string;
    accountNumber: string;
    badge: string;
    iban?: string;
  }[];
  contact: {
    phone: string;
    email: string;
    headOffice: string;
    regionalOffice: string;
    whatsappGreeting: string;
  };
  pixels: {
    meta_pixel_id: string;
    tiktok_pixel_id: string;
    ga4_measurement_id: string;
    snapchat_pixel_id: string;
    custom_head_code: string;
  };
}

export const defaultCmsContent: CmsContentSchema = {
  marquee: {
    is_active: true,
    items: [
      '🔥 Master UAE & KSA Shopify Dropshipping',
      '⚡ 88% OFF Today',
      '💰 Just PKR 3,900',
      '🔒 Lifetime LMS Portal Access',
      '📱 WhatsApp Mentorship (9AM–5PM)',
      '🏆 9,700+ Students Trained',
      '🚀 Verified Suppliers Directory Included',
      '🎁 Free Bonuses Worth Rs 30,000+'
    ]
  },
  hero: {
    badge: 'PAKISTAN’S #1 UAE/KSA DROPSHIPPING TRAINING',
    title_line1: 'Learn How to Start Online Dropshipping Store in UAE & KSA',
    title_highlight: 'Step-by-Step Training',
    subtitle: 'Beginner Friendly Practical Training • Direct Verified GCC Suppliers • 9,700+ Students Mentored',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    video_title: '128-Second Dropshipping Blueprint Overview',
    original_price: 'PKR 32,500',
    current_price: 'PKR 3,900',
    seats_left: 12,
    cta_text: 'YES! I WANT TO LEARN THIS'
  },
  stats: {
    training_hours: '8 Hours',
    lectures_count: '36 Lectures',
    access_type: 'Lifetime Access',
    mentorship_type: 'WhatsApp Mentorship'
  },
  mentor: {
    name: 'Muhammad Sami',
    title: 'Verified eCommerce Mentor',
    bio: 'You don’t just need course videos — you need direct mentorship and real-time troubleshooting when scaling ads. Both are included in your enrollment today.',
    students_count: '9,700+',
    primary_markets: 'UAE & KSA',
    access_badge: 'Lifetime'
  },
  bonuses: {
    tag: 'FREE POWER BONUSES',
    title: 'Exclusive Free Bonuses Worth',
    highlight_value: 'Rs 30,000+',
    subtitle: 'Enroll in the course today and get these 6 exclusive power resources 100% FREE with your enrollment.',
    items: [
      { title: 'Weekly 2-Hour Live Class', desc: 'Join live coaching sessions every week with Sami to review ads, solve problems & stay on track.', value: 'Rs 10,000' },
      { title: 'Live Campaign & Pixel Audits', desc: 'Get your live ad campaigns and TikTok/Facebook pixels audited so you know exactly what to scale.', value: 'Rs 7,500' },
      { title: 'Facebook Zero to Hero E-Book', desc: 'A complete step-by-step PDF manual taking you from total beginner to confident advertiser.', value: 'Rs 3,500' },
      { title: 'Dropshipping P&L Margin Calculator', desc: 'Know your exact profit margins, product costs, ad budgets, and COD delivery returns in Excel.', value: 'Rs 3,000' },
      { title: 'Ultra-Fast Premium Shopify Themes', desc: 'Ready-to-use premium store themes optimized for mobile conversions and Arabic RTL layout.', value: 'Rs 4,000' },
      { title: '30+ High-Converting ChatGPT Prompts Pack', desc: 'Instant AI prompts to write compelling product descriptions, viral video hooks, and ad copy.', value: 'Rs 2,500' }
    ]
  },
  why_dropshipping: {
    badge: 'THE BEST OPPORTUNITY IN 2026',
    title: 'Why Dropshipping Is the Smartest Online Business Right Now',
    subtitle: 'No big investment, no office, no inventory risk. Start with just PKR 15,000 — from home, right on your phone.',
    items: [
      { title: 'Work From Anywhere', desc: 'Run your high-converting Shopify store from your home, a cafe, or even while traveling.' },
      { title: 'No Company Registration', desc: 'No complex paperwork, licenses, or legal setup required — just a smartphone/laptop and internet.' },
      { title: 'Zero Inventory, Zero Risk', desc: 'You never buy stock upfront. Your supplier ships the item only after a customer places an order.' },
      { title: 'Get Paid in Your Local Bank', desc: 'Withdraw your cash on delivery (COD) profits directly to your Pakistani bank account effortlessly.' }
    ]
  },
  options_comparison: {
    diy_title: 'Do It Yourself',
    diy_points: [
      'Keep guessing which products work and which burn ad spend',
      'Face repeated Facebook ad account restrictions without guidance',
      'Waste months and 50,000+ PKR on trial-and-error tests',
      'Lose motivation and quit before seeing your first real order'
    ],
    sami_title: 'Join Ecom With Sami Program',
    sami_points: [
      'Follow a tested 11-module framework from product hunting to scaling',
      'Get direct verified UAE & Saudi supplier phone numbers and rates',
      'Lifetime WhatsApp mentorship from 9AM to 5PM daily',
      'Get 6 free power bonus tools worth Rs 30,000+ included'
    ]
  },
  cost_of_waiting: {
    title: 'What Does Waiting Really Cost You?',
    subtitle: 'The cost isn’t just PKR 3,900. It’s everything that stays exactly the same if nothing changes today.',
    cards: [
      { label: '3 MONTHS FROM NOW', title: 'Still Stuck at “Someday”', desc: 'Still watching free YouTube videos with missing steps, still confused about pixels, same questions, zero progress.' },
      { label: '1 YEAR FROM NOW', title: 'Watching Others Move Ahead', desc: 'People who enrolled today will already have a live profitable store. You will look back wishing you had started now.' },
      { label: 'EXPENSIVE GUESSING', title: 'Money Lost to Trial & Error', desc: 'Most beginners burn 40,000+ PKR testing blindly on TikTok/Facebook ads. A proven blueprint saves you that wasted money.' },
      { label: 'RISING COMPETITION', title: 'Late Entry = Harder Game', desc: 'GCC e-commerce is booming right now. The longer you delay, the more crowded it becomes for new entrants.' },
      { label: 'WASTED MONTHS', title: 'The Slow, Lonely Route', desc: 'Figuring everything out alone takes 6 to 12 months. With mentor Sami’s roadmap, you launch in days.' },
      { label: 'THE REAL MATH', title: 'Course Fee vs. Delay Cost', desc: 'PKR 3,900 is less than what most waste on a single failed ad test. Invest in your business skills today.' }
    ]
  },
  faqs: [
    {
      q: 'Is this course suitable for beginners?',
      a: 'Absolutely. This course is built from absolute scratch for complete beginners and guides you step by step through the entire process — no prior coding, Shopify, or digital marketing experience is needed.'
    },
    {
      q: 'How much investment do I need to start dropshipping in UAE & KSA?',
      a: 'You can get started in the UAE, KSA, and Pakistani markets with as little as 15,000 to 20,000 PKR using the organic & low-budget testing strategies taught in the course.'
    },
    {
      q: 'How do I get LMS portal access after paying?',
      a: 'After completing payment on the enrollment page, upload your payment receipt or message our support team on WhatsApp. Your dedicated LMS portal credentials will be activated instantly via email.'
    },
    {
      q: 'Do you provide verified UAE & KSA supplier contacts?',
      a: 'Yes! Inside Module 10, you get direct contact numbers, warehouse locations, and negotiation scripts for verified suppliers with fast 2-day delivery and cash-on-delivery (COD) payout options.'
    },
    {
      q: 'Do you provide mentorship and live ad support?',
      a: 'Yes — we provide lifetime support. You can ask questions directly on WhatsApp from 9AM to 5PM, plus attend weekly live coaching sessions to audit your ad campaigns and solve issues.'
    },
    {
      q: 'How long is the course and how many lectures?',
      a: 'The course consists of approximately 8 hours of step-by-step practical training, organized into 11 modules and 36 easy-to-follow HD video lectures you can watch at your own pace.'
    },
    {
      q: 'Is this a one-time fee or monthly subscription?',
      a: 'It is a strictly one-time fee of PKR 3,900 with lifetime access. All future updates, newly added supplier lists, and live coaching calls are included without any extra charges.'
    },
    {
      q: 'Can I do this from my mobile phone while working a full-time job?',
      a: 'Yes. You only need a smartphone or laptop and an internet connection. Most of our 9,700+ students are job holders and manage their stores during their free evening hours.'
    }
  ],
  testimonials: [
    {
      name: 'Raza Ali',
      city: 'Lahore',
      sales: 'AED 4,850 in 6 Days',
      orders: '24 Orders',
      quote: 'Launched my first TikTok test ad campaign following Sami’s hook formula. First sale within 18 hours!',
      market: 'UAE Market',
      initials: 'RA'
    },
    {
      name: 'Hamza Tariq',
      city: 'Islamabad',
      sales: 'AED 5,000 / Week',
      orders: '56 Orders',
      quote: 'The direct supplier contacts in Dubai changed everything. Fast 2-day delivery and COD payout on time.',
      market: 'UAE Market',
      initials: 'HT'
    },
    {
      name: 'Bilal Farooq',
      city: 'Karachi',
      sales: 'SAR 3,485 in 3 Days',
      orders: '19 Orders',
      quote: 'Started as a total beginner with zero Shopify knowledge. The 11 modules are so easy and step-by-step.',
      market: 'Saudi Arabia',
      initials: 'BF'
    },
    {
      name: 'Zainab Bibi',
      city: 'Faisalabad',
      sales: 'PKR 480,000 / Mo',
      orders: '110+ Orders',
      quote: 'The WhatsApp mentorship answered every question I had during my ad setup. Never felt alone.',
      market: 'UAE & KSA',
      initials: 'ZB'
    },
    {
      name: 'Usman Ghani',
      city: 'Rawalpindi',
      sales: 'SAR 8,200',
      orders: '78 Orders',
      quote: 'Scaled my product using Advantage+ CBO scaling taught in Module 8. Best investment of my life.',
      market: 'Saudi Market',
      initials: 'UG'
    },
    {
      name: 'Saad Ahmed',
      city: 'Multan',
      sales: 'PKR 320,000 Profit',
      orders: '42 Orders',
      quote: 'Verified suppliers with Arabic packaging makes local buyers trust the store. Return rate dropped to 11%.',
      market: 'UAE Market',
      initials: 'SA'
    }
  ],
  payment_methods: [
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Instant Transfer'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Instant Transfer'
    },
    {
      id: 'meezan',
      name: 'Meezan Bank Ltd',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '01010101010101',
      iban: 'PK00MEZN0001010101010101',
      badge: 'Direct Bank Transfer'
    },
    {
      id: 'sadapay',
      name: 'SadaPay / NayaPay',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Fast & Zero Fees'
    }
  ],
  contact: {
    phone: '03158960026',
    email: 'support@samiecom.com',
    headOffice: 'Office 402, Al-Hafeez Heights, Gulberg III, Lahore, Pakistan',
    regionalOffice: 'Dubai Silicon Oasis, DDP, Building A2, Dubai, UAE',
    whatsappGreeting: 'Hi Sami! I want to enroll in the UAE & KSA Dropshipping Mentorship.'
  },
  pixels: {
    meta_pixel_id: '',
    tiktok_pixel_id: '',
    ga4_measurement_id: '',
    snapchat_pixel_id: '',
    custom_head_code: ''
  }
};

// Global In-Memory Store with fallback
let currentCmsStore: CmsContentSchema = { ...defaultCmsContent };

export function getCmsContent(): CmsContentSchema {
  return currentCmsStore;
}

export function updateCmsContent(patch: Partial<CmsContentSchema>): CmsContentSchema {
  currentCmsStore = {
    ...currentCmsStore,
    ...patch
  };
  return currentCmsStore;
}
