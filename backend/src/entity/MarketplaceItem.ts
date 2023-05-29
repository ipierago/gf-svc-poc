import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Item } from './Item';

@Entity()
export class MarketplaceItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @Index()
  itemId!: number;

  @ManyToOne(() => Item)
  @JoinColumn({ name: 'itemId' })
  item!: Item;

  @Column()
  count!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
