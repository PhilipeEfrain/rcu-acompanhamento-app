import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp } from 'lucide-react-native';
import { DailySymptomEntry } from '../../domain/health/types';
import { getLocalDateString } from '../../domain/health/dateUtils';

interface DayAggregate {
  date: string; // YYYY-MM-DD
  dayNumber: string;
  count: number;
  hasBlood: boolean;
  hasSevereBlood: boolean;
  maxPain: number;
  severityColor: string;
}

interface SymptomTrendChartProps {
  logs: DailySymptomEntry[];
  days?: number; // default 14
  selectedDate?: string;
  onSelectDate?: (date: string) => void;
  style?: ViewStyle;
}

export const SymptomTrendChart: React.FC<SymptomTrendChartProps> = ({
  logs,
  days = 14,
  selectedDate,
  onSelectDate,
  style,
}) => {
  const { t } = useTranslation(['history', 'common']);
  const [activeTooltipDate, setActiveTooltipDate] = useState<string | null>(null);

  const dayData = useMemo<DayAggregate[]>(() => {
    const result: DayAggregate[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = getLocalDateString(d);
      const dayNum = String(d.getDate()).padStart(2, '0');

      const dayLogs = logs.filter((l) => l.date === dateStr);
      const count = dayLogs.length;

      let hasBlood = false;
      let hasSevereBlood = false;
      let maxPain = 0;

      dayLogs.forEach((l) => {
        if (l.bloodPresence !== 'none') hasBlood = true;
        if (l.bloodPresence === 'severe' || l.bloodPresence === 'moderate') hasSevereBlood = true;
        if (l.painLevel > maxPain) maxPain = l.painLevel;
      });

      let severityColor = '#CBD5E1'; // Unlogged / 0
      if (count > 0) {
        if (count >= 5 || hasSevereBlood) {
          severityColor = '#EF4444'; // Flare (Red)
        } else if (count >= 3 || hasBlood) {
          severityColor = '#F59E0B'; // Mild Alert (Amber)
        } else {
          severityColor = '#10B981'; // Remission (Green)
        }
      }

      result.push({
        date: dateStr,
        dayNumber: dayNum,
        count,
        hasBlood,
        hasSevereBlood,
        maxPain,
        severityColor,
      });
    }

    return result;
  }, [logs, days]);

  const maxCount = useMemo(() => {
    const max = Math.max(...dayData.map((d) => d.count), 0);
    return Math.max(max, 4); // Min scale of 4 for proper visualization
  }, [dayData]);

  const chartHeight = 110;
  const targetThresholdY = chartHeight - (2 / maxCount) * chartHeight;

  const activeDay = dayData.find((d) => d.date === (activeTooltipDate || selectedDate));

  return (
    <View style={[styles.card, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <TrendingUp size={18} color="#7B61FF" />
          </View>
          <View style={styles.titleTextContainer}>
            <Text style={styles.title}>{t('history:trendChart.title')}</Text>
            <Text style={styles.subtitle}>
              {t('history:trendChart.subtitle')} ({days} {t('common:days', { defaultValue: 'dias' })})
            </Text>
          </View>
        </View>

        {/* Target Badge */}
        <View style={styles.targetBadge}>
          <Text style={styles.targetBadgeText}>
            {t('history:trendChart.target')}
          </Text>
        </View>
      </View>

      {/* Interactive Tooltip Banner */}
      {activeDay && (
        <View style={styles.tooltipBanner}>
          <Text style={styles.tooltipDate}>{activeDay.date}:</Text>
          <Text
            style={[
              styles.tooltipCount,
              { color: activeDay.count > 0 ? activeDay.severityColor : '#64748B' },
            ]}
          >
            {activeDay.count}{' '}
            {activeDay.count === 1
              ? t('common:movement', { defaultValue: 'evacuação' })
              : t('common:movements', { defaultValue: 'evacuações' })}
          </Text>
          {activeDay.hasBlood && (
            <Text style={styles.tooltipBlood}>• Sangue visível</Text>
          )}
        </View>
      )}

      {/* Chart Canvas */}
      <View style={styles.chartWrapper}>
        {/* Horizontal Target Reference Line (≤ 2/day) */}
        <View
          style={[
            styles.targetLine,
            { top: targetThresholdY },
          ]}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.barsContainer}
        >
          {dayData.map((item) => {
            const isSelected = item.date === (selectedDate || activeTooltipDate);
            const barHeight =
              item.count > 0
                ? Math.max((item.count / maxCount) * chartHeight, 14)
                : 4;

            return (
              <TouchableOpacity
                key={item.date}
                activeOpacity={0.7}
                onPress={() => {
                  setActiveTooltipDate(item.date);
                  if (onSelectDate) onSelectDate(item.date);
                }}
                style={styles.barColumn}
              >
                {/* Value on top of bar */}
                {item.count > 0 && (
                  <Text style={styles.barValueText}>{item.count}</Text>
                )}

                {/* Vertical Bar */}
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: barHeight,
                        backgroundColor: item.severityColor,
                      },
                      isSelected && styles.barFillSelected,
                    ]}
                  />
                </View>

                {/* Day of Month Label */}
                <Text
                  style={[
                    styles.dayLabel,
                    isSelected && styles.dayLabelSelected,
                  ]}
                >
                  {item.dayNumber}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Legend Footer */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendLabel}>≤ 2 (Remissão)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendLabel}>3 - 4 (Alerta)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendLabel}>5+ (Crise / Sangue)</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0EFF5',
    shadowColor: '#1E202B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E202B',
  },
  subtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  targetBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 8,
  },
  targetBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#276749',
  },
  tooltipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F9FE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
  },
  tooltipDate: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E202B',
  },
  tooltipCount: {
    fontSize: 11,
    fontWeight: '700',
  },
  tooltipBlood: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  chartWrapper: {
    height: 140,
    position: 'relative',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 4,
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderWidth: 1,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    opacity: 0.6,
    zIndex: 1,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    width: 22,
  },
  barValueText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  barTrack: {
    height: 100,
    width: 14,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: 12,
    borderRadius: 6,
  },
  barFillSelected: {
    borderWidth: 2,
    borderColor: '#7B61FF',
  },
  dayLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 6,
    fontWeight: '600',
  },
  dayLabelSelected: {
    color: '#7B61FF',
    fontWeight: '800',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 12,
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
});
