import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Layers, Droplets, Wind } from 'lucide-react-native';
import { OutputType } from '../../domain/health/types';

interface OutputTypeSelectorProps {
  selectedType: OutputType;
  onSelectType: (type: OutputType) => void;
}

interface OutputOption {
  id: OutputType;
  titleKey: string;
  subtitleKey: string;
  icon: React.FC<{ size: number; color: string }>;
  activeColor: string;
  activeBg: string;
  badgeBg: string;
}

const OUTPUT_OPTIONS: OutputOption[] = [
  {
    id: 'feces',
    titleKey: 'dailyLog:outputType.feces',
    subtitleKey: 'dailyLog:outputType.fecesSubtitle',
    icon: Layers,
    activeColor: '#7C3AED',
    activeBg: '#F5F3FF',
    badgeBg: '#EDE9FE',
  },
  {
    id: 'blood_mucus_only',
    titleKey: 'dailyLog:outputType.blood_mucus_only',
    subtitleKey: 'dailyLog:outputType.blood_mucus_onlySubtitle',
    icon: Droplets,
    activeColor: '#E11D48',
    activeBg: '#FFF1F2',
    badgeBg: '#FFE4E6',
  },
  {
    id: 'gas_bloody_false_alarm',
    titleKey: 'dailyLog:outputType.gas_bloody_false_alarm',
    subtitleKey: 'dailyLog:outputType.gas_bloody_false_alarmSubtitle',
    icon: Wind,
    activeColor: '#D97706',
    activeBg: '#FFFBEB',
    badgeBg: '#FEF3C7',
  },
];

export const OutputTypeSelector: React.FC<OutputTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  const { t } = useTranslation(['dailyLog']);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('dailyLog:outputType.title')}</Text>
      <View style={styles.cardsContainer}>
        {OUTPUT_OPTIONS.map((option) => {
          const isSelected = selectedType === option.id;
          const IconComponent = option.icon;
          const iconColor = isSelected ? option.activeColor : '#64748B';

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.card,
                isSelected && {
                  backgroundColor: option.activeBg,
                  borderColor: option.activeColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => onSelectType(option.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isSelected ? option.badgeBg : '#F1F5F9' },
                ]}
              >
                <IconComponent size={20} color={iconColor} />
              </View>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.cardTitle,
                    isSelected && { color: option.activeColor, fontWeight: '700' },
                  ]}
                >
                  {t(option.titleKey)}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {t(option.subtitleKey)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  cardsContainer: {
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 58,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 15,
  },
});
