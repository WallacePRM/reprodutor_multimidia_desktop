import { app } from "electron";
import path from 'path';
import { DataSource } from "typeorm";
import { Folder } from "./entities/folder";
import { Media } from "./entities/media";



export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: path.join(app.getPath('userData'), 'db.sqlite'),
    synchronize: true,
    logging: true,
    entities: [Media, Folder],
    subscribers: [],
    migrations: [],
});


export const initDataSource = async () => {

    await AppDataSource.initialize();
};