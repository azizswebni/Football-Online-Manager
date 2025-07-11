import { Team, TeamStats } from "@/lib/interfaces";
import { secureStorage } from "@/lib/secureStorage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


interface TeamState {
    team: Team | null;
    teamStats: TeamStats | null;
    setTeam: (
        team: Team
    ) => void;
    setTeamStats: (
        teamStats: TeamStats
    ) => void;
    clearTeamStore: ()=> void;
}

export const useTeamStore = create<TeamState>()(
    persist(
        (set) => ({
            team: null,
            teamStats: null,
            setTeam: (team: Team) => set({ team }),
            setTeamStats: (teamStats: TeamStats) => set({ teamStats }),
            clearTeamStore : () => set({team:null,teamStats:null})
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
