import React from "react";
import { View, Text, StyleSheet, Pressable, ViewStyle, TextStyle } from "react-native";
import { Colors, Paper, BorderRadius, Spacing } from "../constants/design";

// 1. <Card>
export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function StatusPill({
  status,
  label,
}: {
  status: "completed" | "in_progress" | "blocked" | "active";
  label: string;
}) {
  let bg: string = Paper.sealSoft;
  let fg: string = Paper.seal;
  if (status === "completed") {
    bg = Paper.greenSoft;
    fg = Paper.green;
  } else if (status === "blocked") {
    bg = Colors.errorContainer;
    fg = Colors.error;
  }

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <View style={[styles.pillDot, { backgroundColor: fg }]} />
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

// 3. <EyebrowLabel>
export function EyebrowLabel({ label, color = Paper.seal }: { label: string; color?: string }) {
  return <Text style={[styles.eyebrow, { color }]}>{label}</Text>;
}

// 4. <MetaGrid>
export interface MetaItemProps {
  label: string;
  value: string;
}

export function MetaGrid({ items }: { items: MetaItemProps[] }) {
  return (
    <View style={styles.metaGrid}>
      {items.map((item, idx) => (
        <View key={idx} style={styles.metaItem}>
          <Text style={styles.metaLabel}>{item.label}</Text>
          <Text style={styles.metaValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

// 5. <ProgressThread>
export function ProgressThread({
  progress,
  total,
  caption,
  date,
}: {
  progress: number;
  total: number;
  caption: string;
  date?: string;
}) {
  const pct = Math.max(0, Math.min(100, (progress / total) * 100));
  return (
    <View style={styles.threadContainer}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <View style={styles.threadCaptionRow}>
        <Text style={styles.threadCaptionText}>{caption}</Text>
        {date && <Text style={styles.threadCaptionText}>{date}</Text>}
      </View>
    </View>
  );
}

// 6. <StatusMarker>
export function StatusMarker({
  status,
  nextStatus,
  isLast,
}: {
  status: "done" | "active" | "pending";
  nextStatus?: "done" | "active" | "pending";
  isLast: boolean;
}) {
  return (
    <View style={styles.markerContainer}>
      <View style={[styles.stampBase, styles[status]]}>
        {status === "done" && <Text style={styles.checkmark}>✓</Text>}
        {status === "active" && <View style={styles.activeDot} />}
      </View>
      {!isLast && (
        <View
          style={[
            styles.connectorLine,
            status === "done" && (nextStatus === "done" || nextStatus === "active")
              ? styles.connectorSolid
              : styles.connectorDashed,
          ]}
        />
      )}
    </View>
  );
}

// 7. <ExpandableRow>
export function ExpandableRow({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.expandableContainer}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={onToggle}
        style={styles.expandableHeader}
      >
        <Text style={styles.expandableTitle}>{title}</Text>
        <Text style={[styles.chevron, isOpen && styles.chevronRotated]}>▲</Text>
      </Pressable>
      {isOpen && <View style={styles.expandableContent}>{children}</View>}
    </View>
  );
}

// 8. <InfoBanner>
export function InfoBanner({ eyebrow, body }: { eyebrow: string; body: string }) {
  return (
    <View style={styles.infoBanner}>
      <Text style={styles.infoEyebrow}>{eyebrow}</Text>
      <Text style={styles.infoBody}>{body}</Text>
    </View>
  );
}

// 9. <Button>
export function Button({
  label,
  onPress,
  variant = "default",
  style,
  textStyle,
}: {
  label: string;
  onPress: () => void;
  variant?: "default" | "primary";
  style?: ViewStyle;
  textStyle?: TextStyle;
}) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.btnBase,
        isPrimary ? styles.btnPrimary : styles.btnDefault,
        pressed && (isPrimary ? styles.btnPrimaryPressed : styles.btnDefaultPressed),
        style,
      ]}
    >
      <Text style={[isPrimary ? styles.btnTextPrimary : styles.btnTextDefault, textStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Paper.white,
    borderWidth: 1,
    borderColor: Paper.line,
    borderRadius: BorderRadius.xl,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    padding: Spacing.paddingCard,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  pillText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  eyebrow: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: Paper.line,
    paddingTop: 16,
    marginTop: 16,
  },
  metaItem: {
    marginRight: 24,
    marginBottom: 8,
  },
  metaLabel: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 10,
    textTransform: "uppercase",
    color: Paper.slate,
  },
  metaValue: {
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 13.5,
    color: Paper.ink,
  },
  threadContainer: {
    marginVertical: 12,
  },
  track: {
    height: 4,
    backgroundColor: Paper.paperDim,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: Paper.green,
  },
  threadCaptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  threadCaptionText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Paper.slate,
  },
  markerContainer: {
    alignItems: "center",
    width: 30,
  },
  stampBase: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  done: {
    backgroundColor: Paper.green,
    borderWidth: 2,
    borderColor: Paper.green,
    transform: [{ rotate: "-6deg" }],
  },
  checkmark: {
    color: Paper.white,
    fontSize: 14,
    fontWeight: "700",
    transform: [{ rotate: "6deg" }],
  },
  active: {
    backgroundColor: Paper.white,
    borderWidth: 2,
    borderColor: Paper.seal,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Paper.seal,
  },
  pending: {
    backgroundColor: Paper.white,
    borderWidth: 2,
    borderColor: Paper.line,
    borderStyle: "dashed",
  },
  connectorLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  connectorSolid: {
    backgroundColor: Paper.green,
  },
  connectorDashed: {
    backgroundColor: Paper.line,
    opacity: 0.6,
  },
  expandableContainer: {
    marginVertical: 6,
    borderBottomWidth: 1,
    borderColor: Paper.line,
    paddingBottom: 8,
  },
  expandableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  expandableTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Paper.ink,
  },
  chevron: {
    fontSize: 12,
    color: Paper.slate,
    transform: [{ rotate: "180deg" }],
  },
  chevronRotated: {
    transform: [{ rotate: "0deg" }],
  },
  expandableContent: {
    backgroundColor: Paper.paperDim,
    borderRadius: BorderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  infoBanner: {
    backgroundColor: Paper.ink,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginVertical: 12,
  },
  infoEyebrow: {
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 10,
    textTransform: "uppercase",
    color: Paper.sealSoft,
    marginBottom: 4,
  },
  infoBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13.5,
    color: Paper.paper,
  },
  btnBase: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDefault: {
    backgroundColor: Paper.white,
    borderWidth: 1,
    borderColor: Paper.line,
  },
  btnDefaultPressed: {
    backgroundColor: Paper.paperDim,
  },
  btnPrimary: {
    backgroundColor: Paper.ink,
  },
  btnPrimaryPressed: {
    backgroundColor: Paper.inkSoft,
  },
  btnTextDefault: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Paper.ink,
  },
  btnTextPrimary: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Paper.paper,
  },
});
