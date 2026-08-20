import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const dailySymptomLogs = sqliteTable('daily_symptom_logs', {
  id: text('id').primaryKey(),
  date: text('date').notNull(), // Format YYYY-MM-DD
  time: text('time'), // Format HH:mm
  bristolType: text('bristol_type').notNull(), // type_1 .. type_7
  bloodPresence: text('blood_presence').notNull(), // none, traces, moderate, severe
  painLevel: integer('pain_level').notNull(), // 0 - 10
  notes: text('notes'),
  severity: text('severity').notNull(), // remission, mild_activity, moderate_to_severe_flare
  createdAt: integer('created_at').notNull(), // Epoch timestamp

  // Extended clinical biomarkers (Issue #9)
  stressLevel: integer('stress_level'),
  hasClots: integer('has_clots', { mode: 'boolean' }),
  mucusPresence: text('mucus_presence'),
  urgencyLevel: text('urgency_level'),
});

export type DailySymptomLogRow = typeof dailySymptomLogs.$inferSelect;
export type InsertDailySymptomLog = typeof dailySymptomLogs.$inferInsert;

export const medications = sqliteTable('medications', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  dosage: text('dosage').notNull(),
  frequency: text('frequency').notNull(), // daily, twice_daily, three_times_daily, weekly, biweekly, every_eight_weeks
  time: text('time'), // Legacy single time e.g. "08:00"
  times: text('times'), // JSON array of times e.g. '["08:00", "14:00", "20:00"]'
  instructions: text('instructions'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at').notNull(),
});

export type MedicationRow = typeof medications.$inferSelect;
export type InsertMedicationRow = typeof medications.$inferInsert;

export const medicationLogs = sqliteTable('medication_logs', {
  id: text('id').primaryKey(),
  medicationId: text('medication_id').notNull(),
  date: text('date').notNull(), // Format YYYY-MM-DD
  doseIndex: integer('dose_index').default(0), // 0, 1, 2
  scheduledTime: text('scheduled_time'), // e.g. "08:00"
  time: text('time'), // Format HH:mm (actual taken time)
  status: text('status').notNull(), // 'taken' | 'skipped'
  takenAt: integer('taken_at').notNull(),
});

export type MedicationLogRow = typeof medicationLogs.$inferSelect;
export type InsertMedicationLogRow = typeof medicationLogs.$inferInsert;
