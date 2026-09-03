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
      '🔥 RAMADAN SPECIAL 88% DISCOUNT &bull; PKR 3,900 ONLY FOR LIFETIME ACCESS',
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
    current_price: 'PKR 3,900',
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
    name: 'Sardar Samiullah (Sami Ur Rehman)',
    title: 'Top E-Commerce Mentor & GCC Dropshipping Expert',
    bio: 'Founder of Ecom With Sami. Over 5+ years of active e-commerce experience scaling 7-figure stores across Dubai, Sharjah, Riyadh, and Jeddah. Trained over 9,700 students.',
    students_count: '9,742+',
    primary_markets: 'UAE & Saudi Arabia (KSA)',
    access_badge: 'Verified Mentor & Coach'
  },
  bonuses: {
    tag: 'EXCLUSIVE POWER BONUSES',
    title: 'Get 6 Game-Changing Bonuses Worth Over',
    highlight_value: 'Rs 30,000 Free',
    subtitle: 'When you enroll today for PKR 3,900, you get all software tools, supplier contacts, and ad blueprints completely free of charge.',
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
        desc: 'This special 88% discounted fee (PKR 3,900) is strictly for this limited batch.'
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
      quote: 'Rs 3,900 mein itna practical aur updated content koi nahi deta Pakistan mein. Highly recommended!',
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

