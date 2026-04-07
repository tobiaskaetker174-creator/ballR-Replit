import { Ionicons, Feather } from "@expo/vector-icons";
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
import Colors from "@/constants/colors";
import { WebAppShell } from "@/components/WebAppShell";
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
const DATE_FILTERS: { id: DateFilter; label: string; icon: string }[] = [
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

const MARKETPLACE_ACTIONS = [
  {
    id: "create",
    title: "Create your league",
    description: "Launch a public city league or keep it invite-only for your own crew.",
    icon: "sparkles-outline" as const,
    route: "/create-league",
  },
  {
    id: "join",
    title: "Join with code",
    description: "Use an invite code from a captain, company league, or private organizer.",
    icon: "key-outline" as const,
    route: "/join-league",
  },
];

function WebMetricCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <View style={styles.webMetricCard}>
      <Text style={styles.webMetricLabel}>{label}</Text>
      <Text style={styles.webMetricValue}>{value}</Text>
      <Text style={styles.webMetricSub}>{sublabel}</Text>
    </View>
  );
}

function WebFilterChip({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.webFilterChip,
        active && styles.webFilterChipActive,
        pressed && { opacity: 0.86 },
      ]}
      onPress={onPress}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={13}
          color={active ? Colors.text : Colors.muted}
        />
      ) : null}
      <Text style={[styles.webFilterChipText, active && styles.webFilterChipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function WebGameCard({ game }: { game: Game }) {
  const skillColor = getSkillColor(game.skillLevel);
  const fillPct = Math.min(game.currentPlayers / game.maxPlayers, 1);

  return (
    <Pressable
      style={({ pressed }) => [styles.webGameCard, pressed && { opacity: 0.92 }]}
      onPress={() => router.push({ pathname: "/game/[id]", params: { id: game.id } })}
    >
      <View style={styles.webGameTop}>
        <View style={styles.webGameTitleBlock}>
          <Text style={styles.webGameVenue}>{game.venue.name}</Text>
          <Text style={styles.webGameMeta}>
            {game.venue.address.split(",")[0]} · {formatGameTime(game.gameTime)}
          </Text>
        </View>
        <View style={[styles.webSkillChip, { backgroundColor: `${skillColor}22` }]}>
          <Text style={[styles.webSkillChipText, { color: skillColor }]}>
            {getSkillLabel(game.skillLevel)}
          </Text>
        </View>
      </View>

      <Text style={styles.webGameDescription}>
        {game.description ?? "Well-organized pickup match with balanced teams and verified players."}
      </Text>

      <View style={styles.webStatsRow}>
        <View style={styles.webStatPill}>
          <Ionicons name="people-outline" size={14} color={Colors.accent} />
          <Text style={styles.webStatPillText}>
            {game.currentPlayers}/{game.maxPlayers} players
          </Text>
        </View>
        <View style={styles.webStatPill}>
          <Ionicons name="flash-outline" size={14} color={Colors.accent} />
          <Text style={styles.webStatPillText}>Avg ELO {game.avgElo}</Text>
        </View>
        <View style={styles.webStatPill}>
          <Ionicons name="cash-outline" size={14} color={Colors.accent} />
          <Text style={styles.webStatPillText}>{formatPrice(game.pricePerPlayer, game.cityId)}</Text>
        </View>
      </View>

      <View style={styles.webFillTrack}>
        <View style={[styles.webFillBar, { width: `${fillPct * 100}%` as any }]} />
      </View>

      <View style={styles.webGameFooter}>
        <Text style={styles.webGameFooterText}>
          Hosted by {game.organizer.name} · {game.cityId.toUpperCase()}
        </Text>
        <Pressable
          style={({ pressed }) => [styles.webJoinButton, pressed && { opacity: 0.88 }]}
          onPress={() => router.push({ pathname: "/game/[id]", params: { id: game.id } })}
        >
          <Text style={styles.webJoinButtonText}>Open Match</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

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
          {isFull && (
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
        <Text style={styles.compactStatText}>{formatPrice(game.pricePerPlayer, game.cityId)}</Text>
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
  const todayGames = GAMES.filter((game) => isDateMatch(game.gameTime, "today")).length;
  const activeCities = new Set(GAMES.map((game) => game.cityId)).size;
  const avgPrice =
    Math.round(GAMES.reduce((sum, game) => sum + game.pricePerPlayer, 0) / GAMES.length) || 0;

  if (Platform.OS === "web") {
    const aside = (
      <>
        <View style={styles.webSideCard}>
          <Text style={styles.webSideLabel}>Featured Match</Text>
          <Text style={styles.webSideTitle}>{featuredGame.venue.name}</Text>
          <Text style={styles.webSideBody}>
            {formatGameTime(featuredGame.gameTime)} · {featuredGame.currentPlayers}/{featuredGame.maxPlayers} locked in.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.webSidePrimary, pressed && { opacity: 0.9 }]}
            onPress={() => router.push({ pathname: "/game/[id]", params: { id: featuredGame.id } })}
          >
            <Text style={styles.webSidePrimaryText}>View featured game</Text>
          </Pressable>
        </View>

        <View style={styles.webSideCard}>
          <Text style={styles.webSideLabel}>Marketplace</Text>
          <View style={styles.webActionStack}>
            {MARKETPLACE_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [styles.webAsideAction, pressed && { opacity: 0.88 }]}
                onPress={() => router.push(action.route as any)}
              >
                <View style={styles.webAsideActionIcon}>
                  <Ionicons name={action.icon} size={16} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.webAsideActionTitle}>{action.title}</Text>
                  <Text style={styles.webAsideActionBody}>{action.description}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.webSideCard}>
          <Text style={styles.webSideLabel}>Notifications</Text>
          {NOTIFICATIONS.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.webNoticeItem}>
              <Text style={styles.webNoticeTitle}>{item.title}</Text>
              <Text style={styles.webNoticeBody}>{item.body}</Text>
            </View>
          ))}
          <Text style={styles.webNoticeFooter}>{unreadCount} unread updates</Text>
        </View>
      </>
    );

    return (
      <WebAppShell
        currentTab="discover"
        title="Open Games Dashboard"
        subtitle="Same BallR product logic as the mobile app, but stretched into a desktop control room for browsing matches, joining faster, and managing leagues."
        primaryActionLabel="Create League"
        primaryActionRoute="/create-league"
        aside={aside}
      >
        <View style={styles.webMetricGrid}>
          <WebMetricCard label="Open matches" value={String(filteredGames.length)} sublabel="Available under your filters" />
          <WebMetricCard label="Today" value={String(todayGames)} sublabel="Kickoffs in the next hours" />
          <WebMetricCard label="Cities live" value={String(activeCities)} sublabel="Bangkok and Bali active" />
          <WebMetricCard label="Avg price" value={formatPrice(avgPrice, "bangkok")} sublabel="Typical seat price" />
        </View>

        <View style={styles.webHeroCard}>
          <View style={styles.webHeroTop}>
            <View style={styles.webHeroText}>
              <Text style={styles.webHeroEyebrow}>Desktop Discover</Text>
              <Text style={styles.webHeroTitle}>Scan the full week, not just the next card in the feed.</Text>
              <Text style={styles.webHeroBody}>
                We kept the exact same filters and match dataset from the mobile app, then spread them into a board you can actually work from on a laptop.
              </Text>
            </View>
            <View style={styles.webHeroPill}>
              <Ionicons name="football-outline" size={16} color={Colors.accent} />
              <Text style={styles.webHeroPillText}>Featured {featuredGame.venue.name}</Text>
            </View>
          </View>
          <View style={styles.webFilterSection}>
            <Text style={styles.webFilterSectionLabel}>City</Text>
            <View style={styles.webFilterRow}>
              {CITIES.map((city) => (
                <WebFilterChip
                  key={city.id}
                  label={city.label}
                  icon={city.id === "all" ? "globe-outline" : "location-outline"}
                  active={selectedCity === city.id}
                  onPress={() => setSelectedCity(city.id)}
                />
              ))}
            </View>
            <Text style={styles.webFilterSectionLabel}>Skill</Text>
            <View style={styles.webFilterRow}>
              {SKILL_FILTERS.map((skill) => (
                <WebFilterChip
                  key={skill.id}
                  label={skill.label}
                  active={selectedSkill === skill.id}
                  onPress={() => setSelectedSkill(skill.id)}
                />
              ))}
            </View>
            <Text style={styles.webFilterSectionLabel}>Date</Text>
            <View style={styles.webFilterRow}>
              {DATE_FILTERS.map((date) => (
                <WebFilterChip
                  key={date.id}
                  label={date.label}
                  icon={date.icon as keyof typeof Ionicons.glyphMap}
                  active={selectedDate === date.id}
                  onPress={() => setSelectedDate(date.id)}
                />
              ))}
            </View>
            <Text style={styles.webFilterSectionLabel}>ELO Range</Text>
            <View style={styles.webFilterRow}>
              {ELO_FILTERS.map((elo) => (
                <WebFilterChip
                  key={elo.id}
                  label={elo.label}
                  active={selectedElo === elo.id}
                  onPress={() => setSelectedElo(elo.id)}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.webSectionHeader}>
          <Text style={styles.webSectionTitle}>
            {filteredGames.length} match{filteredGames.length === 1 ? "" : "es"} ready to open
          </Text>
          <Pressable
            onPress={() => {
              setSelectedCity("all");
              setSelectedSkill("all");
              setSelectedDate("all");
              setSelectedElo("all");
            }}
          >
            <Text style={styles.webResetLink}>Reset filters</Text>
          </Pressable>
        </View>

        <View style={styles.webGameGrid}>
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => <WebGameCard key={game.id} game={game} />)
          ) : (
            <View style={styles.webEmptyState}>
              <Ionicons name="football-outline" size={40} color={Colors.muted} />
              <Text style={styles.webEmptyTitle}>No games match this desktop filter set.</Text>
              <Text style={styles.webEmptyBody}>Try widening the city, date, or ELO range.</Text>
            </View>
          )}
        </View>
      </WebAppShell>
    );
  }

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

              <Text style={styles.logoText}>BALLR</Text>

              <Pressable style={styles.bellBtn} onPress={() => router.push("/notifications")}>
                <Ionicons name="notifications-outline" size={20} color={Colors.muted} />
                {unreadCount > 0 && (
                  <View style={styles.bellBadge}>
                    <Text style={styles.bellBadgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>

            <View style={styles.marketplaceSection}>
              <View style={styles.marketplaceIntro}>
                <Text style={styles.marketplaceEyebrow}>LEAGUE MARKETPLACE</Text>
                <Text style={styles.marketplaceTitle}>Create one, join one, or discover what is public in your city.</Text>
                <Text style={styles.marketplaceBody}>
                  BallR now supports public leagues, private crews, company groups, and recurring organizers in one shared system.
                </Text>
              </View>

              <View style={styles.marketplaceActionRow}>
                {MARKETPLACE_ACTIONS.map((action) => (
                  <Pressable
                    key={action.id}
                    style={({ pressed }) => [styles.marketplaceActionCard, pressed && { opacity: 0.92 }]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push(action.route as any);
                    }}
                  >
                    <View style={styles.marketplaceActionIcon}>
                      <Ionicons name={action.icon} size={18} color={Colors.accent} />
                    </View>
                    <Text style={styles.marketplaceActionTitle}>{action.title}</Text>
                    <Text style={styles.marketplaceActionDescription}>{action.description}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.featuredSection}>
              <Text style={styles.featuredLabel}>FEATURED PUBLIC LEAGUE</Text>
              <Pressable
                style={styles.featuredCard}
                onPress={() => router.push({ pathname: "/game/[id]", params: { id: featuredGame.id } })}
              >
                <Image
                  source={require("../../assets/images/featured_pitch.jpg")}
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
                        <Text style={styles.featuredGameBadgeText}>OPEN MATCH</Text>
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
                          name={df.icon as any}
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
                {filteredGames.length > 0 ? `${filteredGames.length} OPEN MATCHES` : "OPEN MATCHES"}
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
            <Text style={styles.emptyText}>No open matches for these filters</Text>
          </View>
        }
      />

      <Pressable
        style={[styles.fab, { bottom: bottomPadding + 72 }]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push("/create-league");
        }}
      >
        <Ionicons name="shield-outline" size={24} color={Colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  webMetricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  webMetricCard: {
    flexGrow: 1,
    minWidth: 210,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 18,
    gap: 8,
  },
  webMetricLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 1.6,
    color: Colors.muted,
    textTransform: "uppercase",
  },
  webMetricValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    color: Colors.text,
    letterSpacing: -1,
  },
  webMetricSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: Colors.muted,
  },
  webHeroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 22,
    gap: 20,
  },
  webHeroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  webHeroText: {
    flex: 1,
    gap: 10,
  },
  webHeroEyebrow: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.accent,
    textTransform: "uppercase",
  },
  webHeroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: Colors.text,
    letterSpacing: -0.9,
  },
  webHeroBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.muted,
    maxWidth: 760,
  },
  webHeroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.base,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.separator,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  webHeroPillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
  },
  webFilterSection: {
    gap: 10,
  },
  webFilterSectionLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.6,
    color: Colors.muted,
    textTransform: "uppercase",
  },
  webFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  webFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  webFilterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: `${Colors.accent}44`,
  },
  webFilterChipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.muted,
  },
  webFilterChipTextActive: {
    color: Colors.text,
  },
  webSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  webSectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  webResetLink: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.accent,
  },
  webGameGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  webGameCard: {
    flexGrow: 1,
    minWidth: 320,
    maxWidth: 520,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 18,
    gap: 14,
  },
  webGameTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  webGameTitleBlock: {
    flex: 1,
    gap: 4,
  },
  webGameVenue: {
    fontFamily: "Inter_700Bold",
    fontSize: 19,
    color: Colors.text,
  },
  webGameMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: Colors.muted,
  },
  webSkillChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  webSkillChipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  webGameDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: Colors.muted,
  },
  webStatsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  webStatPill: {
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
  webStatPillText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.text,
  },
  webFillTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.overlay,
    overflow: "hidden",
  },
  webFillBar: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: Colors.accent,
  },
  webGameFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  webGameFooterText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.muted,
  },
  webJoinButton: {
    backgroundColor: Colors.accent,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  webJoinButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.base,
  },
  webSideCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 18,
    gap: 12,
  },
  webSideLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 11,
    letterSpacing: 1.6,
    color: Colors.muted,
    textTransform: "uppercase",
  },
  webSideTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  webSideBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    color: Colors.muted,
  },
  webSidePrimary: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  webSidePrimaryText: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.base,
  },
  webActionStack: {
    gap: 10,
  },
  webAsideAction: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.base,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 14,
  },
  webAsideActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: `${Colors.accent}18`,
    alignItems: "center",
    justifyContent: "center",
  },
  webAsideActionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 13,
    color: Colors.text,
  },
  webAsideActionBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 17,
    color: Colors.muted,
    marginTop: 4,
  },
  webNoticeItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
    paddingBottom: 10,
    gap: 4,
  },
  webNoticeTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.text,
  },
  webNoticeBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: Colors.muted,
  },
  webNoticeFooter: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.accent,
  },
  webEmptyState: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.separator,
    paddingVertical: 42,
    alignItems: "center",
    gap: 10,
  },
  webEmptyTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.text,
  },
  webEmptyBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.muted,
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
  logoText: {
    flex: 1,
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
  marketplaceSection: {
    paddingHorizontal: 16,
    marginBottom: 18,
    gap: 12,
  },
  marketplaceIntro: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: `${Colors.accent}22`,
  },
  marketplaceEyebrow: {
    fontFamily: "Inter_700Bold",
    fontSize: 10,
    color: Colors.accent,
    letterSpacing: 1.8,
  },
  marketplaceTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    lineHeight: 26,
    color: Colors.text,
    marginTop: 10,
  },
  marketplaceBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
    color: Colors.muted,
    marginTop: 8,
  },
  marketplaceActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  marketplaceActionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.separator,
    minHeight: 144,
  },
  marketplaceActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `${Colors.accent}15`,
    marginBottom: 12,
  },
  marketplaceActionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    lineHeight: 18,
    color: Colors.text,
  },
  marketplaceActionDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
    color: Colors.muted,
    marginTop: 8,
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
    width: 34,
    height: 34,
    borderRadius: 17,
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
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.muted,
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
