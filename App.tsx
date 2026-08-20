import React, { useState, useEffect } from 'react';
import { StyleSheet, View, AppState, AppStateStatus } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import './src/locales/i18n';

import { DailyLogScreen } from './src/screens/DailyLogScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BottomTabBar, AppTab } from './src/components/navigation/BottomTabBar';
import { PrivacyShieldOverlay } from './src/components/security/PrivacyShieldOverlay';
import { BiometricLockScreen } from './src/components/security/BiometricLockScreen';
import { biometricService } from './src/security/biometricService';

function MainApp() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [isShieldVisible, setIsShieldVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Check biometrics lock on startup
  useEffect(() => {
    async function checkLockOnStart() {
      const isEnabled = await biometricService.isBiometricsEnabled();
      if (isEnabled) {
        setIsLocked(true);
      }
    }
    checkLockOnStart();
  }, []);

  // Monitor AppState for Privacy Shield & Biometric Lock on backgrounding
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        setIsShieldVisible(true);
        const isEnabled = await biometricService.isBiometricsEnabled();
        if (isEnabled) {
          setIsLocked(true);
        }
      } else if (nextAppState === 'active') {
        setIsShieldVisible(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);

  const handleUnlock = async () => {
    const success = await biometricService.authenticate('Desbloquear RCU Care');
    if (success) {
      setIsLocked(false);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Barra de Área Segura Superior 100% Sólida e Opaca */}
      <View style={[styles.topSafeAreaFill, { height: insets.top }]} />

      <View style={styles.content}>
        {activeTab === 'today' && <DailyLogScreen />}
        {activeTab === 'history' && (
          <HistoryScreen onNavigateToToday={() => setActiveTab('today')} />
        )}
        {activeTab === 'settings' && <SettingsScreen />}
      </View>

      {/* Menu / Barra de Navegação Inferior Separada */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Barra de Área Segura Inferior 100% Sólida e Opaca (Não Transparente) */}
      <View style={[styles.bottomSafeAreaFill, { height: insets.bottom }]} />

      {/* Security Privacy Shield */}
      <PrivacyShieldOverlay visible={isShieldVisible} />

      {/* Biometric Lock Screen */}
      {isLocked && <BiometricLockScreen onUnlock={handleUnlock} />}

      <StatusBar style="dark" backgroundColor="#F8F9FE" translucent={false} />
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  topSafeAreaFill: {
    backgroundColor: '#F8F9FE',
    width: '100%',
    zIndex: 999,
  },
  bottomSafeAreaFill: {
    backgroundColor: '#F8F9FE',
    width: '100%',
    zIndex: 999,
  },
  content: {
    flex: 1,
  },
});
