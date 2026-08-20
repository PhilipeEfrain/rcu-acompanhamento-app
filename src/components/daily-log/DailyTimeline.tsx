import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Sparkles, AlertCircle, ShieldAlert, HeartHandshake } from 'lucide-react-native';
import { DailyAggregatedSummary, DailySymptomEntry } from '../../domain/health/types';
import { BowelMovementCard } from './BowelMovementCard';

interface DailyTimelineProps {
  date: string;
  logs: DailySymptomEntry[];
  summary: DailyAggregatedSummary | null;
  onAddNew: () => void;
  onEdit: (entry: DailySymptomEntry) => void;
  onDelete: (id: string) => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  logs,
  summary,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation(['dailyLog', 'common']);

  const totalCount = logs.length;

  let summaryBg = '#E6F9F0';
  let summaryTextColor = '#276749';
  let summaryIcon = Sparkles;
  let statusKey = 'status.remission';

  if (summary?.overallSeverity === 'severe_emergency') {
    summaryBg = '#FEE2E2';
    summaryTextColor = '#B91C1C';
    summaryIcon = ShieldAlert;
    statusKey = 'status.severe_emergency';
  } else if (summary?.overallSeverity === 'moderate_to_severe_flare') {
    summaryBg = '#FFF1F2';
    summaryTextColor = '#BE123C';
    summaryIcon = ShieldAlert;
    statusKey = 'status.moderate_to_severe_flare';
  } else if (summary?.overallSeverity === 'mild_activity') {
    summaryBg = '#FEF3C7';
    summaryTextColor = '#92400E';
    summaryIcon = AlertCircle;
    statusKey = 'status.mild_activity';
  }

  const SummaryIconComponent = summaryIcon;

  return (
    <View style={styles.container}>
      {/* Daily Summary Banner (when entries exist) */}
      {totalCount > 0 && (
        <View style={[styles.summaryBanner, { backgroundColor: summaryBg }]}>
          <View style={styles.summaryLeft}>
            <SummaryIconComponent size={20} color={summaryTextColor} />
            <View>
              <Text style={[styles.summaryTitle, { color: summaryTextColor }]}>
                {t('dailyLog:dailySummaryTitle', { count: totalCount })}
              </Text>
              <Text style={[styles.summaryStatusText, { color: summaryTextColor }]}>
                {t(statusKey, { ns: 'common' })}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Primary Action Button: Add New Bowel Movement */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddNew}
        activeOpacity={0.85}
        accessibilityRole="button"
      >
        <PlusCircle size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>{t('dailyLog:addNewMovement')}</Text>
      </TouchableOpacity>

      {/* Timeline Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('dailyLog:todayTimeline')}</Text>
        <Text style={styles.countBadge}>{totalCount}</Text>
      </View>

      {/* List of episodes */}
      {totalCount === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <HeartHandshake size={32} color="#8E63B8" />
          </View>
          <Text style={styles.emptyText}>{t('dailyLog:emptyTimeline')}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {logs.map((entry, index) => (
            <BowelMovementCard
              key={entry.id || `bm-${index}`}
              entry={entry}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  summaryStatusText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
    marginTop: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8E63B8',
    height: 52,
    borderRadius: 20,
    gap: 10,
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3142',
  },
  countBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E63B8',
    backgroundColor: '#F3EEFB',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  list: {
    gap: 2,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0EFF5',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FAF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E94A0',
    textAlign: 'center',
    lineHeight: 20,
  },
});
