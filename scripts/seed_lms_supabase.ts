import { supabase } from '../lib/supabase';
import { initialModules } from '../utils/db';

async function seed() {
  if (!supabase) {
    console.error('Supabase not configured');
    process.exit(1);
  }

  console.log(`Seeding ${initialModules.length} initial modules into Supabase...`);
  for (const mod of initialModules) {
    const { error } = await supabase.from('lms_modules').upsert({
      id: mod.id,
      title: mod.title,
      duration: mod.duration,
      description: mod.description,
      lessons_json: JSON.stringify(mod.lessons || []),
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.error(`Error inserting module ${mod.id}:`, error);
    } else {
      console.log(`✓ Seeded Module ${mod.id}: ${mod.title}`);
    }
  }

  // Set seed flag
  await supabase.from('cms_settings').upsert({
    key: 'lms_seeded',
    value_json: 'true',
    updated_at: new Date().toISOString()
  });

  console.log('✓ Successfully set lms_seeded flag in Supabase!');

  // Verify
  const { data } = await supabase.from('lms_modules').select('id, title');
  console.log(`Verification: ${data?.length} modules currently in Supabase.`);
}

seed().catch(console.error);
