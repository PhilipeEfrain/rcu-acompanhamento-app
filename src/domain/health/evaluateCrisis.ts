import { BloodPresence, BristolType, CrisisEvaluation, CrisisSeverity } from './types';

interface EvaluateCrisisParams {
  bristolType: BristolType;
  bloodPresence: BloodPresence;
  painLevel: number;
}

/**
 * Pure clinical decision function for Ulcerative Colitis symptom assessment.
 * Returns semantic i18n translation keys instead of hardcoded strings.
 */
export function evaluateCrisis({
  bristolType,
  bloodPresence,
  painLevel,
}: EvaluateCrisisParams): CrisisEvaluation {
  const isSevereBristol = bristolType === 'type_6' || bristolType === 'type_7';
  const isSevereBlood = bloodPresence === 'moderate' || bloodPresence === 'severe';
  const isSeverePain = painLevel >= 7;

  const isModerateBristol = bristolType === 'type_5' || bristolType === 'type_1';
  const isModerateBlood = bloodPresence === 'traces';
  const isModeratePain = painLevel >= 3 && painLevel < 7;

  let severity: CrisisSeverity = 'remission';

  if (isSevereBlood || (isSevereBristol && isModerateBlood) || isSeverePain) {
    severity = 'moderate_to_severe_flare';
  } else if (isModerateBristol || isModerateBlood || isModeratePain || isSevereBristol) {
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
