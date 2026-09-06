import { useState, useEffect } from 'react';
import { getCmsContent, defaultCmsContent } from './cmsStore';

export interface ContactConfig {
  email: string;
  phone: string;
  displayPhone: string;
  headOffice: string;
  regionalOffice: string;
  supportHours: string;
  whatsappGreeting?: string;
  getWhatsAppUrl: (message?: string) => string;
}

export const contactConfig: ContactConfig = {
  email: 'ecomwithsamiofficial@gmail.com',
  phone: '+923330093269',
  displayPhone: '+92 333 0093269',
  headOffice: 'Office #402, 4th Floor, Executive Heights, Gulberg III, Lahore, Pakistan',
  regionalOffice: 'DHA Phase 6, Karachi, Pakistan',
  supportHours: '9:00 AM – 5:00 PM PKT (Mon – Sat)',
  whatsappGreeting: 'Salam Sami! I am interested in joining the 2026 Dropshipping Masterclass. Please share details.',
  getWhatsAppUrl: (message?: string) => {
    const defaultMsg = 'Salam Sami! I am interested in joining the 2026 Dropshipping Masterclass. Please share details.';
    const encoded = encodeURIComponent(message || defaultMsg);
    return `https://wa.me/923330093269?text=${encoded}`;
  }
};

function formatCleanPhone(rawPhone?: string): string {
  if (!rawPhone) return '923330093269';
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  }
  return cleaned || '923330093269';
}

export function getDynamicContactConfig(): ContactConfig {
  const cms = getCmsContent();
  const c = cms?.contact || defaultCmsContent.contact;

  const email = c?.email || contactConfig.email;
  const displayPhone = c?.phone || contactConfig.displayPhone;
  const phone = formatCleanPhone(displayPhone);
  const headOffice = c?.headOffice || contactConfig.headOffice;
  const regionalOffice = c?.regionalOffice || contactConfig.regionalOffice;
  const whatsappGreeting = c?.whatsappGreeting || contactConfig.whatsappGreeting;

  return {
    email,
    phone,
    displayPhone,
    headOffice,
    regionalOffice,
    supportHours: contactConfig.supportHours,
    whatsappGreeting,
    getWhatsAppUrl: (message?: string) => {
      const msg = message || whatsappGreeting || 'Salam Sami! I am interested in joining the 2026 Dropshipping Masterclass.';
      return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    }
  };
}

export function useContactConfig(): ContactConfig {
  const [cfg, setCfg] = useState<ContactConfig>(getDynamicContactConfig());

  useEffect(() => {
    const refresh = () => {
      setCfg(getDynamicContactConfig());
    };

    refresh();
    window.addEventListener('sami_cms_updated', refresh);
    return () => window.removeEventListener('sami_cms_updated', refresh);
  }, []);

  return cfg;
}

export default contactConfig;
