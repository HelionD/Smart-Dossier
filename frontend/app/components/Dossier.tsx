import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, BorderRadius } from "../constants/design";

// ── FolderHeader ─────────────────────────────────────────────────────────
// Mirrors the citizen Case File's "folder tab" structure: a thin dark
// mono-caps strip (eyebrow + context) sitting above a paper-colored body
// that carries the serif document title. Used at the top of every clerk
// screen so navigating between them feels like opening the same case file.
//
// Pass `inset` when the header lives inside an already-padded page (e.g.
// dashboard, which centers a max-width column) so it reads as a card
// instead of a full-bleed bar.
export function FolderHeader({
  eyebrow,
  context,
  title,
  subtitle,
  right,
  inset,
}: {
  eyebrow: string;
  context?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  inset?: boolean;
}) {
  return (
    <View style={[folderStyles.root, inset && folderStyles.rootInset]}>
      <View style={folderStyles.tab}>
        <Text style={folderStyles.tabLeft} numberOfLines={1}>
          {eyebrow}
        </Text>
        {context ? (
          <Text style={folderStyles.tabRight} numberOfLines={1}>
            {context}
          </Text>
        ) : null}
      </View>
      <View style={folderStyles.body}>
        <View style={folderStyles.bodyTextWrap}>
          <Text style={folderStyles.title} numberOfLines={2}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={folderStyles.subtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const folderStyles = StyleSheet.create({
  root: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  rootInset: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  tab: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 9,
  },
  tabLeft: {
    ...Typography.labelCaps,
    color: Colors.inversePrimary,
    fontSize: 10,
  },
  tabRight: {
    ...Typography.labelCaps,
    color: Colors.onPrimaryContainer,
    fontSize: 10,
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 14,
  },
  bodyTextWrap: { flex: 1, gap: 4 },
  title: { ...Typography.headlineMdMobile, color: Colors.primary },
  subtitle: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
});

// ── StatusPill ───────────────────────────────────────────────────────────
// The dot + label pill from the citizen status strip ("● Under Review").
// Color is always passed in by the caller (typically from
// getCaseStatusVisual) so meaning stays tied to real case state.
export function StatusPill({
  label,
  fg,
  bg,
  small,
}: {
  label: string;
  fg: string;
  bg: string;
  small?: boolean;
}) {
  return (
    <View
      style={[
        pillStyles.root,
        { backgroundColor: bg },
        small && pillStyles.small,
      ]}
    >
      <View style={[pillStyles.dot, { backgroundColor: fg }]} />
      <Text
        style={[
          pillStyles.label,
          { color: fg },
          small && pillStyles.labelSmall,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  small: { paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { fontFamily: "Inter_500Medium", fontSize: 12 },
  labelSmall: { fontSize: 10, letterSpacing: 0.2 },
});

// ── InkCallout ───────────────────────────────────────────────────────────
// The dark "what happens next" panel: ink background, mono-caps eyebrow,
// body copy. Use for guidance the person should actually read, not for
// routine info — reserve it the way the citizen view does, for one panel
// per screen at most.
export function InkCallout({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <View style={calloutStyles.root}>
      <Text style={calloutStyles.eyebrow}>{eyebrow}</Text>
      {typeof children === "string" ? (
        <Text style={calloutStyles.body}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const calloutStyles = StyleSheet.create({
  root: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 20,
    gap: 8,
  },
  eyebrow: {
    ...Typography.labelCaps,
    color: Colors.inversePrimary,
    fontSize: 10.5,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: "#E7E5DC",
  },
});

// ── Phase stamp + thread ───────────────────────────────────────────────────
// The rotated wax-stamp checkmark, pulsing "active" dot, and dashed
// "pending" ring from the citizen timeline, generalized with a `blocked`
// state for clerk views where a phase has stalled.
export type StampStatus = "done" | "active" | "blocked" | "pending";

export function PhaseStamp({
  status,
  size = 30,
}: {
  status: StampStatus;
  size?: number;
}) {
  return (
    <View
      style={[
        stampStyles.base,
        { width: size, height: size, borderRadius: size / 2 },
        stampStyles[status],
      ]}
    >
      {status === "done" && (
        <Text style={[stampStyles.checkmark, { fontSize: size * 0.46 }]}>
          ✓
        </Text>
      )}
      {status === "active" && <View style={stampStyles.dot} />}
      {status === "blocked" && (
        <Text style={[stampStyles.blockedMark, { fontSize: size * 0.5 }]}>
          !
        </Text>
      )}
    </View>
  );
}

const stampStyles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
  done: {
    backgroundColor: Colors.statusCompleted,
    borderWidth: 2,
    borderColor: Colors.statusCompleted,
    transform: [{ rotate: "-6deg" }],
  },
  checkmark: {
    color: "#fff",
    fontWeight: "700",
    transform: [{ rotate: "6deg" }],
  },
  active: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
  },
  blocked: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  blockedMark: { color: Colors.error, fontWeight: "700" },
  pending: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    borderStyle: "dashed",
  },
});

export function ThreadConnector({ done }: { done: boolean }) {
  return (
    <View
      style={[
        threadStyles.base,
        done ? threadStyles.solid : threadStyles.dashed,
      ]}
    />
  );
}

const threadStyles = StyleSheet.create({
  base: { width: 2, flex: 1, minHeight: 14 },
  solid: { backgroundColor: Colors.statusCompleted },
  dashed: { backgroundColor: Colors.outlineVariant, opacity: 0.7 },
});
