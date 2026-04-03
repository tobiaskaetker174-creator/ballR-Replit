import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface League {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  primary_color: string;
  accent_color: string;
  rules: Record<string, unknown>;
  visibility: 'private' | 'public';
  invite_code: string;
  city: string | null;
  sport: string;
  max_players_per_team: number;
  elo_enabled: boolean;
  role: 'owner' | 'admin' | 'member';
  member_count?: number;
}

export interface LeagueColors {
  primary: string;
  accent: string;
  base: string;
  surface: string;
  overlay: string;
  text: string;
  muted: string;
  separator: string;
}

interface LeagueContextType {
  leagues: League[];
  activeLeague: League | null;
  setActiveLeague: (league: League) => void;
  addLeague: (league: League) => void;
  removeLeague: (leagueId: string) => void;
  colors: LeagueColors;
  isLoading: boolean;
}

const DEFAULT_COLORS: LeagueColors = {
  primary: '#2D5A27',
  accent: '#A1D494',
  base: '#141312',
  surface: '#201F1E',
  overlay: '#363433',
  text: '#E6E2DF',
  muted: '#8C8782',
  separator: 'rgba(66, 73, 62, 0.3)',
};

function leagueToColors(league: League | null): LeagueColors {
  if (!league) return DEFAULT_COLORS;
  return {
    ...DEFAULT_COLORS,
    primary: league.primary_color,
    accent: league.accent_color,
    // Derive separator from primary color
    separator: league.primary_color + '30',
  };
}

const LeagueContext = createContext<LeagueContextType>({
  leagues: [],
  activeLeague: null,
  setActiveLeague: () => {},
  addLeague: () => {},
  removeLeague: () => {},
  colors: DEFAULT_COLORS,
  isLoading: true,
});

export function LeagueProvider({ children }: { children: React.ReactNode }) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [activeLeague, setActiveLeagueState] = useState<League | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('ballr_leagues');
        const activeId = await AsyncStorage.getItem('ballr_active_league');
        if (stored) {
          const parsed = JSON.parse(stored) as League[];
          setLeagues(parsed);
          if (activeId) {
            const active = parsed.find(l => l.id === activeId);
            if (active) setActiveLeagueState(active);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setActiveLeague = useCallback((league: League) => {
    setActiveLeagueState(league);
    AsyncStorage.setItem('ballr_active_league', league.id);
  }, []);

  const addLeague = useCallback((league: League) => {
    setLeagues(prev => {
      const next = [...prev.filter(l => l.id !== league.id), league];
      AsyncStorage.setItem('ballr_leagues', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeLeague = useCallback((leagueId: string) => {
    setLeagues(prev => {
      const next = prev.filter(l => l.id !== leagueId);
      AsyncStorage.setItem('ballr_leagues', JSON.stringify(next));
      return next;
    });
    setActiveLeagueState(prev => prev?.id === leagueId ? null : prev);
  }, []);

  const colors = leagueToColors(activeLeague);

  return (
    <LeagueContext.Provider value={{
      leagues,
      activeLeague,
      setActiveLeague,
      addLeague,
      removeLeague,
      colors,
      isLoading,
    }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  return useContext(LeagueContext);
}

export function useLeagueColors() {
  const { colors } = useContext(LeagueContext);
  return colors;
}
