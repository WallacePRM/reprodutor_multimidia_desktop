import { app } from "electron";
import path from 'path';
import { DataSource } from "typeorm";
import { Folder } from "./entities/folder";
import { Media } from "./entities/media";
import { Playlist } from "./entities/playlist";

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: path.join(app.getPath('userData'), 'db.sqlite'),
    synchronize: true,
    logging: true,
    entities: [ Media, Folder, Playlist ],
    subscribers: [],
    migrations: [],
});

export const initDataSource = async () => {

    await AppDataSource.initialize();

    const result = await AppDataSource.getRepository(Playlist).find();
    console.log(result);
    console.log('\n\n\n\n\n');
};