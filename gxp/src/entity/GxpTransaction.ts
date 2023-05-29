import { Column, Entity, Index, BaseEntity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { GxpBalance } from './GxpBalance';

export enum GxpTransactionStatus {
  PENDING = 'pending',
  ABORTED = 'aborted',
  COMMITTED = 'committed',
}

export enum GxpTransactionType {
  ADD = 'add',
  SUBTRACT = 'subtract',
}

@Entity()
export class GxpTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: GxpTransactionType })
  type!: GxpTransactionType;

  @Column({ type: 'enum', enum: GxpTransactionStatus, default: GxpTransactionStatus.PENDING })
  status!: GxpTransactionStatus;

  @Column()
  amount!: number;

  @Column()
  @Index()
  gxpBalanceId!: number;

  @ManyToOne(() => GxpBalance)
  @JoinColumn({ name: 'gxpBalanceId' })
  gxpBalance!: GxpBalance

  @Index()
  @Column({ type: 'uuid' })
  correlationId!: string;

  @Column({ type: 'timestamp' })
  correlationTimestamp!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date
}