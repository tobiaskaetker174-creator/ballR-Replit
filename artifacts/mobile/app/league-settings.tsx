import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { League, useLeague, useLeagueColors } from '@/context/LeagueContext';
import Colors from '@/constants/colors';

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

export default function LeagueSettingsScreen() {
  const router = useRouter();
  const { activeLeague, addLeague, removeLeague, setActiveLeague } = useLeague();
  const colors = useLeagueColors();
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width >= 1024;
  const desktopWidth = Math.min(width - 40, 1080);

  const canEdit = !!activeLeague && (activeLeague.role === 'owner' || activeLeague.role === 'admin');
  const canDelete = !!activeLeague && activeLeague.role === 'owner';

  const [name, setName] = useState(activeLeague?.name ?? '');
  const [description, setDescription] = useState(activeLeague?.description ?? '');
  const [city, setCity] = useState(activeLeague?.city ?? 'Bangkok');
  const [sport, setSport] = useState(activeLeague?.sport ?? 'Football');
  const [visibility, setVisibility] = useState<'private' | 'public'>(activeLeague?.visibility ?? 'public');
  const [inviteCode, setInviteCode] = useState(activeLeague?.invite_code ?? '');
  const [eloEnabled, setEloEnabled] = useState(activeLeague?.elo_enabled ?? true);
  const [maxPlayers, setMaxPlayers] = useState(String(activeLeague?.max_players_per_team ?? 7));
  const [saving, setSaving] = useState(false);
  const [deleteArmed, setDeleteArmed] = useState(false);

  const listingTone = visibility === 'public' ? colors.accent : Colors.amber;
  const previewCode = useMemo(
    () => inviteCode.trim().toUpperCase() || buildInviteCode(name || 'BallR', city || 'City'),
    [inviteCode, name, city],
  );

  if (!activeLeague || !canEdit) {
    return (
      <View style={[styles.container, { backgroundColor: colors.base }]}>
        <View style={styles.emptyState}>
          <Ionicons name="lock-closed-outline" size={28} color={colors.accent} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Owner access only</Text>
          <Text style={[styles.errorCopy, { color: colors.muted }]}>
            Only league owners and admins can change marketplace settings.
          </Text>
        </View>
      </View>
    );
  }

  const handleSave = () => {
    const parsedMaxPlayers = Number.parseInt(maxPlayers, 10);
    if (!name.trim()) return;
    if (!city.trim()) return;
    if (!Number.isFinite(parsedMaxPlayers) || parsedMaxPlayers < 5 || parsedMaxPlayers > 15) return;

    setSaving(true);

    const updatedLeague: League = {
      ...activeLeague,
      name: name.trim(),
      slug: slugify(name),
      description: description.trim() || null,
      visibility,
      invite_code: previewCode,
      city: city.trim(),
      sport,
      elo_enabled: eloEnabled,
      max_players_per_team: parsedMaxPlayers,
      rules: {
        ...activeLeague.rules,
        marketplace: true,
        city: city.trim(),
        sport,
        visibility,
        invite_only: visibility === 'private',
      },
    };

    addLeague(updatedLeague);
    setActiveLeague(updatedLeague);

    setTimeout(() => {
      setSaving(false);
      router.back();
    }, 700);
  };

  const handleRotateCode = () => {
    setInviteCode(buildInviteCode(name || activeLeague.name, city || activeLeague.city || 'City'));
    setDeleteArmed(false);
  };

  const handleDelete = () => {
    if (!canDelete) return;
    if (!deleteArmed) {
      setDeleteArmed(true);
      return;
    }
    removeLeague(activeLeague.id);
    router.back();
  };

  return (
    <>
    {isDesktopWeb ? (
      <>
        <View pointerEvents="none" style={styles.desktopGlowPrimary} />
        <View pointerEvents="none" style={styles.desktopGlowSecondary} />
      </>
    ) : null}
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.base },
        isDesktopWeb ? [styles.desktopScroll, { maxWidth: desktopWidth }] : undefined,
      ]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { borderColor: colors.separator }]}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={[styles.kicker, { color: listingTone }]}>Marketplace listing</Text>
          <Text style={[styles.headerTitle, { color: colors.text }]}>League settings</Text>
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <View style={isDesktopWeb ? styles.desktopColumns : undefined}>
        <View style={isDesktopWeb ? styles.desktopMainColumn : undefined}>
          <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.separator }]}>
            <View style={[styles.heroBadge, { borderColor: listingTone }]}>
              <Ionicons
                name={visibility === 'public' ? 'globe-outline' : 'lock-closed-outline'}
                size={14}
                color={listingTone}
              />
              <Text style={[styles.heroBadgeText, { color: listingTone }]}>
                {visibility === 'public' ? 'Public listing' : 'Private league'}
              </Text>
            </View>
            <Text style={[styles.heroTitle, { color: colors.text }]}>
              {name || activeLeague.name} in {city}
            </Text>
            <Text style={[styles.heroCopy, { color: colors.muted }]}>
              {visibility === 'public'
                ? 'Visible in city discovery and searchable from the marketplace.'
                : 'Hidden from discovery and locked to invite-code joins only.'}
            </Text>
            <View style={styles.heroStats}>
              <View style={[styles.statPill, { borderColor: colors.separator, backgroundColor: colors.base }]}>
                <Ionicons name="key-outline" size={14} color={listingTone} />
                <Text style={[styles.statText, { color: colors.text }]}>{previewCode}</Text>
              </View>
              <View style={[styles.statPill, { borderColor: colors.separator, backgroundColor: colors.base }]}>
                <Ionicons name="people-outline" size={14} color={listingTone} />
                <Text style={[styles.statText, { color: colors.text }]}>{maxPlayers} per team</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Marketplace profile</Text>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>League name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.separator }]}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>City</Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.separator }]}
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: colors.surface, color: colors.text, borderColor: colors.separator },
                ]}
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Visibility and access</Text>
            <View style={styles.visibilityGrid}>
              <TouchableOpacity
                style={[
                  styles.visibilityCard,
                  { backgroundColor: colors.surface, borderColor: colors.separator },
                  visibility === 'public' && { borderColor: colors.accent, backgroundColor: colors.primary + '28' },
                ]}
                onPress={() => setVisibility('public')}
              >
                <Ionicons name="globe-outline" size={20} color={visibility === 'public' ? colors.accent : colors.muted} />
                <Text style={[styles.visibilityTitle, { color: colors.text }]}>Public</Text>
                <Text style={[styles.visibilityCopy, { color: colors.muted }]}>
                  Listed in discovery, searchable by city and sport.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.visibilityCard,
                  { backgroundColor: colors.surface, borderColor: colors.separator },
                  visibility === 'private' && { borderColor: Colors.amber, backgroundColor: Colors.amber + '18' },
                ]}
                onPress={() => setVisibility('private')}
              >
                <Ionicons name="lock-closed-outline" size={20} color={visibility === 'private' ? Colors.amber : colors.muted} />
                <Text style={[styles.visibilityTitle, { color: colors.text }]}>Private</Text>
                <Text style={[styles.visibilityCopy, { color: colors.muted }]}>
                  Hidden from discovery, join only via invite code.
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.codeRow, { backgroundColor: colors.surface, borderColor: colors.separator }]}>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Invite code</Text>
                <Text style={[styles.rowCopy, { color: colors.muted }]}>
                  Share this for direct joins and private access.
                </Text>
              </View>
              <TextInput
                value={inviteCode}
                onChangeText={(value) => setInviteCode(value.toUpperCase())}
                style={[styles.codeInput, { backgroundColor: colors.base, color: colors.accent, borderColor: colors.separator }]}
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.separator, backgroundColor: colors.surface }]}
              onPress={handleRotateCode}
            >
              <Ionicons name="refresh-outline" size={16} color={colors.text} />
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Rotate code</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Competition settings</Text>
            <View style={[styles.codeRow, { backgroundColor: colors.surface, borderColor: colors.separator }]}>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Sport</Text>
                <Text style={[styles.rowCopy, { color: colors.muted }]}>This controls the marketplace category.</Text>
              </View>
              <View style={styles.sportRow}>
                {SPORT_OPTIONS.map((item) => {
                  const active = sport === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.sportChip,
                        { borderColor: colors.separator, backgroundColor: colors.base },
                        active && { borderColor: colors.accent, backgroundColor: colors.accent },
                      ]}
                      onPress={() => setSport(item)}
                    >
                      <Text style={[styles.sportChipText, active && styles.sportChipTextActive]}>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={[styles.codeRow, { backgroundColor: colors.surface, borderColor: colors.separator }]}>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Players per team</Text>
                <Text style={[styles.rowCopy, { color: colors.muted }]}>Used for lineup planning and match balance.</Text>
              </View>
              <TextInput
                value={maxPlayers}
                onChangeText={setMaxPlayers}
                keyboardType="numeric"
                style={[styles.sizeInput, { backgroundColor: colors.base, color: colors.text, borderColor: colors.separator }]}
              />
            </View>

            <View style={[styles.codeRow, { backgroundColor: colors.surface, borderColor: colors.separator }]}>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>ELO tracking</Text>
                <Text style={[styles.rowCopy, { color: colors.muted }]}>Keep rating history and matchmaking consistent.</Text>
              </View>
              <TouchableOpacity
                style={[styles.switch, eloEnabled && styles.switchActive, { backgroundColor: eloEnabled ? listingTone + '40' : colors.overlay }]}
                onPress={() => setEloEnabled((current) => !current)}
              >
                <View style={[styles.switchDot, eloEnabled && styles.switchDotActive, { backgroundColor: eloEnabled ? listingTone : colors.muted }]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={isDesktopWeb ? styles.desktopSideColumn : undefined}>
          <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.separator }]}>
            <View style={styles.previewTopRow}>
              <Text style={[styles.previewLabel, { color: colors.muted }]}>Listing preview</Text>
              <View style={[styles.previewBadge, { borderColor: colors.separator, backgroundColor: colors.base }]}>
                <Text style={[styles.previewBadgeText, { color: colors.text }]}>
                  {visibility === 'public' ? 'Listed' : 'Invite only'}
                </Text>
              </View>
            </View>
            <Text style={[styles.previewTitle, { color: colors.text }]}>{name || activeLeague.name}</Text>
            <Text style={[styles.previewCopy, { color: colors.muted }]}>
              {city} / {sport} / {previewCode}
            </Text>
          </View>

          <View style={[styles.helpCard, { backgroundColor: colors.surface, borderColor: colors.separator }]}>
            <Text style={[styles.helpTitle, { color: colors.text }]}>Quick admin note</Text>
            <Text style={[styles.helpCopy, { color: colors.muted }]}>
              Public listings perform best when the city, access mode, and invite code are all clearly maintained. Rotate the code when the crew changes.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            onPress={handleSave}
          >
            <Text style={styles.primaryButtonText}>{saving ? 'Saving...' : 'Save changes'}</Text>
          </TouchableOpacity>

          <View style={[styles.dangerZone, { borderColor: Colors.red + '45', backgroundColor: colors.surface }]}>
            <View style={styles.rowText}>
              <Text style={[styles.dangerTitle, { color: Colors.red }]}>Danger zone</Text>
              <Text style={[styles.rowCopy, { color: colors.muted }]}>
                {canDelete
                  ? 'Delete the league from your local marketplace store.'
                  : 'Only owners can delete the league.'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.dangerButton, { borderColor: Colors.red + '55' }]}
              onPress={handleDelete}
              disabled={!canDelete}
            >
              <Text style={styles.dangerButtonText}>
                {canDelete && deleteArmed ? 'Confirm delete' : 'Delete league'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    backgroundColor: 'rgba(232, 169, 58, 0.08)',
  },
  content: {
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
    flex: 1.1,
    gap: 16,
  },
  desktopSideColumn: {
    flex: 0.9,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  errorTitle: { fontSize: 18, fontWeight: '800' },
  errorCopy: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
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
    borderWidth: 1,
  },
  headerText: { flex: 1 },
  kicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', marginTop: 2 },
  saveButton: {
    backgroundColor: Colors.accent,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveButtonText: {
    color: Colors.base,
    fontSize: 12,
    fontWeight: '800',
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
  },
  heroCopy: {
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
    borderWidth: 1,
  },
  statText: {
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  visibilityGrid: {
    gap: 12,
  },
  visibilityCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  visibilityTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  visibilityCopy: {
    fontSize: 13,
    lineHeight: 18,
  },
  codeRow: {
    borderRadius: 18,
    borderWidth: 1,
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
    fontSize: 14,
    fontWeight: '800',
  },
  rowCopy: {
    fontSize: 12,
    lineHeight: 17,
  },
  codeInput: {
    minWidth: 120,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1.4,
  },
  secondaryButton: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sportRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  sportChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sportChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  sportChipTextActive: {
    color: Colors.base,
  },
  sizeInput: {
    width: 70,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  switch: {
    width: 52,
    height: 32,
    borderRadius: 999,
    padding: 4,
    justifyContent: 'center',
  },
  switchActive: {},
  switchDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  switchDotActive: {
    marginLeft: 20,
  },
  previewCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  previewTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  previewBadge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  previewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  previewCopy: {
    fontSize: 13,
  },
  helpCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  helpCopy: {
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.base,
    fontSize: 16,
    fontWeight: '800',
  },
  dangerZone: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },
  dangerTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  dangerButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: Colors.red,
    fontSize: 13,
    fontWeight: '800',
  },
});
