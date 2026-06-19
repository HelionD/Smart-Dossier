import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { cases } from '../api/services';
import {
  Colors, Typography, Spacing, BorderRadius,
  PHASE_LABELS, PHASE_DESCRIPTIONS, BOTTLENECK_PHASES,
} from '../constants/design';
import { useAuthStore } from '../hooks/useAuthStore';
import type { Case } from '../types';

export default function CitizenTrackScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['mine'],
    queryFn: () => cases.mine(),
  });

  const activeCase = items[0];

  return (
    <View style={styles.root}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 48 }} color={Colors.secondary} size="large" />
      ) : !activeCase ? (
        <EmptyState />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerLabel}>YOUR CASE STATUS</Text>
                <Text style={styles.headerName}>Welcome, {user?.full_name.split(' ')[0]}.</Text>
                <Text style={styles.headerSub}>Your application is under active review.</Text>
              </View>
              <Text style={styles.logoutBtn} onPress={logout}>Logout</Text>
            </View>
          </View>

          <View style={styles.content}>
            {/* Case info */}
            <View style={styles.caseCard}>
              <View style={styles.caseCardTop}>
                <View style={styles.caseCardLeft}>
                  <Text style={styles.caseCode}>{activeCase.code}</Text>
                  <Text style={styles.caseTitle}>{activeCase.title}</Text>
                </View>
                <StatusChip caseItem={activeCase} />
              </View>
            </View>

            {/* Timeline */}
            <View style={styles.timelineCard}>
              <Text style={styles.sectionTitle}>Process Steps</Text>
              <View style={styles.timeline}>
                {[1, 2, 3, 4, 5, 6, 7].map((phase) => {
                  const done = phase < activeCase.current_phase;
                  const active = phase === activeCase.current_phase;
                  const pending = phase > activeCase.current_phase;
                  const isBottleneck = BOTTLENECK_PHASES.includes(phase) && active;

                  return (
                    <View key={phase} style={styles.step}>
                      {phase < 7 && (
                        <View style={[styles.connector, done && styles.connectorDone]} />
                      )}
                      <View style={[
                        styles.node,
                        done && styles.nodeDone,
                        active && styles.nodeActive,
                        isBottleneck && styles.nodeBottleneck,
                        pending && styles.nodePending,
                      ]}>
                        {done ? (
                          <Text style={styles.nodeCheck}>{'\u2713'}</Text>
                        ) : (
                          <Text style={[styles.nodeNum, active && styles.nodeNumActive]}>
                            {phase}
                          </Text>
                        )}
                      </View>
                      <View style={[styles.stepContent, pending && styles.stepContentPending]}>
                        <Text style={[
                          styles.stepLabel,
                          done && styles.stepLabelDone,
                          active && (isBottleneck ? styles.stepLabelBottleneck : styles.stepLabelActive),
                          pending && styles.stepLabelPending,
                        ]}>
                          {phase}. {PHASE_LABELS[phase]}
                        </Text>

                        {active && (
                          <>
                            <Text style={styles.stepDesc}>
                              {PHASE_DESCRIPTIONS[phase]}
                            </Text>
                            <View style={styles.stepDaysRow}>
                              <View style={[styles.pulseDot, isBottleneck && styles.pulseDotWarn]} />
                              <Text style={[styles.stepDays, isBottleneck && styles.stepDaysWarn]}>
                                {activeCase.days_in_phase} days in this phase
                              </Text>
                            </View>
                            {isBottleneck && (
                              <Text style={styles.stepBottleneckNote}>
                                This phase typically takes {phase === 3 ? '2\u20134 weeks' : '4\u20138 weeks'} for verification.
                              </Text>
                            )}
                          </>
                        )}

                        {done && (
                          <Text style={styles.stepDone}>Completed</Text>
                        )}

                        {pending && phase === activeCase.current_phase + 1 && (
                          <Text style={styles.stepNext}>Next step</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* AI Explanation */}
            <View style={styles.aiCard}>
              <View style={styles.aiCardHeader}>
                <Text style={styles.aiCardIcon}>{'\u2726'}</Text>
                <Text style={styles.aiCardLabel}>EKB AI · EXPLANATION</Text>
              </View>
              <Text style={styles.aiCardText}>
                Your case is currently in the {PHASE_LABELS[activeCase.current_phase]?.toLowerCase()} phase.
                {activeCase.current_phase === 3
                  ? ' This phase requires manual confirmation of property ownership rights and is split between two institutions. You do not need to take any action \u2014 we will notify you when there is an update.'
                  : activeCase.current_phase === 6
                  ? ' Your file is being physically transferred to ASHK for final review. This step involves manual handling and may take several weeks.'
                  : ' Our team is processing your application. We will notify you when your case advances to the next phase.'}
              </Text>
              <Text style={styles.aiCardFooter}>
                Last updated: {new Date(activeCase.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            {/* Case Details */}
            <View style={styles.detailsCard}>
              <View style={styles.detailsHeader}>
                <Text style={styles.detailsHeaderText}>CASE DETAILS</Text>
              </View>
              {activeCase.property_id && (
                <InfoRow label="Property ID" value={activeCase.property_id} />
              )}
              {activeCase.zone && (
                <InfoRow label="Zone" value={activeCase.zone} />
              )}
              <InfoRow
                label="Application Date"
                value={new Date(activeCase.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              />
              {activeCase.income_bracket && (
                <InfoRow label="Income Category" value={activeCase.income_bracket} last />
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function StatusChip({ caseItem }: { caseItem: Case }) {
  const completed = caseItem.status === 'completed';
  const blocked = caseItem.is_blocked;
  const config = completed
    ? { label: '\u2713 COMPLETED', bg: Colors.statusCompletedBg, fg: Colors.statusCompleted }
    : blocked
    ? { label: '\u26A0 AWAITING ACTION', bg: Colors.statusInReviewBg, fg: Colors.statusInReview }
    : { label: '\u25CF IN PROGRESS', bg: Colors.statusOnTrackBg, fg: Colors.statusOnTrack };

  return (
    <View style={[styles.chip, { backgroundColor: config.bg }]}>
      <Text style={[styles.chipText, { color: config.fg }]}>{config.label}</Text>
    </View>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No Active Case</Text>
      <Text style={styles.emptyBody}>
        Your case has not been registered yet. Contact the EKB office to start the application.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 48 },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 32,
    paddingHorizontal: Spacing.marginPage,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: { gap: 4 },
  headerLabel: { ...Typography.labelCaps, color: Colors.onPrimaryContainer, fontSize: 10 },
  headerName: { ...Typography.displayLg, color: Colors.onPrimary, fontSize: 28 },
  headerSub: { ...Typography.bodySm, color: Colors.onPrimaryContainer },
  logoutBtn: { ...Typography.bodySm, color: Colors.inversePrimary, paddingTop: 8 },

  content: {
    padding: Spacing.marginPage,
    gap: 24,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center' as const,
  },

  caseCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  caseCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
  },
  caseCardLeft: { gap: 4 },
  caseCode: { ...Typography.labelCaps, color: Colors.secondary },
  caseTitle: { ...Typography.headlineSm, color: Colors.primary },

  chip: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { ...Typography.labelCaps, fontSize: 9 },

  timelineCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  sectionTitle: { ...Typography.headlineSm, color: Colors.primary, marginBottom: 24 },
  timeline: { gap: 0 },
  step: { flexDirection: 'row', gap: 16, minHeight: 56, position: 'relative' },
  connector: {
    position: 'absolute',
    left: 19,
    top: 44,
    bottom: -8,
    width: 2,
    backgroundColor: Colors.outlineVariant,
  },
  connectorDone: { backgroundColor: Colors.secondary },
  node: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    flexShrink: 0,
    marginTop: 2,
  },
  nodeDone: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  nodeActive: { backgroundColor: Colors.secondary, borderColor: Colors.secondary, width: 42, height: 42 },
  nodeBottleneck: { backgroundColor: Colors.statusInReview, borderColor: Colors.statusInReview, width: 42, height: 42 },
  nodePending: { opacity: 0.4 },
  nodeCheck: { color: Colors.onSecondary, fontSize: 18, fontFamily: 'HankenGrotesk_700Bold' },
  nodeNum: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, fontSize: 14 },
  nodeNumActive: { color: Colors.onSecondary },
  stepContent: { flex: 1, paddingBottom: 24, paddingTop: 6 },
  stepContentPending: { opacity: 0.4 },
  stepLabel: { ...Typography.bodySm, color: Colors.onSurface, fontFamily: 'Inter_600SemiBold' },
  stepLabelDone: { color: Colors.statusCompleted },
  stepLabelActive: { color: Colors.secondary, fontSize: 15 },
  stepLabelBottleneck: { color: Colors.statusInReview, fontSize: 15 },
  stepLabelPending: { color: Colors.onSurfaceVariant },
  stepDesc: { ...Typography.bodySm, color: Colors.onSurfaceVariant, marginTop: 4 },
  stepDaysRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary },
  pulseDotWarn: { backgroundColor: Colors.statusInReview },
  stepDays: { ...Typography.labelCaps, color: Colors.secondary, fontSize: 11 },
  stepDaysWarn: { color: Colors.statusInReview },
  stepBottleneckNote: { ...Typography.bodySm, color: Colors.statusInReview, fontSize: 12, marginTop: 4 },
  stepDone: { ...Typography.labelCaps, color: Colors.statusCompleted, marginTop: 2, fontSize: 10 },
  stepNext: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, marginTop: 2, fontSize: 10 },

  aiCard: { backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, padding: 20, gap: 12 },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiCardIcon: { fontSize: 18, color: Colors.secondary },
  aiCardLabel: { ...Typography.labelCaps, color: Colors.onPrimaryContainer, fontSize: 10 },
  aiCardText: { ...Typography.bodyLg, color: Colors.onPrimary, lineHeight: 26 },
  aiCardFooter: { ...Typography.bodySm, color: Colors.onPrimaryContainer, fontSize: 12 },

  detailsCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
  },
  detailsHeader: {
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  detailsHeaderText: { ...Typography.labelCaps, color: Colors.onSurfaceVariant, fontSize: 10 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  infoValue: { ...Typography.bodySm, color: Colors.onSurface, fontFamily: 'Inter_600SemiBold' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 },
  emptyTitle: { ...Typography.headlineSm, color: Colors.onSurface, textAlign: 'center' },
  emptyBody: { ...Typography.bodyLg, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 24 },
});
