// Central CMS Data Store & Schema Definitions

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
    image: string;
    tag: string;
    badge: string;
    bio: string;
    benefits: string[];
    stat1_value: string;
    stat1_label: string;
    stat2_value: string;
    stat2_label: string;
    stat3_value: string;
    stat3_label: string;
    quote?: string;
    story?: string;
    students_count?: string;
    primary_markets?: string;
    access_badge?: string;
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
  theme?: {
    active_preset?: string;
    active_theme?: string; // backward compatibility
    custom_colors?: ThemeCustomColors;
  };
  screenshot_reviews?: {
    badge: string;
    title: string;
    subtitle: string;
    images: string[];
  };
}

export interface ThemeCustomColors {
  primary: string;
  primary_hover: string;
  secondary: string;
  dark_card: string;
  dark_bg: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  tag: string;
  colors: ThemeCustomColors;
}

export const DEFAULT_THEME_COLORS: ThemeCustomColors = {
  primary: '#00A0DF',
  primary_hover: '#008AC2',
  secondary: '#0074A6',
  dark_card: '#111827',
  dark_bg: '#0B0F19'
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default',
    name: 'Default Tech Cyan',
    tag: 'Signature Brand',
    colors: {
      primary: '#00A0DF',
      primary_hover: '#008AC2',
      secondary: '#0074A6',
      dark_card: '#111827',
      dark_bg: '#0B0F19'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Royal Sunset Orange',
    tag: 'High-Conversion Ecom',
    colors: {
      primary: '#FF6B00',
      primary_hover: '#E05E00',
      secondary: '#FFA043',
      dark_card: '#121318',
      dark_bg: '#08090C'
    }
  },
  {
    id: 'emerald-luxury',
    name: 'Dubai Emerald & Gold',
    tag: 'GCC Wealth & Prestige',
    colors: {
      primary: '#10B981',
      primary_hover: '#059669',
      secondary: '#F59E0B',
      dark_card: '#0C1A14',
      dark_bg: '#06120E'
    }
  },
  {
    id: 'cyber-violet',
    name: 'Neon Cyber Violet',
    tag: 'Cyberpunk Purple',
    colors: {
      primary: '#8B5CF6',
      primary_hover: '#7C3AED',
      secondary: '#EC4899',
      dark_card: '#140E26',
      dark_bg: '#0B0716'
    }
  },
  {
    id: 'crimson-ruby',
    name: 'Crimson Ruby & Black',
    tag: 'Bold Luxury Red',
    colors: {
      primary: '#EF4444',
      primary_hover: '#DC2626',
      secondary: '#F87171',
      dark_card: '#180C0E',
      dark_bg: '#0F0608'
    }
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold & Charcoal',
    tag: 'VIP Elite Gold',
    colors: {
      primary: '#EAB308',
      primary_hover: '#CA8A04',
      secondary: '#F59E0B',
      dark_card: '#16140D',
      dark_bg: '#0D0C07'
    }
  }
];

export function generateThemeCss(colors?: Partial<ThemeCustomColors>): string {
  const c = { ...DEFAULT_THEME_COLORS, ...(colors || {}) };

  const hexToRgb = (hex: string) => {
    if (!hex || typeof hex !== 'string') return '0, 160, 223';
    const clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return `${r}, ${g}, ${b}`;
    }
    if (clean.length >= 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return isNaN(r) ? '0, 160, 223' : `${r}, ${g}, ${b}`;
    }
    return '0, 160, 223';
  };

  const primaryRgb = hexToRgb(c.primary);
  const secRgb = hexToRgb(c.secondary || c.primary_hover);

  return `
    :root, [data-theme] {
      --primary: ${c.primary} !important;
      --primary-hover: ${c.primary_hover} !important;
      --primary-dark: ${c.primary_hover} !important;
      --primary-glow: rgba(${primaryRgb}, 0.45) !important;
      --primary-rgb: ${primaryRgb} !important;
      --theme-accent: ${c.primary} !important;
      --theme-secondary: ${c.secondary} !important;
      --dark-bg: ${c.dark_bg} !important;
      --dark-card: ${c.dark_card} !important;
    }
    .text-\\[\\#00A0DF\\], .text-\\[\\#00a0df\\] { color: var(--primary) !important; }
    .bg-\\[\\#00A0DF\\], .bg-\\[\\#00a0df\\] { background-color: var(--primary) !important; }
    .border-\\[\\#00A0DF\\], .border-\\[\\#00a0df\\] { border-color: var(--primary) !important; }
    .hover\\:bg-\\[\\#008ac2\\]:hover, .hover\\:bg-\\[\\#008ec7\\]:hover, .hover\\:bg-\\[\\#008bc2\\]:hover { background-color: var(--primary-hover) !important; }
    .hover\\:text-\\[\\#00A0DF\\]:hover, .hover\\:text-\\[\\#00a0df\\]:hover { color: var(--primary) !important; }
    .hover\\:border-\\[\\#00A0DF\\]:hover, .hover\\:border-\\[\\#00a0df\\]:hover { border-color: var(--primary) !important; }
    .fill-\\[\\#00A0DF\\], .fill-\\[\\#00a0df\\] { fill: var(--primary) !important; }
    [class*="bg-\\[\\#00A0DF\\]\\/"], [class*="bg-\\[\\#00a0df\\]\\/"] { background-color: rgba(${primaryRgb}, 0.15) !important; }
    [class*="border-\\[\\#00A0DF\\]\\/"], [class*="border-\\[\\#00a0df\\]\\/"] { border-color: rgba(${primaryRgb}, 0.3) !important; }
    [class*="text-\\[\\#00A0DF\\]\\/"], [class*="text-\\[\\#00a0df\\]\\/"] { color: rgba(${primaryRgb}, 0.85) !important; }
    [class*="shadow-\\[\\#00A0DF\\]"], [class*="shadow-\\[\\#00a0df\\]"] { --tw-shadow-color: rgba(${primaryRgb}, 0.35) !important; }
    [class*="from-\\[\\#00A0DF\\]"], [class*="from-\\[\\#00a0df\\]"] { --tw-gradient-from: ${c.primary} var(--tw-gradient-from-position) !important; }
    [class*="to-\\[\\#00A0DF\\]"], [class*="to-\\[\\#00a0df\\]"] { --tw-gradient-to: ${c.secondary || c.primary_hover} var(--tw-gradient-to-position) !important; }
    ::selection { background-color: ${c.primary} !important; color: #FFFFFF !important; }
  `;
}

export const defaultCmsContent: CmsContentSchema = {
  marquee: {
    is_active: true,
    items: [
      '🔥 RAMADAN SPECIAL 88% DISCOUNT &bull; PKR 3,799 ONLY FOR LIFETIME ACCESS',
      '⚡ 9,742+ SUCCESSFUL STUDENTS TRAINED ACROSS PAKISTAN, UAE & SAUDI ARABIA',
      '🚀 2026 UPDATED GCC SCALING BLUEPRINT WITH DIRECT DUBAI SUPPLIERS',
      '💬 DIRECT 1-ON-1 WHATSAPP MENTORSHIP WITH MENTOR SAMI INCLUDED'
    ]
  },
  hero: {
    badge: '2026 UPDATED DUBAI & SAUDI ARABIA DROPSHIPPING BLUEPRINT',
    title_line1: 'Learn How to Start Online Shopify',
    title_highlight: 'Dropshipping Store in UAE & KSA',
    subtitle: 'A proven step-by-step masterclass taking you from zero to your first AED 10,000+ per month with verified local GCC wholesale suppliers, winning products & high-ROI TikTok ads.',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    video_title: 'Watch Sami Explain the Entire UAE & KSA Dropshipping Model (10 Mins Overview)',
    original_price: 'PKR 32,500',
    current_price: 'PKR 3,799',
    seats_left: 12,
    cta_text: 'YES! I WANT TO LEARN THIS'
  },
  stats: {
    training_hours: '15+ Hours',
    lectures_count: '36 Lectures',
    access_type: 'Lifetime Access',
    mentorship_type: 'Direct WhatsApp Support'
  },
  mentor: {
    name: 'Muhammad Sami',
    title: 'Top E-Commerce Mentor & GCC Dropshipping Expert',
    image: '/images/sami-logo.jpg',
    tag: 'YOUR MENTOR',
    badge: 'Digital Marketing Expert',
    bio: 'You don’t just need the right mentor — you need the right community too. Both are included in your purchase today.',
    benefits: [
      'Lifetime WhatsApp support',
      'Private Facebook community',
      'Private WhatsApp community',
      'Smooth, guided journey'
    ],
    stat1_value: '9,700+',
    stat1_label: 'Students mentored',
    stat2_value: 'UAE & KSA',
    stat2_label: 'Market focus',
    stat3_value: 'Lifetime',
    stat3_label: 'Access & support',
    quote: 'You Don’t Need Millions To Start. You Just Need A Proven Step-by-Step Blueprint.',
    story: 'When I started dropshipping, the biggest hurdle wasn’t the technical setup — it was the lack of reliable local supplier contacts in the GCC and constant trial-and-error wasting hard-earned ad spend.\n\nAfter years of testing, scaling, and establishing direct relationships with verified warehouses across Dubai, Sharjah, and Riyadh, I designed this training specifically for beginners in Pakistan who want to earn in Dirhams and Riyals from home.\n\nOur goal is simple: eliminate the guesswork, give you direct phone numbers to real suppliers, teach you high-converting TikTok & Facebook media buying, and provide live mentorship whenever you get stuck.',
    students_count: '9,700+',
    primary_markets: 'UAE & Saudi Arabia (KSA)',
    access_badge: 'Verified Mentor & Coach'
  },
  bonuses: {
    tag: 'EXCLUSIVE POWER BONUSES',
    title: 'Get 6 Game-Changing Bonuses Worth Over',
    highlight_value: 'Rs 30,000 Free',
    subtitle: 'When you enroll today for PKR 3,799, you get all software tools, supplier contacts, and ad blueprints completely free of charge.',
    items: [
      {
        title: 'Verified UAE & Saudi Arabia Suppliers Directory',
        desc: 'Direct WhatsApp contacts of trusted wholesale suppliers in Dubai (Deira), Sharjah, and Riyadh with 24-48 hours COD delivery.',
        value: 'Rs 10,000 Value'
      },
      {
        title: 'High-Converting Premium Shopify Theme (ZIP)',
        desc: 'The exact custom-coded, ultra-fast converting theme used on our 7-figure stores. Clean, mobile-first design with 1-click upsells.',
        value: 'Rs 8,500 Value'
      },
      {
        title: 'Ready-to-Use Facebook & TikTok Ads Blueprint',
        desc: 'Pre-written ad copy templates, campaign testing structures, targeting setups, and hook scripts in Arabic & English.',
        value: 'Rs 5,000 Value'
      },
      {
        title: 'E-Commerce P&L Margin & Profit Calculator (Excel)',
        desc: 'Track advertising spend, product cost, shipping courier fees, COD delivery rates, and net profit margins automatically.',
        value: 'Rs 3,000 Value'
      },
      {
        title: 'Winning Product Hunt Checklist & Spy Prompts',
        desc: '15-point criteria checklist to discover untapped winning products with high profit margins before your competitors do.',
        value: 'Rs 2,500 Value'
      },
      {
        title: 'Direct WhatsApp Mentorship Desk Access',
        desc: 'Private direct WhatsApp assistance for account verification, ad troubleshooting, pixel errors, and scaling questions.',
        value: 'Priceless'
      }
    ]
  },
  why_dropshipping: {
    badge: 'WHY UAE & KSA MARKETS',
    title: 'Why GCC Dropshipping is the #1 Opportunity in 2026',
    subtitle: 'Unlike saturated western markets or low-margin local markets, UAE and Saudi Arabia offer high purchasing power and low ad costs.',
    items: [
      {
        title: 'High Purchasing Power (Dirhams & Riyals)',
        desc: 'Customers in Dubai and Riyadh spend heavily online. Average order value (AOV) is 3x to 5x higher than local Pakistani stores.'
      },
      {
        title: 'Cheap TikTok & Facebook Ad Costs (High ROAS)',
        desc: 'Ad impressions and clicks cost significantly less compared to USA/UK, allowing high 4x-10x Return On Ad Spend.'
      },
      {
        title: 'No Need to Buy Inventory Upfront (Zero Stock Risk)',
        desc: 'Local wholesale warehouses in UAE fulfill orders directly via Cash-on-Delivery (COD). You only pay after the customer pays!'
      },
      {
        title: 'Operate 100% from Pakistan with Laptop & Internet',
        desc: 'You manage store setup, marketing, and customer support remotely from home while couriers handle local delivery in UAE/KSA.'
      }
    ]
  },
  options_comparison: {
    diy_title: 'Option A: Figuring It Out Yourself',
    diy_points: [
      'Wasting Rs 50,000+ on banned TikTok & Meta ad accounts',
      'Working with fake or scam suppliers who steal deposits',
      'Selling saturated products with 70%+ return rates',
      'Months of frustration with zero mentorship or guidance'
    ],
    sami_title: 'Option B: The Ecom With Sami Shortcut',
    sami_points: [
      'Proven step-by-step roadmap tested on 9,700+ students',
      'Direct WhatsApp directory of verified GCC wholesale suppliers',
      'Copy-paste winning ad scripts and product selection criteria',
      'Direct WhatsApp access to mentor Sami for fast answers'
    ]
  },
  cost_of_waiting: {
    title: 'The Real Cost of Waiting Another Month',
    subtitle: 'Every day you delay starting is another day of potential Dirhams and Riyals made by someone else.',
    cards: [
      {
        label: 'Delaying 30 Days',
        title: 'Lost Time & Momentum',
        desc: 'Watching others post screenshot proofs while you stay stuck in the same position.'
      },
      {
        label: 'Price Increase',
        title: 'Paying Rs 32,500 Full Price Later',
        desc: 'This special 88% discounted fee (PKR 3,799) is strictly for this limited batch.'
      },
      {
        label: 'Market Opportunity',
        title: 'Rising Ad Costs in Q4',
        desc: 'Taking advantage of early market arbitrage in UAE & Saudi before competition grows.'
      }
    ]
  },
  faqs: [
    {
      q: 'Do I need any previous technical experience to join?',
      a: 'No prior coding or e-commerce experience is required. The course starts from absolute basics (Shopify store setup from scratch) to advanced scaling.'
    },
    {
      q: 'Can I do this business while living in Pakistan?',
      a: 'Yes, 100%. Over 90% of our students run their UAE and Saudi Arabia stores directly from Pakistan using their laptop or mobile phone.'
    },
    {
      q: 'How much budget is needed after enrolling?',
      a: 'Since you do not need to buy inventory in advance (COD model), you only need around PKR 10,000 to PKR 15,000 for domain and testing ads.'
    },
    {
      q: 'How do I access the LMS classroom after payment?',
      a: 'As soon as you submit the enrollment form with your receipt, your login credentials will be generated and you can log in at /login.'
    },
    {
      q: 'How do I get help if I get stuck?',
      a: 'You receive direct WhatsApp mentorship support where mentor Sami and his senior team assist with ad accounts and store reviews.'
    }
  ],
  testimonials: [
    {
      name: 'Hamza Tariq',
      city: 'Lahore',
      sales: 'AED 8,920 in 14 Days',
      orders: '42 Delivered Orders',
      quote: 'Sami bhai ke verified supplier directory ne meri life badal di. Pehle scam supplier se loss hoa tha, ab daily orders ship ho rahe hain!',
      market: 'UAE Market',
      initials: 'HT'
    },
    {
      name: 'Bilal Ahmad',
      city: 'Karachi',
      sales: 'SAR 12,450 in 3 Weeks',
      orders: '68 Orders',
      quote: 'TikTok ads strategy jo module 4 mein sikhayi hai wo 100% working hai. 5.8 ROAS mila mujhe pehle hi campaign mein.',
      market: 'Saudi Arabia',
      initials: 'BA'
    },
    {
      name: 'Usman Ghani',
      city: 'Islamabad',
      sales: 'AED 4,850 First Week',
      orders: '24 Orders',
      quote: 'Rs 3,799 mein itna practical aur updated content koi nahi deta Pakistan mein. Highly recommended!',
      market: 'UAE Market',
      initials: 'UG'
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
  },
  theme: {
    active_preset: 'default',
    active_theme: 'default',
    custom_colors: { ...DEFAULT_THEME_COLORS }
  },
  screenshot_reviews: {
    badge: 'REAL STUDENT RESULTS',
    title: 'Join 9,700+ Happy Students',
    subtitle: 'Real, unedited screenshots from our students — results & feedback.',
    images: [
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-312-1.webp',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-309.webp',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-311.webp',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-315.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-353.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-351.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-356.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-349.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-313.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-310.webp',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-314.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-362.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-352.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-360.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-354.jpg',
      'https://learnwithafaq.com/wp-content/uploads/2025/11/image-350.jpg'
    ]
  }
};

let inMemoryCmsStore: CmsContentSchema = { ...defaultCmsContent };

export function getCmsContent(): CmsContentSchema {
  return inMemoryCmsStore;
}

export function updateCmsContent(patch: Partial<CmsContentSchema>): CmsContentSchema {
  inMemoryCmsStore = {
    ...inMemoryCmsStore,
    ...patch
  };
  return inMemoryCmsStore;
}

