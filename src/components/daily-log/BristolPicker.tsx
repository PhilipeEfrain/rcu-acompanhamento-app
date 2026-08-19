import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BristolType } from '../../domain/health/types';
import { CheckCircle2 } from 'lucide-react-native';

interface BristolPickerProps {
  selectedType: BristolType;
  onSelectType: (type: BristolType) => void;
}

const BRISTOL_TYPES: BristolType[] = [
  'type_1',
  'type_2',
  'type_3',
  'type_4',
  'type_5',
  'type_6',
  'type_7',
];

export const BristolPicker: React.FC<BristolPickerProps> = ({
  selectedType,
  onSelectType,
}) => {
  const { t } = useTranslation('dailyLog');

  const getCardStatusColor = (type: BristolType, isSelected: boolean) => {
    if (!isSelected) return '#F8F9FE';
    if (type === 'type_3' || type === 'type_4') return '#F0FDF4'; // Green tint
    if (type === 'type_5' || type === 'type_2') return '#FFFBEB'; // Yellow tint
    return '#FFF1F2'; // Coral/Red tint for type 1, 6, 7
  };

  const getBorderColor = (type: BristolType, isSelected: boolean) => {
    if (!isSelected) return '#E2E8F0';
    if (type === 'type_3' || type === 'type_4') return '#10B981';
    if (type === 'type_5' || type === 'type_2') return '#F59E0B';
    return '#FF6B81';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('bristol.title')}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {BRISTOL_TYPES.map((type, index) => {
          const isSelected = selectedType === type;
          const typeNumber = index + 1;
          const isIdeal = type === 'type_4';

          return (
            <TouchableOpacity
              key={type}
              activeOpacity={0.7}
              onPress={() => onSelectType(type)}
              style={[
                styles.card,
                {
                  backgroundColor: getCardStatusColor(type, isSelected),
                  borderColor: getBorderColor(type, isSelected),
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.numberBadge, isSelected && styles.numberBadgeActive]}>
                  <Text style={[styles.numberText, isSelected && styles.numberTextActive]}>
                    #{typeNumber}
                  </Text>
                </View>
                {isSelected && (
                  <CheckCircle2 size={18} color={getBorderColor(type, true)} />
                )}
              </View>

              <Text style={styles.cardLabel} numberOfLines={2}>
                {t(`bristol.${type}.label`)}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {t(`bristol.${type}.desc`)}
              </Text>

              {isIdeal && (
                <View style={styles.idealTag}>
                  <Text style={styles.idealText}>★ Ideal</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 170,
    padding: 16,
    borderRadius: 22,
    justifyContent: 'space-between',
    minHeight: 150,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  numberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#EDF2F7',
  },
  numberBadgeActive: {
    backgroundColor: '#7B61FF',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  numberTextActive: {
    color: '#FFFFFF',
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 18,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 15,
  },
  idealTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 8,
  },
  idealText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
});
