import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PlusCircle, CalendarOff } from 'lucide-react-native';
import { DailySymptomEntry } from '../../domain/health/types';
import { evaluateDailySummary } from '../../domain/health/evaluateCrisis';
import { isFutureDate } from '../../domain/health/dateUtils';
import { BowelMovementCard } from '../daily-log/BowelMovementCard';

interface DayDetailCardProps {
  date: string;
  logs: DailySymptomEntry[];
  onAddNewForDay: (date: string) => void;
  onEditEntry: (entry: DailySymptomEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const DayDetailCard: React.FC<DayDetailCardProps> = ({
  date,
  logs,
  onAddNewForDay,
  onEditEntry,
  onDeleteEntry,
}) => {
  const { t } = useTranslation(['history', 'dailyLog', 'common']);

  const summary = evaluateDailySummary(date, logs);
  const totalCount = logs.length;
  const isFuture = isFutureDate(date);

  if (isFuture) {
    return (
      <View style={styles.futureNoticeCard}>
        <CalendarOff size={24} color="#94A3B8" />
        <Text style={styles.dateHeader}>
          {t('selectedDayTitle', { ns: 'history', date })}
        </Text>
        <Text style={styles.futureNoticeText}>
          {t('futureDateNotice', { ns: 'history' })}
        </Text>
      </View>
    );
  }

  if (totalCount === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.dateHeader}>
          {t('selectedDayTitle', { ns: 'history', date })}
        </Text>
        <Text style={styles.emptyText}>{t('noLogSelectedDay', { ns: 'history' })}</Text>

        <TouchableOpacity
          style={styles.quickAddButton}
          onPress={() => onAddNewForDay(date)}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          <PlusCircle size={18} color="#8E63B8" />
          <Text style={styles.quickAddText}>{t('addPastLog', { ns: 'history' })}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine daily overall status color
  let statusBadgeBg = '#E6F9F0';
  let statusTextColor = '#276749';
  let statusLabelKey = 'status.remission';

  if (summary.overallSeverity === 'mild_activity') {
    statusBadgeBg = '#FEF3C7';
    statusTextColor = '#92400E';
    statusLabelKey = 'status.mild_activity';
  } else if (summary.overallSeverity === 'moderate_to_severe_flare') {
    statusBadgeBg = '#FEE2E2';
    statusTextColor = '#991B1B';
    statusLabelKey = 'status.moderate_to_severe_flare';
  }

  return (
    <View style={styles.container}>
      {/* Day Overview Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerLeft}>
          <Text style={styles.dateHeader}>
            {t('selectedDayTitle', { ns: 'history', date })}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: statusBadgeBg }]}>
              <Text style={[styles.statusText, { color: statusTextColor }]}>
                {t(statusLabelKey, { ns: 'common' })}
              </Text>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {t('movementsCount', { ns: 'history', count: totalCount })}
              </Text>
            </View>
          </View>
        </View>

        {!isFuture && (
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={() => onAddNewForDay(date)}
            activeOpacity={0.8}
            accessibilityRole="button"
          >
            <PlusCircle size={16} color="#8E63B8" />
            <Text style={styles.addMoreText}>{t('addNewMovementForDay', { ns: 'history' })}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List of episodes for this day */}
      <View style={styles.episodesList}>
        {logs.map((entry, index) => (
          <BowelMovementCard
            key={entry.id || `hist-bm-${index}`}
            entry={entry}
            index={index}
            onEdit={onEditEntry}
            onDelete={onDeleteEntry}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0EFF5',
  },
  headerLeft: {
    marginBottom: 12,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3142',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E63B8',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5FF',
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  addMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E63B8',
  },
  episodesList: {
    gap: 4,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E94A0',
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  futureNoticeCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    gap: 8,
  },
  futureNoticeText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  quickAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  quickAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E63B8',
  },
});
