import { ServiceError, credentials } from '@grpc/grpc-js';
import { promisify } from 'util';

import * as gxp from './gen/gxp';
import { Empty } from "./gen/google/protobuf/empty";


const fireAndForgetCallback = (error: ServiceError | null, response: Empty): void => {
  if (error) console.error(error);
}

export interface gxpAPI {
  getAll: (req: gxp.GetAllRequest) => Promise<gxp.GetAllResponse>;
  createUserBalance: (req: gxp.CreateUserBalanceRequest) => Promise<gxp.CreateUserBalanceResponse>;
  getUserBalance: (req: gxp.GetUserBalanceRequest) => Promise<gxp.GetUserBalanceResponse>;
  transactionPrepare: (req: gxp.TransactionPrepareRequest) => Promise<gxp.TransactionPrepareResponse>;
  transactionCommit: (req: gxp.TransactionCommitRequest) => void;
  transactionAbort: (req: gxp.TransactionAbortRequest) => void;
}

export const connectGxpAPI = async (): Promise<gxpAPI> => {
  console.log("connectGxpAPI");
  const cred = credentials.createInsecure();
  console.log(JSON.stringify(cred));
  const GXP_ADDR = "gxp-svc:30002";
  const gxpClient = new gxp.GxpClient(GXP_ADDR, cred);

  console.log('calling gxpClient.waitForReady')
  const promisified = promisify(gxpClient.waitForReady).bind(gxpClient);
  const res = await promisified(new Date(Date.now() + 5000));
  console.log(`promisified res: ${JSON.stringify(res)}`);
  console.log('Connection to gxp established successfully.');

  return {
    getAll: async (req: gxp.GetAllRequest): Promise<gxp.GetAllResponse> => {
      const promisifiedFunction = promisify(gxpClient.getAll).bind(gxpClient);
      const res: gxp.GetAllResponse = await promisifiedFunction(req) as gxp.GetAllResponse;
      return res;
    },
    createUserBalance: async (req: gxp.CreateUserBalanceRequest): Promise<gxp.CreateUserBalanceResponse> => {
      const promisifiedFunction = promisify(gxpClient.createUserBalance).bind(gxpClient);
      const res: gxp.CreateUserBalanceResponse = await promisifiedFunction(req) as gxp.CreateUserBalanceResponse;
      return res;
    },
    getUserBalance: async (req: gxp.GetUserBalanceRequest): Promise<gxp.GetUserBalanceResponse> => {
      const promisifiedFunction = promisify(gxpClient.getUserBalance).bind(gxpClient);
      const res: gxp.GetUserBalanceResponse = await promisifiedFunction(req) as gxp.GetUserBalanceResponse;
      return res;
    },
    transactionPrepare: async (req: gxp.TransactionPrepareRequest): Promise<gxp.TransactionPrepareResponse> => {
      const promisifiedFunction = promisify(gxpClient.transactionPrepare).bind(gxpClient);
      const res: gxp.TransactionPrepareResponse = await promisifiedFunction(req) as gxp.TransactionPrepareResponse;
      return res;
    },
    transactionCommit: (req: gxp.TransactionCommitRequest): void => {
      gxpClient.transactionCommit(req, fireAndForgetCallback);
    },
    transactionAbort: (req: gxp.TransactionAbortRequest): void => {
      gxpClient.transactionAbort(req, fireAndForgetCallback);
    }
  };
}