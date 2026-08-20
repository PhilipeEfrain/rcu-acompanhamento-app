import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Clipboard from 'expo-clipboard';
import {
  Heart,
  Copy,
  Check,
  Coffee,
  Code2,
  Sparkles,
  ShieldCheck,
  X,
  QrCode,
} from 'lucide-react-native';
import { APP_CONFIG } from '../../config/appConfig';

interface TipJarBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const TipJarBottomSheet: React.FC<TipJarBottomSheetProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation(['tipJar', 'common']);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyPix = async () => {
    try {
      await Clipboard.setStringAsync(APP_CONFIG.donations.pixKey);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleOpenLink = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {});
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
            <View style={styles.iconCircle}>
              <Heart size={22} color="#7B61FF" fill="#EDE9FE" />
            </View>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>{t('tipJar:title')}</Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {t('tipJar:subtitle')}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Content Scroll */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentScroll}
          >
            {/* Philosophy Box */}
            <View style={styles.philosophyBox}>
              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <ShieldCheck size={14} color="#166534" />
                  <Text style={styles.badgeText}>
                    {t('tipJar:philosophyBadge')}
                  </Text>
                </View>
              </View>
              <Text style={styles.philosophyTitle}>
                {t('tipJar:philosophyTitle')}
              </Text>
              <Text style={styles.philosophyDesc}>
                {t('tipJar:philosophyDesc')}
              </Text>
            </View>

            {/* PIX Donation Card (Brazil) */}
            <View style={styles.pixCard}>
              <View style={styles.pixCardHeader}>
                <View style={styles.pixIconWrapper}>
                  <QrCode size={20} color="#0D9488" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pixSectionTitle}>
                    {t('tipJar:pixSectionTitle')}
                  </Text>
                  <Text style={styles.pixSectionDesc}>
                    {t('tipJar:pixSectionDesc')}
                  </Text>
                </View>
              </View>

              <View style={styles.pixKeyBox}>
                <View>
                  <Text style={styles.pixKeyLabel}>
                    {t('tipJar:pixKeyLabel')}
                  </Text>
                  <Text style={styles.pixKeyValue} selectable>
                    {APP_CONFIG.donations.pixKey}
                  </Text>
                  <Text style={styles.pixRecipientText}>
                    {t('tipJar:pixRecipientLabel')}{' '}
                    <Text style={{ fontWeight: '700' }}>
                      {APP_CONFIG.donations.pixRecipientName}
                    </Text>
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCopyPix}
                  style={[
                    styles.copyButton,
                    isCopied && styles.copyButtonSuccess,
                  ]}
                >
                  {isCopied ? (
                    <>
                      <Check size={18} color="#FFFFFF" />
                      <Text style={styles.copyButtonText}>
                        {t('tipJar:copiedPixToast')}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Copy size={18} color="#FFFFFF" />
                      <Text style={styles.copyButtonText}>
                        {t('tipJar:copyPixButton')}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.pasteTip}>{t('tipJar:pasteInBankTip')}</Text>
            </View>

            {/* International / Alternate Support */}
            <View style={styles.externalSection}>
              <Text style={styles.externalTitle}>
                {t('tipJar:internationalTitle')}
              </Text>
              <Text style={styles.externalDesc}>
                {t('tipJar:internationalDesc')}
              </Text>

              <View style={styles.buttonRow}>
                {APP_CONFIG.donations.buyMeACoffeeUrl ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      handleOpenLink(APP_CONFIG.donations.buyMeACoffeeUrl)
                    }
                    style={styles.coffeeButton}
                  >
                    <Coffee size={18} color="#92400E" />
                    <Text style={styles.coffeeButtonText}>
                      {t('tipJar:buyMeCoffeeButton')}
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {APP_CONFIG.donations.githubRepoUrl ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      handleOpenLink(APP_CONFIG.donations.githubRepoUrl)
                    }
                    style={styles.githubButton}
                  >
                    <Code2 size={18} color="#0F172A" />
                    <Text style={styles.githubButtonText}>
                      {t('tipJar:githubSponsorsButton')}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* Thank You Note */}
            <View style={styles.thankYouCard}>
              <Sparkles size={20} color="#7B61FF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.thankYouTitle}>
                  {t('tipJar:thankYouTitle')}
                </Text>
                <Text style={styles.thankYouDesc}>
                  {t('tipJar:thankYouDesc')}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Close Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={styles.closeFooterButton}
            >
              <Text style={styles.closeFooterButtonText}>
                {t('tipJar:actions.close')}
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  contentScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  philosophyBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    textTransform: 'uppercase',
  },
  philosophyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#14532D',
  },
  philosophyDesc: {
    fontSize: 13,
    color: '#166534',
    lineHeight: 19,
  },
  pixCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#99F6E4',
    gap: 12,
  },
  pixCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pixIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  pixSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#115E59',
  },
  pixSectionDesc: {
    fontSize: 12,
    color: '#0F766E',
    marginTop: 2,
    lineHeight: 17,
  },
  pixKeyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 12,
  },
  pixKeyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pixKeyValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  pixRecipientText: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 4,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0D9488',
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  copyButtonSuccess: {
    backgroundColor: '#16A34A',
    shadowColor: '#16A34A',
  },
  copyButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pasteTip: {
    fontSize: 11.5,
    color: '#0F766E',
    fontStyle: 'italic',
  },
  externalSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  externalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  externalDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  buttonRow: {
    gap: 8,
    marginTop: 4,
  },
  coffeeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  coffeeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  githubButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  githubButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  thankYouCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  thankYouTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 4,
  },
  thankYouDesc: {
    fontSize: 12.5,
    color: '#6D28D9',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  closeFooterButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeFooterButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});
