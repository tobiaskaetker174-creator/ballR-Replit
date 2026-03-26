# ⚽ BallR League — Start Your Own League, Anywhere in the World

**Date:** 2026-03-26  
**Status:** Feature Specification (Ready for Implementation)  
**Priority:** HIGH (Core Revenue Feature)

---

## 📋 Feature Overview

**"BallR League"** — Anyone, anywhere in the world, can start their own pickup football league using the BallR app. Every booking generates a small fee that funds the platform — not just hosting costs, but sustainable revenue.

**Vision:** BallR becomes the **Airbnb of pickup football** — the platform doesn't own any pitches, doesn't organize any games, but takes a small cut every time someone books through it.

---

## 🌍 Core Concept

```
User in Berlin → "Start a BallR League"
User in São Paulo → "Start a BallR League"  
User in Bangkok → "Start a BallR League"
User in Lagos → "Start a BallR League"

→ ALL using the same app
→ ALL generating revenue for BallR
→ ALL with Elo, Leaderboards, Stats
```

**Not tied to Bangkok.** Not tied to ANY city. The app is a **platform** that empowers local organizers worldwide.

---

## 🏆 What is a "BallR League"?

A BallR League is:
- A **local community** of players organized by a **League Organizer**
- Has its own **name, branding, city/location**
- Runs **regular games** (weekly, bi-weekly, etc.)
- Has its own **Elo leaderboard** (League Elo)
- Players also have **Global BallR Elo** (across all leagues)
- **Every booking** generates a small **platform fee** for BallR

---

## 💰 Revenue Model: Booking Fee

### How It Works

```
Player books a game slot → Pays game fee via app
                         → Organizer gets 90-95%
                         → BallR gets 5-10% platform fee
```

### Example

```
Game: Thursday Night Football, Arena10 Bangkok
Organizer sets price: 200 THB per player
10 players book:

Total collected:     2,000 THB (100%)
Organizer gets:      1,800 THB (90%)
BallR platform fee:    200 THB (10%)

Per player BallR earns: 20 THB (~$0.55)
```

### Fee Structure

**BallR Platform Fee: 5-10%** (configurable per region)

- **Developing markets** (Thailand, Indonesia, etc.): **5%**
- **Developed markets** (Germany, UK, USA): **10%**
- **Launch promotion:** First 3 months = **0% fee** (free for organizers)

### Why "Just a Few Cents"

- Low fee = organizers don't notice/care
- High volume = massive revenue at scale
- **200 THB game × 5% = 10 THB ($0.28)**
- Nobody misses $0.28 per game
- But 10,000 games/month × $0.28 = **$2,800/month**
- And 100,000 games/month × $0.28 = **$28,000/month** 🤯

---

## 📊 Revenue Projections

### Scenario: Global Scale (Year 1-3)

**Year 1 (Launch):**
```
100 Leagues × 20 players × 2 games/week × 200 THB avg
= 800 games/week × 4 = 3,200 games/month
Revenue: 3,200 × 25 × 200 THB × 5% = 800,000 THB/month
= ~$23,000/month
```

**Year 2 (Growth):**
```
1,000 Leagues × 25 players × 2 games/week
= 8,000 games/week = 32,000 games/month
Revenue: 32,000 × 25 × avg $3 × 7.5% = ~$180,000/month
```

**Year 3 (Scale):**
```
10,000 Leagues × 30 players × 2 games/week
= 80,000 games/week = 320,000 games/month
Revenue: 320,000 × 30 × avg $3 × 7.5% = ~$2.16M/month
```

### Cost at Scale
```
Supabase (scaled): $500-2,000/month
Vercel (scaled): $200-500/month
Stripe fees: 2.9% + $0.30 per transaction
Support/Ops: $5,000-10,000/month
Total costs: ~$10,000-15,000/month

Profit margin: 85-95%
```

---

## 🏗️ Feature Breakdown

### MVP (Sprint 1-2)

#### 1. Create a League
- **League Name:** "Bangkok Thursday Night Football"
- **City/Location:** Auto-detect or manual (Google Maps)
- **Country:** Auto-detect from location
- **Description:** "Weekly pickup football for expats in Sukhumvit"
- **Schedule:** Recurring (e.g., Every Thursday 19:00)
- **Default Venue:** Link to Google Maps
- **Game Fee:** Set by organizer (e.g., 200 THB, €5, $8)
- **Max Players per Game:** 10-22
- **Logo/Banner:** Upload or pick preset

#### 2. Payment Integration (Stripe)
- **Player books slot** → Stripe Checkout
- **Payment split:**
  - Organizer: 90-95% → Stripe Connect (direct deposit)
  - BallR: 5-10% → Platform account
- **Refund policy:** Full refund if cancelled 24h+ before game
- **Stripe Connect** for organizer payouts (direct to their bank)
- **Supported currencies:** ALL (Stripe handles conversion)

#### 3. Game Creation & Booking
- Organizer creates game → Sets date, time, venue, price, max players
- Game appears in League feed → Members see it
- **"Book Slot" button** → Stripe payment → Confirmed!
- Waitlist if full (auto-fill on cancellation)
- Push notification: "New game in your league!"

#### 4. League Elo (Same as Crew Elo)
- Separate Elo per League
- Global Elo also updated
- League Leaderboard
- Season system (monthly champions)

#### 5. League Discovery
- **"Find Leagues Near Me"** → Map view + list
- Filter: City, sport, price range, skill level
- **"Start a League"** → Prominent CTA
- Featured leagues (curated by BallR)

#### 6. Organizer Dashboard
- Games created / upcoming
- Revenue overview (this week, month, all-time)
- Player attendance stats
- Payout history (Stripe)
- League growth metrics

---

### Phase 2 (Nice-to-Have)

#### 7. League Tiers
```
🥉 STARTER (Free):
   - 1 game/week
   - Max 15 members
   - Basic Elo
   - BallR branding on league page

🥈 PRO ($9.99/month for organizer):
   - Unlimited games
   - Max 50 members
   - Full stats + seasons
   - Custom branding
   - Priority in discovery

🥇 ELITE ($24.99/month):
   - Unlimited everything
   - Max 200 members
   - Inter-league challenges
   - Dedicated support
   - Featured in app
   - Analytics dashboard
   - API access
```

#### 8. Inter-League Challenges
- "Bangkok Ballers" challenges "Sukhumvit United"
- Organizers agree on date, venue, rules
- Result recorded → League ranking affected
- **City Championships:** Top leagues per city compete

#### 9. League Seasons & Awards
- Monthly/quarterly seasons
- MVP, Top Scorer, Most Improved
- Season Champion trophy (displayed on profile)
- "League Wrapped" annual summary

#### 10. Organizer Tools
- **Auto-scheduling:** Recurring games auto-created
- **Attendance tracking:** Who shows up, who flakes
- **Player ratings:** Organizer can rate players (reliability, sportsmanship)
- **Blacklist:** Ban problematic players
- **Substitute finder:** "Need 2 more for tonight!" → Push to nearby players

#### 11. Global Leaderboard
- Top leagues worldwide
- Top players by Global Elo
- Top organizers by games hosted
- City rankings: "Bangkok: 47 leagues, 1,200 players"

#### 12. Referral System
- Organizer invites new organizer → Both get 1 month free Pro
- Player invites player → Both get 1 free game
- **Viral growth mechanism**

---

## 💾 Database Schema (Supabase)

### Table: `leagues`
```sql
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(60) NOT NULL,
  description TEXT,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(60) NOT NULL,
  country_code VARCHAR(2),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  logo_url TEXT,
  banner_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#FF6B00',
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  default_venue_name VARCHAR(200),
  default_venue_maps_url TEXT,
  default_game_fee_cents INT DEFAULT 0,
  default_currency VARCHAR(3) DEFAULT 'THB',
  platform_fee_percent DECIMAL(4, 2) DEFAULT 5.00,
  tier VARCHAR(10) DEFAULT 'starter', -- starter, pro, elite
  max_members INT DEFAULT 15,
  member_count INT DEFAULT 1,
  stripe_account_id VARCHAR(50), -- Stripe Connect ID for organizer
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leagues_location ON leagues(latitude, longitude);
CREATE INDEX idx_leagues_city ON leagues(city, country);
CREATE INDEX idx_leagues_active ON leagues(is_active) WHERE is_active = TRUE;
```

### Table: `league_members`
```sql
CREATE TABLE league_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(10) DEFAULT 'member', -- organizer, admin, member
  league_elo INT DEFAULT 1000,
  games_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  total_paid_cents INT DEFAULT 0,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(league_id, user_id)
);
```

### Table: `league_games`
```sql
CREATE TABLE league_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID REFERENCES leagues(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id),
  fee_cents INT DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'THB',
  max_players INT DEFAULT 10,
  booked_players INT DEFAULT 0,
  stripe_payment_intent_id VARCHAR(100),
  total_collected_cents INT DEFAULT 0,
  platform_fee_cents INT DEFAULT 0,
  organizer_payout_cents INT DEFAULT 0,
  payout_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: `bookings`
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_game_id UUID REFERENCES league_games(id),
  user_id UUID REFERENCES auth.users(id),
  amount_cents INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'THB',
  stripe_payment_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, refunded, waitlist
  booked_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP,
  UNIQUE(league_game_id, user_id)
);
```

### Table: `organizer_payouts`
```sql
CREATE TABLE organizer_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID REFERENCES leagues(id),
  organizer_id UUID REFERENCES auth.users(id),
  amount_cents INT NOT NULL,
  currency VARCHAR(3),
  stripe_transfer_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
  period_start DATE,
  period_end DATE,
  games_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📱 UI/UX Suggestions

### League Discovery (Home Screen)
```
┌──────────────────────────────┐
│ 🌍 LEAGUES NEAR YOU          │
│ Bangkok, Thailand             │
│                              │
│ ┌──────────────────────────┐ │
│ │ ⚽ Bangkok Thursday Night │ │
│ │ 47 members · 200 THB/game│ │
│ │ Every Thu 19:00 · Arena10│ │
│ │ [Join League]            │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 🏆 Sukhumvit United      │ │
│ │ 23 members · 150 THB/game│ │
│ │ Every Sat 10:00           │ │
│ │ [Join League]            │ │
│ └──────────────────────────┘ │
│                              │
│ [+ Start Your Own League]    │
│                              │
│ 🔍 Search other cities...   │
└──────────────────────────────┘
```

### Booking Flow
```
Step 1: See game → "Thu 28 Mar · 19:00 · Arena10 · 200 THB"
Step 2: [Book Slot] → Stripe Checkout opens
Step 3: Pay 200 THB → Confirmation ✅
Step 4: "You're in! See you Thursday."
Step 5: Push reminder 2h before game

After game:
→ Elo updated (League + Global)
→ Organizer gets 180 THB (90%)
→ BallR gets 20 THB (10%)
```

### Organizer Dashboard
```
┌──────────────────────────────┐
│ 📊 YOUR LEAGUE DASHBOARD     │
│ Bangkok Thursday Night        │
│                              │
│ THIS MONTH:                  │
│ 💰 Revenue: 8,000 THB        │
│ 🎮 Games: 4                  │
│ 👥 Avg attendance: 18/20     │
│ 📈 Growth: +5 new members    │
│                              │
│ NEXT PAYOUT:                 │
│ 7,200 THB → Bank on Apr 1   │
│                              │
│ [Create Game] [Invite] [Stats]│
└──────────────────────────────┘
```

---

## ⚠️ Edge Cases

1. **Player no-show after paying** → Organizer decides refund policy (app supports both)
2. **Game cancelled by organizer** → Auto-refund all players (Stripe)
3. **Organizer doesn't have Stripe** → Free games only (no payment, no fee)
4. **Currency differences** → Stripe handles all conversion
5. **Player in multiple leagues** → Multiple League Elos, one Global Elo
6. **League with 0 games for 90 days** → Auto-archive, remove from discovery
7. **Dispute (player says they played, organizer says no)** → Support ticket
8. **Min players not met** → Organizer can cancel (auto-refund) or proceed

---

## 🚀 Implementation Priority

### Sprint 1 (Week 1-2): Foundation
- [ ] `leagues` + `league_members` tables
- [ ] Create league UI
- [ ] Join league
- [ ] League home screen (member list, basic info)
- [ ] League discovery (list + map)

### Sprint 2 (Week 3-4): Payments
- [ ] Stripe Connect integration (organizer onboarding)
- [ ] Booking flow (Stripe Checkout)
- [ ] Payment split (platform fee)
- [ ] Organizer payout dashboard
- [ ] Refund handling

### Sprint 3 (Week 5-6): Elo + Games
- [ ] League game creation
- [ ] Dual Elo (League + Global)
- [ ] League leaderboard
- [ ] Push notifications
- [ ] Attendance tracking

### Sprint 4 (Week 7-8): Polish
- [ ] League tiers (Starter/Pro/Elite)
- [ ] Organizer tools (auto-schedule, blacklist)
- [ ] Seasons
- [ ] Global discovery + search

---

## 🌍 Global Expansion Strategy

**Phase 1:** Bangkok (you're there, test everything)
**Phase 2:** Berlin (home base, expat network)
**Phase 3:** Madrid, Barcelona (football culture!)
**Phase 4:** London, Amsterdam (big expat communities)
**Phase 5:** São Paulo, Buenos Aires (football-crazy!)
**Phase 6:** Lagos, Nairobi (massive untapped market!)

**No localization needed initially** — English + local currency support via Stripe.

---

## 💡 Killer Feature: "BallR Franchise"

Future evolution: Organizers who build successful leagues get offered **"BallR Franchise"** status:
- Verified organizer badge
- Lower platform fee (3% instead of 5-10%)
- BallR marketing support
- Equipment sponsorship deals
- Revenue share from merchandise
- **Basically:** Turn pickup football into a micro-business

---

**Document Status:** ✅ COMPLETE  
**Ready for:** Replit Implementation  
**Stack:** React + Supabase + Stripe + Vercel  
**Estimated MVP Time:** 6-8 weeks  
**Revenue potential:** $23K/month (Year 1) → $2.1M/month (Year 3)

---

*Created: 2026-03-26 | BallR League Feature Spec v1.0*
