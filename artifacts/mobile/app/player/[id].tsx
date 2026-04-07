import { Ionicons, Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import {
  PLAYERS,
  PROFILE_REVIEWS,
  getEloLabel,
  getReliabilityColor,
  getReliabilityLabel,
  formatTimestamp,
  isEloPublic,
  getEloPercentile,
} from "@/constants/mock";

export default function PlayerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;
  const isDesktopWeb = Platform.OS === "web" && width >= 1180;
  const desktopWidth = Math.min(width - 40, 980);

  const player = PLAYERS.find((p) => p.id === id);

  if (!player) {
    return (
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <View style={styles.navBar}>
          <Pressable style={styles.navBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </Pressable>
          <Text style={styles.navTitle}>PLAYER PROFILE</Text>
          <View style={styles.navBtn} />
        </View>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 32 }}>
          <Ionicons name="person-outline" size={48} color={Colors.muted} />
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text, textAlign: "center" }}>
            Player Not Found
          </Text>
          <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.muted, textAlign: "center" }}>
            This player profile does not exist or may have been removed.
          </Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: Colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 12,
              marginTop: 8,
            }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={16} color={Colors.text} />
            <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text }}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isCurrentUser = player.isCurrentUser;
  const eloTier = getEloLabel(player.eloRating);
  const reliabilityColor = getReliabilityColor(player.reliabilityScore);
  const reliabilityLabel = getReliabilityLabel(player.reliabilityScore);
  const initials = player.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const winRate = player.gamesPlayed > 0 ? Math.round((player.gamesWon / player.gamesPlayed) * 100) : 0;
  const eloPublicForPlayer = isCurrentUser || isEloPublic(player, PLAYERS);
  const reviews = PROFILE_REVIEWS.filter((r) => r.status === "accepted" && r.subjectId === player.id);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const POSITIONS_LABELS: Record<string, string> = {
    GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward",
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {isDesktopWeb ? (
        <>
          <View pointerEvents="none" style={styles.desktopGlowPrimary} />
          <View pointerEvents="none" style={styles.desktopGlowSecondary} />
        </>
      ) : null}
      <View style={isDesktopWeb ? [styles.desktopShell, { maxWidth: desktopWidth }] : undefined}>
      <View style={styles.navBar}>
        <Pressable style={styles.navBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </Pressable>
        <Text style={styles.navTitle}>PLAYER PROFILE</Text>
        {!isCurrentUser && (
          <Pressable
            style={styles.navBtn}
            onPress={() => router.push({ pathname: "/report/[id]", params: { id: player.id } })}
          >
            <Ionicons name="flag-outline" size={18} color={Colors.muted} />
          </Pressable>
        )}
        {isCurrentUser && <View style={styles.navBtn} />}
      </View>

      <ScrollView
        style={isDesktopWeb ? styles.desktopScroll : undefined}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding + 30 }}
      >
        <View style={styles.heroSection}>
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            {player.medal && (
              <View style={styles.medalBubble}>
                <Text style={{ fontSize: 16 }}>
                  {player.medal === "gold" ? "🥇" : player.medal === "silver" ? "🥈" : "🥉"}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.playerName}>{player.name}</Text>

          <View style={styles.playerSubRow}>
            <Text style={styles.playerSub}>{player.nationality}</Text>
            <Text style={styles.playerSubDot}>·</Text>
            <Text style={styles.playerSub}>{player.basedIn}</Text>
          </View>

          {player.winStreak && player.winStreak > 1 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={13} color={Colors.amber} />
              <Text style={styles.streakText}>{player.winStreak}-game win streak</Text>
            </View>
          )}

          {eloPublicForPlayer ? (
            <>
              <View style={[styles.eloChip, { backgroundColor: `${eloTier.color}22` }]}>
                <Text style={[styles.eloChipText, { color: eloTier.color }]}>
                  {player.eloRating} ELO · {eloTier.tier} {eloTier.label}
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.muted }}>
                Your ELO is better than {Math.round(getEloPercentile(player, PLAYERS) * 100)}% of players
              </Text>
            </>
          ) : (
            <View style={[styles.eloChip, { backgroundColor: Colors.overlay, flexDirection: "row", alignItems: "center", gap: 5 }]}>
              <Ionicons name="lock-closed" size={11} color={Colors.muted} />
              <Text style={[styles.eloChipText, { color: Colors.muted }]}>Private ELO</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{player.gamesPlayed}</Text>
            <Text style={styles.statLabel}>GAMES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={[styles.statValue, { color: Colors.accent }]}>{winRate}%</Text>
            <Text style={styles.statLabel}>WIN RATE</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={[styles.statValue, { color: reliabilityColor }]}>{player.reliabilityScore}%</Text>
            <Text style={styles.statLabel}>RELIABILITY</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{player.avgSportsmanshipRating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>SPIRIT ⭐</Text>
          </View>
        </View>

        {player.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ABOUT</Text>
            <Text style={styles.bioText}>{player.bio}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>POSITION</Text>
              <Text style={styles.infoValue}>
                {player.preferredPositions.map((p) => POSITIONS_LABELS[p] ?? p).join(", ")}
              </Text>
            </View>
            <View style={styles.infoSep} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>RELIABILITY</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={[styles.dot, { backgroundColor: reliabilityColor }]} />
                <Text style={[styles.infoValue, { color: reliabilityColor }]}>
                  {player.reliabilityScore}% · {reliabilityLabel}
                </Text>
              </View>
            </View>
            <View style={styles.infoSep} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>RECORD</Text>
              <Text style={styles.infoValue}>
                {player.gamesWon}W · {player.gamesLost}L · {player.gamesDrawn}D
              </Text>
            </View>
            {player.favoriteTeam && (
              <>
                <View style={styles.infoSep} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>SUPPORTS</Text>
                  <Text style={styles.infoValue}>{player.favoriteTeam}</Text>
                </View>
              </>
            )}
            {player.favoritePlayer && (
              <>
                <View style={styles.infoSep} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>PLAYS LIKE</Text>
                  <Text style={styles.infoValue}>{player.favoritePlayer}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {(player.instagram || player.whatsapp) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SOCIAL LINKS</Text>
            <View style={styles.socialRow}>
              {player.instagram && (
                <View style={styles.socialChip}>
                  <Ionicons name="logo-instagram" size={15} color={Colors.purple} />
                  <Text style={[styles.socialText, { color: Colors.purple }]}>@{player.instagram}</Text>
                </View>
              )}
              {player.whatsapp && (
                <View style={styles.socialChip}>
                  <Ionicons name="logo-whatsapp" size={15} color={Colors.accent} />
                  <Text style={[styles.socialText, { color: Colors.accent }]}>{player.whatsapp}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMMUNITY REVIEWS</Text>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>
                      {review.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewAuthor}>{review.author.name}</Text>
                    <Text style={styles.reviewTime}>{formatTimestamp(review.createdAt)}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>
        )}

        {!isCurrentUser && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LEAVE A REVIEW</Text>
            {reviewSubmitted ? (
              <View style={styles.reviewSentCard}>
                <Ionicons name="checkmark-circle" size={22} color={Colors.accent} />
                <View>
                  <Text style={styles.reviewSentTitle}>Review sent!</Text>
                  <Text style={styles.reviewSentSub}>
                    {player.name.split(" ")[0]} will approve it before it shows publicly.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.reviewForm}>
                <TextInput
                  style={styles.reviewInput}
                  placeholder={`Share your experience playing with ${player.name.split(" ")[0]}...`}
                  placeholderTextColor={Colors.muted}
                  value={reviewText}
                  onChangeText={setReviewText}
                  multiline
                  numberOfLines={3}
                  maxLength={300}
                  textAlignVertical="top"
                />
                <View style={styles.reviewFormBottom}>
                  <Text style={styles.reviewCharCount}>{reviewText.length}/300</Text>
                  <Pressable
                    style={[styles.reviewSubmitBtn, reviewText.trim().length < 10 && styles.reviewSubmitBtnDisabled]}
                    disabled={reviewText.trim().length < 10}
                    onPress={() => setReviewSubmitted(true)}
                  >
                    <Ionicons name="send" size={13} color={Colors.text} />
                    <Text style={styles.reviewSubmitBtnText}>Submit for Approval</Text>
                  </Pressable>
                </View>
                <Text style={styles.reviewModNote}>
                  Reviews are moderated by the player before appearing publicly.
                </Text>
              </View>
            )}
          </View>
        )}

        {!isCurrentUser && (
          <View style={styles.section}>
            <Pressable
              style={styles.reportBtn}
              onPress={() => router.push({ pathname: "/report/[id]", params: { id: player.id } })}
            >
              <Ionicons name="flag-outline" size={15} color={Colors.muted} />
              <Text style={styles.reportBtnText}>Report this player</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  desktopShell: {
    width: "100%",
    alignSelf: "center",
    flex: 1,
  },
  desktopScroll: {
    width: "100%",
  },
  desktopGlowPrimary: {
    position: "absolute",
    top: 120,
    left: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(45, 90, 39, 0.16)",
  },
  desktopGlowSecondary: {
    position: "absolute",
    top: 300,
    right: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(91, 143, 232, 0.07)",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  navBtn: {
    width: 36,
    height: 36,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.text,
    letterSpacing: 2.5,
  },
  heroSection: { alignItems: "center", paddingVertical: 24, paddingHorizontal: 16, gap: 6 },
  avatarOuter: {
    position: "relative",
    marginBottom: 4,
  },
  avatarInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  avatarInitials: { fontFamily: "Inter_700Bold", fontSize: 30, color: Colors.text },
  medalBubble: {
    position: "absolute",
    bottom: -4,
    right: -6,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 2,
  },
  playerName: { fontFamily: "Inter_700Bold", fontSize: 24, color: Colors.text, letterSpacing: -0.3 },
  playerSubRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  playerSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.muted },
  playerSubDot: { color: Colors.muted },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: `${Colors.amber}15`,
  },
  streakText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: Colors.amber },
  eloChip: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
  },
  eloChipText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
    ...(Platform.OS === "web"
      ? {
          borderWidth: 1,
          borderColor: Colors.separator,
          shadowColor: Colors.base,
          shadowOpacity: 0.16,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 10 },
        }
      : {}),
  },
  statCell: { flex: 1, alignItems: "center", gap: 3 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 9, color: Colors.muted, letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: Colors.separator, marginVertical: 4 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  bioText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.muted, lineHeight: 20 },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: "hidden",
    ...(Platform.OS === "web"
      ? {
          borderWidth: 1,
          borderColor: Colors.separator,
          shadowColor: Colors.base,
          shadowOpacity: 0.14,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 8 },
        }
      : {}),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  infoLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: Colors.muted, letterSpacing: 0.5 },
  infoValue: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.text },
  infoSep: { height: 1, backgroundColor: Colors.separator, marginHorizontal: 14 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  socialRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  socialChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  socialText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
    gap: 8,
    ...(Platform.OS === "web"
      ? {
          borderWidth: 1,
          borderColor: Colors.separator,
        }
      : {}),
  },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blue + "44",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: { fontFamily: "Inter_700Bold", fontSize: 11, color: Colors.blue },
  reviewAuthor: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.text },
  reviewTime: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.muted },
  reviewText: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.muted, lineHeight: 19 },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  reportBtnText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.muted },
  reviewForm: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  reviewInput: {
    backgroundColor: Colors.overlay,
    borderRadius: 10,
    padding: 12,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: "top" as any,
  },
  reviewFormBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewCharCount: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.muted },
  reviewSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  reviewSubmitBtnDisabled: { opacity: 0.4 },
  reviewSubmitBtnText: { fontFamily: "Inter_700Bold", fontSize: 12, color: Colors.text },
  reviewModNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    color: Colors.muted,
    textAlign: "center" as any,
    lineHeight: 14,
  },
  reviewSentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: `${Colors.primary}22`,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: `${Colors.accent}33`,
  },
  reviewSentTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  reviewSentSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.muted, marginTop: 2 },
});
