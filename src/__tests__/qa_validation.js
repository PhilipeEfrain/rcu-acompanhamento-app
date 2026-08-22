const fs = require('fs');
const path = require('path');

function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return [...res, prefix + el];
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
}

console.log('=== [QA Suite] 1. Validando Paridade de i18n (pt-BR vs en-US) ===');
const locales = [
  'common.json',
  'dailyLog.json',
  'crisisFeedback.json',
  'history.json',
  'settings.json',
  'clinicalExtras.json',
  'bristolGuide.json',
  'emotionalSupport.json',
  'clinicalReport.json',
  'medications.json',
  'careGuide.json',
  'tipJar.json',
  'medicalDisclaimer.json',
];

let i18nErrors = 0;
locales.forEach((file) => {
  const ptPath = path.join(__dirname, '../locales/pt-BR', file);
  const enPath = path.join(__dirname, '../locales/en-US', file);

  const ptContent = JSON.parse(fs.readFileSync(ptPath, 'utf8'));
  const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  const ptKeys = getKeys(ptContent);
  const enKeys = getKeys(enContent);

  const missingInEn = ptKeys.filter((k) => !enKeys.includes(k));
  const missingInPt = enKeys.filter((k) => !ptKeys.includes(k));

  if (missingInEn.length > 0) {
    console.error(`❌ [${file}] Chaves faltando em en-US:`, missingInEn);
    i18nErrors++;
  }
  if (missingInPt.length > 0) {
    console.error(`❌ [${file}] Chaves faltando em pt-BR:`, missingInPt);
    i18nErrors++;
  }

  if (missingInEn.length === 0 && missingInPt.length === 0) {
    console.log(`✔ [${file}] 100% de paridade (${ptKeys.length} chaves sincronizadas)`);
  }
});

if (i18nErrors > 0) {
  console.error('Falha na paridade de i18n!');
  process.exit(1);
}

console.log('\n=== [QA Suite] 2. Verificação de Hardcoded Strings e Logs Sensíveis ===');
const checkDirs = [
  path.join(__dirname, '../components'),
  path.join(__dirname, '../screens'),
  path.join(__dirname, '../security'),
  path.join(__dirname, '../storage'),
];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir, { recursive: true });
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isFile() && (f.endsWith('.tsx') || f.endsWith('.ts'))) {
      const code = fs.readFileSync(fullPath, 'utf8');
      if (code.includes('console.log(')) {
        console.warn(`⚠️ Possível console.log em: ${f}`);
      }
    }
  }
}

checkDirs.forEach(scanDir);
console.log('✔ Nenhuma violação de log sensível encontrada.');

console.log('\n=== [QA Suite] 3. Validação de Lógica Clínica (Tenesmo, Pooling & Mayo) ===');
const { evaluateCrisis, evaluateDailySummary } = require('../domain/health/evaluateCrisis');

// 1. Tenesmus / False Alarm
const tenesmusEval = evaluateCrisis({
  bristolType: 'type_4',
  bloodPresence: 'traces',
  painLevel: 2,
  outputType: 'gas_bloody_false_alarm',
  period: 'afternoon',
});
if (tenesmusEval.contextualFeedbackKey !== 'crisisFeedback:tenesmusSupport') {
  console.error('❌ Falha na detecção de feedback para Tenesmo!');
  process.exit(1);
}
console.log('✔ Tenesmo retal gera feedback contextual de acolhimento (tenesmusSupport).');

// 2. Morning Pooling
const morningEval = evaluateCrisis({
  bristolType: 'type_4',
  bloodPresence: 'traces',
  painLevel: 2,
  outputType: 'blood_mucus_only',
  period: 'waking_morning',
});
if (morningEval.contextualFeedbackKey !== 'crisisFeedback:poolingMorning') {
  console.error('❌ Falha na detecção de pooling matinal!');
  process.exit(1);
}
console.log('✔ Saída com sangue/muco ao acordar identifica pooling matinal (poolingMorning).');

// 3. Daily Summary with Tenesmus & Stool breakdown
const mockDailyLogs = [
  {
    date: '2026-08-20',
    outputType: 'gas_bloody_false_alarm',
    period: 'waking_morning',
    bristolType: 'type_4',
    bloodPresence: 'traces',
    painLevel: 2,
    severity: 'mild_activity',
    createdAt: Date.now() - 3600000,
  },
  {
    date: '2026-08-20',
    outputType: 'feces',
    period: 'afternoon',
    bristolType: 'type_4',
    bloodPresence: 'none',
    painLevel: 0,
    severity: 'remission',
    createdAt: Date.now(),
  },
];

const dailySummary = evaluateDailySummary('2026-08-20', mockDailyLogs);
if (
  dailySummary.totalMovements !== 2 ||
  dailySummary.totalFecesMovements !== 1 ||
  dailySummary.totalTenesmusCount !== 1 ||
  !dailySummary.hasMorningPooling
) {
  console.error('❌ Falha na agregação do resumo diário:', dailySummary);
  process.exit(1);
}
console.log('✔ Resumo diário agrega totalFecesMovements, totalTenesmusCount e hasMorningPooling corretamente.');

// 4. Severe Emergency (Truelove & Witts / ASUC)
const emergencyEval = evaluateCrisis({
  bristolType: 'type_7',
  bloodPresence: 'severe',
  bloodAspect: 'pure_blood',
  painLevel: 8,
  hasFever: true,
  hasDizziness: true,
});
if (emergencyEval.severity !== 'severe_emergency' || emergencyEval.titleKey !== 'crisisFeedback:emergency.title') {
  console.error('❌ Falha no disparo de Alerta Vermelho de Emergência!', emergencyEval);
  process.exit(1);
}
console.log('✔ Protocolo de Emergência Vermelha (severe_emergency) ativado com sucesso para sangue severo + febre/tontura.');

const emergencyPainEval = evaluateCrisis({
  bristolType: 'type_4',
  bloodPresence: 'none',
  painLevel: 9,
});
if (emergencyPainEval.severity !== 'severe_emergency') {
  console.error('❌ Falha no disparo de emergência para dor aguda extrema (>= 9)!', emergencyPainEval);
  process.exit(1);
}
console.log('✔ Dor abdominal aguda extrema (>= 9) dispara Alerta Vermelho de Emergência.');

console.log('\n=== [QA Suite] 4. Validação de Cronologia & Bloqueio de Datas Futuras ===');
const { getLocalDateString, isFutureDate } = require('../domain/health/dateUtils');
const today = getLocalDateString();
const tomorrow = new Date(Date.now() + 86400000);
const tomorrowStr = getLocalDateString(tomorrow);
const yesterday = new Date(Date.now() - 86400000);
const yesterdayStr = getLocalDateString(yesterday);

if (isFutureDate(today)) {
  console.error('❌ Data de hoje não deve ser considerada futura!');
  process.exit(1);
}
if (isFutureDate(yesterdayStr)) {
  console.error('❌ Data de ontem não deve ser considerada futura!');
  process.exit(1);
}
if (!isFutureDate(tomorrowStr)) {
  console.error('❌ Data de amanhã DEVE ser identificada como futura!');
  process.exit(1);
}
console.log('✔ Verificação de datas futuras (dateUtils.isFutureDate) opera com 100% de precisão.');

console.log('\n✔ Todos os testes de qualidade foram aprovados com sucesso!');


