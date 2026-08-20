import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { symptomRepository } from '../../storage/symptomRepository';
import { DailySymptomEntry, BristolType, BloodPresence } from './types';
import { TFunction } from 'i18next';

export interface ReportStats {
  periodDays: number;
  startDate: string;
  endDate: string;
  totalLogs: number;
  daysWithLogs: number;
  dailyAverage: string;
  bloodCount: number;
  bloodPercentage: string;
  averagePain: string;
  averageStress: string;
  clotsCount: number;
  mucusCount: number;
  urgencyCount: number;
  bristolCounts: Record<BristolType, number>;
  bloodBreakdown: Record<BloodPresence, number>;
  logs: DailySymptomEntry[];
}

export async function calculateReportStats(days: number): Promise<ReportStats> {
  const allLogs = await symptomRepository.getAllLogs();

  const now = new Date();
  const nowYear = now.getFullYear();
  const nowMonth = String(now.getMonth() + 1).padStart(2, '0');
  const nowDay = String(now.getDate()).padStart(2, '0');
  const endDate = `${nowYear}-${nowMonth}-${nowDay}`;

  const startDateTime = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  const startYear = startDateTime.getFullYear();
  const startMonth = String(startDateTime.getMonth() + 1).padStart(2, '0');
  const startDay = String(startDateTime.getDate()).padStart(2, '0');
  const startDate = `${startYear}-${startMonth}-${startDay}`;

  // Filter logs within range
  const filteredLogs = allLogs.filter((log) => log.date >= startDate);

  const uniqueDays = new Set(filteredLogs.map((l) => l.date)).size;
  const totalLogs = filteredLogs.length;

  const dailyAvgNum = totalLogs > 0 ? totalLogs / Math.max(days, 1) : 0;
  const dailyAverage = dailyAvgNum.toFixed(1);

  let bloodCount = 0;
  let painSum = 0;
  let stressSum = 0;
  let stressCount = 0;
  let clotsCount = 0;
  let mucusCount = 0;
  let urgencyCount = 0;

  const bristolCounts: Record<BristolType, number> = {
    type_1: 0,
    type_2: 0,
    type_3: 0,
    type_4: 0,
    type_5: 0,
    type_6: 0,
    type_7: 0,
  };

  const bloodBreakdown: Record<BloodPresence, number> = {
    none: 0,
    traces: 0,
    moderate: 0,
    severe: 0,
  };

  filteredLogs.forEach((log) => {
    if (log.bloodPresence !== 'none') {
      bloodCount++;
    }
    painSum += log.painLevel;
    if (log.stressLevel !== undefined && log.stressLevel !== null) {
      stressSum += log.stressLevel;
      stressCount++;
    }
    if (log.hasClots) {
      clotsCount++;
    }
    if (log.mucusPresence && log.mucusPresence !== 'none') {
      mucusCount++;
    }
    if (log.urgencyLevel && log.urgencyLevel !== 'normal') {
      urgencyCount++;
    }

    if (bristolCounts[log.bristolType] !== undefined) {
      bristolCounts[log.bristolType]++;
    }
    if (bloodBreakdown[log.bloodPresence] !== undefined) {
      bloodBreakdown[log.bloodPresence]++;
    }
  });

  const bloodPercentage = totalLogs > 0 ? `${Math.round((bloodCount / totalLogs) * 100)}%` : '0%';
  const averagePain = totalLogs > 0 ? (painSum / totalLogs).toFixed(1) : '0.0';
  const averageStress = stressCount > 0 ? (stressSum / stressCount).toFixed(1) : '-';

  return {
    periodDays: days,
    startDate,
    endDate,
    totalLogs,
    daysWithLogs: uniqueDays,
    dailyAverage,
    bloodCount,
    bloodPercentage,
    averagePain,
    averageStress,
    clotsCount,
    mucusCount,
    urgencyCount,
    bristolCounts,
    bloodBreakdown,
    logs: filteredLogs,
  };
}

export function buildReportHtml(stats: ReportStats, t: TFunction): string {
  const now = new Date();
  const generatedDate = now.toLocaleDateString();
  const generatedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const bristolNames: Record<BristolType, string> = {
    type_1: t('bristolGuide:type1.title', { defaultValue: 'Tipo 1: Caroços duros separados (Constipação)' }),
    type_2: t('bristolGuide:type2.title', { defaultValue: 'Tipo 2: Forma de salsicha encaroçada (Leve constipação)' }),
    type_3: t('bristolGuide:type3.title', { defaultValue: 'Tipo 3: Salsicha com fendas na superfície (Normal)' }),
    type_4: t('bristolGuide:type4.title', { defaultValue: 'Tipo 4: Salsicha suave, lisa e macia (Ideal)' }),
    type_5: t('bristolGuide:type5.title', { defaultValue: 'Tipo 5: Pedaços macios com bordas nítidas' }),
    type_6: t('bristolGuide:type6.title', { defaultValue: 'Tipo 6: Pedaços esfarrapados, consistência pastosa (Diarreia)' }),
    type_7: t('bristolGuide:type7.title', { defaultValue: 'Tipo 7: Aquoso, sem pedaços sólidos (Diarreia severa)' }),
  };

  const getBristolColor = (type: BristolType) => {
    if (type === 'type_4' || type === 'type_3') return '#10B981';
    if (type === 'type_1' || type === 'type_2' || type === 'type_5') return '#F59E0B';
    return '#EF4444';
  };

  const bristolRows = (Object.keys(stats.bristolCounts) as BristolType[]).map((type) => {
    const count = stats.bristolCounts[type];
    const pct = stats.totalLogs > 0 ? Math.round((count / stats.totalLogs) * 100) : 0;
    const color = getBristolColor(type);

    return `
      <div style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
          <span><strong>${bristolNames[type]}</strong></span>
          <span><strong>${count}</strong> (${pct}%)</span>
        </div>
        <div style="background: #EEF2F6; height: 8px; border-radius: 4px; overflow: hidden;">
          <div style="background: ${color}; width: ${pct}%; height: 100%;"></div>
        </div>
      </div>
    `;
  }).join('');

  // Daily evolution bars for HTML trend chart
  const dailyCountsMap: Record<string, { count: number; hasSevereBlood: boolean; hasBlood: boolean }> = {};
  stats.logs.forEach((log) => {
    if (!dailyCountsMap[log.date]) {
      dailyCountsMap[log.date] = { count: 0, hasSevereBlood: false, hasBlood: false };
    }
    dailyCountsMap[log.date].count++;
    if (log.bloodPresence === 'severe' || log.bloodPresence === 'moderate') {
      dailyCountsMap[log.date].hasSevereBlood = true;
    }
    if (log.bloodPresence !== 'none') {
      dailyCountsMap[log.date].hasBlood = true;
    }
  });

  const allDates: string[] = [];
  const startD = new Date(stats.startDate);
  const endD = new Date(stats.endDate);
  for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
    allDates.push(d.toISOString().split('T')[0]);
  }

  const maxDailyCount = Math.max(...allDates.map((date) => dailyCountsMap[date]?.count || 0), 4);

  const trendBarsHtml = allDates.map((date) => {
    const data = dailyCountsMap[date] || { count: 0, hasSevereBlood: false, hasBlood: false };
    const count = data.count;
    const dayLabel = date.split('-')[2];

    let barColor = '#E2E8F0';
    if (count > 0) {
      if (count >= 5 || data.hasSevereBlood) barColor = '#EF4444';
      else if (count >= 3 || data.hasBlood) barColor = '#F59E0B';
      else barColor = '#10B981';
    }

    const heightPct = count > 0 ? Math.max((count / maxDailyCount) * 100, 14) : 4;

    return `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; min-width: 8px;">
        ${count > 0 ? `<span style="font-size: 8px; font-weight: 700; color: #334155; margin-bottom: 2px;">${count}</span>` : ''}
        <div style="width: 80%; max-width: 14px; height: ${heightPct}%; background: ${barColor}; border-radius: 3px;"></div>
        <span style="font-size: 8px; color: #64748B; margin-top: 4px; font-weight: 600;">${dayLabel}</span>
      </div>
    `;
  }).join('');

  // Detailed chronological table rows
  const tableRows = stats.logs.map((log) => {
    // Blood full label
    const bloodDescMap: Record<BloodPresence, string> = {
      none: t('dailyLog:blood.none', { defaultValue: 'Nenhum sangue' }),
      traces: t('dailyLog:blood.traces', { defaultValue: 'Traços ou estrias' }),
      moderate: t('dailyLog:blood.moderate', { defaultValue: 'Sangue evidente' }),
      severe: t('dailyLog:blood.severe', { defaultValue: 'Intenso / Apenas sangue' }),
    };
    const bloodLabel = bloodDescMap[log.bloodPresence] || log.bloodPresence;

    // Bristol descriptive title
    const bristolTypeNum = log.bristolType.replace('type_', '');
    const bristolFullName = bristolNames[log.bristolType] || `Tipo ${bristolTypeNum}`;

    // Pain description
    let painText = 'Sem dor';
    if (log.painLevel >= 8) painText = 'Dor intensa';
    else if (log.painLevel >= 5) painText = 'Dor moderada';
    else if (log.painLevel >= 1) painText = 'Dor leve';

    // Biomarkers list
    const extras: string[] = [];
    if (log.stressLevel !== undefined && log.stressLevel !== null) {
      let stressRating = 'Calmo';
      if (log.stressLevel >= 7) stressRating = 'Alto / Ansiedade';
      else if (log.stressLevel >= 3) stressRating = 'Moderado';

      extras.push(`
        <div style="margin-bottom: 3px;">
          <span style="color: #7B61FF; font-weight: 700;">🧠 ${t('clinicalExtras:stress.title', { defaultValue: 'Estresse' })}:</span>
          <span>${log.stressLevel}/10 (${stressRating})</span>
        </div>
      `);
    }
    if (log.hasClots) {
      extras.push(`
        <div style="margin-bottom: 3px; color: #DC2626; font-weight: 700;">
          🩸 ${t('clinicalExtras:clots.yes', { defaultValue: 'Coágulos visíveis' })}
        </div>
      `);
    }
    if (log.mucusPresence && log.mucusPresence !== 'none') {
      const mucusLabel = t(`clinicalExtras:mucus.${log.mucusPresence}`, { defaultValue: log.mucusPresence });
      extras.push(`
        <div style="margin-bottom: 3px;">
          <span style="color: #059669; font-weight: 700;">💧 ${t('clinicalExtras:mucus.title', { defaultValue: 'Muco' })}:</span>
          <span>${mucusLabel}</span>
        </div>
      `);
    }
    if (log.urgencyLevel && log.urgencyLevel !== 'normal') {
      const urgencyLabel = t(`clinicalExtras:urgency.${log.urgencyLevel}`, { defaultValue: log.urgencyLevel });
      extras.push(`
        <div style="margin-bottom: 3px;">
          <span style="color: #D97706; font-weight: 700;">⚡ ${t('clinicalExtras:urgency.title', { defaultValue: 'Urgência' })}:</span>
          <span>${urgencyLabel}</span>
        </div>
      `);
    }

    const extraContent = extras.length > 0
      ? extras.join('')
      : `<span style="color: #94A3B8; font-style: italic;">Sem alterações</span>`;

    const notesContent = log.notes && log.notes.trim().length > 0
      ? `<div style="background: #F8FAFC; border-left: 3px solid #7B61FF; padding: 4px 8px; border-radius: 4px; font-style: italic; color: #334155;">"${log.notes}"</div>`
      : `<span style="color: #94A3B8;">-</span>`;

    return `
      <tr>
        <td style="font-weight: 700; white-space: nowrap;">
          ${log.date}<br>
          <span style="font-weight: 500; color: #64748B; font-size: 10px;">⏰ ${log.time || '--:--'}</span>
        </td>
        <td>
          <span class="badge bristol-${log.bristolType}" style="margin-bottom: 4px;">#${bristolTypeNum}</span><br>
          <span style="font-size: 10px; color: #334155; font-weight: 600;">${bristolFullName}</span>
        </td>
        <td>
          <span class="badge blood-${log.bloodPresence}" style="margin-bottom: 4px;">${bloodLabel}</span>
        </td>
        <td style="white-space: nowrap;">
          <div style="font-weight: 700; font-size: 12px; color: ${log.painLevel >= 5 ? '#DC2626' : '#1E293B'};">
            ${log.painLevel}/10
          </div>
          <span style="font-size: 9.5px; color: #64748B;">${painText}</span>
        </td>
        <td style="font-size: 10px; line-height: 1.3;">
          ${extraContent}
        </td>
        <td style="font-size: 10px; min-width: 140px;">
          ${notesContent}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${t('clinicalReport:pdf.documentTitle')}</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      margin: 0;
      padding: 20px;
      font-size: 11.5px;
      line-height: 1.45;
      background-color: #FFFFFF;
    }
    .header {
      border-bottom: 2.5px solid #7B61FF;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .header h1 {
      font-size: 18px;
      font-weight: 800;
      color: #0F172A;
      margin: 0 0 4px 0;
      letter-spacing: -0.3px;
    }
    .header .subtitle {
      font-size: 11.5px;
      color: #64748B;
      margin: 0;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #F8F9FE;
      padding: 8px 12px;
      border-radius: 8px;
      margin-top: 10px;
      font-size: 11px;
      color: #334155;
      border: 1px solid #E9D8FD;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .metric-card {
      background: #FAF5FF;
      border: 1px solid #E9D8FD;
      border-radius: 10px;
      padding: 10px 8px;
      text-align: center;
    }
    .metric-val {
      font-size: 18px;
      font-weight: 800;
      color: #7B61FF;
      margin: 2px 0;
    }
    .metric-label {
      font-size: 9.5px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .section-title {
      font-size: 12.5px;
      font-weight: 800;
      color: #0F172A;
      border-bottom: 1.5px solid #E2E8F0;
      padding-bottom: 4px;
      margin: 16px 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .two-cols {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 14px;
      margin-bottom: 16px;
    }
    .chart-box {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 10.5px;
    }
    th, td {
      border: 1px solid #E2E8F0;
      padding: 7px 8px;
      text-align: left;
      vertical-align: top;
      color: #0F172A;
    }
    th {
      background: #F1F5F9;
      font-weight: 800;
      color: #1E293B;
      font-size: 10px;
      text-transform: uppercase;
    }
    tr:nth-child(even) {
      background: #FAFAFD;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9.5px;
      font-weight: 700;
    }
    .blood-none { background: #DCFCE7; color: #166534; }
    .blood-traces { background: #FEF3C7; color: #92400E; }
    .blood-moderate { background: #FFEDD5; color: #9A3412; }
    .blood-severe { background: #FEE2E2; color: #991B1B; }
    .bristol-type_4, .bristol-type_3 { background: #DCFCE7; color: #166534; }
    .bristol-type_1, .bristol-type_2, .bristol-type_5 { background: #FEF3C7; color: #92400E; }
    .bristol-type_6, .bristol-type_7 { background: #FEE2E2; color: #991B1B; }
    .footer {
      margin-top: 24px;
      border-top: 1px solid #CBD5E1;
      padding-top: 8px;
      font-size: 9px;
      color: #64748B;
      text-align: center;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <h1>${t('clinicalReport:pdf.documentTitle')}</h1>
    <p class="subtitle">${t('clinicalReport:subtitle')}</p>
    <div class="meta-bar">
      <span><strong>${t('clinicalReport:pdf.periodLabel', { start: stats.startDate, end: stats.endDate, days: stats.periodDays })}</strong></span>
      <span>${t('clinicalReport:pdf.generatedOn', { date: generatedDate, time: generatedTime })}</span>
    </div>
  </div>

  <!-- Section 1: Summary Metrics -->
  <div class="section-title">${t('clinicalReport:pdf.patientSummaryTitle')}</div>
  <div class="grid">
    <div class="metric-card">
      <div class="metric-val">${stats.totalLogs}</div>
      <div class="metric-label">${t('clinicalReport:pdf.totalMovements')}</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${stats.dailyAverage}</div>
      <div class="metric-label">${t('clinicalReport:pdf.dailyAverage')}</div>
    </div>
    <div class="metric-card">
      <div class="metric-val" style="color: ${stats.bloodCount > 0 ? '#EF4444' : '#10B981'};">${stats.bloodPercentage}</div>
      <div class="metric-label">${t('clinicalReport:pdf.bloodIncidence')}</div>
    </div>
    <div class="metric-card">
      <div class="metric-val">${stats.averagePain}</div>
      <div class="metric-label">${t('clinicalReport:pdf.avgPain')}</div>
    </div>
  </div>

  <!-- Section 2: Daily Evolution Trend Chart -->
  <div class="section-title">${t('clinicalReport:pdf.dailyTrendTitle')}</div>
  <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <span style="font-size: 9.5px; font-weight: 700; color: #166534; background: #DCFCE7; padding: 2px 8px; border-radius: 6px;">
        ${t('clinicalReport:pdf.normalThreshold')}
      </span>
      <div style="display: flex; gap: 10px; font-size: 9px; color: #64748B;">
        <span><strong style="color: #10B981;">●</strong> ${t('clinicalReport:pdf.chartLegend.remission')}</span>
        <span><strong style="color: #F59E0B;">●</strong> ${t('clinicalReport:pdf.chartLegend.mild')}</span>
        <span><strong style="color: #EF4444;">●</strong> ${t('clinicalReport:pdf.chartLegend.flare')}</span>
      </div>
    </div>
    <div style="display: flex; align-items: flex-end; height: 80px; gap: 3px; border-bottom: 1px dashed #CBD5E1; padding-bottom: 4px;">
      ${trendBarsHtml}
    </div>
  </div>

  <!-- Section 3: Bristol & Biomarkers Distribution -->
  <div class="two-cols">
    <div class="chart-box">
      <div style="font-weight: 700; font-size: 11px; margin-bottom: 8px; color: #1E293B;">
        ${t('clinicalReport:pdf.bristolTitle')}
      </div>
      ${bristolRows}
    </div>

    <div class="chart-box">
      <div style="font-weight: 700; font-size: 11px; margin-bottom: 8px; color: #1E293B;">
        ${t('clinicalReport:pdf.bloodTitle')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between; font-size: 10.5px;">
          <span>${t('clinicalReport:pdf.none')}:</span>
          <strong>${stats.bloodBreakdown.none} (${stats.totalLogs > 0 ? Math.round((stats.bloodBreakdown.none / stats.totalLogs) * 100) : 0}%)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 10.5px;">
          <span>${t('clinicalReport:pdf.traces')}:</span>
          <strong>${stats.bloodBreakdown.traces} (${stats.totalLogs > 0 ? Math.round((stats.bloodBreakdown.traces / stats.totalLogs) * 100) : 0}%)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 10.5px;">
          <span>${t('clinicalReport:pdf.moderate')}:</span>
          <strong>${stats.bloodBreakdown.moderate} (${stats.totalLogs > 0 ? Math.round((stats.bloodBreakdown.moderate / stats.totalLogs) * 100) : 0}%)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 10.5px;">
          <span>${t('clinicalReport:pdf.severe')}:</span>
          <strong>${stats.bloodBreakdown.severe} (${stats.totalLogs > 0 ? Math.round((stats.bloodBreakdown.severe / stats.totalLogs) * 100) : 0}%)</strong>
        </div>

        <div style="margin-top: 6px; border-top: 1px dashed #CBD5E1; padding-top: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 3px;">
            <span>🧠 ${t('clinicalReport:pdf.avgStress')}:</span>
            <strong>${stats.averageStress}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 3px;">
            <span>🩸 ${t('clinicalReport:pdf.clotsIncidence')}:</span>
            <strong>${stats.clotsCount} (${stats.totalLogs > 0 ? Math.round((stats.clotsCount / stats.totalLogs) * 100) : 0}%)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10.5px; margin-bottom: 3px;">
            <span>💧 ${t('clinicalReport:pdf.mucusIncidence')}:</span>
            <strong>${stats.mucusCount} (${stats.totalLogs > 0 ? Math.round((stats.mucusCount / stats.totalLogs) * 100) : 0}%)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10.5px;">
            <span>⚡ ${t('clinicalReport:pdf.urgencyIncidence')}:</span>
            <strong>${stats.urgencyCount} (${stats.totalLogs > 0 ? Math.round((stats.urgencyCount / stats.totalLogs) * 100) : 0}%)</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Section 4: Detailed Chronological Table -->
  <div class="section-title">${t('clinicalReport:pdf.tableTitle')}</div>
  <table>
    <thead>
      <tr>
        <th style="width: 14%;">${t('clinicalReport:pdf.colDate')}</th>
        <th style="width: 20%;">${t('clinicalReport:pdf.colBristol')}</th>
        <th style="width: 16%;">${t('clinicalReport:pdf.colBlood')}</th>
        <th style="width: 12%;">${t('clinicalReport:pdf.colPain')}</th>
        <th style="width: 20%;">${t('clinicalReport:pdf.colExtra')}</th>
        <th style="width: 18%;">${t('clinicalReport:pdf.colNotes')}</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows.length > 0 ? tableRows : `<tr><td colspan="6" style="text-align: center; color: #64748B; padding: 20px;">${t('clinicalReport:summaryCard.noData')}</td></tr>`}
    </tbody>
  </table>

  <!-- Confidentiality Notice Footer -->
  <div class="footer">
    ${t('clinicalReport:pdf.confidentialityNotice')}
  </div>
</body>
</html>
  `;
}

export async function generateAndShareClinicalReport(days: number, t: TFunction): Promise<void> {
  const stats = await calculateReportStats(days);
  const html = buildReportHtml(stats, t);

  if (Platform.OS === 'web') {
    // Print window for web preview
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
    return;
  }

  // Native iOS / Android via expo-print and expo-sharing
  const { uri } = await Print.printToFileAsync({ html });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: t('clinicalReport:title'),
    });
  }
}
