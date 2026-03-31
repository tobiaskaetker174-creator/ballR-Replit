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
import { POTM_ENTRIES, PotmEntry, PLAYERS, isEloPublic, getFairnessScore, Player, getEloLabel } from "@/constants/mock";

const CITIES = ["Bangkok", "Bali"];

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

function RankRow({ entry, isCurrentUser, scoreLabel }: { entry: PotmEntry; isCurrentUser?: boolean; scoreLabel?: string }) {
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
      <Text style={styles.rankElo}>{isEloPublic(entry.player, PLAYERS) ? entry.player.eloRating : getEloLabel(entry.player.eloRating).label}</Text>
      <Text style={[styles.rankScore, { color: Colors.accent }]}>{scoreLabel ?? entry.potmScore}</Text>
    </Pressable>
  );
}

function FairnessPlayerRow({ player, rank, score }: { player: Player; rank: number; score: number }) {
  const initials = player.name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const avatarColors = [Colors.primary, Colors.blue, Colors.teal, Colors.purple, Colors.amber];
  const avatarBg = avatarColors[rank % avatarColors.length];
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
  const topColors = [Colors.amber, Colors.muted, "#C4834A"];
  const rankColor = rank <= 3 ? topColors[rank - 1] : Colors.muted;

  return (
    <Pressable
      style={styles.rankRow}
      onPress={() => router.push({ pathname: "/player/[id]", params: { id: player.id } })}
    >
      <Text style={[styles.rankNum, { color: rankColor }]}>
        {rank < 10 ? `0${rank}` : rank}
      </Text>
      <View style={[styles.rankAvatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.rankAvatarText}>{initials}</Text>
      </View>
      <View style={styles.rankInfo}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={styles.rankName}>{player.name}</Text>
          {medal && <Text style={{ fontSize: 13 }}>{medal}</Text>}
        </View>
        <Text style={styles.rankSub}>
          {player.reliabilityScore}% reliable · {player.avgSportsmanshipRating.toFixed(1)} spirit
        </Text>
      </View>
      <Text style={[styles.rankScore, { color: Colors.teal }]}>{score}</Text>
    </Pressable>
  );
}

type CommunityCategory = "fairness" | "elo" | "botm" | "gotm";

const CATEGORY_OPTIONS: { id: CommunityCategory; label: string; icon: string }[] = [
  { id: "fairness", label: "Fairness Award", icon: "shield-checkmark-outline" },
  { id: "elo", label: "Elo Ranking", icon: "flash-outline" },
  { id: "botm", label: "Baller of the Month", icon: "trophy-outline" },
  { id: "gotm", label: "Tor des Monats", icon: "football-outline" },
];

export default function LeaderboardScreen() {
  const insets = useSafeAreaInsets();
  const myCity = PLAYERS[0].basedIn ?? "Bangkok";
  const [city, setCity] = useState(CITIES.findIndex((c) => c === myCity) === -1 ? 0 : CITIES.findIndex((c) => c === myCity));
  const [category, setCategory] = useState<CommunityCategory>("elo");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFormula, setShowFormula] = useState(false);
  const [showFairnessFormula, setShowFairnessFormula] = useState(false);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" }).toUpperCase();
  const year = now.getFullYear();

  // ELO sorted entries for "Ranking"
  const eloSortedEntries = [...POTM_ENTRIES]
    .sort((a, b) => b.player.eloRating - a.player.eloRating)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  // BOTM sorted entries
  const botmSortedEntries = [...POTM_ENTRIES].sort((a, b) => b.potmScore - a.potmScore);

  // ELO Gainers this month
  const eloGainers = [...PLAYERS]
    .filter((p) => p.eloGainThisMonth !== undefined && p.eloGainThisMonth > 0)
    .sort((a, b) => (b.eloGainThisMonth ?? 0) - (a.eloGainThisMonth ?? 0));

  // Fairness sorted players
  const fairnessSorted = [...PLAYERS]
    .map((p) => ({ player: p, score: getFairnessScore(p) }))
    .sort((a, b) => b.score - a.score);

  const selectedCategory = CATEGORY_OPTIONS.find((c) => c.id === category);

  const getDisplayEntries = () => {
    if (category === "elo") return eloSortedEntries;
    if (category === "botm") return botmSortedEntries;
    return eloSortedEntries;
  };

  const displayEntries = getDisplayEntries();
  const top3 = displayEntries.slice(0, 3);
  const rest = displayEntries.slice(3);

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottomPadding + 90 }]}
      >
        <View style={styles.topBar}>
          <Text style={styles.cityLabel}>BANGKOK</Text>
          <Text style={styles.logoText}>BALLR</Text>
          <Pressable style={styles.bellBtn} onPress={() => router.push("/notifications")}>
            <Ionicons name="notifications-outline" size={20} color={Colors.muted} />
          </Pressable>
        </View>

        {/* Fix 5: Dropdown Category Selector */}
        <View style={styles.dropdownWrapper}>
          <Pressable
            style={styles.dropdownBtn}
            onPress={() => setShowDropdown((v) => !v)}
          >
            <Ionicons name={(selectedCategory?.icon ?? "list-outline") as keyof typeof Ionicons.glyphMap} size={18} color={Colors.accent} />
            <Text style={styles.dropdownBtnText}>{selectedCategory?.label ?? "Select Category"}</Text>
            <Ionicons
              name={showDropdown ? "chevron-up" : "chevron-down"}
              size={16}
              color={Colors.muted}
            />
          </Pressable>
          {showDropdown && (
            <View style={styles.dropdownMenu}>
              {CATEGORY_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.id}
                  style={[styles.dropdownItem, category === opt.id && styles.dropdownItemActive]}
                  onPress={() => {
                    setCategory(opt.id);
                    setShowDropdown(false);
                  }}
                >
                  <Ionicons name={opt.icon as keyof typeof Ionicons.glyphMap} size={16} color={category === opt.id ? Colors.accent : Colors.muted} />
                  <Text style={[styles.dropdownItemText, category === opt.id && styles.dropdownItemTextActive]}>
                    {opt.label}
                  </Text>
                  {category === opt.id && <Ionicons name="checkmark" size={16} color={Colors.accent} />}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Large heading for selected category */}
        <View style={styles.monthHeader}>
          <Text style={styles.monthSub}>
            {category === "botm" ? "BALLER OF THE MONTH" : category === "elo" ? "ELO RANKING" : category === "fairness" ? "FAIRNESS AWARD" : "TOR DES MONATS"}
          </Text>
          <Text style={styles.monthTitle}>
            {category === "botm" ? `${month} ${year}` : category === "elo" ? "Ranking" : category === "fairness" ? "Fair Play" : "Goal of the Month"}
          </Text>
        </View>

        {/* City Tabs */}
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

        {/* ===== ELO RANKING VIEW ===== */}
        {category === "elo" && (
          <>
            {/* All-time ELO Rankings */}
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>ALL-TIME ELO RANKINGS</Text>
              <View style={styles.listHeaderDivider} />
              <Text style={styles.listHeaderRight}>ELO</Text>
            </View>

            <View style={styles.podiumContainer}>
              {top3.length >= 2 && <PodiumBlock entry={top3[1]} rank={top3[1].rank} />}
              {top3.length >= 1 && <PodiumBlock entry={top3[0]} rank={top3[0].rank} />}
              {top3.length >= 3 && <PodiumBlock entry={top3[2]} rank={top3[2].rank} />}
            </View>

            {rest.map((item) => (
              <RankRow key={item.player.id} entry={item} isCurrentUser={item.player.id === "p0"} scoreLabel={String(item.player.eloRating)} />
            ))}

            {/* Biggest ELO Gainers This Month */}
            <View style={[styles.listHeader, { marginTop: 28 }]}>
              <Text style={styles.listHeaderText}>GR\u00D6SSTE ELO GAINER DIESEN MONAT</Text>
              <View style={styles.listHeaderDivider} />
              <Text style={styles.listHeaderRight}>+ELO</Text>
            </View>

            {eloGainers.map((player, i) => {
              const initials = player.name
                .split(" ")
                .map((n: string) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              const avatarColors = [Colors.primary, Colors.blue, Colors.teal, Colors.purple, Colors.amber];
              const avatarBg = avatarColors[(i + 1) % avatarColors.length];
              return (
                <Pressable
                  key={player.id}
                  style={[styles.rankRow, player.id === "p0" && styles.rankRowCurrent]}
                  onPress={() => router.push({ pathname: "/player/[id]", params: { id: player.id } })}
                >
                  <Text style={[styles.rankNum, { color: i < 3 ? Colors.amber : Colors.muted }]}>
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </Text>
                  <View style={[styles.rankAvatar, { backgroundColor: avatarBg }]}>
                    <Text style={styles.rankAvatarText}>{initials}</Text>
                  </View>
                  <View style={styles.rankInfo}>
                    <Text style={styles.rankName}>{player.name}{player.id === "p0" ? " (You)" : ""}</Text>
                    <Text style={styles.rankSub}>{player.eloRating} elo · {player.gamesPlayed} games</Text>
                  </View>
                  <Text style={[styles.rankScore, { color: Colors.accent }]}>+{player.eloGainThisMonth}</Text>
                </Pressable>
              );
            })}

            {/* Baller of the Month section below */}
            <View style={[styles.listHeader, { marginTop: 28 }]}>
              <Text style={styles.listHeaderText}>BALLER OF THE MONTH</Text>
              <View style={styles.listHeaderDivider} />
              <Text style={styles.listHeaderRight}>PTS</Text>
            </View>

            {botmSortedEntries.slice(0, 5).map((item) => (
              <RankRow key={`botm-${item.player.id}`} entry={item} isCurrentUser={item.player.id === "p0"} />
            ))}
          </>
        )}

        {/* ===== BALLER OF THE MONTH VIEW ===== */}
        {category === "botm" && (
          <>
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

            <View style={styles.podiumContainer}>
              {top3.length >= 2 && <PodiumBlock entry={top3[1]} rank={top3[1].rank} />}
              {top3.length >= 1 && <PodiumBlock entry={top3[0]} rank={top3[0].rank} />}
              {top3.length >= 3 && <PodiumBlock entry={top3[2]} rank={top3[2].rank} />}
            </View>

            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>FULL RANKINGS</Text>
              <View style={styles.listHeaderDivider} />
              <Text style={styles.listHeaderRight}>PTS</Text>
            </View>

            {rest.map((item) => (
              <RankRow key={item.player.id} entry={item} isCurrentUser={item.player.id === "p0"} />
            ))}
          </>
        )}

        {/* ===== FAIRNESS AWARD VIEW ===== */}
        {category === "fairness" && (
          <>
            {/* Fix 4: Expandable fairness formula */}
            <Pressable
              style={styles.formulaToggle}
              onPress={() => setShowFairnessFormula((v) => !v)}
            >
              <Ionicons name="information-circle-outline" size={14} color={Colors.muted} />
              <Text style={styles.formulaToggleText}>How is the Fairness Award calculated?</Text>
              <Ionicons
                name={showFairnessFormula ? "chevron-up" : "chevron-down"}
                size={13}
                color={Colors.muted}
              />
            </Pressable>

            {showFairnessFormula && (
              <View style={styles.formulaCard}>
                <Text style={styles.formulaTitle}>Fairness Award Score</Text>
                <Text style={styles.formulaDesc}>
                  A composite score rewarding fair, reliable, and sportsmanlike players:
                </Text>
                <View style={styles.formulaRows}>
                  <View style={styles.formulaRow}>
                    <View style={[styles.formulaDot, { backgroundColor: Colors.teal }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formulaFactor}>Reliability Score</Text>
                      <Text style={styles.formulaWeight}>Attendance and punctuality record</Text>
                    </View>
                    <Text style={styles.formulaPct}>40%</Text>
                  </View>
                  <View style={styles.formulaRow}>
                    <View style={[styles.formulaDot, { backgroundColor: Colors.accent }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formulaFactor}>Sportsmanship Rating</Text>
                      <Text style={styles.formulaWeight}>Peer-rated spirit score (normalized to 100)</Text>
                    </View>
                    <Text style={styles.formulaPct}>40%</Text>
                  </View>
                  <View style={styles.formulaRow}>
                    <View style={[styles.formulaDot, { backgroundColor: Colors.red }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.formulaFactor}>Fair Play Record</Text>
                      <Text style={styles.formulaWeight}>No-show penalty (-10 per no-show)</Text>
                    </View>
                    <Text style={styles.formulaPct}>-20%</Text>
                  </View>
                </View>
                <Text style={styles.formulaNote}>
                  Players who show up consistently and play with good sportsmanship score highest.
                </Text>
              </View>
            )}

            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>FAIRNESS RANKINGS</Text>
              <View style={styles.listHeaderDivider} />
              <Text style={styles.listHeaderRight}>SCORE</Text>
            </View>

            {fairnessSorted.map((item, i) => (
              <FairnessPlayerRow key={item.player.id} player={item.player} rank={i + 1} score={item.score} />
            ))}
          </>
        )}

        {/* ===== TOR DES MONATS VIEW ===== */}
        {category === "gotm" && (
          <>
            <View style={{ alignItems: "center", paddingVertical: 40, gap: 12, paddingHorizontal: 32 }}>
              <Ionicons name="football-outline" size={48} color={Colors.muted} />
              <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text, textAlign: "center" }}>
                Tor des Monats
              </Text>
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.muted, textAlign: "center", lineHeight: 20 }}>
                Goal of the Month voting will open soon. Submit your best goals from this month's matches!
              </Text>
            </View>
          </>
        )}
      </ScrollView>
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
  dropdownWrapper: { marginHorizontal: 16, marginBottom: 16, zIndex: 10 },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  dropdownBtnText: { flex: 1, fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.text },
  dropdownMenu: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.separator,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  dropdownItemActive: { backgroundColor: `${Colors.primary}33` },
  dropdownItemText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.muted },
  dropdownItemTextActive: { color: Colors.accent, fontFamily: "Inter_600SemiBold" },
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
