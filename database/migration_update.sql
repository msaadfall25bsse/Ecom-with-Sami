-- =============================================================================
-- ECOM WITH SAMI - COMPLETE SUPABASE MIGRATION & SYNC SCRIPT
-- Copy and run this script in your Supabase Dashboard -> SQL Editor
-- =============================================================================

-- 1. CMS Settings Table
CREATE TABLE IF NOT EXISTS public.cms_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.cms_settings DISABLE ROW LEVEL SECURITY;

-- 2. LMS Modules & Video Lectures Table
CREATE TABLE IF NOT EXISTS public.lms_modules (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  lessons_json TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.lms_modules DISABLE ROW LEVEL SECURITY;

-- 3. LMS Wholesale Suppliers Table (UAE & Saudi Arabia)
CREATE TABLE IF NOT EXISTS public.lms_suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  country TEXT,
  city TEXT,
  phone TEXT,
  whatsapp_link TEXT,
  min_order TEXT,
  delivery_time TEXT,
  cod_supported BOOLEAN DEFAULT true,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.lms_suppliers DISABLE ROW LEVEL SECURITY;

-- 4. Students Table (Credentials & Progress)
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT,
  password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  enrolled_at TEXT,
  completed_lessons_json TEXT DEFAULT '[]',
  last_login TEXT
);
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;

-- 5. Enrollments Table (Checkout Slips & Status)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id TEXT PRIMARY KEY,
  tracking_code TEXT UNIQUE NOT NULL,
  student_id TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  payment_method TEXT,
  transaction_id TEXT,
  where_heard TEXT,
  receipt_url TEXT,
  amount TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.enrollments DISABLE ROW LEVEL SECURITY;

-- 6. LMS Downloadable Resources Table (Software, Sheets & Guides)
CREATE TABLE IF NOT EXISTS public.lms_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  size TEXT,
  download_url TEXT,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.lms_resources DISABLE ROW LEVEL SECURITY;

-- 7. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  topic TEXT,
  message TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.support_tickets DISABLE ROW LEVEL SECURITY;

-- 8. Enable Public Permissions on Tables (Anon and Service Role)
GRANT ALL ON TABLE public.cms_settings TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.lms_modules TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.lms_suppliers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.students TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.enrollments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.lms_resources TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.support_tickets TO anon, authenticated, service_role;
