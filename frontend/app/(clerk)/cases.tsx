import React, { useState } from "react";
import { Platform } from "react-native";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { cases } from "../api/services";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  PHASE_LABELS,
  getCaseStatusVisual,
} from "../constants/design";
import { FolderHeader, StatusPill } from "../components/Dossier";
import type { Case } from "../types";

export default function CasesScreen() {
  const { phase: paramPhase } = useLocalSearchParams<{ phase?: string }>();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(
    paramPhase ? parseInt(paramPhase) : null,
  );
  const [search, setSearch] = useState("");

  const {
    data: items = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["cases", selectedPhase],
    queryFn: () => cases.list(selectedPhase ?? undefined),
    refetchInterval: 30_000,
  });

  const filtered = search
    ? items.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          (c.owner_name ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  // Phases that currently have at least one blocked case — drives filter chip coloring
  const blockedPhases = new Set(
    items.filter((c) => c.is_blocked).map((c) => c.current_phase),
  );
  return (
    <View style={styles.root}>
      <FolderHeader
        eyebrow="Case Registry"
        context="EKB Privatization"
        title="All Cases"
        subtitle={`${filtered.length} case${filtered.length === 1 ? "" : "s"} in the queue`}
      />

      {/* Search */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search code, name, applicant…"
          placeholderTextColor={Colors.outline}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Phase filter chips — coloring reflects whether any case in that phase
          is currently blocked (red), not a static bottleneck-phase list. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedPhase === null && styles.filterChipActive,
          ]}
          onPress={() => setSelectedPhase(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedPhase === null && styles.filterChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {[1, 2, 3, 4, 5, 6, 7].map((p) => {
          const isBlockedPhase = blockedPhases.has(p);
          return (
            <TouchableOpacity
              key={p}
              style={[
                styles.filterChip,
                selectedPhase === p && styles.filterChipActive,
                isBlockedPhase && styles.filterChipBlocked,
                isBlockedPhase &&
                  selectedPhase === p &&
                  styles.filterChipBlockedActive,
              ]}
              onPress={() => setSelectedPhase(selectedPhase === p ? null : p)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedPhase === p && styles.filterChipTextActive,
                  isBlockedPhase && styles.filterChipTextBlocked,
                  isBlockedPhase &&
                    selectedPhase === p &&
                    styles.filterChipTextBlockedActive,
                ]}
              >
                F{p}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.secondary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator
            color={Colors.secondary}
            style={{ marginTop: 48 }}
          />
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No cases found</Text>
          </View>
        ) : (
          filtered.map((c) => <CaseItem key={c.id} caseItem={c} />)
        )}
      </ScrollView>
    </View>
  );
}

function CaseItem({ caseItem }: { caseItem: Case }) {
  // Color comes from the case's own computed status (is_blocked / status),
  // not from whether its current phase happens to be a known bottleneck.
  // A case that just entered phase 3 ten minutes ago stays "on track" blue
  // until it's actually flagged blocked by the backend.
  const statusVisual = getCaseStatusVisual(caseItem);

  return (
    <TouchableOpacity
      style={[styles.item, caseItem.is_blocked && styles.itemBlocked]}
      onPress={() =>
        router.push({
          pathname: "/(clerk)/case-detail",
          params: { id: caseItem.id },
        })
      }
      activeOpacity={0.75}
    >
      <View style={styles.itemTop}>
        <Text style={styles.itemCode}>{caseItem.code}</Text>
        <View style={[styles.phaseBadge, { backgroundColor: statusVisual.bg }]}>
          <Text style={[styles.phaseBadgeText, { color: statusVisual.fg }]}>
            F{caseItem.current_phase}
          </Text>
        </View>
      </View>
      <Text style={styles.itemTitle} numberOfLines={1}>
        {caseItem.title}
      </Text>
      {caseItem.owner_name && (
        <Text style={styles.itemOwner}>{caseItem.owner_name}</Text>
      )}
      <View style={styles.itemBottom}>
        <Text style={styles.itemPhaseLabel}>
          {PHASE_LABELS[caseItem.current_phase]}
        </Text>
        <View style={styles.itemRight}>
          {caseItem.is_blocked && (
            <StatusPill
              small
              label="Blocked"
              fg={statusVisual.fg}
              bg={statusVisual.bg}
            />
          )}
          <Text
            style={[
              styles.itemDays,
              caseItem.is_blocked && styles.itemDaysUrgent,
            ]}
          >
            {caseItem.days_in_phase} days
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  searchWrap: {
    padding: Spacing.marginPage,
    paddingBottom: 10,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  searchInput: {
    height: 42,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 14,
    ...Typography.bodySm,
    color: Colors.onSurface,
  },
  filterScroll: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    flexGrow: 0, // prevents the horizontal ScrollView from stretching tall
  },
  filterContent: {
    paddingHorizontal: Spacing.marginPage,
    paddingTop: 4,
    paddingBottom: 14,
    alignItems: "center", // stops chips from stretching to fill vertical space
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignSelf: "flex-start", // backup safeguard against stretch
  },
  filterChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  filterChipBlocked: { borderColor: Colors.statusBlocked, borderWidth: 1.5 },
  filterChipBlockedActive: {
    backgroundColor: Colors.statusBlocked,
    borderColor: Colors.statusBlocked,
  },
  filterChipText: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
    fontWeight: "600",
  },
  filterChipTextActive: { color: Colors.onSecondary },
  filterChipTextBlocked: { color: Colors.statusBlocked },
  filterChipTextBlockedActive: { color: Colors.onPrimary },
  list: { flex: 1 },
  listContent: { padding: Spacing.marginPage, gap: 10, paddingBottom: 32 },
  empty: { alignItems: "center", padding: 48 },
  emptyText: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  item: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 6,
  },
  itemBlocked: { borderColor: Colors.error, borderWidth: 1.5 },
  itemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCode: { ...Typography.labelCaps, color: Colors.secondary, fontSize: 9 },
  phaseBadge: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  phaseBadgeText: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 9,
  },
  itemTitle: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontFamily: "Inter_600SemiBold",
  },
  itemOwner: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },
  itemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPhaseLabel: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 11,
  },
  itemRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemDays: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 9,
  },
  itemDaysUrgent: { color: Colors.error },
});
