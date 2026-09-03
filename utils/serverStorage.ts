import fs from 'fs';
import path from 'path';
import { defaultCmsContent, CmsContentSchema } from './cmsStore';
import { initialStudents, initialEnrollments, initialModules, initialSuppliers, initialResources, initialTickets, Student, Enrollment, Module, Supplier, ResourceItem, SupportTicket } from './db';

const DATA_DIR = path.join(process.cwd(), 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms_data.json');
const DB_FILE = path.join(DATA_DIR, 'db_data.json');

// Ensure data folder exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.error('Error creating data dir:', e);
  }
}

// -------------------------------------------------------------
// CMS Permanent Storage
// -------------------------------------------------------------
export function getServerCmsContent(): CmsContentSchema {
  try {
    ensureDataDir();
    if (fs.existsSync(CMS_FILE)) {
      const content = fs.readFileSync(CMS_FILE, 'utf-8');
      return JSON.parse(content);
    } else {
      fs.writeFileSync(CMS_FILE, JSON.stringify(defaultCmsContent, null, 2), 'utf-8');
      return defaultCmsContent;
    }
  } catch (e) {
    console.error('Failed reading cms_data.json:', e);
    return defaultCmsContent;
  }
}

export function saveServerCmsContent(patch: Partial<CmsContentSchema>): CmsContentSchema {
  try {
    const existing = getServerCmsContent();
    const updated = {
      ...existing,
      ...patch
    };
    ensureDataDir();
    fs.writeFileSync(CMS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (e) {
    console.error('Failed saving cms_data.json:', e);
    return { ...defaultCmsContent, ...patch };
  }
}

// -------------------------------------------------------------
// DB & LMS Permanent Storage
// -------------------------------------------------------------
export interface ServerDbSchema {
  students: Student[];
  enrollments: Enrollment[];
  modules: Module[];
  suppliers: Supplier[];
  resources: ResourceItem[];
  tickets: SupportTicket[];
}

const defaultDbState: ServerDbSchema = {
  students: initialStudents,
  enrollments: initialEnrollments,
  modules: initialModules,
  suppliers: initialSuppliers,
  resources: initialResources,
  tickets: initialTickets
};

export function getServerDb(): ServerDbSchema {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDbState, null, 2), 'utf-8');
      return defaultDbState;
    }
  } catch (e) {
    console.error('Failed reading db_data.json:', e);
    return defaultDbState;
  }
}

export function saveServerDb(data: ServerDbSchema): ServerDbSchema {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return data;
  } catch (e) {
    console.error('Failed saving db_data.json:', e);
    return data;
  }
}
