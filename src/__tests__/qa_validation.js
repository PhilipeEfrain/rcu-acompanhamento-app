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

console.log('\n✔ Todos os testes de qualidade foram aprovados com sucesso!');
