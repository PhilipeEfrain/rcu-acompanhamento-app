import React from 'react';
import { StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/locales/i18n';
import { DailyLogScreen } from './src/screens/DailyLogScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <DailyLogScreen />
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
});
