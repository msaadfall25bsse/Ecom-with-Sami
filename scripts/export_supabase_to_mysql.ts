import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabase';

/**
 * Tables in Supabase that support the Ecom With Sami platform.
 */
interface TableConfig {
  name: string;
  primaryKey?: string;
  orderBy?: string;
}

const TABLES_TO_EXPORT: TableConfig[] = [
  { name: 'cms_settings', primaryKey: 'key', orderBy: 'updated_at' },
  { name: 'lms_modules', primaryKey: 'id', orderBy: 'id' },
  { name: 'lms_suppliers', primaryKey: 'id', orderBy: 'updated_at' },
  { name: 'students', primaryKey: 'id', orderBy: 'enrolled_at' },
  { name: 'enrollments', primaryKey: 'id', orderBy: 'created_at' },
  { name: 'support_tickets', primaryKey: 'id', orderBy: 'created_at' }
];

/**
 * Escapes values for safe MySQL SQL query generation.
 */
function escapeSqlValue(val: any): string {
  if (val === null || val === undefined) {
    return 'NULL';
  }
  if (typeof val === 'boolean') {
    return val ? '1' : '0';
  }
  if (typeof val === 'number') {
    return Number.isFinite(val) ? String(val) : 'NULL';
  }
  if (typeof val === 'object') {
    // If it's a Date
    if (val instanceof Date) {
      return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
    }
    // Convert JSON object/array to string
    const jsonStr = JSON.stringify(val);
    return `'${jsonStr.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
  }
  // String escaping
  const str = String(val);
  return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r')}'`;
}

/**
 * Generates CREATE TABLE IF NOT EXISTS DDL for MySQL (Hostinger phpMyAdmin compatible).
 */
function getTableDDL(tableName: string): string {
  switch (tableName) {
    case 'cms_settings':
      return `CREATE TABLE IF NOT EXISTS \`cms_settings\` (
  \`key\` VARCHAR(191) NOT NULL,
  \`value_json\` LONGTEXT NOT NULL,
  \`updated_at\` DATETIME NULL,
  PRIMARY KEY (\`key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    case 'lms_modules':
      return `CREATE TABLE IF NOT EXISTS \`lms_modules\` (
  \`id\` INT NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`duration\` VARCHAR(100) NULL,
  \`description\` TEXT NULL,
  \`lessons_json\` LONGTEXT NULL,
  \`updated_at\` DATETIME NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    case 'lms_suppliers':
      return `CREATE TABLE IF NOT EXISTS \`lms_suppliers\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(191) NULL,
  \`country\` VARCHAR(100) NULL,
  \`city\` VARCHAR(100) NULL,
  \`phone\` VARCHAR(100) NULL,
  \`whatsapp_link\` VARCHAR(255) NULL,
  \`min_order\` VARCHAR(100) NULL,
  \`delivery_time\` VARCHAR(100) NULL,
  \`cod_supported\` TINYINT(1) DEFAULT 0,
  \`notes\` TEXT NULL,
  \`updated_at\` DATETIME NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    case 'students':
      return `CREATE TABLE IF NOT EXISTS \`students\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL,
  \`phone\` VARCHAR(100) NULL,
  \`city\` VARCHAR(100) NULL,
  \`password\` VARCHAR(255) NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`enrolled_at\` VARCHAR(100) NULL,
  \`completed_lessons_json\` LONGTEXT NULL,
  \`last_login\` DATETIME NULL,
  \`strike_count\` INT DEFAULT 0,
  \`updated_at\` DATETIME NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_students_email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    case 'enrollments':
      return `CREATE TABLE IF NOT EXISTS \`enrollments\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`tracking_code\` VARCHAR(191) NULL,
  \`student_id\` VARCHAR(191) NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL,
  \`phone\` VARCHAR(100) NULL,
  \`city\` VARCHAR(100) NULL,
  \`payment_method\` VARCHAR(100) NULL,
  \`transaction_id\` VARCHAR(255) NULL,
  \`where_heard\` VARCHAR(100) NULL,
  \`receipt_url\` TEXT NULL,
  \`amount\` VARCHAR(100) NULL,
  \`status\` VARCHAR(50) DEFAULT 'pending',
  \`created_at\` VARCHAR(100) NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_enrollments_email\` (\`email\`),
  KEY \`idx_enrollments_tracking\` (\`tracking_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    case 'support_tickets':
      return `CREATE TABLE IF NOT EXISTS \`support_tickets\` (
  \`id\` VARCHAR(191) NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(191) NOT NULL,
  \`phone\` VARCHAR(100) NULL,
  \`topic\` VARCHAR(191) NULL,
  \`message\` TEXT NOT NULL,
  \`status\` VARCHAR(50) DEFAULT 'open',
  \`created_at\` VARCHAR(100) NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    default:
      return '';
  }
}

/**
 * Main export function
 */
async function exportSupabaseToMySQL() {
  console.log('====================================================');
  console.log('🚀 SUPABASE TO HOSTINGER MYSQL DATA EXPORT SCRIPT');
  console.log('====================================================\n');

  if (!isSupabaseConfigured || !supabase) {
    console.error('❌ Supabase is not properly configured. Check your SUPABASE_URL and SUPABASE_KEY.');
    process.exit(1);
  }

  console.log(`📡 Connecting to Supabase at: ${supabaseUrl}`);

  const outputDir = path.resolve(process.cwd(), 'backups');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sqlDumpFile = path.join(outputDir, `migration_dump_${timestamp}.sql`);
  const latestSqlFile = path.resolve(process.cwd(), 'migration_dump.sql');
  const jsonExportFile = path.join(outputDir, `supabase_export_${timestamp}.json`);

  let sqlOutput = `-- ====================================================\n`;
  sqlOutput += `-- SAMI PLATFORM: SUPABASE TO MYSQL MIGRATION DUMP\n`;
  sqlOutput += `-- Exported At: ${new Date().toISOString()}\n`;
  sqlOutput += `-- Target: Hostinger MySQL (phpMyAdmin / CLI compatible)\n`;
  sqlOutput += `-- ====================================================\n\n`;
  sqlOutput += `SET NAMES utf8mb4;\n`;
  sqlOutput += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  const fullDataJson: Record<string, any[]> = {};
  let totalRecordsExported = 0;

  for (const table of TABLES_TO_EXPORT) {
    console.log(`\n📦 Fetching table: [${table.name}]...`);

    let query = supabase.from(table.name).select('*');
    if (table.orderBy) {
      query = query.order(table.orderBy, { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.warn(`  ⚠️ Warning: Could not fetch '${table.name}': ${error.message}`);
      fullDataJson[table.name] = [];
      continue;
    }

    const rows = data || [];
    fullDataJson[table.name] = rows;
    totalRecordsExported += rows.length;

    console.log(`  ✅ Retrieved ${rows.length} rows from '${table.name}'`);

    // Add DDL to SQL Dump
    const ddl = getTableDDL(table.name);
    if (ddl) {
      sqlOutput += `-- ----------------------------------------------------\n`;
      sqlOutput += `-- Table structure for \`${table.name}\`\n`;
      sqlOutput += `-- ----------------------------------------------------\n`;
      sqlOutput += `${ddl}\n\n`;
    }

    // Add INSERT statements
    if (rows.length > 0) {
      sqlOutput += `-- ----------------------------------------------------\n`;
      sqlOutput += `-- Data for table \`${table.name}\` (${rows.length} rows)\n`;
      sqlOutput += `-- ----------------------------------------------------\n`;

      // Get columns from first row
      const columns = Object.keys(rows[0]);
      const columnList = columns.map(c => `\`${c}\``).join(', ');

      const rowValues = rows.map(row => {
        const values = columns.map(col => escapeSqlValue(row[col]));
        return `(${values.join(', ')})`;
      });

      // Insert in chunks of 50 to avoid max_allowed_packet limits
      const chunkSize = 50;
      for (let i = 0; i < rowValues.length; i += chunkSize) {
        const chunk = rowValues.slice(i, i + chunkSize);
        sqlOutput += `INSERT INTO \`${table.name}\` (${columnList}) VALUES\n  ${chunk.join(',\n  ')}\n`;
        sqlOutput += `ON DUPLICATE KEY UPDATE ${columns.map(c => `\`${c}\`=VALUES(\`${c}\`)`).join(', ')};\n\n`;
      }
    } else {
      sqlOutput += `-- No records found for table \`${table.name}\`\n\n`;
    }
  }

  sqlOutput += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  sqlOutput += `-- ====================================================\n`;
  sqlOutput += `-- END OF MIGRATION DUMP\n`;
  sqlOutput += `-- ====================================================\n`;

  // Write SQL output to timestamped backup and latest migration_dump.sql
  fs.writeFileSync(sqlDumpFile, sqlOutput, 'utf-8');
  fs.writeFileSync(latestSqlFile, sqlOutput, 'utf-8');
  console.log(`\n💾 Saved MySQL SQL Dump to:`);
  console.log(`   - ${sqlDumpFile}`);
  console.log(`   - ${latestSqlFile} (Ready for Hostinger phpMyAdmin import)`);

  // Write JSON output
  fs.writeFileSync(jsonExportFile, JSON.stringify(fullDataJson, null, 2), 'utf-8');
  console.log(`💾 Saved Complete JSON Backup to:`);
  console.log(`   - ${jsonExportFile}`);

  console.log('\n====================================================');
  console.log(`🎉 EXPORT COMPLETE! Exported ${totalRecordsExported} records across ${TABLES_TO_EXPORT.length} tables.`);
  console.log('Next step: Log into Hostinger phpMyAdmin and import migration_dump.sql');
  console.log('====================================================\n');
}

// Execute export
exportSupabaseToMySQL().catch(err => {
  console.error('\n❌ Fatal Export Error:', err);
  process.exit(1);
});
