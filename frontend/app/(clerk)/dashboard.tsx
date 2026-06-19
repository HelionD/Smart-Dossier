import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, RefreshControl, Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { cases } from '../api/services';
import {
  Colors, Typography, Spacing, BorderRadius,
  PHASE_LABELS, PHASE_DESCRIPTIONS, BOTTLENECK_PHASES,
} from '../constants/design';
import { useAuthStore } from '../hooks/useAuthStore';

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: cases.stats,
    refetchInterval: 60_000,
  });

  const { data: items = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['cases'],
    queryFn: () => cases.list(),
    refetchInterval: 30_000,
  });

  const blocked = items.filter((c) => c.is_blocked);
  const casesByPhase = stats?.cases_by_phase ??
    items.reduce<Record<number, number>>((acc, c) => {
      acc[c.current_phase] = (acc[c.current_phase] || 0) + 1;
      return acc;
    }, {});

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.secondary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Text style={styles.kicker}>EKB PRIVATIZATION · 7 PHASES</Text>
            <Text style={styles.pageTitle}>Registry Overview</Text>
            <Text style={styles.pageSub}>Real-time monitoring of all active cases across all phases.</Text>
          </View>
          <TouchableOpacity
            style={styles.kanbanBtn}
            onPress={() => router.push('./kanban')}
            activeOpacity={0.85}
          >
            <Text style={styles.kanbanBtnIcon}>▦</Text>
            <Text style={styles.kanbanBtnText}>Open Kanban</Text>
          </TouchableOpacity>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="⊞"
            iconBg={Colors.surfaceContainerHigh}
            iconColor={Colors.primary}
            label="TOTAL ACTIVE"
            value={statsLoading ? '—' : String(stats?.total_active ?? items.length)}
          />
          <StatCard
            icon="◷"
            iconBg={Colors.surfaceContainerHigh}
            iconColor={Colors.secondary}
            label="AVG. CYCLE"
            value={statsLoading ? '—' : `${stats?.avg_cycle_days ?? '—'}d`}
          />
          <StatCard
            icon="⚑"
            iconBg={Colors.errorContainer}
            iconColor={Colors.onErrorContainer}
            label="HIGH LATENCY"
            value={statsLoading ? '—' : String(stats?.high_latency_count ?? blocked.length)}
            urgent
          />
          <StatCard
            icon="✓"
            iconBg={Colors.surfaceContainerHigh}
            iconColor={Colors.statusCompleted}
            label="COMPLETION"
            value={statsLoading ? '—' : `${stats?.completion_rate ?? '—'}%`}
          />
        </View>

        {/* Alert banner */}
        {blocked.length > 0 && (
          <View style={styles.alert}>
            <Text style={styles.alertIcon}>⚠</Text>
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>{blocked.length} cases with critical delays detected</Text>
              <Text style={styles.alertSub}>
                Phases 3 (ASHK Verification) and 6 (Submission to ASHK) are primary bottlenecks — avg delay 2–8 weeks.
              </Text>
            </View>
          </View>
        )}

        {/* Cases by Phase */}
        <View>
          <Text style={styles.sectionTitle}>Cases by Phase</Text>
          <View style={styles.phaseList}>
            {[1, 2, 3, 4, 5, 6, 7].map((phase) => {
              const count = casesByPhase[phase] || 0;
              const isBottleneck = BOTTLENECK_PHASES.includes(phase);
              const isCompleted = phase === 7;

              return (
                <View
                  key={phase}
                  style={[
                    styles.phaseRow,
                    isBottleneck && styles.phaseRowWarn,
                    isCompleted && styles.phaseRowDone,
                  ]}
                >
                  {/* F-badge */}
                  <View style={[
                    styles.fBadge,
                    isBottleneck && styles.fBadgeWarn,
                    isCompleted && styles.fBadgeDone,
                  ]}>
                    <Text style={styles.fBadgeText}>F{phase}</Text>
                  </View>

                  {/* Info */}
                  <View style={styles.phaseInfo}>
                    <View style={styles.phaseInfoTop}>
                      <Text style={styles.phaseName}>{PHASE_LABELS[phase]}</Text>
                      {isBottleneck && (
                        <View style={styles.bottleneckChip}>
                          <Text style={styles.bottleneckChipText}>
                            BOTTLENECK {phase === 3 ? '2–4 wks' : '4–8 wks'}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.phaseDesc}>{PHASE_DESCRIPTIONS[phase]}</Text>
                  </View>

                  {/* Count */}
                  <View style={styles.phaseCountCol}>
                    <Text style={[
                      styles.phaseCount,
                      isBottleneck && styles.phaseCountWarn,
                      isCompleted && styles.phaseCountDone,
                    ]}>
                      {count}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon, iconBg, iconColor, label, value, urgent,
}: {
  icon: string; iconBg: string; iconColor: string; label: string; value: string; urgent?: boolean;
}) {
  return (
    <View style={[styles.statCard, urgent && styles.statCardUrgent]}>
      <View style={[styles.statIconBox, { backgroundColor: iconBg }]}>
        <Text style={[styles.statIcon, { color: iconColor }]}>{icon}</Text>
      </View>
      <View style={styles.statInfo}>
        <Text style={[styles.statLabel, urgent && styles.statLabelUrgent]}>{label}</Text>
        <Text style={[styles.statValue, urgent && styles.statValueUrgent]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    padding: Spacing.marginPage,
    gap: 24,
    paddingBottom: 32,
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center' as const,
  },

  // Header row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 16,
  },
  topLeft: { gap: 4 },
  kicker: { ...Typography.labelCaps, color: Colors.secondary, fontSize: 10 },
  pageTitle: { ...Typography.displayLg, color: Colors.primary, fontSize: 30 },
  pageSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 2 },
  kanbanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontFamily: 'Inter_500Medium',
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 12,
  },
  statCardUrgent: { borderColor: Colors.error, borderWidth: 2 },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: { fontSize: 18 },
  statInfo: { gap: 2 },
  statLabel: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, fontSize: 10 },
  statLabelUrgent: { color: Colors.error },
  statValue: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 30,
    color: Colors.primary,
    lineHeight: 34,
  },
  statValueUrgent: { color: Colors.error },

  // Alert
  alert: {
    backgroundColor: Colors.statusInReviewBg,
    borderWidth: 1,
    borderColor: Colors.statusInReview,
    borderLeftWidth: 4,
    borderRadius: BorderRadius.xl,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  alertIcon: { fontSize: 18, color: Colors.statusInReview, marginTop: 1 },
  alertBody: { flex: 1, gap: 4 },
  alertTitle: {
    ...Typography.bodySm,
    color: Colors.statusInReview,
    fontFamily: 'Inter_600SemiBold',
  },
  alertSub: { ...Typography.bodySm, color: Colors.onSurfaceVariant, fontSize: 12 },

  // Section
  sectionTitle: {
    ...Typography.headlineSm,
    color: Colors.primary,
    marginBottom: 0,
  },

  // Phase rows
  phaseList: { gap: 0 },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: 8,
  },
  phaseRowWarn: { borderColor: Colors.statusInReview, borderWidth: 2 },
  phaseRowDone: { borderColor: Colors.statusCompleted },

  // F-badge
  fBadge: {
    width: 56,
    alignSelf: 'stretch',
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fBadgeWarn: { backgroundColor: Colors.statusInReview },
  fBadgeDone: { backgroundColor: Colors.statusCompleted },
  fBadgeText: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 14,
    color: Colors.onSecondary,
  },

  // Phase info
  phaseInfo: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  phaseInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  phaseName: {
    ...Typography.bodySm,
    color: Colors.onSurface,
    fontFamily: 'Inter_500Medium',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseCount: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 20,
    color: Colors.onSurface,
  },
  phaseCountWarn: { color: Colors.statusInReview },
  phaseCountDone: { color: Colors.statusCompleted },
});
