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
import type { UserRole } from "./types";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("citizen");
  const { register, isLoading, error, clearError } = useAuthStore();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Width-capped, centered wrapper — matches the login screen so the
            form reads as a compact document instead of stretching full-bleed
            on wide/web viewports. */}
        <View style={styles.pageInner}>
          {/* Ledger-style header: same seal + rule treatment as login */}
          <View style={styles.header}>
            <View style={styles.seal}>
              <Text style={styles.sealText}>EKB</Text>
            </View>
            <Text style={styles.brand}>Create Account</Text>
            <View style={styles.subtitleRow}>
              <View style={styles.subtitleRule} />
              <Text style={styles.subtitle}>NEW ACCESS REQUEST</Text>
              <View style={styles.subtitleRule} />
            </View>
          </View>

          {/* Dossier card: same folder-tab + doc-reference framing as login */}
          <View style={styles.dossier}>
            <View style={styles.dossierTab}>
              <Text style={styles.dossierTabText}>FORM 02 · REGISTRATION</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Create Account</Text>
                <View style={styles.cardHeaderLine} />
              </View>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorIcon}>!</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={(t) => {
                    clearError();
                    setFullName(t);
                  }}
                  placeholder="Full Name"
                  placeholderTextColor={Colors.outline}
                />
              </View>

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
                <Text style={styles.label}>Password (min 8 characters)</Text>
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

              <View style={styles.field}>
                <Text style={styles.label}>Account Type</Text>
                <View style={styles.roleRow}>
                  {(["citizen", "clerk"] as UserRole[]).map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.roleBtn,
                        role === r && styles.roleBtnActive,
                      ]}
                      onPress={() => setRole(r)}
                    >
                      <Text
                        style={[
                          styles.roleBtnText,
                          role === r && styles.roleBtnTextActive,
                        ]}
                      >
                        {r === "citizen" ? "Citizen" : "Clerk"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.btn, isLoading && styles.btnDisabled]}
                onPress={() =>
                  register({ email, password, full_name: fullName, role })
                }
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.onSecondary} size="small" />
                ) : (
                  <Text style={styles.btnText}>Create Account</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.footerLink}>Sign In</Text>
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
  // Caps the form's width on wide/web screens — identical pattern to login.
  pageInner: {
    width: "100%",
    maxWidth: 420,
    gap: Spacing.stackSm,
  },

  // Header / seal — matches login screen exactly
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
  subtitleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
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

  // Password field with inline show/hide toggle — same as login
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

  roleRow: { flexDirection: "row", gap: 10 },
  roleBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceContainerLow,
  },
  roleBtnActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  roleBtnText: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    fontFamily: "Inter_500Medium",
  },
  roleBtnTextActive: {
    color: Colors.onSecondary,
    fontFamily: "Inter_600SemiBold",
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

  version: {
    ...Typography.labelCaps,
    color: Colors.onPrimaryContainer,
    textAlign: "center",
    opacity: 0.7,
    letterSpacing: 1,
  },
});
