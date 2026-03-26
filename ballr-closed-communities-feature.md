# 🏟️ BallR — Closed Team Communities Feature Specification

**Date:** 2026-03-26  
**Status:** Feature Design (Ready for Implementation)  
**Priority:** HIGH (Core Differentiator)

---

## 📋 Feature Overview

**"Crews"** — Private communities within BallR where regular groups of players can organize, compete, and track their own rankings while still participating in the global BallR ecosystem.

**Core Concept:** Your Monday Night Crew has their own private space, their own Elo leaderboard, their own games — but every game also counts toward the global BallR ranking.

---

## 🎯 User Stories

### Community Creator
- "As a regular organizer, I want to create a private group for my weekly football crew so we can organize without randos joining."
- "As a crew admin, I want to invite players via link/QR so onboarding is frictionless."
- "As a crew admin, I want to manage members (promote, kick, ban) to keep the vibe right."

### Community Member
- "As a player, I want to see my ranking within my crew AND globally so I know where I stand."
- "As a member, I want to join crew-only games that aren't visible to outsiders."
- "As a player in multiple crews, I want separate Elo per crew because skill levels differ."

### Casual Player
- "As someone not in a crew, I still see public games and my global Elo is unaffected."

---

## 🏗️ Feature Breakdown

### MVP (Ship First)

#### 1. Create a Crew
- Name (max 30 chars)
- Description (optional, max 200 chars)
- Logo/Avatar (upload or pick from presets)
- Primary Color (hex picker or presets)
- Privacy: Always private (invite-only)
- Max members: 50 (expandable later)

#### 2. Invite System
- **Share Link:** `ballr.app/crew/join/abc123` (expires after 7 days)
- **QR Code:** Auto-generated from invite link (show in-app)
- **Username Search:** Find & invite existing BallR users
- **WhatsApp/Telegram Share:** Deep link with preview card

#### 3. Crew Games (Private Matches)
- Create game → Toggle: "Crew Only" or "Public"
- Crew-only games visible ONLY to crew members
- Same game creation flow (venue, time, max players)
- Crew members get push notification for new crew games
- Game results feed into BOTH Crew Elo AND Global Elo

#### 4. Dual Elo System
- **Global Elo:** Calculated from ALL games (public + crew)
- **Crew Elo:** Calculated from ONLY games within that specific crew
- **Starting Elo:** 1000 (both global and per-crew)
- **Profile Display:**
  ```
  ┌─────────────────────────────┐
  │ 🌍 Global Elo: 1,247 (#42) │
  │ ⚽ Monday Crew: 1,180 (#3)  │
  │ 🏆 Bangkok Ballers: 1,320 (#1) │
  └─────────────────────────────┘
  ```
- Player can be in multiple crews → multiple crew Elos
- Crew Elo uses same algorithm as Global (K-factor, Dignity Protection, etc.)

#### 5. Crew Leaderboard
- Ranked list of all crew members by Crew Elo
- Show: Rank, Name, Elo, Games Played, Win Rate
- Filter: This Week / This Month / All Time
- Highlight: Top 3 with gold/silver/bronze

#### 6. Member Management
- **Roles:** Owner (1), Admin (unlimited), Member
- **Owner can:** Delete crew, transfer ownership, everything
- **Admin can:** Invite, kick, create games, edit crew info
- **Member can:** Join games, view leaderboard, chat

---

### Nice-to-Have (Phase 2)

#### 7. Crew Chat
- In-app messaging for crew members
- Game-specific threads (discuss tactics, availability)
- Polls: "Who's coming Thursday?" with emoji reactions
- Media sharing (post-game photos)

#### 8. Crew Seasons
- **Season Length:** 1 month or custom (2 weeks, 3 months)
- **Season Champion:** Highest Crew Elo at season end
- **Season History:** Archive of past champions
- **Season Reset:** Crew Elo soft-resets (moves 20% toward 1000)
- **Trophy Case:** Display past season wins on profile

#### 9. Crew Stats & History
- Total games played as crew
- Average attendance
- Most active member
- Best win streak
- Head-to-head records (Player A vs Player B within crew)
- Monthly activity graph

#### 10. Inter-Crew Challenges
- **"Crew vs Crew"** — Challenge another crew to a match
- Both crews see the challenge in their feed
- Accept → Game created with slots for both crews
- Result: Bragging rights + Crew Challenge record
- **Leaderboard:** Best crews by challenge win rate

#### 11. Crew Achievements & Badges
- 🏆 "First Blood" — Play first crew game
- 🔥 "On Fire" — 5-game win streak in crew
- 👑 "Season Champion" — Win a season
- 🤝 "Crew Founder" — Create a crew with 10+ members
- 💯 "Century" — Play 100 crew games
- 🌍 "World Class" — Crew member with Global Elo > 1500

#### 12. Crew Events Calendar
- Recurring events: "Every Thursday 7pm at Arena10"
- One-off events: "Birthday Tournament March 30"
- RSVP system with attendance tracking
- Sync with phone calendar (optional)

#### 13. Baller of the Month (Crew Edition)
- Same POTM algorithm but scoped to crew
- Crew members vote
- Winner gets special badge on profile
- "Baller of the Month: Monday Crew — March 2026"

---

## 💾 Database Schema (Supabase)

### Table: `crews`
```sql
CREATE TABLE crews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(30) NOT NULL,
  description VARCHAR(200),
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#FF6B00',
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  invite_code VARCHAR(12) UNIQUE NOT NULL,
  invite_expires_at TIMESTAMP,
  max_members INT DEFAULT 50,
  member_count INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `crew_members`
```sql
CREATE TABLE crew_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_id UUID REFERENCES crews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(10) DEFAULT 'member', -- 'owner', 'admin', 'member'
  crew_elo INT DEFAULT 1000,
  games_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(crew_id, user_id)
);
```

### Table: `crew_games`
```sql
CREATE TABLE crew_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  crew_id UUID REFERENCES crews(id) ON DELETE CASCADE,
  is_crew_only BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(game_id, crew_id)
);
```

### Table: `crew_seasons`
```sql
CREATE TABLE crew_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_id UUID REFERENCES crews(id) ON DELETE CASCADE,
  season_number INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  champion_id UUID REFERENCES auth.users(id),
  champion_elo INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `crew_challenges`
```sql
CREATE TABLE crew_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_crew_id UUID REFERENCES crews(id),
  challenged_crew_id UUID REFERENCES crews(id),
  game_id UUID REFERENCES games(id),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'completed'
  winner_crew_id UUID REFERENCES crews(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### RLS Policies (Row Level Security)
```sql
-- Only crew members can see crew details
CREATE POLICY "Crew members can view crew"
  ON crews FOR SELECT
  USING (id IN (
    SELECT crew_id FROM crew_members WHERE user_id = auth.uid()
  ));

-- Only crew members can see crew games
CREATE POLICY "Crew members can view crew games"
  ON crew_games FOR SELECT
  USING (crew_id IN (
    SELECT crew_id FROM crew_members WHERE user_id = auth.uid()
  ));

-- Only admins/owners can manage crew
CREATE POLICY "Admins can update crew"
  ON crews FOR UPDATE
  USING (owner_id = auth.uid() OR id IN (
    SELECT crew_id FROM crew_members 
    WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
  ));
```

---

## 📱 UI/UX Suggestions

### Navigation
- New tab in bottom nav: "Crews" (team icon)
- Or: Add to existing "My Games" tab as sub-section

### Crew Home Screen
```
┌──────────────────────────────┐
│ [Logo] Monday Night Crew     │
│ 12 Members · 47 Games        │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🏆 LEADERBOARD           │ │
│ │ 1. 👑 Nick    — 1,320 Elo│ │
│ │ 2. 🥈 Tobias  — 1,247    │ │
│ │ 3. 🥉 Don     — 1,180    │ │
│ │ 4.    Pascal  — 1,050    │ │
│ │ 5.    Antoine — 980      │ │
│ └──────────────────────────┘ │
│                              │
│ 📅 UPCOMING GAMES            │
│ ┌──────────────────────────┐ │
│ │ Thu 28 Mar · 19:00       │ │
│ │ Arena10 · 8/10 spots     │ │
│ │ [Join Game]              │ │
│ └──────────────────────────┘ │
│                              │
│ [+ Create Game] [Invite]     │
└──────────────────────────────┘
```

### Profile — Dual Elo Display
```
┌──────────────────────────────┐
│ TOBIAS KAETKER               │
│ 🌍 Global: 1,247 Elo (#42)  │
│                              │
│ MY CREWS:                    │
│ ⚽ Monday Night  — 1,180 (#3)│
│ 🏆 Bangkok Ballr — 1,320 (#1)│
│ 🎯 Expat League  — 1,090 (#7)│
└──────────────────────────────┘
```

### Create Crew Flow
```
Step 1: Name your crew → "Monday Night Crew"
Step 2: Pick a color → [Orange] [Blue] [Green] ...
Step 3: Upload logo (optional) → [📷 Upload] or [Skip]
Step 4: Invite members → [Share Link] [QR Code] [Search]
Done! → Redirects to Crew Home
```

---

## ⚠️ Edge Cases

1. **Player leaves crew mid-season** → Crew Elo preserved, marked "inactive"
2. **Owner leaves** → Must transfer ownership first
3. **Crew deleted** → Crew Elo history archived, Global Elo unaffected
4. **Player in 10+ crews** → Cap at 10 crews per user (prevents spam)
5. **Game counts for multiple crews?** → No. One game = one crew only
6. **Mixed game (crew + public players)** → Only crew members get Crew Elo update
7. **Crew with <4 members** → Can create games but Elo not calculated (need min 4)
8. **Inactive crew (no games 60+ days)** → Show "inactive" badge, don't delete

---

## 🚀 Implementation Priority

### Sprint 1 (Week 1-2): Core MVP
- [ ] `crews` + `crew_members` tables
- [ ] Create crew UI + invite link generation
- [ ] Join crew via link
- [ ] Crew home screen (basic)
- [ ] Member list with roles

### Sprint 2 (Week 3-4): Games + Elo
- [ ] "Crew Only" toggle on game creation
- [ ] Crew games feed (only visible to members)
- [ ] Dual Elo calculation (Global + Crew)
- [ ] Crew leaderboard
- [ ] Profile: show crew Elos

### Sprint 3 (Week 5-6): Polish
- [ ] QR code invite
- [ ] Push notifications for crew games
- [ ] Admin controls (kick, promote)
- [ ] Crew settings (edit name, color, logo)

### Sprint 4 (Future): Phase 2
- [ ] Crew chat
- [ ] Seasons
- [ ] Inter-crew challenges
- [ ] Achievements/badges
- [ ] Events calendar

---

## 💡 Creative Ideas (Bonus)

### "Crew Rivalry" System
When two crews play against each other repeatedly, a **rivalry** is automatically detected:
- "🔥 RIVALRY: Monday Night vs Bangkok Ballers (4-2 all time)"
- Special rivalry badge
- Trash talk wall (moderated)

### "Crew DNA" Card
Auto-generated team identity card:
- Average Elo, most common formation
- "Aggressive" / "Defensive" / "Balanced" playstyle tag
- Best player, most improved, most reliable
- Shareable as image (Instagram/WhatsApp stories)

### "Guest Pass"
Invite a non-member for ONE game:
- They play, get Global Elo, but NO Crew Elo
- After game: "Want to join this crew?" prompt
- Frictionless trial membership

### "Crew Wrapped" (Annual Summary)
Like Spotify Wrapped but for your crew:
- Total games, goals, members
- MVP of the year
- Funniest stat ("Pascal scored 0 goals in 47 games")
- Shareable card for social media

---

**Document Status:** ✅ COMPLETE  
**Ready for:** Replit Implementation  
**Stack:** React + Supabase + Vercel  
**Estimated MVP Time:** 2-4 weeks

---

*Created: 2026-03-26 | BallR Closed Communities Feature Spec v1.0*
