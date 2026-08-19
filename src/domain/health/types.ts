export type BristolType =
  | 'type_1'
  | 'type_2'
  | 'type_3'
  | 'type_4'
  | 'type_5'
  | 'type_6'
  | 'type_7';

export type BloodPresence =
  | 'none'
  | 'traces'
  | 'moderate'
  | 'severe';

export type CrisisSeverity =
  | 'remission'
  | 'mild_activity'
  | 'moderate_to_severe_flare';

export interface DailySymptomEntry {
  id?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  bristolType: BristolType;
  bloodPresence: BloodPresence;
  painLevel: number; // 0 to 10
  notes?: string;
  severity: CrisisSeverity;
  createdAt: number; // Timestamp
}

export interface CrisisEvaluation {
  severity: CrisisSeverity;
  titleKey: string;
  messageKey: string;
  guidelinesKeys: string[];
  badgeColor: string;
}
