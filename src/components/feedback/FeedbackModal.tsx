import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  Bug,
  CheckCircle2,
  HeartHandshake,
  Lightbulb,
  MessageSquare,
  MessageSquareHeart,
  Send,
  ShieldCheck,
  Stethoscope,
  User,
  X,
} from 'lucide-react-native';
import {
  feedbackService,
  FeedbackCategory,
  UserType,
} from '../../services/feedbackService';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation(['feedback', 'common']);

  const [userType, setUserType] = useState<UserType>('patient');
  const [category, setCategory] = useState<FeedbackCategory>('bug');
  const [doctorName, setDoctorName] = useState('');
  const [crm, setCrm] = useState('');
  const [uf, setUf] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [includeDeviceMeta, setIncludeDeviceMeta] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form upon opening
  useEffect(() => {
    if (visible) {
      setIsSuccess(false);
      setIsLoading(false);
      setErrorMessage(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => subscription.remove();
  }, [visible, onClose]);

  if (!visible) return null;

  const resetForm = () => {
    setUserType('patient');
    setCategory('bug');
    setDoctorName('');
    setCrm('');
    setUf('');
    setSpecialty('');
    setMessage('');
    setContactEmail('');
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    // Validation
    if (userType === 'doctor') {
      if (!doctorName.trim() || !crm.trim() || !uf.trim()) {
        setErrorMessage(t('feedback:validationRequired'));
        return;
      }
    }

    if (!message.trim() || message.trim().length < 10) {
      setErrorMessage(t('feedback:validationMinLength'));
      return;
    }

    setIsLoading(true);

    const res = await feedbackService.submitFeedback({
      userType,
      category,
      message,
      contactEmail: contactEmail.trim() || undefined,
      includeDeviceMeta,
      doctorInfo:
        userType === 'doctor'
          ? {
              fullName: doctorName,
              crm,
              uf,
              specialty: specialty.trim() || undefined,
            }
          : undefined,
    });

    setIsLoading(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(t('feedback:networkError'));
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdropTouch}
        onPress={handleClose}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerTitleGroup}>
              <View style={styles.headerIconWrapper}>
                <MessageSquareHeart size={22} color="#7B61FF" />
              </View>
              <View style={styles.headerTextGroup}>
                <Text style={styles.modalTitle}>{t('feedback:modalTitle')}</Text>
                <Text style={styles.modalSubtitle}>{t('feedback:modalSubtitle')}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeIconButton}
              activeOpacity={0.7}
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Success Screen View */}
          {isSuccess ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={48} color="#10B981" />
              </View>
              <Text style={styles.successTitle}>{t('feedback:successTitle')}</Text>
              <Text style={styles.successMessage}>{t('feedback:successMessage')}</Text>

              <TouchableOpacity
                onPress={handleClose}
                style={styles.successCloseButton}
                activeOpacity={0.8}
              >
                <Text style={styles.successCloseButtonText}>{t('feedback:closeButton')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Profile Selector */}
              <Text style={styles.sectionLabel}>{t('feedback:profileSectionTitle')}</Text>
              <View style={styles.profileToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.profileTab,
                    userType === 'patient' && styles.profileTabActive,
                  ]}
                  onPress={() => setUserType('patient')}
                  activeOpacity={0.8}
                >
                  <User size={16} color={userType === 'patient' ? '#7B61FF' : '#64748B'} />
                  <Text
                    style={[
                      styles.profileTabText,
                      userType === 'patient' && styles.profileTabTextActive,
                    ]}
                  >
                    {t('feedback:profilePatient')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.profileTab,
                    userType === 'doctor' && styles.profileTabActive,
                  ]}
                  onPress={() => {
                    setUserType('doctor');
                    setCategory('clinical');
                  }}
                  activeOpacity={0.8}
                >
                  <Stethoscope size={16} color={userType === 'doctor' ? '#7B61FF' : '#64748B'} />
                  <Text
                    style={[
                      styles.profileTabText,
                      userType === 'doctor' && styles.profileTabTextActive,
                    ]}
                  >
                    {t('feedback:profileDoctor')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Conditional Doctor Fields */}
              {userType === 'doctor' && (
                <View style={styles.doctorBox}>
                  <View style={styles.doctorBoxHeader}>
                    <Stethoscope size={16} color="#7C3AED" />
                    <Text style={styles.doctorBoxTitle}>{t('feedback:doctorInfoTitle')}</Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('feedback:doctorNameLabel')} *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('feedback:doctorNamePlaceholder')}
                      placeholderTextColor="#94A3B8"
                      value={doctorName}
                      onChangeText={setDoctorName}
                    />
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 2 }]}>
                      <Text style={styles.inputLabel}>{t('feedback:crmLabel')} *</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder={t('feedback:crmPlaceholder')}
                        placeholderTextColor="#94A3B8"
                        value={crm}
                        onChangeText={setCrm}
                        keyboardType="default"
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>{t('feedback:ufLabel')} *</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder={t('feedback:ufPlaceholder')}
                        placeholderTextColor="#94A3B8"
                        maxLength={2}
                        autoCapitalize="characters"
                        value={uf}
                        onChangeText={(txt) => setUf(txt.toUpperCase())}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('feedback:specialtyLabel')}</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder={t('feedback:specialtyPlaceholder')}
                      placeholderTextColor="#94A3B8"
                      value={specialty}
                      onChangeText={setSpecialty}
                    />
                  </View>
                </View>
              )}

              {/* Category Selection */}
              <Text style={styles.sectionLabel}>{t('feedback:categoryTitle')}</Text>
              <View style={styles.categoryGrid}>
                <TouchableOpacity
                  style={[styles.categoryPill, category === 'bug' && styles.categoryPillActive]}
                  onPress={() => setCategory('bug')}
                  activeOpacity={0.7}
                >
                  <Bug size={14} color={category === 'bug' ? '#DC2626' : '#64748B'} />
                  <Text style={[styles.categoryPillText, category === 'bug' && styles.categoryPillTextActive]}>
                    {t('feedback:categoryBug')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.categoryPill, category === 'suggestion' && styles.categoryPillActive]}
                  onPress={() => setCategory('suggestion')}
                  activeOpacity={0.7}
                >
                  <Lightbulb size={14} color={category === 'suggestion' ? '#F59E0B' : '#64748B'} />
                  <Text style={[styles.categoryPillText, category === 'suggestion' && styles.categoryPillTextActive]}>
                    {t('feedback:categorySuggestion')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.categoryPill, category === 'clinical' && styles.categoryPillActive]}
                  onPress={() => setCategory('clinical')}
                  activeOpacity={0.7}
                >
                  <HeartHandshake size={14} color={category === 'clinical' ? '#7B61FF' : '#64748B'} />
                  <Text style={[styles.categoryPillText, category === 'clinical' && styles.categoryPillTextActive]}>
                    {t('feedback:categoryClinical')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.categoryPill, category === 'other' && styles.categoryPillActive]}
                  onPress={() => setCategory('other')}
                  activeOpacity={0.7}
                >
                  <MessageSquare size={14} color={category === 'other' ? '#0284C7' : '#64748B'} />
                  <Text style={[styles.categoryPillText, category === 'other' && styles.categoryPillTextActive]}>
                    {t('feedback:categoryOther')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Message Input */}
              <View style={styles.inputGroup}>
                <View style={styles.labelWithCounter}>
                  <Text style={styles.inputLabel}>{t('feedback:messageLabel')} *</Text>
                  <Text style={styles.counterText}>{message.length} carac.</Text>
                </View>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder={t('feedback:messagePlaceholder')}
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={message}
                  onChangeText={setMessage}
                />
              </View>

              {/* Contact Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('feedback:emailLabel')}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={t('feedback:emailPlaceholder')}
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={contactEmail}
                  onChangeText={setContactEmail}
                />
              </View>

              {/* Device Metadata Checkbox */}
              <TouchableOpacity
                style={styles.metaCheckboxRow}
                onPress={() => setIncludeDeviceMeta(!includeDeviceMeta)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkboxBox, includeDeviceMeta && styles.checkboxBoxChecked]}>
                  {includeDeviceMeta && <CheckCircle2 size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.metaCheckboxText}>{t('feedback:includeDeviceMeta')}</Text>
              </TouchableOpacity>

              {/* Privacy LGPD Notice */}
              <View style={styles.privacyNoticeBox}>
                <ShieldCheck size={16} color="#059669" />
                <Text style={styles.privacyNoticeText}>{t('feedback:privacyNotice')}</Text>
              </View>

              {/* Error Message */}
              {errorMessage && (
                <View style={styles.errorBox}>
                  <AlertCircle size={16} color="#DC2626" />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}
            </ScrollView>
          )}

          {/* Footer Submit Button */}
          {!isSuccess && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <View style={styles.submitButtonContent}>
                    <Send size={18} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>{t('feedback:submitButton')}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    zIndex: 99999,
    elevation: 25,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardContainer: {
    width: '100%',
    maxHeight: '94%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    width: '100%',
    maxHeight: '100%',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextGroup: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  scrollContent: {
    paddingBottom: 12,
    gap: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: -4,
  },
  profileToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 4,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  profileTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  profileTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  profileTabTextActive: {
    color: '#7B61FF',
    fontWeight: '700',
  },
  doctorBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    gap: 10,
  },
  doctorBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  doctorBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6D28D9',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    gap: 4,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  labelWithCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  counterText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1E293B',
  },
  textArea: {
    height: 84,
    paddingTop: 10,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#F5F3FF',
    borderColor: '#C4B5FD',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#6D28D9',
    fontWeight: '700',
  },
  metaCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxChecked: {
    backgroundColor: '#7B61FF',
    borderColor: '#7B61FF',
  },
  metaCheckboxText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  privacyNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  privacyNoticeText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
    lineHeight: 15,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: '#7B61FF',
    height: 50,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 12,
    gap: 12,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 16,
  },
  successCloseButton: {
    marginTop: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCloseButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
