import { dbGetCmsSettings } from '@/lib/database';
import { EnrollmentPageClient } from './EnrollmentPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EnrollmentPage() {
  const content = await dbGetCmsSettings();
  const cp = content.checkout_page;

  const duration = Math.max(
    1,
    (Number(cp?.timer_hours) || 0) * 3600 +
    (Number(cp?.timer_minutes) || 0) * 60 +
    (Number(cp?.timer_seconds) || 0)
  );
  const anchor = Number(cp?.timer_anchor_time) || 0;
  const now = Date.now();
  const elapsed = Math.max(0, Math.floor((now - anchor) / 1000)) % duration;
  const serverRemainingSeconds = Math.max(0, duration - elapsed);

  return (
    <EnrollmentPageClient 
      initialContent={content} 
      serverRemainingSeconds={serverRemainingSeconds}
    />
  );
}
