import { desc, eq } from 'drizzle-orm';
import { db } from './database';
import { dailySymptomLogs, InsertDailySymptomLog } from './schema';
import { BloodPresence, BristolType, CrisisSeverity, DailySymptomEntry } from '../domain/health/types';

export const symptomRepository = {
  async save(entry: DailySymptomEntry): Promise<DailySymptomEntry> {
    const id = entry.id || `${entry.date}_${Date.now()}`;
    const row: InsertDailySymptomLog = {
      id,
      date: entry.date,
      bristolType: entry.bristolType,
      bloodPresence: entry.bloodPresence,
      painLevel: entry.painLevel,
      notes: entry.notes || null,
      severity: entry.severity,
      createdAt: entry.createdAt || Date.now(),
    };

    await db.insert(dailySymptomLogs).values(row).onConflictDoUpdate({
      target: dailySymptomLogs.id,
      set: {
        bristolType: row.bristolType,
        bloodPresence: row.bloodPresence,
        painLevel: row.painLevel,
        notes: row.notes,
        severity: row.severity,
      },
    });

    return {
      ...entry,
      id,
    };
  },

  async getRecentLogs(limit = 30): Promise<DailySymptomEntry[]> {
    const rows = await db
      .select()
      .from(dailySymptomLogs)
      .orderBy(desc(dailySymptomLogs.createdAt))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      date: r.date,
      bristolType: r.bristolType as BristolType,
      bloodPresence: r.bloodPresence as BloodPresence,
      painLevel: r.painLevel,
      notes: r.notes || undefined,
      severity: r.severity as CrisisSeverity,
      createdAt: r.createdAt,
    }));
  },

  async getLogByDate(date: string): Promise<DailySymptomEntry | null> {
    const rows = await db
      .select()
      .from(dailySymptomLogs)
      .where(eq(dailySymptomLogs.date, date))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      date: r.date,
      bristolType: r.bristolType as BristolType,
      bloodPresence: r.bloodPresence as BloodPresence,
      painLevel: r.painLevel,
      notes: r.notes || undefined,
      severity: r.severity as CrisisSeverity,
      createdAt: r.createdAt,
    };
  },
};
