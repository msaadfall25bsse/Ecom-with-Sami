export interface ContactConfig {
  email: string;
  phone: string;
  displayPhone: string;
  headOffice: string;
  regionalOffice: string;
  supportHours: string;
  getWhatsAppUrl: (message?: string) => string;
}

export const contactConfig: ContactConfig = {
  email: 'support@ecomwithsami.com',
  phone: '+923330093269',
  displayPhone: '+92 333 0093269',
  headOffice: 'Office 402, Business Executive Center, Blue Area, Islamabad, Pakistan',
  regionalOffice: 'Dubai Silicon Oasis & Riyadh Commercial Hub',
  supportHours: '9:00 AM – 5:00 PM PKT (Mon – Sat)',
  getWhatsAppUrl: (message?: string) => {
    const defaultMsg = 'Hi Sami! I want to inquire about the UAE & KSA Dropshipping Course.';
    const encoded = encodeURIComponent(message || defaultMsg);
    return `https://wa.me/923330093269?text=${encoded}`;
  }
};

export function useContactConfig(): ContactConfig {
  return contactConfig;
}

export default contactConfig;
