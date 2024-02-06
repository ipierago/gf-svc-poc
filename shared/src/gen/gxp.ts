/* eslint-disable */
import { ChannelCredentials, Client, makeGenericClientConstructor, Metadata } from "@grpc/grpc-js";
import type {
  CallOptions,
  ClientOptions,
  ClientUnaryCall,
  handleUnaryCall,
  ServiceError,
  UntypedServiceImplementation,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";

export enum TransactionType {
  ADD = 0,
  SUBTRACT = 1,
  UNRECOGNIZED = -1,
}

export function transactionTypeFromJSON(object: any): TransactionType {
  switch (object) {
    case 0:
    case "ADD":
      return TransactionType.ADD;
    case 1:
    case "SUBTRACT":
      return TransactionType.SUBTRACT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TransactionType.UNRECOGNIZED;
  }
}

export function transactionTypeToJSON(object: TransactionType): string {
  switch (object) {
    case TransactionType.ADD:
      return "ADD";
    case TransactionType.SUBTRACT:
      return "SUBTRACT";
    case TransactionType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TransactionStatus {
  PENDING = 0,
  ABORTED = 1,
  COMMITTED = 2,
  UNRECOGNIZED = -1,
}

export function transactionStatusFromJSON(object: any): TransactionStatus {
  switch (object) {
    case 0:
    case "PENDING":
      return TransactionStatus.PENDING;
    case 1:
    case "ABORTED":
      return TransactionStatus.ABORTED;
    case 2:
    case "COMMITTED":
      return TransactionStatus.COMMITTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TransactionStatus.UNRECOGNIZED;
  }
}

export function transactionStatusToJSON(object: TransactionStatus): string {
  switch (object) {
    case TransactionStatus.PENDING:
      return "PENDING";
    case TransactionStatus.ABORTED:
      return "ABORTED";
    case TransactionStatus.COMMITTED:
      return "COMMITTED";
    case TransactionStatus.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Balance {
  balance: number;
  reserved: number;
  updatedAt?: Date | undefined;
}

export interface Transaction {
  balanceId: number;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  correlationId: string;
  updatedAt?: Date | undefined;
}

export interface GetAllRequest {
}

export interface GetAllResponse {
  balances: Balance[];
  transactions: Transaction[];
}

export interface TransactionPrepareRequest {
  userId: number;
  type: TransactionType;
  amount: number;
  correlationId: string;
  correlationTimestamp?: Date | undefined;
}

export interface TransactionPrepareResponse {
  correlationId: string;
}

export interface CreateUserBalanceRequest {
  userId: number;
  correlationId: string;
  correlationTimestamp?: Date | undefined;
}

export interface CreateUserBalanceResponse {
  correlationId: string;
}

export interface GetUserBalanceRequest {
  userId: number;
  correlationId: string;
  correlationTimestamp?: Date | undefined;
}

export interface GetUserBalanceResponse {
  balance: number;
  reserved: number;
  updatedAt?: Date | undefined;
  correlationId: string;
}

function createBaseBalance(): Balance {
  return { balance: 0, reserved: 0, updatedAt: undefined };
}

export const Balance = {
  encode(message: Balance, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.balance !== 0) {
      writer.uint32(8).uint32(message.balance);
    }
    if (message.reserved !== 0) {
      writer.uint32(16).uint32(message.reserved);
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Balance {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBalance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.balance = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.reserved = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Balance {
    return {
      balance: isSet(object.balance) ? globalThis.Number(object.balance) : 0,
      reserved: isSet(object.reserved) ? globalThis.Number(object.reserved) : 0,
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
    };
  },

  toJSON(message: Balance): unknown {
    const obj: any = {};
    if (message.balance !== 0) {
      obj.balance = Math.round(message.balance);
    }
    if (message.reserved !== 0) {
      obj.reserved = Math.round(message.reserved);
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Balance>, I>>(base?: I): Balance {
    return Balance.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Balance>, I>>(object: I): Balance {
    const message = createBaseBalance();
    message.balance = object.balance ?? 0;
    message.reserved = object.reserved ?? 0;
    message.updatedAt = object.updatedAt ?? undefined;
    return message;
  },
};

function createBaseTransaction(): Transaction {
  return { balanceId: 0, amount: 0, type: 0, status: 0, correlationId: "", updatedAt: undefined };
}

export const Transaction = {
  encode(message: Transaction, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.balanceId !== 0) {
      writer.uint32(8).uint32(message.balanceId);
    }
    if (message.amount !== 0) {
      writer.uint32(16).uint32(message.amount);
    }
    if (message.type !== 0) {
      writer.uint32(24).int32(message.type);
    }
    if (message.status !== 0) {
      writer.uint32(32).int32(message.status);
    }
    if (message.correlationId !== "") {
      writer.uint32(42).string(message.correlationId);
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Transaction {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransaction();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.balanceId = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.amount = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.status = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.correlationId = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Transaction {
    return {
      balanceId: isSet(object.balanceId) ? globalThis.Number(object.balanceId) : 0,
      amount: isSet(object.amount) ? globalThis.Number(object.amount) : 0,
      type: isSet(object.type) ? transactionTypeFromJSON(object.type) : 0,
      status: isSet(object.status) ? transactionStatusFromJSON(object.status) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
    };
  },

  toJSON(message: Transaction): unknown {
    const obj: any = {};
    if (message.balanceId !== 0) {
      obj.balanceId = Math.round(message.balanceId);
    }
    if (message.amount !== 0) {
      obj.amount = Math.round(message.amount);
    }
    if (message.type !== 0) {
      obj.type = transactionTypeToJSON(message.type);
    }
    if (message.status !== 0) {
      obj.status = transactionStatusToJSON(message.status);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Transaction>, I>>(base?: I): Transaction {
    return Transaction.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Transaction>, I>>(object: I): Transaction {
    const message = createBaseTransaction();
    message.balanceId = object.balanceId ?? 0;
    message.amount = object.amount ?? 0;
    message.type = object.type ?? 0;
    message.status = object.status ?? 0;
    message.correlationId = object.correlationId ?? "";
    message.updatedAt = object.updatedAt ?? undefined;
    return message;
  },
};

function createBaseGetAllRequest(): GetAllRequest {
  return {};
}

export const GetAllRequest = {
  encode(_: GetAllRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): GetAllRequest {
    return {};
  },

  toJSON(_: GetAllRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAllRequest>, I>>(base?: I): GetAllRequest {
    return GetAllRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetAllRequest>, I>>(_: I): GetAllRequest {
    const message = createBaseGetAllRequest();
    return message;
  },
};

function createBaseGetAllResponse(): GetAllResponse {
  return { balances: [], transactions: [] };
}

export const GetAllResponse = {
  encode(message: GetAllResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.balances) {
      Balance.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.transactions) {
      Transaction.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAllResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAllResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.balances.push(Balance.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.transactions.push(Transaction.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetAllResponse {
    return {
      balances: globalThis.Array.isArray(object?.balances) ? object.balances.map((e: any) => Balance.fromJSON(e)) : [],
      transactions: globalThis.Array.isArray(object?.transactions)
        ? object.transactions.map((e: any) => Transaction.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetAllResponse): unknown {
    const obj: any = {};
    if (message.balances?.length) {
      obj.balances = message.balances.map((e) => Balance.toJSON(e));
    }
    if (message.transactions?.length) {
      obj.transactions = message.transactions.map((e) => Transaction.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAllResponse>, I>>(base?: I): GetAllResponse {
    return GetAllResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetAllResponse>, I>>(object: I): GetAllResponse {
    const message = createBaseGetAllResponse();
    message.balances = object.balances?.map((e) => Balance.fromPartial(e)) || [];
    message.transactions = object.transactions?.map((e) => Transaction.fromPartial(e)) || [];
    return message;
  },
};

function createBaseTransactionPrepareRequest(): TransactionPrepareRequest {
  return { userId: 0, type: 0, amount: 0, correlationId: "", correlationTimestamp: undefined };
}

export const TransactionPrepareRequest = {
  encode(message: TransactionPrepareRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.amount !== 0) {
      writer.uint32(24).uint32(message.amount);
    }
    if (message.correlationId !== "") {
      writer.uint32(34).string(message.correlationId);
    }
    if (message.correlationTimestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.correlationTimestamp), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionPrepareRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionPrepareRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.userId = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.amount = reader.uint32();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.correlationId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.correlationTimestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransactionPrepareRequest {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      type: isSet(object.type) ? transactionTypeFromJSON(object.type) : 0,
      amount: isSet(object.amount) ? globalThis.Number(object.amount) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
      correlationTimestamp: isSet(object.correlationTimestamp)
        ? fromJsonTimestamp(object.correlationTimestamp)
        : undefined,
    };
  },

  toJSON(message: TransactionPrepareRequest): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.type !== 0) {
      obj.type = transactionTypeToJSON(message.type);
    }
    if (message.amount !== 0) {
      obj.amount = Math.round(message.amount);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    if (message.correlationTimestamp !== undefined) {
      obj.correlationTimestamp = message.correlationTimestamp.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionPrepareRequest>, I>>(base?: I): TransactionPrepareRequest {
    return TransactionPrepareRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransactionPrepareRequest>, I>>(object: I): TransactionPrepareRequest {
    const message = createBaseTransactionPrepareRequest();
    message.userId = object.userId ?? 0;
    message.type = object.type ?? 0;
    message.amount = object.amount ?? 0;
    message.correlationId = object.correlationId ?? "";
    message.correlationTimestamp = object.correlationTimestamp ?? undefined;
    return message;
  },
};

function createBaseTransactionPrepareResponse(): TransactionPrepareResponse {
  return { correlationId: "" };
}

export const TransactionPrepareResponse = {
  encode(message: TransactionPrepareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.correlationId !== "") {
      writer.uint32(10).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionPrepareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionPrepareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.correlationId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TransactionPrepareResponse {
    return { correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "" };
  },

  toJSON(message: TransactionPrepareResponse): unknown {
    const obj: any = {};
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionPrepareResponse>, I>>(base?: I): TransactionPrepareResponse {
    return TransactionPrepareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TransactionPrepareResponse>, I>>(object: I): TransactionPrepareResponse {
    const message = createBaseTransactionPrepareResponse();
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseCreateUserBalanceRequest(): CreateUserBalanceRequest {
  return { userId: 0, correlationId: "", correlationTimestamp: undefined };
}

export const CreateUserBalanceRequest = {
  encode(message: CreateUserBalanceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    if (message.correlationId !== "") {
      writer.uint32(26).string(message.correlationId);
    }
    if (message.correlationTimestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.correlationTimestamp), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateUserBalanceRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserBalanceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.userId = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.correlationId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.correlationTimestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateUserBalanceRequest {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
      correlationTimestamp: isSet(object.correlationTimestamp)
        ? fromJsonTimestamp(object.correlationTimestamp)
        : undefined,
    };
  },

  toJSON(message: CreateUserBalanceRequest): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    if (message.correlationTimestamp !== undefined) {
      obj.correlationTimestamp = message.correlationTimestamp.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateUserBalanceRequest>, I>>(base?: I): CreateUserBalanceRequest {
    return CreateUserBalanceRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateUserBalanceRequest>, I>>(object: I): CreateUserBalanceRequest {
    const message = createBaseCreateUserBalanceRequest();
    message.userId = object.userId ?? 0;
    message.correlationId = object.correlationId ?? "";
    message.correlationTimestamp = object.correlationTimestamp ?? undefined;
    return message;
  },
};

function createBaseCreateUserBalanceResponse(): CreateUserBalanceResponse {
  return { correlationId: "" };
}

export const CreateUserBalanceResponse = {
  encode(message: CreateUserBalanceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.correlationId !== "") {
      writer.uint32(10).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateUserBalanceResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserBalanceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.correlationId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateUserBalanceResponse {
    return { correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "" };
  },

  toJSON(message: CreateUserBalanceResponse): unknown {
    const obj: any = {};
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateUserBalanceResponse>, I>>(base?: I): CreateUserBalanceResponse {
    return CreateUserBalanceResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateUserBalanceResponse>, I>>(object: I): CreateUserBalanceResponse {
    const message = createBaseCreateUserBalanceResponse();
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseGetUserBalanceRequest(): GetUserBalanceRequest {
  return { userId: 0, correlationId: "", correlationTimestamp: undefined };
}

export const GetUserBalanceRequest = {
  encode(message: GetUserBalanceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    if (message.correlationId !== "") {
      writer.uint32(26).string(message.correlationId);
    }
    if (message.correlationTimestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.correlationTimestamp), writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserBalanceRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserBalanceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.userId = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.correlationId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.correlationTimestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserBalanceRequest {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
      correlationTimestamp: isSet(object.correlationTimestamp)
        ? fromJsonTimestamp(object.correlationTimestamp)
        : undefined,
    };
  },

  toJSON(message: GetUserBalanceRequest): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    if (message.correlationTimestamp !== undefined) {
      obj.correlationTimestamp = message.correlationTimestamp.toISOString();
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserBalanceRequest>, I>>(base?: I): GetUserBalanceRequest {
    return GetUserBalanceRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserBalanceRequest>, I>>(object: I): GetUserBalanceRequest {
    const message = createBaseGetUserBalanceRequest();
    message.userId = object.userId ?? 0;
    message.correlationId = object.correlationId ?? "";
    message.correlationTimestamp = object.correlationTimestamp ?? undefined;
    return message;
  },
};

function createBaseGetUserBalanceResponse(): GetUserBalanceResponse {
  return { balance: 0, reserved: 0, updatedAt: undefined, correlationId: "" };
}

export const GetUserBalanceResponse = {
  encode(message: GetUserBalanceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.balance !== 0) {
      writer.uint32(8).uint32(message.balance);
    }
    if (message.reserved !== 0) {
      writer.uint32(16).uint32(message.reserved);
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(26).fork()).ldelim();
    }
    if (message.correlationId !== "") {
      writer.uint32(34).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserBalanceResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserBalanceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.balance = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.reserved = reader.uint32();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.correlationId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserBalanceResponse {
    return {
      balance: isSet(object.balance) ? globalThis.Number(object.balance) : 0,
      reserved: isSet(object.reserved) ? globalThis.Number(object.reserved) : 0,
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
    };
  },

  toJSON(message: GetUserBalanceResponse): unknown {
    const obj: any = {};
    if (message.balance !== 0) {
      obj.balance = Math.round(message.balance);
    }
    if (message.reserved !== 0) {
      obj.reserved = Math.round(message.reserved);
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt.toISOString();
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserBalanceResponse>, I>>(base?: I): GetUserBalanceResponse {
    return GetUserBalanceResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserBalanceResponse>, I>>(object: I): GetUserBalanceResponse {
    const message = createBaseGetUserBalanceResponse();
    message.balance = object.balance ?? 0;
    message.reserved = object.reserved ?? 0;
    message.updatedAt = object.updatedAt ?? undefined;
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

export type GxpService = typeof GxpService;
export const GxpService = {
  transactionPrepare: {
    path: "/gxp.Gxp/TransactionPrepare",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: TransactionPrepareRequest) =>
      Buffer.from(TransactionPrepareRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => TransactionPrepareRequest.decode(value),
    responseSerialize: (value: TransactionPrepareResponse) =>
      Buffer.from(TransactionPrepareResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => TransactionPrepareResponse.decode(value),
  },
  createUserBalance: {
    path: "/gxp.Gxp/CreateUserBalance",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: CreateUserBalanceRequest) => Buffer.from(CreateUserBalanceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => CreateUserBalanceRequest.decode(value),
    responseSerialize: (value: CreateUserBalanceResponse) =>
      Buffer.from(CreateUserBalanceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => CreateUserBalanceResponse.decode(value),
  },
  getUserBalance: {
    path: "/gxp.Gxp/GetUserBalance",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetUserBalanceRequest) => Buffer.from(GetUserBalanceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetUserBalanceRequest.decode(value),
    responseSerialize: (value: GetUserBalanceResponse) => Buffer.from(GetUserBalanceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetUserBalanceResponse.decode(value),
  },
  getAll: {
    path: "/gxp.Gxp/GetAll",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetAllRequest) => Buffer.from(GetAllRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetAllRequest.decode(value),
    responseSerialize: (value: GetAllResponse) => Buffer.from(GetAllResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetAllResponse.decode(value),
  },
} as const;

export interface GxpServer extends UntypedServiceImplementation {
  transactionPrepare: handleUnaryCall<TransactionPrepareRequest, TransactionPrepareResponse>;
  createUserBalance: handleUnaryCall<CreateUserBalanceRequest, CreateUserBalanceResponse>;
  getUserBalance: handleUnaryCall<GetUserBalanceRequest, GetUserBalanceResponse>;
  getAll: handleUnaryCall<GetAllRequest, GetAllResponse>;
}

export interface GxpClient extends Client {
  transactionPrepare(
    request: TransactionPrepareRequest,
    callback: (error: ServiceError | null, response: TransactionPrepareResponse) => void,
  ): ClientUnaryCall;
  transactionPrepare(
    request: TransactionPrepareRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: TransactionPrepareResponse) => void,
  ): ClientUnaryCall;
  transactionPrepare(
    request: TransactionPrepareRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: TransactionPrepareResponse) => void,
  ): ClientUnaryCall;
  createUserBalance(
    request: CreateUserBalanceRequest,
    callback: (error: ServiceError | null, response: CreateUserBalanceResponse) => void,
  ): ClientUnaryCall;
  createUserBalance(
    request: CreateUserBalanceRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: CreateUserBalanceResponse) => void,
  ): ClientUnaryCall;
  createUserBalance(
    request: CreateUserBalanceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: CreateUserBalanceResponse) => void,
  ): ClientUnaryCall;
  getUserBalance(
    request: GetUserBalanceRequest,
    callback: (error: ServiceError | null, response: GetUserBalanceResponse) => void,
  ): ClientUnaryCall;
  getUserBalance(
    request: GetUserBalanceRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetUserBalanceResponse) => void,
  ): ClientUnaryCall;
  getUserBalance(
    request: GetUserBalanceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetUserBalanceResponse) => void,
  ): ClientUnaryCall;
  getAll(
    request: GetAllRequest,
    callback: (error: ServiceError | null, response: GetAllResponse) => void,
  ): ClientUnaryCall;
  getAll(
    request: GetAllRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetAllResponse) => void,
  ): ClientUnaryCall;
  getAll(
    request: GetAllRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetAllResponse) => void,
  ): ClientUnaryCall;
}

export const GxpClient = makeGenericClientConstructor(GxpService, "gxp.Gxp") as unknown as {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ClientOptions>): GxpClient;
  service: typeof GxpService;
  serviceName: string;
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
