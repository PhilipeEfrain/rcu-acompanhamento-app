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

interface MedicationModalProps {
  visible: boolean;
  medication: Medication | null;
  onSave: (data: {
    id?: string;
    name: string;
    dosage: string;
    frequency: MedicationFrequency;
    time?: string;
    instructions?: string;
  }) => Promise<void>;
  onClose: () => void;
}

const COMMON_SUGGESTIONS = [
  { name: 'Mesalazina', dosage: '1200mg', frequency: 'daily' as MedicationFrequency },
  { name: 'Mesalazina', dosage: '800mg', frequency: 'three_times_daily' as MedicationFrequency },
  { name: 'Azatioprina', dosage: '50mg', frequency: 'daily' as MedicationFrequency },
  { name: 'Infliximabe', dosage: '5mg/kg', frequency: 'every_eight_weeks' as MedicationFrequency },
  { name: 'Vedolizumabe', dosage: '300mg', frequency: 'every_eight_weeks' as MedicationFrequency },
  { name: 'Prednisona', dosage: '20mg', frequency: 'daily' as MedicationFrequency },
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
  const [time, setTime] = useState('08:00');
  const [instructions, setInstructions] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (medication) {
      setName(medication.name);
      setDosage(medication.dosage);
      setFrequency(medication.frequency);
      setTime(medication.time || '08:00');
      setInstructions(medication.instructions || '');
    } else {
      setName('');
      setDosage('');
      setFrequency('daily');
      setTime('08:00');
      setInstructions('');
    }
  }, [medication, visible]);

  const handleApplySuggestion = (sug: typeof COMMON_SUGGESTIONS[0]) => {
    setName(sug.name);
    setDosage(sug.dosage);
    setFrequency(sug.frequency);
  };

  const handleSave = async () => {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert(t('form.addTitle'), t('form.validationError'));
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        id: medication?.id,
        name: name.trim(),
        dosage: dosage.trim(),
        frequency,
        time: time.trim() || undefined,
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
            {/* Quick Suggestions for new meds */}
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
                        {sug.name} {sug.dosage}
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
                      onPress={() => setFrequency(opt.key)}
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

            {/* Time Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithIcon}>
                <Clock size={14} color="#64748B" />
                <Text style={styles.label}>{t('form.timeLabel')}</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder={t('form.timePlaceholder')}
                placeholderTextColor="#94A3B8"
                value={time}
                onChangeText={setTime}
              />
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
