import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { Colors, Typography, Spacing, BorderRadius } from "./constants/design";
import { useAuthStore } from "./hooks/useAuthStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Width-capped, centered wrapper — on web/tablet the screen can be
            much wider than a phone, and without this the card and demo box
            stretch edge-to-edge instead of reading as a compact form. */}
        <View style={styles.pageInner}>
          {/* Ledger-style header: wordmark treated like an embossed registry seal */}
          <View style={styles.header}>
            <View style={styles.seal}>
              <Text style={styles.sealText}>EKB</Text>
            </View>
            <Text style={styles.brand}>Smart Dossier</Text>
            <View style={styles.subtitleRow}>
              <View style={styles.subtitleRule} />
              <Text style={styles.subtitle}>CASE MANAGEMENT SYSTEM</Text>
              <View style={styles.subtitleRule} />
            </View>
          </View>

          {/* Dossier card: a folder-tab detail and a doc-reference header strip
            give the form the feel of opening a physical case file, tying
            directly into the "Smart Dossier" name. */}
          <View style={styles.dossier}>
            <View style={styles.dossierTab}>
              <Text style={styles.dossierTabText}>
                FORM 01 · ACCESS REQUEST
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Sign In</Text>
                <View style={styles.cardHeaderLine} />
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorIcon}>!</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(t) => {
                    clearError();
                    setEmail(t);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="name@example.com"
                  placeholderTextColor={Colors.outline}
                  autoCorrect={false}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordWrap}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={(t) => {
                      clearError();
                      setPassword(t);
                    }}
                    secureTextEntry={!showPassword}
                    placeholder="••••••••"
                    placeholderTextColor={Colors.outline}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeBtn}
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={19}
                        color={Colors.onSurfaceVariant}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        size={19}
                        color={Colors.onSurfaceVariant}
                        strokeWidth={1.8}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.btn, isLoading && styles.btnDisabled]}
                onPress={() => login({ email, password })}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.onPrimary} size="small" />
                ) : (
                  <Text style={styles.btnText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text style={styles.footerLink}>Register</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

          <Text style={styles.version}>EKB · Privatization v1.0</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.marginPage,
  },
  // Caps the form's width on wide/web screens so it reads as a compact
  // document rather than stretching full-bleed across the browser.
  pageInner: {
    width: "100%",
    maxWidth: 420,
    gap: Spacing.stackSm,
  },

  // Header / seal
  header: { alignItems: "center", marginBottom: 2, gap: 8 },
  seal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.inversePrimary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  sealText: {
    ...Typography.displayLg,
    color: Colors.inversePrimary,
    fontSize: 22,
    letterSpacing: 2,
  },
  brand: {
    ...Typography.headlineMd,
    color: Colors.onPrimary,
    letterSpacing: 0.3,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  subtitleRule: {
    width: 24,
    height: 1,
    backgroundColor: Colors.onPrimaryContainer,
    opacity: 0.5,
  },
  subtitle: {
    ...Typography.labelCaps,
    color: Colors.onPrimaryContainer,
    fontSize: 10,
    letterSpacing: 1.5,
  },

  // Dossier wrapper + folder tab
  dossier: { marginTop: 4 },
  dossierTab: {
    alignSelf: "flex-start",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    marginLeft: 16,
  },
  dossierTabText: {
    ...Typography.labelCaps,
    color: Colors.onSecondary,
    fontSize: 9,
    letterSpacing: 1,
  },

  // Card padding/gaps reduced (20→16, stackMd→stackSm) so the form reads as
  // compact rather than stretched, since this was the main complaint.
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    borderTopLeftRadius: 2,
    padding: 16,
    gap: Spacing.stackSm,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardTitle: { ...Typography.headlineSm, color: Colors.onSurface },
  cardHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
  },

  errorBox: {
    backgroundColor: Colors.errorContainer,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  errorIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.error,
    color: Colors.surfaceContainerLowest,
    textAlign: "center",
    lineHeight: 18,
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    overflow: "hidden",
  },
  errorText: { ...Typography.bodySm, color: Colors.onErrorContainer, flex: 1 },

  // Field gap reduced slightly (6→5) and input height reduced (48→44) as
  // part of the same de-stretching pass.
  field: { gap: 5 },
  label: { ...Typography.labelCaps, color: Colors.onSurfaceVariant },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    ...Typography.bodyLg,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLow,
  },

  // Password field with inline show/hide toggle
  passwordWrap: { position: "relative", justifyContent: "center" },
  passwordInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 14,
    paddingRight: 44,
    ...Typography.bodyLg,
    color: Colors.onSurface,
    backgroundColor: Colors.surfaceContainerLow,
  },
  eyeBtn: {
    position: "absolute",
    right: 4,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  btn: {
    height: 48,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    ...Typography.headlineSm,
    color: Colors.onSecondary,
    fontSize: 15,
  },

  footer: { flexDirection: "row", justifyContent: "center" },
  footerText: { ...Typography.bodySm, color: Colors.onSurfaceVariant },
  footerLink: {
    ...Typography.bodySm,
    color: Colors.secondary,
    fontFamily: "Inter_600SemiBold",
  },

  // Demo annex
  demoBox: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.xl,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
  },
  demoHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  demoStamp: {
    borderWidth: 1,
    borderColor: Colors.inversePrimary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    transform: [{ rotate: "-3deg" }],
  },
  demoStampText: {
    ...Typography.labelCaps,
    color: Colors.inversePrimary,
    fontSize: 8,
    letterSpacing: 1,
  },
  demoTitle: {
    ...Typography.labelCaps,
    color: Colors.inversePrimary,
    fontSize: 10,
  },
  demoRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  demoRole: {
    ...Typography.labelCaps,
    color: Colors.onPrimaryContainer,
    fontSize: 10,
    width: 44,
  },
  demoText: {
    ...Typography.bodySm,
    color: Colors.onPrimaryContainer,
    fontSize: 12,
  },

  version: {
    ...Typography.labelCaps,
    color: Colors.onPrimaryContainer,
    textAlign: "center",
    opacity: 0.7,
    letterSpacing: 1,
  },
});
