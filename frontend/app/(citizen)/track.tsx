import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import CaseFileView from "../components/CaseFileView";
import { cases as casesApi } from "../api/services";
import { buildCaseFileData } from "../constants/caseFileMapper";
import { Colors, Typography, Spacing, Paper } from "../constants/design";
import { useAuthStore } from "../hooks/useAuthStore";
import type { Case, PhaseLog } from "../types";

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  return (
    <TouchableOpacity
      onPress={() => logout()}
      accessibilityRole="button"
      accessibilityLabel="Log out"
      style={styles.logoutBtn}
    >
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  );
}

export default function TrackCase() {
  const {
    data: myCases,
    isLoading: casesLoading,
    error: casesError,
  } = useQuery<Case[]>({
    queryKey: ["cases", "mine"],
    queryFn: () => casesApi.mine(),
  });

  const selectedCase = myCases?.length
    ? myCases.reduce((a, b) =>
        new Date(a.created_at) > new Date(b.created_at) ? a : b
      )
    : null;

  const {
    data: phaseLogs,
    isLoading: logsLoading,
  } = useQuery<PhaseLog[]>({
    queryKey: ["cases", selectedCase?.id, "history"],
    queryFn: () => casesApi.phaseHistory(selectedCase!.id),
    enabled: !!selectedCase,
  });

  if (casesLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </SafeAreaView>
    );
  }

  if (casesError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Failed to load case data.</Text>
        <View style={styles.logoutSpacer} />
        <LogoutButton />
      </SafeAreaView>
    );
  }

  if (!selectedCase) {
    return (
      <SafeAreaView style={styles.centered}>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No cases found</Text>
          <Text style={styles.emptyBody}>
            You don't have any active cases yet. A clerk will create a case for
            you once your application is submitted.
          </Text>
        </View>
        <View style={styles.logoutSpacer} />
        <LogoutButton />
      </SafeAreaView>
    );
  }

  if (logsLoading || !phaseLogs) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </SafeAreaView>
    );
  }

  const caseFileData = buildCaseFileData(selectedCase, phaseLogs);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <LogoutButton />
      </View>
      <CaseFileView caseData={caseFileData} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.marginPage,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: Spacing.marginPage,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerSpacer: {
    flex: 1,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: Paper.line,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: Paper.white,
  },
  logoutText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Paper.slate,
  },
  logoutSpacer: {
    height: 16,
  },
  errorText: {
    ...Typography.bodyLg,
    color: Colors.error,
  },
  emptyBox: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 24,
    maxWidth: 360,
    alignItems: "center",
    gap: 12,
  },
  emptyTitle: {
    ...Typography.headlineSm,
    color: Colors.onSurface,
  },
  emptyBody: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
});
