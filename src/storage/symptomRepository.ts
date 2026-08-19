import { desc, eq, like, asc } from 'drizzle-orm';
import { db } from './database';
import { dailySymptomLogs, InsertDailySymptomLog } from './schema';
import { BloodPresence, BristolType, CrisisSeverity, DailyAggregatedSummary, DailySymptomEntry, MucusPresence, UrgencyLevel } from '../domain/health/types';
import { evaluateDailySummary } from '../domain/health/evaluateCrisis';

export interface MonthlyStats {
  totalLoggedMovements: number;
  totalDaysRecorded: number;
  remissionDays: number;
  mildDays: number;
  flareDays: number;
}

export const symptomRepository = {
  async save(entry: DailySymptomEntry): Promise<DailySymptomEntry> {
    const id = entry.id || `bm_${entry.date}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const time = entry.time || new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const row: InsertDailySymptomLog = {
      id,
      date: entry.date,
      time,
      bristolType: entry.bristolType,
      bloodPresence: entry.bloodPresence,
      painLevel: entry.painLevel,
      notes: entry.notes || null,
      severity: entry.severity,
      createdAt: entry.createdAt || now,
      stressLevel: entry.stressLevel !== undefined ? entry.stressLevel : null,
      hasClots: entry.hasClots !== undefined ? entry.hasClots : null,
      mucusPresence: entry.mucusPresence || null,
      urgencyLevel: entry.urgencyLevel || null,
    };

    await db.insert(dailySymptomLogs).values(row).onConflictDoUpdate({
      target: dailySymptomLogs.id,
      set: {
        time: row.time,
        bristolType: row.bristolType,
        bloodPresence: row.bloodPresence,
        painLevel: row.painLevel,
        notes: row.notes,
        severity: row.severity,
        stressLevel: row.stressLevel,
        hasClots: row.hasClots,
        mucusPresence: row.mucusPresence,
        urgencyLevel: row.urgencyLevel,
      },
    });

    return {
      ...entry,
      id,
      time,
    };
  },

  async deleteLog(id: string): Promise<void> {
    await db.delete(dailySymptomLogs).where(eq(dailySymptomLogs.id, id));
  },

  async getLogsForDate(date: string): Promise<DailySymptomEntry[]> {
    const rows = await db
      .select()
      .from(dailySymptomLogs)
      .where(eq(dailySymptomLogs.date, date))
      .orderBy(asc(dailySymptomLogs.time), asc(dailySymptomLogs.createdAt));

    return rows.map((r) => ({
      id: r.id,
      date: r.date,
      time: r.time || undefined,
      bristolType: r.bristolType as BristolType,
      bloodPresence: r.bloodPresence as BloodPresence,
      painLevel: r.painLevel,
      notes: r.notes || undefined,
      severity: r.severity as CrisisSeverity,
      createdAt: r.createdAt,
      stressLevel: r.stressLevel ?? undefined,
      hasClots: r.hasClots ?? undefined,
      mucusPresence: (r.mucusPresence as MucusPresence) || undefined,
      urgencyLevel: (r.urgencyLevel as UrgencyLevel) || undefined,
    }));
  },

  async getLogById(id: string): Promise<DailySymptomEntry | null> {
    const rows = await db
      .select()
      .from(dailySymptomLogs)
      .where(eq(dailySymptomLogs.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      date: r.date,
      time: r.time || undefined,
      bristolType: r.bristolType as BristolType,
      bloodPresence: r.bloodPresence as BloodPresence,
      painLevel: r.painLevel,
      notes: r.notes || undefined,
      severity: r.severity as CrisisSeverity,
      createdAt: r.createdAt,
      stressLevel: r.stressLevel ?? undefined,
      hasClots: r.hasClots ?? undefined,
      mucusPresence: (r.mucusPresence as MucusPresence) || undefined,
      urgencyLevel: (r.urgencyLevel as UrgencyLevel) || undefined,
    };
  },

  async getDailySummary(date: string): Promise<DailyAggregatedSummary> {
    const logs = await this.getLogsForDate(date);
    return evaluateDailySummary(date, logs);
  },

  async getRecentLogs(limit = 50): Promise<DailySymptomEntry[]> {
    const rows = await db
      .select()
      .from(dailySymptomLogs)
      .orderBy(desc(dailySymptomLogs.date), desc(dailySymptomLogs.createdAt))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      date: r.date,
      time: r.time || undefined,
      bristolType: r.bristolType as BristolType,
      bloodPresence: r.bloodPresence as BloodPresence,
      painLevel: r.painLevel,
      notes: r.notes || undefined,
      severity: r.severity as CrisisSeverity,
      createdAt: r.createdAt,
      stressLevel: r.stressLevel ?? undefined,
      hasClots: r.hasClots ?? undefined,
      mucusPresence: (r.mucusPresence as MucusPresence) || undefined,
      urgencyLevel: (r.urgencyLevel as UrgencyLevel) || undefined,
    }));
  },

  async getAllLogs(): Promise<DailySymptomEntry[]> {
    const rows = await db
      .select()
      .from(dailySymptomLogs)
      .orderBy(desc(dailySymptomLogs.date), desc(dailySymptomLogs.createdAt));

    return rows.map((r) => ({
      id: r.id,
      date: r.date,
      time: r.time || undefined,
      bristolType: r.bristolType as BristolType,
      bloodPresence: r.bloodPresence as BloodPresence,
      painLevel: r.painLevel,
      notes: r.notes || undefined,
      severity: r.severity as CrisisSeverity,
      createdAt: r.createdAt,
      stressLevel: r.stressLevel ?? undefined,
      hasClots: r.hasClots ?? undefined,
      mucusPresence: (r.mucusPresence as MucusPresence) || undefined,
      urgencyLevel: (r.urgencyLevel as UrgencyLevel) || undefined,
    }));
  },

  async getLogsForMonth(year: number, month: number): Promise<DailySymptomEntry[]> {
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const pattern = `${year}-${monthStr}%`;

    const rows = await db
      .select()
      .from(dailySymptomLogs)
      .where(like(dailySymptomLogs.date, pattern))
      .orderBy(asc(dailySymptomLogs.date), asc(dailySymptomLogs.time));

    return rows.map((r) => ({
      id: r.id,
      date: r.date,
      time: r.time || undefined,
      bristolType: r.bristolType as BristolType,
      bloodPresence: r.bloodPresence as BloodPresence,
      painLevel: r.painLevel,
      notes: r.notes || undefined,
      severity: r.severity as CrisisSeverity,
      createdAt: r.createdAt,
      stressLevel: r.stressLevel ?? undefined,
      hasClots: r.hasClots ?? undefined,
      mucusPresence: (r.mucusPresence as MucusPresence) || undefined,
      urgencyLevel: (r.urgencyLevel as UrgencyLevel) || undefined,
    }));
  },

  async getMonthDailySummaries(year: number, month: number): Promise<Map<string, DailyAggregatedSummary>> {
    const logs = await this.getLogsForMonth(year, month);
    const dateMap = new Map<string, DailySymptomEntry[]>();

    for (const log of logs) {
      const list = dateMap.get(log.date) || [];
      list.push(log);
      dateMap.set(log.date, list);
    }

    const summaryMap = new Map<string, DailyAggregatedSummary>();
    dateMap.forEach((entries, date) => {
      summaryMap.set(date, evaluateDailySummary(date, entries));
    });

    return summaryMap;
  },

  async getMonthStats(year: number, month: number): Promise<MonthlyStats> {
    const summaries = await this.getMonthDailySummaries(year, month);
    let remissionDays = 0;
    let mildDays = 0;
    let flareDays = 0;
    let totalLoggedMovements = 0;

    summaries.forEach((summary) => {
      totalLoggedMovements += summary.totalMovements;
      if (summary.overallSeverity === 'remission') remissionDays++;
      else if (summary.overallSeverity === 'mild_activity') mildDays++;
      else if (summary.overallSeverity === 'moderate_to_severe_flare') flareDays++;
    });

    return {
      totalLoggedMovements,
      totalDaysRecorded: summaries.size,
      remissionDays,
      mildDays,
      flareDays,
    };
  },

  async clearAll(): Promise<void> {
    await db.delete(dailySymptomLogs);
  },
};
