import React from 'react';
import {
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
  Clock,
  Edit3,
  Pill,
  PlayCircle,
  Plus,
  PowerOff,
  Trash2,
  X,
} from 'lucide-react-native';
import { Medication } from '../../domain/medications/types';

interface MedicationManagerBottomSheetProps {
  visible: boolean;
  medications: Medication[];
  onAddNew: () => void;
  onEdit: (med: Medication) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const MedicationManagerBottomSheet: React.FC<MedicationManagerBottomSheetProps> = ({
  visible,
  medications,
  onAddNew,
  onEdit,
  onToggleActive,
  onDelete,
  onClose,
}) => {
  const { t } = useTranslation('medications');

  const activeMeds = medications.filter((m) => m.active);
  const inactiveMeds = medications.filter((m) => !m.active);

  const handleDeletePress = (med: Medication) => {
    Alert.alert(
      t('manager.deleteConfirmTitle'),
      t('manager.deleteConfirmMessage'),
      [
        { text: t('form.cancel'), style: 'cancel' },
        {
          text: t('manager.delete'),
          style: 'destructive',
          onPress: () => onDelete(med.id),
        },
      ]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Pill size={20} color="#7B61FF" />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.title}>{t('manager.title')}</Text>
                <Text style={styles.subtitle}>{t('manager.subtitle')}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClose}
                style={styles.closeIconButton}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Add New Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onAddNew}
              style={styles.addButton}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>{t('manager.addNew')}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Active List */}
            <Text style={styles.sectionHeader}>
              {t('manager.activeList', { count: activeMeds.length })}
            </Text>

            {activeMeds.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>{t('manager.emptyActive')}</Text>
              </View>
            ) : (
              <View style={styles.cardsList}>
                {activeMeds.map((med) => (
                  <View key={med.id} style={styles.medCard}>
                    <View style={styles.medCardTop}>
                      <View style={styles.medMainInfo}>
                        <Text style={styles.medCardName}>{med.name}</Text>
                        <Text style={styles.medCardDosage}>{med.dosage}</Text>
                      </View>
                      <View style={styles.cardActions}>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => onEdit(med)}
                          activeOpacity={0.7}
                        >
                          <Edit3 size={15} color="#7B61FF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionIconBtn}
                          onPress={() => onToggleActive(med.id, false)}
                          activeOpacity={0.7}
                        >
                          <PowerOff size={15} color="#F59E0B" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionIconBtn, styles.deleteBtn]}
                          onPress={() => handleDeletePress(med)}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={15} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Meta Row */}
                    <View style={styles.medMetaRow}>
                      <Text style={styles.frequencyBadge}>
                        {t(`form.frequencies.${med.frequency}`)}
                      </Text>
                      {med.times && med.times.length > 0 ? (
                        <View style={styles.timeBadge}>
                          <Clock size={11} color="#7B61FF" />
                          <Text style={styles.timeBadgeText}>{med.times.join(' • ')}</Text>
                        </View>
                      ) : med.time ? (
                        <View style={styles.timeBadge}>
                          <Clock size={11} color="#7B61FF" />
                          <Text style={styles.timeBadgeText}>{med.time}</Text>
                        </View>
                      ) : null}
                    </View>

                    {med.instructions && (
                      <Text style={styles.instructionsText}>
                        💡 {med.instructions}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Inactive List (if any) */}
            {inactiveMeds.length > 0 && (
              <>
                <Text style={[styles.sectionHeader, { marginTop: 18 }]}>
                  {t('manager.inactiveList', { count: inactiveMeds.length })}
                </Text>
                <View style={styles.cardsList}>
                  {inactiveMeds.map((med) => (
                    <View key={med.id} style={[styles.medCard, styles.inactiveCard]}>
                      <View style={styles.medCardTop}>
                        <View style={styles.medMainInfo}>
                          <Text style={[styles.medCardName, styles.inactiveText]}>
                            {med.name}
                          </Text>
                          <Text style={styles.medCardDosage}>{med.dosage}</Text>
                        </View>
                        <View style={styles.cardActions}>
                          <TouchableOpacity
                            style={[styles.actionIconBtn, { backgroundColor: '#E6F9F0' }]}
                            onPress={() => onToggleActive(med.id, true)}
                            activeOpacity={0.7}
                          >
                            <PlayCircle size={15} color="#10B981" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.actionIconBtn, styles.deleteBtn]}
                            onPress={() => handleDeletePress(med)}
                            activeOpacity={0.7}
                          >
                            <Trash2 size={15} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
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
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    maxHeight: '88%',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    marginBottom: 16,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 17,
    fontWeight: '700',
    color: '#1E202B',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  closeIconButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#7B61FF',
    paddingVertical: 12,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  emptyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  cardsList: {
    gap: 8,
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  inactiveCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.8,
  },
  medCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medMainInfo: {
    flex: 1,
  },
  medCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E202B',
  },
  inactiveText: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  medCardDosage: {
    fontSize: 12,
    color: '#7B61FF',
    fontWeight: '600',
    marginTop: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  medMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  frequencyBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 10,
    color: '#7B61FF',
    fontWeight: '600',
  },
  instructionsText: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
