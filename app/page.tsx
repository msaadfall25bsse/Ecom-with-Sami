import { dbGetCmsSettings, dbGetModules } from '@/lib/database';
import { HomePageClient } from '@/components/landing/HomePageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [content, modules] = await Promise.all([
    dbGetCmsSettings(),
    dbGetModules(),
  ]);

  return (
    <HomePageClient 
      initialContent={content} 
      initialModules={modules} 
    />
  );
}
