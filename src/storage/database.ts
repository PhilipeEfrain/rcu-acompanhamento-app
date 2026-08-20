import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const expoDb = SQLite.openDatabaseSync('rcu_tracker.db');

// Run table creation if not exists
expoDb.execSync(`
  CREATE TABLE IF NOT EXISTS daily_symptom_logs (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    bristol_type TEXT NOT NULL,
    blood_presence TEXT NOT NULL,
    pain_level INTEGER NOT NULL,
    notes TEXT,
    severity TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    output_type TEXT,
    period TEXT,
    blood_aspect TEXT,
    stress_level INTEGER,
    has_clots INTEGER,
    mucus_presence TEXT,
    urgency_level TEXT
  );

  CREATE TABLE IF NOT EXISTS medications (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    time TEXT,
    times TEXT,
    instructions TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS medication_logs (
    id TEXT PRIMARY KEY NOT NULL,
    medication_id TEXT NOT NULL,
    date TEXT NOT NULL,
    dose_index INTEGER DEFAULT 0,
    scheduled_time TEXT,
    time TEXT,
    status TEXT NOT NULL,
    taken_at INTEGER NOT NULL
  );
`);

// Migrations: ensure columns exist for previously initialized databases
const migrations = [
  'ALTER TABLE daily_symptom_logs ADD COLUMN time TEXT;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN output_type TEXT;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN period TEXT;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN blood_aspect TEXT;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN stress_level INTEGER;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN has_clots INTEGER;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN mucus_presence TEXT;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN urgency_level TEXT;',
  'ALTER TABLE medications ADD COLUMN times TEXT;',
];

for (const sql of migrations) {
  try {
    expoDb.execSync(sql);
  } catch {
    // Column already exists, safe to ignore
  }
}

export const db = drizzle(expoDb, { schema });

