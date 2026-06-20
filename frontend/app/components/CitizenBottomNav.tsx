import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { Colors, Typography } from '../constants/design';

const TABS = [
  { key: 'track', label: 'Track Case', icon: '▤', href: '/(citizen)/track' as const },
  { key: 'profile', label: 'Profile', icon: '◉', href: '/(citizen)/profile' as const },
];

export function CitizenBottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.root}>
      {TABS.map((tab) => {
        const active = pathname.includes(tab.key);
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => router.replace(tab.href)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, active && styles.iconActive]}>{tab.icon}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    paddingTop: 8,
    paddingBottom: 20,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4 },
  icon: { fontSize: 20, color: Colors.onSurfaceVariant },
  iconActive: { color: Colors.secondary },
  label: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, fontSize: 9 },
  labelActive: { color: Colors.secondary, fontFamily: 'Inter_600SemiBold' },
});
