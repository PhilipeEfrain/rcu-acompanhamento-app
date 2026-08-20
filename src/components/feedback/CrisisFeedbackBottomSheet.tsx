import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { CrisisEvaluation } from '../../domain/health/types';
import {
  AlertTriangle,
  CheckCircle2,
  HeartHandshake,
  Info,
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

  if (!feedback) return null;

  const isFlare = feedback.severity === 'moderate_to_severe_flare';
  const isMild = feedback.severity === 'mild_activity';
  const isRemission = feedback.severity === 'remission';

  const getHeaderIcon = () => {
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
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragIndicator} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.header}>
              {getHeaderIcon()}
              <Text style={styles.title}>{t(feedback.titleKey)}</Text>
              <Text style={styles.message}>{t(feedback.messageKey)}</Text>
            </View>

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
            <EmotionalSupportCard compact style={{ marginTop: 16 }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onDismiss}
              style={[
                styles.dismissButton,
                { backgroundColor: isFlare ? '#EF4444' : '#7B61FF' },
              ]}
            >
              <Text style={styles.dismissButtonText}>
                {t('crisisFeedback:actions.dismiss')}
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
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    maxHeight: '85%',
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
