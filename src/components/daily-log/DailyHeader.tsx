import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, Sparkles } from 'lucide-react-native';

interface DailyHeaderProps {
  dateString: string;
}

export const DailyHeader: React.FC<DailyHeaderProps> = ({ dateString }) => {
  const { t } = useTranslation(['dailyLog', 'common']);

  const getGreetingKey = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'common:greetingMorning';
    if (hour < 18) return 'common:greetingAfternoon';
    return 'common:greetingEvening';
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.dateBadge}>
          <Calendar size={14} color="#7B61FF" />
          <Text style={styles.dateText}>{dateString}</Text>
        </View>
        <View style={styles.iconCircle}>
          <Sparkles size={16} color="#7B61FF" />
        </View>
      </View>

      <Text style={styles.greeting}>{t(getGreetingKey())}</Text>
      <Text style={styles.subtitle}>{t('dailyLog:subtitle')}</Text>
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
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EDFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7B61FF',
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
    fontSize: 26,
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
