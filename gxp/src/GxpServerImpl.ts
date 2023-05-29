import * as grpc from '@grpc/grpc-js';

import {
  GxpServer,
  TransactionAbortRequest, TransactionCommitRequest, TransactionPrepareRequest, TransactionPrepareResponse,
  CreateUserBalanceRequest, CreateUserBalanceResponse,
  GetUserBalanceRequest, GetUserBalanceResponse, GetAllRequest, GetAllResponse
} from './gen/ts/gxp';
import { Empty } from "./gen/ts/google/protobuf/empty";

import { transactionPrepare, transactionCommit, transactionAbort, createUserBalance, getUserBalance, getAll } from './services';

export class GxpServerImpl implements GxpServer {
  [method: string]: grpc.UntypedHandleCall;

  public async transactionPrepare(call: grpc.ServerUnaryCall<TransactionPrepareRequest, TransactionPrepareResponse>, callback: grpc.sendUnaryData<TransactionPrepareResponse>) {
    const { correlationId } = call.request;
    console.log(`transactionPrepare(${JSON.stringify(call.request)}) [${correlationId}]`)
    await transactionPrepare(call.request.userId, call.request.type, call.request.amount, call.request.correlationId, call.request.correlationTimestamp!);
    const response = TransactionPrepareResponse.create({ correlationId });
    console.log(`transactionPrepare response: ${JSON.stringify(response)}`)
    callback(null, response);
  }

  public async transactionAbort(call: grpc.ServerUnaryCall<TransactionAbortRequest, Empty>, callback: grpc.sendUnaryData<Empty>) {
    console.log(`transactionAbort(${JSON.stringify(call.request)})`);
    await transactionAbort(call.request.correlationId);
    callback(null, null);
  }

  public async transactionCommit(call: grpc.ServerUnaryCall<TransactionCommitRequest, Empty>, callback: grpc.sendUnaryData<Empty>) {
    console.log(`transactionCommit(${JSON.stringify(call.request)})`);
    await transactionCommit(call.request.correlationId);
    callback(null, null);
  }

  public async createUserBalance(call: grpc.ServerUnaryCall<CreateUserBalanceRequest, CreateUserBalanceResponse>, callback: grpc.sendUnaryData<CreateUserBalanceResponse>) {
    const { correlationId } = call.request;
    console.log(`createUserBalance(${JSON.stringify(call.request)}) [${correlationId}]`)
    await createUserBalance(call.request.userId);
    const response = CreateUserBalanceResponse.create({ correlationId });
    console.log(`CreateUserBalanceResponse: ${JSON.stringify(response)}`)
    callback(null, response);
  }

  public async getUserBalance(call: grpc.ServerUnaryCall<GetUserBalanceRequest, GetUserBalanceResponse>,
    callback: grpc.sendUnaryData<GetUserBalanceResponse>) {
    const { correlationId } = call.request;
    console.log(`getUserBalance(${JSON.stringify(call.request)}) [${correlationId}]`);
    const { balance, reserved, updatedAt } = await getUserBalance(call.request.userId);
    const response = GetUserBalanceResponse.create({ balance, reserved, updatedAt, correlationId });
    callback(null, response);
  }

  public async getAll(call: grpc.ServerUnaryCall<GetAllRequest, GetAllResponse>,
    callback: grpc.sendUnaryData<GetAllResponse>) {
    console.log(`getAll()`);
    const { balances, transactions } = await getAll();
    callback(null, GetAllResponse.create({ balances, transactions }));
  }

}

