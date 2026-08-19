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
    stress_level INTEGER,
    has_clots INTEGER,
    mucus_presence TEXT,
    urgency_level TEXT
  );
`);

// Migrations: ensure columns exist for previously initialized databases
const migrations = [
  'ALTER TABLE daily_symptom_logs ADD COLUMN time TEXT;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN stress_level INTEGER;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN has_clots INTEGER;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN mucus_presence TEXT;',
  'ALTER TABLE daily_symptom_logs ADD COLUMN urgency_level TEXT;',
];

for (const sql of migrations) {
  try {
    expoDb.execSync(sql);
  } catch {
    // Column already exists, safe to ignore
  }
}

export const db = drizzle(expoDb, { schema });
