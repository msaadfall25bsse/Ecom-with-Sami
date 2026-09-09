import { dbGetCmsSettings } from '@/lib/database';
import { EnrollmentPageClient } from './EnrollmentPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EnrollmentPage() {
  const content = await dbGetCmsSettings();
  return <EnrollmentPageClient initialContent={content} />;
}
