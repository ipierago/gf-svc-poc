import { LessThan } from 'typeorm';
import { GxpTransaction, GxpTransactionStatus } from './entity/GxpTransaction';
import {
  transactionAbortTransaction,
  transactionCommitTransaction,
} from './services';
import {
  TransactionOutbox,
  TransactionOutboxState,
  finalizeTransactionOutbox,
} from '@gf-svc-poc/shared';
import { AppDataSource } from './database';

async function abortAllTimedOutPendingTransaction() {
  const now = new Date();

  // get the ids of all the GxpTransactions we will try to abort
  const entityArray = await GxpTransaction.find({
    where: {
      status: GxpTransactionStatus.PENDING,
      correlationTimestamp: LessThan(now),
    },
    select: ['correlationId'],
  });
  const idsToAbort = entityArray.map((entity) => entity.correlationId);

  // try to abort each one
  for (const idToAbort of idsToAbort) {
    try {
      await transactionAbortTransaction(idToAbort, AppDataSource.manager);
    } catch (error) {
      console.log(error);
      // continue
    }
  }
}

const processTransactionOutbox = async () => {
  const entities = await TransactionOutbox.find({
    where: { is_finalized: false },
  });
  for (let i = 0; i < entities.length; i++) {
    const to = entities[i];
    try {
      const correlationId = to.correlation_id;
      const gxpTransaction = await GxpTransaction.findOneBy({
        correlationId,
      });
      if (!gxpTransaction) {
        // The transaction does not include a gxp transaction
        await finalizeTransactionOutbox(
          to.correlation_id,
          AppDataSource.manager,
        );
      } else {
        await AppDataSource.transaction(async (entityMgr) => {
          if (to.state === TransactionOutboxState.Succeeded) {
            await transactionCommitTransaction(to.correlation_id, entityMgr);
          } else if (to.state === TransactionOutboxState.Failed) {
            await transactionAbortTransaction(to.correlation_id, entityMgr);
          }
          const success = await finalizeTransactionOutbox(
            to.correlation_id,
            entityMgr,
          );
          if (!success)
            throw new Error(
              'Failed to mark transaction as finalized. Another operation has already done so.  Rolling back.',
            );
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const HEARTBEAT_ABORT_PERIOD: number = 30 * 1000;

let lastAbortCheckTime: number = 0;
async function heartbeatInner() {
  await processTransactionOutbox();
  const now = Date.now();
  if (now - lastAbortCheckTime >= HEARTBEAT_ABORT_PERIOD) {
    await abortAllTimedOutPendingTransaction();
    lastAbortCheckTime = now;
  }
}

const HEARTBEAT_PERIOD: number = 500;

async function heartbeat() {
  try {
    await heartbeatInner();
  } catch (error) {
    console.error(error);
  }
  setTimeout(heartbeat, HEARTBEAT_PERIOD);
}

export function startHeartbeat() {
  heartbeat();
}
