try { process.loadEnvFile('.env.local'); } catch(e) {}
const { createClient } = require('@supabase/supabase-js');
const { defaultCmsContent } = require('../utils/cmsStore');
const { initialModules, initialSuppliers } = require('../utils/db');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.log('Supabase credentials not found in environment. Please configure .env.local');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding Supabase Database...');

  // 1. Seed CMS Settings
  try {
    const { error: cmsErr } = await supabase.from('cms_settings').upsert({
      key: 'main_cms',
      value_json: JSON.stringify(defaultCmsContent),
      updated_at: new Date().toISOString()
    });
    if (cmsErr) console.log('CMS Seed Note:', cmsErr.message);
    else console.log('✅ CMS Settings seeded successfully!');
  } catch (e) {
    console.error(e);
  }

  // 2. Seed LMS Modules
  try {
    for (const mod of initialModules) {
      await supabase.from('lms_modules').upsert({
        id: mod.id,
        title: mod.title,
        duration: mod.duration,
        description: mod.description,
        lessons_json: JSON.stringify(mod.lessons || []),
        updated_at: new Date().toISOString()
      });
    }
    console.log('✅ LMS Modules seeded successfully!');
  } catch (e) {
    console.error(e);
  }

  // 3. Seed Suppliers
  try {
    for (const sup of initialSuppliers) {
      await supabase.from('lms_suppliers').upsert({
        id: sup.id,
        name: sup.name,
        category: sup.category,
        country: sup.country,
        city: sup.city,
        phone: sup.phone,
        whatsapp_link: sup.whatsappLink,
        min_order: sup.minOrder,
        delivery_time: sup.deliveryTime,
        cod_supported: sup.codSupported,
        notes: sup.notes,
        updated_at: new Date().toISOString()
      });
    }
    console.log('✅ Suppliers seeded successfully!');
  } catch (e) {
    console.error(e);
  }

  console.log('🎉 Seeding finished!');
}

seed();
