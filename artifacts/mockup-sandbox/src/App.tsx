import { useMemo, useState } from "react";

import {
  CALIBRATION_GAMES,
  COMPLETED_GAMES,
  ELO_HISTORY,
  GAMES,
  NOTIFICATIONS,
  PLAYERS,
  POTM_ENTRIES,
  PROFILE_REVIEWS,
  formatGameTime,
  formatPrice,
  formatTimestamp,
  getEloLabel,
  getFairnessScore,
  getReliabilityColor,
  getReliabilityLabel,
  getSkillColor,
  getSkillLabel,
  isEloPublic,
  type Game,
} from "../../mobile/constants/mock";

type TabKey = "discover" | "games" | "rankings" | "profile";
type RankingTab = "elo" | "fairness" | "botm";
type DateFilter = "all" | "today" | "tomorrow" | "weekend" | "week";

const NAV_ITEMS: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "discover", label: "Discover", icon: "Compass" },
  { key: "games", label: "My Games", icon: "Calendar" },
  { key: "rankings", label: "Rankings", icon: "Trophy" },
  { key: "profile", label: "Profile", icon: "User" },
];

const CITIES = [
  { id: "all", label: "All Cities" },
  { id: "bangkok", label: "Bangkok" },
  { id: "bali", label: "Bali" },
];

const SKILL_FILTERS = [
  { id: "all", label: "All Levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "mixed", label: "Mixed" },
] as const;

const DATE_FILTERS: Array<{ id: DateFilter; label: string }> = [
  { id: "all", label: "Any Date" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "Weekend" },
  { id: "week", label: "This Week" },
];

const MY_GAME_IDS = new Set(["g1", "g3"]);

function isDateMatch(gameTime: string, filter: DateFilter): boolean {
  const now = new Date();
  const game = new Date(gameTime);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday.getTime() + 86400000);
  const startOfDayAfterTomorrow = new Date(startOfTomorrow.getTime() + 86400000);
  const dayOfWeek = now.getDay();
  const daysUntilWeekend = dayOfWeek === 6 || dayOfWeek === 0 ? 0 : 6 - dayOfWeek;
  const startOfWeekend = new Date(startOfToday.getTime() + daysUntilWeekend * 86400000);
  const endOfWeekend = new Date(startOfWeekend.getTime() + 2 * 86400000);
  const endOfWeek = new Date(startOfToday.getTime() + 7 * 86400000);

  switch (filter) {
    case "today":
      return game >= startOfToday && game < startOfTomorrow;
    case "tomorrow":
      return game >= startOfTomorrow && game < startOfDayAfterTomorrow;
    case "weekend":
      return game >= startOfWeekend && game < endOfWeekend;
    case "week":
      return game >= startOfToday && game < endOfWeek;
    default:
      return true;
  }
}

function Panel({
  title,
  eyebrow,
  children,
  actions,
}: {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/8 bg-[#201f1e]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      {(title || eyebrow || actions) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8c8782]">
                {eyebrow}
              </p>
            ) : null}
            {title ? <h3 className="text-xl font-semibold text-[#e6e2df]">{title}</h3> : null}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-[#201f1e] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8c8782]">{label}</p>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#e6e2df]">{value}</p>
      <p className="mt-2 text-sm text-[#8c8782]">{hint}</p>
    </div>
  );
}

function Pill({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "green" | "amber";
}) {
  const toneClass =
    tone === "green"
      ? "border-[#a1d494]/25 bg-[#2d5a27]/25 text-[#a1d494]"
      : tone === "amber"
        ? "border-[#e8a93a]/25 bg-[#e8a93a]/12 text-[#e8a93a]"
        : "border-white/8 bg-[#141312] text-[#e6e2df]";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${toneClass}`}>
      {children}
    </span>
  );
}

function SidebarIcon({ label }: { label: string }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#141312] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a1d494]">
      {label.slice(0, 1)}
    </span>
  );
}

function GameCard({ game }: { game: Game }) {
  const skillColor = getSkillColor(game.skillLevel);
  const fillPct = Math.min(100, Math.round((game.currentPlayers / game.maxPlayers) * 100));

  return (
    <article className="rounded-[26px] border border-white/8 bg-[#201f1e] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-semibold text-[#e6e2df]">{game.venue.name}</h4>
          <p className="mt-1 text-sm text-[#8c8782]">
            {game.venue.address.split(",")[0]} · {formatGameTime(game.gameTime)}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-2 text-xs font-semibold"
          style={{ backgroundColor: `${skillColor}22`, color: skillColor }}
        >
          {getSkillLabel(game.skillLevel)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-[#b7b1ac]">
        {game.description ?? "Balanced pickup football with enough quality control to keep the run sharp."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill>{game.currentPlayers}/{game.maxPlayers} players</Pill>
        <Pill>Avg ELO {game.avgElo}</Pill>
        <Pill tone="green">{formatPrice(game.pricePerPlayer, game.cityId)}</Pill>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#363433]">
        <div
          className="h-full rounded-full bg-[#a1d494]"
          style={{ width: `${fillPct}%` }}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-[#8c8782]">Hosted by {game.organizer.name}</p>
        <button className="rounded-full bg-[#a1d494] px-4 py-2 text-sm font-semibold text-[#141312] transition hover:opacity-90">
          Open Match
        </button>
      </div>
    </article>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("discover");
  const [rankingTab, setRankingTab] = useState<RankingTab>("elo");
  const [city, setCity] = useState("all");
  const [skill, setSkill] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [search, setSearch] = useState("");

  const currentUser = PLAYERS[0];
  const currentUserTier = getEloLabel(currentUser.eloRating);
  const currentUserReliability = getReliabilityLabel(currentUser.reliabilityScore);
  const currentUserReliabilityColor = getReliabilityColor(currentUser.reliabilityScore);
  const unreadCount = NOTIFICATIONS.filter((item) => !item.read).length;
  const myGames = GAMES.filter((game) => MY_GAME_IDS.has(game.id));
  const pendingReviews = PROFILE_REVIEWS.filter((item) => item.status === "pending");
  const acceptedReviews = PROFILE_REVIEWS.filter((item) => item.status === "accepted");
  const calibrationLeft = Math.max(0, CALIBRATION_GAMES - currentUser.gamesPlayed);
  const winRate =
    currentUser.gamesPlayed > 0 ? Math.round((currentUser.gamesWon / currentUser.gamesPlayed) * 100) : 0;
  const eloPublic = isEloPublic(currentUser, PLAYERS);

  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      if (city !== "all" && game.cityId !== city) return false;
      if (skill !== "all" && game.skillLevel !== skill) return false;
      if (!isDateMatch(game.gameTime, dateFilter)) return false;

      const haystack = `${game.venue.name} ${game.venue.address} ${game.organizer.name}`.toLowerCase();
      return haystack.includes(search.trim().toLowerCase());
    });
  }, [city, skill, dateFilter, search]);

  const eloRanking = useMemo(
    () =>
      [...POTM_ENTRIES]
        .sort((a, b) => b.player.eloRating - a.player.eloRating)
        .map((entry, index) => ({ ...entry, rank: index + 1 })),
    [],
  );

  const fairnessRanking = useMemo(
    () =>
      [...PLAYERS]
        .map((player) => ({ player, score: getFairnessScore(player) }))
        .sort((a, b) => b.score - a.score),
    [],
  );

  const pageTitle =
    activeTab === "discover"
      ? "Discover matches and leagues"
      : activeTab === "games"
        ? "Manage your game week"
        : activeTab === "rankings"
          ? "See the city hierarchy"
          : "Run your player profile like a dashboard";

  return (
    <div className="min-h-screen bg-[#141312] text-[#e6e2df]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1560px] gap-5 px-5 py-5">
        <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-[280px] shrink-0 flex-col gap-4 lg:flex">
          <div className="rounded-[30px] border border-white/8 bg-[#201f1e] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a1d494]">BALLR WEB</p>
            <h1 className="mt-4 text-[2rem] font-semibold leading-tight">
              Stop squinting at the mobile feed. Run BallR in a browser.
            </h1>
            <p className="mt-4 text-sm leading-6 text-[#8c8782]">
              Same matches, same ratings, same identity system. Just re-laid into a desktop command center.
            </p>
          </div>

          <div className="rounded-[30px] border border-white/8 bg-[#201f1e] p-3">
            {NAV_ITEMS.map((item) => {
              const active = item.key === activeTab;
              return (
                <button
                  key={item.key}
                  className={`flex w-full items-center gap-3 rounded-[22px] px-4 py-4 text-left transition ${
                    active ? "border border-[#a1d494]/25 bg-[#2d5a27]/35" : "hover:bg-white/4"
                  }`}
                  onClick={() => setActiveTab(item.key)}
                >
                  <SidebarIcon label={item.icon} />
                  <span className={`text-sm font-medium ${active ? "text-[#e6e2df]" : "text-[#8c8782]"}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-[30px] border border-white/8 bg-[#201f1e] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8c8782]">Quick actions</p>
            <div className="mt-4 space-y-3">
              <button className="w-full rounded-[18px] border border-[#a1d494]/20 bg-[#2d5a27]/25 px-4 py-3 text-sm font-semibold text-[#a1d494] transition hover:opacity-90">
                Create League
              </button>
              <button className="w-full rounded-[18px] border border-white/8 bg-[#141312] px-4 py-3 text-sm font-semibold text-[#e6e2df] transition hover:opacity-90">
                Join With Code
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-5">
          <header className="rounded-[30px] border border-white/8 bg-[#201f1e] px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8c8782]">Browser Dashboard</p>
                <h2 className="mt-3 text-[2.35rem] font-semibold tracking-[-0.04em]">{pageTitle}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="green">{unreadCount} unread notices</Pill>
                <Pill>{filteredGames.length} open matches</Pill>
                <Pill tone="amber">{pendingReviews.length} pending reviews</Pill>
              </div>
            </div>
          </header>

          {activeTab === "discover" ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Open matches" value={String(filteredGames.length)} hint="Matches ready to join right now" />
                  <MetricCard
                    label="Today"
                    value={String(GAMES.filter((game) => isDateMatch(game.gameTime, "today")).length)}
                    hint="Games starting this calendar day"
                  />
                  <MetricCard label="Cities" value={String(new Set(GAMES.map((game) => game.cityId)).size)} hint="Live pickup markets in the mock data" />
                  <MetricCard
                    label="Avg seat price"
                    value={formatPrice(Math.round(GAMES.reduce((sum, game) => sum + game.pricePerPlayer, 0) / GAMES.length), "bangkok")}
                    hint="Median-ish paid run price"
                  />
                </div>

                <Panel
                  eyebrow="Desktop filters"
                  title="Scan the full week without losing the BallR logic"
                  actions={
                    <button
                      className="rounded-full border border-white/8 bg-[#141312] px-4 py-2 text-sm text-[#8c8782] transition hover:text-[#e6e2df]"
                      onClick={() => {
                        setCity("all");
                        setSkill("all");
                        setDateFilter("all");
                        setSearch("");
                      }}
                    >
                      Reset
                    </button>
                  }
                >
                  <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
                    <div className="space-y-4">
                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search venue, organizer, district"
                        className="w-full rounded-[20px] border border-white/8 bg-[#141312] px-4 py-3 text-sm text-[#e6e2df] outline-none ring-0 placeholder:text-[#6f6a65]"
                      />
                      <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8c8782]">City</p>
                        <div className="flex flex-wrap gap-2">
                          {CITIES.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setCity(item.id)}
                              className={`rounded-full border px-4 py-2 text-sm transition ${
                                city === item.id
                                  ? "border-[#a1d494]/30 bg-[#2d5a27]/35 text-[#e6e2df]"
                                  : "border-white/8 bg-[#141312] text-[#8c8782]"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8c8782]">Skill</p>
                        <div className="flex flex-wrap gap-2">
                          {SKILL_FILTERS.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setSkill(item.id)}
                              className={`rounded-full border px-4 py-2 text-sm transition ${
                                skill === item.id
                                  ? "border-[#a1d494]/30 bg-[#2d5a27]/35 text-[#e6e2df]"
                                  : "border-white/8 bg-[#141312] text-[#8c8782]"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8c8782]">Date</p>
                        <div className="flex flex-wrap gap-2">
                          {DATE_FILTERS.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setDateFilter(item.id)}
                              className={`rounded-full border px-4 py-2 text-sm transition ${
                                dateFilter === item.id
                                  ? "border-[#a1d494]/30 bg-[#2d5a27]/35 text-[#e6e2df]"
                                  : "border-white/8 bg-[#141312] text-[#8c8782]"
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Panel>

                <div className="grid gap-4 xl:grid-cols-2">
                  {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <Panel eyebrow="Featured public run" title={filteredGames[0]?.venue.name ?? "No featured match"}>
                  {filteredGames[0] ? (
                    <div className="space-y-4">
                      <p className="text-sm leading-6 text-[#b7b1ac]">
                        {filteredGames[0].description ?? "A sharper featured listing from the same BallR data model."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Pill tone="green">{formatPrice(filteredGames[0].pricePerPlayer, filteredGames[0].cityId)}</Pill>
                        <Pill>{filteredGames[0].currentPlayers}/{filteredGames[0].maxPlayers} in</Pill>
                        <Pill>{formatGameTime(filteredGames[0].gameTime)}</Pill>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#8c8782]">Your filters are too strict for a featured run.</p>
                  )}
                </Panel>

                <Panel eyebrow="Product direction" title="Marketplace + pickup in one view">
                  <div className="space-y-3 text-sm leading-6 text-[#b7b1ac]">
                    <p>Public games stay easy to browse.</p>
                    <p>Private leagues still exist through invite flow and captain tooling.</p>
                    <p>The browser version just gives organizers and heavy users more space.</p>
                  </div>
                </Panel>

                <Panel eyebrow="Live notices" title="Latest notifications">
                  <div className="space-y-4">
                    {NOTIFICATIONS.slice(0, 4).map((item) => (
                      <div key={item.id} className="rounded-[18px] border border-white/8 bg-[#141312] p-4">
                        <p className="font-medium text-[#e6e2df]">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-[#8c8782]">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          ) : null}

          {activeTab === "games" ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard label="Upcoming" value={String(myGames.length)} hint="Matches already on your board" />
                  <MetricCard label="Completed" value={String(COMPLETED_GAMES.length)} hint="Finished sessions to review" />
                  <MetricCard label="Ratings" value={String(pendingReviews.length)} hint="Teammate feedback still open" />
                </div>

                <Panel eyebrow="Upcoming games" title="Your next sessions">
                  <div className="grid gap-4 xl:grid-cols-2">
                    {myGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </Panel>

                <Panel eyebrow="Completed" title="Recent match history">
                  <div className="space-y-4">
                    {COMPLETED_GAMES.map((game) => (
                      <div key={game.id} className="rounded-[22px] border border-white/8 bg-[#141312] p-5">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-[#e6e2df]">{game.venue.name}</h4>
                            <p className="mt-1 text-sm text-[#8c8782]">{formatGameTime(game.gameTime)}</p>
                          </div>
                          <Pill tone="amber">
                            {game.winningTeam === "blue" ? "Blue won" : game.winningTeam === "red" ? "Red won" : "Draw"}
                          </Pill>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="space-y-5">
                <Panel eyebrow="Action queue" title="What needs your attention">
                  <div className="space-y-4">
                    {pendingReviews.map((review) => (
                      <div key={review.id} className="rounded-[18px] border border-white/8 bg-[#141312] p-4">
                        <p className="font-medium text-[#e6e2df]">{review.author.name}</p>
                        <p className="mt-2 text-sm leading-6 text-[#8c8782]">{review.text}</p>
                      </div>
                    ))}
                    {pendingReviews.length === 0 ? (
                      <p className="text-sm text-[#8c8782]">No open review tasks right now.</p>
                    ) : null}
                  </div>
                </Panel>
              </div>
            </div>
          ) : null}

          {activeTab === "rankings" ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-5">
                <Panel
                  eyebrow="City hierarchy"
                  title="Community standings"
                  actions={
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: "elo", label: "ELO" },
                        { key: "fairness", label: "Fairness" },
                        { key: "botm", label: "Baller of the Month" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          className={`rounded-full border px-4 py-2 text-sm ${
                            rankingTab === item.key
                              ? "border-[#a1d494]/30 bg-[#2d5a27]/35 text-[#e6e2df]"
                              : "border-white/8 bg-[#141312] text-[#8c8782]"
                          }`}
                          onClick={() => setRankingTab(item.key as RankingTab)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  }
                >
                  <div className="space-y-4">
                    {(rankingTab === "elo"
                      ? eloRanking.map((entry) => ({
                          id: entry.player.id,
                          name: entry.player.name,
                          meta: `${entry.player.eloRating} ELO · ${entry.gamesPlayed} games`,
                          score: entry.player.eloRating,
                        }))
                      : rankingTab === "fairness"
                        ? fairnessRanking.map((entry) => ({
                            id: entry.player.id,
                            name: entry.player.name,
                            meta: `${entry.player.reliabilityScore}% reliable · ${entry.player.avgSportsmanshipRating.toFixed(1)} spirit`,
                            score: entry.score,
                          }))
                        : POTM_ENTRIES.map((entry) => ({
                            id: entry.player.id,
                            name: entry.player.name,
                            meta: `${entry.gamesPlayed} games · ${entry.wins} wins`,
                            score: entry.potmScore,
                          }))
                    ).slice(0, 8).map((entry, index) => (
                      <div key={entry.id} className="flex items-center justify-between gap-4 rounded-[20px] border border-white/8 bg-[#141312] px-4 py-4">
                        <div className="flex items-center gap-4">
                          <span className="w-8 text-sm font-semibold text-[#8c8782]">{String(index + 1).padStart(2, "0")}</span>
                          <div>
                            <p className="font-medium text-[#e6e2df]">{entry.name}</p>
                            <p className="text-sm text-[#8c8782]">{entry.meta}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-[#a1d494]">{entry.score}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="space-y-5">
                <Panel eyebrow="Current user" title={`${currentUser.name} in context`}>
                  <div className="space-y-3">
                    <p className="text-sm text-[#8c8782]">
                      {eloPublic
                        ? `Public ELO: ${currentUser.eloRating}`
                        : "Your ELO is still protected because you are below the public cutoff."}
                    </p>
                    <Pill tone="green">Fairness {getFairnessScore(currentUser)}</Pill>
                    <Pill tone="amber">Baller Score {currentUser.ballerScore ?? 0}</Pill>
                  </div>
                </Panel>
              </div>
            </div>
          ) : null}

          {activeTab === "profile" ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-5">
                <Panel eyebrow="Player identity" title={`${currentUser.name} from ${currentUser.basedIn}`}>
                  <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
                    <div className="space-y-4">
                      <p className="text-sm leading-7 text-[#b7b1ac]">{currentUser.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        <Pill tone="green">{currentUser.eloRating} ELO · {currentUserTier.label}</Pill>
                        <Pill>{currentUser.gamesPlayed} games played</Pill>
                        <Pill tone="amber">{calibrationLeft} calibration left</Pill>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      <MetricCard label="Reliability" value={`${currentUser.reliabilityScore}%`} hint={currentUserReliability} />
                      <MetricCard label="Win rate" value={`${winRate}%`} hint={`${currentUser.avgSportsmanshipRating.toFixed(1)} sportsmanship`} />
                    </div>
                  </div>
                </Panel>

                <Panel eyebrow="ELO history" title="Last ten results">
                  <div className="space-y-3">
                    {ELO_HISTORY.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between gap-4 rounded-[18px] border border-white/8 bg-[#141312] px-4 py-3">
                        <div>
                          <p className="font-medium text-[#e6e2df]">{entry.venueName}</p>
                          <p className="text-sm text-[#8c8782]">{entry.eloBefore} to {entry.eloAfter}</p>
                        </div>
                        <span
                          className="text-sm font-semibold"
                          style={{
                            color:
                              entry.change > 0 ? "#a1d494" : entry.change < 0 ? "#e05252" : "#e8a93a",
                          }}
                        >
                          {entry.change > 0 ? `+${entry.change}` : entry.change}
                        </span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              <div className="space-y-5">
                <Panel eyebrow="Quick profile read" title="Status">
                  <div className="space-y-3">
                    <p className="text-sm text-[#8c8782]">Public ELO visibility: {eloPublic ? "On" : "Protected"}</p>
                    <p className="text-sm" style={{ color: currentUserReliabilityColor }}>
                      Reliability: {currentUser.reliabilityScore}% · {currentUserReliability}
                    </p>
                    <p className="text-sm text-[#8c8782]">Favorite team: {currentUser.favoriteTeam ?? "Not set"}</p>
                    <p className="text-sm text-[#8c8782]">Favorite player: {currentUser.favoritePlayer ?? "Not set"}</p>
                  </div>
                </Panel>

                <Panel eyebrow="Player reviews" title="Community feedback">
                  <div className="space-y-4">
                    {acceptedReviews.map((review) => (
                      <div key={review.id} className="rounded-[18px] border border-white/8 bg-[#141312] p-4">
                        <p className="font-medium text-[#e6e2df]">{review.author.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#8c8782]">
                          {formatTimestamp(review.createdAt)}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-[#b7b1ac]">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default App;
