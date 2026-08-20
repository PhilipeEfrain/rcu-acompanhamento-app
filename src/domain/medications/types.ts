export type MedicationFrequency =
  | 'daily'
  | 'twice_daily'
  | 'three_times_daily'
  | 'weekly'
  | 'biweekly'
  | 'every_eight_weeks';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  times: string[]; // List of times, e.g. ['08:00', '14:00', '20:00']
  time?: string; // Legacy fallback
  instructions?: string;
  active: boolean;
  createdAt: number;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  date: string;
  doseIndex: number;
  scheduledTime?: string;
  time?: string;
  status: 'taken' | 'skipped';
  takenAt: number;
}

export interface DailyMedicationDoseItem {
  id: string; // Unique ID: `${medication.id}_${doseIndex}`
  medication: Medication;
  doseIndex: number; // 0-indexed (0, 1, 2)
  totalDosesForDay: number;
  scheduledTime?: string;
  isTaken: boolean;
  takenAtTime?: string;
  logId?: string;
}

// Backward compatibility alias
export type DailyMedicationItem = DailyMedicationDoseItem;
