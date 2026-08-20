import {
  BloodAspect,
  BloodPresence,
  BristolType,
  CrisisEvaluation,
  CrisisSeverity,
  DailyAggregatedSummary,
  DailySymptomEntry,
  MucusPresence,
  OutputType,
  TimePeriod,
  UrgencyLevel,
} from './types';

interface EvaluateCrisisParams {
  bristolType: BristolType;
  bloodPresence: BloodPresence;
  painLevel: number;
  outputType?: OutputType;
  period?: TimePeriod;
  bloodAspect?: BloodAspect;
  hasClots?: boolean;
  mucusPresence?: MucusPresence;
  urgencyLevel?: UrgencyLevel;
}

/**
 * Pure clinical decision function for a single bowel movement / symptom assessment.
 * Evaluates core symptoms (Bristol, Blood, Pain, Output Type, Period) plus extended biomarkers.
 */
export function evaluateCrisis({
  bristolType,
  bloodPresence,
  painLevel,
  outputType = 'feces',
  period,
  bloodAspect,
  hasClots,
  mucusPresence,
  urgencyLevel,
}: EvaluateCrisisParams): CrisisEvaluation {
  const isSevereBristol = outputType === 'feces' && (bristolType === 'type_6' || bristolType === 'type_7');
  const isSevereBlood =
    bloodPresence === 'severe' ||
    bloodAspect === 'pure_blood' ||
    bloodPresence === 'moderate';
  const isSeverePain = painLevel >= 7;
  const isSevereUrgency = urgencyLevel === 'severe';
  const isClotsPresent = Boolean(hasClots) || bloodAspect === 'clots';

  const isModerateBristol = outputType === 'feces' && (bristolType === 'type_5' || bristolType === 'type_1');
  const isModerateBlood = bloodPresence === 'traces' || bloodAspect === 'traces' || bloodAspect === 'mixed';
  const isModeratePain = painLevel >= 3 && painLevel < 7;
  const isModerateUrgency = urgencyLevel === 'moderate';
  const isMucusPresent = mucusPresence === 'mild' || mucusPresence === 'abundant' || outputType === 'blood_mucus_only';

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
    isMucusPresent ||
    outputType === 'gas_bloody_false_alarm'
  ) {
    severity = 'mild_activity';
  } else {
    severity = 'remission';
  }

  // Contextual Psychoeducational Feedback (Issue #16)
  let contextualFeedbackKey: string | undefined;
  if (outputType === 'gas_bloody_false_alarm') {
    contextualFeedbackKey = 'crisisFeedback:tenesmusSupport';
  } else if (
    period === 'waking_morning' &&
    (outputType === 'blood_mucus_only' || isModerateBlood || isMucusPresent) &&
    !isSevereBlood &&
    !isClotsPresent
  ) {
    contextualFeedbackKey = 'crisisFeedback:poolingMorning';
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
      contextualFeedbackKey,
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
      contextualFeedbackKey,
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
    contextualFeedbackKey,
  };
}

/**
 * Evaluates the consolidated clinical status of an entire day given all its bowel movement logs.
 * Combines stool frequency (Mayo subscore), bleeding, consistency, pain, clots, mucus, tenesmus and morning pooling.
 */
export function evaluateDailySummary(date: string, entries: DailySymptomEntry[]): DailyAggregatedSummary {
  if (entries.length === 0) {
    return {
      date,
      totalMovements: 0,
      totalFecesMovements: 0,
      totalTenesmusCount: 0,
      totalBloodMucusOnlyCount: 0,
      hasMorningPooling: false,
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
  let totalFecesMovements = 0;
  let totalTenesmusCount = 0;
  let totalBloodMucusOnlyCount = 0;
  let hasMorningPooling = false;

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
    const outType = entry.outputType || 'feces';
    if (outType === 'feces') totalFecesMovements++;
    else if (outType === 'gas_bloody_false_alarm') totalTenesmusCount++;
    else if (outType === 'blood_mucus_only') totalBloodMucusOnlyCount++;

    if (entry.painLevel > maxPain) maxPain = entry.painLevel;
    if (entry.stressLevel && entry.stressLevel > maxStress) maxStress = entry.stressLevel;
    if (entry.bloodPresence !== 'none' || (entry.bloodAspect && entry.bloodAspect !== 'none')) hasBlood = true;
    if (
      entry.bloodPresence === 'moderate' ||
      entry.bloodPresence === 'severe' ||
      entry.bloodAspect === 'pure_blood'
    ) {
      hasSevereBlood = true;
    }
    if (entry.bloodPresence === 'traces' || entry.bloodAspect === 'traces' || entry.bloodAspect === 'mixed') {
      hasModerateBlood = true;
    }
    if (entry.hasClots || entry.bloodAspect === 'clots') hasClots = true;
    if (entry.mucusPresence === 'abundant') hasAbundantMucus = true;
    if (entry.urgencyLevel === 'severe') hasSevereUrgency = true;

    if (outType === 'feces' && (entry.bristolType === 'type_7' || entry.bristolType === 'type_6')) {
      hasLiquidStool = true;
      worstBristol = entry.bristolType;
    }

    if (
      entry.period === 'waking_morning' &&
      (outType === 'blood_mucus_only' || entry.bloodPresence !== 'none' || entry.bloodAspect !== 'none')
    ) {
      hasMorningPooling = true;
    }

    const singleEval = evaluateCrisis(entry);
    const score = severityLevels[singleEval.severity];
    if (score > maxSeverityScore) maxSeverityScore = score;
  }

  let overallSeverity: CrisisSeverity = 'remission';

  // Mayo Criteria: Fecal movement frequency >= 6 or severe clinical biomarkers
  if (
    totalFecesMovements >= 6 ||
    totalMovements >= 8 ||
    hasSevereBlood ||
    maxPain >= 7 ||
    hasClots ||
    hasSevereUrgency ||
    (totalFecesMovements >= 4 && hasModerateBlood)
  ) {
    overallSeverity = 'moderate_to_severe_flare';
  } else if (
    totalFecesMovements >= 3 ||
    totalTenesmusCount >= 2 ||
    totalBloodMucusOnlyCount >= 1 ||
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
    totalFecesMovements,
    totalTenesmusCount,
    totalBloodMucusOnlyCount,
    hasMorningPooling,
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

