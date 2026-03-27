export type SkillLevel = "beginner" | "intermediate" | "advanced" | "mixed";
export type GameStatus = "upcoming" | "full" | "in_progress" | "completed" | "canceled";
export type SurfaceType = "grass" | "turf" | "indoor";
export type Position = "GK" | "DEF" | "MID" | "FWD";
export type TeamAssignment = "blue" | "red" | "none";
export type NotificationType = "game_confirmed" | "teams_ready" | "rating_reminder" | "potm" | "no_show" | "game_full" | "new_game";

export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  nationality: string;
  eloRating: number;
  eloCalibrated: boolean;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  reliabilityScore: number;
  noShowCount: number;
  avgSkillRating: number;
  avgSportsmanshipRating: number;
  preferredPositions: Position[];
  bio: string;
  basedIn: string;
  memberSince: string;
  isCurrentUser?: boolean;
  isBanned?: boolean;
  winStreak?: number;
  ballerScore?: number;
  eloGainThisMonth?: number;
  medal?: "gold" | "silver" | "bronze";
  instagram?: string;
  whatsapp?: string;
  favoriteTeam?: string;
  favoritePlayer?: string;
  fairnessScore: number;
}

export type EloBadgeTierName = "platinum" | "gold" | "silver" | "bronze";

export interface EloBadgeTier {
  tier: EloBadgeTierName;
  ringColor: string;
  icon: string;
}

export function getEloBadgeTier(player: Player, allPlayers: Player[]): EloBadgeTier | null {
  const sorted = [...allPlayers].sort((a, b) => b.eloRating - a.eloRating);
  const rank = sorted.findIndex((p) => p.id === player.id);
  if (rank < 0) return null;
  const percentile = (rank + 1) / sorted.length;
  if (percentile <= 0.01) return { tier: "platinum", ringColor: "#E8A93A", icon: "crown" };
  if (percentile <= 0.10) return { tier: "gold", ringColor: "#E8A93A", icon: "star" };
  if (percentile <= 0.20) return { tier: "silver", ringColor: "#C0C0C0", icon: "shield" };
  if (percentile <= 0.30) return { tier: "bronze", ringColor: "#C4834A", icon: "medal" };
  return null;
}

export interface Rival {
  rivalPlayer: Player;
  winRate: number;
  timesPlayed: number;
  trending: "up" | "down" | "stable";
}

export interface BestTeammate {
  player: Player;
  winRate: number;
  timesPlayedTogether: number;
}

export interface ProfileReview {
  id: string;
  subjectId: string;
  author: Player;
  text: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface VenueStats {
  totalGamesPlayed: number;
  mostActiveDay: string;
  topPlayers: { name: string; winRate: number }[];
  bestPerformer: { name: string; winRate: number };
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  cityId: string;
  surfaceType: SurfaceType;
  amenities: string[];
  lat: number;
  lng: number;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  gameId: string;
  player: Player;
  teamAssignment: TeamAssignment;
  paymentStatus: "pending" | "paid" | "refunded";
  attended?: boolean;
  markedNoShow?: boolean;
}

export interface AiTeamAssignment {
  teamBlue: string[];
  teamRed: string[];
  reasoning: string;
  balanceScore: number;
}

export interface CarpoolOffer {
  driverName: string;
  seats: number;
  departure: string;
  meetingPoint: string;
}

export interface Game {
  id: string;
  venue: Venue;
  cityId: string;
  gameTime: string;
  durationMinutes: number;
  maxPlayers: number;
  currentPlayers: number;
  pricePerPlayer: number;
  skillLevel: SkillLevel;
  status: GameStatus;
  organizer: Player;
  bookings: Booking[];
  description?: string;
  registrationCutoff: string;
  teamsBalanced: boolean;
  winningTeam?: "blue" | "red" | "draw";
  minElo: number;
  maxElo: number;
  avgElo: number;
  minReliability?: number;
  aiAssignmentCalculated?: boolean;
  aiAssignment?: AiTeamAssignment;
  carpoolOffers?: CarpoolOffer[];
  cutoffHours?: number;
}

export interface PotmEntry {
  rank: number;
  player: Player;
  potmScore: number;
  gamesPlayed: number;
  wins: number;
  avgSkillRating: number;
}

export interface ChatMessage {
  id: string;
  gameId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  gameId?: string;
}

export interface EloHistoryEntry {
  gameId: string;
  venueName: string;
  eloBefore: number;
  eloAfter: number;
  change: number;
  reason: "win" | "loss" | "draw" | "no_show";
  date: string;
}

export interface PeerRating {
  id: string;
  gameId: string;
  ratedPlayer: Player;
  skillRating: number;
  sportsmanshipRating: number;
  comment?: string;
  submitted: boolean;
}

const VENUES: Venue[] = [
  {
    id: "v1",
    name: "Benjakitti Park Field 1",
    address: "Khlong Toei, Bangkok",
    cityId: "bangkok",
    surfaceType: "grass",
    amenities: ["changing_rooms", "showers", "parking", "lights"],
    lat: 13.722,
    lng: 100.565,
    imageUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
  },
  {
    id: "v2",
    name: "Lumpini Park Field A",
    address: "Wireless Rd, Pathum Wan",
    cityId: "bangkok",
    surfaceType: "grass",
    amenities: ["parking", "lights"],
    lat: 13.731,
    lng: 100.541,
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
  },
  {
    id: "v3",
    name: "Pitch Arena 2",
    address: "Sukhumvit Soi 11, Bangkok",
    cityId: "bangkok",
    surfaceType: "turf",
    amenities: ["changing_rooms", "showers", "parking", "lights", "bar"],
    lat: 13.741,
    lng: 100.553,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
  },
  {
    id: "v4",
    name: "Flick Football K-Village",
    address: "Ekkamai, Bangkok",
    cityId: "bangkok",
    surfaceType: "turf",
    amenities: ["changing_rooms", "parking", "lights"],
    lat: 13.716,
    lng: 100.585,
    imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
  },
  {
    id: "v5",
    name: "Seminyak Football Club",
    address: "Seminyak, Bali",
    cityId: "bali",
    surfaceType: "grass",
    amenities: ["changing_rooms", "showers"],
    lat: -8.687,
    lng: 115.165,
    imageUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800",
  },
];

export const PLAYERS: Player[] = [
  {
    id: "p0",
    name: "Maya",
    nationality: "Thai",
    eloRating: 820,
    eloCalibrated: true,
    gamesPlayed: 12,
    gamesWon: 4,
    gamesLost: 6,
    gamesDrawn: 2,
    reliabilityScore: 85,
    noShowCount: 1,
    avgSkillRating: 3.2,
    avgSportsmanshipRating: 4.8,
    preferredPositions: ["MID"],
    bio: "Just here for the love of the game and a good weekend sweat. Beginner-friendly matches are my jam! Looking for consistent groups in the Sukhumvit area.",
    basedIn: "Bangkok",
    memberSince: "Oct 2025",
    isCurrentUser: true,
    winStreak: 2,
    ballerScore: 61,
    eloGainThisMonth: 20,
    instagram: "maya.kicks",
    favoriteTeam: "Liverpool FC",
    favoritePlayer: "Trent Alexander-Arnold",
    fairnessScore: 78,
  },
  {
    id: "p1",
    name: "Amir Bilousov",
    nationality: "Ukrainian",
    eloRating: 1640,
    eloCalibrated: true,
    gamesPlayed: 52,
    gamesWon: 31,
    gamesLost: 15,
    gamesDrawn: 6,
    reliabilityScore: 97,
    noShowCount: 0,
    avgSkillRating: 4.7,
    avgSportsmanshipRating: 4.5,
    preferredPositions: ["MID", "FWD"],
    bio: "Competitive player looking for high-quality matches. Trained semi-professionally.",
    basedIn: "Bangkok",
    memberSince: "Jan 2025",
    winStreak: 5,
    ballerScore: 385,
    eloGainThisMonth: 80,
    medal: "gold",
    instagram: "amir.bkk",
    whatsapp: "+380991234567",
    favoriteTeam: "Manchester City",
    favoritePlayer: "Kevin De Bruyne",
    fairnessScore: 82,
  },
  {
    id: "p2",
    name: "Matt Wang",
    nationality: "American",
    eloRating: 1475,
    eloCalibrated: true,
    gamesPlayed: 38,
    gamesWon: 21,
    gamesLost: 12,
    gamesDrawn: 5,
    reliabilityScore: 93,
    noShowCount: 1,
    avgSkillRating: 4.3,
    avgSportsmanshipRating: 4.6,
    preferredPositions: ["DEF", "MID"],
    bio: "Tech expat who lives for weekend football. Organizer at heart.",
    basedIn: "Bangkok",
    memberSince: "Mar 2025",
    winStreak: 3,
    ballerScore: 362,
    eloGainThisMonth: 55,
    medal: "silver",
    instagram: "mattwangbkk",
    favoriteTeam: "Arsenal",
    favoritePlayer: "Bukayo Saka",
    fairnessScore: 85,
  },
  {
    id: "p3",
    name: "Chad Pratt",
    nationality: "British",
    eloRating: 1390,
    eloCalibrated: true,
    gamesPlayed: 29,
    gamesWon: 14,
    gamesLost: 10,
    gamesDrawn: 5,
    reliabilityScore: 89,
    noShowCount: 2,
    avgSkillRating: 4.0,
    avgSportsmanshipRating: 4.4,
    preferredPositions: ["FWD"],
    bio: "Always looking for a high-energy match after work.",
    basedIn: "Bangkok",
    memberSince: "Jun 2025",
    fairnessScore: 68,
  },
  {
    id: "p4",
    name: "Ying P.",
    nationality: "Thai",
    eloRating: 1372,
    eloCalibrated: true,
    gamesPlayed: 24,
    gamesWon: 12,
    gamesLost: 8,
    gamesDrawn: 4,
    reliabilityScore: 91,
    noShowCount: 1,
    avgSkillRating: 3.9,
    avgSportsmanshipRating: 4.7,
    preferredPositions: ["MID"],
    bio: "Love the game, love the community.",
    basedIn: "Bangkok",
    memberSince: "Aug 2025",
    fairnessScore: 88,
  },
  {
    id: "p5",
    name: "Kassim K.",
    nationality: "Senegalese",
    eloRating: 1383,
    eloCalibrated: true,
    gamesPlayed: 33,
    gamesWon: 17,
    gamesLost: 11,
    gamesDrawn: 5,
    reliabilityScore: 94,
    noShowCount: 0,
    avgSkillRating: 4.1,
    avgSportsmanshipRating: 4.3,
    preferredPositions: ["DEF", "GK"],
    bio: "Goalkeeper or center back. Solid defender.",
    basedIn: "Bangkok",
    memberSince: "May 2025",
    fairnessScore: 80,
  },
  {
    id: "p6",
    name: "Ronan K.",
    nationality: "Irish",
    eloRating: 1345,
    eloCalibrated: true,
    gamesPlayed: 18,
    gamesWon: 9,
    gamesLost: 6,
    gamesDrawn: 3,
    reliabilityScore: 87,
    noShowCount: 2,
    avgSkillRating: 3.8,
    avgSportsmanshipRating: 4.5,
    preferredPositions: ["FWD", "MID"],
    bio: "Dublin lad. Here for the football and the post-match stories.",
    basedIn: "Bangkok",
    memberSince: "Sep 2025",
    fairnessScore: 71,
  },
  {
    id: "p7",
    name: "Siraseth N.",
    nationality: "Thai",
    eloRating: 1310,
    eloCalibrated: true,
    gamesPlayed: 22,
    gamesWon: 10,
    gamesLost: 8,
    gamesDrawn: 4,
    reliabilityScore: 88,
    noShowCount: 2,
    avgSkillRating: 3.6,
    avgSportsmanshipRating: 4.6,
    preferredPositions: ["MID", "DEF"],
    bio: "Thai player with good technical skills.",
    basedIn: "Bangkok",
    memberSince: "Jul 2025",
    fairnessScore: 75,
  },
  {
    id: "p8",
    name: "Manon V.",
    nationality: "French",
    eloRating: 1120,
    eloCalibrated: true,
    gamesPlayed: 15,
    gamesWon: 7,
    gamesLost: 5,
    gamesDrawn: 3,
    reliabilityScore: 92,
    noShowCount: 0,
    avgSkillRating: 3.5,
    avgSportsmanshipRating: 4.8,
    preferredPositions: ["FWD", "MID"],
    bio: "Bonjour! Looking for fun games in Bangkok.",
    basedIn: "Bangkok",
    memberSince: "Oct 2025",
    fairnessScore: 91,
  },
  {
    id: "p9",
    name: "Tanaka R.",
    nationality: "Japanese",
    eloRating: 1095,
    eloCalibrated: true,
    gamesPlayed: 11,
    gamesWon: 5,
    gamesLost: 4,
    gamesDrawn: 2,
    reliabilityScore: 95,
    noShowCount: 0,
    avgSkillRating: 3.4,
    avgSportsmanshipRating: 4.9,
    preferredPositions: ["DEF"],
    bio: "Disciplined and technical. Prefer organized games.",
    basedIn: "Bangkok",
    memberSince: "Nov 2025",
    fairnessScore: 95,
  },
  {
    id: "p10",
    name: "Chris P.",
    nationality: "Canadian",
    eloRating: 1060,
    eloCalibrated: true,
    gamesPlayed: 8,
    gamesWon: 3,
    gamesLost: 4,
    gamesDrawn: 1,
    reliabilityScore: 88,
    noShowCount: 1,
    avgSkillRating: 3.2,
    avgSportsmanshipRating: 4.7,
    preferredPositions: ["MID"],
    bio: "Still learning but loving every game.",
    basedIn: "Bangkok",
    memberSince: "Dec 2025",
    fairnessScore: 73,
  },
];

const now = new Date();

function hoursFromNow(h: number): string {
  const d = new Date(now.getTime() + h * 60 * 60 * 1000);
  return d.toISOString();
}
function daysFromNow(d: number, hour = 18): string {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + d);
  dt.setHours(hour, 0, 0, 0);
  return dt.toISOString();
}
function daysAgo(d: number, hour = 18): string {
  const dt = new Date(now);
  dt.setDate(dt.getDate() - d);
  dt.setHours(hour, 0, 0, 0);
  return dt.toISOString();
}

export const GAMES: Game[] = [
  {
    id: "g1",
    venue: VENUES[0],
    cityId: "bangkok",
    gameTime: hoursFromNow(2),
    durationMinutes: 90,
    maxPlayers: 12,
    currentPlayers: 8,
    pricePerPlayer: 250,
    skillLevel: "intermediate",
    status: "upcoming",
    organizer: PLAYERS[1],
    teamsBalanced: true,
    minElo: 950,
    maxElo: 1150,
    avgElo: 1025,
    registrationCutoff: hoursFromNow(0),
    description: "Friendly competitive match. Intermediate level only.",
    bookings: [
      { id: "b1", gameId: "g1", player: PLAYERS[1], teamAssignment: "blue", paymentStatus: "paid" },
      { id: "b2", gameId: "g1", player: PLAYERS[2], teamAssignment: "blue", paymentStatus: "paid" },
      { id: "b3", gameId: "g1", player: PLAYERS[3], teamAssignment: "blue", paymentStatus: "paid" },
      { id: "b4", gameId: "g1", player: PLAYERS[4], teamAssignment: "blue", paymentStatus: "paid" },
      { id: "b5", gameId: "g1", player: PLAYERS[5], teamAssignment: "red", paymentStatus: "paid" },
      { id: "b6", gameId: "g1", player: PLAYERS[6], teamAssignment: "red", paymentStatus: "paid" },
      { id: "b7", gameId: "g1", player: PLAYERS[7], teamAssignment: "red", paymentStatus: "paid" },
      { id: "b8", gameId: "g1", player: PLAYERS[8], teamAssignment: "red", paymentStatus: "paid" },
    ],
    aiAssignmentCalculated: true,
    aiAssignment: {
      teamBlue: ["Amir Bilousov", "Matt Wang", "Chad Pratt", "Ying P."],
      teamRed: ["Kassim K.", "Ronan K.", "Siraseth N.", "Manon V."],
      reasoning: "Teams balanced by ELO average. Blue team avg: 1,245 · Red team avg: 1,210. Difference: 35 ELO — within acceptable balance threshold.",
      balanceScore: 97,
    },
    carpoolOffers: [
      { driverName: "Matt Wang", seats: 3, departure: "1h before kick-off", meetingPoint: "Asok BTS Station Exit 3" },
      { driverName: "Amir B.", seats: 2, departure: "90min before", meetingPoint: "Terminal 21 main entrance" },
    ],
    cutoffHours: 2,
  },
  {
    id: "g2",
    venue: VENUES[2],
    cityId: "bangkok",
    gameTime: daysFromNow(0, 20),
    durationMinutes: 90,
    maxPlayers: 10,
    currentPlayers: 7,
    pricePerPlayer: 350,
    skillLevel: "advanced",
    status: "upcoming",
    organizer: PLAYERS[1],
    teamsBalanced: false,
    minElo: 1200,
    maxElo: 1600,
    avgElo: 1350,
    registrationCutoff: daysFromNow(0, 18),
    description: "High intensity competitive match. Advanced players only.",
    bookings: [
      { id: "b9", gameId: "g2", player: PLAYERS[1], teamAssignment: "none", paymentStatus: "paid" },
      { id: "b10", gameId: "g2", player: PLAYERS[2], teamAssignment: "none", paymentStatus: "paid" },
      { id: "b11", gameId: "g2", player: PLAYERS[3], teamAssignment: "none", paymentStatus: "paid" },
    ],
  },
  {
    id: "g3",
    venue: VENUES[3],
    cityId: "bangkok",
    gameTime: daysFromNow(1, 20),
    durationMinutes: 60,
    maxPlayers: 10,
    currentPlayers: 5,
    pricePerPlayer: 200,
    skillLevel: "beginner",
    status: "upcoming",
    organizer: PLAYERS[2],
    teamsBalanced: false,
    minElo: 700,
    maxElo: 1050,
    avgElo: 880,
    registrationCutoff: daysFromNow(1, 18),
    description: "Chill beginner-friendly session. All welcome!",
    bookings: [],
  },
  {
    id: "g4",
    venue: VENUES[1],
    cityId: "bangkok",
    gameTime: daysFromNow(2, 18),
    durationMinutes: 90,
    maxPlayers: 14,
    currentPlayers: 14,
    pricePerPlayer: 180,
    skillLevel: "mixed",
    status: "full",
    organizer: PLAYERS[3],
    teamsBalanced: false,
    minElo: 800,
    maxElo: 1400,
    avgElo: 1100,
    registrationCutoff: daysFromNow(2, 16),
    description: "Mixed levels, come have fun!",
    bookings: [],
  },
  {
    id: "g5",
    venue: VENUES[4],
    cityId: "bali",
    gameTime: daysFromNow(1, 17),
    durationMinutes: 90,
    maxPlayers: 12,
    currentPlayers: 6,
    pricePerPlayer: 150000,
    skillLevel: "intermediate",
    status: "upcoming",
    organizer: PLAYERS[4],
    teamsBalanced: false,
    minElo: 900,
    maxElo: 1300,
    avgElo: 1100,
    registrationCutoff: daysFromNow(1, 15),
    description: "Bali beach football. Bring sunscreen!",
    bookings: [],
  },
  {
    id: "g6",
    venue: VENUES[0],
    cityId: "bangkok",
    gameTime: daysFromNow(3, 19),
    durationMinutes: 90,
    maxPlayers: 12,
    currentPlayers: 3,
    pricePerPlayer: 250,
    skillLevel: "mixed",
    status: "upcoming",
    organizer: PLAYERS[5],
    teamsBalanced: false,
    minElo: 800,
    maxElo: 1500,
    avgElo: 1100,
    registrationCutoff: daysFromNow(3, 17),
    description: "Weekend mixed game. Skill level welcome.",
    bookings: [],
  },
];

export const COMPLETED_GAMES: Game[] = [
  {
    id: "gc1",
    venue: VENUES[0],
    cityId: "bangkok",
    gameTime: daysAgo(3, 18),
    durationMinutes: 90,
    maxPlayers: 12,
    currentPlayers: 12,
    pricePerPlayer: 250,
    skillLevel: "intermediate",
    status: "completed",
    winningTeam: "blue",
    organizer: PLAYERS[1],
    teamsBalanced: true,
    minElo: 950,
    maxElo: 1200,
    avgElo: 1075,
    registrationCutoff: daysAgo(3, 16),
    bookings: [
      { id: "bc1", gameId: "gc1", player: PLAYERS[0], teamAssignment: "blue", paymentStatus: "paid", attended: true },
      { id: "bc2", gameId: "gc1", player: PLAYERS[2], teamAssignment: "blue", paymentStatus: "paid", attended: true },
      { id: "bc3", gameId: "gc1", player: PLAYERS[8], teamAssignment: "blue", paymentStatus: "paid", attended: true },
      { id: "bc4", gameId: "gc1", player: PLAYERS[9], teamAssignment: "blue", paymentStatus: "paid", attended: true },
      { id: "bc5", gameId: "gc1", player: PLAYERS[1], teamAssignment: "red", paymentStatus: "paid", attended: true },
      { id: "bc6", gameId: "gc1", player: PLAYERS[3], teamAssignment: "red", paymentStatus: "paid", attended: true },
      { id: "bc7", gameId: "gc1", player: PLAYERS[4], teamAssignment: "red", paymentStatus: "paid", attended: true },
      { id: "bc8", gameId: "gc1", player: PLAYERS[5], teamAssignment: "red", paymentStatus: "paid", attended: false, markedNoShow: true },
    ],
  },
];

export const MY_GAMES: Game[] = [GAMES[0], GAMES[2]];
export const MY_GAME_IDS = ["g1", "g3"];

export const ALL_GAMES: Game[] = [...GAMES, ...COMPLETED_GAMES];

export const RIVALS: Rival[] = [
  { rivalPlayer: PLAYERS[3], winRate: 40, timesPlayed: 5, trending: "down" },
  { rivalPlayer: PLAYERS[5], winRate: 35, timesPlayed: 4, trending: "stable" },
  { rivalPlayer: PLAYERS[6], winRate: 50, timesPlayed: 6, trending: "up" },
];

export const BEST_TEAMMATES: BestTeammate[] = [
  { player: PLAYERS[2], winRate: 75, timesPlayedTogether: 8 },
  { player: PLAYERS[8], winRate: 72, timesPlayedTogether: 5 },
  { player: PLAYERS[9], winRate: 68, timesPlayedTogether: 3 },
];

export const PROFILE_REVIEWS: ProfileReview[] = [
  {
    id: "rv1",
    subjectId: "p0",
    author: PLAYERS[2],
    text: "Great teammate! Always shows up on time and plays fair. Love having Maya on my team.",
    status: "accepted",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "rv2",
    subjectId: "p0",
    author: PLAYERS[8],
    text: "Really positive energy on the pitch. Encouraging to newer players too!",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const POTM_ENTRIES: PotmEntry[] = [
  { rank: 1, player: PLAYERS[1], potmScore: 385, gamesPlayed: 18, wins: 13, avgSkillRating: 4.7 },
  { rank: 2, player: PLAYERS[2], potmScore: 362, gamesPlayed: 15, wins: 10, avgSkillRating: 4.4 },
  { rank: 3, player: PLAYERS[3], potmScore: 341, gamesPlayed: 12, wins: 8, avgSkillRating: 4.2 },
  { rank: 4, player: PLAYERS[5], potmScore: 303, gamesPlayed: 14, wins: 9, avgSkillRating: 4.1 },
  { rank: 5, player: PLAYERS[6], potmScore: 291, gamesPlayed: 11, wins: 7, avgSkillRating: 3.8 },
  { rank: 6, player: PLAYERS[4], potmScore: 280, gamesPlayed: 10, wins: 6, avgSkillRating: 3.9 },
  { rank: 7, player: PLAYERS[7], potmScore: 265, gamesPlayed: 9, wins: 5, avgSkillRating: 3.7 },
  { rank: 8, player: PLAYERS[8], potmScore: 234, gamesPlayed: 8, wins: 4, avgSkillRating: 3.5 },
  { rank: 9, player: PLAYERS[9], potmScore: 218, gamesPlayed: 7, wins: 4, avgSkillRating: 3.4 },
  { rank: 10, player: PLAYERS[10], potmScore: 195, gamesPlayed: 6, wins: 2, avgSkillRating: 3.2 },
];

function minsAgo(m: number): string {
  return new Date(Date.now() - m * 60000).toISOString();
}

export const CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  g1: [
    { id: "m1", gameId: "g1", senderId: "system", senderName: "BallR", text: "Teams are balanced! Check your assignment above. 💪", timestamp: minsAgo(120), isSystem: true },
    { id: "m2", gameId: "g1", senderId: "p1", senderName: "Amir", text: "Let's gooo! Blue team represent 🔵", timestamp: minsAgo(90) },
    { id: "m3", gameId: "g1", senderId: "p2", senderName: "Matt", text: "Don't be late guys, field opens sharp at 12:36", timestamp: minsAgo(60) },
    { id: "m4", gameId: "g1", senderId: "p5", senderName: "Kassim", text: "Red team is ready 🔴 watch out!", timestamp: minsAgo(45) },
    { id: "m5", gameId: "g1", senderId: "p3", senderName: "Chad", text: "Anyone know parking situation at Benjakitti?", timestamp: minsAgo(30) },
    { id: "m6", gameId: "g1", senderId: "p2", senderName: "Matt", text: "There's a paid parking on the north side, 30 baht/hr", timestamp: minsAgo(28) },
    { id: "m7", gameId: "g1", senderId: "p3", senderName: "Chad", text: "Perfect thanks 🙏", timestamp: minsAgo(27) },
    { id: "m8", gameId: "g1", senderId: "p4", senderName: "Ying", text: "See everyone soon! 🏃‍♀️⚽", timestamp: minsAgo(10) },
  ],
  g3: [
    { id: "m9", gameId: "g3", senderId: "system", senderName: "BallR", text: "Game created! Players can now join. 🎉", timestamp: minsAgo(1440), isSystem: true },
    { id: "m10", gameId: "g3", senderId: "p2", senderName: "Matt", text: "Hey everyone! Chill game tomorrow, all skill levels welcome.", timestamp: minsAgo(720) },
    { id: "m11", gameId: "g3", senderId: "p9", senderName: "Tanaka", text: "Looking forward to it! Is turf or grass?", timestamp: minsAgo(600) },
    { id: "m12", gameId: "g3", senderId: "p2", senderName: "Matt", text: "Turf pitch at Flick K-Village. Great surface!", timestamp: minsAgo(595) },
  ],
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "teams_ready",
    title: "Teams Are Ready! 🔵",
    body: "You're on Team Blue for Benjakitti Park · Today 12:36",
    timestamp: minsAgo(120),
    read: false,
    gameId: "g1",
  },
  {
    id: "n2",
    type: "game_confirmed",
    title: "Booking Confirmed ✅",
    body: "You've joined Flick Football K-Village · Tomorrow 20:00. ฿200 paid.",
    timestamp: minsAgo(1440),
    read: false,
    gameId: "g3",
  },
  {
    id: "n3",
    type: "rating_reminder",
    title: "Rate Your Teammates ⭐",
    body: "How did your team play at Benjakitti Park? Rate them before the window closes.",
    timestamp: minsAgo(4320),
    read: true,
    gameId: "gc1",
  },
  {
    id: "n4",
    type: "potm",
    title: "POTM Leaderboard Updated 🏆",
    body: "Amir Bilousov leads Bangkok for March 2026. Check rankings!",
    timestamp: minsAgo(5760),
    read: true,
  },
  {
    id: "n5",
    type: "new_game",
    title: "New Game Near You 📍",
    body: "Matt Wang posted a beginner game at Benjakitti Park · Sat 18:00",
    timestamp: minsAgo(8640),
    read: true,
    gameId: "g6",
  },
];

export const ELO_HISTORY: EloHistoryEntry[] = [
  { gameId: "gc1", venueName: "Benjakitti Park", eloBefore: 820, eloAfter: 840, change: 20, reason: "win", date: daysAgo(3) },
  { gameId: "h2", venueName: "Pitch Arena 2", eloBefore: 800, eloAfter: 820, change: 20, reason: "win", date: daysAgo(10) },
  { gameId: "h3", venueName: "Lumpini Park", eloBefore: 820, eloAfter: 800, change: -20, reason: "loss", date: daysAgo(14) },
  { gameId: "h4", venueName: "Flick K-Village", eloBefore: 840, eloAfter: 820, change: -20, reason: "loss", date: daysAgo(21) },
  { gameId: "h5", venueName: "Benjakitti Park", eloBefore: 860, eloAfter: 840, change: -20, reason: "loss", date: daysAgo(28) },
  { gameId: "h6", venueName: "Pitch Arena 2", eloBefore: 840, eloAfter: 860, change: 20, reason: "win", date: daysAgo(35) },
  { gameId: "h7", venueName: "Lumpini Park", eloBefore: 870, eloAfter: 840, change: -30, reason: "no_show", date: daysAgo(42) },
  { gameId: "h8", venueName: "Benjakitti Park", eloBefore: 850, eloAfter: 870, change: 20, reason: "win", date: daysAgo(49) },
  { gameId: "h9", venueName: "Flick K-Village", eloBefore: 860, eloAfter: 850, change: -10, reason: "draw", date: daysAgo(56) },
  { gameId: "h10", venueName: "Benjakitti Park", eloBefore: 830, eloAfter: 860, change: 30, reason: "win", date: daysAgo(63) },
];

export const PENDING_RATINGS: PeerRating[] = [
  { id: "pr1", gameId: "gc1", ratedPlayer: PLAYERS[2], skillRating: 0, sportsmanshipRating: 0, submitted: false },
  { id: "pr2", gameId: "gc1", ratedPlayer: PLAYERS[8], skillRating: 0, sportsmanshipRating: 0, submitted: false },
  { id: "pr3", gameId: "gc1", ratedPlayer: PLAYERS[9], skillRating: 0, sportsmanshipRating: 0, submitted: false },
];

export const VENUES_LIST = VENUES;

export const MY_GAMES_IDS = new Set(["g1", "g3"]);

export function formatGameTime(isoString: string): string {
  const gameDate = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isToday =
    gameDate.getDate() === today.getDate() &&
    gameDate.getMonth() === today.getMonth();
  const isTomorrow =
    gameDate.getDate() === tomorrow.getDate() &&
    gameDate.getMonth() === tomorrow.getMonth();

  const timeStr = gameDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isToday) return `Today · ${timeStr}`;
  if (isTomorrow) return `Tomorrow · ${timeStr}`;

  return gameDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) + ` · ${timeStr}`;
}

export function getSkillColor(level: SkillLevel): string {
  switch (level) {
    case "beginner": return "#A1D494";
    case "intermediate": return "#4ABFB0";
    case "advanced": return "#E8A93A";
    case "mixed": return "#9B6FD4";
  }
}

export function getSkillLabel(level: SkillLevel): string {
  switch (level) {
    case "beginner": return "Beginner";
    case "intermediate": return "Intermediate";
    case "advanced": return "Advanced";
    case "mixed": return "Mixed";
  }
}

export function getEloLabel(elo: number): { label: string; tier: string; color: string } {
  if (elo < 700) return { label: "Novice", tier: "⚽", color: "#8C8782" };
  if (elo < 900) return { label: "Beginner", tier: "🌱", color: "#A1D494" };
  if (elo < 1100) return { label: "Recreational", tier: "⚡", color: "#4ABFB0" };
  if (elo < 1300) return { label: "Competitive", tier: "🔥", color: "#E8A93A" };
  if (elo < 1500) return { label: "Expert", tier: "💎", color: "#5B8FE8" };
  return { label: "Elite", tier: "👑", color: "#E05252" };
}

export function getReliabilityColor(score: number): string {
  if (score >= 90) return "#A1D494";
  if (score >= 70) return "#E8A93A";
  return "#E05252";
}

export function getReliabilityLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  return "Unreliable";
}

export const ELO_PRIVACY_PERCENTILE = 0.30;
export const CALIBRATION_GAMES = 5;

export function getEloPercentile(player: Player, allPlayers: Player[]): number {
  const sorted = [...allPlayers].sort((a, b) => a.eloRating - b.eloRating);
  const rank = sorted.findIndex((p) => p.id === player.id);
  if (rank < 0) return 0;
  return sorted.length > 1 ? rank / (sorted.length - 1) : 1;
}

export function isEloPublic(player: Player, allPlayers: Player[]): boolean {
  return getEloPercentile(player, allPlayers) >= ELO_PRIVACY_PERCENTILE;
}

export function formatPrice(price: number, cityId: string): string {
  if (cityId === "bali") return `Rp${(price / 1000).toFixed(0)}k`;
  return `฿${price}`;
}

export function getSurfaceIcon(surface: SurfaceType): string {
  switch (surface) {
    case "grass": return "Grass";
    case "turf": return "Turf";
    case "indoor": return "Indoor";
  }
}

export function getFairnessScore(player: Player): number {
  const reliabilityNorm = player.reliabilityScore;
  const sportsmanshipNorm = (player.avgSportsmanshipRating / 5) * 100;
  const noShowPenalty = player.noShowCount * 10;
  return Math.max(0, Math.min(100, Math.round(
    reliabilityNorm * 0.4 + sportsmanshipNorm * 0.4 - noShowPenalty * 0.2
  )));
}

export const VENUE_STATS: Record<string, VenueStats> = {
  v1: {
    totalGamesPlayed: 47,
    mostActiveDay: "Saturday",
    topPlayers: [
      { name: "Amir Bilousov", winRate: 78 },
      { name: "Matt Wang", winRate: 65 },
      { name: "Kassim K.", winRate: 61 },
    ],
    bestPerformer: { name: "Amir Bilousov", winRate: 78 },
  },
  v2: {
    totalGamesPlayed: 32,
    mostActiveDay: "Sunday",
    topPlayers: [
      { name: "Chad Pratt", winRate: 70 },
      { name: "Ying P.", winRate: 64 },
      { name: "Ronan K.", winRate: 58 },
    ],
    bestPerformer: { name: "Chad Pratt", winRate: 70 },
  },
  v3: {
    totalGamesPlayed: 55,
    mostActiveDay: "Friday",
    topPlayers: [
      { name: "Matt Wang", winRate: 72 },
      { name: "Siraseth N.", winRate: 60 },
      { name: "Manon V.", winRate: 57 },
    ],
    bestPerformer: { name: "Matt Wang", winRate: 72 },
  },
  v4: {
    totalGamesPlayed: 28,
    mostActiveDay: "Saturday",
    topPlayers: [
      { name: "Tanaka R.", winRate: 68 },
      { name: "Chris P.", winRate: 55 },
      { name: "Maya", winRate: 50 },
    ],
    bestPerformer: { name: "Tanaka R.", winRate: 68 },
  },
  v5: {
    totalGamesPlayed: 19,
    mostActiveDay: "Sunday",
    topPlayers: [
      { name: "Ying P.", winRate: 66 },
      { name: "Kassim K.", winRate: 59 },
    ],
    bestPerformer: { name: "Ying P.", winRate: 66 },
  },
};

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
