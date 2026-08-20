import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Check,
  Clock,
  Pill,
  Plus,
  Settings,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';
import { DailyMedicationDoseItem } from '../../domain/medications/types';

interface DailyMedicationTrackerProps {
  date: string;
  items: DailyMedicationDoseItem[];
  onToggleTaken: (medicationId: string, doseIndex: number, scheduledTime?: string) => void;
  onOpenManager: () => void;
  onAddNew: () => void;
  onOpenCareGuide?: () => void;
  style?: object;
}

export const DailyMedicationTracker: React.FC<DailyMedicationTrackerProps> = ({
  date,
  items,
  onToggleTaken,
  onOpenManager,
  onAddNew,
  onOpenCareGuide,
  style,
}) => {
  const { t } = useTranslation('medications');

  const totalCount = items.length;
  const takenCount = items.filter((i) => i.isTaken).length;
  const pendingCount = totalCount - takenCount;
  const isAllTaken = totalCount > 0 && pendingCount === 0;

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Pill size={18} color="#7B61FF" />
          </View>
          <View>
            <Text style={styles.title}>{t('dailyCard.title')}</Text>
            <Text style={styles.subtitle}>{t('dailyCard.subtitle')}</Text>
          </View>
        </View>

        {totalCount > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenManager}
            style={styles.manageButton}
          >
            <Settings size={14} color="#64748B" />
            <Text style={styles.manageButtonText}>
              {t('dailyCard.manageButton')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress / Status Badge */}
      {totalCount > 0 && (
        <View
          style={[
            styles.statusBanner,
            isAllTaken ? styles.statusBannerAllTaken : styles.statusBannerPending,
          ]}
        >
          {isAllTaken ? (
            <View style={styles.statusContent}>
              <Sparkles size={14} color="#166534" />
              <Text style={styles.statusTextAllTaken}>
                {t('dailyCard.allTaken')}
              </Text>
            </View>
          ) : (
            <View style={styles.statusContent}>
              <Clock size={14} color="#92400E" />
              <Text style={styles.statusTextPending}>
                {t('dailyCard.pending', { count: pendingCount })}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Medication Pills List */}
      {totalCount === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('dailyCard.emptyTitle')}</Text>
          <Text style={styles.emptyDesc}>{t('dailyCard.emptyDesc')}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAddNew}
            style={styles.addFirstButton}
          >
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addFirstButtonText}>
              {t('dailyCard.addFirst')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.pillsList}>
          {items.map((item) => {
            const med = item.medication;
            const isTaken = item.isTaken;
            const isMultiDose = item.totalDosesForDay > 1;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => onToggleTaken(med.id, item.doseIndex, item.scheduledTime)}
                style={[
                  styles.pillCard,
                  isTaken ? styles.pillCardTaken : styles.pillCardPending,
                ]}
              >
                {/* Left check circle */}
                <View
                  style={[
                    styles.checkCircle,
                    isTaken ? styles.checkCircleTaken : styles.checkCirclePending,
                  ]}
                >
                  {isTaken ? (
                    <Check size={14} color="#FFFFFF" />
                  ) : (
                    <Pill size={12} color="#7B61FF" />
                  )}
                </View>

                {/* Medication Info */}
                <View style={styles.pillInfo}>
                  <View style={styles.nameRow}>
                    <Text
                      style={[
                        styles.medName,
                        isTaken && styles.medNameTaken,
                      ]}
                    >
                      {med.name}
                    </Text>
                    {isMultiDose && (
                      <View style={styles.multiDoseChip}>
                        <Text style={styles.multiDoseChipText}>
                          {t('dailyCard.doseLabel', {
                            current: item.doseIndex + 1,
                            total: item.totalDosesForDay,
                          })}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.medDosage}>{med.dosage}</Text>
                    {item.scheduledTime && (
                      <View style={styles.timeTag}>
                        <Clock size={10} color="#7B61FF" />
                        <Text style={styles.timeText}>{item.scheduledTime}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Status indicator badge */}
                <View
                  style={[
                    styles.actionBadge,
                    isTaken ? styles.actionBadgeTaken : styles.actionBadgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.actionBadgeText,
                      isTaken ? styles.actionBadgeTextTaken : styles.actionBadgeTextPending,
                    ]}
                  >
                    {isTaken ? t('dailyCard.taken') : t('dailyCard.toTake')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Care Guide / SUS Quick Link */}
      {onOpenCareGuide && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenCareGuide}
          style={styles.careGuideBanner}
        >
          <View style={styles.careGuideBannerLeft}>
            <BookOpen size={14} color="#7C3AED" />
            <Text style={styles.careGuideBannerText}>
              💡 {t('careGuide:susSection.title', { defaultValue: 'Como conseguir remédios pelo SUS e Farmácia de Alto Custo' })}
            </Text>
          </View>
          <ChevronRight size={14} color="#7C3AED" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0EFF5',
    shadowColor: '#1E202B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E202B',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  manageButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  statusBanner: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  statusBannerAllTaken: {
    backgroundColor: '#E6F9F0',
  },
  statusBannerPending: {
    backgroundColor: '#FEF3C7',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusTextAllTaken: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  statusTextPending: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  emptyContainer: {
    backgroundColor: '#F8F9FE',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D8FD',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4C1D95',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 16,
  },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7B61FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  addFirstButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pillsList: {
    gap: 8,
  },
  pillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  pillCardPending: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D8FD',
  },
  pillCardTaken: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkCirclePending: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#7B61FF',
  },
  checkCircleTaken: {
    backgroundColor: '#10B981',
  },
  pillInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E202B',
  },
  medNameTaken: {
    color: '#166534',
  },
  multiDoseChip: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  multiDoseChipText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#7B61FF',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  medDosage: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  actionBadgePending: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  actionBadgeTaken: {
    backgroundColor: '#DCFCE7',
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionBadgeTextPending: {
    color: '#7B61FF',
  },
  actionBadgeTextTaken: {
    color: '#166534',
  },
  careGuideBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  careGuideBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  careGuideBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6D28D9',
    flex: 1,
  },
});
