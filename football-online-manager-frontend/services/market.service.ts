import Axios from "@/lib/axios";
import { Player } from "@/lib/interfaces";

// Add player to transfer market
export const addPlayerToTransferMarketService = async ({
  playerId,
  askingPrice,
}: {
  playerId: string;
  askingPrice: number;
}): Promise<void> => {
  const response = await Axios.post("/transfer", {
    playerId,
    askingPrice,
  });
  return response.data;
};

export const removePlayerFromTransferMarketService = async (
  transferId: string
): Promise<void> => {
  const response = await Axios.delete(`/transfer/${transferId}`);
  return response.data;
};

// Get all players in transfer market
export const getTransferMarketPlayersService = async (): Promise<Player[]> => {
  const response = await Axios.get<{ players: Player[] }>("/transfer");
  return response.data.players;
};