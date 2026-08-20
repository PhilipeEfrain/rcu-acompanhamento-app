import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  Pill,
  Shield,
  HeartPulse,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  X,
  Building2,
  FileCheck,
  Scale,
} from 'lucide-react-native';

interface CareGuideBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  initialTab?: 'sus' | 'compounding' | 'rights' | 'flareCare' | 'doctorPrep';
}

type GuideTab = 'sus' | 'compounding' | 'rights' | 'flareCare' | 'doctorPrep';

export const CareGuideBottomSheet: React.FC<CareGuideBottomSheetProps> = ({
  visible,
  onClose,
  initialTab = 'sus',
}) => {
  const { t } = useTranslation(['careGuide', 'common']);
  const [activeTab, setActiveTab] = useState<GuideTab>(initialTab);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header & Drag Indicator */}
          <View style={styles.dragIndicator} />

          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconWrapper}>
                <BookOpen size={22} color="#7B61FF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>{t('careGuide:title')}</Text>
                <Text style={styles.headerSubtitle}>{t('careGuide:subtitle')}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Horizontal Flo Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
            style={styles.tabsContainer}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('sus')}
              style={[
                styles.tabPill,
                activeTab === 'sus' && styles.tabPillActive,
              ]}
            >
              <Building2 size={18} color={activeTab === 'sus' ? '#FFFFFF' : '#64748B'} />
              <Text
                numberOfLines={1}
                style={[
                  styles.tabPillText,
                  activeTab === 'sus' && styles.tabPillTextActive,
                ]}
              >
                {t('careGuide:tabs.sus', { defaultValue: 'Remédios pelo SUS' })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('compounding')}
              style={[
                styles.tabPill,
                activeTab === 'compounding' && styles.tabPillActive,
              ]}
            >
              <Pill size={18} color={activeTab === 'compounding' ? '#FFFFFF' : '#64748B'} />
              <Text
                numberOfLines={1}
                style={[
                  styles.tabPillText,
                  activeTab === 'compounding' && styles.tabPillTextActive,
                ]}
              >
                {t('careGuide:tabs.compounding', { defaultValue: 'Manipulação' })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('rights')}
              style={[
                styles.tabPill,
                activeTab === 'rights' && styles.tabPillActive,
              ]}
            >
              <Scale size={18} color={activeTab === 'rights' ? '#FFFFFF' : '#64748B'} />
              <Text
                numberOfLines={1}
                style={[
                  styles.tabPillText,
                  activeTab === 'rights' && styles.tabPillTextActive,
                ]}
              >
                {t('careGuide:tabs.rights', { defaultValue: 'Seus Direitos' })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('flareCare')}
              style={[
                styles.tabPill,
                activeTab === 'flareCare' && styles.tabPillActive,
              ]}
            >
              <HeartPulse size={18} color={activeTab === 'flareCare' ? '#FFFFFF' : '#64748B'} />
              <Text
                numberOfLines={1}
                style={[
                  styles.tabPillText,
                  activeTab === 'flareCare' && styles.tabPillTextActive,
                ]}
              >
                {t('careGuide:tabs.flareCare', { defaultValue: 'Cuidados em Crise' })}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveTab('doctorPrep')}
              style={[
                styles.tabPill,
                activeTab === 'doctorPrep' && styles.tabPillActive,
              ]}
            >
              <Stethoscope size={18} color={activeTab === 'doctorPrep' ? '#FFFFFF' : '#64748B'} />
              <Text
                numberOfLines={1}
                style={[
                  styles.tabPillText,
                  activeTab === 'doctorPrep' && styles.tabPillTextActive,
                ]}
              >
                {t('careGuide:tabs.doctorPrep', { defaultValue: 'Consulta Médica' })}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Tab Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentScroll}
          >
            {/* 1. SUS SECTION */}
            {activeTab === 'sus' && (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.badge, { backgroundColor: '#EDE9FE' }]}>
                    <Text style={[styles.badgeText, { color: '#7C3AED' }]}>
                      {t('careGuide:susSection.badge')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{t('careGuide:susSection.title')}</Text>
                <Text style={styles.cardDesc}>{t('careGuide:susSection.desc')}</Text>

                <View style={styles.stepsBox}>
                  <Text style={styles.stepsTitle}>{t('careGuide:susSection.stepTitle')}</Text>

                  <View style={styles.stepItem}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <Text style={styles.stepItemText}>{t('careGuide:susSection.step1')}</Text>
                  </View>

                  <View style={styles.stepItem}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <Text style={styles.stepItemText}>{t('careGuide:susSection.step2')}</Text>
                  </View>

                  <View style={styles.stepItem}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <Text style={styles.stepItemText}>{t('careGuide:susSection.step3')}</Text>
                  </View>

                  <View style={styles.stepItem}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>4</Text>
                    </View>
                    <Text style={styles.stepItemText}>{t('careGuide:susSection.step4')}</Text>
                  </View>

                  <View style={styles.stepItem}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>5</Text>
                    </View>
                    <Text style={styles.stepItemText}>{t('careGuide:susSection.step5')}</Text>
                  </View>
                </View>

                <View style={[styles.infoHighlightBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                  <Text style={[styles.infoHighlightTitle, { color: '#166534' }]}>
                    📦 {t('careGuide:susSection.medsTitle')}
                  </Text>
                  <Text style={[styles.infoHighlightDesc, { color: '#15803D' }]}>
                    {t('careGuide:susSection.medsList')}
                  </Text>
                </View>

                <View style={styles.tipBox}>
                  <Text style={styles.tipText}>{t('careGuide:susSection.tip')}</Text>
                </View>
              </View>
            )}

            {/* 2. COMPOUNDING SECTION */}
            {activeTab === 'compounding' && (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.badgeText, { color: '#B45309' }]}>
                      {t('careGuide:compoundingSection.badge')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{t('careGuide:compoundingSection.title')}</Text>
                <Text style={styles.cardDesc}>{t('careGuide:compoundingSection.desc')}</Text>

                <View style={styles.benefitCard}>
                  <Text style={styles.benefitTitle}>💰 {t('careGuide:compoundingSection.benefit1Title')}</Text>
                  <Text style={styles.benefitDesc}>{t('careGuide:compoundingSection.benefit1Desc')}</Text>
                </View>

                <View style={styles.benefitCard}>
                  <Text style={styles.benefitTitle}>📝 {t('careGuide:compoundingSection.benefit2Title')}</Text>
                  <Text style={styles.benefitDesc}>{t('careGuide:compoundingSection.benefit2Desc')}</Text>
                </View>

                <View style={styles.benefitCard}>
                  <Text style={styles.benefitTitle}>🔬 {t('careGuide:compoundingSection.benefit3Title')}</Text>
                  <Text style={styles.benefitDesc}>{t('careGuide:compoundingSection.benefit3Desc')}</Text>
                </View>
              </View>
            )}

            {/* 3. PATIENT RIGHTS */}
            {activeTab === 'rights' && (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.badge, { backgroundColor: '#E0E7FF' }]}>
                    <Text style={[styles.badgeText, { color: '#3730A3' }]}>
                      {t('careGuide:rightsSection.badge')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{t('careGuide:rightsSection.title')}</Text>
                <Text style={styles.cardDesc}>{t('careGuide:rightsSection.desc')}</Text>

                <View style={styles.rightCard}>
                  <Text style={styles.rightTitle}>🚻 {t('careGuide:rightsSection.right1Title')}</Text>
                  <Text style={styles.rightDesc}>{t('careGuide:rightsSection.right1Desc')}</Text>
                </View>

                <View style={styles.rightCard}>
                  <Text style={styles.rightTitle}>🪪 {t('careGuide:rightsSection.right2Title')}</Text>
                  <Text style={styles.rightDesc}>{t('careGuide:rightsSection.right2Desc')}</Text>
                </View>

                <View style={styles.rightCard}>
                  <Text style={styles.rightTitle}>⚡ {t('careGuide:rightsSection.right3Title')}</Text>
                  <Text style={styles.rightDesc}>{t('careGuide:rightsSection.right3Desc')}</Text>
                </View>

                <View style={styles.rightCard}>
                  <Text style={styles.rightTitle}>⚖️ {t('careGuide:rightsSection.right4Title')}</Text>
                  <Text style={styles.rightDesc}>{t('careGuide:rightsSection.right4Desc')}</Text>
                </View>
              </View>
            )}

            {/* 4. FLARE CARE */}
            {activeTab === 'flareCare' && (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.badge, { backgroundColor: '#FCE7F3' }]}>
                    <Text style={[styles.badgeText, { color: '#9D174D' }]}>
                      {t('careGuide:flareCareSection.badge')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{t('careGuide:flareCareSection.title')}</Text>
                <Text style={styles.cardDesc}>{t('careGuide:flareCareSection.desc')}</Text>

                <View style={styles.flareCard}>
                  <Text style={styles.flareCardTitle}>💧 {t('careGuide:flareCareSection.care1Title')}</Text>
                  <Text style={styles.flareCardDesc}>{t('careGuide:flareCareSection.care1Desc')}</Text>
                </View>

                <View style={styles.flareCard}>
                  <Text style={styles.flareCardTitle}>🚿 {t('careGuide:flareCareSection.care2Title')}</Text>
                  <Text style={styles.flareCardDesc}>{t('careGuide:flareCareSection.care2Desc')}</Text>
                </View>

                <View style={styles.flareCard}>
                  <Text style={styles.flareCardTitle}>🍲 {t('careGuide:flareCareSection.care3Title')}</Text>
                  <Text style={styles.flareCardDesc}>{t('careGuide:flareCareSection.care3Desc')}</Text>
                </View>

                <View style={[styles.flareCard, { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }]}>
                  <Text style={[styles.flareCardTitle, { color: '#B91C1C' }]}>
                    🚫 {t('careGuide:flareCareSection.care4Title')}
                  </Text>
                  <Text style={[styles.flareCardDesc, { color: '#991B1C' }]}>
                    {t('careGuide:flareCareSection.care4Desc')}
                  </Text>
                </View>
              </View>
            )}

            {/* 5. DOCTOR PREPARATION */}
            {activeTab === 'doctorPrep' && (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.badge, { backgroundColor: '#E0F2FE' }]}>
                    <Text style={[styles.badgeText, { color: '#0369A1' }]}>
                      {t('careGuide:doctorPrepSection.badge')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{t('careGuide:doctorPrepSection.title')}</Text>
                <Text style={styles.cardDesc}>{t('careGuide:doctorPrepSection.desc')}</Text>

                <View style={[styles.infoHighlightBox, { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }]}>
                  <Text style={[styles.infoHighlightTitle, { color: '#0F172A' }]}>
                    📊 {t('careGuide:doctorPrepSection.prep1Title')}
                  </Text>
                  <Text style={[styles.infoHighlightDesc, { color: '#334155' }]}>
                    {t('careGuide:doctorPrepSection.prep1Desc')}
                  </Text>
                </View>

                <View style={styles.stepsBox}>
                  <Text style={styles.stepsTitle}>❓ {t('careGuide:doctorPrepSection.prep2Title')}</Text>
                  <Text style={styles.questionItem}>{t('careGuide:doctorPrepSection.q1')}</Text>
                  <Text style={styles.questionItem}>{t('careGuide:doctorPrepSection.q2')}</Text>
                  <Text style={styles.questionItem}>{t('careGuide:doctorPrepSection.q3')}</Text>
                  <Text style={styles.questionItem}>{t('careGuide:doctorPrepSection.q4')}</Text>
                </View>

                <View style={[styles.tipBox, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                  <Text style={[styles.tipText, { color: '#92400E' }]}>
                    🚨 {t('careGuide:doctorPrepSection.prep3Title')}{'\n'}
                    {t('careGuide:doctorPrepSection.prep3Desc')}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer Action Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={styles.closeFooterButton}
            >
              <Text style={styles.closeFooterButtonText}>
                {t('careGuide:actions.close')}
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
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: '90%',
    minHeight: '75%',
  },
  dragIndicator: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 240,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabsContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexShrink: 0,
    minHeight: 44,
  },
  tabPillActive: {
    backgroundColor: '#7B61FF',
    borderColor: '#7B61FF',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  tabPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    flexShrink: 0,
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionCard: {
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 24,
  },
  cardDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
  },
  stepsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    marginTop: 4,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7B61FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  stepItemText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
    flex: 1,
  },
  infoHighlightBox: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  infoHighlightTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  infoHighlightDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  tipBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  tipText: {
    fontSize: 13,
    color: '#6B21A8',
    lineHeight: 19,
    fontWeight: '500',
  },
  benefitCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  benefitDesc: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
  },
  rightCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  rightTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  rightDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  flareCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  flareCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  flareCardDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  questionItem: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  closeFooterButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#7B61FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  closeFooterButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
