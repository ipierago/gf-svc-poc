import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Item } from './entity/Item';
import { UserItem } from './entity/UserItem';
import { MarketplaceItem } from "./entity/MarketplaceItem";

export const appDataSource = new DataSource({
    type: "postgres",
    host: "backend-postgres",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Item, UserItem, MarketplaceItem],
    migrations: [],
    subscribers: [],
})
