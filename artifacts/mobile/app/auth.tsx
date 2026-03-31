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
import Svg, { Circle, Defs, Line, LinearGradient, Polygon, Rect, Stop } from "react-native-svg";
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

  const validate = () => {
    if (mode === "signup" && name.trim().length < 2) return "Please enter your name";
    if (!email.includes("@")) return "Enter a valid email address";
    if (password.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
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
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPadding + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logo}>
          <Svg width={64} height={64} viewBox="0 0 32 32" style={{ marginBottom: 8 }}>
            <Defs>
              <LinearGradient id="ballr-auth-bg" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                <Stop offset="0%" stopColor="#B8D8AB" />
                <Stop offset="100%" stopColor="#8FC07C" />
              </LinearGradient>
            </Defs>
            <Rect x="1" y="1" width="30" height="30" rx="7" fill="url(#ballr-auth-bg)" />
            <Circle cx="16" cy="15" r="8.5" fill="none" stroke="#2A3525" strokeWidth="1.5" />
            <Polygon points="16,10 19.8,12.8 18.3,17.4 13.7,17.4 12.2,12.8" fill="#2A3525" />
            <Line x1="16" y1="10" x2="16" y2="6.5" stroke="#2A3525" strokeWidth="1.4" />
            <Line x1="19.8" y1="12.8" x2="23.8" y2="11.5" stroke="#2A3525" strokeWidth="1.4" />
            <Line x1="18.3" y1="17.4" x2="20.7" y2="21.2" stroke="#2A3525" strokeWidth="1.4" />
            <Line x1="13.7" y1="17.4" x2="11.3" y2="21.2" stroke="#2A3525" strokeWidth="1.4" />
            <Line x1="12.2" y1="12.8" x2="8.2" y2="11.5" stroke="#2A3525" strokeWidth="1.4" />
          </Svg>
          <Text style={styles.logoText}>BALLR</Text>
          <Text style={styles.logoSub}>Pickup football, perfected.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.modeTabs}>
            {(["login", "signup"] as Mode[]).map((m) => (
              <Pressable
                key={m}
                style={[styles.modeTab, mode === m && styles.modeTabActive]}
                onPress={() => { setMode(m); setError(""); }}
              >
                <Text style={[styles.modeTabText, mode === m && styles.modeTabTextActive]}>
                  {m === "login" ? "Log In" : "Sign Up"}
                </Text>
              </Pressable>
            ))}
          </View>

          {mode === "signup" && (
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
          )}

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
              <Pressable onPress={() => setShowPassword((v) => !v)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={16} color={Colors.muted} />
              </Pressable>
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {mode === "login" && (
            <Pressable style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }, loading && { opacity: 0.7 }]}
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

          {mode === "signup" && (
            <Text style={styles.termsText}>
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </Text>
          )}
        </View>

        <View style={styles.dignityNote}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.accent} />
          <Text style={styles.dignityNoteText}>
            Dignity Protection: Beginners never see their exact rating publicly.
          </Text>
        </View>

        <Pressable
          style={styles.guestBtn}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.guestBtnText}>Continue as guest →</Text>
        </Pressable>
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
  logo: {
    alignItems: "center",
    marginBottom: 32,
    gap: 6,
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
  guestBtnText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.muted,
  },
});
