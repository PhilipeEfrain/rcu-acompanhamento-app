import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, Brain, ShieldAlert, Sparkles, Zap } from 'lucide-react-native';
import { MucusPresence, UrgencyLevel } from '../../domain/health/types';

interface ClinicalExtrasAccordionProps {
  stressLevel: number | null;
  hasClots: boolean;
  mucusPresence: MucusPresence;
  urgencyLevel: UrgencyLevel;
  onSelectStressLevel: (level: number | null) => void;
  onSelectHasClots: (hasClots: boolean) => void;
  onSelectMucusPresence: (mucus: MucusPresence) => void;
  onSelectUrgencyLevel: (urgency: UrgencyLevel) => void;
}

export const ClinicalExtrasAccordion: React.FC<ClinicalExtrasAccordionProps> = ({
  stressLevel,
  hasClots,
  mucusPresence,
  urgencyLevel,
  onSelectStressLevel,
  onSelectHasClots,
  onSelectMucusPresence,
  onSelectUrgencyLevel,
}) => {
  const { t } = useTranslation('clinicalExtras');
  const [isOpen, setIsOpen] = useState(false);

  const hasAnyValueSelected =
    stressLevel !== null || hasClots || mucusPresence !== 'none' || urgencyLevel !== 'normal';

  const stressLevels = [
    { label: t('stress.calm'), value: 1 },
    { label: t('stress.moderate'), value: 5 },
    { label: t('stress.high'), value: 8 },
  ];

  const mucusOptions: { key: MucusPresence; label: string }[] = [
    { key: 'none', label: t('mucus.none') },
    { key: 'mild', label: t('mucus.mild') },
    { key: 'abundant', label: t('mucus.abundant') },
  ];

  const urgencyOptions: { key: UrgencyLevel; label: string }[] = [
    { key: 'normal', label: t('urgency.normal') },
    { key: 'moderate', label: t('urgency.moderate') },
    { key: 'severe', label: t('urgency.severe') },
  ];

  return (
    <View style={styles.container}>
      {/* Accordion Toggle Header */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Sparkles size={16} color="#8E63B8" />
          </View>
          <View>
            <Text style={styles.headerTitle}>{t('sectionTitle')}</Text>
            <Text style={styles.headerSubtitle}>{t('sectionSubtitle')}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          {hasAnyValueSelected && <View style={styles.activeDot} />}
          {isOpen ? (
            <ChevronUp size={18} color="#8E63B8" />
          ) : (
            <ChevronDown size={18} color="#8E63B8" />
          )}
        </View>
      </TouchableOpacity>

      {/* Summary Preview Pills when collapsed */}
      {!isOpen && hasAnyValueSelected && (
        <View style={styles.collapsedPreviewRow}>
          {stressLevel !== null && (
            <View style={styles.previewPill}>
              <Brain size={11} color="#8E63B8" />
              <Text style={styles.previewPillText}>
                {t('stress.scoreLabel', { score: stressLevel })}
              </Text>
            </View>
          )}

          {hasClots && (
            <View style={[styles.previewPill, { backgroundColor: '#FFF5F5' }]}>
              <ShieldAlert size={11} color="#E53E3E" />
              <Text style={[styles.previewPillText, { color: '#E53E3E' }]}>
                {t('clots.yes')}
              </Text>
            </View>
          )}

          {mucusPresence !== 'none' && (
            <View style={[styles.previewPill, { backgroundColor: '#E6F9F0' }]}>
              <Sparkles size={11} color="#276749" />
              <Text style={[styles.previewPillText, { color: '#276749' }]}>
                {t(`mucus.${mucusPresence}`)}
              </Text>
            </View>
          )}

          {urgencyLevel !== 'normal' && (
            <View style={[styles.previewPill, { backgroundColor: '#FEF3C7' }]}>
              <Zap size={11} color="#92400E" />
              <Text style={[styles.previewPillText, { color: '#92400E' }]}>
                {t(`urgency.${urgencyLevel}`)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Accordion Body */}
      {isOpen && (
        <View style={styles.body}>
          {/* 1. Nível de Estresse / Ansiedade */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <Brain size={15} color="#8E63B8" />
              <Text style={styles.fieldTitle}>{t('stress.title')}</Text>
            </View>
            <View style={styles.chipsRow}>
              {stressLevels.map((item) => {
                const isSelected =
                  stressLevel !== null &&
                  ((item.value === 1 && stressLevel <= 3) ||
                    (item.value === 5 && stressLevel >= 4 && stressLevel <= 6) ||
                    (item.value === 8 && stressLevel >= 7));

                return (
                  <TouchableOpacity
                    key={`stress-${item.value}`}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => onSelectStressLevel(isSelected ? null : item.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 2. Presença de Coágulos */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <ShieldAlert size={15} color="#D85A7F" />
              <Text style={styles.fieldTitle}>{t('clots.title')}</Text>
            </View>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[styles.chip, !hasClots && styles.chipSelected]}
                onPress={() => onSelectHasClots(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, !hasClots && styles.chipTextSelected]}>
                  {t('clots.no')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.chip, hasClots && styles.chipAlertSelected]}
                onPress={() => onSelectHasClots(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, hasClots && styles.chipTextAlertSelected]}>
                  {t('clots.yes')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Eliminação de Muco ou Pus */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <Sparkles size={15} color="#48BB78" />
              <Text style={styles.fieldTitle}>{t('mucus.title')}</Text>
            </View>
            <View style={styles.chipsRow}>
              {mucusOptions.map((opt) => {
                const isSelected = mucusPresence === opt.key;
                return (
                  <TouchableOpacity
                    key={`mucus-${opt.key}`}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => onSelectMucusPresence(opt.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 4. Urgência Evacuatória (Tenesmo) */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldHeader}>
              <Zap size={15} color="#D97706" />
              <Text style={styles.fieldTitle}>{t('urgency.title')}</Text>
            </View>
            <View style={styles.chipsRow}>
              {urgencyOptions.map((opt) => {
                const isSelected = urgencyLevel === opt.key;
                return (
                  <TouchableOpacity
                    key={`urgency-${opt.key}`}
                    style={[
                      styles.chip,
                      isSelected && (opt.key === 'severe' ? styles.chipAlertSelected : styles.chipSelected),
                    ]}
                    onPress={() => onSelectUrgencyLevel(opt.key)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && (opt.key === 'severe' ? styles.chipTextAlertSelected : styles.chipTextSelected),
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EFF5',
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3142',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E94A0',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8E63B8',
  },
  body: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#F0EFF5',
    gap: 16,
  },
  fieldSection: {
    gap: 8,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FAF9FC',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  chipSelected: {
    backgroundColor: '#F3EEFB',
    borderColor: '#8E63B8',
  },
  chipAlertSelected: {
    backgroundColor: '#FFF5F5',
    borderColor: '#E53E3E',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  chipTextSelected: {
    color: '#8E63B8',
    fontWeight: '700',
  },
  chipTextAlertSelected: {
    color: '#E53E3E',
    fontWeight: '700',
  },
  collapsedPreviewRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 20,
    marginTop: 6,
  },
  previewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3EEFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  previewPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E63B8',
  },
});
