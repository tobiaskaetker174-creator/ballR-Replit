import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import Colors from "@/constants/colors";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "magnifyingglass", selected: "magnifyingglass" }} />
        <Label>Discover</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="my-games">
        <Icon sf={{ default: "calendar", selected: "calendar" }} />
        <Label>My Games</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="leaderboard">
        <Icon sf={{ default: "trophy", selected: "trophy.fill" }} />
        <Label>Rankings</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const { width } = useWindowDimensions();
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const isDesktopWeb = isWeb && width >= 1100;
  const desktopTabWidth = Math.min(width - 48, 760);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS
            ? "transparent"
            : isDesktopWeb
              ? "rgba(32, 31, 30, 0.92)"
              : Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.separator,
          elevation: 0,
          ...(isWeb
            ? isDesktopWeb
              ? {
                  left: "50%",
                  bottom: 20,
                  width: desktopTabWidth,
                  height: 76,
                  paddingTop: 8,
                  paddingBottom: 10,
                  borderWidth: 1,
                  borderColor: Colors.separator,
                  borderRadius: 28,
                  transform: [{ translateX: -desktopTabWidth / 2 }],
                  shadowColor: Colors.base,
                  shadowOpacity: 0.35,
                  shadowRadius: 28,
                  shadowOffset: { width: 0, height: 18 },
                }
              : { height: 84 }
            : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={90}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : isWeb ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: isDesktopWeb ? "rgba(32, 31, 30, 0.88)" : Colors.surface,
                  borderRadius: isDesktopWeb ? 28 : 0,
                },
              ]}
            />
          ) : null,
        tabBarItemStyle: isDesktopWeb ? { paddingTop: 4 } : undefined,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="magnifyingglass" tintColor={color} size={size} />
            ) : (
              <Feather name="search" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="my-games"
        options={{
          title: "My Games",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="calendar" tintColor={color} size={size} />
            ) : (
              <Feather name="calendar" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Rankings",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="trophy" tintColor={color} size={size} />
            ) : (
              <Ionicons name="trophy-outline" size={size} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) =>
            isIOS ? (
              <SymbolView name="person" tintColor={color} size={size} />
            ) : (
              <Feather name="user" size={size} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
