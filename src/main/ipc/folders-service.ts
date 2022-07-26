import { ipcMain } from "electron";
import {Like} from "typeorm";
import { Folder } from "../../common/folders/type";
import { AppDataSource } from "../database";
import { Media as MediaDb } from "../database/entities/media";
import { Folder as FolderDb } from "../database/entities/folder";
import fs from "fs";

export const initListeners = () => {

    ipcMain.handle('folderService.getFolders', async () => {

        const result = await AppDataSource.getRepository(FolderDb).find();

        return (result || []).map(x => mapFolder(x));
    });

    ipcMain.handle('folderService.insertFolder', async (event, folder: Folder) => {

        let result = await AppDataSource.getRepository(FolderDb).findOne({
            where: {
                path: folder.path,
            }
        });

        if (result) {
            return result;
        }

        const folderDb = new FolderDb();
        folderDb.path = folder.path;
        folderDb.type = folder.type;

        await AppDataSource.getRepository(FolderDb).insert(folderDb);

        return mapFolder(folderDb);
    });

    ipcMain.handle('folderService.deleteFolder', async (event, folder: Folder) => {

        const medias = await AppDataSource.getRepository(MediaDb).find({
            where: {
                filename: Like(`%${folder.path}%`),
            }
        });

        await AppDataSource.transaction(async (transaction) => {

            await transaction.createQueryBuilder(MediaDb, 'medias')
            .where('medias.id IN (:...ids)', { ids: medias.map(x => x.id) })
            .delete()
            .execute();

            await transaction.createQueryBuilder(FolderDb, 'folders')
            .where('folders.id = :id', { id: folder.id })
            .delete()
            .execute();
        });

        for (let media of medias) {

            if (fs.existsSync(media.thumbnail)) {
                fs.rmSync(media.thumbnail);
            }
        }
    });
};

const mapFolder = (folder: FolderDb) => {

    const folderMaped: Folder = {
        id: folder.id,
        path: folder.path,
        type: folder.type,
    };

    return folderMaped;
};