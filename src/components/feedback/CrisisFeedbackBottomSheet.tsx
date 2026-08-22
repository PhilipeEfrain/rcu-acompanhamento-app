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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CrisisEvaluation } from '../../domain/health/types';
import {
  AlertTriangle,
  CheckCircle2,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
} from 'lucide-react-native';

import { EmotionalSupportCard } from './EmotionalSupportCard';

interface CrisisFeedbackBottomSheetProps {
  visible: boolean;
  feedback: CrisisEvaluation | null;
  onDismiss: () => void;
}

export const CrisisFeedbackBottomSheet: React.FC<CrisisFeedbackBottomSheetProps> = ({
  visible,
  feedback,
  onDismiss,
}) => {
  const { t } = useTranslation(['crisisFeedback', 'common']);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismiss();
      return true;
    });
    return () => subscription.remove();
  }, [visible, onDismiss]);

  if (!visible || !feedback) return null;

  const isEmergency = feedback.severity === 'severe_emergency';
  const isFlare = feedback.severity === 'moderate_to_severe_flare';
  const isMild = feedback.severity === 'mild_activity';
  const isRemission = feedback.severity === 'remission';

  const getHeaderIcon = () => {
    if (isEmergency) {
      return (
        <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2', borderColor: '#DC2626', borderWidth: 2 }]}>
          <ShieldAlert size={38} color="#DC2626" />
        </View>
      );
    }
    if (isFlare) {
      return (
        <View style={[styles.iconWrapper, { backgroundColor: '#FEE2E2' }]}>
          <ShieldAlert size={36} color="#EF4444" />
        </View>
      );
    }
    if (isMild) {
      return (
        <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
          <AlertTriangle size={36} color="#F59E0B" />
        </View>
      );
    }
    return (
      <View style={[styles.iconWrapper, { backgroundColor: '#DCFCE7' }]}>
        <CheckCircle2 size={36} color="#10B981" />
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.backdropTouch}
        onPress={onDismiss}
      />
      <View style={styles.sheetContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            {getHeaderIcon()}
            <Text style={styles.title}>{t(feedback.titleKey)}</Text>
            <Text style={styles.message}>{t(feedback.messageKey)}</Text>
          </View>

          {/* Contextual Psychoeducational Feedback (Issue #16 - Morning Pooling / Tenesmus) */}
          {feedback.contextualFeedbackKey && (
            <View style={styles.contextualBox}>
              <View style={styles.contextualHeader}>
                <Sparkles size={16} color="#7C3AED" />
                <Text style={styles.contextualBadge}>
                  {t(`${feedback.contextualFeedbackKey}.badge`)}
                </Text>
              </View>
              <Text style={styles.contextualTitle}>
                {t(`${feedback.contextualFeedbackKey}.title`)}
              </Text>
              <Text style={styles.contextualMessage}>
                {t(`${feedback.contextualFeedbackKey}.message`)}
              </Text>
              <Text style={styles.contextualAction}>
                💡 {t(`${feedback.contextualFeedbackKey}.action`)}
              </Text>
            </View>
          )}

          <View style={styles.guidelinesBox}>
            <View style={styles.guidelinesHeader}>
              <HeartHandshake size={18} color="#7B61FF" />
              <Text style={styles.guidelinesTitle}>
                {t('crisisFeedback:actions.view_guidance')}
              </Text>
            </View>

            {feedback.guidelinesKeys.map((key, index) => (
              <View key={index} style={styles.guidelineItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.guidelineText}>{t(key)}</Text>
              </View>
            ))}
          </View>

          {/* Emotional Support & Multidisciplinary Guidance (Issue #11) */}
          <EmotionalSupportCard compact unpadded style={{ marginTop: 16 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onDismiss}
            style={[
              styles.dismissButton,
              { backgroundColor: isEmergency ? '#DC2626' : isFlare ? '#EF4444' : '#7B61FF' },
            ]}
          >
            <Text style={styles.dismissButtonText}>
              {isEmergency ? t('crisisFeedback:actions.emergency_dismiss', { defaultValue: 'Entendido, buscar atendimento' }) : t('crisisFeedback:actions.dismiss')}
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
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    zIndex: 9999,
    elevation: 20,
  },
  backdropTouch: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    width: '100%',
    maxHeight: '92%',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  dragIndicator: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 10,
  },
  contextualBox: {
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    marginBottom: 14,
  },
  contextualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  contextualBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contextualTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4C1D95',
    marginBottom: 4,
  },
  contextualMessage: {
    fontSize: 13,
    color: '#5B21B6',
    lineHeight: 18,
    marginBottom: 8,
  },
  contextualAction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6D28D9',
  },
  guidelinesBox: {
    backgroundColor: '#F8F9FE',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7B61FF',
    marginTop: 7,
  },
  guidelineText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    flex: 1,
  },
  footer: {
    paddingTop: 12,
  },
  dismissButton: {
    height: 54,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
