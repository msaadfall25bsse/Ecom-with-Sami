import { dbGetCmsSettings } from '@/lib/database';
import { AboutPageClient } from './AboutPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  const content = await dbGetCmsSettings();
  return <AboutPageClient initialContent={content} />;
}
