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
    top_pill_badge?: string;
    program_badge?: string;
    video_header?: string;
    trusted_text?: string;
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
  what_you_get: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  who_is_this_for: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      highlight?: string;
      desc: string;
    }[];
  };
  video_reviews: {
    badge: string;
    title: string;
    subtitle: string;
    items: {
      headline: string;
      author: string;
      result: string;
      market: string;
      videoUrl: string;
      stars: number;
    }[];
  };
  options_comparison: {
    badge?: string;
    title?: string;
    subtitle?: string;
    diy_badge?: string;
    diy_title: string;
    diy_subtitle?: string;
    diy_points: string[];
    sami_badge?: string;
    sami_title: string;
    sami_subtitle?: string;
    sami_points: string[];
  };
  cost_of_waiting: {
    badge?: string;
    title: string;
    subtitle: string;
    banner_text?: string;
    cards: {
      label: string;
      title: string;
      desc: string;
    }[];
  };
  final_cta: {
    badge: string;
    title: string;
    title_highlight: string;
    subtitle: string;
    cta_text: string;
    guarantee_text: string;
  };
  footer: {
    disclaimer: string;
    copyright: string;
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
  homepage_proof_wall?: {
    badge: string;
    title: string;
    subtitle: string;
    images: string[];
  };
  success_page?: {
    badge: string;
    title_line1: string;
    title_highlight: string;
    subtitle: string;
    stat1_value: string;
    stat1_label: string;
    stat2_value: string;
    stat2_label: string;
    stat3_value: string;
    stat3_label: string;
    stat4_value: string;
    stat4_label: string;
    section_badge: string;
    section_title: string;
    section_subtitle: string;
  };
  checkout_page?: {
    badge: string;
    title: string;
    subtitle: string;
    timer_heading: string;
    timer_hours: number;
    timer_minutes: number;
    timer_seconds: number;
    timer_anchor_time?: number;
    seats_left_text: string;
    seats_filled_percent: number;
    trust_badge1: string;
    trust_badge2: string;
    trust_badge3: string;
  };
  homepage_curriculum?: {
    tag?: string;
    title?: string;
    subtitle?: string;
    modules: {
      id: string;
      title: string;
      lessons: string[];
    }[];
  };
  why_different?: {
    is_active: boolean;
    title: string;
    subtitle: string;
    cards: {
      number: string;
      title: string;
      desc: string;
    }[];
  };
  signature_framework?: {
    is_active: boolean;
    eyebrow: string;
    title: string;
    description: string;
    cta_text: string;
    step1_title: string;
    step1_desc: string;
    step2_title: string;
    step2_desc: string;
    step3_title: string;
    step3_desc: string;
    order_booster_title: string;
    order_booster_desc: string;
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
    badge: '',
    top_pill_badge: 'Pakistan’s Premier E-commerce Mentorship',
    title_line1: 'Learn Local Dropshipping and Build Your Own Brand ',
    title_highlight: 'And Grow Your Business From Pakistan',
    subtitle: '',
    video_url: '/api/videos/hero_1788788057970_1783397199_lv020260707085046',
    video_title: '',
    program_badge: 'Ecominion Program ',
    video_header: 'Watch this 128 seconds of video to learn how easy it is',
    trusted_text: 'Trusted by 350+ Students',
    original_price: 'PKR 14,999',
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
  what_you_get: {
    badge: 'WHAT YOU GET',
    title: 'WHAT YOU’LL MASTER INSIDE ECOMINION',
    subtitle: 'Not just videos. You’ll learn the systems behind building, testing and scaling an e-commerce business.',
    items: [
      {
        title: 'WINNING PRODUCT RESEARCH',
        desc: 'Learn how to identify, validate and test products before putting your budget behind them.'
      },
      {
        title: 'STORE DESIGN & CRO',
        desc: 'Build a Shopify store designed to earn trust, improve conversions and turn visitors into customers.'
      },
      {
        title: 'META & TIKTOK ADS',
        desc: 'Learn campaign setup, creative testing, pixel, tracking and scaling across the two major paid platforms.'
      },
      {
        title: 'PIXEL, DATA & SCALING',
        desc: 'Understand the data behind your campaigns, make better decisions and learn how to scale what works.'
      }
    ]
  },
  why_different: {
    is_active: true,
    title: 'WHY ECOMINION IS DIFFERENT',
    subtitle: 'Because we’re not teaching you to copy a product. We’re teaching you to understand the business behind it.',
    cards: [
      {
        number: '01',
        title: 'PRACTICAL FROM DAY ONE',
        desc: 'No unnecessary theory. Learn through actual e-commerce workflows, decisions and practical execution.'
      },
      {
        number: '02',
        title: 'PAKISTAN-FIRST',
        desc: 'Understand the local market, local selling environment and fundamentals before trying to expand internationally.'
      },
      {
        number: '03',
        title: 'SYSTEMS, NOT SHORTCUTS',
        desc: 'Product research, CRO, pixel, ads, testing, data and scaling — learn how the pieces work together.'
      },
      {
        number: '04',
        title: 'BEYOND THE FIRST SALE',
        desc: 'The goal isn’t simply to get one order. Learn what happens after the first sale and how to build a repeatable system.'
      }
    ]
  },
  signature_framework: {
    is_active: true,
    eyebrow: 'SIGNATURE FRAMEWORK',
    title: 'THE 3S SCALING FORMULA™',
    description: 'My signature framework for understanding the journey from testing products to selling and scaling with a structured system.',
    cta_text: 'EXPLORE THE 3S →',
    step1_title: 'Shift 01: Product Validation & Market Testing',
    step1_desc: 'Identify, test and validate winning products using proven criteria before allocating serious advertising budget.',
    step2_title: 'Shift 02: High-Converting Store Architecture & CRO',
    step2_desc: 'Build customer trust, optimize checkout friction and achieve industry-leading conversion rates.',
    step3_title: 'Shift 03: Paid Traffic Mastery & Systematized Scaling',
    step3_desc: 'Scale winning Meta and TikTok ad campaigns profitably with systematic pixel tracking and cash-flow control.',
    order_booster_title: 'ORDER BOOSTER SYSTEM',
    order_booster_desc: 'Our proprietary post-purchase and WhatsApp automation framework that slashes cancellation rates and increases average order value.'
  },
  who_is_this_for: {
    badge: 'PERFECT FOR YOU IF…',
    title: 'Who Is This For?',
    subtitle: 'No matter where you’re starting from, this program meets you there.',
    items: [
      {
        title: 'If You’re a Complete',
        highlight: 'Beginner',
        desc: 'No idea how to start? I’ll guide you step by step. By the end, you’ll have a fully working Shopify store and a clear roadmap to your first sale.'
      },
      {
        title: 'If You’re',
        highlight: 'Struggling With Ads',
        desc: 'Confused by Facebook or TikTok ads? Learn to create high-converting campaigns, target the right audience, and scale your sales the right way.'
      },
      {
        title: 'If You’re a',
        highlight: 'Business Owner',
        desc: 'Want to add a profitable eCommerce stream? Learn to find winning products, source reliable UAE & KSA suppliers, and automate your store.'
      },
      {
        title: 'Ready to',
        highlight: 'Master Store Management',
        desc: 'Start dropshipping with minimal investment while getting lifetime mentorship and proven strategies to grow your online business skills.'
      },
      {
        title: 'If You’re Already',
        highlight: 'Running a Store',
        desc: 'Struggling to scale or manage campaigns? Learn advanced scaling techniques, automation tools, and ad strategies to reach the next level.'
      },
      {
        title: 'If You’re a',
        highlight: 'Freelancer or Side Hustler',
        desc: 'Add dropshipping to your skillset and earn extra income online. Learn product research, ad mastery, and store management to start fast.'
      }
    ]
  },
  video_reviews: {
    badge: 'REAL STUDENT RESULTS',
    title: 'Hear What Our Students Are Saying',
    subtitle: 'Real student video reviews sharing their experience, support, and results after joining Ecom With Sami.',
    items: [
      {
        stars: 5,
        headline: '“Total beginners are now getting AED 1,000–1,500 in daily sales.”',
        author: 'Ali Raza — Lahore',
        result: 'AED 1,500 / Day',
        market: 'UAE Market',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“After getting mentorship and watching the course, I made €662 in sales within 6 days.”',
        author: 'Raza Ali — Karachi',
        result: '€662 in 6 Days',
        market: 'GCC & Global',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“AED 5,000 in sales and 56 orders within 5 days with supplier help.”',
        author: 'Hamza Tariq — Islamabad',
        result: 'AED 5,000 / Week',
        market: 'UAE Dropship',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“Students say the course is very easy to understand and follow on mobile.”',
        author: 'Zainab Bibi — Faisalabad',
        result: 'PKR 480,000 / Mo',
        market: 'Saudi & UAE',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“26 orders and AED 2,500 in sales with the direct help of Mentor Sami.”',
        author: 'Usman Ghani — Rawalpindi',
        result: 'AED 2,500 Sales',
        market: 'UAE Market',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“AED 1,485 in sales in just 3 days while working from home.”',
        author: 'Bilal Farooq — Multan',
        result: 'SAR 3,485 Profit',
        market: 'Saudi Market',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        stars: 5,
        headline: '“I tried many courses before, but Sami’s practical GCC supplier list made all the difference.”',
        author: 'Farhan Sheikh — Peshawar',
        result: 'SAR 6,100 / 10 Days',
        market: 'KSA Market',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  options_comparison: {
    badge: 'YOUR CHOICE',
    title: 'Now You Have 2 Options Left',
    subtitle: 'One keeps you stuck. The other moves you forward.',
    diy_badge: 'OPTION 01',
    diy_title: 'Do It Yourself',
    diy_subtitle: 'The slow, frustrating road',
    diy_points: [
      'Keep guessing what works and what doesn’t',
      'Watch others grow while you’re still “figuring it out”',
      'Waste months testing random tips',
      'Lose motivation before you see any results'
    ],
    sami_badge: 'OPTION 02',
    sami_title: 'Join the Ecommestry Program',
    sami_subtitle: 'The proven, guided shortcut',
    sami_points: [
      'Learn what truly drives profitable stores — step by step',
      'Follow a tested system instead of guesswork',
      'Get structured guidance that reduces costly mistakes',
      'Lifetime support to guide you the whole journey'
    ]
  },
  cost_of_waiting: {
    badge: '⏳ BEFORE YOU CLOSE THIS PAGE',
    title: 'What Does Waiting Really Cost You?',
    subtitle: 'The price isn\'t just the course fee. It\'s everything that stays exactly the same if nothing changes today.',
    banner_text: '🎯 This isn\'t just a course decision. It\'s a decision about where you\'ll be 6 months from now.',
    cards: [
      {
        label: '3 MONTHS FROM NOW',
        title: 'Still Stuck at "Someday"',
        desc: 'You\'re still watching free videos, still saving posts, still telling yourself you\'ll start next month. Same questions, zero progress.'
      },
      {
        label: '1 YEAR FROM NOW',
        title: 'Watching Others Move Ahead',
        desc: 'People who started today will already have a live store and real experience. You\'ll be watching their wins thinking "I could have done that too."'
      },
      {
        label: 'EXPENSIVE GUESSING',
        title: 'Money Lost to Trial & Error',
        desc: 'Most beginners burn a big chunk of ad budget testing blindly — with little to show for it. A proven system saves you from paying that "tuition".'
      },
      {
        label: 'RISING COMPETITION',
        title: 'Late Entry = Harder Game',
        desc: 'E-commerce grows every year. The longer you wait, the more crowded the market gets — and the harder it is to stand out as a beginner.'
      },
      {
        label: 'WASTED MONTHS',
        title: 'The Slow, Lonely Route',
        desc: 'Figuring it all out alone can take 6–12 months of confusion. With a clear step-by-step roadmap, you skip the guesswork and move with confidence.'
      },
      {
        label: 'THE REAL MATH',
        title: 'Course Fee vs. The Cost',
        desc: 'The course costs less than what most beginners waste on a single failed ad test. The real question isn\'t "can I afford it?" — it\'s "can I afford another year of standing still?"'
      }
    ]
  },
  final_cta: {
    badge: 'JOIN 9,700+ STUDENTS',
    title: 'Take the First Step Toward a',
    title_highlight: 'Profitable Dropshipping Business',
    subtitle: 'Thousands of beginners across UAE & KSA markets have already started. Today it\'s your turn.',
    cta_text: 'YES! I WANT TO LEARN THIS',
    guarantee_text: '14-day money-back guarantee • Lifetime access & support'
  },
  footer: {
    disclaimer: 'Results are not guaranteed and will vary based on individual effort, market conditions, and other factors. Every person is different, and your level of success depends on your experience, dedication, and hard work.',
    copyright: 'Ecom With Sami. All rights reserved.'
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
    images: []
  },
  homepage_proof_wall: {
    badge: 'STUDENT RESULTS',
    title: 'Students Success',
    subtitle: 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.',
    images: ['/uploads/reviews/whatsapp_review_sample.jpg']
  },
  success_page: {
    badge: 'VERIFIED STUDENT PROOF',
    title_line1: 'Real Students. Real Stores.',
    title_highlight: 'Real Results.',
    subtitle: 'Explore real earnings screenshots, case studies, and reviews from over 9,700 students who joined the Ecom With Sami mentorship.',
    stat1_value: '9,700+',
    stat1_label: 'Total Students',
    stat2_value: '89%',
    stat2_label: 'First Sale in 14 Days',
    stat3_value: '4.9 / 5.0',
    stat3_label: 'Student Rating',
    stat4_value: 'PKR 3,799',
    stat4_label: 'One-Time Fee',
    section_badge: 'STUDENT PROOF',
    section_title: 'Featured Case Studies & Results',
    section_subtitle: 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.'
  },
  checkout_page: {
    badge: 'OFFICIAL ENROLLMENT • 88% DISCOUNT APPLIED',
    title: 'UAE & KSA Shopify Dropshipping Mentorship',
    subtitle: 'Get lifetime access to 11 video modules, verified GCC suppliers directory & WhatsApp ad mentorship.',
    timer_heading: 'Discount Offer Ends In:',
    timer_hours: 2,
    timer_minutes: 27,
    timer_seconds: 38,
    timer_anchor_time: 1773100000000,
    seats_left_text: 'Only 12 seats left at this price',
    seats_filled_percent: 88,
    trust_badge1: 'Lifetime Access',
    trust_badge2: 'Instant LMS Activation',
    trust_badge3: '9,700+ Students'
  },
  homepage_curriculum: {
    tag: 'COMPLETE COURSE CURRICULUM',
    title: 'Everything You Get Inside the Course',
    subtitle: 'Start from zero and build your own UAE & KSA store, step by step.',
    modules: [
      {
        id: 'mod_1',
        title: 'Module 1: GCC Dropshipping Fundamentals & Opportunity',
        lessons: [
          '1.1 GCC Dropshipping Overview & Market Arbitrage',
          '1.2 Mindset, Capital Requirements & Legal Structure',
          '1.3 Selecting Between UAE (AED) vs Saudi Arabia (SAR)'
        ]
      },
      {
        id: 'mod_2',
        title: 'Module 2: High-Converting Shopify Store Architecture',
        lessons: [
          '2.1 Shopify Account Creation & Partner Plan Setup',
          '2.2 Installing the Free High-Converting Custom Theme',
          '2.3 Setting Up Fast COD Form & WhatsApp Floating Chat',
          '2.4 Currency Converters & Arabic Multi-language Integration'
        ]
      },
      {
        id: 'mod_3',
        title: 'Module 3: Winning Product Research & Validation Criteria',
        lessons: [
          '3.1 The 15-Point Winning Product Matrix for GCC',
          '3.2 Spying on Top Dubai Competitors via TikTok Ads Library',
          '3.3 Product Margin & Break-Even ROAS Calculation'
        ]
      },
      {
        id: 'mod_4',
        title: 'Module 4: Sourcing from Verified Wholesale UAE & KSA Suppliers',
        lessons: [
          '4.1 How to Negotiate with Deira & Riyadh Warehouse Managers',
          '4.2 Utilizing the Private Supplier Directory Included in Course',
          '4.3 Handling Stock Availability, Packaging & QA Inspections'
        ]
      },
      {
        id: 'mod_5',
        title: 'Module 5: TikTok Ads Mastery & Pixel Integration',
        lessons: [
          '5.1 Creating TikTok Agency Ad Accounts Without Bans',
          '5.2 TikTok Pixel & Events API Setup via Google Tag Manager',
          '5.3 The CBO Testing Framework (Rs 5,000 to 50 Orders)',
          '5.4 UGC Video Creation & Hook Formulas That Print Dirhams'
        ]
      },
      {
        id: 'mod_6',
        title: 'Module 6: Facebook & Instagram Ads Scaling Engine',
        lessons: [
          '6.1 Meta Business Manager Verification & Pixel Setup',
          '6.2 Advantage+ Campaigns vs Manual Broad Targeting',
          '6.3 Retargeting Sequences & Dynamic Product Ads (DPA)',
          '6.4 Scaling Winning Ad Sets to AED 5,000/Day Safely'
        ]
      },
      {
        id: 'mod_7',
        title: 'Module 7: WhatsApp Automation & Order Confirmation Funnel',
        lessons: [
          '7.1 Setting Up Automated WhatsApp Confirmation Flows',
          '7.2 Gulf Arabic Voice Note Scripts That Reduce Cancellations',
          '7.3 Address Verification Hacks (Dubai Al-Barsha, Riyadh Olaya)'
        ]
      },
      {
        id: 'mod_8',
        title: 'Module 8: Courier Logistics, COD Remittance & Return Rate (RTO) Control',
        lessons: [
          '8.1 Courier Onboarding (SMSA, Aramex, Zajil, Local Couriers)',
          '8.2 Tracking Remittances & Withdrawing PKR to Pakistani Banks',
          '8.3 RTO Minimization Strategies & Re-delivery Automation'
        ]
      },
      {
        id: 'mod_9',
        title: 'Module 9: Financial Management, P&L Tracking & Currency Transfers',
        lessons: [
          '9.1 E-Commerce Profit & Loss Spreadsheet Walkthrough',
          '9.2 Managing Credit Limits for Ads & Working Capital',
          '9.3 Tax Considerations & Long-Term Wealth Planning'
        ]
      },
      {
        id: 'mod_10',
        title: 'Module 10: Building a Private Label Brand in UAE & Saudi Arabia',
        lessons: [
          '10.1 When and How to Transition into Private Label',
          '10.2 Custom Packaging & Arabic Labeling Regulations',
          '10.3 Trademark Registration in UAE & Saudi Arabia (MOC)'
        ]
      },
      {
        id: 'mod_11',
        title: 'Module 11: Scaling to 7-Figures & Team Hiring Blueprint',
        lessons: [
          '11.1 Hiring & Training Customer Support VAs on Upwork',
          '11.2 Standard Operating Procedures (SOPs) for Daily Store Ops',
          '11.3 Final Words of Wisdom from Mentor Sardar Samiullah'
        ]
      }
    ]
  }
};

let inMemoryCmsStore: CmsContentSchema = { ...defaultCmsContent };

export function getCmsContent(): CmsContentSchema {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('sami_cms_content');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          inMemoryCmsStore = { ...inMemoryCmsStore, ...parsed };
        }
      }
    } catch (e) {}
  }
  return inMemoryCmsStore;
}

export function updateCmsContent(patch: Partial<CmsContentSchema>): CmsContentSchema {
  inMemoryCmsStore = {
    ...inMemoryCmsStore,
    ...patch
  };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('sami_cms_content', JSON.stringify(inMemoryCmsStore));
    } catch (e) {}
  }
  return inMemoryCmsStore;
}

