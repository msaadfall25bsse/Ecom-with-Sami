const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Function to query table (replaces 'your_table' with 'cms_settings')
async function getData() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('cms_settings')
    .select('*');
  if (error) {
    console.error('Error fetching data from Supabase:', error);
    return null;
  }
  return data;
}

module.exports = { supabase, createClient, getData };
