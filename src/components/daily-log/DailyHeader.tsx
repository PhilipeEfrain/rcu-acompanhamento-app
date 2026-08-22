import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, RotateCcw, ArrowLeft, Sparkles } from 'lucide-react-native';
import { getLocalDateString } from '../../domain/health/dateUtils';

interface DailyHeaderProps {
  dateString: string;
  isFormOpen?: boolean;
  isExistingLog?: boolean;
  timeString?: string;
  onResetToToday?: () => void;
  onCancelForm?: () => void;
}

export const DailyHeader: React.FC<DailyHeaderProps> = ({
  dateString,
  isFormOpen,
  isExistingLog,
  timeString,
  onResetToToday,
  onCancelForm,
}) => {
  const { t } = useTranslation(['dailyLog', 'common']);

  const todayString = getLocalDateString();
  const isToday = dateString === todayString;

  const getGreetingKey = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'common:greetingMorning';
    if (hour < 18) return 'common:greetingAfternoon';
    return 'common:greetingEvening';
  };

  let title = t(getGreetingKey());
  let subtitle = t('dailyLog:subtitle');

  if (isFormOpen) {
    if (isExistingLog) {
      title = t('dailyLog:editingBadge', { date: dateString, time: timeString || '' });
      subtitle = t('dailyLog:newEntrySubtitle');
    } else {
      title = isToday ? t('dailyLog:newEntry') : t('dailyLog:actions.editingDate', { date: dateString });
      subtitle = t('dailyLog:newEntrySubtitle');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftPillRow}>
          {isFormOpen && onCancelForm && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onCancelForm}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t('common:back')}
            >
              <ArrowLeft size={16} color="#8E63B8" />
            </TouchableOpacity>
          )}

          <View style={[styles.dateBadge, !isToday && styles.dateBadgePast]}>
            <Calendar size={14} color={isToday ? '#7B61FF' : '#8E63B8'} />
            <Text style={[styles.dateText, !isToday && styles.dateTextPast]}>
              {dateString} {isToday ? `(${t('common:today')})` : ''}
            </Text>
          </View>
        </View>

        {!isToday && onResetToToday ? (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={onResetToToday}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <RotateCcw size={13} color="#8E63B8" />
            <Text style={styles.resetButtonText}>{t('dailyLog:backToToday')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.iconCircle}>
            <Sparkles size={16} color="#7B61FF" />
          </View>
        )}
      </View>

      <Text style={styles.greeting}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  dateBadgePast: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7B61FF',
  },
  dateTextPast: {
    color: '#8E63B8',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E63B8',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
});
