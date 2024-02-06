import { Entity, BaseEntity, Column, PrimaryColumn, Index } from 'typeorm';

export enum TransactionOutboxState {
  Failed = 'failed',
  Succeeded = 'succeeded',
}

@Entity()
export class TransactionOutbox extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  correlation_id!: string;

  @Column({
    type: 'enum',
    enum: TransactionOutboxState,
    enumName: 'transaction_outbox_state',
  })
  state!: TransactionOutboxState;

  @Column({ type: 'boolean', default: false })
  @Index()
  is_finalized!: boolean;
}
