import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HeartHandshake, CalendarDays, ShieldCheck } from 'lucide-react-native';

export type AppTab = 'today' | 'history' | 'settings';

interface BottomTabBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const { t } = useTranslation('common');

  const tabs: { id: AppTab; labelKey: string; icon: typeof HeartHandshake }[] = [
    { id: 'today', labelKey: 'nav.today', icon: HeartHandshake },
    { id: 'history', labelKey: 'nav.history', icon: CalendarDays },
    { id: 'settings', labelKey: 'nav.settings', icon: ShieldCheck },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.8}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <Icon
                size={22}
                color={isActive ? '#8E63B8' : '#8E94A0'}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    backgroundColor: '#F8F9FE',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    shadowColor: '#8E63B8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0EFF5',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FAF5FF',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E94A0',
  },
  tabLabelActive: {
    color: '#8E63B8',
    fontWeight: '700',
  },
});
