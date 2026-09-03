import fs from 'fs';
import path from 'path';
import { defaultCmsContent, CmsContentSchema } from './cmsStore';
import { initialStudents, initialEnrollments, initialModules, initialSuppliers, initialResources, initialTickets, Student, Enrollment, Module, Supplier, ResourceItem, SupportTicket } from './db';

declare global {
  var __serverCmsMemory: CmsContentSchema | undefined;
  var __serverDbMemory: ServerDbSchema | undefined;
}

const DATA_FOLDER = path.join(process.cwd(), 'data');
const CMS_FILE_PATH = path.join(process.cwd(), 'data', 'cms_data.json');
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db_data.json');

function ensureDataDirectory() {
  try {
    if (!fs.existsSync(DATA_FOLDER)) {
      fs.mkdirSync(DATA_FOLDER, { recursive: true });
    }
  } catch (e) {
    // In serverless, fallback gracefully
  }
}

// -------------------------------------------------------------
// CMS Permanent Storage
// -------------------------------------------------------------
export function getServerCmsContent(): CmsContentSchema {
  if (global.__serverCmsMemory) {
    return global.__serverCmsMemory;
  }

  try {
    ensureDataDirectory();
    if (fs.existsSync(CMS_FILE_PATH)) {
      const content = fs.readFileSync(CMS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      global.__serverCmsMemory = parsed;
      return parsed;
    }
  } catch (e) {
    console.warn('CMS read fallback to default:', e);
  }

  global.__serverCmsMemory = { ...defaultCmsContent };
  return global.__serverCmsMemory;
}

export function saveServerCmsContent(patch: Partial<CmsContentSchema>): CmsContentSchema {
  const existing = getServerCmsContent();
  const updated: CmsContentSchema = {
    ...existing,
    ...patch
  };

  global.__serverCmsMemory = updated;

  try {
    ensureDataDirectory();
    fs.writeFileSync(CMS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (e) {
    console.warn('CMS write warning (in-memory preserved):', e);
  }

  return updated;
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
  if (global.__serverDbMemory) {
    return global.__serverDbMemory;
  }

  try {
    ensureDataDirectory();
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      global.__serverDbMemory = parsed;
      return parsed;
    }
  } catch (e) {
    console.warn('DB read fallback:', e);
  }

  global.__serverDbMemory = { ...defaultDbState };
  return global.__serverDbMemory;
}

export function saveServerDb(data: ServerDbSchema): ServerDbSchema {
  global.__serverDbMemory = data;
  try {
    ensureDataDirectory();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.warn('DB write warning:', e);
  }
  return data;
}
