import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Thermometer, Zap, BatteryLow, HeartPulse } from 'lucide-react-native';

interface SystemicSymptomsSelectorProps {
  hasFever: boolean;
  hasDizziness: boolean;
  hasExtremeFatigue: boolean;
  hasTachycardia: boolean;
  onToggleFever: () => void;
  onToggleDizziness: () => void;
  onToggleExtremeFatigue: () => void;
  onToggleTachycardia: () => void;
}

interface SymptomChip {
  id: string;
  labelKey: string;
  isActive: boolean;
  onToggle: () => void;
  icon: React.FC<{ size: number; color: string }>;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
}

export const SystemicSymptomsSelector: React.FC<SystemicSymptomsSelectorProps> = ({
  hasFever,
  hasDizziness,
  hasExtremeFatigue,
  hasTachycardia,
  onToggleFever,
  onToggleDizziness,
  onToggleExtremeFatigue,
  onToggleTachycardia,
}) => {
  const { t } = useTranslation(['dailyLog']);

  const chips: SymptomChip[] = [
    {
      id: 'fever',
      labelKey: 'dailyLog:systemicSymptoms.fever',
      isActive: hasFever,
      onToggle: onToggleFever,
      icon: Thermometer,
      activeColor: '#DC2626',
      activeBg: '#FEF2F2',
      activeBorder: '#FCA5A5',
    },
    {
      id: 'dizziness',
      labelKey: 'dailyLog:systemicSymptoms.dizziness',
      isActive: hasDizziness,
      onToggle: onToggleDizziness,
      icon: Zap,
      activeColor: '#D97706',
      activeBg: '#FFFBEB',
      activeBorder: '#FCD34D',
    },
    {
      id: 'extremeFatigue',
      labelKey: 'dailyLog:systemicSymptoms.extremeFatigue',
      isActive: hasExtremeFatigue,
      onToggle: onToggleExtremeFatigue,
      icon: BatteryLow,
      activeColor: '#7C3AED',
      activeBg: '#F5F3FF',
      activeBorder: '#C4B5FD',
    },
    {
      id: 'tachycardia',
      labelKey: 'dailyLog:systemicSymptoms.tachycardia',
      isActive: hasTachycardia,
      onToggle: onToggleTachycardia,
      icon: HeartPulse,
      activeColor: '#E11D48',
      activeBg: '#FFF1F2',
      activeBorder: '#FDA4AF',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{t('dailyLog:systemicSymptoms.title')}</Text>
        <Text style={styles.sectionSubtitle}>{t('dailyLog:systemicSymptoms.subtitle')}</Text>
      </View>

      <View style={styles.grid}>
        {chips.map((chip) => {
          const IconComponent = chip.icon;
          const iconColor = chip.isActive ? chip.activeColor : '#64748B';

          return (
            <TouchableOpacity
              key={chip.id}
              style={[
                styles.chipButton,
                chip.isActive && {
                  backgroundColor: chip.activeBg,
                  borderColor: chip.activeBorder,
                  borderWidth: 1.5,
                },
              ]}
              onPress={chip.onToggle}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: chip.isActive }}
            >
              <View
                style={[
                  styles.iconCircle,
                  chip.isActive && { backgroundColor: '#FFFFFF' },
                ]}
              >
                <IconComponent size={18} color={iconColor} />
              </View>
              <Text
                style={[
                  styles.chipText,
                  chip.isActive && {
                    color: chip.activeColor,
                    fontWeight: '700',
                  },
                ]}
                numberOfLines={2}
              >
                {t(chip.labelKey)}
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
  headerRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipButton: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 52,
    gap: 8,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    lineHeight: 15,
  },
});
