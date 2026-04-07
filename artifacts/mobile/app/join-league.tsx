import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { League, useLeague } from '@/context/LeagueContext';

const CITY_OPTIONS = ['All', 'Bangkok', 'Berlin', 'Lisbon', 'London', 'Barcelona', 'Tokyo'];

const DEMO_LEAGUES = [
  {
    id: 'bangkok-night-ball',
    name: 'Bangkok Night Ball',
    city: 'Bangkok',
    sport: 'Football',
    description: 'Fast-paced weeknight runs near the river.',
    invite_code: 'BKKBALL2026',
    visibility: 'public' as const,
    member_count: 28,
    max_players_per_team: 7,
    primary_color: Colors.primary,
    accent_color: Colors.accent,
  },
  {
    id: 'berlin-moss-league',
    name: 'Berlin Moss League',
    city: 'Berlin',
    sport: 'Futsal',
    description: 'Invite-first group with a tight rotation and balanced teams.',
    invite_code: 'BERMOSS88',
    visibility: 'public' as const,
    member_count: 19,
    max_players_per_team: 5,
    primary_color: '#30473A',
    accent_color: Colors.accent,
  },
  {
    id: 'lisbon-iron-circle',
    name: 'Lisbon Iron Circle',
    city: 'Lisbon',
    sport: 'Football',
    description: 'Competitive league with a local host every Sunday.',
    invite_code: 'LISIRON42',
    visibility: 'public' as const,
    member_count: 36,
    max_players_per_team: 7,
    primary_color: '#3A2E26',
    accent_color: Colors.amber,
  },
  {
    id: 'tokyo-grid-run',
    name: 'Tokyo Grid Run',
    city: 'Tokyo',
    sport: 'Basketball',
    description: 'Night lights, quick joins, and a busy city roster.',
    invite_code: 'TOKGRID19',
    visibility: 'public' as const,
    member_count: 41,
    max_players_per_team: 5,
    primary_color: '#203139',
    accent_color: Colors.teal,
  },
  {
    id: 'barcelona-sunday-crew',
    name: 'Barcelona Sunday Crew',
    city: 'Barcelona',
    sport: 'Football',
    description: 'Private crew with a fixed roster. Invite only.',
    invite_code: 'BCNSUN77',
    visibility: 'private' as const,
    member_count: 14,
    max_players_per_team: 7,
    primary_color: '#3A2636',
    accent_color: Colors.purple,
  },
  {
    id: 'london-office-league',
    name: 'London Office League',
    city: 'London',
    sport: 'Futsal',
    description: 'Company league. Join with your team code.',
    invite_code: 'LNDFUT55',
    visibility: 'private' as const,
    member_count: 22,
    max_players_per_team: 5,
    primary_color: '#26303A',
    accent_color: Colors.blue,
  },
] satisfies Array<{
  id: string;
  name: string;
  city: string;
  sport: string;
  description: string;
  invite_code: string;
  visibility: 'public' | 'private';
  member_count: number;
  max_players_per_team: number;
  primary_color: string;
  accent_color: string;
}>;

function toLeague(data: (typeof DEMO_LEAGUES)[number]): League {
  return {
    id: data.id,
    name: data.name,
    slug: data.id,
    description: data.description,
    logo_url: null,
    primary_color: data.primary_color,
    accent_color: data.accent_color,
    rules: {
      marketplace: true,
      city: data.city,
      sport: data.sport,
      invite_only: data.visibility === 'private',
    },
    visibility: data.visibility,
    invite_code: data.invite_code,
    city: data.city,
    sport: data.sport,
    max_players_per_team: data.max_players_per_team,
    elo_enabled: true,
    role: 'member',
    member_count: data.member_count,
  };
}

export default function JoinLeagueScreen() {
  const router = useRouter();
  const { addLeague, setActiveLeague } = useLeague();
  const [cityFilter, setCityFilter] = useState('All');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLeagueId, setSelectedLeagueId] = useState(DEMO_LEAGUES[0].id);

  const visibleLeagues = useMemo(() => {
    if (cityFilter === 'All') return DEMO_LEAGUES;
    return DEMO_LEAGUES.filter((league) => league.city === cityFilter);
  }, [cityFilter]);

  const joinLeague = (league: (typeof DEMO_LEAGUES)[number]) => {
    const nextLeague = toLeague(league);
    addLeague(nextLeague);
    setActiveLeague(nextLeague);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 900);
  };

  const handleJoinByCode = () => {
    if (inviteCode.trim().length < 4) {
      setError('Enter a valid invite code.');
      return;
    }

    const match = DEMO_LEAGUES.find((league) => league.invite_code === inviteCode.trim().toUpperCase());
    if (!match) {
      setError('No league matched that code in the demo marketplace. Try one of the listed leagues.');
      return;
    }

    setError('');
    joinLeague(match);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>Marketplace</Text>
            <Text style={styles.headerTitle}>Join a League</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="search-outline" size={14} color={Colors.accent} />
            <Text style={styles.headerBadgeText}>Discover</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="location-outline" size={28} color={Colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Find a public league or join a private one</Text>
          <Text style={styles.heroCopy}>
            Public leagues show up by city. Private leagues stay hidden and only accept a shared invite code.
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.statPill}>
              <Ionicons name="globe-outline" size={14} color={Colors.accent} />
              <Text style={styles.statText}>City discovery</Text>
            </View>
            <View style={styles.statPill}>
              <Ionicons name="key-outline" size={14} color={Colors.accent} />
              <Text style={styles.statText}>Code access</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore leagues</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {CITY_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, cityFilter === item && styles.chipActive]}
                onPress={() => setCityFilter(item)}
              >
                <Text style={[styles.chipText, cityFilter === item && styles.chipTextActive]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.list}>
            {visibleLeagues.map((league) => {
              const active = selectedLeagueId === league.id;
              return (
                <TouchableOpacity
                  key={league.id}
                  style={[styles.leagueCard, active && styles.leagueCardActive]}
                  onPress={() => setSelectedLeagueId(league.id)}
                >
                  <View style={styles.cardTopRow}>
                    <View style={[styles.cardDot, { backgroundColor: league.accent_color }]} />
                    <View style={styles.cardMeta}>
                      <Text style={styles.cardTitle}>{league.name}</Text>
                      <Text style={styles.cardSubtitle}>
                        {league.city} / {league.sport}
                      </Text>
                    </View>
                    <View style={styles.cardBadge}>
                      <Text style={styles.cardBadgeText}>{league.visibility}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardCopy}>{league.description}</Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.cardPill}>
                      <Ionicons name="people-outline" size={14} color={Colors.accent} />
                      <Text style={styles.cardPillText}>{league.member_count} players</Text>
                    </View>
                    <View style={styles.cardPill}>
                      <Ionicons name={league.visibility === 'private' ? 'lock-closed-outline' : 'key-outline'} size={14} color={league.visibility === 'private' ? Colors.amber : Colors.accent} />
                      <Text style={[styles.cardPillText, league.visibility === 'private' && { color: Colors.amber }]}>
                        {league.visibility === 'private' ? 'Invite only' : league.invite_code}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[styles.cardJoinBtn, league.visibility === 'private' && { backgroundColor: Colors.amber + '22', borderColor: Colors.amber }]}
                      onPress={() => {
                        if (league.visibility === 'private') {
                          setInviteCode('');
                        } else {
                          joinLeague(league);
                        }
                      }}
                      disabled={loading}
                    >
                      <Text style={[styles.cardJoinText, league.visibility === 'private' && { color: Colors.amber }]}>
                        {league.visibility === 'private' ? 'Use code' : 'Join'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join by invite code</Text>
          <View style={styles.codeCard}>
            <Text style={styles.codeCardCopy}>
              Use this for private leagues or direct invites from the owner.
            </Text>
            <TextInput
              value={inviteCode}
              onChangeText={(text) => {
                setInviteCode(text.toUpperCase());
                setError('');
              }}
              placeholder="e.g. BKKBALL2026"
              placeholderTextColor={Colors.muted}
              style={styles.input}
              autoCapitalize="characters"
              maxLength={16}
            />
            <View style={styles.codeHintRow}>
              <View style={styles.codeHintPill}>
                <Text style={styles.codeHintText}>Private leagues stay hidden from discovery</Text>
              </View>
              <View style={styles.codeHintPill}>
                <Text style={styles.codeHintText}>Try {DEMO_LEAGUES[0].invite_code}</Text>
              </View>
            </View>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.joinBtn, loading && styles.joinBtnDisabled]}
          onPress={handleJoinByCode}
          disabled={loading || !inviteCode.trim()}
        >
          <Text style={styles.joinBtnText}>{loading ? 'Joining...' : 'Join with code'}</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          If you already see a public league card above, you can join it directly. Private leagues need the code.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  headerText: {
    flex: 1,
  },
  kicker: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  headerBadgeText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 18,
    gap: 12,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '40',
    borderWidth: 1,
    borderColor: Colors.accent + '20',
  },
  heroTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  heroCopy: {
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  heroStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  statText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  chipTextActive: {
    color: Colors.base,
  },
  list: {
    gap: 12,
  },
  leagueCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 16,
    gap: 10,
  },
  leagueCardActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.primary + '28',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  cardMeta: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  cardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  cardBadgeText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  cardCopy: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  cardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  cardPillText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  cardJoinBtn: {
    marginLeft: 'auto',
    backgroundColor: Colors.accent,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  cardJoinText: {
    color: Colors.base,
    fontSize: 12,
    fontWeight: '800',
  },
  codeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 16,
    gap: 12,
  },
  codeCardCopy: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: '800',
    color: Colors.accent,
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  codeHintRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  codeHintPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  codeHintText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  error: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: '600',
  },
  joinBtn: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinBtnDisabled: {
    opacity: 0.7,
  },
  joinBtnText: {
    color: Colors.base,
    fontSize: 16,
    fontWeight: '800',
  },
  hint: {
    color: Colors.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
