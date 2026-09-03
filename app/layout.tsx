import type { Metadata } from 'next';
import './globals.css';
import { DynamicPixels } from '@/components/tracking';
import { WhatsAppWidget } from '@/components/common';
import { StickyMobileCta } from '@/components/layout';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Master UAE & KSA Dropshipping | Ecom With Sami',
  description: 'Learn UAE & KSA Shopify dropshipping step-by-step in Urdu. 9,700+ students trained, lifetime mentorship, verified supplier directory, and ads training. Start today for PKR 3,900.',
  keywords: ['Shopify dropshipping Pakistan', 'UAE dropshipping', 'KSA dropshipping', 'Ecom With Sami', 'Shopify Course in Urdu'],
  openGraph: {
    title: 'Master UAE & KSA Dropshipping | Ecom With Sami',
    description: 'Build a profitable online Shopify dropshipping business from scratch with mentor Sami.',
    type: 'website',
    locale: 'en_US'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
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
