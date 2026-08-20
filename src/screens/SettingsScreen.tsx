import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Globe,
  Shield,
  Fingerprint,
  EyeOff,
  Download,
  Trash2,
  Heart,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react-native';
import { biometricService } from '../security/biometricService';
import { symptomRepository } from '../storage/symptomRepository';
import { ExportPdfBottomSheet } from '../components/history/ExportPdfBottomSheet';

export const SettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation(['settings', 'clinicalReport']);
  const insets = useSafeAreaInsets();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [isExportPdfOpen, setIsExportPdfOpen] = useState(false);

  useEffect(() => {
    async function loadBiometricsState() {
      const available = await biometricService.isHardwareAvailable();
      setBiometricsAvailable(available);
      const enabled = await biometricService.isBiometricsEnabled();
      setBiometricsEnabled(enabled);
    }
    loadBiometricsState();
  }, []);

  const handleLanguageChange = (lang: 'pt-BR' | 'en-US') => {
    i18n.changeLanguage(lang);
  };

  const handleToggleBiometrics = async (value: boolean) => {
    if (value) {
      const authenticated = await biometricService.authenticate(t('biometricsTitle'));
      if (authenticated) {
        await biometricService.setBiometricsEnabled(true);
        setBiometricsEnabled(true);
        Alert.alert(t('common:success', { defaultValue: 'Sucesso' }), t('biometricsEnabledAlert'));
      } else {
        setBiometricsEnabled(false);
      }
    } else {
      await biometricService.setBiometricsEnabled(false);
      setBiometricsEnabled(false);
      Alert.alert(t('common:success', { defaultValue: 'Sucesso' }), t('biometricsDisabledAlert'));
    }
  };

  const handleExportData = async () => {
    try {
      const logs = await symptomRepository.getAllLogs();
      const exportJson = JSON.stringify(logs, null, 2);

      if (Platform.OS === 'web') {
        const blob = new Blob([exportJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rcu_care_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        Alert.alert('Backup JSON', `Total de registros exportados: ${logs.length}`);
      }
    } catch {
      Alert.alert(t('common:error', { defaultValue: 'Erro' }), 'Falha ao exportar registros.');
    }
  };

  const handleWipeData = () => {
    Alert.alert(
      t('wipeConfirmTitle'),
      t('wipeConfirmMessage'),
      [
        { text: t('common:cancel', { defaultValue: 'Cancelar' }), style: 'cancel' },
        {
          text: t('wipeDataTitle'),
          style: 'destructive',
          onPress: async () => {
            await symptomRepository.clearAll();
            Alert.alert(t('common:success', { defaultValue: 'Sucesso' }), t('wipeSuccess'));
          },
        },
      ]
    );
  };

  const isPt = i18n.language.startsWith('pt');

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingTop: 12,
            paddingBottom: 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('title')}</Text>
          <Text style={styles.subtitle}>{t('subtitle')}</Text>
        </View>

        {/* Section: Language */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color="#8E63B8" />
            <Text style={styles.sectionTitle}>{t('languageSection')}</Text>
          </View>
          <Text style={styles.sectionDesc}>{t('languageDesc')}</Text>

          <View style={styles.languageButtonsRow}>
            <TouchableOpacity
              style={[styles.langButton, isPt && styles.langButtonActive]}
              onPress={() => handleLanguageChange('pt-BR')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langButtonText, isPt && styles.langButtonTextActive]}>
                🇧🇷 Português (BR)
              </Text>
              {isPt && <CheckCircle size={16} color="#8E63B8" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.langButton, !isPt && styles.langButtonActive]}
              onPress={() => handleLanguageChange('en-US')}
              activeOpacity={0.8}
            >
              <Text style={[styles.langButtonText, !isPt && styles.langButtonTextActive]}>
                🇺🇸 English (US)
              </Text>
              {!isPt && <CheckCircle size={16} color="#8E63B8" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Security & Privacy */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#8E63B8" />
            <Text style={styles.sectionTitle}>{t('securitySection')}</Text>
          </View>

          {/* Biometrics Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingLabelRow}>
                <Fingerprint size={18} color="#2D3142" />
                <Text style={styles.settingLabel}>{t('biometricsTitle')}</Text>
              </View>
              <Text style={styles.settingSubLabel}>
                {biometricsAvailable ? t('biometricsDesc') : t('biometricsNotAvailable')}
              </Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={handleToggleBiometrics}
              disabled={!biometricsAvailable}
              trackColor={{ false: '#E2E8F0', true: '#D6BCFA' }}
              thumbColor={biometricsEnabled ? '#8E63B8' : '#CBD5E1'}
            />
          </View>

          {/* Privacy Shield Info */}
          <View style={[styles.settingRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.settingInfo}>
              <View style={styles.settingLabelRow}>
                <EyeOff size={18} color="#2D3142" />
                <Text style={styles.settingLabel}>{t('privacyShieldTitle')}</Text>
              </View>
              <Text style={styles.settingSubLabel}>{t('privacyShieldDesc')}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{t('privacyShieldActive')}</Text>
            </View>
          </View>
        </View>

        {/* Section: Data Management (LGPD / HIPAA) */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Download size={20} color="#8E63B8" />
            <Text style={styles.sectionTitle}>{t('settings:dataSection')}</Text>
          </View>

          {/* Export Clinical PDF */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => setIsExportPdfOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: '#7B61FF', fontWeight: '700' }]}>
                {t('clinicalReport:title')}
              </Text>
              <Text style={styles.actionDesc}>
                {t('clinicalReport:subtitle')}
              </Text>
            </View>
            <FileSpreadsheet size={18} color="#7B61FF" />
          </TouchableOpacity>

          {/* Export JSON */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleExportData}
            activeOpacity={0.7}
          >
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>{t('settings:exportDataTitle')}</Text>
              <Text style={styles.actionDesc}>{t('settings:exportDataDesc')}</Text>
            </View>
            <Download size={18} color="#8E63B8" />
          </TouchableOpacity>

          {/* Wipe Data */}
          <TouchableOpacity
            style={[styles.actionRow, { borderBottomWidth: 0, paddingBottom: 0 }]}
            onPress={handleWipeData}
            activeOpacity={0.7}
          >
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: '#E53E3E' }]}>{t('settings:wipeDataTitle')}</Text>
              <Text style={styles.actionDesc}>{t('settings:wipeDataDesc')}</Text>
            </View>
            <Trash2 size={18} color="#E53E3E" />
          </TouchableOpacity>
        </View>

        {/* Section: About */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <Heart size={20} color="#D85A7F" />
            <Text style={styles.aboutTitle}>RCU Care</Text>
          </View>
          <Text style={styles.aboutText}>{t('settings:aboutDesc')}</Text>
        </View>
      </ScrollView>

      <ExportPdfBottomSheet
        visible={isExportPdfOpen}
        onClose={() => setIsExportPdfOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E202B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3142',
  },
  sectionDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
    lineHeight: 18,
  },
  languageButtonsRow: {
    gap: 10,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FC',
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  langButtonActive: {
    borderColor: '#8E63B8',
    backgroundColor: '#FAF5FF',
  },
  langButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  langButtonTextActive: {
    color: '#8E63B8',
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF5',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3142',
  },
  settingSubLabel: {
    fontSize: 12,
    color: '#8E94A0',
    lineHeight: 16,
  },
  statusPill: {
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#276749',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF5',
  },
  actionInfo: {
    flex: 1,
    marginRight: 16,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3142',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
    color: '#8E94A0',
    lineHeight: 16,
  },
  aboutCard: {
    backgroundColor: '#FFF5F8',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE4EE',
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D85A7F',
  },
  aboutText: {
    fontSize: 13,
    color: '#702459',
    lineHeight: 18,
  },
});
