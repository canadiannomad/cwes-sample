/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class State {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  position: string = '';
}
