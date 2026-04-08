import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@/components/AppIcon';
import Colors from '@/constants/colors';

export default function JoinLeagueScreen() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (inviteCode.trim().length < 4) {
      setError('Please enter a valid invite code');
      return;
    }
    setError('');
    setLoading(true);

    // TODO: Call Supabase to find league by invite code + join
    // For now, show placeholder
    setTimeout(() => {
      setLoading(false);
      // Navigate back on success
      router.back();
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Join a League</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>ðŸ”—</Text>
        </View>

        <Text style={styles.title}>Enter Invite Code</Text>
        <Text style={styles.subtitle}>
          Get the code from a league admin or from the BallR website
        </Text>

        <TextInput
          value={inviteCode}
          onChangeText={(text) => {
            setInviteCode(text.toUpperCase());
            setError('');
          }}
          placeholder="e.g. BKK001"
          placeholderTextColor={Colors.muted}
          style={styles.input}
          autoCapitalize="characters"
          autoFocus
          maxLength={12}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.joinBtn, !inviteCode.trim() && styles.joinBtnDisabled]}
          onPress={handleJoin}
          disabled={!inviteCode.trim() || loading}
        >
          <Text style={styles.joinBtnText}>
            {loading ? 'Joining...' : 'Join League'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          You can also scan a QR code or click a link shared by the league admin.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 56,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 280,
  },
  input: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.accent,
    textAlign: 'center',
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  error: {
    color: Colors.red,
    fontSize: 13,
    marginTop: 8,
  },
  joinBtn: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  joinBtnDisabled: {
    opacity: 0.5,
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
    marginTop: 24,
    maxWidth: 260,
  },
});

