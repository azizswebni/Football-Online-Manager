export interface TransferPlayer {
    id: string;
    player: {
      id: string;
      name: string;
      position: string;
      age: number;
      overall: number;
      value: number;
    };
    sellingTeam: {
      id: string;
      name: string;
    };
    askingPrice: number;
    createdAt: string;
  }
  
export interface TransferMarketResponse {
    transfers: TransferPlayer[];
    count: number;
}
  
export interface TransferMarketFilters {
    teamName?: string;
    playerName?: string;
    minPrice?: number;
    maxPrice?: number;
    position?: string;
}