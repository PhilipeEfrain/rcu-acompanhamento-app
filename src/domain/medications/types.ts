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
  time?: string;
  instructions?: string;
  active: boolean;
  createdAt: number;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  date: string;
  time?: string;
  status: 'taken' | 'skipped';
  takenAt: number;
}

export interface DailyMedicationItem {
  medication: Medication;
  isTaken: boolean;
  takenAtTime?: string;
  logId?: string;
}
