import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import Colors from "@/constants/colors";
import { AuthProvider } from "@/context/AuthContext";
import { LeagueProvider } from "@/context/LeagueContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <AuthProvider>
      <LeagueProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.base },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="game/[id]" options={{ headerShown: false, presentation: "card" }} />
          <Stack.Screen name="chat/[id]" options={{ headerShown: false, presentation: "card" }} />
          <Stack.Screen name="rate/[id]" options={{ headerShown: false, presentation: "card" }} />
          <Stack.Screen name="organizer/[id]" options={{ headerShown: false, presentation: "card" }} />
          <Stack.Screen name="create-game" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="create-league" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="join-league" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="league-settings" options={{ headerShown: false, presentation: "card" }} />
          <Stack.Screen name="notifications" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="player/[id]" options={{ headerShown: false, presentation: "card" }} />
          <Stack.Screen name="analytics" options={{ headerShown: false, presentation: "card" }} />
          <Stack.Screen name="report/[id]" options={{ headerShown: false, presentation: "modal" }} />
          <Stack.Screen name="reviews" options={{ headerShown: false, presentation: "card" }} />
          <Stack.Screen name="admin" options={{ headerShown: false, presentation: "card" }} />
        </Stack>
      </LeagueProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ...Ionicons.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
