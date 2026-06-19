import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/design';
import { useAuthStore } from '../hooks/useAuthStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Dilni', 'Jeni i sigurt që doni të dilni?', [
      { text: 'Anulo', style: 'cancel' },
      { text: 'Dil', style: 'destructive', onPress: logout },
    ]);
  };

  const initials = user?.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'AD';

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Llogaria ime</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.full_name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {user?.role === 'nepunes' ? '🏛 NËPUNËS' : '👤 QYTETAR'}
            </Text>
          </View>
        </View>

        {/* Info rows */}
        <View style={styles.infoCard}>
          <InfoRow label="Emri i plotë" value={user?.full_name ?? '—'} />
          <InfoRow label="Email" value={user?.email ?? '—'} />
          <InfoRow label="Roli" value={user?.role === 'nepunes' ? 'Nëpunës EKB' : 'Qytetar'} />
          <InfoRow label="ID" value={user?.id.slice(0, 8) + '…' ?? '—'} last />
        </View>

        {/* App info */}
        <View style={styles.infoCard}>
          <InfoRow label="Versioni" value="1.0.0" />
          <InfoRow label="Backend" value="FastAPI + Ollama" />
          <InfoRow label="Procesi" value="EKB Privatizim (7 faza)" last />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutBtnText}>Dilni nga llogaria</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.select({ ios: 60, default: 48 }),
    paddingBottom: 20,
    paddingHorizontal: Spacing.marginPage,
  },
  headerLabel: { ...Typography.headlineMdMobile, color: Colors.onPrimary },
  content: { padding: Spacing.marginPage, gap: Spacing.stackMd, paddingBottom: 48 },
  avatarSection: { alignItems: 'center', gap: 10, paddingVertical: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { ...Typography.headlineMd, color: Colors.onSecondary, fontSize: 28 },
  name: { ...Typography.headlineSm, color: Colors.onSurface },
  email: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  roleBadge: { backgroundColor: Colors.primaryContainer, paddingHorizontal: 14, paddingVertical: 6, borderRadius: BorderRadius.full },
  roleBadgeText: { ...Typography.labelCaps, color: Colors.inversePrimary },
  infoCard: { backgroundColor: Colors.surfaceContainerLowest, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  infoValue: { ...Typography.bodySm, color: Colors.onSurface, fontFamily: 'Inter_600SemiBold', textAlign: 'right', flex: 1, marginLeft: 16 },
  logoutBtn: { height: 52, backgroundColor: Colors.errorContainer, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.error },
  logoutBtnText: { ...Typography.headlineSm, color: Colors.onErrorContainer, fontSize: 15 },
});

import { Platform } from 'react-native';
