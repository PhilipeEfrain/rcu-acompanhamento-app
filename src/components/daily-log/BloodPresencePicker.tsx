import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BloodPresence } from '../../domain/health/types';
import { Droplet, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react-native';

interface BloodPresencePickerProps {
  selectedPresence: BloodPresence;
  onSelectPresence: (presence: BloodPresence) => void;
}

const BLOOD_OPTIONS: BloodPresence[] = ['none', 'traces', 'moderate', 'severe'];

export const BloodPresencePicker: React.FC<BloodPresencePickerProps> = ({
  selectedPresence,
  onSelectPresence,
}) => {
  const { t } = useTranslation('dailyLog');

  const getOptionIcon = (option: BloodPresence, isSelected: boolean) => {
    const size = 18;
    switch (option) {
      case 'none':
        return <ShieldCheck size={size} color={isSelected ? '#10B981' : '#64748B'} />;
      case 'traces':
        return <Droplet size={size} color={isSelected ? '#F59E0B' : '#64748B'} />;
      case 'moderate':
        return <AlertCircle size={size} color={isSelected ? '#F97316' : '#64748B'} />;
      case 'severe':
        return <AlertTriangle size={size} color={isSelected ? '#EF4444' : '#64748B'} />;
    }
  };

  const getOptionStyle = (option: BloodPresence, isSelected: boolean) => {
    if (!isSelected) {
      return {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        textColor: '#334155',
      };
    }

    switch (option) {
      case 'none':
        return {
          backgroundColor: '#ECFDF5',
          borderColor: '#10B981',
          textColor: '#065F46',
        };
      case 'traces':
        return {
          backgroundColor: '#FFFBEB',
          borderColor: '#F59E0B',
          textColor: '#92400E',
        };
      case 'moderate':
        return {
          backgroundColor: '#FFF7ED',
          borderColor: '#F97316',
          textColor: '#9A3412',
        };
      case 'severe':
        return {
          backgroundColor: '#FEF2F2',
          borderColor: '#EF4444',
          textColor: '#991B1B',
        };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('blood.title')}</Text>

      <View style={styles.grid}>
        {BLOOD_OPTIONS.map((option) => {
          const isSelected = selectedPresence === option;
          const styleConfig = getOptionStyle(option, isSelected);

          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.7}
              onPress={() => onSelectPresence(option)}
              style={[
                styles.chip,
                {
                  backgroundColor: styleConfig.backgroundColor,
                  borderColor: styleConfig.borderColor,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <View style={styles.iconContainer}>{getOptionIcon(option, isSelected)}</View>
              <Text
                style={[
                  styles.chipText,
                  {
                    color: styleConfig.textColor,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {t(`blood.${option}`)}
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
    marginVertical: 12,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 13,
    flexShrink: 1,
  },
});
