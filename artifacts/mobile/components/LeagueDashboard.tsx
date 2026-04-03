import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLeague, useLeagueColors } from '@/context/LeagueContext';

// Placeholder component showing league-specific dashboard
export function LeagueDashboard() {
  const { activeLeague } = useLeague();
  const colors = useLeagueColors();

  if (!activeLeague) {
    return (
      <View style={[styles.container, { backgroundColor: colors.base }]}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏆</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No League Selected</Text>
          <Text style={[styles.emptySubtext, { color: colors.muted }]}>
            Create a league or join one to get started
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.base }]}
      contentContainerStyle={styles.content}
    >
      {/* League Header */}
      <View style={[styles.header, { backgroundColor: colors.primary + '20' }]}>
        <View style={[styles.leagueBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.accent }]}>
            {activeLeague.name.charAt(0)}
          </Text>
        </View>
        <Text style={[styles.leagueName, { color: colors.text }]}>
          {activeLeague.name}
        </Text>
        <Text style={[styles.leagueMeta, { color: colors.muted }]}>
          {activeLeague.city} · {activeLeague.sport} · {activeLeague.max_players_per_team}v{activeLeague.max_players_per_team}
        </Text>
        {activeLeague.role === 'owner' && (
          <TouchableOpacity style={[styles.settingsBtn, { borderColor: colors.accent + '40' }]}>
            <Ionicons name="settings-outline" size={14} color={colors.accent} />
            <Text style={[styles.settingsText, { color: colors.accent }]}>Settings</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Members', value: String(activeLeague.member_count ?? 0), icon: 'people' as const },
          { label: 'ELO', value: activeLeague.elo_enabled ? 'ON' : 'OFF', icon: 'flash' as const },
          { label: 'Format', value: `${activeLeague.max_players_per_team}v${activeLeague.max_players_per_team}`, icon: 'football' as const },
        ].map((stat) => (
          <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name={stat.icon} size={18} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.accent }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Standings Preview */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🏆 Standings</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.accent }]}>See All</Text>
          </TouchableOpacity>
        </View>
        {/* Placeholder standings */}
        {[1, 2, 3].map((rank) => (
          <View key={rank} style={[styles.standingRow, { borderBottomColor: colors.separator }]}>
            <Text style={[styles.rank, { color: rank <= 3 ? colors.accent : colors.muted }]}>
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
            </Text>
            <View style={styles.standingInfo}>
              <Text style={[styles.standingName, { color: colors.text }]}>Player {rank}</Text>
              <Text style={[styles.standingElo, { color: colors.muted }]}>
                {activeLeague.elo_enabled ? `${1500 - rank * 30} ELO` : `${10 - rank} wins`}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Upcoming Games */}
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📅 Upcoming</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: colors.accent }]}>Schedule</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.noGames}>
          <Text style={[styles.noGamesText, { color: colors.muted }]}>
            No upcoming games. Tap + to create one.
          </Text>
        </View>
      </View>

      {/* Invite Code */}
      <View style={[styles.inviteCard, { backgroundColor: colors.primary + '15', borderColor: colors.accent + '30' }]}>
        <Text style={[styles.inviteLabel, { color: colors.muted }]}>Invite Code</Text>
        <Text style={[styles.inviteCode, { color: colors.accent }]}>
          {activeLeague.invite_code}
        </Text>
        <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.accent }]}>
          <Ionicons name="share-outline" size={14} color={colors.primary} />
          <Text style={[styles.shareBtnText, { color: colors.primary }]}>Share Invite</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 100 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 200 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800' },
  emptySubtext: { fontSize: 13, marginTop: 8 },
  header: {
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  leagueBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeText: { fontSize: 24, fontWeight: '900' },
  leagueName: { fontSize: 22, fontWeight: '800' },
  leagueMeta: { fontSize: 12, marginTop: 4 },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  settingsText: { fontSize: 12, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '500' },
  section: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  seeAll: { fontSize: 12, fontWeight: '600' },
  standingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  rank: { fontSize: 16, width: 28 },
  standingInfo: { flex: 1 },
  standingName: { fontSize: 14, fontWeight: '600' },
  standingElo: { fontSize: 11, marginTop: 2 },
  noGames: { paddingVertical: 20, alignItems: 'center' },
  noGamesText: { fontSize: 13 },
  inviteCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  inviteLabel: { fontSize: 11, fontWeight: '500', marginBottom: 4 },
  inviteCode: { fontSize: 24, fontWeight: '800', letterSpacing: 4, fontFamily: 'monospace' },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  shareBtnText: { fontSize: 13, fontWeight: '700' },
});
