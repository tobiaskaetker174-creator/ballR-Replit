import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@/components/AppIcon';
import { useLeague, useLeagueColors } from '@/context/LeagueContext';

// League Settings screen â€” for owners/admins
export default function LeagueSettingsScreen() {
  const router = useRouter();
  const { activeLeague } = useLeague();
  const colors = useLeagueColors();

  const [name, setName] = useState(activeLeague?.name ?? '');
  const [description, setDescription] = useState(activeLeague?.description ?? '');
  const [isPublic, setIsPublic] = useState(activeLeague?.visibility === 'public');
  const [eloEnabled, setEloEnabled] = useState(activeLeague?.elo_enabled ?? true);
  const [maxPlayers, setMaxPlayers] = useState(String(activeLeague?.max_players_per_team ?? 7));

  if (!activeLeague || (activeLeague.role !== 'owner' && activeLeague.role !== 'admin')) {
    return (
      <View style={[styles.container, { backgroundColor: colors.base }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          Only league owners and admins can access settings.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.base }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>League Settings</Text>
        <TouchableOpacity>
          <Text style={[styles.saveBtn, { color: colors.accent }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {/* Name */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>League Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.separator }]}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.separator }]}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* Visibility */}
        <View style={[styles.toggleRow, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.toggleLabel, { color: colors.text }]}>Public League</Text>
            <Text style={[styles.toggleDesc, { color: colors.muted }]}>
              Visible on BallR website, anyone can join
            </Text>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: colors.overlay, true: colors.accent + '60' }}
            thumbColor={isPublic ? colors.accent : colors.muted}
          />
        </View>

        {/* ELO */}
        <View style={[styles.toggleRow, { backgroundColor: colors.surface }]}>
          <View>
            <Text style={[styles.toggleLabel, { color: colors.text }]}>ELO Rating System</Text>
            <Text style={[styles.toggleDesc, { color: colors.muted }]}>
              Track skill ratings for all players
            </Text>
          </View>
          <Switch
            value={eloEnabled}
            onValueChange={setEloEnabled}
            trackColor={{ false: colors.overlay, true: colors.accent + '60' }}
            thumbColor={eloEnabled ? colors.accent : colors.muted}
          />
        </View>

        {/* Max Players */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Players per Team</Text>
          <TextInput
            value={maxPlayers}
            onChangeText={setMaxPlayers}
            keyboardType="numeric"
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.separator, width: 80 }]}
          />
        </View>

        {/* Colors */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>League Colors</Text>
          <View style={styles.colorPreview}>
            <View style={[styles.colorSwatch, { backgroundColor: activeLeague.primary_color }]}>
              <Text style={[styles.colorLabel, { color: activeLeague.accent_color }]}>Primary</Text>
            </View>
            <View style={[styles.colorSwatch, { backgroundColor: activeLeague.accent_color }]}>
              <Text style={[styles.colorLabel, { color: activeLeague.primary_color }]}>Accent</Text>
            </View>
          </View>
        </View>

        {/* Invite Code */}
        <View style={[styles.inviteSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.label, { color: colors.text }]}>Invite Code</Text>
          <Text style={[styles.inviteCode, { color: colors.accent }]}>
            {activeLeague.invite_code}
          </Text>
          <TouchableOpacity style={[styles.regenerateBtn, { borderColor: colors.accent + '40' }]}>
            <Text style={[styles.regenerateText, { color: colors.accent }]}>Regenerate Code</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={[styles.dangerZone, { borderColor: colors.primary + '30' }]}>
          <Text style={[styles.dangerTitle, { color: '#E05252' }]}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerBtn}>
            <Text style={styles.dangerBtnText}>Delete League</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  errorText: { fontSize: 16, textAlign: 'center', marginTop: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  saveBtn: { fontSize: 16, fontWeight: '700' },
  form: { paddingHorizontal: 16, paddingBottom: 100, gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600' },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
  },
  toggleLabel: { fontSize: 14, fontWeight: '600' },
  toggleDesc: { fontSize: 11, marginTop: 2 },
  colorPreview: { flexDirection: 'row', gap: 12 },
  colorSwatch: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorLabel: { fontSize: 12, fontWeight: '700' },
  inviteSection: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
  },
  inviteCode: { fontSize: 22, fontWeight: '800', letterSpacing: 3, fontFamily: 'monospace' },
  regenerateBtn: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  regenerateText: { fontSize: 12, fontWeight: '600' },
  dangerZone: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  dangerTitle: { fontSize: 14, fontWeight: '700' },
  dangerBtn: {
    backgroundColor: '#E0525220',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  dangerBtnText: { color: '#E05252', fontSize: 13, fontWeight: '700' },
});

