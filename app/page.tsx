import { dbGetCmsSettings, dbGetModules } from '@/lib/database';
import { HomePageClient } from '@/components/landing/HomePageClient';

// Enable Incremental Static Regeneration (ISR) with background revalidation every 60s
// and instant on-demand revalidation whenever the admin updates content in /admin/cms
export const revalidate = 60;

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
