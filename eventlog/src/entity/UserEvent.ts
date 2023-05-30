import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  user_id!: number

  @Column()
  text!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
