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
  const endDate = now.toISOString().split('T')[0];

  const startDateTime = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  const startDate = startDateTime.toISOString().split('T')[0];

  // Filter logs within range
  const filteredLogs = allLogs.filter((log) => log.date >= startDate && log.date <= endDate);

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

  const bristolLabels: Record<BristolType, string> = {
    type_1: t('clinicalReport:pdf.colBristol') + ' #1 (' + t('bristolGuide:type1.title', { defaultValue: 'Tipo 1' }) + ')',
    type_2: t('clinicalReport:pdf.colBristol') + ' #2 (' + t('bristolGuide:type2.title', { defaultValue: 'Tipo 2' }) + ')',
    type_3: t('clinicalReport:pdf.colBristol') + ' #3 (' + t('bristolGuide:type3.title', { defaultValue: 'Tipo 3' }) + ')',
    type_4: t('clinicalReport:pdf.colBristol') + ' #4 (' + t('bristolGuide:type4.title', { defaultValue: 'Tipo 4 ★' }) + ')',
    type_5: t('clinicalReport:pdf.colBristol') + ' #5 (' + t('bristolGuide:type5.title', { defaultValue: 'Tipo 5' }) + ')',
    type_6: t('clinicalReport:pdf.colBristol') + ' #6 (' + t('bristolGuide:type6.title', { defaultValue: 'Tipo 6' }) + ')',
    type_7: t('clinicalReport:pdf.colBristol') + ' #7 (' + t('bristolGuide:type7.title', { defaultValue: 'Tipo 7' }) + ')',
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
          <span><strong>${bristolLabels[type]}</strong></span>
          <span>${count} (${pct}%)</span>
        </div>
        <div style="background: #EEF2F6; height: 7px; border-radius: 4px; overflow: hidden;">
          <div style="background: ${color}; width: ${pct}%; height: 100%;"></div>
        </div>
      </div>
    `;
  }).join('');

  // Generate daily bars for HTML trend chart
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

    const heightPct = count > 0 ? Math.max((count / maxDailyCount) * 100, 12) : 4;

    return `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; min-width: 8px;">
        ${count > 0 ? `<span style="font-size: 8px; font-weight: 700; color: #475569; margin-bottom: 2px;">${count}</span>` : ''}
        <div style="width: 80%; max-width: 14px; height: ${heightPct}%; background: ${barColor}; border-radius: 3px;"></div>
        <span style="font-size: 8px; color: #94A3B8; margin-top: 4px;">${dayLabel}</span>
      </div>
    `;
  }).join('');

  const tableRows = stats.logs.map((log) => {
    const bloodLabel = t(`clinicalReport:pdf.${log.bloodPresence}`, { defaultValue: log.bloodPresence });
    const extras: string[] = [];
    
    if (log.stressLevel !== undefined && log.stressLevel !== null) {
      extras.push(`<span style="color: #7B61FF; font-weight: 600;">🧠 ${t('clinicalExtras:stress.title', { defaultValue: 'Estresse' })}: ${log.stressLevel}/10</span>`);
    }
    if (log.hasClots) {
      extras.push(`<span style="color: #DC2626; font-weight: 600;">🩸 ${t('clinicalExtras:clots.yes', { defaultValue: 'Coágulos' })}</span>`);
    }
    if (log.mucusPresence && log.mucusPresence !== 'none') {
      const mucusLabel = t(`clinicalExtras:mucus.${log.mucusPresence}`, { defaultValue: log.mucusPresence });
      extras.push(`<span style="color: #059669; font-weight: 600;">💧 ${t('clinicalExtras:mucus.title', { defaultValue: 'Muco' })}: ${mucusLabel}</span>`);
    }
    if (log.urgencyLevel && log.urgencyLevel !== 'normal') {
      const urgencyLabel = t(`clinicalExtras:urgency.${log.urgencyLevel}`, { defaultValue: log.urgencyLevel });
      extras.push(`<span style="color: #D97706; font-weight: 600;">⚡ ${t('clinicalExtras:urgency.title', { defaultValue: 'Urgência' })}: ${urgencyLabel}</span>`);
    }

    const extraText = extras.length > 0 ? extras.join('<br>') : '-';
    const notesText = log.notes && log.notes.trim().length > 0 ? log.notes : '-';

    return `
      <tr>
        <td>${log.date}</td>
        <td>${log.time || '-'}</td>
        <td><span class="badge bristol-${log.bristolType}">#${log.bristolType.replace('type_', '')}</span></td>
        <td><span class="badge blood-${log.bloodPresence}">${bloodLabel}</span></td>
        <td><strong>${log.painLevel}</strong>/10</td>
        <td style="font-size: 10.5px; line-height: 1.4;">${extraText}</td>
        <td style="font-size: 10px; color: #475569;">${notesText}</td>
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
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1E293B;
      margin: 0;
      padding: 24px;
      font-size: 12px;
      line-height: 1.5;
    }
    .header {
      border-bottom: 2px solid #7B61FF;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 18px;
      color: #1E293B;
      margin: 0 0 4px 0;
    }
    .header .subtitle {
      font-size: 12px;
      color: #64748B;
      margin: 0;
    }
    .meta-bar {
      display: flex;
      justify-content: space-between;
      background: #F8F9FE;
      padding: 8px 12px;
      border-radius: 8px;
      margin-top: 10px;
      font-size: 11px;
      color: #475569;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    .metric-card {
      background: #FAF5FF;
      border: 1px solid #E9D8FD;
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }
    .metric-val {
      font-size: 20px;
      font-weight: 700;
      color: #7B61FF;
      margin: 2px 0;
    }
    .metric-label {
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
      text-transform: uppercase;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      color: #1E293B;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 4px;
      margin: 18px 0 10px 0;
    }
    .two-cols {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
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
      margin-top: 10px;
      font-size: 11px;
    }
    th, td {
      border: 1px solid #E2E8F0;
      padding: 6px 8px;
      text-align: left;
    }
    th {
      background: #F1F5F9;
      font-weight: 700;
      color: #334155;
    }
    tr:nth-child(even) {
      background: #F8FAFC;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }
    .blood-none { background: #DCFCE7; color: #166534; }
    .blood-traces { background: #FEF3C7; color: #92400E; }
    .blood-moderate { background: #FFEDD5; color: #9A3412; }
    .blood-severe { background: #FEE2E2; color: #991B1B; }
    .bristol-type_4 { background: #DCFCE7; color: #166534; }
    .bristol-type_3 { background: #DCFCE7; color: #166534; }
    .bristol-type_1, .bristol-type_2, .bristol-type_5 { background: #FEF3C7; color: #92400E; }
    .bristol-type_6, .bristol-type_7 { background: #FEE2E2; color: #991B1B; }
    .footer {
      margin-top: 28px;
      border-top: 1px solid #CBD5E1;
      padding-top: 10px;
      font-size: 9px;
      color: #94A3B8;
      text-align: center;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${t('clinicalReport:pdf.documentTitle')}</h1>
    <p class="subtitle">${t('clinicalReport:subtitle')}</p>
    <div class="meta-bar">
      <span><strong>${t('clinicalReport:pdf.periodLabel', { start: stats.startDate, end: stats.endDate, days: stats.periodDays })}</strong></span>
      <span>${t('clinicalReport:pdf.generatedOn', { date: generatedDate, time: generatedTime })}</span>
    </div>
  </div>

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

  <div class="section-title">${t('clinicalReport:pdf.dailyTrendTitle')}</div>
  <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <span style="font-size: 10px; font-weight: 700; color: #166534; background: #DCFCE7; padding: 2px 8px; border-radius: 6px;">
        ${t('clinicalReport:pdf.normalThreshold')}
      </span>
      <div style="display: flex; gap: 12px; font-size: 9.5px; color: #64748B;">
        <span><strong style="color: #10B981;">●</strong> ${t('clinicalReport:pdf.chartLegend.remission')}</span>
        <span><strong style="color: #F59E0B;">●</strong> ${t('clinicalReport:pdf.chartLegend.mild')}</span>
        <span><strong style="color: #EF4444;">●</strong> ${t('clinicalReport:pdf.chartLegend.flare')}</span>
      </div>
    </div>
    <div style="display: flex; align-items: flex-end; height: 90px; gap: 4px; border-bottom: 1px dashed #CBD5E1; padding-bottom: 4px;">
      ${trendBarsHtml}
    </div>
  </div>

  <div class="two-cols">
    <div class="chart-box">
      <div style="font-weight: 700; font-size: 11px; margin-bottom: 10px; color: #334155;">
        ${t('clinicalReport:pdf.bristolTitle')}
      </div>
      ${bristolRows}
    </div>

    <div class="chart-box">
      <div style="font-weight: 700; font-size: 11px; margin-bottom: 10px; color: #334155;">
        ${t('clinicalReport:pdf.bloodTitle')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span>${t('clinicalReport:pdf.none')}:</span>
          <strong>${stats.bloodBreakdown.none} (${stats.totalLogs > 0 ? Math.round((stats.bloodBreakdown.none / stats.totalLogs) * 100) : 0}%)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span>${t('clinicalReport:pdf.traces')}:</span>
          <strong>${stats.bloodBreakdown.traces} (${stats.totalLogs > 0 ? Math.round((stats.bloodBreakdown.traces / stats.totalLogs) * 100) : 0}%)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span>${t('clinicalReport:pdf.moderate')}:</span>
          <strong>${stats.bloodBreakdown.moderate} (${stats.totalLogs > 0 ? Math.round((stats.bloodBreakdown.moderate / stats.totalLogs) * 100) : 0}%)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <span>${t('clinicalReport:pdf.severe')}:</span>
          <strong>${stats.bloodBreakdown.severe} (${stats.totalLogs > 0 ? Math.round((stats.bloodBreakdown.severe / stats.totalLogs) * 100) : 0}%)</strong>
        </div>

        <div style="margin-top: 6px; border-top: 1px dashed #CBD5E1; padding-top: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
            <span>🧠 ${t('clinicalReport:pdf.avgStress')}:</span>
            <strong>${stats.averageStress}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
            <span>🩸 ${t('clinicalReport:pdf.clotsIncidence')}:</span>
            <strong>${stats.clotsCount} (${stats.totalLogs > 0 ? Math.round((stats.clotsCount / stats.totalLogs) * 100) : 0}%)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
            <span>💧 ${t('clinicalReport:pdf.mucusIncidence')}:</span>
            <strong>${stats.mucusCount} (${stats.totalLogs > 0 ? Math.round((stats.mucusCount / stats.totalLogs) * 100) : 0}%)</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span>⚡ ${t('clinicalReport:pdf.urgencyIncidence')}:</span>
            <strong>${stats.urgencyCount} (${stats.totalLogs > 0 ? Math.round((stats.urgencyCount / stats.totalLogs) * 100) : 0}%)</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-title">${t('clinicalReport:pdf.tableTitle')}</div>
  <table>
    <thead>
      <tr>
        <th>${t('clinicalReport:pdf.colDate')}</th>
        <th>${t('clinicalReport:pdf.colTime')}</th>
        <th>${t('clinicalReport:pdf.colBristol')}</th>
        <th>${t('clinicalReport:pdf.colBlood')}</th>
        <th>${t('clinicalReport:pdf.colPain')}</th>
        <th>${t('clinicalReport:pdf.colExtra')}</th>
        <th>${t('clinicalReport:pdf.colNotes')}</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows.length > 0 ? tableRows : `<tr><td colspan="7" style="text-align: center; color: #94A3B8;">${t('clinicalReport:summaryCard.noData')}</td></tr>`}
    </tbody>
  </table>

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
