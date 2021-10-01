/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  firstName: string = '';

  @Column()
  lastName: string = '';

  @Column()
  age: number = 0;
}
