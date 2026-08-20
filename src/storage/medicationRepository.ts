import { and, desc, eq } from 'drizzle-orm';
import { db } from './database';
import { medications, medicationLogs, InsertMedicationRow, InsertMedicationLogRow } from './schema';
import { Medication, MedicationFrequency, MedicationLog, DailyMedicationItem } from '../domain/medications/types';

export const medicationRepository = {
  async getAllMedications(): Promise<Medication[]> {
    const rows = await db
      .select()
      .from(medications)
      .orderBy(desc(medications.active), desc(medications.createdAt));

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      dosage: r.dosage,
      frequency: r.frequency as MedicationFrequency,
      time: r.time || undefined,
      instructions: r.instructions || undefined,
      active: Boolean(r.active),
      createdAt: r.createdAt,
    }));
  },

  async getActiveMedications(): Promise<Medication[]> {
    const rows = await db
      .select()
      .from(medications)
      .where(eq(medications.active, true))
      .orderBy(medications.createdAt);

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      dosage: r.dosage,
      frequency: r.frequency as MedicationFrequency,
      time: r.time || undefined,
      instructions: r.instructions || undefined,
      active: true,
      createdAt: r.createdAt,
    }));
  },

  async saveMedication(
    med: Omit<Medication, 'id' | 'createdAt'> & { id?: string }
  ): Promise<Medication> {
    const id = med.id || `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();

    const row: InsertMedicationRow = {
      id,
      name: med.name.trim(),
      dosage: med.dosage.trim(),
      frequency: med.frequency,
      time: med.time || null,
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
        instructions: row.instructions,
        active: row.active,
      },
    });

    return {
      id,
      name: row.name,
      dosage: row.dosage,
      frequency: row.frequency as MedicationFrequency,
      time: row.time || undefined,
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
      time: r.time || undefined,
      status: r.status as 'taken' | 'skipped',
      takenAt: r.takenAt,
    }));
  },

  async toggleMedicationTaken(
    medicationId: string,
    date: string,
    markTaken: boolean
  ): Promise<void> {
    if (markTaken) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const id = `mlog_${medicationId}_${date}`;

      const row: InsertMedicationLogRow = {
        id,
        medicationId,
        date,
        time,
        status: 'taken',
        takenAt: Date.now(),
      };

      await db.insert(medicationLogs).values(row).onConflictDoUpdate({
        target: medicationLogs.id,
        set: {
          status: 'taken',
          time,
          takenAt: Date.now(),
        },
      });
    } else {
      await db
        .delete(medicationLogs)
        .where(
          and(
            eq(medicationLogs.medicationId, medicationId),
            eq(medicationLogs.date, date)
          )
        );
    }
  },

  async getDailyItems(date: string): Promise<DailyMedicationItem[]> {
    const activeMeds = await this.getActiveMedications();
    const dateLogs = await this.getLogsForDate(date);

    const logMap = new Map<string, MedicationLog>();
    dateLogs.forEach((l) => logMap.set(l.medicationId, l));

    return activeMeds.map((med) => {
      const log = logMap.get(med.id);
      return {
        medication: med,
        isTaken: log ? log.status === 'taken' : false,
        takenAtTime: log ? log.time : undefined,
        logId: log ? log.id : undefined,
      };
    });
  },
};
