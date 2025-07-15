import Axios from "@/lib/axios";
import { TransferMarketFilters, TransferMarketResponse } from "@/lib/interfaces";

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

// Get all players in transfer market with optional filters
export const getTransferMarketPlayersService = async (
  filters?: TransferMarketFilters
): Promise<TransferMarketResponse> => {
  const params = new URLSearchParams();
  
  if (filters?.teamName) params.append('teamName', filters.teamName);
  if (filters?.playerName) params.append('playerName', filters.playerName);
  if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.position) params.append('position', filters.position);
  
  const url = `/transfer${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await Axios.get<TransferMarketResponse>(url);
  return response.data;
};

// Buy player from transfer market
export const buyPlayerTransferMarketService = async (
  transferId: string
): Promise<void> => {
  const response = await Axios.post(`/transfer/buy`, {
    transferId
  });
  return response.data;
};