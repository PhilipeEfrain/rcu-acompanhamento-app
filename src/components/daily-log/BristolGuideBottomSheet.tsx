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
import { BristolType } from '../../domain/health/types';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  X,
} from 'lucide-react-native';

interface BristolGuideBottomSheetProps {
  visible: boolean;
  selectedType: BristolType;
  onSelectType: (type: BristolType) => void;
  onClose: () => void;
}

interface BristolTypeDetail {
  type: BristolType;
  number: number;
  titleKey: string;
  meaningKey: string;
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
    titleKey: 'bristolGuide.type1.title',
    meaningKey: 'bristolGuide.type1.meaning',
    statusKey: 'bristolGuide.status.constipation',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    accentColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
  {
    type: 'type_2',
    number: 2,
    titleKey: 'bristolGuide.type2.title',
    meaningKey: 'bristolGuide.type2.meaning',
    statusKey: 'bristolGuide.status.mildConstipation',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    accentColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
  {
    type: 'type_3',
    number: 3,
    titleKey: 'bristolGuide.type3.title',
    meaningKey: 'bristolGuide.type3.meaning',
    statusKey: 'bristolGuide.status.normal',
    bgColor: '#F0FDF4',
    borderColor: '#10B981',
    accentColor: '#059669',
    badgeBg: '#DCFCE7',
    badgeText: '#047857',
  },
  {
    type: 'type_4',
    number: 4,
    titleKey: 'bristolGuide.type4.title',
    meaningKey: 'bristolGuide.type4.meaning',
    statusKey: 'bristolGuide.status.ideal',
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
    titleKey: 'bristolGuide.type5.title',
    meaningKey: 'bristolGuide.type5.meaning',
    statusKey: 'bristolGuide.status.mildDiarrhea',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
    accentColor: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
  },
  {
    type: 'type_6',
    number: 6,
    titleKey: 'bristolGuide.type6.title',
    meaningKey: 'bristolGuide.type6.meaning',
    statusKey: 'bristolGuide.status.diarrhea',
    bgColor: '#FFF7ED',
    borderColor: '#F97316',
    accentColor: '#EA580C',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
  },
  {
    type: 'type_7',
    number: 7,
    titleKey: 'bristolGuide.type7.title',
    meaningKey: 'bristolGuide.type7.meaning',
    statusKey: 'bristolGuide.status.severeDiarrhea',
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

  const handleSelect = (type: BristolType) => {
    onSelectType(type);
    onClose();
  };

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
            {BRISTOL_DETAILS.map((item) => {
              const isSelected = selectedType === item.type;

              return (
                <TouchableOpacity
                  key={item.type}
                  activeOpacity={0.75}
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

                  <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
                  <Text style={styles.cardMeaning}>{t(item.meaningKey)}</Text>
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
    maxHeight: '88%',
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
    marginBottom: 14,
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
  promptBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8F9FE',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promptText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7B61FF',
  },
  scrollContent: {
    paddingBottom: 16,
    gap: 12,
  },
  typeCard: {
    borderRadius: 20,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardMeaning: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
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
