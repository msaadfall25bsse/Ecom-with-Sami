import type { Metadata } from 'next';
import './globals.css';
import { DynamicPixels, LiveVisitorTracker } from '@/components/tracking';
import { WhatsAppWidget } from '@/components/common';
import { StickyMobileCta } from '@/components/layout';
import { dbGetCmsSettings } from '@/lib/database';
import { generateThemeCss, DEFAULT_THEME_COLORS } from '@/utils/cmsStore';

import { JsonLd } from '@/components/seo/JsonLd';

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL('https://ecomwithsami.com'),
  title: 'Ecom With Sami',
  description: 'Learn UAE & KSA Shopify dropshipping step-by-step in Urdu. 9,700+ students trained, lifetime mentorship, verified supplier directory, and high-ROI ads training. Start today for PKR 3,799.',
  applicationName: 'Ecom With Sami',
  authors: [{ name: 'Sami Ullah', url: 'https://ecomwithsami.com/about' }],
  creator: 'Sami Ullah',
  publisher: 'Ecom With Sami',
  keywords: [
    'Ecom With Sami',
    'Shopify dropshipping Pakistan',
    'UAE dropshipping course',
    'KSA dropshipping training',
    'Shopify Course in Urdu',
    'GCC Wholesale Suppliers',
    'TikTok Ads Pakistan',
    'Cash on Delivery UAE',
    'Ecom Sami LMS',
    'Sami Ullah dropshipping mentor'
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Ecom With Sami',
    description: 'Learn UAE & KSA Shopify dropshipping step-by-step in Urdu with mentor Sami. 9,700+ students trained across Pakistan, UAE, and KSA.',
    url: 'https://ecomwithsami.com',
    siteName: 'Ecom With Sami',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/sami-logo.jpg',
        width: 800,
        height: 800,
        alt: 'Ecom With Sami',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ecom With Sami',
    description: 'Build a profitable online Shopify dropshipping business from scratch with mentor Sami. 9,700+ students trained.',
    images: ['/sami-logo.jpg'],
    creator: '@ecomwithsami',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png?v=sami2026', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=sami2026', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico?v=sami2026', sizes: 'any' },
      { url: '/icon.png?v=sami2026', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico?v=sami2026',
    apple: [
      { url: '/apple-icon.png?v=sami2026', sizes: '180x180', type: 'image/png' },
    ],
  },
  category: 'education',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let activeTheme = 'default';
  let customColors = { ...DEFAULT_THEME_COLORS };

  try {
    const cms = await dbGetCmsSettings();
    if (cms?.theme) {
      if (cms.theme.active_preset) activeTheme = cms.theme.active_preset;
      else if (cms.theme.active_theme) activeTheme = cms.theme.active_theme;

      if (cms.theme.custom_colors) {
        customColors = { ...DEFAULT_THEME_COLORS, ...cms.theme.custom_colors };
      }
    }
  } catch (e) {}

  const dynamicCss = generateThemeCss(customColors);

  return (
    <html lang="en" data-theme={activeTheme} className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        {/* Immediate Browser Tab Favicon Invalidation (Cache Busting) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=sami2026" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=sami2026" />
        <link rel="shortcut icon" href="/favicon.ico?v=sami2026" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=sami2026" />
        <JsonLd />
        {/* Google tag (gtag.js) - Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FJBC4S9KM3" />
        <script
          id="google-analytics-tag"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FJBC4S9KM3');
            `,
          }}
        />
        <link rel="preconnect" href="https://img.youtube.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <style id="sami-dynamic-theme" dangerouslySetInnerHTML={{ __html: dynamicCss }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t=localStorage.getItem('sami_active_theme')||(document.cookie.match(/sami_active_theme=([^;]+)/)||[])[1];
              if(t){document.documentElement.setAttribute('data-theme',t);}
              var raw=localStorage.getItem('sami_theme_css');
              if(raw){
                var el=document.getElementById('sami-dynamic-theme');
                if(el){el.innerHTML=raw;}
              }
            }catch(e){}})();`
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-[#00A0DF] selection:text-white">
        <DynamicPixels />
        <LiveVisitorTracker />
        {children}
        <WhatsAppWidget />
        <StickyMobileCta />
      </body>
    </html>
  );
}
