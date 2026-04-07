import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import Colors from "@/constants/colors";
import { NOTIFICATIONS, PLAYERS } from "@/constants/mock";

type WebTabKey = "discover" | "my-games" | "leaderboard" | "profile";

interface WebAppShellProps {
  currentTab: WebTabKey;
  title: string;
  subtitle: string;
  children: ReactNode;
  aside?: ReactNode;
  primaryActionLabel?: string;
  primaryActionRoute?: string;
}

const NAV_ITEMS: Array<{
  key: WebTabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}> = [
  { key: "discover", label: "Discover", icon: "compass-outline", route: "/(tabs)" },
  { key: "my-games", label: "My Games", icon: "calendar-outline", route: "/(tabs)/my-games" },
  { key: "leaderboard", label: "Rankings", icon: "trophy-outline", route: "/(tabs)/leaderboard" },
  { key: "profile", label: "Profile", icon: "person-outline", route: "/(tabs)/profile" },
];

const QUICK_ACTIONS = [
  { label: "Create League", icon: "sparkles-outline" as const, route: "/create-league" },
  { label: "Join with Code", icon: "key-outline" as const, route: "/join-league" },
];

export function WebAppShell({
  currentTab,
  title,
  subtitle,
  children,
  aside,
  primaryActionLabel,
  primaryActionRoute,
}: WebAppShellProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 1280;
  const unreadCount = NOTIFICATIONS.filter((item) => !item.read).length;
  const currentUser = PLAYERS[0];
  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.screenContent}>
      <View style={styles.bgOrbOne} />
      <View style={styles.bgOrbTwo} />

      <View style={styles.frame}>
        <View style={styles.sidebar}>
          <View style={styles.brandCard}>
            <Text style={styles.brandEyebrow}>BALLR WEB</Text>
            <Text style={styles.brandTitle}>Pickup football, translated into a desktop control room.</Text>
          </View>

          <View style={styles.navGroup}>
            {NAV_ITEMS.map((item) => {
              const active = item.key === currentTab;
              return (
                <Pressable
                  key={item.key}
                  style={({ pressed }) => [
                    styles.navItem,
                    active && styles.navItemActive,
                    pressed && styles.navItemPressed,
                  ]}
                  onPress={() => router.replace(item.route as never)}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={active ? Colors.accent : Colors.muted}
                  />
                  <Text style={[styles.navItemText, active && styles.navItemTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.quickCard}>
            <Text style={styles.quickCardLabel}>Quick Actions</Text>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.label}
                style={({ pressed }) => [styles.quickAction, pressed && styles.navItemPressed]}
                onPress={() => router.push(action.route as never)}
              >
                <Ionicons name={action.icon} size={16} color={Colors.accent} />
                <Text style={styles.quickActionText}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>{initials}</Text>
            </View>
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userSub}>{currentUser.basedIn} captain view</Text>
            </View>
            <Pressable style={styles.bellButton} onPress={() => router.push("/notifications")}>
              <Ionicons name="notifications-outline" size={18} color={Colors.muted} />
              {unreadCount > 0 ? (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
          </View>
        </View>

        <View style={styles.mainColumn}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{title}</Text>
              <Text style={styles.headerSubtitle}>{subtitle}</Text>
            </View>

            <View style={styles.headerActions}>
              <View style={styles.statusChip}>
                <Ionicons name="radio-outline" size={14} color={Colors.accent} />
                <Text style={styles.statusChipText}>Live demo data</Text>
              </View>

              {primaryActionLabel && primaryActionRoute ? (
                <Pressable
                  style={({ pressed }) => [styles.primaryAction, pressed && styles.navItemPressed]}
                  onPress={() => router.push(primaryActionRoute as never)}
                >
                  <Text style={styles.primaryActionText}>{primaryActionLabel}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <View
            style={[
              styles.contentRow,
              { flexDirection: isWide && aside ? "row" : "column" },
            ]}
          >
            <View style={styles.mainContent}>{children}</View>
            {aside ? <View style={[styles.aside, isWide ? null : styles.asideStacked]}>{aside}</View> : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  screenContent: {
    padding: 24,
  },
  bgOrbOne: {
    position: "absolute",
    top: 24,
    right: 48,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: `${Colors.primary}22`,
  },
  bgOrbTwo: {
    position: "absolute",
    bottom: 80,
    left: 40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: `${Colors.blue}11`,
  },
  frame: {
    width: "100%",
    maxWidth: 1480,
    alignSelf: "center",
    flexDirection: "row",
    gap: 20,
  },
  sidebar: {
    width: 280,
    gap: 16,
  },
  brandCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.separator,
    gap: 10,
  },
  brandEyebrow: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.accent,
  },
  brandTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 30,
    color: Colors.text,
  },
  navGroup: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.separator,
    gap: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 18,
  },
  navItemActive: {
    backgroundColor: `${Colors.primary}55`,
    borderWidth: 1,
    borderColor: `${Colors.accent}33`,
  },
  navItemPressed: {
    opacity: 0.88,
  },
  navItemText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.muted,
  },
  navItemTextActive: {
    color: Colors.text,
  },
  quickCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.separator,
    gap: 10,
  },
  quickCardLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.4,
    color: Colors.muted,
    textTransform: "uppercase",
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  quickActionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.text,
  },
  userCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.separator,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  userAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.text,
  },
  userMeta: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  userSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.muted,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.red,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.text,
  },
  mainColumn: {
    flex: 1,
    gap: 18,
  },
  header: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.separator,
    paddingHorizontal: 24,
    paddingVertical: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 18,
  },
  headerText: {
    flex: 1,
    gap: 6,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 34,
    lineHeight: 40,
    color: Colors.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.muted,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  statusChipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
  },
  primaryAction: {
    backgroundColor: Colors.accent,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryActionText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.base,
  },
  contentRow: {
    gap: 18,
  },
  mainContent: {
    flex: 1,
    gap: 18,
  },
  aside: {
    width: 340,
    gap: 18,
  },
  asideStacked: {
    width: "100%",
  },
});
