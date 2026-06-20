import { Stack, Redirect, usePathname } from "expo-router";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { useAuthStore } from "../hooks/useAuthStore";
import { TopAppBar } from "../components/TopAppBar";
import { Sidebar } from "../components/Sidebar";
import { BottomNav } from "../components/BottomNav";
import { Colors } from "../constants/design";

const VIEW_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  kanban: "Kanban Board",
  cases: "All Cases",
  "case-detail": "Case Detail",
  "new-case": "New Case",
  profile: "Profile",
};

export default function ClerkLayout() {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  if (!user || user.role !== "clerk") return <Redirect href="/login" />;

  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Derive current view label from pathname segments
  const parts = pathname.split("/").filter(Boolean);
  const segment =
    parts.length >= 2 && parts[0] === "clerk"
      ? (parts[1] ?? "dashboard")
      : "dashboard";

  return (
    <View style={styles.root}>
      {/* <TopAppBar
        viewLabel={VIEW_LABELS[segment] ?? "Dashboard"}
        userInitials={initials}
      /> */}

      <View style={styles.body}>
        {isDesktop && (
          <Sidebar
            userName={user.full_name}
            userInitials={initials}
            userDept="Department A"
          />
        )}

        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="kanban" />
            <Stack.Screen name="cases" />
            <Stack.Screen name="case-detail" />
            <Stack.Screen name="new-case" />
            <Stack.Screen name="profile" />
          </Stack>
        </View>
      </View>

      {!isDesktop && <BottomNav />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
});
