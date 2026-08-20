import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Sun, Sunrise, Moon } from 'lucide-react-native';
import { TimePeriod } from '../../domain/health/types';

interface PeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onSelectPeriod: (period: TimePeriod) => void;
}

interface PeriodOption {
  id: TimePeriod;
  labelKey: string;
  icon: React.FC<{ size: number; color: string }>;
  activeColor: string;
  activeBg: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  {
    id: 'waking_morning',
    labelKey: 'dailyLog:period.waking_morning',
    icon: Sunrise,
    activeColor: '#7C3AED',
    activeBg: '#F5F3FF',
  },
  {
    id: 'afternoon',
    labelKey: 'dailyLog:period.afternoon',
    icon: Sun,
    activeColor: '#D97706',
    activeBg: '#FFFBEB',
  },
  {
    id: 'night',
    labelKey: 'dailyLog:period.night',
    icon: Moon,
    activeColor: '#2563EB',
    activeBg: '#EFF6FF',
  },
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onSelectPeriod,
}) => {
  const { t } = useTranslation(['dailyLog']);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('dailyLog:period.title')}</Text>
      <View style={styles.pillRow}>
        {PERIOD_OPTIONS.map((option) => {
          const isSelected = selectedPeriod === option.id;
          const IconComponent = option.icon;
          const iconColor = isSelected ? option.activeColor : '#64748B';

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.pillButton,
                isSelected && {
                  backgroundColor: option.activeBg,
                  borderColor: option.activeColor,
                },
              ]}
              onPress={() => onSelectPeriod(option.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <IconComponent size={18} color={iconColor} />
              <Text
                style={[
                  styles.pillText,
                  isSelected && {
                    color: option.activeColor,
                    fontWeight: '700',
                  },
                ]}
                numberOfLines={1}
              >
                {t(option.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 50,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
