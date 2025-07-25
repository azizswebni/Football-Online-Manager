import Axios from "@/lib/axios";
import { Team, TeamStats } from "@/lib/interfaces";


export const getTeamService = async (): Promise<Team> => {
    const response = await Axios.get<{team:Team}>('/user/team');
    return response.data.team
}

export const getTeamStatsService = async (): Promise<TeamStats> => {
    const response = await Axios.get<TeamStats>('/user/team/stats');
    return response.data
}

