import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

const expoDb = SQLite.openDatabaseSync('rcu_tracker.db');

// Run table creation if not exists
expoDb.execSync(`
  CREATE TABLE IF NOT EXISTS daily_symptom_logs (
    id TEXT PRIMARY KEY NOT NULL,
    date TEXT NOT NULL,
    bristol_type TEXT NOT NULL,
    blood_presence TEXT NOT NULL,
    pain_level INTEGER NOT NULL,
    notes TEXT,
    severity TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

export const db = drizzle(expoDb, { schema });
