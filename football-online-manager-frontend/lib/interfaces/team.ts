export interface Player {
    id: string
    name: string
    position: string
    age: number
    overall: number
    value: number
    isInTransferMarket: boolean;
    transferId?: string;
    askingPrice?: number;
}


export interface Team {
    id: string
    name: string;
    budget: number;
    players: Player[];
    playerCount: number;
    totalValue: number;
    averageOverall: number;
}

export interface TeamStats {
    stats: {
        playerCount: number
        totalValue: number
        averageOverall: number
        playersByPosition: {
            GK: number
            DEF: number
            MID: number
            FWD: number
        }
        budget: number
    }
}