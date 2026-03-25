import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/colors";
import { POTM_ENTRIES, PotmEntry, PLAYERS, isEloPublic } from "@/constants/mock";

const CITIES = ["Bangkok", "Bali"];
const MEDAL_ICONS: Record<string, string> = { gold: "🥇", silver: "🥈", bronze: "🥉" };

function PodiumBlock({ entry, rank }: { entry: PotmEntry; rank: number }) {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const podiumColor = isFirst ? Colors.amber : isSecond ? Colors.muted : "#C4834A";
  const blockH = isFirst ? 80 : isSecond ? 55 : 44;
  const avatarSize = isFirst ? 60 : 46;

  const initials = entry.player.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarColors = [Colors.primary, Colors.blue, Colors.teal];
  const avatarBg = avatarColors[(rank - 1) % avatarColors.length];
  const medalIcon = rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉";

  return (
    <Pressable
      style={[styles.podiumItem, isFirst && styles.podiumItemCenter]}
      onPress={() => router.push({ pathname: "/player/[id]", params: { id: entry.player.id } })}
    >
      <View style={styles.podiumMeta}>
        {isFirst && (
          <View style={styles.winnerBadge}>
            <Text style={styles.winnerBadgeText}>BALLER OF THE MONTH</Text>
          </View>
        )}
        <Text style={styles.podiumMedal}>{medalIcon}</Text>
        <View
          style={[
            styles.podiumAvatar,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: avatarBg,
              borderWidth: isFirst ? 2 : 1,
              borderColor: isFirst ? Colors.amber : "transparent",
            },
          ]}
        >
          <Text style={[styles.podiumAvatarInitials, { fontSize: avatarSize * 0.36 }]}>
            {initials}
          </Text>
        </View>
        <Text style={styles.podiumName} numberOfLines={1}>
          {entry.player.name.split(" ")[0]}
        </Text>
        <Text style={[styles.podiumScore, { color: isFirst ? Colors.accent : Colors.text }]}>
          {entry.potmScore}
        </Text>
        <Text style={styles.podiumScoreLabel}>pts</Text>
      </View>
      <View
        style={[
          styles.podiumBlock,
          {
            height: blockH,
            backgroundColor: `${podiumColor}22`,
            borderTopWidth: 2,
            borderTopColor: podiumColor,
          },
        ]}
      >
        <Text style={[styles.podiumRankNum, { color: podiumColor }]}>#{rank}</Text>
      </View>
    </Pressable>
  );
}

function RankRow({ entry, isCurrentUser }: { entry: PotmEntry; isCurrentUser?: boolean }) {
  const topColors = [Colors.amber, Colors.muted, "#C4834A"];
  const rankColor = entry.rank <= 3 ? topColors[entry.rank - 1] : Colors.muted;
  const medal = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : null;

  const initials = entry.player.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarColors = [Colors.primary, Colors.blue, Colors.teal, Colors.purple, Colors.amber];
  const avatarBg = avatarColors[entry.rank % avatarColors.length];

  return (
    <Pressable
      style={[styles.rankRow, isCurrentUser && styles.rankRowCurrent]}
      onPress={() => router.push({ pathname: "/player/[id]", params: { id: entry.player.id } })}
    >
      <Text style={[styles.rankNum, { color: rankColor }]}>
        {entry.rank < 10 ? `0${entry.rank}` : entry.rank}
      </Text>
      <View style={[styles.rankAvatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.rankAvatarText}>{initials}</Text>
      </View>
      <View style={styles.rankInfo}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={styles.rankName}>
            {entry.player.name}
            {isCurrentUser ? " (You)" : ""}
          </Text>
          {medal && <Text style={{ fontSize: 13 }}>{medal}</Text>}
        </View>
        <Text style={styles.rankSub}>
          {isEloPublic(entry.player, PLAYERS) ? `${entry.player.eloRating} elo · ` : ""}{entry.gamesPlayed} games · {entry.wins}W
        </Text>
      </View>
      <Text style={styles.rankElo}>{isEloPublic(entry.player, PLAYERS) ? entry.player.eloRating : "—"}</Text>
      <Text style={[styles.rankScore, { color: Colors.accent }]}>{entry.potmScore}</Text>
    </Pressable>
  );
}

type RankMode = "botm" | "elo";
type EloTimePeriod = "month" | "alltime";

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const myCity = PLAYERS[0].basedIn ?? "Bangkok";
  const [city, setCity] = useState(CITIES.findIndex((c) => c === myCity) === -1 ? 0 : CITIES.findIndex((c) => c === myCity));
  const [rankMode, setRankMode] = useState<RankMode>("botm");
  const [eloPeriod, setEloPeriod] = useState<EloTimePeriod>("month");
  const [showFormula, setShowFormula] = useState(false);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const sortedEntries = rankMode === "botm"
    ? [...POTM_ENTRIES].sort((a, b) => b.potmScore - a.potmScore)
    : [...POTM_ENTRIES].sort((a, b) => b.player.eloRating - a.player.eloRating).map((e, i) => ({ ...e, rank: i + 1 }));

  const top3 = sortedEntries.slice(0, 3);
  const rest = sortedEntries.slice(3);

  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" }).toUpperCase();
  const year = now.getFullYear();

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <FlatList
        data={rest}
        keyExtractor={(item) => item.player.id}
        renderItem={({ item }) => (
          <RankRow entry={item} isCurrentUser={item.player.id === "p0"} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding + 90 }]}
        ListHeaderComponent={
          <>
            <View style={styles.topBar}>
              <Text style={styles.cityLabel}>BANGKOK</Text>
              <Text style={styles.logoText}>BALLR</Text>
              <Pressable style={styles.bellBtn} onPress={() => router.push("/notifications")}>
                <Ionicons name="notifications-outline" size={20} color={Colors.muted} />
              </Pressable>
            </View>

            <View style={styles.rankModeRow}>
              {([
                { id: "botm", label: "🏆 BALLER", sub: "Monthly ranking" },
                { id: "elo", label: "⚡ ELO", sub: "Performance rating" },
              ] as { id: RankMode; label: string; sub: string }[]).map((m) => (
                <Pressable
                  key={m.id}
                  style={[styles.rankModeBtn, rankMode === m.id && styles.rankModeBtnActive]}
                  onPress={() => setRankMode(m.id)}
                >
                  <Text style={[styles.rankModeBtnText, rankMode === m.id && styles.rankModeBtnTextActive]}>
                    {m.label}
                  </Text>
                  <Text style={styles.rankModeBtnSub}>{m.sub}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.monthHeader}>
              <Text style={styles.monthSub}>
                {rankMode === "botm" ? "BALLER OF THE MONTH" : "ELO RANKINGS"}
              </Text>
              <Text style={styles.monthTitle}>{rankMode === "botm" ? `${month} ${year}` : "Rankings"}</Text>
            </View>

            {rankMode === "elo" && (
              <View style={styles.eloPeriodRow}>
                {([
                  { id: "month", label: "This Month" },
                  { id: "alltime", label: "All Time" },
                ] as { id: EloTimePeriod; label: string }[]).map((p) => (
                  <Pressable
                    key={p.id}
                    style={[styles.eloPeriodBtn, eloPeriod === p.id && styles.eloPeriodBtnActive]}
                    onPress={() => setEloPeriod(p.id)}
                  >
                    <Text style={[styles.eloPeriodBtnText, eloPeriod === p.id && styles.eloPeriodBtnTextActive]}>
                      {p.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            {rankMode === "botm" && (
              <Pressable
                style={styles.formulaToggle}
                onPress={() => setShowFormula((v) => !v)}
              >
                <Ionicons name="information-circle-outline" size={14} color={Colors.muted} />
                <Text style={styles.formulaToggleText}>How is Baller of the Month calculated?</Text>
                <Ionicons
                  name={showFormula ? "chevron-up" : "chevron-down"}
                  size={13}
                  color={Colors.muted}
                />
              </Pressable>
            )}

            {showFormula && (
              <View style={styles.formulaCard}>
                <Text style={styles.formulaTitle}>Baller of the Month Score</Text>
                <Text style={styles.formulaDesc}>
                  A composite monthly score calculated from three factors:
                </Text>
                <View style={styles.formulaRows}>
                  <View style={styles.formulaRow}>
                    <View style={[styles.formulaDot, { backgroundColor: Colors.accent }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formulaFactor}>Win Rate</Text>
                      <Text style={styles.formulaWeight}>40% of score</Text>
                    </View>
                    <Text style={styles.formulaPct}>40%</Text>
                  </View>
                  <View style={styles.formulaRow}>
                    <View style={[styles.formulaDot, { backgroundColor: Colors.blue }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formulaFactor}>ELO Rating Improvement</Text>
                      <Text style={styles.formulaWeight}>Monthly ELO gain vs. previous month</Text>
                    </View>
                    <Text style={styles.formulaPct}>30%</Text>
                  </View>
                  <View style={styles.formulaRow}>
                    <View style={[styles.formulaDot, { backgroundColor: Colors.purple }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formulaFactor}>Community Quality & Reliability</Text>
                      <Text style={styles.formulaWeight}>Peer ratings + attendance record</Text>
                    </View>
                    <Text style={styles.formulaPct}>30%</Text>
                  </View>
                </View>
                <Text style={styles.formulaNote}>
                  Community ratings are factored in but not shown publicly. Rankings update monthly.
                </Text>
              </View>
            )}

            <View style={styles.cityTabs}>
              {CITIES.map((c, i) => (
                <Pressable
                  key={c}
                  style={[styles.cityTab, city === i && styles.cityTabActive]}
                  onPress={() => setCity(i)}
                >
                  <Text style={[styles.cityTabText, city === i && styles.cityTabTextActive]}>
                    {c}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.podiumContainer}>
              {top3.length >= 2 && <PodiumBlock entry={top3[1]} rank={top3[1].rank} />}
              {top3.length >= 1 && <PodiumBlock entry={top3[0]} rank={top3[0].rank} />}
              {top3.length >= 3 && <PodiumBlock entry={top3[2]} rank={top3[2].rank} />}
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                {rankMode === "botm" ? "FULL RANKINGS" : "ELO LADDER"}
              </Text>
              <View style={styles.listHeaderDivider} />
              <Text style={styles.listHeaderRight}>
                {rankMode === "botm" ? "PTS" : "ELO"}
              </Text>
            </View>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  cityLabel: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: Colors.muted, letterSpacing: 1.5 },
  logoText: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text, letterSpacing: 3 },
  bellBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  monthHeader: { alignItems: "center", paddingBottom: 10, gap: 4 },
  monthSub: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: Colors.muted, letterSpacing: 2.5 },
  monthTitle: { fontFamily: "Inter_700Bold", fontSize: 34, color: Colors.text, letterSpacing: -1 },
  cityTabs: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 3,
    marginBottom: 24,
  },
  cityTab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  cityTabActive: { backgroundColor: Colors.primary },
  cityTabText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.muted },
  cityTabTextActive: { color: Colors.text },
  podiumContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 28,
    gap: 6,
  },
  podiumItem: { flex: 1, alignItems: "center" },
  podiumItemCenter: { flex: 1.3 },
  podiumMeta: { alignItems: "center", paddingBottom: 8, gap: 2 },
  podiumMedal: { fontSize: 20, marginBottom: 2 },
  winnerBadge: {
    backgroundColor: `${Colors.accent}22`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: `${Colors.accent}44`,
    marginBottom: 2,
  },
  winnerBadgeText: { fontFamily: "Inter_700Bold", fontSize: 7, color: Colors.accent, letterSpacing: 1 },
  podiumAvatar: { alignItems: "center", justifyContent: "center" },
  podiumAvatarInitials: { fontFamily: "Inter_700Bold", color: Colors.text },
  podiumName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
    textAlign: "center",
    marginTop: 2,
  },
  podiumScore: { fontFamily: "Inter_700Bold", fontSize: 20 },
  podiumScoreLabel: { fontFamily: "Inter_400Regular", fontSize: 9, color: Colors.muted },
  podiumBlock: { width: "100%", borderRadius: 6, alignItems: "center", justifyContent: "center" },
  podiumRankNum: { fontFamily: "Inter_700Bold", fontSize: 13, marginTop: 4 },
  rankModeRow: { flexDirection: "row", gap: 10, marginHorizontal: 16, marginBottom: 20 },
  rankModeBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  rankModeBtnActive: { backgroundColor: `${Colors.primary}33`, borderColor: Colors.accent },
  rankModeBtnText: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.muted },
  rankModeBtnTextActive: { color: Colors.accent },
  rankModeBtnSub: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.muted },
  eloPeriodRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 3,
  },
  eloPeriodBtn: { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: "center" },
  eloPeriodBtnActive: { backgroundColor: Colors.primary },
  eloPeriodBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.muted },
  eloPeriodBtnTextActive: { color: Colors.text },
  formulaToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 8,
  },
  formulaToggleText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.muted },
  formulaCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  formulaTitle: { fontFamily: "Inter_700Bold", fontSize: 13, color: Colors.text },
  formulaDesc: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.muted },
  formulaRows: { gap: 10 },
  formulaRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  formulaDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  formulaFactor: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.text },
  formulaWeight: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.muted },
  formulaPct: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.accent, minWidth: 36, textAlign: "right" },
  formulaNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.muted,
    fontStyle: "italic",
    lineHeight: 16,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  listHeaderText: { fontFamily: "Inter_700Bold", fontSize: 10, color: Colors.muted, letterSpacing: 2 },
  listHeaderDivider: { flex: 1, height: 1, backgroundColor: Colors.separator },
  listHeaderRight: { fontFamily: "Inter_600SemiBold", fontSize: 9, color: Colors.muted, letterSpacing: 1 },
  listContent: { paddingHorizontal: 16 },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 11,
    marginBottom: 7,
    gap: 10,
  },
  rankRowCurrent: {
    borderWidth: 1,
    borderColor: `${Colors.accent}44`,
    backgroundColor: `${Colors.primary}18`,
  },
  rankNum: { fontFamily: "Inter_700Bold", fontSize: 13, width: 26, textAlign: "right", color: Colors.muted },
  rankAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  rankAvatarText: { fontFamily: "Inter_700Bold", fontSize: 13, color: Colors.text },
  rankInfo: { flex: 1, gap: 2 },
  rankName: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.text },
  rankSub: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.muted },
  rankElo: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: Colors.text, minWidth: 35, textAlign: "right" },
  rankScore: { fontFamily: "Inter_700Bold", fontSize: 13, minWidth: 30, textAlign: "right" },
});
