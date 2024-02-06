import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Item } from './entity/Item';
import { UserItem } from './entity/UserItem';
import { MarketplaceItem } from './entity/MarketplaceItem';
import {
  TransactionOutbox,
  initTransactionOutboxPub,
} from '@gf-svc-poc/shared';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'backend-db',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [User, Item, UserItem, MarketplaceItem, TransactionOutbox],
  migrations: [],
  subscribers: [],
});

export const initDatabase = async () => {
  await AppDataSource.initialize();
  //await initTransactionOutboxPub(dataSource);
};
