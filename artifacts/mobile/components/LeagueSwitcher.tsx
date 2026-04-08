import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@/components/AppIcon';
import { useLeague, League } from '@/context/LeagueContext';
import Colors from '@/constants/colors';

const { width } = Dimensions.get('window');
const SWITCHER_WIDTH = Math.min(width * 0.85, 340);

export function LeagueSwitcher() {
  const { leagues, activeLeague, setActiveLeague } = useLeague();
  const [visible, setVisible] = useState(false);

  const handleSelect = (league: League) => {
    setActiveLeague(league);
    setVisible(false);
  };

  return (
    <>
      {/* Trigger button â€” small pill in header */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[styles.trigger, { borderColor: activeLeague?.accent_color || Colors.accent }]}
      >
        <View
          style={[
            styles.leagueIcon,
            { backgroundColor: (activeLeague?.primary_color || Colors.primary) + '40' },
          ]}
        >
          <Text style={[styles.leagueInitial, { color: activeLeague?.accent_color || Colors.accent }]}>
            {activeLeague?.name.charAt(0) || '?'}
          </Text>
        </View>
        <Text style={styles.leagueName} numberOfLines={1}>
          {activeLeague?.name || 'Select League'}
        </Text>
        <Ionicons name="chevron-down" size={14} color={Colors.muted} />
      </TouchableOpacity>

      {/* Switcher Modal â€” like Slack workspace switcher */}
      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Your Leagues</Text>

            <FlatList
              data={leagues}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.leagueRow,
                    activeLeague?.id === item.id && {
                      backgroundColor: item.primary_color + '20',
                      borderColor: item.accent_color + '40',
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <View
                    style={[
                      styles.rowIcon,
                      { backgroundColor: item.primary_color },
                    ]}
                  >
                    <Text style={[styles.rowInitial, { color: item.accent_color }]}>
                      {item.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.rowContent}>
                    <Text style={styles.rowName}>{item.name}</Text>
                    <Text style={styles.rowMeta}>
                      {item.city || 'No city'} Â· {item.sport} Â· {item.max_players_per_team}v{item.max_players_per_team}
                    </Text>
                  </View>
                  {activeLeague?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={20} color={item.accent_color} />
                  )}
                  <Text style={[styles.roleBadge, { color: item.accent_color }]}>
                    {item.role}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>No leagues yet</Text>
                  <Text style={styles.emptySubtext}>
                    Create one or join with an invite code
                  </Text>
                </View>
              }
            />

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="add-circle-outline" size={20} color={Colors.accent} />
                <Text style={styles.actionText}>Create League</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="link-outline" size={20} color={Colors.accent} />
                <Text style={styles.actionText}>Join with Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    backgroundColor: Colors.surface,
  },
  leagueIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leagueInitial: {
    fontSize: 12,
    fontWeight: '800',
  },
  leagueName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    maxWidth: 120,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
    maxHeight: '70%',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  leagueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 6,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInitial: {
    fontSize: 18,
    fontWeight: '800',
  },
  rowContent: {
    flex: 1,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  rowMeta: {
    fontSize: 11,
    color: Colors.muted,
    marginTop: 2,
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 12,
    color: Colors.muted,
    marginTop: 4,
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: Colors.separator,
    paddingTop: 12,
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: Colors.base,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent,
  },
});

