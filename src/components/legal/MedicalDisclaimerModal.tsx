import React, { useEffect } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  HeartPulse,
  Info,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from 'lucide-react-native';

interface MedicalDisclaimerModalProps {
  visible: boolean;
  isOnboarding?: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

export const MedicalDisclaimerModal: React.FC<MedicalDisclaimerModalProps> = ({
  visible,
  isOnboarding = false,
  onAccept,
  onClose,
}) => {
  const { t } = useTranslation(['medicalDisclaimer', 'common']);

  const handleDismiss = () => {
    if (isOnboarding) {
      onAccept();
    } else if (onClose) {
      onClose();
    } else {
      onAccept();
    }
  };

  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleDismiss();
      return true;
    });
    return () => subscription.remove();
  }, [visible, isOnboarding]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {!isOnboarding && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.backdropTouch}
          onPress={handleDismiss}
        />
      )}
      <View style={styles.modalCard}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <ShieldAlert size={32} color="#7B61FF" />
          </View>
          <View style={styles.badge}>
            <Sparkles size={13} color="#7B61FF" />
            <Text style={styles.badgeText}>{t('medicalDisclaimer:badge')}</Text>
          </View>
          <Text style={styles.title}>{t('medicalDisclaimer:title')}</Text>
          <Text style={styles.subtitle}>{t('medicalDisclaimer:subtitle')}</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 1. Purpose */}
          <View style={[styles.infoBlock, styles.purposeBlock]}>
            <View style={styles.blockHeader}>
              <HeartPulse size={18} color="#7B61FF" />
              <Text style={[styles.blockTitle, { color: '#4C1D95' }]}>
                {t('medicalDisclaimer:purposeTitle')}
              </Text>
            </View>
            <Text style={[styles.blockText, { color: '#5B21B6' }]}>
              {t('medicalDisclaimer:purposeText')}
            </Text>
          </View>

          {/* 2. No Substitute */}
          <View style={[styles.infoBlock, styles.noSubstituteBlock]}>
            <View style={styles.blockHeader}>
              <Stethoscope size={18} color="#D97706" />
              <Text style={[styles.blockTitle, { color: '#92400E' }]}>
                {t('medicalDisclaimer:noSubstituteTitle')}
              </Text>
            </View>
            <Text style={[styles.blockText, { color: '#78350F' }]}>
              {t('medicalDisclaimer:noSubstituteText')}
            </Text>
          </View>

          {/* 3. Potential Errors / Limitations */}
          <View style={[styles.infoBlock, styles.errorsBlock]}>
            <View style={styles.blockHeader}>
              <Info size={18} color="#475569" />
              <Text style={[styles.blockTitle, { color: '#1E293B' }]}>
                {t('medicalDisclaimer:errorsTitle')}
              </Text>
            </View>
            <Text style={[styles.blockText, { color: '#334155' }]}>
              {t('medicalDisclaimer:errorsText')}
            </Text>
          </View>

          {/* 4. Emergency Symptoms */}
          <View style={[styles.infoBlock, styles.emergencyBlock]}>
            <View style={styles.blockHeader}>
              <AlertTriangle size={18} color="#DC2626" />
              <Text style={[styles.blockTitle, { color: '#991B1B' }]}>
                {t('medicalDisclaimer:emergencyTitle')}
              </Text>
            </View>
            <Text style={[styles.blockText, { color: '#7F1D1D' }]}>
              {t('medicalDisclaimer:emergencyText')}
            </Text>
          </View>
        </ScrollView>

        {/* Footer Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDismiss}
            style={styles.actionButton}
          >
            <Text style={styles.actionButtonText}>
              {isOnboarding
                ? t('medicalDisclaimer:acceptButton')
                : t('medicalDisclaimer:dismissButton')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 28,
    zIndex: 99999,
    elevation: 25,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    width: '100%',
    maxHeight: '92%',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7B61FF',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  scrollContent: {
    paddingBottom: 12,
    gap: 10,
  },
  infoBlock: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  blockTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  blockText: {
    fontSize: 12,
    lineHeight: 18,
  },
  purposeBlock: {
    backgroundColor: '#F5F3FF',
    borderColor: '#E9D8FD',
  },
  noSubstituteBlock: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  errorsBlock: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  emergencyBlock: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  footer: {
    paddingTop: 12,
  },
  actionButton: {
    backgroundColor: '#7B61FF',
    height: 52,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
