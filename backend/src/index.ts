import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

import {
  BuyItemRequest, CreateUserRequest,
  CreateItemRequest, CreateMarketplaceItemRequest,
  CreateUserItemRequest, AddGxpRequest,
  GetUserGxpBalanceRequest, GetUserGxpBalanceResponse,
  GetAllRequest, GetAllResponse
} from './gen/ts/backend';
import { appDataSource } from "./AppDataSource";
import {
  buyMarketplaceItem, createUser, createItem,
  createMarketplaceItem, createUserItem, addUserGxp,
  getUserGxpBalance, getAll
} from './services';
import { User } from "./entity/User";
import { Item } from "./entity/Item";
import { MarketplaceItem } from './entity/MarketplaceItem';
import { UserItem } from './entity/UserItem';


const MY_PORT = 30000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/item', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/item ${JSON.stringify(req.body)} [${correlationId}]`);
    const items = await Item.find();
    res.json({ items });
  } catch (error: any) {
    console.error(`ERROR [${correlationId}]: ${JSON.stringify(error)}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});

app.post('/item/create', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/item/create ${JSON.stringify(req.body)} [${correlationId}]`);
    const createItemRequest: CreateItemRequest = req.body;
    const createItemResponse = await createItem(createItemRequest, correlationId, correlationTimestamp);
    res.json(createItemResponse);
  } catch (error) {
    console.error(`ERROR [${correlationId}]: ${error}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});


app.get('/marketplace/item', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/marketplace/item ${JSON.stringify(req.body)} [${correlationId}]`);
    const marketplaceItems = await MarketplaceItem.find();
    res.json({ marketplaceItems });
  } catch (error: any) {
    console.error(`ERROR [${correlationId}]: ${JSON.stringify(error)}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});

app.post('/marketplace/item/create', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/marketplace/item/create ${JSON.stringify(req.body)} [${correlationId}]`);
    const createMarketplaceItemRequest: CreateMarketplaceItemRequest = req.body;
    const createMarketplaceItemResponse = await createMarketplaceItem(createMarketplaceItemRequest, correlationId, correlationTimestamp);
    res.json(createMarketplaceItemResponse);
  } catch (error) {
    console.error(`ERROR [${correlationId}]: ${error}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});

app.post('/user/gxp/add', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/user/gxp/add ${JSON.stringify(req.body)} [${correlationId}]`);
    const addGxpRequest: AddGxpRequest = req.body;
    const addGxpResponse = await addUserGxp(addGxpRequest, correlationId, correlationTimestamp);
    res.json(addGxpResponse);
  } catch (error: any) {
    console.error(`ERROR [${correlationId}]: ${JSON.stringify(error)}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});

app.get('/user/gxp', async (req: Request, res: Response) => {
  const correlationId = uuidv4();
  try {
    console.log(`/user/gxp ${JSON.stringify(req.body)} [${correlationId}]`);
    const userId = parseInt(req.query.userId as string);
    const backendRequest: GetUserGxpBalanceRequest = { userId };
    const backendResponse = await getUserGxpBalance(backendRequest, correlationId);
    res.json(backendResponse);
  } catch (error: any) {
    console.error(`ERROR [${correlationId}]: ${JSON.stringify(error)}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});


app.post('/marketplace/item/buy', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/marketplace/item/buy ${JSON.stringify(req.body)} [${correlationId}]`);
    const buyItemRequest: BuyItemRequest = req.body;
    const buyItemResponse = await buyMarketplaceItem(buyItemRequest, correlationId, correlationTimestamp);
    res.json({ correlationId, buyItemResponse });
  } catch (error: any) {
    console.error(`ERROR [${correlationId}]: ${JSON.stringify(error)}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});

app.get('/user/', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/user/ ${JSON.stringify(req.body)} [${correlationId}]`);
    const users = await User.find();
    res.json({ users });
  } catch (error: any) {
    console.error(`ERROR [${correlationId}]: ${JSON.stringify(error)}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});


app.get('/user/item', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/user/item ${JSON.stringify(req.body)} [${correlationId}]`);
    const userItems = await UserItem.find();
    res.json({ userItems });
  } catch (error: any) {
    console.error(`ERROR [${correlationId}]: ${JSON.stringify(error)}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});

app.post('/user/item/create', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/user/item/create ${JSON.stringify(req.body)} [${correlationId}]`);
    const createUserItemRequest: CreateUserItemRequest = req.body;
    const createUserItemResponse = await createUserItem(createUserItemRequest, correlationId, correlationTimestamp);
    res.json(createUserItemResponse);
  } catch (error) {
    console.error(`ERROR [${correlationId}]: ${error}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});


app.post('/user/create', async (req: Request, res: Response) => {
  const correlationTimestamp = new Date();
  const correlationId = uuidv4();
  try {
    console.log(`/user/create ${JSON.stringify(req.body)} [${correlationId}]`);
    const createUserRequest: CreateUserRequest = req.body;
    const createUserResponse = await createUser(createUserRequest, correlationId, correlationTimestamp);
    res.json(createUserResponse);
  } catch (error) {
    console.error(`ERROR [${correlationId}]: ${error}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});

app.get('/get-all', async (req: Request, res: Response) => {
  const correlationId = uuidv4();
  try {
    const getAllResponse = await getAll();
    res.json(getAllResponse);
  } catch (error) {
    console.error(`ERROR [${correlationId}]: ${error}`);
    res.status(500).send({ message: `Error [${correlationId}]: ${JSON.stringify(error)}` });
  }
});

app.listen(MY_PORT, () => {
  console.log(`Backend running on port ${MY_PORT}`);
});


async function main() {
  try {
    console.log("Initializing database");
    await appDataSource.initialize();
    console.log("Database initialized");
  } catch (error) {
    console.error(error);
    throw error;
  }

}

main();
