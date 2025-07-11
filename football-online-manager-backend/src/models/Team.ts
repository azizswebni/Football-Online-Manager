import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { Player } from './Player';
import { Transfer } from './Transfer';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: 5000000 })
  budget!: number;

  @OneToOne(() => User, user => user.team)
  @JoinColumn()
  user!: User;

  @OneToMany(() => Player, player => player.team)
  players!: Player[];

  @OneToMany(() => Transfer, transfer => transfer.sellingTeam)
  transfers!: Transfer[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 