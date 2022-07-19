import { ipcMain } from "electron";
import { Media, MediaInfo } from "../../common/medias/types";
import { getKnex } from "../database";
import path from 'path';

export const initListeners = () => {

    ipcMain.handle('mediaService.getMedias', async (event, options) => {

        const knex = getKnex();

        const result = await knex.raw(`SELECT * FROM medias LIMIT ? OFFSET ?`,
        [ options.limit, options.offSet ]);

        return (result || []).map((x: any) => mapMedia(x));
    });

    ipcMain.handle('mediaService.insertMedias', async (event, medias: MediaInfo[]) => {

        const knex = getKnex();
        const transaction = await knex.transaction();

        try {

            let mediasCreated: Media[] = [];
            for (const mediaInfo of medias) {

                const media: Media = {
                    id: null,
                    src: mediaInfo.path,
                    name: path.basename(mediaInfo.path),
                    duration: 0,
                    releaseDate: new Date().toISOString(),
                    album: null,
                    genre: null,
                    author: null,
                    thumbnail: null,
                    type: 'music',
                };

                await knex.raw('INSERT INTO medias (name, type, author, album, genre, thumbnail, filename, duration, releaseDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [ media.name, media.type, media.author, media.album, media.genre, media.thumbnail, media.src, media.duration, media.releaseDate ]).transacting(transaction);

                const [lastRowId] = await knex.raw('SELECT last_insert_rowid() as id').transacting(transaction);

                media.id = lastRowId.id;

                mediasCreated.push(media);
            }

            await transaction.commit();
            return mediasCreated;
        }
        catch (error) {

            await transaction.rollback();
            throw error;
        }
    });

    const mapMedia = (media: any) => {
        const mediaMapped: Media = {
            id: media.id,
            src: 'file://' + media.filename,
            name: media.name,
            duration: media.duration,
            releaseDate: media.releaseDate,
            album: media.album,
            genre: media.genre,
            author: media.author,
            thumbnail: media.thumbnail ? 'file://' + media.thumbnail : null,
            type: media.type,
        };

        return mediaMapped;
    };
};