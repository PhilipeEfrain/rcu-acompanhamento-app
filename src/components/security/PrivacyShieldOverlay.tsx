import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Heart } from 'lucide-react-native';

interface PrivacyShieldOverlayProps {
  visible: boolean;
}

export const PrivacyShieldOverlay: React.FC<PrivacyShieldOverlayProps> = ({ visible }) => {
  const { t } = useTranslation('settings');

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={36} color="#8E63B8" />
        </View>
        <Text style={styles.title}>{t('privacyShieldMessage')}</Text>
        <View style={styles.badge}>
          <Heart size={14} color="#D85A7F" />
          <Text style={styles.badgeText}>RCU Care</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7F4FA',
    zIndex: 99999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 36,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F2E8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3142',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D85A7F',
  },
});
