import "reflect-metadata"
import { DataSource } from "typeorm"
import { GxpBalance } from "./entity/GxpBalance"
import { GxpTransaction } from "./entity/GxpTransaction"

export const appDataSource = new DataSource({
    type: "postgres",
    host: "gxp-db",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [GxpBalance, GxpTransaction],
    migrations: [],
    subscribers: [],
})
