import React from "react";
import { Platform } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Colors, Typography, Spacing, BorderRadius } from "../constants/design";
import { useAuthStore } from "../hooks/useAuthStore";

export default function CitizenProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const initials =
    user?.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "CI";

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>My Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.full_name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>CITIZEN</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="Full Name" value={user?.full_name ?? "—"} />
          <InfoRow label="Email" value={user?.email ?? "—"} />
          <InfoRow label="Role" value="Citizen" />
          <InfoRow
            label="ID"
            value={user?.id ? user.id.slice(0, 8) + "\u2026" : "\u2014"}
            last
          />
        </View>

        <View style={styles.infoCard}>
          <InfoRow label="Version" value="1.0.0" />
          <InfoRow label="Process" value="EKB Privatization (7 phases)" last />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value}
      </Text>
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
  content: {
    padding: Spacing.marginPage,
    gap: Spacing.stackMd,
    paddingBottom: 48,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center" as const,
  },
  avatarSection: { alignItems: "center", gap: 10, paddingVertical: 8 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...Typography.headlineMd,
    color: Colors.onSecondary,
    fontSize: 28,
  },
  name: { ...Typography.headlineSm, color: Colors.onSurface },
  roleBadge: {
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  roleBadgeText: { ...Typography.labelCaps, color: Colors.inversePrimary },
  infoCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  infoValue: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontFamily: "Inter_600SemiBold",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  logoutBtn: {
    height: 52,
    backgroundColor: Colors.errorContainer,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.error,
    marginTop: 4,
  },
  logoutBtnText: {
    ...Typography.bodyLg,
    color: Colors.onErrorContainer,
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
});
