import { Team, TeamStats, Player } from "@/lib/interfaces";
import { secureStorage } from "@/lib/secureStorage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TeamState {
    team: Team | null;
    teamStats: TeamStats | null;
    setTeam: (team: Team) => void;
    setTeamStats: (teamStats: TeamStats) => void;
    updatePlayer: (playerId: string, updates: Partial<Player>) => void;
    addPlayer: (player: Player) => void;
    removePlayer: (playerId: string) => void;
    clearTeamStore: () => void;
}

export const useTeamStore = create<TeamState>()(
    persist(
        (set, get) => ({
            team: null,
            teamStats: null,
            setTeam: (team: Team) => set({ team }),
            setTeamStats: (teamStats: TeamStats) => set({ teamStats }),
            
            updatePlayer: (playerId: string, updates: Partial<Player>) => {
                const state = get();
                if (!state.team) return;
                
                const updatedPlayers = state.team.players.map(player =>
                    player.id === playerId ? { ...player, ...updates } : player
                );
                
                const totalValue = updatedPlayers.reduce((sum, p) => sum + (p.value || 0), 0);
                const averageOverall = updatedPlayers.length > 0 
                    ? updatedPlayers.reduce((sum, p) => sum + p.overall, 0) / updatedPlayers.length 
                    : 0;
                
                set({
                    team: {
                        ...state.team,
                        players: updatedPlayers,
                        playerCount: updatedPlayers.length,
                        totalValue,
                        averageOverall
                    }
                });
            },
            
            addPlayer: (player: Player) => {
                const state = get();
                if (!state.team) return;
                
                const updatedPlayers = [...state.team.players, player];
                const totalValue = updatedPlayers.reduce((sum, p) => sum + (p.value || 0), 0);
                const averageOverall = updatedPlayers.reduce((sum, p) => sum + p.overall, 0) / updatedPlayers.length;
                
                set({
                    team: {
                        ...state.team,
                        players: updatedPlayers,
                        playerCount: updatedPlayers.length,
                        totalValue,
                        averageOverall
                    }
                });
            },
            
            removePlayer: (playerId: string) => {
                const state = get();
                if (!state.team) return;
                
                const updatedPlayers = state.team.players.filter(player => player.id !== playerId);
                const totalValue = updatedPlayers.reduce((sum, p) => sum + (p.value || 0), 0);
                const averageOverall = updatedPlayers.length > 0 
                    ? updatedPlayers.reduce((sum, p) => sum + p.overall, 0) / updatedPlayers.length 
                    : 0;
                
                set({
                    team: {
                        ...state.team,
                        players: updatedPlayers,
                        playerCount: updatedPlayers.length,
                        totalValue,
                        averageOverall
                    }
                });
            },
            
            clearTeamStore: () => set({ team: null, teamStats: null })
        }),
        {
            name: "team-storage",
            storage: createJSONStorage(() => secureStorage),
            partialize: (state) => ({
                team: state.team,
                teamStats: state.teamStats,
            }),
        }
    )
);