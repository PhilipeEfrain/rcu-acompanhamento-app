import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Activity, Droplet, Flame, FileText, Clock, Edit3, Trash2, Brain, ShieldAlert, Sparkles, Zap } from 'lucide-react-native';
import { DailySymptomEntry } from '../../domain/health/types';

interface BowelMovementCardProps {
  entry: DailySymptomEntry;
  index: number;
  onEdit: (entry: DailySymptomEntry) => void;
  onDelete: (id: string) => void;
}

export const BowelMovementCard: React.FC<BowelMovementCardProps> = ({
  entry,
  index,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation(['dailyLog', 'clinicalExtras', 'common']);

  const handleDeletePress = () => {
    Alert.alert(
      t('dailyLog:deletePromptTitle'),
      t('dailyLog:deletePromptMessage'),
      [
        { text: t('common:cancel', { defaultValue: 'Cancelar' }), style: 'cancel' },
        {
          text: t('common:confirm', { defaultValue: 'Confirmar' }),
          style: 'destructive',
          onPress: () => {
            if (entry.id) onDelete(entry.id);
          },
        },
      ]
    );
  };

  // Severity-based pill color
  let severityBg = '#E6F9F0';
  let severityTextColor = '#276749';
  let statusKey = 'status.remission';

  if (entry.severity === 'mild_activity') {
    severityBg = '#FEF3C7';
    severityTextColor = '#92400E';
    statusKey = 'status.mild_activity';
  } else if (entry.severity === 'moderate_to_severe_flare') {
    severityBg = '#FEE2E2';
    severityTextColor = '#991B1B';
    statusKey = 'status.moderate_to_severe_flare';
  }

  const hasExtraBiomarkers =
    entry.stressLevel !== undefined ||
    entry.hasClots ||
    (entry.mucusPresence && entry.mucusPresence !== 'none') ||
    (entry.urgencyLevel && entry.urgencyLevel !== 'normal');

  return (
    <View style={styles.card}>
      {/* Top Row: Episode Number + Time + Actions */}
      <View style={styles.topRow}>
        <View style={styles.leftMeta}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>
              {t('dailyLog:entryNumber', { number: index + 1 })}
            </Text>
          </View>

          {entry.time && (
            <View style={styles.timeBadge}>
              <Clock size={13} color="#6B7280" />
              <Text style={styles.timeText}>{entry.time}</Text>
            </View>
          )}

          <View style={[styles.statusBadge, { backgroundColor: severityBg }]}>
            <Text style={[styles.statusBadgeText, { color: severityTextColor }]}>
              {t(statusKey, { ns: 'common' })}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => onEdit(entry)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={t('dailyLog:actions.update')}
          >
            <Edit3 size={15} color="#8E63B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, styles.deleteButton]}
            onPress={handleDeletePress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Excluir"
          >
            <Trash2 size={15} color="#E53E3E" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Core Metrics Row */}
      <View style={styles.metricsRow}>
        {/* Bristol */}
        <View style={styles.metricChip}>
          <Activity size={14} color="#8E63B8" />
          <Text style={styles.metricChipText}>
            {t(`dailyLog:bristol.${entry.bristolType}.label`)}
          </Text>
        </View>

        {/* Blood */}
        <View style={[styles.metricChip, { backgroundColor: '#FFF0F5' }]}>
          <Droplet size={14} color="#D85A7F" />
          <Text style={[styles.metricChipText, { color: '#B83280' }]}>
            {t(`dailyLog:blood.${entry.bloodPresence}`)}
          </Text>
        </View>

        {/* Pain */}
        <View style={[styles.metricChip, { backgroundColor: '#FEF3C7' }]}>
          <Flame size={14} color="#D97706" />
          <Text style={[styles.metricChipText, { color: '#B45309' }]}>
            {t('dailyLog:pain.score_label', { score: entry.painLevel })}
          </Text>
        </View>
      </View>

      {/* Extended Biomarkers Chips (if present) */}
      {hasExtraBiomarkers && (
        <View style={styles.extraChipsRow}>
          {entry.hasClots ? (
            <View style={[styles.extraChip, { backgroundColor: '#FFF5F5' }]}>
              <ShieldAlert size={12} color="#E53E3E" />
              <Text style={[styles.extraChipText, { color: '#E53E3E' }]}>
                {t('clinicalExtras:clots.yes')}
              </Text>
            </View>
          ) : null}

          {entry.mucusPresence && entry.mucusPresence !== 'none' ? (
            <View style={[styles.extraChip, { backgroundColor: '#E6F9F0' }]}>
              <Sparkles size={12} color="#276749" />
              <Text style={[styles.extraChipText, { color: '#276749' }]}>
                {t(`clinicalExtras:mucus.${entry.mucusPresence}`)}
              </Text>
            </View>
          ) : null}

          {entry.urgencyLevel && entry.urgencyLevel !== 'normal' ? (
            <View style={[styles.extraChip, { backgroundColor: '#FEF3C7' }]}>
              <Zap size={12} color="#92400E" />
              <Text style={[styles.extraChipText, { color: '#92400E' }]}>
                {t(`clinicalExtras:urgency.${entry.urgencyLevel}`)}
              </Text>
            </View>
          ) : null}

          {entry.stressLevel !== undefined && entry.stressLevel !== null ? (
            <View style={[styles.extraChip, { backgroundColor: '#FAF5FF' }]}>
              <Brain size={12} color="#8E63B8" />
              <Text style={[styles.extraChipText, { color: '#8E63B8' }]}>
                {t('clinicalExtras:stress.scoreLabel', { score: entry.stressLevel })}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Notes if any */}
      {entry.notes ? (
        <View style={styles.notesBox}>
          <FileText size={13} color="#8E94A0" />
          <Text style={styles.notesText}>{entry.notes}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0EFF5',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  numberBadge: {
    backgroundColor: '#F3EEFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E63B8',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8F9FC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FAF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  deleteButton: {
    backgroundColor: '#FFF5F5',
    borderColor: '#FED7D7',
  },
  metricsRow: {
    flexDirection: 'column',
    gap: 6,
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF9FC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 8,
  },
  metricChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3142',
    flex: 1,
  },
  extraChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  extraChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  extraChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F4F3F8',
  },
  notesText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
    flex: 1,
  },
});
