import { dbGetCmsSettings } from '@/lib/database';
import { SuccessPageClient } from './SuccessPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SuccessPage() {
  const content = await dbGetCmsSettings();
  return <SuccessPageClient initialContent={content} />;
}
