import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Team } from './Team';

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

@Entity()
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  position!: PlayerPosition;

  @Column()
  age!: number;

  @Column()
  overall!: number;

  @Column()
  value!: number;

  @ManyToOne(() => Team, team => team.players)
  team!: Team;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 