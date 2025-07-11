import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Player } from './Player';
import { Team } from './Team';

export type TransferStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  askingPrice!: number;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'SOLD', 'CANCELLED'],
    default: 'ACTIVE'
  })
  status!: TransferStatus;

  @ManyToOne(() => Player, player => player.transfers)
  @JoinColumn()
  player!: Player;

  @ManyToOne(() => Team, team => team.transfers)
  @JoinColumn()
  sellingTeam!: Team;

  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn()
  buyingTeam?: Team;

  @Column({ nullable: true })
  soldPrice?: number;

  @Column({ nullable: true })
  soldAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 