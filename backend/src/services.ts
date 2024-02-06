import {
  TransactionPrepareRequest,
  TransactionType,
  CreateUserBalanceRequest,
  GetAllResponse,
  GetUserGxpBalanceRequest,
  GetUserGxpBalanceResponse,
  AddGxpRequest,
  AddGxpResponse,
  BuyItemRequest,
  BuyItemResponse,
  CreateUserRequest,
  CreateUserResponse,
  CreateItemRequest,
  CreateItemResponse,
  CreateMarketplaceItemRequest,
  CreateMarketplaceItemResponse,
  CreateUserItemRequest,
  CreateUserItemResponse,
  connectGxpAPI,
  gxpAPI,
  sendBuyItemEvent,
  subscribeBuyItemEvent,
  upsertTransactionOutbox,
  TransactionOutboxState,
} from '@gf-svc-poc/shared';

import { User } from './entity/User';
import { Item } from './entity/Item';
import { MarketplaceItem } from './entity/MarketplaceItem';
import { UserItem } from './entity/UserItem';

import { AppDataSource } from './database';

let gxpAPI: gxpAPI;

export const getAll = async (): Promise<GetAllResponse> => {
  const gxpResponse = await gxpAPI.getAll({});
  console.log(JSON.stringify(gxpResponse));
  const backendResponse: GetAllResponse = {
    balances: gxpResponse.balances,
    transactions: gxpResponse.transactions,
  };
  return backendResponse;
};

export const getUserGxpBalance = async (
  getUserGxpBalanceRequest: GetUserGxpBalanceRequest,
  correlationId: string,
): Promise<GetUserGxpBalanceResponse> => {
  console.log(
    `getUserGxpBalance: ${JSON.stringify(getUserGxpBalanceRequest)} [${correlationId}]`,
  );
  const { userId } = getUserGxpBalanceRequest;
  const gxpResponse = await gxpAPI.getUserBalance({ userId, correlationId });
  console.log(JSON.stringify(gxpResponse));
  const backendResponse: GetUserGxpBalanceResponse = {
    balance: gxpResponse.balance,
    reserved: gxpResponse.reserved,
    updatedAt: gxpResponse.updatedAt,
    correlationId,
  };
  console.log(`${JSON.stringify(backendResponse)} [${correlationId}]`);
  return backendResponse;
};

export const addUserGxp = async (
  addGxpRequest: AddGxpRequest,
  correlationId: string,
  correlationTimestamp: Date,
): Promise<AddGxpResponse> => {
  console.log(
    `addGxpRequest: ${JSON.stringify(addGxpRequest)} [${correlationId}]`,
  );
  try {
    const { userId, amount } = addGxpRequest;
    const user = await User.findOneByOrFail({ id: userId });
    const transactionPrepareRequest: TransactionPrepareRequest = {
      userId,
      type: TransactionType.ADD,
      amount,
      correlationId,
      correlationTimestamp,
    };
    const transactionPrepareResponse = await gxpAPI.transactionPrepare(
      transactionPrepareRequest,
    );
    console.log(
      `TransactionPrepareResponse: ${JSON.stringify(transactionPrepareResponse)}`,
    );
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Succeeded,
      AppDataSource.manager,
    );
    const addGxpResponse: AddGxpResponse = { correlationId };
    console.log(
      `addGxpResponse: ${JSON.stringify(addGxpResponse)}[${correlationId}]`,
    );
    return addGxpResponse;
  } catch (error) {
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Failed,
      AppDataSource.manager,
    );
    throw error;
  }
};

export const buyMarketplaceItem = async (
  buyItemRequest: BuyItemRequest,
  correlationId: string,
  correlationTimestamp: Date,
): Promise<BuyItemResponse> => {
  console.log(
    `buyItemRequest: ${JSON.stringify(buyItemRequest)} [${correlationId}]`,
  );
  try {
    const { userId, itemId } = buyItemRequest;
    console.log(`{userId: ${userId}, itemId: ${itemId}}`);
    const item = await Item.findOneByOrFail({ id: itemId });
    console.log(`item: ${JSON.stringify(item)}`);
    const transactionPrepareRequest: TransactionPrepareRequest = {
      userId: userId,
      type: TransactionType.SUBTRACT,
      amount: item.cost,
      correlationId,
      correlationTimestamp,
    };
    const transactionPrepareResponse = await gxpAPI.transactionPrepare(
      transactionPrepareRequest,
    );
    console.log(
      `TransactionPrepareResponse: ${JSON.stringify(transactionPrepareResponse)}`,
    );
    let userItem: UserItem | null = null;
    await AppDataSource.transaction(async (entityMgr) => {
      console.log(`{userId: ${userId}, itemId: ${itemId}}`);
      console.log(`itemId = ${itemId} AND count > 0`);
      const updateResult = await entityMgr
        .createQueryBuilder()
        .update(MarketplaceItem)
        .set({ count: () => 'count - 1' })
        .where(`itemId = ${itemId} AND count > 0`)
        .execute();
      if (updateResult.affected == 0) {
        throw new Error('Failed to decrement count, probably out of stock');
      }
      const updateResult2 = await entityMgr
        .createQueryBuilder()
        .update(UserItem)
        .set({ count: () => 'count + 1' })
        .where('userId = :userId AND itemId = :itemId', { userId, itemId })
        .execute();
      if (updateResult2.affected == 0) {
        // failed to update an existing one, so create one
        await entityMgr.create(UserItem, { userId, itemId }).save();
      }
      userItem = await entityMgr.findOneByOrFail(UserItem, { userId, itemId });
      await upsertTransactionOutbox(
        correlationId,
        TransactionOutboxState.Succeeded,
        entityMgr,
      );
    });
    console.log(`UserItem: ${JSON.stringify(userItem)}`);
    sendBuyItemEvent(userId, itemId, userItem!.id, correlationId);
    const buyItemResponse: BuyItemResponse = {
      userItemId: userItem!.id,
      correlationId,
    };
    console.log(
      `buyItemResponse: ${JSON.stringify(buyItemResponse)}[${correlationId}]`,
    );
    return buyItemResponse;
  } catch (error) {
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Failed,
      AppDataSource.manager,
    );
    console.error((error as Error).message);
    throw error;
  }
};

export const createUser = async (
  createUserRequest: CreateUserRequest,
  correlationId: string,
  correlationTimestamp: Date,
): Promise<CreateUserResponse> => {
  try {
    const user = await User.create({ name: createUserRequest.name }).save();
    console.log(`user: ${JSON.stringify(user)}`);
    const createUserBalanceRequest: CreateUserBalanceRequest = {
      userId: user.id,
      correlationId,
      correlationTimestamp,
    };
    const result = await gxpAPI.createUserBalance(createUserBalanceRequest);
    console.log(`result: ${JSON.stringify(result)}`);
    const createUserResponse: CreateUserResponse = {
      userId: user.id,
      correlationId,
    };
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Succeeded,
      AppDataSource.manager,
    );
    console.log(
      `createUserResponse: ${JSON.stringify(createUserResponse)}[${correlationId}]`,
    );
    return createUserResponse;
  } catch (error) {
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Failed,
      AppDataSource.manager,
    );
    console.error((error as Error).message);
    throw error;
  }
};

export const createItem = async (
  createItemRequest: CreateItemRequest,
  correlationId: string,
  correlationTimestamp: Date,
): Promise<CreateItemResponse> => {
  try {
    const item = await Item.create({
      name: createItemRequest.name,
      cost: createItemRequest.cost,
    }).save();
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Succeeded,
      AppDataSource.manager,
    );
    const createItemResponse: CreateItemResponse = {
      itemId: item.id,
      correlationId,
    };
    console.log(
      `createItemResponse: ${JSON.stringify(createItemResponse)} [${correlationId}]`,
    );
    return createItemResponse;
  } catch (error) {
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Failed,
      AppDataSource.manager,
    );
    console.error((error as Error).message);
    throw error;
  }
};

export const createMarketplaceItem = async (
  createMarketplaceItemRequest: CreateMarketplaceItemRequest,
  correlationId: string,
  correlationTimestamp: Date,
): Promise<CreateMarketplaceItemResponse> => {
  try {
    const marketplaceItem = await MarketplaceItem.create({
      itemId: createMarketplaceItemRequest.itemId,
      count: createMarketplaceItemRequest.count,
    }).save();
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Succeeded,
      AppDataSource.manager,
    );
    const createMarketplaceItemResponse: CreateMarketplaceItemResponse = {
      marketplaceItemId: marketplaceItem.id,
      correlationId,
    };
    console.log(
      `createMarketplaceItemResponse: ${JSON.stringify(createMarketplaceItemResponse)} [${correlationId}]`,
    );
    return createMarketplaceItemResponse;
  } catch (error) {
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Failed,
      AppDataSource.manager,
    );
    console.error((error as Error).message);
    throw error;
  }
};

export const createUserItem = async (
  createUserItemRequest: CreateUserItemRequest,
  correlationId: string,
  correlationTimestamp: Date,
): Promise<CreateUserItemResponse> => {
  try {
    const userItem = await UserItem.create({
      itemId: createUserItemRequest.itemId,
      count: createUserItemRequest.count,
    }).save();
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Succeeded,
      AppDataSource.manager,
    );
    const createUserItemResponse: CreateUserItemResponse = {
      userItemId: userItem.id,
      correlationId,
    };
    console.log(
      `createUserItemResponse: ${JSON.stringify(createUserItemResponse)} [${correlationId}]`,
    );
    return createUserItemResponse;
  } catch (error) {
    await upsertTransactionOutbox(
      correlationId,
      TransactionOutboxState.Failed,
      AppDataSource.manager,
    );
    console.error((error as Error).message);
    throw error;
  }
};

export const initializeServices = async (): Promise<void> => {
  console.log('initializeServices');

  gxpAPI = await connectGxpAPI();

  console.log('calling subscribeBuyItemEvent');
  subscribeBuyItemEvent((buyItemEvent) => {
    console.log(`consumed BuyItemEvent: ${JSON.stringify(buyItemEvent)}`);
  });
};
