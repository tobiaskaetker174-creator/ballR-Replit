# BallR Project — Full Context for Claude

> **Paste this link in any new Claude chat to give it full context:**
> `Lies https://github.com/tobiaskaetker174-creator/ballR-Replit/blob/main/CLAUDE_CONTEXT.md und arbeite damit weiter.`

---

## Was ist BallR?
BallR ist eine **Pickup-Football-App** für Bangkok und Bali. Spieler finden Spiele, treten bei, bekommen ELO-Ratings, werden "Baller of the Month", gründen Crews und Leagues. Think: "Airbnb for pickup football."

## Tech Stack
- **Frontend:** React Native (Replit baut die App)
- **Backend:** Supabase (Claude/ich baue das Backend)
- **API:** Edge Function `ballr-api` auf Supabase
- **Repo:** https://github.com/tobiaskaetker174-creator/ballR-Replit
- **Deployment:** Vercel (Website), Replit (App)

## Supabase Projekt
- **Projekt:** Kickhub2 (wird für BallR benutzt)
- **Project ID:** `hjybaxcryvtydktktmis`
- **API Base URL:** `https://hjybaxcryvtydktktmis.supabase.co/functions/v1/ballr-api/`
- **Region:** eu-central-1
- **Edge Function:** `ballr-api` (v3.0.0)

## Was existiert im Backend (Stand: 27. März 2026)

### Datenbank-Übersicht
| Tabelle | Rows | Beschreibung |
|---------|------|-------------|
| players | 100 | Fake User mit realistischen Profilen |
| games | 253 | 225 completed + 28 upcoming (Jan-Apr 2026) |
| bookings | 3.081 | Spieler-Anmeldungen mit Team-Zuweisung |
| elo_history | 2.831 | ELO-Veränderung pro Spiel |
| peer_ratings | 5.398 | Skill + Sportsmanship Bewertungen |
| friendships | 220 | Bestätigte Freundschaften |
| friend_requests | 40 | Pending + declined |
| chat_messages | 2.179 | Pre-game + Post-game Chat |
| profile_reviews | 154 | Spieler-Reviews |
| notifications | 479 | Game, Rating, POTM Notifications |
| potm_scores | 122 | Baller of the Month Rankings |
| venues | 8 | 6 Bangkok + 2 Bali |
| venue_kings | ~400 | King of the Field Leaderboard pro Venue |
| venue_ratings | ~200 | Venue-Bewertungen von Spielern |
| cities | 2 | Bangkok + Bali |
| crews | 10 | 8 Bangkok + 2 Bali Crews |
| crew_members | ~60 | Mitglieder mit Crew-ELO |
| crew_games | ~80 | Crew-verlinkte Spiele |
| leagues | 5 | Leagues mit Stripe-Payment-Sim |
| league_members | ~130 | Liga-Mitglieder |
| league_games | ~75 | Liga-Spiele |
| league_payments | ~500 | Simulierte Stripe Payments |

### Features im Backend
1. **Core:** 100 Spieler, 3 Monate simulierte Nutzung, ELO-System, Peer Ratings
2. **Crews (Closed Communities):** 10 Crews, Dual-ELO (Global + Crew), Invite Codes, Crew Games
3. **Leagues:** 5 Leagues, Stripe Payment Simulation, Organizer Dashboard, Revenue Split
4. **Venue Cards + King of the Field:** Venue-Detailseiten, Cover-Bilder, Beschreibungen, pro-Venue Leaderboard
5. **Baller of the Month:** Monatliche Rankings pro Stadt
6. **Social:** Friendships, Chat, Profile Reviews, Notifications

### API Endpoints (alle GET, kein Auth nötig)
```
/health                        — API Status
/players                       — Spielerliste (?city=Bangkok&limit=50)
/players/:id                   — Spieler-Detail
/players/:id/elo-history       — ELO-Verlauf
/players/:id/friends           — Freunde
/players/:id/notifications     — Benachrichtigungen
/players/:id/reviews           — Profil-Reviews
/players/:id/crews             — Spieler's Crews
/players/:id/leagues           — Spieler's Leagues
/games                         — Spiele (?status=upcoming&venue_id=...&city_id=...)
/games/:id                     — Spiel-Detail mit Bookings
/games/:id/chat                — Chat-Nachrichten
/venues                        — Alle Venues mit King
/venues/:id                    — Venue Card (King, Top 3, Games, Reviews)
/venues/:id/kings              — King of the Field Leaderboard
/venues/:id/games              — Spiele an diesem Venue
/venues/:id/ratings            — Venue-Bewertungen
/leaderboard                   — Rankings (?type=baller|elo|champion&city=Bangkok)
/crews                         — Alle Crews (?public=true&city_id=...)
/crews/:id                     — Crew-Detail
/crews/:id/members             — Crew-Mitglieder
/crews/:id/games               — Crew-Spiele
/crews/:id/leaderboard         — Crew-internes Ranking
/crews/join?code=SUKH-abc123   — Crew per Invite Code finden
/leagues                       — Alle Leagues (?featured=true)
/leagues/:id                   — League-Detail
/leagues/:id/members           — League-Mitglieder
/leagues/:id/leaderboard       — League-Ranking
/leagues/:id/games             — League-Spielplan
/leagues/:id/dashboard         — Organizer Dashboard (Revenue Stats)
/leagues/:id/payments          — Payment History
/cities                        — Alle Städte
/stats                         — Gesamtstatistiken
```

### Top Spieler
| Name | ELO | Tier | Spiele | Siege |
|------|-----|------|--------|-------|
| Matt Wang | 1862 | Elite | 42 | 20 |
| Chad Pratt | 1814 | Elite | 150 | 72 |
| Jake O'Brien | 1783 | Elite | 148 | 71 |
| Bella Schmidt | 1719 | Elite | 141 | 66 |
| Maya Chen | 1656 | Elite | 151 | 65 |

### Crews
| Name | Mitglieder | Stadt | Typ |
|------|------------|-------|-----|
| Sunday League BKK | 10 | Bangkok | Public |
| Thonglor United | 8 | Bangkok | Private |
| Digital Nomad Kickabout | 7 | Bangkok | Public |
| Bangkok Titans | 5 | Bangkok | Private, Elite |
| Canggu Ballers | 5 | Bali | Public |

### Leagues
| Name | Spieler | Fee | Organizer |
|------|---------|-----|-----------|
| Bangkok Premier League | 20 | 7.5% | Chad Pratt |
| Chill Kicks Bangkok | 29 | 5% | Freya Park |
| Bali Beach Football League | 21 | 5% | Amir Bilousov |

### King of the Field
| Venue | King | Siege |
|-------|------|-------|
| Pitch Arena Sukhumvit | Kai Andersen | 17 |
| Benjakitti Park | Jake O'Brien | 17 |
| Bangkok Football Club | Kai Andersen | 15 |
| Seminyak FC | Boris Doyle | 15 |

## Wichtige Dateien im Repo
- `REPLIT_BACKEND_HANDOFF.md` — Detailliertes Handoff-Dokument für Replit
- `CLAUDE_HANDOFF.md` — Original Handoff von Replit an Claude
- `CLAUDE_CONTEXT.md` — Dieses Dokument (Kontext für neue Chats)
- `ballr-closed-communities-feature.md` — Crews Feature Spec
- `ballr-league-feature.md` — League Feature Spec

## Wer baut was?
- **Claude (ich):** Backend, Supabase Schema, API, Daten, Edge Functions
- **Replit:** Frontend, Mobile App, React Native UI
- **Tobias:** Produktvision, Feature Specs, Design Direction

## Offene Aufgaben / Nächste Schritte
- [ ] Replit soll Mock-Daten durch API-Calls ersetzen
- [ ] Crews UI in der App bauen
- [ ] Leagues UI in der App bauen
- [ ] Venue Cards UI in der App bauen
- [ ] Website (BallR Marketing Site) weiterentwickeln
- [ ] Echte Stripe Integration (aktuell nur Demo-Daten)
- [ ] Auth Flow (aktuell keine echte Auth, nur Fake-User)
