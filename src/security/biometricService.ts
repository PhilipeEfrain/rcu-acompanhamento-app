import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BIOMETRICS_ENABLED_KEY = 'rcu_biometrics_enabled';

export const biometricService = {
  async isHardwareAvailable(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') return true; // Web simulated/supported
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch {
      return false;
    }
  },

  async isBiometricsEnabled(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(BIOMETRICS_ENABLED_KEY) === 'true';
      }
      const val = await SecureStore.getItemAsync(BIOMETRICS_ENABLED_KEY);
      return val === 'true';
    } catch {
      return false;
    }
  },

  async setBiometricsEnabled(enabled: boolean): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false');
        return;
      }
      await SecureStore.setItemAsync(BIOMETRICS_ENABLED_KEY, enabled ? 'true' : 'false');
    } catch {
      // Secure fallback
    }
  },

  async authenticate(promptMessage: string): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return true;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar Senha',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  },
};
