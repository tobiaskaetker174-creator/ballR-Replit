import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState, useMemo, useRef } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Path, Stop } from "react-native-svg";
import Colors from "@/constants/colors";
import {
  GAMES,
  NOTIFICATIONS,
  Game,
  SkillLevel,
  formatGameTime,
  formatPrice,
  getSkillColor,
  getSkillLabel,
} from "@/constants/mock";

const CITIES = [
  { id: "all", label: "All" },
  { id: "bangkok", label: "Bangkok" },
  { id: "bali", label: "Bali" },
];

const SKILL_FILTERS: { id: SkillLevel | "all"; label: string }[] = [
  { id: "all", label: "ALL GAMES" },
  { id: "beginner", label: "BEGINNER" },
  { id: "intermediate", label: "INTERMEDIATE" },
  { id: "advanced", label: "ADVANCED" },
  { id: "mixed", label: "MIXED" },
];

type DateFilter = "all" | "today" | "tomorrow" | "weekend" | "week";
const DATE_FILTERS: { id: DateFilter; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "all", label: "Any Date", icon: "calendar-outline" },
  { id: "today", label: "Today", icon: "today-outline" },
  { id: "tomorrow", label: "Tomorrow", icon: "arrow-forward-circle-outline" },
  { id: "weekend", label: "Weekend", icon: "sunny-outline" },
  { id: "week", label: "This Week", icon: "calendar-number-outline" },
];

type EloFilter = "all" | "casual" | "mid" | "competitive" | "elite";
const ELO_FILTERS: { id: EloFilter; label: string; range: [number, number] }[] = [
  { id: "all", label: "All Levels", range: [0, 9999] },
  { id: "casual", label: "Casual (<900)", range: [0, 899] },
  { id: "mid", label: "Rec (900–1200)", range: [900, 1200] },
  { id: "competitive", label: "Comp (1200+)", range: [1200, 9999] },
];

function isDateMatch(gameTime: string, filter: DateFilter): boolean {
  const now = new Date();
  const game = new Date(gameTime);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
  const startOfDayAfterTomorrow = new Date(startOfTomorrow.getTime() + 86400000);
  const dayOfWeek = now.getDay();
  const daysUntilWeekend = dayOfWeek === 6 ? 0 : dayOfWeek === 0 ? 0 : 6 - dayOfWeek;
  const startOfWeekend = new Date(startOfToday.getTime() + daysUntilWeekend * 86400000);
  const endOfWeekend = new Date(startOfWeekend.getTime() + 2 * 86400000);
  const endOfWeek = new Date(startOfToday.getTime() + 7 * 86400000);

  switch (filter) {
    case "today": return game >= startOfToday && game < startOfTomorrow;
    case "tomorrow": return game >= startOfTomorrow && game < startOfDayAfterTomorrow;
    case "weekend": return game >= startOfWeekend && game < endOfWeekend;
    case "week": return game >= startOfToday && game < endOfWeek;
    default: return true;
  }
}

function CompactGameCard({ game }: { game: Game }) {
  const skillColor = getSkillColor(game.skillLevel);
  const isFull = game.status === "full" || game.currentPlayers >= game.maxPlayers;

  return (
    <Pressable
      style={({ pressed }) => [styles.compactCard, pressed && { opacity: 0.8 }]}
      onPress={() => router.push({ pathname: "/game/[id]", params: { id: game.id } })}
    >
      <View style={styles.compactCardTop}>
        <View style={styles.compactCardLeft}>
          <Text style={styles.compactVenue} numberOfLines={1}>{game.venue.name}</Text>
          <View style={styles.compactMeta}>
            <Ionicons name="location-outline" size={11} color={Colors.muted} />
            <Text style={styles.compactMetaText}>{game.venue.address.split(",")[0]}</Text>
          </View>
        </View>
        <View style={styles.compactRight}>
          <Text style={styles.compactPrice}>{formatPrice(game.pricePerPlayer, game.cityId)}</Text>
          {isFull ? (
            <View style={[styles.openBadge, { backgroundColor: `${Colors.red}22` }]}>
              <Text style={[styles.openBadgeText, { color: Colors.red }]}>Full</Text>
            </View>
          ) : (
            <View style={styles.openBadge}>
              <Text style={styles.openBadgeText}>Open</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.compactStats}>
        <View style={styles.compactStat}>
          <Ionicons name="time-outline" size={11} color={Colors.muted} />
          <Text style={styles.compactStatText}>{formatGameTime(game.gameTime)}</Text>
        </View>
        <View style={styles.compactStatDot} />
        <View style={styles.compactStat}>
          <Ionicons name="people-outline" size={11} color={Colors.muted} />
          <Text style={styles.compactStatText}>{game.currentPlayers}/{game.maxPlayers}</Text>
        </View>
        <View style={styles.compactStatDot} />
        <Text style={styles.compactStatText}>{game.durationMinutes}min</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.joinMatchBtn, pressed && { opacity: 0.85 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({ pathname: "/game/[id]", params: { id: game.id } });
        }}
      >
        <Text style={styles.joinMatchBtnText}>JOIN MATCH</Text>
      </Pressable>
    </Pressable>
  );
}

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<DateFilter>("all");
  const [selectedElo, setSelectedElo] = useState<EloFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const eloRange = ELO_FILTERS.find((e) => e.id === selectedElo)?.range ?? [0, 9999];

  const filteredGames = useMemo(() => {
    return GAMES.filter((g) => {
      if (selectedCity !== "all" && g.cityId !== selectedCity) return false;
      if (selectedSkill !== "all" && g.skillLevel !== selectedSkill) return false;
      if (!isDateMatch(g.gameTime, selectedDate)) return false;
      if (g.avgElo < eloRange[0] || g.avgElo > eloRange[1]) return false;
      return true;
    }).sort((a, b) => new Date(a.gameTime).getTime() - new Date(b.gameTime).getTime());
  }, [selectedCity, selectedSkill, selectedDate, selectedElo]);

  const activeFilterCount = [
    selectedCity !== "all",
    selectedSkill !== "all",
    selectedDate !== "all",
    selectedElo !== "all",
  ].filter(Boolean).length;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const featuredGame = GAMES[0];

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CompactGameCard game={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding + 110 }}
        ListHeaderComponent={
          <>
            <View style={[styles.topBar, { paddingTop: topPadding }]}>
              <View style={styles.topBarLeft}>
                {selectedCity !== "all" && (
                  <View style={styles.cityActiveChip}>
                    <Ionicons name="location" size={11} color={Colors.accent} />
                    <Text style={styles.cityActiveText}>{CITIES.find(c => c.id === selectedCity)?.label}</Text>
                  </View>
                )}
              </View>

              <View style={styles.logoRow}>
                <Svg width={22} height={22} viewBox="0 0 32 32">
                  <Defs>
                    <SvgLinearGradient id="idx-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                      <Stop offset="0%" stopColor="#A1D494" />
                      <Stop offset="100%" stopColor="#2D5A27" />
                    </SvgLinearGradient>
                  </Defs>
                  <Circle cx="16" cy="16" r="15" fill="url(#idx-grad)" />
                  <Path d="M16 1 A15 15 0 0 1 31 16 L16 16 Z" fill="#2D5A27" fillOpacity="0.6" />
                  <Circle cx="16" cy="16" r="4" fill="#141312" fillOpacity="0.5" />
                </Svg>
                <Text style={styles.logoText}>BALLR</Text>
              </View>

              <Pressable style={styles.bellBtn} onPress={() => router.push("/notifications")}>
                <Ionicons name="notifications-outline" size={20} color={Colors.muted} />
                {unreadCount > 0 && (
                  <View style={styles.bellBadge}>
                    <Text style={styles.bellBadgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.featuredSection}>
              <Text style={styles.featuredLabel}>FEATURED PITCH</Text>
              <Pressable
                style={styles.featuredCard}
                onPress={() => router.push({ pathname: "/game/[id]", params: { id: featuredGame.id } })}
              >
                <Image
                  source={featuredGame.venue.imageUrl ? { uri: featuredGame.venue.imageUrl } : require("../../assets/images/featured_pitch.jpg")}
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(20,19,18,0.92)"]}
                  style={styles.featuredGradient}
                />
                <View style={styles.featuredOverlay}>
                  <View style={styles.featuredOverlayTop}>
                    <View style={styles.featuredGameBadge}>
                      <Text style={styles.featuredGameBadgeText}>GAME DETAILS</Text>
                    </View>
                  </View>
                  <View style={styles.featuredOverlayBottom}>
                    <Text style={styles.featuredVenue}>{featuredGame.venue.name}</Text>
                    <View style={styles.featuredMeta}>
                      <Text style={styles.featuredMetaText}>{formatGameTime(featuredGame.gameTime)}</Text>
                      <Text style={styles.featuredMetaDot}>·</Text>
                      <Text style={styles.featuredMetaText}>{featuredGame.currentPlayers}/{featuredGame.maxPlayers} players</Text>
                    </View>
                    <View style={styles.featuredPriceRow}>
                      <Text style={styles.featuredPrice}>{formatPrice(featuredGame.pricePerPlayer, featuredGame.cityId)}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.filterTopRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                  {SKILL_FILTERS.map((sf) => (
                    <Pressable
                      key={sf.id}
                      style={[styles.filterPill, selectedSkill === sf.id && styles.filterPillActive]}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedSkill(sf.id);
                      }}
                    >
                      <Text style={[styles.filterPillText, selectedSkill === sf.id && styles.filterPillTextActive]}>
                        {sf.label}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <Pressable
                  style={[styles.filterToggleBtn, showFilters && styles.filterToggleBtnActive, activeFilterCount > 0 && !showFilters && styles.filterToggleBtnBadge]}
                  onPress={() => { Haptics.selectionAsync(); setShowFilters((v) => !v); }}
                >
                  <Ionicons name="options-outline" size={15} color={showFilters ? Colors.text : Colors.muted} />
                  {activeFilterCount > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                    </View>
                  )}
                </Pressable>
              </View>

              {showFilters && (
                <View style={styles.expandedFilters}>
                  <Text style={styles.expandedFilterLabel}>CITY</Text>
                  <View style={styles.filterRow}>
                    {CITIES.map((c) => (
                      <Pressable
                        key={c.id}
                        style={[styles.dateChip, selectedCity === c.id && styles.dateChipActive]}
                        onPress={() => { Haptics.selectionAsync(); setSelectedCity(c.id); }}
                      >
                        {c.id !== "all" && <Ionicons name="location-outline" size={12} color={selectedCity === c.id ? Colors.text : Colors.muted} />}
                        <Text style={[styles.dateChipText, selectedCity === c.id && styles.dateChipTextActive]}>
                          {c.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={[styles.expandedFilterLabel, { marginTop: 10 }]}>DATE</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                    {DATE_FILTERS.map((df) => (
                      <Pressable
                        key={df.id}
                        style={[styles.dateChip, selectedDate === df.id && styles.dateChipActive]}
                        onPress={() => { Haptics.selectionAsync(); setSelectedDate(df.id); }}
                      >
                        <Ionicons
                          name={df.icon}
                          size={12}
                          color={selectedDate === df.id ? Colors.text : Colors.muted}
                        />
                        <Text style={[styles.dateChipText, selectedDate === df.id && styles.dateChipTextActive]}>
                          {df.label}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>

                  <Text style={[styles.expandedFilterLabel, { marginTop: 10 }]}>ELO RANGE</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                    {ELO_FILTERS.map((ef) => (
                      <Pressable
                        key={ef.id}
                        style={[styles.dateChip, selectedElo === ef.id && styles.dateChipActive]}
                        onPress={() => { Haptics.selectionAsync(); setSelectedElo(ef.id); }}
                      >
                        <Text style={[styles.dateChipText, selectedElo === ef.id && styles.dateChipTextActive]}>
                          {ef.label}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>

                  {activeFilterCount > 0 && (
                    <Pressable
                      style={styles.clearFiltersBtn}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setSelectedCity("all");
                        setSelectedSkill("all");
                        setSelectedDate("all");
                        setSelectedElo("all");
                        setShowFilters(false);
                      }}
                    >
                      <Ionicons name="close-circle-outline" size={13} color={Colors.red} />
                      <Text style={styles.clearFiltersBtnText}>Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>

            <View style={styles.upcomingHeader}>
              <Text style={styles.upcomingTitle}>
                {filteredGames.length > 0 ? `${filteredGames.length} GAMES FOUND` : "UPCOMING GAMES"}
              </Text>
              <Pressable onPress={() => { setSelectedDate("all"); setSelectedElo("all"); setSelectedSkill("all"); setSelectedCity("all"); }}>
                <Text style={styles.seeAll}>RESET</Text>
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="football-outline" size={40} color={Colors.muted} />
            <Text style={styles.emptyText}>No games found</Text>
            <Text style={styles.emptySubText}>
              {activeFilterCount > 0
                ? "Try adjusting your filters to see more games"
                : "Check back soon for new games in your area"}
            </Text>
          </View>
        }
      />

      <Pressable
        style={[styles.fab, { bottom: bottomPadding + 72 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push("/create-game");
        }}
      >
        <Ionicons name="add" size={26} color={Colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  topBarLeft: {
    minWidth: 36,
    flexDirection: "row",
    alignItems: "center",
  },
  cityActiveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${Colors.primary}33`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  cityActiveText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.accent,
  },
  logoRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.text,
    letterSpacing: 3,
    textAlign: "center",
  },
  bellBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.red,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  bellBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: Colors.text,
  },
  featuredSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  featuredLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 2,
    marginBottom: 10,
  },
  featuredCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    justifyContent: "space-between",
  },
  featuredOverlayTop: {
    flexDirection: "row",
  },
  featuredGameBadge: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  featuredGameBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: Colors.text,
    letterSpacing: 1,
  },
  featuredOverlayBottom: {
    gap: 3,
  },
  featuredVenue: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featuredMetaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(230,226,223,0.7)",
  },
  featuredMetaDot: {
    color: Colors.muted,
    fontSize: 12,
  },
  featuredPriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: Colors.accent,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 16,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: Colors.muted,
    letterSpacing: 0.5,
  },
  filterPillTextActive: {
    color: Colors.text,
  },
  filterToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  filterToggleBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterToggleBtnBadge: {
    borderColor: Colors.accent,
  },
  filterBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    fontFamily: "Inter_700Bold",
    fontSize: 8,
    color: Colors.base,
  },
  expandedFilters: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  expandedFilterLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: Colors.muted,
    letterSpacing: 1.5,
  },
  dateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.overlay,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  dateChipActive: {
    backgroundColor: `${Colors.primary}44`,
    borderColor: Colors.accent,
  },
  dateChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: Colors.muted,
  },
  dateChipTextActive: {
    color: Colors.accent,
    fontFamily: "Inter_600SemiBold",
  },
  clearFiltersBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: `${Colors.red}11`,
    borderWidth: 1,
    borderColor: `${Colors.red}33`,
  },
  clearFiltersBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.red,
  },
  upcomingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  upcomingTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    color: Colors.muted,
    letterSpacing: 1.5,
  },
  seeAll: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  compactCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  compactCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  compactCardLeft: {
    flex: 1,
    gap: 3,
    marginRight: 10,
  },
  compactVenue: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  compactMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  compactMetaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.muted,
  },
  compactRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  compactPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.accent,
  },
  openBadge: {
    backgroundColor: `${Colors.accent}22`,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  openBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: Colors.accent,
  },
  compactStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compactStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  compactStatText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.muted,
  },
  compactStatDot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: Colors.overlay,
  },
  joinMatchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  joinMatchBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.text,
    letterSpacing: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    gap: 10,
  },
  emptyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  emptySubText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.muted,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: `${Colors.accent}55`,
  },
});
