import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSymptomStore } from '../store/useSymptomStore';
import { DailyHeader } from '../components/daily-log/DailyHeader';
import { DailyTimeline } from '../components/daily-log/DailyTimeline';
import { TimePickerInput } from '../components/daily-log/TimePickerInput';
import { BristolPicker } from '../components/daily-log/BristolPicker';
import { BristolGuideBottomSheet } from '../components/daily-log/BristolGuideBottomSheet';
import { BloodPresencePicker } from '../components/daily-log/BloodPresencePicker';
import { PainScaleSlider } from '../components/daily-log/PainScaleSlider';
import { NotesInput } from '../components/daily-log/NotesInput';
import { ClinicalExtrasAccordion } from '../components/daily-log/ClinicalExtrasAccordion';
import { CrisisFeedbackBottomSheet } from '../components/feedback/CrisisFeedbackBottomSheet';
import { EmotionalSupportCard } from '../components/feedback/EmotionalSupportCard';
import { HeartPulse, CheckCircle2, X } from 'lucide-react-native';

export const DailyLogScreen: React.FC = () => {
  const { t } = useTranslation(['dailyLog', 'common']);
  const insets = useSafeAreaInsets();

  const {
    selectedDate,
    editingEntryId,
    time,
    bristolType,
    bloodPresence,
    painLevel,
    notes,
    stressLevel,
    hasClots,
    mucusPresence,
    urgencyLevel,
    isFormOpen,
    isSaving,
    activeFeedback,
    showFeedbackModal,
    dayLogs,
    dailySummary,
    setTime,
    setBristolType,
    setBloodPresence,
    setPainLevel,
    setNotes,
    setStressLevel,
    setHasClots,
    setMucusPresence,
    setUrgencyLevel,
    startNewEntry,
    startEditEntry,
    cancelForm,
    deleteEntry,
    loadDateData,
    resetToToday,
    submitDailyLog,
    closeFeedbackModal,
  } = useSymptomStore();

  const [isBristolGuideOpen, setIsBristolGuideOpen] = useState(false);

  useEffect(() => {
    loadDateData(selectedDate);
  }, [loadDateData, selectedDate]);

  const handleSubmit = async () => {
    try {
      await submitDailyLog();
    } catch {
      Alert.alert(t('common:error'), t('dailyLog:actions.saving'));
    }
  };

  const isEditing = Boolean(editingEntryId);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: 8,
              paddingBottom: 28,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <DailyHeader
            dateString={selectedDate}
            isFormOpen={isFormOpen}
            isExistingLog={isEditing}
            timeString={time}
            onResetToToday={resetToToday}
            onCancelForm={cancelForm}
          />

          {!isFormOpen ? (
            /* Timeline View (List of today's episodes & Care Support) */
            <View>
              <DailyTimeline
                date={selectedDate}
                logs={dayLogs}
                summary={dailySummary}
                onAddNew={() => startNewEntry(selectedDate)}
                onEdit={startEditEntry}
                onDelete={deleteEntry}
              />
              <EmotionalSupportCard />
            </View>
          ) : (
            /* Form View (Single episode check-in / edit) */
            <View style={styles.formContainer}>
              <TimePickerInput time={time} onChangeTime={setTime} />

              <BristolPicker
                selectedType={bristolType}
                onSelectType={setBristolType}
                onOpenGuide={() => setIsBristolGuideOpen(true)}
              />

              <BloodPresencePicker
                selectedPresence={bloodPresence}
                onSelectPresence={setBloodPresence}
              />

              <PainScaleSlider
                painLevel={painLevel}
                onSelectPainLevel={setPainLevel}
              />

              {/* Extended Biomarkers Accordion (Issue #9) */}
              <ClinicalExtrasAccordion
                stressLevel={stressLevel}
                hasClots={hasClots}
                mucusPresence={mucusPresence}
                urgencyLevel={urgencyLevel}
                onSelectStressLevel={setStressLevel}
                onSelectHasClots={setHasClots}
                onSelectMucusPresence={setMucusPresence}
                onSelectUrgencyLevel={setUrgencyLevel}
              />

              <NotesInput notes={notes} onChangeNotes={setNotes} />

              <View style={styles.submitContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSubmit}
                  disabled={isSaving}
                  style={[
                    styles.submitButton,
                    isEditing && styles.updateButton,
                    isSaving && styles.submitButtonDisabled,
                  ]}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View style={styles.buttonContent}>
                      {isEditing ? (
                        <CheckCircle2 size={20} color="#FFFFFF" />
                      ) : (
                        <HeartPulse size={20} color="#FFFFFF" />
                      )}
                      <Text style={styles.submitButtonText}>
                        {isEditing
                          ? t('dailyLog:actions.update')
                          : t('dailyLog:actions.submit')}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={cancelForm}
                  style={styles.cancelButton}
                >
                  <X size={16} color="#6B7280" />
                  <Text style={styles.cancelButtonText}>{t('dailyLog:cancelEdit')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        <BristolGuideBottomSheet
          visible={isBristolGuideOpen}
          selectedType={bristolType}
          onSelectType={setBristolType}
          onClose={() => setIsBristolGuideOpen(false)}
        />

        <CrisisFeedbackBottomSheet
          visible={showFeedbackModal}
          feedback={activeFeedback}
          onDismiss={closeFeedbackModal}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  formContainer: {
    marginTop: 4,
  },
  submitContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#7B61FF',
    height: 56,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  updateButton: {
    backgroundColor: '#8E63B8',
    shadowColor: '#8E63B8',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF5FF',
    height: 48,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});
