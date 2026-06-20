import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { cases } from "../api/services";
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  PHASE_LABELS,
  PHASE_DESCRIPTIONS,
  BOTTLENECK_PHASES,
} from "../constants/design";
import { useAuthStore } from "../hooks/useAuthStore";

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: cases.stats,
    refetchInterval: 60_000,
  });

  const {
    data: items = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["cases"],
    queryFn: () => cases.list(),
    refetchInterval: 30_000,
  });

  const blocked = items.filter((c) => c.is_blocked);
  const blockedCount = statsLoading
    ? blocked.length
    : (stats?.high_latency_count ?? blocked.length);
  const casesByPhase =
    stats?.cases_by_phase ??
    items.reduce<Record<number, number>>((acc, c) => {
      acc[c.current_phase] = (acc[c.current_phase] || 0) + 1;
      return acc;
    }, {});

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.secondary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Text style={styles.kicker}>EKB PRIVATIZATION · 7 PHASES</Text>
            <Text style={styles.pageTitle}>Registry Overview</Text>
            <Text style={styles.pageSub}>
              Real-time monitoring of all active cases across all phases.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.kanbanBtn}
            onPress={() => router.push("./kanban")}
            activeOpacity={0.85}
          >
            <Text style={styles.kanbanBtnIcon}>▦</Text>
            <Text style={styles.kanbanBtnText}>Open Kanban</Text>
          </TouchableOpacity>
        </View>

        {/* Priority: urgent / blocked cases, surfaced first and actionable */}
        {blocked.length > 0 ? (
          <TouchableOpacity
            style={styles.urgentCard}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: "/(clerk)/cases",
                params: { blocked: "1" },
              })
            }
          >
            <View style={styles.urgentTop}>
              <View style={styles.urgentIconBox}>
                <Text style={styles.urgentIcon}>⚠</Text>
              </View>
              <View style={styles.urgentNumWrap}>
                <Text style={styles.urgentNum}>{blockedCount}</Text>
                <Text style={styles.urgentNumLabel}>
                  {blockedCount === 1
                    ? "case needs attention"
                    : "cases need attention"}
                </Text>
              </View>
              <Text style={styles.urgentChevron}>›</Text>
            </View>
            <Text style={styles.urgentDetail}>
              Phases 3 (ASHK Verification) and 6 (Submission to ASHK) are
              primary bottlenecks — avg delay 2–8 weeks. Tap to review.
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.allClearCard}>
            <Text style={styles.allClearIcon}>✓</Text>
            <Text style={styles.allClearText}>
              No blocked cases — everything is on track.
            </Text>
          </View>
        )}

        {/* Stats — single bar with 3 large numbers instead of 4 small boxed cards */}
        <View style={styles.statsRow}>
          <StatBlock
            label="TOTAL ACTIVE"
            value={
              statsLoading ? "—" : String(stats?.total_active ?? items.length)
            }
          />
          <View style={styles.statDivider} />
          <StatBlock
            label="AVG. CYCLE"
            value={statsLoading ? "—" : `${stats?.avg_cycle_days ?? "—"}`}
            unit="days"
          />
          <View style={styles.statDivider} />
          <StatBlock
            label="COMPLETION"
            value={statsLoading ? "—" : `${stats?.completion_rate ?? "—"}`}
            unit="%"
            accent
          />
        </View>

        {/* Cases by Phase */}
        <View>
          <Text style={styles.sectionTitle}>Cases by Phase</Text>
          <View style={styles.phaseList}>
            {[1, 2, 3, 4, 5, 6, 7].map((phase) => {
              const count = casesByPhase[phase] || 0;
              const isBottleneck = BOTTLENECK_PHASES.includes(phase);
              const isCompleted = phase === 7;

              return (
                <TouchableOpacity
                  key={phase}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: "/(clerk)/cases",
                      params: { phase: String(phase) },
                    })
                  }
                  style={[
                    styles.phaseRow,
                    isBottleneck && styles.phaseRowWarn,
                    isCompleted && styles.phaseRowDone,
                  ]}
                >
                  {/* F-badge */}
                  <View
                    style={[
                      styles.fBadge,
                      isBottleneck && styles.fBadgeWarn,
                      isCompleted && styles.fBadgeDone,
                    ]}
                  >
                    <Text style={styles.fBadgeText}>F{phase}</Text>
                  </View>

                  {/* Info */}
                  <View style={styles.phaseInfo}>
                    <View style={styles.phaseInfoTop}>
                      <Text style={styles.phaseName}>
                        {PHASE_LABELS[phase]}
                      </Text>
                      {isBottleneck && (
                        <View style={styles.bottleneckChip}>
                          <Text style={styles.bottleneckChipText}>
                            BOTTLENECK {phase === 3 ? "2–4 wks" : "4–8 wks"}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.phaseDesc} numberOfLines={1}>
                      {PHASE_DESCRIPTIONS[phase]}
                    </Text>
                  </View>

                  {/* Count */}
                  <View style={styles.phaseCountCol}>
                    <Text
                      style={[
                        styles.phaseCount,
                        isBottleneck && styles.phaseCountWarn,
                        isCompleted && styles.phaseCountDone,
                      ]}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBlock({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.statBlock}>
      <Text style={styles.statBlockLabel}>{label}</Text>
      <View style={styles.statBlockValueRow}>
        <Text
          style={[styles.statBlockValue, accent && styles.statBlockValueAccent]}
        >
          {value}
        </Text>
        {unit && <Text style={styles.statBlockUnit}>{unit}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.marginPage,
    gap: 20,
    paddingBottom: 32,
    maxWidth: 1280,
    width: "100%",
    alignSelf: "center" as const,
  },

  // Header row
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 16,
  },
  topLeft: { gap: 4 },
  kicker: { ...Typography.labelCaps, color: Colors.secondary, fontSize: 10 },
  pageTitle: { ...Typography.displayLg, color: Colors.primary, fontSize: 30 },
  pageSub: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  kanbanBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  kanbanBtnIcon: { fontSize: 18, color: Colors.onSecondary },
  kanbanBtnText: {
    ...Typography.bodySm,
    color: Colors.onSecondary,
    fontFamily: "Inter_500Medium",
  },

  // Urgent card — the priority element, shown first
  urgentCard: {
    backgroundColor: Colors.errorContainer,
    borderWidth: 1.5,
    borderColor: Colors.error,
    borderRadius: BorderRadius.xl,
    padding: 18,
    gap: 10,
  },
  urgentTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  urgentIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  urgentIcon: { fontSize: 20, color: Colors.onError ?? "#fff" },
  urgentNumWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    flexWrap: "wrap",
  },
  urgentNum: {
    fontFamily: "HankenGrotesk_700Bold",
    fontSize: 36,
    lineHeight: 38,
    color: Colors.onErrorContainer,
  },
  urgentNumLabel: {
    ...Typography.bodySm,
    color: Colors.onErrorContainer,
    fontFamily: "Inter_600SemiBold",
  },
  urgentChevron: { fontSize: 26, color: Colors.onErrorContainer, opacity: 0.6 },
  urgentDetail: {
    ...Typography.bodySm,
    color: Colors.onErrorContainer,
    fontSize: 12,
    opacity: 0.9,
  },

  // All-clear state when nothing is blocked
  allClearCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.statusCompleted,
    borderRadius: BorderRadius.xl,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  allClearIcon: {
    fontSize: 16,
    color: Colors.statusCompleted,
    fontFamily: "HankenGrotesk_700Bold",
  },
  allClearText: { ...Typography.bodySm, color: Colors.onSurface },

  // Stats — single bar with 3 large numbers instead of 4 small boxed cards
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingVertical: 18,
    paddingHorizontal: 8,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.outlineVariant,
    marginVertical: 4,
  },
  statBlock: { flex: 1, alignItems: "center", gap: 6, paddingHorizontal: 8 },
  statBlockLabel: {
    ...Typography.labelCaps,
    color: Colors.onSurfaceVariant,
    fontSize: 10,
    textAlign: "center",
  },
  statBlockValueRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  statBlockValue: {
    fontFamily: "HankenGrotesk_700Bold",
    fontSize: 34,
    lineHeight: 38,
    color: Colors.primary,
  },
  statBlockValueAccent: { color: Colors.statusCompleted },
  statBlockUnit: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 13,
  },

  // Section
  sectionTitle: {
    ...Typography.headlineSm,
    color: Colors.primary,
    marginBottom: 12,
  },

  // Phase rows
  phaseList: { gap: 0 },
  phaseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.xl,
    overflow: "hidden",
    marginBottom: 8,
  },
  phaseRowWarn: { borderColor: Colors.statusInReview, borderWidth: 2 },
  phaseRowDone: { borderColor: Colors.statusCompleted },

  // F-badge
  fBadge: {
    width: 56,
    alignSelf: "stretch",
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  fBadgeWarn: { backgroundColor: Colors.statusInReview },
  fBadgeDone: { backgroundColor: Colors.statusCompleted },
  fBadgeText: {
    fontFamily: "HankenGrotesk_700Bold",
    fontSize: 14,
    color: Colors.onSecondary,
  },

  // Phase info
  phaseInfo: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
    minWidth: 0,
  },
  phaseInfoTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  phaseName: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontFamily: "Inter_500Medium",
  },
  bottleneckChip: {
    backgroundColor: Colors.statusInReviewBg,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bottleneckChipText: {
    ...Typography.labelCaps,
    color: Colors.statusInReview,
    fontSize: 8,
  },
  phaseDesc: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },

  // Phase count
  phaseCountCol: {
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseCount: {
    fontFamily: "HankenGrotesk_700Bold",
    fontSize: 22,
    color: Colors.onSurface,
  },
  phaseCountWarn: { color: Colors.statusInReview },
  phaseCountDone: { color: Colors.statusCompleted },
});
