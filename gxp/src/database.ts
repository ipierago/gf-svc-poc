import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { GxpBalance } from './entity/GxpBalance';
import { GxpTransaction } from './entity/GxpTransaction';
import {
  TransactionOutbox,
  initTransactionOutboxSub,
} from '@gf-svc-poc/shared';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'gxp-db',
  port: 5432,
  username: 'test',
  password: 'test',
  database: 'test',
  synchronize: true,
  logging: false,
  entities: [GxpBalance, GxpTransaction, TransactionOutbox],
  migrations: [],
  subscribers: [],
});

export const initDatabase = async () => {
  await AppDataSource.initialize();
  //await initTransactionOutboxSub(dataSource);
};
