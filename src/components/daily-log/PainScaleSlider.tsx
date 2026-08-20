import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react-native';

interface PainScaleSliderProps {
  painLevel: number;
  onSelectPainLevel: (level: number) => void;
}

const PAIN_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const PainScaleSlider: React.FC<PainScaleSliderProps> = ({
  painLevel,
  onSelectPainLevel,
}) => {
  const { t } = useTranslation('dailyLog');

  const getPainCategoryKey = (level: number) => {
    if (level === 0) return 'pain.none';
    if (level <= 3) return 'pain.mild';
    if (level <= 6) return 'pain.moderate';
    return 'pain.severe';
  };

  const getPainColor = (level: number) => {
    if (level === 0) return '#10B981';
    if (level <= 3) return '#84CC16';
    if (level <= 6) return '#F59E0B';
    return '#EF4444';
  };

  const activeColor = getPainColor(painLevel);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>{t('pain.title')}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: `${activeColor}18` }]}>
          <Activity size={14} color={activeColor} />
          <Text style={[styles.categoryText, { color: activeColor }]}>
            {t(getPainCategoryKey(painLevel))}
          </Text>
        </View>
      </View>

      <Text style={styles.scoreSubtitle}>
        {t('pain.score_label', { score: painLevel })}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsContainer}
      >
        {PAIN_LEVELS.map((level) => {
          const isSelected = painLevel === level;
          const levelColor = getPainColor(level);

          return (
            <TouchableOpacity
              key={level}
              activeOpacity={0.7}
              onPress={() => onSelectPainLevel(level)}
              style={[
                styles.pill,
                {
                  backgroundColor: isSelected ? levelColor : '#FFFFFF',
                  borderColor: isSelected ? levelColor : '#E2E8F0',
                },
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color: isSelected ? '#FFFFFF' : '#475569',
                    fontWeight: isSelected ? '700' : '600',
                  },
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  pillsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    width: 44,
    height: 48,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 15,
  },
});
