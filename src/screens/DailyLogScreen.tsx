import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSymptomStore } from '../store/useSymptomStore';
import { DailyHeader } from '../components/daily-log/DailyHeader';
import { BristolPicker } from '../components/daily-log/BristolPicker';
import { BloodPresencePicker } from '../components/daily-log/BloodPresencePicker';
import { PainScaleSlider } from '../components/daily-log/PainScaleSlider';
import { NotesInput } from '../components/daily-log/NotesInput';
import { CrisisFeedbackBottomSheet } from '../components/feedback/CrisisFeedbackBottomSheet';
import { HeartPulse } from 'lucide-react-native';

export const DailyLogScreen: React.FC = () => {
  const { t } = useTranslation(['dailyLog', 'common']);

  const {
    selectedDate,
    bristolType,
    bloodPresence,
    painLevel,
    notes,
    isSaving,
    activeFeedback,
    showFeedbackModal,
    setBristolType,
    setBloodPresence,
    setPainLevel,
    setNotes,
    submitDailyLog,
    closeFeedbackModal,
    loadRecentLogs,
  } = useSymptomStore();

  useEffect(() => {
    loadRecentLogs();
  }, [loadRecentLogs]);

  const handleSubmit = async () => {
    try {
      await submitDailyLog();
    } catch {
      Alert.alert(t('common:error'), t('dailyLog:actions.saving'));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <DailyHeader dateString={selectedDate} />

          <BristolPicker
            selectedType={bristolType}
            onSelectType={setBristolType}
          />

          <BloodPresencePicker
            selectedPresence={bloodPresence}
            onSelectPresence={setBloodPresence}
          />

          <PainScaleSlider
            painLevel={painLevel}
            onSelectPainLevel={setPainLevel}
          />

          <NotesInput notes={notes} onChangeNotes={setNotes} />

          <View style={styles.submitContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              disabled={isSaving}
              style={[
                styles.submitButton,
                isSaving && styles.submitButtonDisabled,
              ]}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <HeartPulse size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>
                    {t('dailyLog:actions.submit')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        <CrisisFeedbackBottomSheet
          visible={showFeedbackModal}
          feedback={activeFeedback}
          onDismiss={closeFeedbackModal}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  submitContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
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
});
