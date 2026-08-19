import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const dailySymptomLogs = sqliteTable('daily_symptom_logs', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // Format YYYY-MM-DD
  bristolType: text('bristol_type').notNull(), // type_1 .. type_7
  bloodPresence: text('blood_presence').notNull(), // none, traces, moderate, severe
  painLevel: integer('pain_level').notNull(), // 0 - 10
  notes: text('notes'),
  severity: text('severity').notNull(), // remission, mild_activity, moderate_to_severe_flare
  createdAt: integer('created_at').notNull(), // Epoch timestamp
});

export type DailySymptomLogRow = typeof dailySymptomLogs.$inferSelect;
export type InsertDailySymptomLog = typeof dailySymptomLogs.$inferInsert;
