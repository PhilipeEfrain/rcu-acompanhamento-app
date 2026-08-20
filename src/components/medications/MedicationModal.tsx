import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Clock, Pill, Sparkles, X } from 'lucide-react-native';
import { Medication, MedicationFrequency } from '../../domain/medications/types';
import { getDefaultTimesForFrequency } from '../../storage/medicationRepository';

interface MedicationModalProps {
  visible: boolean;
  medication: Medication | null;
  onSave: (data: {
    id?: string;
    name: string;
    dosage: string;
    frequency: MedicationFrequency;
    times: string[];
    time?: string;
    instructions?: string;
  }) => Promise<void>;
  onClose: () => void;
}

const COMMON_SUGGESTIONS = [
  {
    name: 'Mesalazina',
    dosage: '1200mg',
    frequency: 'daily' as MedicationFrequency,
    times: ['08:00'],
  },
  {
    name: 'Mesalazina',
    dosage: '800mg',
    frequency: 'three_times_daily' as MedicationFrequency,
    times: ['08:00', '14:00', '20:00'],
  },
  {
    name: 'Azatioprina',
    dosage: '50mg',
    frequency: 'daily' as MedicationFrequency,
    times: ['08:00'],
  },
  {
    name: 'Infliximabe',
    dosage: '5mg/kg',
    frequency: 'every_eight_weeks' as MedicationFrequency,
    times: ['08:00'],
  },
  {
    name: 'Vedolizumabe',
    dosage: '300mg',
    frequency: 'every_eight_weeks' as MedicationFrequency,
    times: ['08:00'],
  },
  {
    name: 'Prednisona',
    dosage: '20mg',
    frequency: 'daily' as MedicationFrequency,
    times: ['08:00'],
  },
];

export const MedicationModal: React.FC<MedicationModalProps> = ({
  visible,
  medication,
  onSave,
  onClose,
}) => {
  const { t } = useTranslation('medications');

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<MedicationFrequency>('daily');
  const [times, setTimes] = useState<string[]>(['08:00']);
  const [instructions, setInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      setFrequency(medication.frequency);
      const initialTimes =
        medication.times && medication.times.length > 0
          ? medication.times
          : getDefaultTimesForFrequency(medication.frequency, medication.time);
      setTimes(initialTimes);
      setInstructions(medication.instructions || '');
    } else {
      setName('');
      setDosage('');
      setFrequency('daily');
      setTimes(['08:00']);
      setInstructions('');
    }
  }, [medication, visible]);

  const handleFrequencyChange = (newFreq: MedicationFrequency) => {
    setFrequency(newFreq);
    const defaultTimes = getDefaultTimesForFrequency(newFreq, times[0]);
    setTimes(defaultTimes);
  };

  const handleTimeChange = (index: number, val: string) => {
    const updated = [...times];
    updated[index] = val;
    setTimes(updated);
  };

  const handleApplySuggestion = (sug: typeof COMMON_SUGGESTIONS[0]) => {
    setName(sug.name);
    setDosage(sug.dosage);
    setFrequency(sug.frequency);
    setTimes(sug.times);
  };

  const handleSave = async () => {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert(t('form.addTitle'), t('form.validationError'));
      return;
    }

    // Clean times
    const cleanedTimes = times.map((t) => t.trim() || '08:00');

    setIsSaving(true);
    try {
      await onSave({
        id: medication?.id,
        name: name.trim(),
        dosage: dosage.trim(),
        frequency,
        times: cleanedTimes,
        time: cleanedTimes[0],
        instructions: instructions.trim() || undefined,
      });
      onClose();
    } catch {
      Alert.alert(t('common:error', { defaultValue: 'Erro' }), 'Falha ao salvar medicamento.');
    } finally {
      setIsSaving(false);
    }
  };

  const frequencyOptions: { key: MedicationFrequency; label: string }[] = [
    { key: 'daily', label: t('form.frequencies.daily') },
    { key: 'twice_daily', label: t('form.frequencies.twice_daily') },
    { key: 'three_times_daily', label: t('form.frequencies.three_times_daily') },
    { key: 'weekly', label: t('form.frequencies.weekly') },
    { key: 'biweekly', label: t('form.frequencies.biweekly') },
    { key: 'every_eight_weeks', label: t('form.frequencies.every_eight_weeks') },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.titleWithIcon}>
              <View style={styles.iconCircle}>
                <Pill size={18} color="#7B61FF" />
              </View>
              <Text style={styles.title}>
                {medication ? t('form.editTitle') : t('form.addTitle')}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeButton}
            >
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Quick Suggestions */}
            {!medication && (
              <View style={styles.suggestionsContainer}>
                <View style={styles.suggestionHeader}>
                  <Sparkles size={13} color="#7B61FF" />
                  <Text style={styles.suggestionTitle}>
                    {t('form.quickSuggestions')}
                  </Text>
                </View>
                <View style={styles.suggestionChips}>
                  {COMMON_SUGGESTIONS.map((sug, idx) => (
                    <TouchableOpacity
                      key={`sug-${idx}`}
                      style={styles.suggestionChip}
                      onPress={() => handleApplySuggestion(sug)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.suggestionChipText}>
                        {sug.name} {sug.dosage} ({sug.times.length}x)
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('form.nameLabel')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('form.namePlaceholder')}
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Dosage Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('form.dosageLabel')} *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('form.dosagePlaceholder')}
                placeholderTextColor="#94A3B8"
                value={dosage}
                onChangeText={setDosage}
              />
            </View>

            {/* Frequency Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('form.frequencyLabel')}</Text>
              <View style={styles.frequencyGrid}>
                {frequencyOptions.map((opt) => {
                  const isSelected = frequency === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      style={[
                        styles.frequencyChip,
                        isSelected && styles.frequencyChipSelected,
                      ]}
                      onPress={() => handleFrequencyChange(opt.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.frequencyChipText,
                          isSelected && styles.frequencyChipTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Multiple Scheduled Dose Times (Issue #6 Update) */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <Clock size={14} color="#7B61FF" />
                <Text style={styles.label}>{t('form.timesLabel')}</Text>
              </View>
              <Text style={styles.helperText}>
                {t('form.doseCountDesc', { count: times.length })}
              </Text>

              <View style={styles.timesContainer}>
                {times.map((timeVal, idx) => (
                  <View key={`time-${idx}`} style={styles.timeInputRow}>
                    <View style={styles.doseNumberBadge}>
                      <Text style={styles.doseNumberText}>{idx + 1}ª</Text>
                    </View>
                    <View style={styles.timeFieldWrapper}>
                      <Text style={styles.timeFieldLabel}>
                        {t('form.doseTime', { index: idx + 1 })}
                      </Text>
                      <TextInput
                        style={styles.timeInput}
                        placeholder="08:00"
                        placeholderTextColor="#94A3B8"
                        value={timeVal}
                        onChangeText={(val) => handleTimeChange(idx, val)}
                        maxLength={5}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Instructions Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('form.instructionsLabel')}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('form.instructionsPlaceholder')}
                placeholderTextColor="#94A3B8"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>{t('form.cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={isSaving}
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Salvando...' : t('form.saveButton')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E202B',
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    paddingBottom: 16,
    gap: 14,
  },
  suggestionsContainer: {
    backgroundColor: '#FAF5FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4C1D95',
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  suggestionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7B61FF',
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  helperText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  frequencyChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  frequencyChipSelected: {
    backgroundColor: '#7B61FF',
    borderColor: '#7B61FF',
  },
  frequencyChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  frequencyChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timesContainer: {
    gap: 8,
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    borderWidth: 1,
    borderColor: '#E9D8FD',
    borderRadius: 14,
    padding: 10,
    gap: 10,
  },
  doseNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7B61FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doseNumberText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timeFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  timeInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    width: 76,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  saveButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: '#7B61FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
