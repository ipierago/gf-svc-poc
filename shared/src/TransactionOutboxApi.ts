import { DataSource, EntityManager } from 'typeorm';
import {
  TransactionOutbox,
  TransactionOutboxState,
} from './entity/TransactionOutbox';

export async function initTransactionOutboxPub(
  dataSource: DataSource,
): Promise<void> {
  const result = await dataSource.query(
    `SELECT pubname FROM pg_publication WHERE pubname = $1;`,
    ['transaction_outbox_pub'],
  );
  if (result.length === 0) {
    await dataSource.query(
      `CREATE PUBLICATION transaction_outbox_pub FOR TABLE transaction_outbox;`,
    );
    console.log(`transaction_outbox_pub has been created.`);
  } else {
    console.log(`transaction_outbox_pub already exists.`);
  }
}

export async function initTransactionOutboxSub(
  dataSource: DataSource,
): Promise<void> {
  const result = await dataSource.query(
    `SELECT subname FROM pg_subscription WHERE subname = $1;`,
    ['transaction_outbox_sub'],
  );
  if (result.length === 0) {
    await dataSource.query(
      `CREATE SUBSCRIPTION transaction_outbox_sub CONNECTION 'host=backend-db port=5432 dbname=test user=test password=test' PUBLICATION transaction_outbox_pub;`,
    );
    console.log(`transaction_outbox_sub created.`);
  } else {
    console.log(`transaction_outbox_sub already exists.`);
  }
}

export const upsertTransactionOutbox = async (
  correlationId: string,
  state: TransactionOutboxState,
  entityMgr: EntityManager,
) => {
  console.log(`upsertTransactionOutbox: ${correlationId}, ${state}`);
  const repository = entityMgr.getRepository(TransactionOutbox);
  await repository.upsert(
    {
      correlation_id: correlationId,
      state,
    },
    ['correlation_id'],
  );
};

export const finalizeTransactionOutbox = async (
  correlationId: string,
  entityManager: EntityManager,
): Promise<boolean> => {
  const result = await entityManager
    .createQueryBuilder()
    .update(TransactionOutbox)
    .set({
      is_finalized: true,
    })
    .where('correlation_id = :correlationId AND is_finalized = false', {
      correlationId,
    })
    .execute();
  return result.affected === 1;
};
