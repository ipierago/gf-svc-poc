import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { Item } from './Item';
import { User } from './User';

@Entity()
@Unique('UQ_item_user', ['itemId', 'userId'])
@Index('idx_item_user', ['itemId', 'userId'])
export class UserItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  itemId!: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'itemId' })
  item!: Item;

  @Column()
  userId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: `userId` })
  user!: User;

  @Column({ default: 1 })
  count!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
