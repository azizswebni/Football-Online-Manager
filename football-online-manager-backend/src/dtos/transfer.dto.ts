import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

/**
 * @openapi
 * components:
 *   schemas:
 *     TransferFilterDto:
 *       type: object
 *       properties:
 *         teamName:
 *           type: string
 *         playerName:
 *           type: string
 *         minPrice:
 *           type: number
 *         maxPrice:
 *           type: number
 *     CreateTransferDto:
 *       type: object
 *       required:
 *         - playerId
 *         - askingPrice
 *       properties:
 *         playerId:
 *           type: string
 *         askingPrice:
 *           type: number
 *           minimum: 1000
 *     BuyPlayerDto:
 *       type: object
 *       required:
 *         - transferId
 *       properties:
 *         transferId:
 *           type: string
 */
export class TransferFilterDto {
  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsString()
  playerName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}

export class CreateTransferDto {
  @IsString()
  playerId!: string;

  @IsNumber()
  @Min(1000)
  askingPrice!: number;
}

export class BuyPlayerDto {
  @IsString()
  transferId!: string;
} 