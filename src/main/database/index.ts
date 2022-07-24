import { app } from "electron";
import knex, { Knex } from 'knex';
import path from 'path';

let knexInstance: Knex = null;
export const getKnex = () => {

    if (knexInstance) return knexInstance;

    const dbPath = path.join(app.getPath('userData'), 'db.sqlite');
    knexInstance = knex({
        client: 'better-sqlite3',
        connection: {
            filename: dbPath
        }
    });

    return knexInstance;
};

export const createTablesOnce = async () => {

    await createMediasTableOnce();
    await createFoldersTableOnce();
};

const createMediasTableOnce = async () => {

    const knex = getKnex();

    try {
        await knex.raw(`SELECT 1 from medias LIMIT 1`);
        return;
    }
    catch {}

    await knex.raw(`CREATE TABLE medias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        author TEXT,
        album TEXT,
        genre TEXT,
        thumbnail TEXT,
        filename TEXT NOT NULL,
        duration INTEGER,
        releaseDate TEXT
    )`);
};

const createFoldersTableOnce = async () => {

    const knex = getKnex();

    try {
        await knex.raw(`SELECT 1 from folders LIMIT 1`);
        return;
    }
    catch {}

    await knex.raw(`CREATE TABLE folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        type TEXT NOT NULL
    )`);
};