import type { Metadata } from 'next';
import './globals.css';
import { DynamicPixels } from '@/components/tracking';
import { WhatsAppWidget } from '@/components/common';
import { StickyMobileCta } from '@/components/layout';
import { dbGetCmsSettings } from '@/lib/database';
import { generateThemeCss, DEFAULT_THEME_COLORS } from '@/utils/cmsStore';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Master UAE & KSA Dropshipping | Ecom With Sami',
  description: 'Learn UAE & KSA Shopify dropshipping step-by-step in Urdu. 9,700+ students trained, lifetime mentorship, verified supplier directory, and ads training. Start today for PKR 3,799.',
  keywords: ['Shopify dropshipping Pakistan', 'UAE dropshipping', 'KSA dropshipping', 'Ecom With Sami', 'Shopify Course in Urdu'],
  openGraph: {
    title: 'Master UAE & KSA Dropshipping | Ecom With Sami',
    description: 'Build a profitable online Shopify dropshipping business from scratch with mentor Sami.',
    type: 'website',
    locale: 'en_US'
  }
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
        {children}
        <WhatsAppWidget />
        <StickyMobileCta />
      </body>
    </html>
  );
}
