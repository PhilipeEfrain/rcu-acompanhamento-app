import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShieldAlert, Sparkles, AlertCircle, Activity } from 'lucide-react-native';
import { symptomRepository, MonthlyStats } from '../storage/symptomRepository';
import { DailySymptomEntry } from '../domain/health/types';
import { FloCalendar } from '../components/history/FloCalendar';
import { DayDetailCard } from '../components/history/DayDetailCard';
import { useSymptomStore } from '../store/useSymptomStore';

interface HistoryScreenProps {
  onNavigateToToday: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onNavigateToToday }) => {
  const { t } = useTranslation('history');
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [monthlyLogs, setMonthlyLogs] = useState<DailySymptomEntry[]>([]);
  const [selectedDayLogs, setSelectedDayLogs] = useState<DailySymptomEntry[]>([]);
  const [stats, setStats] = useState<MonthlyStats>({
    totalLoggedMovements: 0,
    totalDaysRecorded: 0,
    remissionDays: 0,
    mildDays: 0,
    flareDays: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadMonthData = useCallback(async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    try {
      const logs = await symptomRepository.getLogsForMonth(year, month);
      const monthStats = await symptomRepository.getMonthStats(year, month);

      setMonthlyLogs(logs);
      setStats(monthStats);

      // Filter logs for currently selected date
      const activeLogs = logs.filter((l) => l.date === selectedDate);
      setSelectedDayLogs(activeLogs);
    } catch {
      // Graceful fallback
    }
  }, [selectedDate]);

  useEffect(() => {
    loadMonthData(currentDate);
  }, [currentDate, loadMonthData]);

  // When selected date changes, filter logs for that day
  useEffect(() => {
    const activeLogs = monthlyLogs.filter((l) => l.date === selectedDate);
    setSelectedDayLogs(activeLogs);
  }, [selectedDate, monthlyLogs]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMonthData(currentDate);
    setRefreshing(false);
  };

  const handleAddNewForDay = (date: string) => {
    useSymptomStore.getState().startNewEntry(date);
    onNavigateToToday();
  };

  const handleEditEntry = (entry: DailySymptomEntry) => {
    useSymptomStore.getState().startEditEntry(entry);
    onNavigateToToday();
  };

  const handleDeleteEntry = async (id: string) => {
    await useSymptomStore.getState().deleteEntry(id);
    await loadMonthData(currentDate);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: 12,
            paddingBottom: 130, // Espaço amplo acima da BottomTabBar
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8E63B8" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('title')}</Text>
          <Text style={styles.subtitle}>{t('subtitle')}</Text>
        </View>

        {/* Monthly Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: '#E6F9F0' }]}>
            <View style={styles.summaryIconBox}>
              <Sparkles size={15} color="#276749" />
            </View>
            <Text style={[styles.summaryCount, { color: '#276749' }]}>{stats.remissionDays}</Text>
            <Text style={[styles.summaryLabel, { color: '#276749' }]}>{t('remissionDays')}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#FEF3C7' }]}>
            <View style={styles.summaryIconBox}>
              <AlertCircle size={15} color="#92400E" />
            </View>
            <Text style={[styles.summaryCount, { color: '#92400E' }]}>{stats.mildDays}</Text>
            <Text style={[styles.summaryLabel, { color: '#92400E' }]}>{t('mildDays')}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#FEE2E2' }]}>
            <View style={styles.summaryIconBox}>
              <ShieldAlert size={15} color="#991B1B" />
            </View>
            <Text style={[styles.summaryCount, { color: '#991B1B' }]}>{stats.flareDays}</Text>
            <Text style={[styles.summaryLabel, { color: '#991B1B' }]}>{t('flareDays')}</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: '#FAF5FF' }]}>
            <View style={styles.summaryIconBox}>
              <Activity size={15} color="#8E63B8" />
            </View>
            <Text style={[styles.summaryCount, { color: '#8E63B8' }]}>{stats.totalLoggedMovements}</Text>
            <Text style={[styles.summaryLabel, { color: '#8E63B8' }]}>{t('totalMovements')}</Text>
          </View>
        </View>

        {/* Flo Calendar */}
        <FloCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          logs={monthlyLogs}
          onSelectDate={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />

        {/* Legend */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>{t('legend.title')}</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#48BB78' }]} />
              <Text style={styles.legendText}>{t('legend.remission')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ED8936' }]} />
              <Text style={styles.legendText}>{t('legend.mild')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#D85A7F' }]} />
              <Text style={styles.legendText}>{t('legend.flare')}</Text>
            </View>
          </View>
        </View>

        {/* Selected Day Details with multiple bowel movement episodes */}
        <DayDetailCard
          date={selectedDate}
          logs={selectedDayLogs}
          onAddNewForDay={handleAddNewForDay}
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E202B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
  },
  summaryIconBox: {
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 12,
  },
  legendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E94A0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  legendGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
});
