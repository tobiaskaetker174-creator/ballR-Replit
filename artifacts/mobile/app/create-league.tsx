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
import Colors from '@/constants/colors';

const COLOR_PRESETS = [
  { name: 'Forest', primary: '#2D5A27', accent: '#A1D494' },
  { name: 'Ocean', primary: '#1E3A5F', accent: '#5BA4E6' },
  { name: 'Sunset', primary: '#8B4513', accent: '#FFB347' },
  { name: 'Night', primary: '#1A1A2E', accent: '#E94560' },
  { name: 'Gold', primary: '#FFD700', accent: '#009B3A' },
  { name: 'Royal', primary: '#4B0082', accent: '#DA70D6' },
];

export default function CreateLeagueScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [eloEnabled, setEloEnabled] = useState(true);
  const [maxPlayers, setMaxPlayers] = useState(7);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [loading, setLoading] = useState(false);

  const colors = COLOR_PRESETS[selectedPreset];

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);

    // TODO: Call Supabase to create league
    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create League</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Preview */}
      <View style={[styles.preview, { borderColor: colors.accent + '30' }]}>
        <View style={{ height: 3, backgroundColor: colors.primary, borderRadius: 2, marginBottom: 12 }} />
        <View style={styles.previewRow}>
          <View style={[styles.previewBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.previewInitial, { color: colors.accent }]}>
              {name ? name.charAt(0) : '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.previewName}>{name || 'Your League'}</Text>
            <Text style={styles.previewMeta}>{city || 'City'} Â· football Â· {maxPlayers}v{maxPlayers}</Text>
          </View>
        </View>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>League Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Kreuzberg Kickers"
            placeholderTextColor={Colors.muted}
            style={styles.input}
            maxLength={50}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What's your league about?"
            placeholderTextColor={Colors.muted}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>City</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Bangkok"
            placeholderTextColor={Colors.muted}
            style={styles.input}
          />
        </View>

        {/* Player count */}
        <View style={styles.field}>
          <Text style={styles.label}>Players per Team: {maxPlayers}v{maxPlayers}</Text>
          <View style={styles.playerButtons}>
            {[3, 5, 6, 7, 11].map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.playerBtn,
                  maxPlayers === n && { backgroundColor: Colors.accent + '20', borderColor: Colors.accent },
                ]}
                onPress={() => setMaxPlayers(n)}
              >
                <Text style={[styles.playerBtnText, maxPlayers === n && { color: Colors.accent }]}>
                  {n}v{n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Colors */}
        <View style={styles.field}>
          <Text style={styles.label}>League Colors</Text>
          <View style={styles.colorGrid}>
            {COLOR_PRESETS.map((preset, i) => (
              <TouchableOpacity
                key={preset.name}
                style={[
                  styles.colorOption,
                  selectedPreset === i && { borderColor: Colors.accent, borderWidth: 2 },
                ]}
                onPress={() => setSelectedPreset(i)}
              >
                <View style={styles.colorDots}>
                  <View style={[styles.colorDot, { backgroundColor: preset.primary }]} />
                  <View style={[styles.colorDot, { backgroundColor: preset.accent }]} />
                </View>
                <Text style={styles.colorName}>{preset.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>Public League</Text>
            <Text style={styles.toggleDesc}>Listed on website, anyone can join</Text>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: Colors.overlay, true: Colors.accent + '60' }}
            thumbColor={isPublic ? Colors.accent : Colors.muted}
          />
        </View>

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>ELO Rating</Text>
            <Text style={styles.toggleDesc}>Track skill ratings automatically</Text>
          </View>
          <Switch
            value={eloEnabled}
            onValueChange={setEloEnabled}
            trackColor={{ false: Colors.overlay, true: Colors.accent + '60' }}
            thumbColor={eloEnabled ? Colors.accent : Colors.muted}
          />
        </View>

        {/* Create button */}
        <TouchableOpacity
          style={[styles.createBtn, { backgroundColor: colors.accent }, !name.trim() && styles.createBtnDisabled]}
          onPress={handleCreate}
          disabled={!name.trim() || loading}
        >
          <Text style={[styles.createBtnText, { color: colors.primary }]}>
            {loading ? 'Creating...' : 'ðŸ† Create League'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.base },
  content: { paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },
  preview: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  previewBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInitial: { fontSize: 20, fontWeight: '900' },
  previewName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  previewMeta: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  form: { paddingHorizontal: 16, paddingTop: 20, gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.separator,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  playerButtons: { flexDirection: 'row', gap: 8 },
  playerBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.separator,
    alignItems: 'center',
  },
  playerBtnText: { fontSize: 12, fontWeight: '600', color: Colors.muted },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  colorOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.separator,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDots: { flexDirection: 'row', gap: 2 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  colorName: { fontSize: 11, color: Colors.muted, fontWeight: '500' },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
  },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  toggleDesc: { fontSize: 11, color: Colors.muted, marginTop: 2 },
  createBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  createBtnDisabled: { opacity: 0.5 },
  createBtnText: { fontSize: 16, fontWeight: '800' },
});

