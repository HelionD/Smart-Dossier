import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, usePathname, type RelativePathString } from 'expo-router';
import { Colors, Typography, BorderRadius } from '../constants/design';

interface NavItem {
  route: RelativePathString;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { route: '/(clerk)/dashboard' as RelativePathString, label: 'Dashboard', icon: '\u229E' },
  { route: '/(clerk)/kanban' as RelativePathString, label: 'Kanban Board', icon: '\u25A6' },
  { route: '/(clerk)/cases' as RelativePathString, label: 'Cases', icon: '\u2261' },
  { route: '/(clerk)/new-case' as RelativePathString, label: 'New Case', icon: '\uFF0B' },
];

interface SidebarProps {
  userName: string;
  userInitials: string;
  userDept: string;
}

export function Sidebar({ userName, userInitials, userDept }: SidebarProps) {
  const pathname = usePathname();

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>CLERK PORTAL</Text>
        <Text style={styles.headerName}>{userName}</Text>
      </View>

      {/* Nav items */}
      <ScrollView style={styles.nav} contentContainerStyle={styles.navContent}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.route || pathname.startsWith(item.route + '/');
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => { router.push(item.route); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.navIcon, active && styles.navIconActive]}>
                {item.icon}
              </Text>
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* User footer */}
      <View style={styles.footer}>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarText}>{userInitials}</Text>
        </View>
        <View style={styles.footerInfo}>
          <Text style={styles.footerName}>{userName}</Text>
          <Text style={styles.footerDept}>{userDept}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 256,
    backgroundColor: Colors.primary,
    flexShrink: 0,
    height: '100%',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerLabel: {
    ...Typography.labelCaps,
    color: Colors.onPrimaryContainer,
    marginBottom: 4,
  },
  headerName: {
    fontFamily: 'HankenGrotesk_600SemiBold',
    fontSize: 14,
    color: Colors.onPrimary,
  },
  nav: {
    flex: 1,
    marginTop: 8,
  },
  navContent: {
    padding: 12,
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  navItemActive: {
    backgroundColor: Colors.primaryContainer,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondaryContainer,
  },
  navIcon: {
    fontSize: 20,
    color: Colors.onPrimaryContainer,
    width: 24,
    textAlign: 'center',
  },
  navIconActive: {
    color: Colors.onPrimary,
  },
  navLabel: {
    ...Typography.bodySm,
    color: Colors.onPrimaryContainer,
    fontFamily: 'Inter_500Medium',
  },
  navLabelActive: {
    color: Colors.onPrimary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 12,
    color: Colors.onSecondary,
  },
  footerInfo: {
    flex: 1,
  },
  footerName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.onPrimary,
    lineHeight: 18,
  },
  footerDept: {
    fontSize: 12,
    color: Colors.onPrimaryContainer,
    marginTop: 1,
  },
});
