import { dbGetCmsSettings, dbGetModules } from '@/lib/database';
import { HomePageClient } from '@/components/landing/HomePageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function HomePage() {
  const content = await dbGetCmsSettings();
  const modules = await dbGetModules();

  return (
    <HomePageClient 
      initialContent={content} 
      initialModules={modules} 
    />
  );
}
