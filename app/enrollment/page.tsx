import { dbGetCmsSettings } from '@/lib/database';
import { EnrollmentPageClient } from './EnrollmentPageClient';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EnrollmentPage() {
  const content = await dbGetCmsSettings();
  const cookieStore = await cookies();
  const targetCookie = cookieStore.get('sami_timer_target')?.value;

  let serverRemainingSeconds: number | undefined;

  if (targetCookie) {
    const targetMs = Number(targetCookie);
    const now = Date.now();
    if (!isNaN(targetMs) && targetMs > now) {
      serverRemainingSeconds = Math.max(0, Math.floor((targetMs - now) / 1000));
    }
  }

  return (
    <EnrollmentPageClient 
      initialContent={content} 
      serverRemainingSeconds={serverRemainingSeconds}
    />
  );
}
