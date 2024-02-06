import { EntityManager, QueryFailedError } from 'typeorm';
import { GxpBalance } from './entity/GxpBalance';
import {
  GxpTransaction,
  GxpTransactionStatus,
  GxpTransactionType,
} from './entity/GxpTransaction';
import { AppDataSource } from './database';

import {
  TransactionType,
  TransactionStatus,
  Transaction,
  Balance,
} from '@gf-svc-poc/shared';

export const transactionPrepare = async (
  userId: number,
  type: TransactionType,
  amount: number,
  correlationId: string,
  correlationTimestamp: Date,
) => {
  console.log(`transactionPrepare begin [${correlationId}]`);
  // TODO: Use optimistic locking retry?
  await AppDataSource.transaction(async (entityMgr) => {
    const gxpBalance = await entityMgr.findOneByOrFail(GxpBalance, {
      user_id: userId,
    });
    if (type === TransactionType.SUBTRACT) {
      const updateGxpBalanceResult = await entityMgr
        .createQueryBuilder()
        .update(GxpBalance)
        .set({ reserved: () => `reserved + ${amount}` })
        .where('user_id = :user_id AND balance >= reserved + :amount', {
          user_id: userId,
          amount,
        })
        .execute();
      if (updateGxpBalanceResult.affected == 0) {
        //throw new OptimisticLockError("GxpBalance updated");
        throw new Error('Failed ot reserve');
      }
    }
    const gxpTransaction = await entityMgr.create(GxpTransaction, {
      type:
        type === TransactionType.ADD
          ? GxpTransactionType.ADD
          : GxpTransactionType.SUBTRACT,
      status: GxpTransactionStatus.PENDING,
      amount: amount,
      gxpBalance: gxpBalance,
      correlationId: correlationId,
      correlationTimestamp: correlationTimestamp,
    });
    const saved = await entityMgr.save(gxpTransaction);
    console.log(`saved: ${JSON.stringify(saved)}`);
    console.log(`transactionPrepare end [${correlationId}]`);
  });
};

export const transactionCommitTransaction = async (
  correlationId: string,
  entityMgr: EntityManager,
) => {
  console.log(`transactionCommitTransaction [${correlationId}]`);
  const gxpTransaction = await entityMgr.findOneByOrFail(GxpTransaction, {
    correlationId,
  });
  console.log(
    `transactionCommit: gxpTransaction: ${JSON.stringify(gxpTransaction)}`,
  );
  const { amount } = gxpTransaction;
  if (gxpTransaction.status !== GxpTransactionStatus.PENDING) {
    throw new Error('gxpTransaction.status !== GxpTransactionStatus.PENDING');
  }
  const updateGxpTransationResult = await entityMgr
    .createQueryBuilder()
    .update(GxpTransaction)
    .set({ status: GxpTransactionStatus.COMMITTED })
    .where('id = :id AND status = :status', {
      id: gxpTransaction.id,
      status: GxpTransactionStatus.PENDING,
    })
    .execute();
  console.log(
    `updateGxpTransationResult: ${JSON.stringify(updateGxpTransationResult)}`,
  );
  if (updateGxpTransationResult.affected === 0) {
    //throw new OptimisticLockError("GxpTransaction");
    throw new Error('GxpTransaction status unexpectedly changed from PENDING');
  }
  if (gxpTransaction.type === GxpTransactionType.ADD) {
    const updateResult = await entityMgr
      .createQueryBuilder()
      .update(GxpBalance)
      .set({ balance: () => `balance + ${amount}` })
      .where('id = :id', { id: gxpTransaction.gxpBalanceId })
      .execute();
    if (updateResult.affected == 0) {
      throw new Error('Failed to add balance in GxpBalance');
    }
  } else {
    const updateResult = await entityMgr
      .createQueryBuilder()
      .update(GxpBalance)
      .set({ balance: () => `balance - ${amount}` })
      .where('id = :id AND balance >= :amount', {
        id: gxpTransaction.gxpBalanceId,
        amount,
      })
      .execute();
    if (updateResult.affected == 0) {
      // TODO: Consistency error
      throw new Error('Failed to subtract balance in GxpBalance');
    }
  }
};

export const transactionAbortTransaction = async (
  correlationId: string,
  entityMgr: EntityManager,
) => {
  console.log(`transactionAbortTransaction [${correlationId}]`);
  const gxpTransaction = await GxpTransaction.findOneByOrFail({
    correlationId,
  });
  const { amount } = gxpTransaction;
  if (gxpTransaction.status === GxpTransactionStatus.ABORTED) {
    console.log('Already aborted');
    return;
  } else if (gxpTransaction.status === GxpTransactionStatus.COMMITTED) {
    // TODO: Throw error?
    console.log('Already committed');
    return;
  }
  if (gxpTransaction.type === GxpTransactionType.SUBTRACT) {
    const updateResult = await entityMgr
      .createQueryBuilder()
      .update(GxpBalance)
      .set({ reserved: () => `reserved - ${amount}` })
      .where('id = :id AND reserved >= :amount', {
        id: gxpTransaction.gxpBalanceId,
        amount,
      })
      .execute();
    if (updateResult.affected == 0) {
      // TODO: Consistency error, zero out reserved?
      throw new Error('Failed to update reserved amount');
    }
  }
  const updateGxpTransationResult = await entityMgr
    .createQueryBuilder()
    .update(GxpTransaction)
    .set({ status: GxpTransactionStatus.ABORTED })
    .where('id = :id AND status = :status', {
      id: gxpTransaction.id,
      status: GxpTransactionStatus.PENDING,
    })
    .execute();
  if (updateGxpTransationResult.affected == 0) {
    //throw new OptimisticLockError("GxpTransaction");
    throw new Error('Failed to change status to ABORTED');
  }
};

export const createUserBalance = async (user_id: number) => {
  const existEntity = await GxpBalance.findOneBy({ user_id });
  if (existEntity !== null) {
    console.log(`exists: ${JSON.stringify(existEntity)}`);
    // TODO: Set to zero balance
  } else {
    const newEntity = await GxpBalance.create({ user_id }).save();
    console.log(`created: ${JSON.stringify(newEntity)}`);
  }
};

export const getUserBalance = async (user_id: number) => {
  const gxpBalance = await GxpBalance.findOneByOrFail({ user_id });
  return {
    balance: gxpBalance.balance,
    reserved: gxpBalance.reserved,
    updatedAt: gxpBalance.updatedAt,
  };
};

function convertTransactionType(gxpType: GxpTransactionType): TransactionType {
  switch (gxpType) {
    case GxpTransactionType.ADD:
      return TransactionType.ADD;
    case GxpTransactionType.SUBTRACT:
      return TransactionType.SUBTRACT;
    default:
      throw new Error(`Invalid GxpTransactionType: ${gxpType}`);
  }
}

function convertTransactionStatus(
  gxpStatus: GxpTransactionStatus,
): TransactionStatus {
  switch (gxpStatus) {
    case GxpTransactionStatus.PENDING:
      return TransactionStatus.PENDING;
    case GxpTransactionStatus.ABORTED:
      return TransactionStatus.ABORTED;
    case GxpTransactionStatus.COMMITTED:
      return TransactionStatus.COMMITTED;
    default:
      throw new Error(`Invalid GxpTransactionStatus: ${gxpStatus}`);
  }
}

function convertTransactions(gxpTransactions: GxpTransaction[]): Transaction[] {
  const transactions: Transaction[] = [];

  for (const gxpTransaction of gxpTransactions) {
    const transaction: Transaction = {
      balanceId: gxpTransaction.gxpBalanceId,
      correlationId: gxpTransaction.correlationId,
      type: convertTransactionType(gxpTransaction.type),
      status: convertTransactionStatus(gxpTransaction.status),
      amount: gxpTransaction.amount,
      updatedAt: gxpTransaction.updatedAt,
    };

    transactions.push(transaction);
  }

  return transactions;
}

function convertBalances(gxpBalances: GxpBalance[]): Balance[] {
  const balances: Balance[] = [];
  for (const gxpBalance of gxpBalances) {
    const balance: Balance = {
      balance: gxpBalance.balance,
      reserved: gxpBalance.reserved,
      updatedAt: gxpBalance.updatedAt,
    };
    balances.push(balance);
  }
  return balances;
}

export const getAll = async () => {
  const gxpBalances = await GxpBalance.find();
  const balances = convertBalances(gxpBalances);
  const gxpTransactions = await GxpTransaction.find();
  const transactions = convertTransactions(gxpTransactions);
  return { balances, transactions };
};
