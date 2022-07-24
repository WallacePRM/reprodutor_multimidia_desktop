import { ipcMain } from "electron";
import { Folder } from "../../common/folders/type";
import { getKnex } from "../database";
import fs from "fs";

export const initListeners = () => {

    ipcMain.handle('folderService.getFolders', async () => {

        const knex = getKnex();

        const result = await knex.raw(`SELECT * FROM folders`);
        return (result || []).map((x: any) => mapFolder(x));
    });

    ipcMain.handle('folderService.insertFolder', async (event, folder: Folder) => {

        const knex = getKnex();

        const transaction = await knex.transaction();

        try {

            let result = await transaction.raw(`SELECT * FROM folders WHERE path = ?`, [folder.path]);
            if (result.length > 0) {
                return result[0];
            }

            result = await knex.raw('INSERT INTO folders (path, type) VALUES (?, ?)',
            [ folder.path, folder.type ]).transacting(transaction);

            const [folderLastId] = await knex.raw('SELECT last_insert_rowid() as id').transacting(transaction);
            folder.id = folderLastId.id;

            await transaction.commit();

            return folder;
        }
        catch (error) {

            await transaction.rollback();
            throw error;
        }
    });

    ipcMain.handle('folderService.deleteFolder', async (event, folder: Folder) => {

        const knex = getKnex();

        const medias = await knex.raw(`SELECT id, thumbnail FROM medias WHERE filename LIKE '${folder.path}%'`);

        const transaction = await knex.transaction();
        try {

            await knex.raw(`DELETE FROM medias WHERE id IN (${medias.map(() => '?').join(', ')})`, medias.map((x: any) => x.id)).transacting(transaction);

            await knex.raw('DELETE FROM folders WHERE id = ?', [ folder.id ]).transacting(transaction);

            await transaction.commit();
        }
        catch (error) {

            await transaction.rollback();
            throw error;
        }

        for (let media of medias) {

            if (fs.existsSync(media.thumbnail)) {
                fs.rmSync(media.thumbnail);
            }
        }
    });
};

const mapFolder = (folder: any) => {

    const folderMaped: Folder = {
        id: folder.id,
        path: folder.path,
        type: folder.type,
    };

    return folderMaped;
};