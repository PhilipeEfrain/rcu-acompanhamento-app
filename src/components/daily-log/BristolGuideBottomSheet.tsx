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
import { BristolType } from '../../domain/health/types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  HeartPulse,
  Info,
  Lightbulb,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react-native';

interface BristolGuideBottomSheetProps {
  visible: boolean;
  selectedType?: BristolType;
  onSelectType?: (type: BristolType) => void;
  onClose: () => void;
}

type TabCategory = 'all' | 'constipation' | 'ideal' | 'diarrhea';

interface BristolTypeDetail {
  type: BristolType;
  number: number;
  category: 'constipation' | 'ideal' | 'diarrhea';
  titleKey: string;
  shapeDescKey: string;
  transitTimeKey: string;
  meaningKey: string;
  actionTipKey: string;
  statusKey: string;
  isIdeal?: boolean;
  bgColor: string;
  borderColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
}

const BRISTOL_DETAILS: BristolTypeDetail[] = [
  {
    type: 'type_1',
    number: 1,
    category: 'constipation',
    titleKey: 'bristolGuide:type1.title',
    shapeDescKey: 'bristolGuide:type1.shapeDesc',
    transitTimeKey: 'bristolGuide:type1.transitTime',
    meaningKey: 'bristolGuide:type1.clinicalMeaning',
    actionTipKey: 'bristolGuide:type1.actionTip',
    statusKey: 'bristolGuide:status.constipation',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    accentColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
  {
    type: 'type_2',
    number: 2,
    category: 'constipation',
    titleKey: 'bristolGuide:type2.title',
    shapeDescKey: 'bristolGuide:type2.shapeDesc',
    transitTimeKey: 'bristolGuide:type2.transitTime',
    meaningKey: 'bristolGuide:type2.clinicalMeaning',
    actionTipKey: 'bristolGuide:type2.actionTip',
    statusKey: 'bristolGuide:status.mildConstipation',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    accentColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
  {
    type: 'type_3',
    number: 3,
    category: 'ideal',
    titleKey: 'bristolGuide:type3.title',
    shapeDescKey: 'bristolGuide:type3.shapeDesc',
    transitTimeKey: 'bristolGuide:type3.transitTime',
    meaningKey: 'bristolGuide:type3.clinicalMeaning',
    actionTipKey: 'bristolGuide:type3.actionTip',
    statusKey: 'bristolGuide:status.normal',
    bgColor: '#F0FDF4',
    borderColor: '#10B981',
    accentColor: '#059669',
    badgeBg: '#DCFCE7',
    badgeText: '#047857',
  },
  {
    type: 'type_4',
    number: 4,
    category: 'ideal',
    titleKey: 'bristolGuide:type4.title',
    shapeDescKey: 'bristolGuide:type4.shapeDesc',
    transitTimeKey: 'bristolGuide:type4.transitTime',
    meaningKey: 'bristolGuide:type4.clinicalMeaning',
    actionTipKey: 'bristolGuide:type4.actionTip',
    statusKey: 'bristolGuide:status.ideal',
    isIdeal: true,
    bgColor: '#ECFDF5',
    borderColor: '#059669',
    accentColor: '#047857',
    badgeBg: '#D1FAE5',
    badgeText: '#065F46',
  },
  {
    type: 'type_5',
    number: 5,
    category: 'diarrhea',
    titleKey: 'bristolGuide:type5.title',
    shapeDescKey: 'bristolGuide:type5.shapeDesc',
    transitTimeKey: 'bristolGuide:type5.transitTime',
    meaningKey: 'bristolGuide:type5.clinicalMeaning',
    actionTipKey: 'bristolGuide:type5.actionTip',
    statusKey: 'bristolGuide:status.mildDiarrhea',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    accentColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
  {
    type: 'type_6',
    number: 6,
    category: 'diarrhea',
    titleKey: 'bristolGuide:type6.title',
    shapeDescKey: 'bristolGuide:type6.shapeDesc',
    transitTimeKey: 'bristolGuide:type6.transitTime',
    meaningKey: 'bristolGuide:type6.clinicalMeaning',
    actionTipKey: 'bristolGuide:type6.actionTip',
    statusKey: 'bristolGuide:status.diarrhea',
    bgColor: '#FFF7ED',
    borderColor: '#F97316',
    accentColor: '#EA580C',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
  },
  {
    type: 'type_7',
    number: 7,
    category: 'diarrhea',
    titleKey: 'bristolGuide:type7.title',
    shapeDescKey: 'bristolGuide:type7.shapeDesc',
    transitTimeKey: 'bristolGuide:type7.transitTime',
    meaningKey: 'bristolGuide:type7.clinicalMeaning',
    actionTipKey: 'bristolGuide:type7.actionTip',
    statusKey: 'bristolGuide:status.severeDiarrhea',
    bgColor: '#FEF2F2',
    borderColor: '#EF4444',
    accentColor: '#DC2626',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
  },
];

export const BristolGuideBottomSheet: React.FC<BristolGuideBottomSheetProps> = ({
  visible,
  selectedType,
  onSelectType,
  onClose,
}) => {
  const { t } = useTranslation(['bristolGuide', 'common']);
  const [activeTab, setActiveTab] = useState<TabCategory>('all');

  const handleSelect = (type: BristolType) => {
    if (onSelectType) onSelectType(type);
    onClose();
  };

  const filteredList = BRISTOL_DETAILS.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <BookOpen size={20} color="#7B61FF" />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.title}>{t('bristolGuide:title')}</Text>
                <Text style={styles.subtitle}>{t('bristolGuide:subtitle')}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={styles.closeIconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Educational Tip Banner */}
            <View style={styles.headerTipBox}>
              <View style={styles.headerTipIconWrapper}>
                <Lightbulb size={18} color="#7B61FF" />
              </View>
              <View style={styles.headerTipContent}>
                <Text style={styles.headerTipTitle}>{t('bristolGuide:headerTip.title')}</Text>
                <Text style={styles.headerTipDesc}>{t('bristolGuide:headerTip.desc')}</Text>
              </View>
            </View>

            {/* Category Filter Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContainer}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab('all')}
                style={[
                  styles.tabChip,
                  activeTab === 'all' && styles.tabChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    activeTab === 'all' && styles.tabChipTextActive,
                  ]}
                >
                  {t('bristolGuide:tabs.all')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab('constipation')}
                style={[
                  styles.tabChip,
                  activeTab === 'constipation' && styles.tabChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    activeTab === 'constipation' && styles.tabChipTextActive,
                  ]}
                >
                  {t('bristolGuide:tabs.constipation')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab('ideal')}
                style={[
                  styles.tabChip,
                  activeTab === 'ideal' && styles.tabChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    activeTab === 'ideal' && styles.tabChipTextActive,
                  ]}
                >
                  {t('bristolGuide:tabs.ideal')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActiveTab('diarrhea')}
                style={[
                  styles.tabChip,
                  activeTab === 'diarrhea' && styles.tabChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    activeTab === 'diarrhea' && styles.tabChipTextActive,
                  ]}
                >
                  {t('bristolGuide:tabs.diarrhea')}
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.promptBanner}>
              <Sparkles size={14} color="#7B61FF" />
              <Text style={styles.promptText}>{t('bristolGuide:selectPrompt')}</Text>
            </View>
          </View>

          {/* Stool List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {filteredList.map((item) => {
              const isSelected = selectedType === item.type;

              return (
                <TouchableOpacity
                  key={item.type}
                  activeOpacity={0.8}
                  onPress={() => handleSelect(item.type)}
                  style={[
                    styles.typeCard,
                    {
                      backgroundColor: item.bgColor,
                      borderColor: isSelected ? '#7B61FF' : item.borderColor,
                      borderWidth: isSelected ? 2.5 : 1,
                    },
                  ]}
                >
                  {/* Card Header with Badges */}
                  <View style={styles.cardHeader}>
                    <View style={styles.badgeGroup}>
                      <View
                        style={[
                          styles.numberPill,
                          isSelected && styles.numberPillSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.numberPillText,
                            isSelected && styles.numberPillTextSelected,
                          ]}
                        >
                          #{item.number}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: item.badgeBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: item.badgeText },
                          ]}
                        >
                          {t(item.statusKey)}
                        </Text>
                      </View>

                      {item.isIdeal && (
                        <View style={styles.idealBadge}>
                          <Text style={styles.idealBadgeText}>★ {t('bristolGuide:status.ideal')}</Text>
                        </View>
                      )}
                    </View>

                    {isSelected && (
                      <View style={styles.selectedIconWrapper}>
                        <CheckCircle2 size={20} color="#7B61FF" />
                      </View>
                    )}
                  </View>

                  {/* Title & Shape Description */}
                  <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
                  <Text style={styles.shapeDesc}>{t(item.shapeDescKey)}</Text>

                  {/* Clinical Breakdown Box */}
                  <View style={styles.clinicalBox}>
                    {/* Transit Time */}
                    <View style={styles.clinicalRow}>
                      <Clock size={14} color="#64748B" style={styles.clinicalIcon} />
                      <View style={styles.clinicalTextWrapper}>
                        <Text style={styles.clinicalLabel}>
                          {t('bristolGuide:labels.transit')}{' '}
                          <Text style={styles.clinicalValue}>{t(item.transitTimeKey)}</Text>
                        </Text>
                      </View>
                    </View>

                    {/* Meaning in UC */}
                    <View style={styles.clinicalRow}>
                      <Stethoscope size={14} color="#7B61FF" style={styles.clinicalIcon} />
                      <View style={styles.clinicalTextWrapper}>
                        <Text style={styles.clinicalLabel}>
                          {t('bristolGuide:labels.meaning')}{' '}
                          <Text style={styles.clinicalValue}>{t(item.meaningKey)}</Text>
                        </Text>
                      </View>
                    </View>

                    {/* Action Care Tip */}
                    <View style={styles.clinicalRow}>
                      <HeartPulse size={14} color="#10B981" style={styles.clinicalIcon} />
                      <View style={styles.clinicalTextWrapper}>
                        <Text style={styles.clinicalLabel}>
                          {t('bristolGuide:labels.care')}{' '}
                          <Text style={styles.clinicalValue}>{t(item.actionTipKey)}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>{t('bristolGuide:close')}</Text>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    maxHeight: '92%',
  },
  dragIndicator: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 1,
  },
  closeIconButton: {
    padding: 4,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  headerTipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8F9FE',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  headerTipIconWrapper: {
    marginTop: 2,
  },
  headerTipContent: {
    flex: 1,
  },
  headerTipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  headerTipDesc: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
    marginBottom: 10,
  },
  tabChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  tabChipActive: {
    backgroundColor: '#7B61FF',
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
  },
  promptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  promptText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7B61FF',
  },
  scrollContent: {
    paddingBottom: 16,
    gap: 12,
  },
  typeCard: {
    borderRadius: 22,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  numberPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  numberPillSelected: {
    backgroundColor: '#7B61FF',
  },
  numberPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  numberPillTextSelected: {
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  idealBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  idealBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectedIconWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  shapeDesc: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
  },
  clinicalBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 14,
    padding: 10,
    gap: 8,
  },
  clinicalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  clinicalIcon: {
    marginTop: 2,
  },
  clinicalTextWrapper: {
    flex: 1,
  },
  clinicalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    lineHeight: 16,
  },
  clinicalValue: {
    fontWeight: '400',
    color: '#1E293B',
  },
  footer: {
    paddingTop: 10,
  },
  closeButton: {
    height: 48,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});
