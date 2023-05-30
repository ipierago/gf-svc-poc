import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserEvent } from "./entity/UserEvent"

export const appDataSource = new DataSource({
    type: "postgres",
    host: "eventlog-db",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [UserEvent],
    migrations: [],
    subscribers: [],
})
