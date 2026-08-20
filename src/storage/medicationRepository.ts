import { and, desc, eq } from 'drizzle-orm';
import { db } from './database';
import { medications, medicationLogs, InsertMedicationRow, InsertMedicationLogRow } from './schema';
import { Medication, MedicationFrequency, MedicationLog, DailyMedicationDoseItem } from '../domain/medications/types';

export function getDefaultTimesForFrequency(
  freq: MedicationFrequency,
  legacyTime?: string
): string[] {
  const baseTime = legacyTime || '08:00';
  switch (freq) {
    case 'twice_daily':
      return [baseTime, '20:00'];
    case 'three_times_daily':
      return [baseTime, '14:00', '20:00'];
    case 'daily':
    case 'weekly':
    case 'biweekly':
    case 'every_eight_weeks':
    default:
      return [baseTime];
  }
}

export const medicationRepository = {
  async getAllMedications(): Promise<Medication[]> {
    const rows = await db
      .select()
      .from(medications)
      .orderBy(desc(medications.active), desc(medications.createdAt));

    return rows.map((r) => {
      let times: string[] = [];
      if (r.times) {
        try {
          times = JSON.parse(r.times);
        } catch {
          times = getDefaultTimesForFrequency(r.frequency as MedicationFrequency, r.time || undefined);
        }
      } else {
        times = getDefaultTimesForFrequency(r.frequency as MedicationFrequency, r.time || undefined);
      }

      return {
        id: r.id,
        name: r.name,
        dosage: r.dosage,
        frequency: r.frequency as MedicationFrequency,
        times,
        time: times[0] || r.time || undefined,
        instructions: r.instructions || undefined,
        active: Boolean(r.active),
        createdAt: r.createdAt,
      };
    });
  },

  async getActiveMedications(): Promise<Medication[]> {
    const all = await this.getAllMedications();
    return all.filter((m) => m.active);
  },

  async saveMedication(
    med: Omit<Medication, 'id' | 'createdAt'> & { id?: string }
  ): Promise<Medication> {
    const id = med.id || `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();

    const times =
      med.times && med.times.length > 0
        ? med.times
        : getDefaultTimesForFrequency(med.frequency, med.time);

    const row: InsertMedicationRow = {
      id,
      name: med.name.trim(),
      dosage: med.dosage.trim(),
      frequency: med.frequency,
      time: times[0] || null,
      times: JSON.stringify(times),
      instructions: med.instructions ? med.instructions.trim() : null,
      active: med.active !== undefined ? med.active : true,
      createdAt: now,
    };

    await db.insert(medications).values(row).onConflictDoUpdate({
      target: medications.id,
      set: {
        name: row.name,
        dosage: row.dosage,
        frequency: row.frequency,
        time: row.time,
        times: row.times,
        instructions: row.instructions,
        active: row.active,
      },
    });

    return {
      id,
      name: row.name,
      dosage: row.dosage,
      frequency: row.frequency as MedicationFrequency,
      times,
      time: times[0],
      instructions: row.instructions || undefined,
      active: Boolean(row.active),
      createdAt: now,
    };
  },

  async toggleMedicationActive(id: string, active: boolean): Promise<void> {
    await db.update(medications).set({ active }).where(eq(medications.id, id));
  },

  async deleteMedication(id: string): Promise<void> {
    await db.delete(medicationLogs).where(eq(medicationLogs.medicationId, id));
    await db.delete(medications).where(eq(medications.id, id));
  },

  async getLogsForDate(date: string): Promise<MedicationLog[]> {
    const rows = await db
      .select()
      .from(medicationLogs)
      .where(eq(medicationLogs.date, date));

    return rows.map((r) => ({
      id: r.id,
      medicationId: r.medicationId,
      date: r.date,
      doseIndex: r.doseIndex ?? 0,
      scheduledTime: r.scheduledTime || undefined,
      time: r.time || undefined,
      status: r.status as 'taken' | 'skipped',
      takenAt: r.takenAt,
    }));
  },

  async toggleMedicationDoseTaken(
    medicationId: string,
    date: string,
    doseIndex: number,
    scheduledTime: string | undefined,
    markTaken: boolean
  ): Promise<void> {
    const id = `mlog_${medicationId}_${date}_${doseIndex}`;

    if (markTaken) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

      const row: InsertMedicationLogRow = {
        id,
        medicationId,
        date,
        doseIndex,
        scheduledTime: scheduledTime || null,
        time,
        status: 'taken',
        takenAt: Date.now(),
      };

      await db.insert(medicationLogs).values(row).onConflictDoUpdate({
        target: medicationLogs.id,
        set: {
          status: 'taken',
          time,
          scheduledTime: row.scheduledTime,
          doseIndex,
          takenAt: Date.now(),
        },
      });
    } else {
      await db
        .delete(medicationLogs)
        .where(
          and(
            eq(medicationLogs.medicationId, medicationId),
            eq(medicationLogs.date, date),
            eq(medicationLogs.doseIndex, doseIndex)
          )
        );
    }
  },

  async getDailyItems(date: string): Promise<DailyMedicationDoseItem[]> {
    const activeMeds = await this.getActiveMedications();
    const dateLogs = await this.getLogsForDate(date);

    // Map by `${medicationId}_${doseIndex}`
    const logMap = new Map<string, MedicationLog>();
    dateLogs.forEach((l) => logMap.set(`${l.medicationId}_${l.doseIndex}`, l));

    const result: DailyMedicationDoseItem[] = [];

    activeMeds.forEach((med) => {
      const times = med.times && med.times.length > 0
        ? med.times
        : getDefaultTimesForFrequency(med.frequency, med.time);

      times.forEach((scheduledTime, doseIndex) => {
        const key = `${med.id}_${doseIndex}`;
        const log = logMap.get(key);

        result.push({
          id: key,
          medication: med,
          doseIndex,
          totalDosesForDay: times.length,
          scheduledTime,
          isTaken: log ? log.status === 'taken' : false,
          takenAtTime: log ? log.time : undefined,
          logId: log ? log.id : undefined,
        });
      });
    });

    return result;
  },
};
