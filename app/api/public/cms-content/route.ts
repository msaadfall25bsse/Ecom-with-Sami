import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    sections: {
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
        title: 'Learn how to start online dropshipping store in uae & ksa step-by-step training',
        subtitle: 'Beginner Friendly Training from Basics',
        original_price: '32,500 PKR',
        current_price: '3,900 PKR',
        seats_left: 12
      },
      bonuses: {
        tag: '🎁 FREE BONUSES',
        title: 'Free Bonuses Worth',
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
      }
    }
  });
}
