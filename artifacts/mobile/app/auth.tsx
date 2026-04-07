import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "signup";

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isWeb = Platform.OS === "web";
  const topPadding = isWeb ? 67 : insets.top;

  const validate = () => {
    if (mode === "signup" && name.trim().length < 2) return "Please enter your name";
    if (!email.includes("@")) return "Enter a valid email address";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      router.replace("/(tabs)");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          isWeb && styles.webScroll,
          { paddingTop: topPadding + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.webShell, isWeb && styles.webShellActive]}>
          <View style={[styles.webIntro, isWeb && styles.webIntroActive]}>
            <View style={styles.logo}>
              <View style={styles.logoBall}>
                <Text style={styles.logoBallIcon}>B</Text>
              </View>
              <Text style={styles.logoText}>BALLR</Text>
              <Text style={styles.logoSub}>Pickup football, perfected.</Text>
            </View>

            {isWeb ? (
              <View style={styles.webHeroCard}>
                <Text style={styles.webEyebrow}>Desktop BallR</Text>
                <Text style={styles.webHeroTitle}>
                  Same BallR account flow, rebuilt for a full browser window.
                </Text>
                <Text style={styles.webHeroBody}>
                  Sign in, browse games, manage leagues, and keep your player context visible
                  without the cramped mobile framing.
                </Text>
                <View style={styles.webFeatureList}>
                  <View style={styles.webFeaturePill}>
                    <Ionicons name="grid-outline" size={14} color={Colors.accent} />
                    <Text style={styles.webFeatureText}>Wide dashboard tabs</Text>
                  </View>
                  <View style={styles.webFeaturePill}>
                    <Ionicons name="people-outline" size={14} color={Colors.accent} />
                    <Text style={styles.webFeatureText}>League management</Text>
                  </View>
                  <View style={styles.webFeaturePill}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={14}
                      color={Colors.accent}
                    />
                    <Text style={styles.webFeatureText}>Protected beginner ratings</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          <View style={[styles.webAuthColumn, isWeb && styles.webAuthColumnActive]}>
            <View style={styles.card}>
              <View style={styles.modeTabs}>
                {(["login", "signup"] as Mode[]).map((m) => (
                  <Pressable
                    key={m}
                    style={[styles.modeTab, mode === m && styles.modeTabActive]}
                    onPress={() => {
                      setMode(m);
                      setError("");
                    }}
                  >
                    <Text style={[styles.modeTabText, mode === m && styles.modeTabTextActive]}>
                      {m === "login" ? "Log In" : "Sign Up"}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {mode === "signup" ? (
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>YOUR NAME</Text>
                  <View style={styles.inputRow}>
                    <Ionicons name="person-outline" size={16} color={Colors.muted} />
                    <TextInput
                      style={styles.input}
                      placeholder="Alex Thompson"
                      placeholderTextColor={Colors.muted}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              ) : null}

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>EMAIL</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="mail-outline" size={16} color={Colors.muted} />
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor={Colors.muted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={16} color={Colors.muted} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Min. 8 characters"
                    placeholderTextColor={Colors.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setShowPassword((value) => !value)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={16}
                      color={Colors.muted}
                    />
                  </Pressable>
                </View>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {mode === "login" ? (
                <Pressable style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  pressed && { opacity: 0.85 },
                  loading && { opacity: 0.7 },
                ]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.text} size="small" />
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>
                      {mode === "login" ? "Log In" : "Create Account"}
                    </Text>
                    <Feather name="arrow-right" size={16} color={Colors.text} />
                  </>
                )}
              </Pressable>

              {mode === "signup" ? (
                <Text style={styles.termsText}>
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </Text>
              ) : null}
            </View>

            <View style={[styles.dignityNote, isWeb && styles.webAuxCard]}>
              <Ionicons name="shield-checkmark" size={16} color={Colors.accent} />
              <Text style={styles.dignityNoteText}>
                Dignity Protection: Beginners never see their exact rating publicly.
              </Text>
            </View>

            <Pressable
              style={[styles.guestBtn, isWeb && styles.webGuestBtn]}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.guestBtnText}>Continue as guest -&gt;</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  webScroll: {
    minHeight: "100%",
    justifyContent: "center",
  },
  webShell: {
    width: "100%",
  },
  webShellActive: {
    maxWidth: 1180,
    alignSelf: "center",
    flexDirection: "row",
    gap: 28,
    alignItems: "stretch",
  },
  webIntro: {
    width: "100%",
  },
  webIntroActive: {
    flex: 1.02,
    gap: 18,
    justifyContent: "center",
  },
  webAuthColumn: {
    width: "100%",
  },
  webAuthColumnActive: {
    flex: 0.88,
    justifyContent: "center",
  },
  webHeroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.separator,
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  webEyebrow: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: Colors.accent,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  webHeroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 38,
    lineHeight: 44,
    color: Colors.text,
    letterSpacing: -1.2,
  },
  webHeroBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
    color: Colors.muted,
  },
  webFeatureList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  webFeaturePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  webFeatureText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
  },
  logo: {
    alignItems: "center",
    marginBottom: 32,
    gap: 6,
  },
  logoBall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  logoBallIcon: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: Colors.text,
  },
  logoText: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: Colors.text,
    letterSpacing: 5,
  },
  logoSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.muted,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 22,
    gap: 16,
    marginBottom: 20,
  },
  modeTabs: {
    flexDirection: "row",
    backgroundColor: Colors.overlay,
    borderRadius: 10,
    padding: 3,
    marginBottom: 4,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center",
  },
  modeTabActive: {
    backgroundColor: Colors.primary,
  },
  modeTabText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.muted,
  },
  modeTabTextActive: {
    color: Colors.text,
  },
  field: {
    gap: 7,
  },
  fieldLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.overlay,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.text,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.red,
    textAlign: "center",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: -4,
  },
  forgotText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.accent,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  submitBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  termsText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 16,
  },
  dignityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: `${Colors.primary}22`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${Colors.accent}33`,
  },
  webAuxCard: {
    marginBottom: 14,
  },
  dignityNoteText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 16,
  },
  guestBtn: {
    alignItems: "center",
  },
  webGuestBtn: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  guestBtnText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.muted,
  },
});
