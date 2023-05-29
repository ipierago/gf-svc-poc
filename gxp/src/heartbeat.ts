import { LessThan } from 'typeorm';
import { GxpTransaction, GxpTransactionStatus, GxpTransactionType } from './entity/GxpTransaction';
import { transactionAbort } from "./services"


async function abortAllTimedOutPendingTransaction() {
  console.log("abortAllTimedOutPendingTransaction()");
  const now = new Date();

  // get the ids of all the GxpTransactions we will try to abort
  const entityArray = await GxpTransaction.find({
    where: {
      status: GxpTransactionStatus.PENDING,
      correlationTimestamp: LessThan(now)
    },
    select: ['correlationId'],
  });
  const idsToAbort = entityArray.map((entity) => entity.correlationId);

  // try to abort each one
  for (const idToAbort of idsToAbort) {
    try {
      await transactionAbort(idToAbort);
    } catch (error) {
      console.log(error);
      // continue
    }
  }
}

const HEARTBEAT_PERIOD: number = 30 * 1000;

async function heartbeat() {
  try {
    console.log('heartbeat');

    await abortAllTimedOutPendingTransaction();

    setTimeout(heartbeat, HEARTBEAT_PERIOD)
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function startHeartbeat() {
  setTimeout(heartbeat, HEARTBEAT_PERIOD)
}