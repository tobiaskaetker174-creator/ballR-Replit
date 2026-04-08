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
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { League, useLeague } from '@/context/LeagueContext';

const CITY_OPTIONS = [
  'Bangkok',
  'Berlin',
  'Lisbon',
  'London',
  'Barcelona',
  'New York',
  'Tokyo',
  'Dubai',
];

const SPORT_OPTIONS = ['Football', 'Futsal', 'Basketball', 'Volleyball', 'Padel'];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function buildInviteCode(name: string, city: string) {
  const cityPart = city.slice(0, 3).toUpperCase().padEnd(3, 'X');
  const namePart = name
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 2)
    .toUpperCase()
    .padEnd(2, 'X');
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${cityPart}${namePart}${suffix}`;
}

function paletteForVisibility(visibility: 'public' | 'private') {
  if (visibility === 'public') {
    return {
      primary: Colors.primary,
      accent: Colors.accent,
      badge: Colors.accent,
      badgeText: Colors.base,
    };
  }

  return {
    primary: '#2D2520',
    accent: Colors.amber,
    badge: Colors.amber,
    badgeText: Colors.base,
  };
}

export default function CreateLeagueScreen() {
  const router = useRouter();
  const { addLeague, setActiveLeague } = useLeague();
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= 1024;
  const desktopWidth = Math.min(width - 40, 1080);

  const [name, setName] = useState('');
  const [city, setCity] = useState('Bangkok');
  const [sport, setSport] = useState('Football');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [inviteCode, setInviteCode] = useState('BKKBALL2026');
  const [maxPlayers, setMaxPlayers] = useState('7');
  const [eloEnabled, setEloEnabled] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const palette = useMemo(() => paletteForVisibility(visibility), [visibility]);

  const previewCode = useMemo(() => {
    const code = inviteCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length >= 5) return code.slice(0, 12);
    return buildInviteCode(name || 'BallR', city || 'City');
  }, [inviteCode, name, city]);

  const handlePublish = () => {
    if (!name.trim()) {
      setError('Give the league a clear name so players know what they are joining.');
      return;
    }

    if (!city.trim()) {
      setError('Pick a city for marketplace discovery.');
      return;
    }

    const teamSize = Number.parseInt(maxPlayers, 10);
    if (!Number.isFinite(teamSize) || teamSize < 5 || teamSize > 15) {
      setError('Team size should stay between 5 and 15 players.');
      return;
    }

    setError('');
    setSaving(true);

    const league: League = {
      id: `league-${Date.now()}`,
      name: name.trim(),
      slug: slugify(name),
      description: description.trim() || null,
      logo_url: null,
      primary_color: palette.primary,
      accent_color: palette.accent,
      rules: {
        marketplace: true,
        city: city.trim(),
        sport,
        visibility,
        invite_only: visibility === 'private',
      },
      visibility,
      invite_code: previewCode,
      city: city.trim(),
      sport,
      max_players_per_team: teamSize,
      elo_enabled: eloEnabled,
      role: 'owner',
      member_count: 1,
    };

    addLeague(league);
    setActiveLeague(league);

    setTimeout(() => {
      setSaving(false);
      router.back();
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {isDesktopWeb ? (
        <>
          <View pointerEvents="none" style={styles.desktopGlowPrimary} />
          <View pointerEvents="none" style={styles.desktopGlowSecondary} />
        </>
      ) : null}
      <ScrollView
        style={isDesktopWeb ? [styles.desktopScroll, { maxWidth: desktopWidth }] : undefined}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>Marketplace</Text>
            <Text style={styles.headerTitle}>Publish a League</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="globe-outline" size={14} color={Colors.accent} />
            <Text style={styles.headerBadgeText}>Live</Text>
          </View>
        </View>

        <View style={isDesktopWeb ? styles.desktopColumns : undefined}>
          <View style={isDesktopWeb ? styles.desktopMainColumn : undefined}>
            <View style={styles.heroCard}>
              <View style={styles.heroIcon}>
                <Ionicons name="storefront-outline" size={28} color={Colors.accent} />
              </View>
              <Text style={styles.heroTitle}>Turn your crew into a BallR listing</Text>
              <Text style={styles.heroCopy}>
                Build a public league for city discovery or keep it private behind an invite code.
                Either way, your league gets a clean marketplace profile.
              </Text>
              <View style={styles.heroStats}>
                <View style={styles.statPill}>
                  <Ionicons name="location-outline" size={14} color={Colors.accent} />
                  <Text style={styles.statText}>City-based discovery</Text>
                </View>
                <View style={styles.statPill}>
                  <Ionicons name="key-outline" size={14} color={Colors.accent} />
                  <Text style={styles.statText}>Invite-code joins</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Marketplace visibility</Text>
              <View style={styles.visibilityGrid}>
                <TouchableOpacity
                  style={[
                    styles.visibilityCard,
                    visibility === 'public' && styles.visibilityCardActive,
                  ]}
                  onPress={() => setVisibility('public')}
                >
                  <Ionicons
                    name="globe-outline"
                    size={20}
                    color={visibility === 'public' ? Colors.accent : Colors.muted}
                  />
                  <Text style={styles.visibilityTitle}>Public listing</Text>
                  <Text style={styles.visibilityCopy}>
                    Shows up in city discovery and search. Players can join from the marketplace.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.visibilityCard,
                    visibility === 'private' && styles.visibilityCardActive,
                  ]}
                  onPress={() => setVisibility('private')}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={visibility === 'private' ? Colors.amber : Colors.muted}
                  />
                  <Text style={styles.visibilityTitle}>Private group</Text>
                  <Text style={styles.visibilityCopy}>
                    Hidden from discovery. Players join only with your invite code.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>League details</Text>
              <View style={styles.field}>
                <Text style={styles.label}>League name</Text>
                <TextInput
                  value={name}
                  onChangeText={(value) => {
                    setName(value);
                    setError('');
                  }}
                  placeholder="Bangkok Night Crew"
                  placeholderTextColor={Colors.muted}
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  value={city}
                  onChangeText={(value) => {
                    setCity(value);
                    setError('');
                  }}
                  placeholder="Bangkok"
                  placeholderTextColor={Colors.muted}
                  style={styles.input}
                />
                {isDesktopWeb ? (
                  <View style={styles.desktopChipGrid}>
                    {CITY_OPTIONS.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[styles.chip, city === item && styles.chipActive]}
                        onPress={() => setCity(item)}
                      >
                        <Text style={[styles.chipText, city === item && styles.chipTextActive]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {CITY_OPTIONS.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[styles.chip, city === item && styles.chipActive]}
                        onPress={() => setCity(item)}
                      >
                        <Text style={[styles.chipText, city === item && styles.chipTextActive]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Sport</Text>
                {isDesktopWeb ? (
                  <View style={styles.desktopChipGrid}>
                    {SPORT_OPTIONS.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[styles.chip, sport === item && styles.chipActive]}
                        onPress={() => setSport(item)}
                      >
                        <Text style={[styles.chipText, sport === item && styles.chipTextActive]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
                    {SPORT_OPTIONS.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[styles.chip, sport === item && styles.chipActive]}
                        onPress={() => setSport(item)}
                      >
                        <Text style={[styles.chipText, sport === item && styles.chipTextActive]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="A friendly weekly league for night games and social runs."
                  placeholderTextColor={Colors.muted}
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Access and competition</Text>
              <View style={styles.rowCard}>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Invite code</Text>
                  <Text style={styles.rowCopy}>
                    {visibility === 'private'
                      ? 'Required for entry. Share it with your group.'
                      : 'Still useful for direct shares, even though the league is public.'}
                  </Text>
                </View>
                <TextInput
                  value={inviteCode}
                  onChangeText={(value) => {
                    setInviteCode(value.toUpperCase());
                    setError('');
                  }}
                  placeholder="BKKBALL2026"
                  placeholderTextColor={Colors.muted}
                  style={styles.codeInput}
                  autoCapitalize="characters"
                />
              </View>

              <View style={styles.rowCard}>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Team size</Text>
                  <Text style={styles.rowCopy}>Used for match setup and roster planning.</Text>
                </View>
                <TextInput
                  value={maxPlayers}
                  onChangeText={setMaxPlayers}
                  keyboardType="numeric"
                  style={styles.sizeInput}
                />
              </View>

              <View style={styles.rowCard}>
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>ELO tracking</Text>
                  <Text style={styles.rowCopy}>Track player progress and keep matchmaking balanced.</Text>
                </View>
                <TouchableOpacity
                  style={[styles.switch, eloEnabled && styles.switchActive]}
                  onPress={() => setEloEnabled((current) => !current)}
                >
                  <View style={[styles.switchDot, eloEnabled && styles.switchDotActive]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={isDesktopWeb ? styles.desktopSideColumn : undefined}>
            <View style={styles.previewCard}>
              <View style={styles.previewTopRow}>
                <Text style={styles.previewLabel}>Marketplace preview</Text>
                <View style={styles.previewBadge}>
                  <Text style={styles.previewBadgeText}>
                    {visibility === 'public' ? 'Listed' : 'Invite only'}
                  </Text>
                </View>
              </View>
              <Text style={styles.previewTitle}>{name || 'Your new league'}</Text>
              <Text style={styles.previewCopy}>
                {city || 'Any city'} / {sport} / {previewCode}
              </Text>
              <View style={styles.previewFooter}>
                <View style={styles.previewPill}>
                  <Ionicons name="people-outline" size={14} color={Colors.accent} />
                  <Text style={styles.previewPillText}>{maxPlayers || '7'} per team</Text>
                </View>
                <View style={styles.previewPill}>
                  <Ionicons
                    name={visibility === 'public' ? 'radio-outline' : 'shield-checkmark-outline'}
                    size={14}
                    color={Colors.accent}
                  />
                  <Text style={styles.previewPillText}>
                    {visibility === 'public' ? 'Public discovery' : 'Private access'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.sideInfoCard}>
              <Text style={styles.sideInfoTitle}>Before you publish</Text>
              <Text style={styles.sideInfoCopy}>Make the listing public if you want it discoverable in city search. Keep it private if the invite code should stay inside your crew.</Text>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.publishButton, saving && styles.publishButtonDisabled]}
              onPress={handlePublish}
              disabled={saving}
            >
              <Text style={styles.publishButtonText}>
                {saving ? 'Publishing...' : 'Publish League'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerNote}>
              Public leagues show up in city search. Private leagues stay hidden and only accept the code you share.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  desktopScroll: {
    width: '100%',
    alignSelf: 'center',
  },
  desktopGlowPrimary: {
    position: 'absolute',
    top: 120,
    left: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: 'rgba(45, 90, 39, 0.14)',
  },
  desktopGlowSecondary: {
    position: 'absolute',
    bottom: 120,
    right: -120,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(91, 143, 232, 0.08)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 16,
  },
  desktopColumns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
  desktopMainColumn: {
    flex: 1.15,
    gap: 16,
  },
  desktopSideColumn: {
    flex: 0.85,
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
  visibilityGrid: {
    gap: 12,
  },
  visibilityCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 16,
    gap: 8,
  },
  visibilityCardActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.primary + '28',
  },
  visibilityTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  visibilityCopy: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.separator,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: Colors.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  chipRow: {
    gap: 8,
    paddingRight: 8,
  },
  desktopChipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  rowCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  rowTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  rowCopy: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  codeInput: {
    minWidth: 118,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  sizeInput: {
    width: 72,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  switch: {
    width: 52,
    height: 32,
    borderRadius: 999,
    padding: 4,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: Colors.accent + '40',
  },
  switchDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.muted,
  },
  switchDotActive: {
    marginLeft: 20,
    backgroundColor: Colors.accent,
  },
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 18,
    gap: 10,
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewLabel: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  previewBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.separator,
  },
  previewBadgeText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  previewTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  previewCopy: {
    color: Colors.muted,
    fontSize: 13,
  },
  previewFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewPill: {
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
  previewPillText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  sideInfoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.separator,
    padding: 16,
    gap: 8,
  },
  sideInfoTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  sideInfoCopy: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  error: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: Colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  publishButtonDisabled: {
    opacity: 0.7,
  },
  publishButtonText: {
    color: Colors.base,
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    color: Colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
