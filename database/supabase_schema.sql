-- =============================================================================
-- ECOM WITH SAMI - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- Run this SQL in your Supabase Dashboard -> SQL Editor to initialize all tables!
-- =============================================================================

-- 1. CMS Settings Table (Hero, Pricing, Bonuses, Testimonials, FAQs, Pixels, Payment Methods)
CREATE TABLE IF NOT EXISTS cms_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Disable Row Level Security (RLS) so API routes can read & write freely
ALTER TABLE cms_settings DISABLE ROW LEVEL SECURITY;

-- 2. LMS Modules Table (Course Curriculum, Modules, Video Lectures)
CREATE TABLE IF NOT EXISTS lms_modules (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  duration TEXT,
  description TEXT,
  lessons_json TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE lms_modules DISABLE ROW LEVEL SECURITY;

-- 3. LMS Wholesale Suppliers Table (UAE & Saudi Arabia Contacts)
CREATE TABLE IF NOT EXISTS lms_suppliers (
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
ALTER TABLE lms_suppliers DISABLE ROW LEVEL SECURITY;

-- 4. Students Table (Student Logins, Credentials & Progress)
CREATE TABLE IF NOT EXISTS students (
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
ALTER TABLE students DISABLE ROW LEVEL SECURITY;

-- 5. Enrollments Table (Student Checkout, Payment Slips & Status)
CREATE TABLE IF NOT EXISTS enrollments (
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
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;

-- 6. Resources Table (Downloadable Software, Excel Sheets & Guides)
CREATE TABLE IF NOT EXISTS lms_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT,
  size TEXT,
  download_url TEXT,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE lms_resources DISABLE ROW LEVEL SECURITY;

-- 7. Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  topic TEXT,
  message TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE support_tickets DISABLE ROW LEVEL SECURITY;
