/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";

export interface AddGxpRequest {
  userId: number;
  amount: number;
}

export interface AddGxpResponse {
  correlationId: string;
}

export interface GetUserGxpBalanceRequest {
  userId: number;
}

export interface GetUserGxpBalanceResponse {
  balance: number;
  reserved: number;
  updatedAt?: Date | undefined;
  correlationId: string;
}

export interface BuyItemRequest {
  userId: number;
  /** consider changing this to marketplaceItemId */
  itemId: number;
}

export interface BuyItemResponse {
  userItemId: number;
  correlationId: string;
}

export interface BuyItemEvent {
  userId: number;
  itemId: number;
  userItemId: number;
  correlationId: string;
}

export interface CreateUserRequest {
  name: string;
}

export interface CreateUserResponse {
  userId: number;
  correlationId: string;
}

export interface CreateItemRequest {
  name: string;
  cost: number;
}

export interface CreateItemResponse {
  itemId: number;
  correlationId: string;
}

export interface CreateMarketplaceItemRequest {
  itemId: number;
  count: number;
}

export interface CreateMarketplaceItemResponse {
  marketplaceItemId: number;
  correlationId: string;
}

export interface CreateUserItemRequest {
  userId: number;
  itemId: number;
  count: number;
}

export interface CreateUserItemResponse {
  userItemId: number;
  correlationId: string;
}

function createBaseAddGxpRequest(): AddGxpRequest {
  return { userId: 0, amount: 0 };
}

export const AddGxpRequest = {
  encode(message: AddGxpRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    if (message.amount !== 0) {
      writer.uint32(16).uint32(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddGxpRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddGxpRequest();
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

          message.amount = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddGxpRequest {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      amount: isSet(object.amount) ? globalThis.Number(object.amount) : 0,
    };
  },

  toJSON(message: AddGxpRequest): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.amount !== 0) {
      obj.amount = Math.round(message.amount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AddGxpRequest>, I>>(base?: I): AddGxpRequest {
    return AddGxpRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AddGxpRequest>, I>>(object: I): AddGxpRequest {
    const message = createBaseAddGxpRequest();
    message.userId = object.userId ?? 0;
    message.amount = object.amount ?? 0;
    return message;
  },
};

function createBaseAddGxpResponse(): AddGxpResponse {
  return { correlationId: "" };
}

export const AddGxpResponse = {
  encode(message: AddGxpResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.correlationId !== "") {
      writer.uint32(10).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AddGxpResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddGxpResponse();
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

  fromJSON(object: any): AddGxpResponse {
    return { correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "" };
  },

  toJSON(message: AddGxpResponse): unknown {
    const obj: any = {};
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AddGxpResponse>, I>>(base?: I): AddGxpResponse {
    return AddGxpResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AddGxpResponse>, I>>(object: I): AddGxpResponse {
    const message = createBaseAddGxpResponse();
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseGetUserGxpBalanceRequest(): GetUserGxpBalanceRequest {
  return { userId: 0 };
}

export const GetUserGxpBalanceRequest = {
  encode(message: GetUserGxpBalanceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserGxpBalanceRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserGxpBalanceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.userId = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetUserGxpBalanceRequest {
    return { userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0 };
  },

  toJSON(message: GetUserGxpBalanceRequest): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserGxpBalanceRequest>, I>>(base?: I): GetUserGxpBalanceRequest {
    return GetUserGxpBalanceRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserGxpBalanceRequest>, I>>(object: I): GetUserGxpBalanceRequest {
    const message = createBaseGetUserGxpBalanceRequest();
    message.userId = object.userId ?? 0;
    return message;
  },
};

function createBaseGetUserGxpBalanceResponse(): GetUserGxpBalanceResponse {
  return { balance: 0, reserved: 0, updatedAt: undefined, correlationId: "" };
}

export const GetUserGxpBalanceResponse = {
  encode(message: GetUserGxpBalanceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserGxpBalanceResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserGxpBalanceResponse();
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

  fromJSON(object: any): GetUserGxpBalanceResponse {
    return {
      balance: isSet(object.balance) ? globalThis.Number(object.balance) : 0,
      reserved: isSet(object.reserved) ? globalThis.Number(object.reserved) : 0,
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
    };
  },

  toJSON(message: GetUserGxpBalanceResponse): unknown {
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

  create<I extends Exact<DeepPartial<GetUserGxpBalanceResponse>, I>>(base?: I): GetUserGxpBalanceResponse {
    return GetUserGxpBalanceResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetUserGxpBalanceResponse>, I>>(object: I): GetUserGxpBalanceResponse {
    const message = createBaseGetUserGxpBalanceResponse();
    message.balance = object.balance ?? 0;
    message.reserved = object.reserved ?? 0;
    message.updatedAt = object.updatedAt ?? undefined;
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseBuyItemRequest(): BuyItemRequest {
  return { userId: 0, itemId: 0 };
}

export const BuyItemRequest = {
  encode(message: BuyItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    if (message.itemId !== 0) {
      writer.uint32(16).uint32(message.itemId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BuyItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBuyItemRequest();
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

          message.itemId = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BuyItemRequest {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      itemId: isSet(object.itemId) ? globalThis.Number(object.itemId) : 0,
    };
  },

  toJSON(message: BuyItemRequest): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.itemId !== 0) {
      obj.itemId = Math.round(message.itemId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BuyItemRequest>, I>>(base?: I): BuyItemRequest {
    return BuyItemRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BuyItemRequest>, I>>(object: I): BuyItemRequest {
    const message = createBaseBuyItemRequest();
    message.userId = object.userId ?? 0;
    message.itemId = object.itemId ?? 0;
    return message;
  },
};

function createBaseBuyItemResponse(): BuyItemResponse {
  return { userItemId: 0, correlationId: "" };
}

export const BuyItemResponse = {
  encode(message: BuyItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userItemId !== 0) {
      writer.uint32(8).uint32(message.userItemId);
    }
    if (message.correlationId !== "") {
      writer.uint32(18).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BuyItemResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBuyItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.userItemId = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): BuyItemResponse {
    return {
      userItemId: isSet(object.userItemId) ? globalThis.Number(object.userItemId) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
    };
  },

  toJSON(message: BuyItemResponse): unknown {
    const obj: any = {};
    if (message.userItemId !== 0) {
      obj.userItemId = Math.round(message.userItemId);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BuyItemResponse>, I>>(base?: I): BuyItemResponse {
    return BuyItemResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BuyItemResponse>, I>>(object: I): BuyItemResponse {
    const message = createBaseBuyItemResponse();
    message.userItemId = object.userItemId ?? 0;
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseBuyItemEvent(): BuyItemEvent {
  return { userId: 0, itemId: 0, userItemId: 0, correlationId: "" };
}

export const BuyItemEvent = {
  encode(message: BuyItemEvent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    if (message.itemId !== 0) {
      writer.uint32(16).uint32(message.itemId);
    }
    if (message.userItemId !== 0) {
      writer.uint32(24).uint32(message.userItemId);
    }
    if (message.correlationId !== "") {
      writer.uint32(34).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BuyItemEvent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBuyItemEvent();
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

          message.itemId = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.userItemId = reader.uint32();
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

  fromJSON(object: any): BuyItemEvent {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      itemId: isSet(object.itemId) ? globalThis.Number(object.itemId) : 0,
      userItemId: isSet(object.userItemId) ? globalThis.Number(object.userItemId) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
    };
  },

  toJSON(message: BuyItemEvent): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.itemId !== 0) {
      obj.itemId = Math.round(message.itemId);
    }
    if (message.userItemId !== 0) {
      obj.userItemId = Math.round(message.userItemId);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BuyItemEvent>, I>>(base?: I): BuyItemEvent {
    return BuyItemEvent.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BuyItemEvent>, I>>(object: I): BuyItemEvent {
    const message = createBaseBuyItemEvent();
    message.userId = object.userId ?? 0;
    message.itemId = object.itemId ?? 0;
    message.userItemId = object.userItemId ?? 0;
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseCreateUserRequest(): CreateUserRequest {
  return { name: "" };
}

export const CreateUserRequest = {
  encode(message: CreateUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateUserRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateUserRequest {
    return { name: isSet(object.name) ? globalThis.String(object.name) : "" };
  },

  toJSON(message: CreateUserRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateUserRequest>, I>>(base?: I): CreateUserRequest {
    return CreateUserRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateUserRequest>, I>>(object: I): CreateUserRequest {
    const message = createBaseCreateUserRequest();
    message.name = object.name ?? "";
    return message;
  },
};

function createBaseCreateUserResponse(): CreateUserResponse {
  return { userId: 0, correlationId: "" };
}

export const CreateUserResponse = {
  encode(message: CreateUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    if (message.correlationId !== "") {
      writer.uint32(18).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateUserResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserResponse();
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
          if (tag !== 18) {
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

  fromJSON(object: any): CreateUserResponse {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
    };
  },

  toJSON(message: CreateUserResponse): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateUserResponse>, I>>(base?: I): CreateUserResponse {
    return CreateUserResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateUserResponse>, I>>(object: I): CreateUserResponse {
    const message = createBaseCreateUserResponse();
    message.userId = object.userId ?? 0;
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseCreateItemRequest(): CreateItemRequest {
  return { name: "", cost: 0 };
}

export const CreateItemRequest = {
  encode(message: CreateItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.cost !== 0) {
      writer.uint32(16).uint32(message.cost);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.cost = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateItemRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      cost: isSet(object.cost) ? globalThis.Number(object.cost) : 0,
    };
  },

  toJSON(message: CreateItemRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.cost !== 0) {
      obj.cost = Math.round(message.cost);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateItemRequest>, I>>(base?: I): CreateItemRequest {
    return CreateItemRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateItemRequest>, I>>(object: I): CreateItemRequest {
    const message = createBaseCreateItemRequest();
    message.name = object.name ?? "";
    message.cost = object.cost ?? 0;
    return message;
  },
};

function createBaseCreateItemResponse(): CreateItemResponse {
  return { itemId: 0, correlationId: "" };
}

export const CreateItemResponse = {
  encode(message: CreateItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== 0) {
      writer.uint32(8).uint32(message.itemId);
    }
    if (message.correlationId !== "") {
      writer.uint32(18).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateItemResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.itemId = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): CreateItemResponse {
    return {
      itemId: isSet(object.itemId) ? globalThis.Number(object.itemId) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
    };
  },

  toJSON(message: CreateItemResponse): unknown {
    const obj: any = {};
    if (message.itemId !== 0) {
      obj.itemId = Math.round(message.itemId);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateItemResponse>, I>>(base?: I): CreateItemResponse {
    return CreateItemResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateItemResponse>, I>>(object: I): CreateItemResponse {
    const message = createBaseCreateItemResponse();
    message.itemId = object.itemId ?? 0;
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseCreateMarketplaceItemRequest(): CreateMarketplaceItemRequest {
  return { itemId: 0, count: 0 };
}

export const CreateMarketplaceItemRequest = {
  encode(message: CreateMarketplaceItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.itemId !== 0) {
      writer.uint32(8).uint32(message.itemId);
    }
    if (message.count !== 0) {
      writer.uint32(16).uint32(message.count);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateMarketplaceItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateMarketplaceItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.itemId = reader.uint32();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.count = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateMarketplaceItemRequest {
    return {
      itemId: isSet(object.itemId) ? globalThis.Number(object.itemId) : 0,
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
    };
  },

  toJSON(message: CreateMarketplaceItemRequest): unknown {
    const obj: any = {};
    if (message.itemId !== 0) {
      obj.itemId = Math.round(message.itemId);
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateMarketplaceItemRequest>, I>>(base?: I): CreateMarketplaceItemRequest {
    return CreateMarketplaceItemRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateMarketplaceItemRequest>, I>>(object: I): CreateMarketplaceItemRequest {
    const message = createBaseCreateMarketplaceItemRequest();
    message.itemId = object.itemId ?? 0;
    message.count = object.count ?? 0;
    return message;
  },
};

function createBaseCreateMarketplaceItemResponse(): CreateMarketplaceItemResponse {
  return { marketplaceItemId: 0, correlationId: "" };
}

export const CreateMarketplaceItemResponse = {
  encode(message: CreateMarketplaceItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.marketplaceItemId !== 0) {
      writer.uint32(8).uint32(message.marketplaceItemId);
    }
    if (message.correlationId !== "") {
      writer.uint32(18).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateMarketplaceItemResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateMarketplaceItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.marketplaceItemId = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): CreateMarketplaceItemResponse {
    return {
      marketplaceItemId: isSet(object.marketplaceItemId) ? globalThis.Number(object.marketplaceItemId) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
    };
  },

  toJSON(message: CreateMarketplaceItemResponse): unknown {
    const obj: any = {};
    if (message.marketplaceItemId !== 0) {
      obj.marketplaceItemId = Math.round(message.marketplaceItemId);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateMarketplaceItemResponse>, I>>(base?: I): CreateMarketplaceItemResponse {
    return CreateMarketplaceItemResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateMarketplaceItemResponse>, I>>(
    object: I,
  ): CreateMarketplaceItemResponse {
    const message = createBaseCreateMarketplaceItemResponse();
    message.marketplaceItemId = object.marketplaceItemId ?? 0;
    message.correlationId = object.correlationId ?? "";
    return message;
  },
};

function createBaseCreateUserItemRequest(): CreateUserItemRequest {
  return { userId: 0, itemId: 0, count: 0 };
}

export const CreateUserItemRequest = {
  encode(message: CreateUserItemRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== 0) {
      writer.uint32(8).uint32(message.userId);
    }
    if (message.itemId !== 0) {
      writer.uint32(16).uint32(message.itemId);
    }
    if (message.count !== 0) {
      writer.uint32(24).uint32(message.count);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateUserItemRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserItemRequest();
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

          message.itemId = reader.uint32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.count = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateUserItemRequest {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      itemId: isSet(object.itemId) ? globalThis.Number(object.itemId) : 0,
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
    };
  },

  toJSON(message: CreateUserItemRequest): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.itemId !== 0) {
      obj.itemId = Math.round(message.itemId);
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateUserItemRequest>, I>>(base?: I): CreateUserItemRequest {
    return CreateUserItemRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateUserItemRequest>, I>>(object: I): CreateUserItemRequest {
    const message = createBaseCreateUserItemRequest();
    message.userId = object.userId ?? 0;
    message.itemId = object.itemId ?? 0;
    message.count = object.count ?? 0;
    return message;
  },
};

function createBaseCreateUserItemResponse(): CreateUserItemResponse {
  return { userItemId: 0, correlationId: "" };
}

export const CreateUserItemResponse = {
  encode(message: CreateUserItemResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userItemId !== 0) {
      writer.uint32(8).uint32(message.userItemId);
    }
    if (message.correlationId !== "") {
      writer.uint32(18).string(message.correlationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateUserItemResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateUserItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.userItemId = reader.uint32();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): CreateUserItemResponse {
    return {
      userItemId: isSet(object.userItemId) ? globalThis.Number(object.userItemId) : 0,
      correlationId: isSet(object.correlationId) ? globalThis.String(object.correlationId) : "",
    };
  },

  toJSON(message: CreateUserItemResponse): unknown {
    const obj: any = {};
    if (message.userItemId !== 0) {
      obj.userItemId = Math.round(message.userItemId);
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateUserItemResponse>, I>>(base?: I): CreateUserItemResponse {
    return CreateUserItemResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateUserItemResponse>, I>>(object: I): CreateUserItemResponse {
    const message = createBaseCreateUserItemResponse();
    message.userItemId = object.userItemId ?? 0;
    message.correlationId = object.correlationId ?? "";
    return message;
  },
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
