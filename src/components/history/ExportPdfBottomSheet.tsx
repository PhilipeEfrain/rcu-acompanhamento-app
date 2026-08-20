import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  HeartPulse,
  Share2,
  Sparkles,
  X,
} from 'lucide-react-native';
import {
  calculateReportStats,
  generateAndShareClinicalReport,
  ReportStats,
} from '../../domain/health/reportGenerator';

interface ExportPdfBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const ExportPdfBottomSheet: React.FC<ExportPdfBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation(['clinicalReport', 'common']);
  const [selectedDays, setSelectedDays] = useState<15 | 30 | 90>(30);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!visible) return;

    let isMounted = true;
    async function loadStats() {
      setIsLoadingStats(true);
      try {
        const res = await calculateReportStats(selectedDays);
        if (isMounted) setStats(res);
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) setIsLoadingStats(false);
      }
    }

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [visible, selectedDays]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateAndShareClinicalReport(selectedDays, t);
      onClose();
    } catch {
      Alert.alert(t('common:error'), t('clinicalReport:errorGenerating'));
    } finally {
      setIsGenerating(false);
    }
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
                <FileSpreadsheet size={22} color="#7B61FF" />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.title}>{t('clinicalReport:title')}</Text>
                <Text style={styles.subtitle}>{t('clinicalReport:subtitle')}</Text>
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
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Period Selector Pills */}
            <Text style={styles.sectionLabel}>
              {t('clinicalReport:selectPeriod')}
            </Text>

            <View style={styles.pillsRow}>
              {([15, 30, 90] as const).map((days) => {
                const isSelected = selectedDays === days;
                const key = `days${days}` as 'days15' | 'days30' | 'days90';

                return (
                  <TouchableOpacity
                    key={days}
                    activeOpacity={0.75}
                    onPress={() => setSelectedDays(days)}
                    style={[
                      styles.periodPill,
                      isSelected && styles.periodPillActive,
                    ]}
                  >
                    {isSelected && <CheckCircle2 size={14} color="#FFFFFF" />}
                    <Text
                      style={[
                        styles.periodPillText,
                        isSelected && styles.periodPillTextActive,
                      ]}
                    >
                      {t(`clinicalReport:periods.${key}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Preview Summary Card */}
            <View style={styles.previewCard}>
              <View style={styles.previewCardHeader}>
                <Sparkles size={16} color="#7B61FF" />
                <Text style={styles.previewCardTitle}>
                  {t('clinicalReport:summaryCard.title')}
                </Text>
              </View>

              {isLoadingStats ? (
                <View style={styles.loadingStatsBox}>
                  <ActivityIndicator color="#7B61FF" size="small" />
                </View>
              ) : stats ? (
                <View style={styles.statsBody}>
                  <View style={styles.dateRangeRow}>
                    <Calendar size={14} color="#64748B" />
                    <Text style={styles.dateRangeText}>
                      {t('clinicalReport:summaryCard.dateRange', {
                        start: stats.startDate,
                        end: stats.endDate,
                      })}
                    </Text>
                  </View>

                  <View style={styles.metricsGrid}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>{stats.totalLogs}</Text>
                      <Text style={styles.metricDesc}>
                        {t('clinicalReport:pdf.totalMovements')}
                      </Text>
                    </View>

                    <View style={styles.metricItem}>
                      <Text style={styles.metricVal}>{stats.dailyAverage}</Text>
                      <Text style={styles.metricDesc}>
                        {t('clinicalReport:pdf.dailyAverage')}
                      </Text>
                    </View>

                    <View style={styles.metricItem}>
                      <Text
                        style={[
                          styles.metricVal,
                          { color: stats.bloodCount > 0 ? '#EF4444' : '#10B981' },
                        ]}
                      >
                        {stats.bloodPercentage}
                      </Text>
                      <Text style={styles.metricDesc}>
                        {t('clinicalReport:pdf.bloodIncidence')}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text style={styles.noDataText}>
                  {t('clinicalReport:summaryCard.noData')}
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGenerate}
              disabled={isGenerating || isLoadingStats}
              style={[
                styles.generateButton,
                (isGenerating || isLoadingStats) && styles.generateButtonDisabled,
              ]}
            >
              {isGenerating ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.generateButtonText}>
                    {t('clinicalReport:generating')}
                  </Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Share2 size={18} color="#FFFFFF" />
                  <Text style={styles.generateButtonText}>
                    {t('clinicalReport:generateButton')}
                  </Text>
                </View>
              )}
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
    marginBottom: 14,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  closeIconButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  periodPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#F8F9FE',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  periodPillActive: {
    backgroundColor: '#7B61FF',
    borderColor: '#7B61FF',
  },
  periodPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  periodPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  previewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  previewCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4C1D95',
  },
  loadingStatsBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  statsBody: {
    gap: 10,
  },
  dateRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateRangeText: {
    fontSize: 12,
    color: '#64748B',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3E8FF',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7B61FF',
  },
  metricDesc: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  footer: {
    paddingTop: 8,
  },
  generateButton: {
    backgroundColor: '#7B61FF',
    height: 54,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  generateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
