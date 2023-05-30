import { ServiceError, credentials } from '@grpc/grpc-js';
import { promisify } from 'util';

import * as gxp from './gen/ts/gxp';
import * as backend from './gen/ts/backend';
import { Empty } from "./gen/ts/google/protobuf/empty";

import { appDataSource } from "./AppDataSource";
import { User } from "./entity/User";
import { Item } from "./entity/Item";
import { MarketplaceItem } from './entity/MarketplaceItem';
import { UserItem } from './entity/UserItem';

import { sendBuyItemEvent, subscribeBuyItemEvent } from '../../shared/dist/events'

const GXP_ADDR = "gxp-svc:30002";
let gxpClient: gxp.GxpClient;

const fireAndForgetCallback = (error: ServiceError | null, response: Empty): void => {
  if (error) console.error(error);
}

export const getAll = async (): Promise<backend.GetAllResponse> => {
  const promisifiedFunction = promisify(gxpClient.getAll).bind(gxpClient);
  const gxpRequest: gxp.GetAllRequest = {};
  const gxpResponse: gxp.GetAllResponse = await promisifiedFunction(gxpRequest) as gxp.GetAllResponse;
  console.log(JSON.stringify(gxpResponse));
  const backendResponse: backend.GetAllResponse = {
    balances: gxpResponse.balances, transactions: gxpResponse.transactions
  };
  return backendResponse;
}

export const getUserGxpBalance = async (getUserGxpBalanceRequest: backend.GetUserGxpBalanceRequest, correlationId: string):
  Promise<backend.GetUserGxpBalanceResponse> => {
  console.log(`getUserGxpBalance: ${JSON.stringify(getUserGxpBalanceRequest)} [${correlationId}]`);
  const { userId } = getUserGxpBalanceRequest;
  const gxpRequest: gxp.GetUserBalanceRequest = { userId, correlationId };
  const promisifiedFunction = promisify(gxpClient.getUserBalance).bind(gxpClient);
  const gxpResponse: gxp.GetUserBalanceResponse = await promisifiedFunction(gxpRequest) as gxp.GetUserBalanceResponse;
  console.log(JSON.stringify(gxpResponse));
  const backendResponse: backend.GetUserGxpBalanceResponse = {
    balance: gxpResponse.balance, reserved: gxpResponse.reserved,
    updatedAt: gxpResponse.updatedAt, correlationId
  };
  console.log(`${JSON.stringify(backendResponse)} [${correlationId}]`);
  return backendResponse;
}

export const addUserGxp = async (addGxpRequest: backend.AddGxpRequest, correlationId: string, correlationTimestamp: Date):
  Promise<backend.AddGxpResponse> => {

  console.log(`addGxpRequest: ${JSON.stringify(addGxpRequest)} [${correlationId}]`);
  try {
    const { userId, amount } = addGxpRequest;
    const user = await User.findOneByOrFail({ id: userId });

    const transactionPrepareRequest: gxp.TransactionPrepareRequest = {
      userId,
      type: gxp.TransactionType.ADD,
      amount, correlationId, correlationTimestamp
    };
    const promisifiedFunction = promisify(gxpClient.transactionPrepare).bind(gxpClient);
    const transactionPrepareResponse = await promisifiedFunction(transactionPrepareRequest);
    console.log(`TransactionPrepareResponse: ${JSON.stringify(transactionPrepareResponse)}`);
    gxpClient.transactionCommit({ correlationId }, fireAndForgetCallback);
    const addGxpResponse: backend.AddGxpResponse = { correlationId };
    console.log(`addGxpResponse: ${JSON.stringify(addGxpResponse)}[${correlationId}]`);
    return addGxpResponse;
  } catch (error) {
    gxpClient.transactionAbort({ correlationId }, fireAndForgetCallback);
    throw error;
  }
};

export const buyMarketplaceItem = async (buyItemRequest: backend.BuyItemRequest,
  correlationId: string, correlationTimestamp: Date): Promise<backend.BuyItemResponse> => {
  console.log(`buyItemRequest: ${JSON.stringify(buyItemRequest)} [${correlationId}]`);
  try {
    const { userId, itemId } = buyItemRequest;
    console.log(`{userId: ${userId}, itemId: ${itemId}}`);
    const item = await Item.findOneByOrFail({ id: itemId });
    console.log(`item: ${JSON.stringify(item)}`);
    const transactionPrepareRequest: gxp.TransactionPrepareRequest = {
      userId: userId,
      type: gxp.TransactionType.SUBTRACT,
      amount: item.cost, correlationId, correlationTimestamp
    };
    const promisifiedFunction = promisify(gxpClient.transactionPrepare).bind(gxpClient);
    const transactionPrepareResponse = await promisifiedFunction(transactionPrepareRequest);
    console.log(`TransactionPrepareResponse: ${JSON.stringify(transactionPrepareResponse)}`);
    let userItem: UserItem | null = null;
    await appDataSource.transaction(async (entityMgr) => {
      /*
      const updateResult = await entityMgr.createQueryBuilder().update(MarketplaceItem).set({ count: () => "count - 1" })
        .where("itemId = :itemId AND count > 0", { itemId })
        .execute();
        */
      console.log(`{userId: ${userId}, itemId: ${itemId}}`);
      console.log(`itemId = ${itemId} AND count > 0`);
      const updateResult = await entityMgr.createQueryBuilder().update(MarketplaceItem).set({ count: () => "count - 1" })
        .where(`itemId = ${itemId} AND count > 0`)
        .execute();
      if (updateResult.affected == 0) {
        throw new Error("Out of stock");
      }
      const updateResult2 = await entityMgr.createQueryBuilder().update(UserItem).set({ count: () => "count + 1" })
        .where("userId = :userId AND itemId = :itemId", { userId, itemId })
        .execute();
      if (updateResult2.affected == 0) {
        await entityMgr.create(UserItem, { userId, itemId }).save();
      }
      userItem = await entityMgr.findOneByOrFail(UserItem, { userId, itemId });
    });
    console.log(`UserItem: ${JSON.stringify(userItem)}`);
    gxpClient.transactionCommit({ correlationId }, fireAndForgetCallback);
    sendBuyItemEvent(userId, itemId, userItem!.id, correlationId);
    const buyItemResponse: backend.BuyItemResponse = { userItemId: userItem!.id, correlationId };
    console.log(`buyItemResponse: ${JSON.stringify(buyItemResponse)}[${correlationId}]`);
    return buyItemResponse;
  } catch (error) {
    gxpClient.transactionAbort({ correlationId }, fireAndForgetCallback);
    console.error((error as Error).message);
    throw error;
  }
};

export const createUser = async (createUserRequest: backend.CreateUserRequest,
  correlationId: string, correlationTimestamp: Date): Promise<backend.CreateUserResponse> => {
  const user = await User.create({ name: createUserRequest.name }).save();
  console.log(`user: ${JSON.stringify(user)}`);
  const createUserBalanceRequest: gxp.CreateUserBalanceRequest = { userId: user.id, correlationId, correlationTimestamp };
  const promisifiedFunction = promisify(gxpClient.createUserBalance).bind(gxpClient);
  const result = await promisifiedFunction(createUserBalanceRequest);
  console.log(`result: ${JSON.stringify(result)}`);
  const createUserResponse: backend.CreateUserResponse = { userId: user.id, correlationId };
  console.log(`createUserResponse: ${JSON.stringify(createUserResponse)}[${correlationId}]`);
  return createUserResponse;
};

export const createItem = async (createItemRequest: backend.CreateItemRequest,
  correlationId: string, correlationTimestamp: Date): Promise<backend.CreateItemResponse> => {
  const item = await Item.create({ name: createItemRequest.name, cost: createItemRequest.cost }).save();
  const createItemResponse: backend.CreateItemResponse = { itemId: item.id, correlationId };
  console.log(`createItemResponse: ${JSON.stringify(createItemResponse)} [${correlationId}]`);
  return createItemResponse;
};

export const createMarketplaceItem = async (createMarketplaceItemRequest: backend.CreateMarketplaceItemRequest,
  correlationId: string, correlationTimestamp: Date): Promise<backend.CreateMarketplaceItemResponse> => {
  const marketplaceItem = await MarketplaceItem.create({
    itemId: createMarketplaceItemRequest.itemId,
    count: createMarketplaceItemRequest.count
  }).save();
  const createMarketplaceItemResponse: backend.CreateMarketplaceItemResponse = { marketplaceItemId: marketplaceItem.id, correlationId };
  console.log(`createMarketplaceItemResponse: ${JSON.stringify(createMarketplaceItemResponse)} [${correlationId}]`);
  return createMarketplaceItemResponse;
};

export const createUserItem = async (createUserItemRequest: backend.CreateUserItemRequest,
  correlationId: string, correlationTimestamp: Date): Promise<backend.CreateUserItemResponse> => {
  const userItem = await UserItem.create({
    itemId: createUserItemRequest.itemId,
    count: createUserItemRequest.count
  }).save();
  const createUserItemResponse: backend.CreateUserItemResponse = { userItemId: userItem.id, correlationId };
  console.log(`createUserItemResponse: ${JSON.stringify(createUserItemResponse)} [${correlationId}]`);
  return createUserItemResponse;
};

export const initializeServices = async (): Promise<void> => {

  gxpClient = new gxp.GxpClient(GXP_ADDR, credentials.createInsecure());

  console.log('calling gxpClient.waitForReady')
  gxpClient.waitForReady(new Date(Date.now() + 5000), (error: any) => {
    if (error) {
      console.error('Failed to connect to the gxp server:', error);
    } else {
      console.log('Connection to gxp established successfully.');
    }
  });

  subscribeBuyItemEvent((buyItemEvent) => {
    console.log(`consumed BuyItemEvent: ${JSON.stringify(buyItemEvent)}`);
  });

}