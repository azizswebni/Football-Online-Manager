export interface TransferListItem {
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
  createdAt: Date;
}

export interface TransferResponse {
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
  status: string;
  createdAt: Date;
} 