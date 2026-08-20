export type BristolType =
  | 'type_1'
  | 'type_2'
  | 'type_3'
  | 'type_4'
  | 'type_5'
  | 'type_6'
  | 'type_7';

export type OutputType =
  | 'feces'
  | 'blood_mucus_only'
  | 'gas_bloody_false_alarm';

export type TimePeriod =
  | 'waking_morning'
  | 'afternoon'
  | 'night';

export type BloodPresence =
  | 'none'
  | 'traces'
  | 'moderate'
  | 'severe';

export type BloodAspect =
  | 'none'
  | 'traces'
  | 'mixed'
  | 'pure_blood'
  | 'clots';

export type CrisisSeverity =
  | 'remission'
  | 'mild_activity'
  | 'moderate_to_severe_flare';

export type MucusPresence =
  | 'none'
  | 'mild'
  | 'abundant';

export type UrgencyLevel =
  | 'normal'
  | 'moderate'
  | 'severe';

export interface DailySymptomEntry {
  id?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time?: string; // Time of bowel movement (HH:mm)
  bristolType: BristolType;
  bloodPresence: BloodPresence;
  painLevel: number; // 0 to 10
  notes?: string;
  severity: CrisisSeverity;
  createdAt: number; // Epoch timestamp

  // Extended clinical biomarkers (Issue #9 & #16)
  outputType?: OutputType;
  period?: TimePeriod;
  bloodAspect?: BloodAspect;
  stressLevel?: number; // 0 to 10
  hasClots?: boolean;
  mucusPresence?: MucusPresence;
  urgencyLevel?: UrgencyLevel;
}

export interface CrisisEvaluation {
  severity: CrisisSeverity;
  titleKey: string;
  messageKey: string;
  guidelinesKeys: string[];
  badgeColor: string;
  contextualFeedbackKey?: string;
}

export interface DailyAggregatedSummary {
  date: string;
  totalMovements: number;
  totalFecesMovements?: number;
  totalTenesmusCount?: number;
  totalBloodMucusOnlyCount?: number;
  hasMorningPooling?: boolean;
  overallSeverity: CrisisSeverity;
  maxPain: number;
  hasBlood: boolean;
  worstBristol: BristolType;
  hasClots?: boolean;
  hasAbundantMucus?: boolean;
  hasSevereUrgency?: boolean;
  maxStress?: number;
}

