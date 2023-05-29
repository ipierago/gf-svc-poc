import { Entity, Index, BaseEntity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['user_id'])
export class GxpBalance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Index()
  @Column()
  user_id!: number

  @Column({ default: 0 })
  balance!: number

  @Column({ default: 0 })
  reserved!: number

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
