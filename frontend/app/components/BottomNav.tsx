import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { router, usePathname, type RelativePathString } from 'expo-router';
import { Colors, Typography } from '../constants/design';

interface NavTab {
  route: RelativePathString;
  label: string;
  icon: string;
}

const TABS: NavTab[] = [
  { route: '/(clerk)/dashboard' as RelativePathString, label: 'Home', icon: '\u229E' },
  { route: '/(clerk)/kanban' as RelativePathString, label: 'Kanban', icon: '\u25A6' },
  { route: '/(clerk)/cases' as RelativePathString, label: 'Cases', icon: '\u2261' },
  { route: '/(clerk)/profile' as RelativePathString, label: 'Profile', icon: '\u25CE' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.root}>
      {TABS.map((tab) => {
        const active = pathname === tab.route || pathname.startsWith(tab.route + '/');
        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tab}
            onPress={() => { router.push(tab.route); }}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, active && styles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 6,
    flexShrink: 0,
  },
  tab: {
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 20,
    color: Colors.onPrimaryContainer,
  },
  iconActive: {
    color: Colors.inversePrimary,
  },
  label: {
    ...Typography.labelCaps,
    color: Colors.onPrimaryContainer,
    fontSize: 9,
  },
  labelActive: {
    color: Colors.inversePrimary,
  },
});
