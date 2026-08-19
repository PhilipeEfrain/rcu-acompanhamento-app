import { BloodPresence, BristolType, CrisisEvaluation, CrisisSeverity, DailyAggregatedSummary, DailySymptomEntry, MucusPresence, UrgencyLevel } from './types';

interface EvaluateCrisisParams {
  bristolType: BristolType;
  bloodPresence: BloodPresence;
  painLevel: number;
  hasClots?: boolean;
  mucusPresence?: MucusPresence;
  urgencyLevel?: UrgencyLevel;
}

/**
 * Pure clinical decision function for a single bowel movement symptom assessment.
 * Evaluates core symptoms (Bristol, Blood, Pain) plus extended biomarkers (Clots, Mucus, Urgency).
 */
export function evaluateCrisis({
  bristolType,
  bloodPresence,
  painLevel,
  hasClots,
  mucusPresence,
  urgencyLevel,
}: EvaluateCrisisParams): CrisisEvaluation {
  const isSevereBristol = bristolType === 'type_6' || bristolType === 'type_7';
  const isSevereBlood = bloodPresence === 'moderate' || bloodPresence === 'severe';
  const isSeverePain = painLevel >= 7;
  const isSevereUrgency = urgencyLevel === 'severe';
  const isClotsPresent = Boolean(hasClots);

  const isModerateBristol = bristolType === 'type_5' || bristolType === 'type_1';
  const isModerateBlood = bloodPresence === 'traces';
  const isModeratePain = painLevel >= 3 && painLevel < 7;
  const isModerateUrgency = urgencyLevel === 'moderate';
  const isMucusPresent = mucusPresence === 'mild' || mucusPresence === 'abundant';

  let severity: CrisisSeverity = 'remission';

  if (
    isSevereBlood ||
    (isSevereBristol && isModerateBlood) ||
    isSeverePain ||
    isClotsPresent ||
    isSevereUrgency
  ) {
    severity = 'moderate_to_severe_flare';
  } else if (
    isModerateBristol ||
    isModerateBlood ||
    isModeratePain ||
    isSevereBristol ||
    isModerateUrgency ||
    isMucusPresent
  ) {
    severity = 'mild_activity';
  } else {
    severity = 'remission';
  }

  if (severity === 'moderate_to_severe_flare') {
    return {
      severity,
      titleKey: 'crisisFeedback:flare.title',
      messageKey: 'crisisFeedback:flare.message',
      guidelinesKeys: [
        'crisisFeedback:flare.care_hydration',
        'crisisFeedback:flare.care_no_nsaids',
        'crisisFeedback:flare.care_contact_doctor',
        'crisisFeedback:flare.care_red_flags',
      ],
      badgeColor: '#FF6B81',
    };
  }

  if (severity === 'mild_activity') {
    return {
      severity,
      titleKey: 'crisisFeedback:mild.title',
      messageKey: 'crisisFeedback:mild.message',
      guidelinesKeys: [
        'crisisFeedback:mild.care_hydration',
        'crisisFeedback:mild.care_diet',
        'crisisFeedback:mild.care_monitor',
      ],
      badgeColor: '#F59E0B',
    };
  }

  return {
    severity: 'remission',
    titleKey: 'crisisFeedback:remission.title',
    messageKey: 'crisisFeedback:remission.message',
    guidelinesKeys: [
      'crisisFeedback:remission.care_habits',
      'crisisFeedback:remission.care_medication',
    ],
    badgeColor: '#10B981',
  };
}

/**
 * Evaluates the consolidated clinical status of an entire day given all its bowel movement logs.
 * Combines stool frequency (Mayo subscore), bleeding, consistency, pain, clots, mucus and tenesmus.
 */
export function evaluateDailySummary(date: string, entries: DailySymptomEntry[]): DailyAggregatedSummary {
  if (entries.length === 0) {
    return {
      date,
      totalMovements: 0,
      overallSeverity: 'remission',
      maxPain: 0,
      hasBlood: false,
      worstBristol: 'type_4',
      hasClots: false,
      hasAbundantMucus: false,
      hasSevereUrgency: false,
      maxStress: 0,
    };
  }

  const totalMovements = entries.length;
  let maxPain = 0;
  let maxStress = 0;
  let hasBlood = false;
  let hasSevereBlood = false;
  let hasModerateBlood = false;
  let hasLiquidStool = false;
  let hasClots = false;
  let hasAbundantMucus = false;
  let hasSevereUrgency = false;
  let worstBristol: BristolType = 'type_4';

  const severityLevels: Record<CrisisSeverity, number> = {
    remission: 0,
    mild_activity: 1,
    moderate_to_severe_flare: 2,
  };

  let maxSeverityScore = 0;

  for (const entry of entries) {
    if (entry.painLevel > maxPain) maxPain = entry.painLevel;
    if (entry.stressLevel && entry.stressLevel > maxStress) maxStress = entry.stressLevel;
    if (entry.bloodPresence !== 'none') hasBlood = true;
    if (entry.bloodPresence === 'moderate' || entry.bloodPresence === 'severe') hasSevereBlood = true;
    if (entry.bloodPresence === 'traces') hasModerateBlood = true;
    if (entry.hasClots) hasClots = true;
    if (entry.mucusPresence === 'abundant') hasAbundantMucus = true;
    if (entry.urgencyLevel === 'severe') hasSevereUrgency = true;

    if (entry.bristolType === 'type_7' || entry.bristolType === 'type_6') {
      hasLiquidStool = true;
      worstBristol = entry.bristolType;
    }

    const singleEval = evaluateCrisis(entry);
    const score = severityLevels[singleEval.severity];
    if (score > maxSeverityScore) maxSeverityScore = score;
  }

  let overallSeverity: CrisisSeverity = 'remission';

  // Mayo Criteria & Extended Biomarkers: frequency >= 6 OR severe blood OR intense pain OR clots OR severe urgency
  if (
    totalMovements >= 6 ||
    hasSevereBlood ||
    maxPain >= 7 ||
    hasClots ||
    hasSevereUrgency ||
    (totalMovements >= 4 && hasModerateBlood)
  ) {
    overallSeverity = 'moderate_to_severe_flare';
  } else if (
    totalMovements >= 3 ||
    hasModerateBlood ||
    hasLiquidStool ||
    maxPain >= 3 ||
    hasAbundantMucus ||
    maxSeverityScore >= 1
  ) {
    overallSeverity = 'mild_activity';
  } else {
    overallSeverity = 'remission';
  }

  return {
    date,
    totalMovements,
    overallSeverity,
    maxPain,
    hasBlood,
    worstBristol,
    hasClots,
    hasAbundantMucus,
    hasSevereUrgency,
    maxStress,
  };
}
