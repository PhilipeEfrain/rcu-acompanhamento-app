import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { DailySymptomEntry } from '../../domain/health/types';
import { evaluateDailySummary } from '../../domain/health/evaluateCrisis';
import { getLocalDateString, isFutureDate } from '../../domain/health/dateUtils';

interface FloCalendarProps {
  currentDate: Date;
  selectedDate: string; // YYYY-MM-DD
  logs: DailySymptomEntry[];
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export const FloCalendar: React.FC<FloCalendarProps> = ({
  currentDate,
  selectedDate,
  logs,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const { t } = useTranslation('history');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    t('months.jan'),
    t('months.feb'),
    t('months.mar'),
    t('months.apr'),
    t('months.may'),
    t('months.jun'),
    t('months.jul'),
    t('months.aug'),
    t('months.sep'),
    t('months.oct'),
    t('months.nov'),
    t('months.dec'),
  ];

  const weekDayKeys = [
    t('weekDays.sun'),
    t('weekDays.mon'),
    t('weekDays.tue'),
    t('weekDays.wed'),
    t('weekDays.thu'),
    t('weekDays.fri'),
    t('weekDays.sat'),
  ];

  // Calculate days in month & starting weekday
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group logs by date and evaluate daily severity
  const dateSummaries = React.useMemo(() => {
    const grouped = new Map<string, DailySymptomEntry[]>();
    for (const log of logs) {
      const list = grouped.get(log.date) || [];
      list.push(log);
      grouped.set(log.date, list);
    }

    const summaries = new Map<string, { count: number; severity: string }>();
    grouped.forEach((entries, date) => {
      const summary = evaluateDailySummary(date, entries);
      summaries.set(date, {
        count: summary.totalMovements,
        severity: summary.overallSeverity,
      });
    });

    return summaries;
  }, [logs]);

  // Generate grid cells
  const gridCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    gridCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push(d);
  }

  const todayStr = getLocalDateString();

  return (
    <View style={styles.container}>
      {/* Month Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onPrevMonth}
          style={styles.navButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Mês anterior"
        >
          <ChevronLeft size={20} color="#8E63B8" />
        </TouchableOpacity>

        <Text style={styles.monthTitle}>
          {monthNames[month]} {year}
        </Text>

        <TouchableOpacity
          onPress={onNextMonth}
          style={styles.navButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Próximo mês"
        >
          <ChevronRight size={20} color="#8E63B8" />
        </TouchableOpacity>
      </View>

      {/* Weekdays Row */}
      <View style={styles.weekdaysRow}>
        {weekDayKeys.map((day, idx) => (
          <Text key={idx} style={styles.weekdayLabel}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.grid}>
        {gridCells.map((dayNum, idx) => {
          if (dayNum === null) {
            return <View key={`empty-${idx}`} style={styles.dayCell} />;
          }

          const dayFormatted = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
          const monthFormatted = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
          const dateString = `${year}-${monthFormatted}-${dayFormatted}`;

          const isSelected = selectedDate === dateString;
          const isToday = todayStr === dateString;
          const isFuture = isFutureDate(dateString);
          const daySummary = dateSummaries.get(dateString);

          let badgeColor: string | null = null;
          if (daySummary) {
            if (daySummary.severity === 'severe_emergency') badgeColor = '#DC2626'; // Deep Red emergency
            else if (daySummary.severity === 'moderate_to_severe_flare') badgeColor = '#D85A7F'; // Berry red
            else if (daySummary.severity === 'mild_activity') badgeColor = '#ED8936'; // Warm amber
            else if (daySummary.severity === 'remission') badgeColor = '#48BB78'; // Soft mint green
          }

          return (
            <TouchableOpacity
              key={`day-${dateString}`}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDayCell,
                isToday && !isSelected && styles.todayDayCell,
                isFuture && styles.futureDayCell,
              ]}
              onPress={() => !isFuture && onSelectDate(dateString)}
              disabled={isFuture}
              activeOpacity={isFuture ? 1 : 0.7}
              accessibilityRole="button"
              accessibilityState={{ disabled: isFuture, selected: isSelected }}
              accessibilityLabel={
                isFuture
                  ? `${dayNum}, ${t('history:futureDayDisabled')}`
                  : `${dayNum}`
              }
            >
              <Text
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isToday && !isSelected && styles.todayDayText,
                  isFuture && styles.futureDayText,
                ]}
              >
                {dayNum}
              </Text>

              {badgeColor && (
                <View style={[styles.statusDot, { backgroundColor: badgeColor }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2D3142',
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5EEFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF5',
    paddingBottom: 8,
  },
  weekdayLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E94A0',
    textAlign: 'center',
    width: 38,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 42,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginVertical: 2,
  },
  selectedDayCell: {
    backgroundColor: '#8E63B8',
  },
  todayDayCell: {
    borderWidth: 1.5,
    borderColor: '#8E63B8',
    backgroundColor: '#FAF5FF',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2D3142',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  todayDayText: {
    color: '#8E63B8',
    fontWeight: '700',
  },
  futureDayCell: {
    opacity: 0.35,
  },
  futureDayText: {
    color: '#94A3B8',
    fontWeight: '400',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
});
