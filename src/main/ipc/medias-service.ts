import { ipcMain } from "electron";
import { getKnex } from "../database";
import { Media, MediaInfo } from "../../common/medias/types";

import { app } from 'electron';
import musicMetadata from "music-metadata";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from 'path';
import { spawn } from "child_process";

export const initListeners = () => {

    ipcMain.handle('mediaService.getMedias', async (event, options) => {

        const knex = getKnex();

        const result = await knex.raw(`SELECT * FROM medias LIMIT ? OFFSET ?`,
        [ options.limit, options.offSet ]);

        return (result || []).map((x: any) => mapMedia(x));
    });

    ipcMain.handle('mediaService.insertMedias', async (event, medias: MediaInfo[]) => {

        let mediasCreated: Media[] = [];

        for (const mediaInfo of medias) {

            const mediaType = mapMediaType(path.extname(mediaInfo.path));
            if (mediaType === null) {
                continue;
            };

            const mediaMetadata = await getMediaMetadata(mediaInfo.path);
            const media: Media = {
                id: null,
                src: mediaInfo.path,
                name: path.basename(mediaInfo.path),
                duration: mediaMetadata.duration,
                releaseDate: new Date().toISOString(),
                album: mediaMetadata.album,
                genre: null,
                author: mediaMetadata.artist,
                thumbnail: mediaMetadata.thumbnailPath,
                type: mediaType,
            };

            mediasCreated.push(media);
        }

        const knex = getKnex();
        const transaction = await knex.transaction();
        try {

            for (const media of mediasCreated) {

                await knex.raw('INSERT INTO medias (name, type, author, album, genre, thumbnail, filename, duration, releaseDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [ media.name, media.type, media.author, media.album, media.genre, media.thumbnail, media.src, media.duration, media.releaseDate ]).transacting(transaction);

                const [lastRowId] = await knex.raw('SELECT last_insert_rowid() as id').transacting(transaction);

                media.id = lastRowId.id;
            }

            await transaction.commit();

            return mediasCreated;
        }
        catch (error) {

            await transaction.rollback();
            throw error;
        }
    });

    ipcMain.handle('mediaService.deleteMedias', async (event, medias: Media[]) => {

        const knex = getKnex();
        const transaction = await knex.transaction();

        const mediasId = medias.map(m => m.id);

        try {
            const result = await knex.raw(`SELECT thumbnail FROM medias WHERE id in (${mediasId.map(x => '?').join(', ')})`, mediasId).transacting(transaction);

            for (let media of medias) {

                await knex.raw('DELETE FROM medias WHERE id = ?', [ media.id ]).transacting(transaction);
            }

            await transaction.commit();

            for (let media of result) {

                fs.rmSync(media.thumbnail);
            }
        }
        catch(error) {

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
            releaseDate: new Date(media.releaseDate).getFullYear().toString(),
            album: media.album,
            genre: media.genre,
            author: media.author,
            thumbnail: media.thumbnail ? 'file://' + media.thumbnail : null,
            type: media.type,
        };

        return mediaMapped;
    };

    const mapMediaType = (ext: string) => {

        ext = ext.replace('.', '');
        const mediaType: Record<string, string> = {
            "mp3": 'music',
            "mp4": 'video',
        };

        if (mediaType[ext]) {
            return mediaType[ext];
        }

        return null;
    };

    const getMediaMetadata = async (filePath: string) => {

        const meta = await musicMetadata.parseFile(filePath, { duration: true });
        let imageName = null;
        let imagePath = null;

        if (meta.common?.picture?.at(0)?.data) {

            imageName = getThumbnailNameFromFilepPath(path.basename(filePath));

            const folder = getThumbnailsPath();
            imagePath = path.join(getThumbnailsPath(), imageName);

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }

            fs.writeFileSync(imagePath, meta.common.picture.at(0).data);
        }

        if (mapMediaType(path.extname(filePath)) === 'video') {

            imageName = getThumbnailNameFromFilepPath(path.basename(filePath));
            const folder = getThumbnailsPath();

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder);
            }

            await createVideoThumbnail({filePath, imageName, folder});
            imagePath = path.join(getThumbnailsPath(), imageName);
        }

        const metadata = {
            title: meta.common?.title ?? null,
            artist: meta.common?.artist ?? null,
            album: meta.common?.album ?? null,
            thumbnailPath: imagePath ?? null,
            duration: meta.format?.duration ?? null,
        };

        return metadata;
    };

    const getThumbnailNameFromFilepPath = (filename: string) => {

        let imageName = filename.replace(path.extname(filename), '');
        imageName = imageName + '.artwork.jpg';

        return imageName;
    };

    const getThumbnailsPath = () => {

        return path.join(app.getPath('userData'), 'thumbnails');
    };

    // const createVideoThumbnail = (data: {filePath: string, imageName: string, folder: string}) => {

    //     const { filePath, imageName, folder } = data;

    //     return new Promise<void>((resolve, reject) => {
    //         const command = ffmpeg(filePath).takeScreenshots({
    //             timemarks: ['5%'],
    //             filename: imageName,
    //             fastSeek: true,
    //         }, folder);

    //         command.on('end', () => {
    //             resolve();
    //         });
    //         command.on('error', (error) => {
    //             reject(error);
    //         });
    //     });
    // };

    const createVideoThumbnail = (data: {filePath: string, imageName: string, folder: string}) => {

        // $"-ss {startTimeAt} -i \"{filePath}\" -f image2 -vframes 1 -y \"{picturePath}\""
        // run ffmpeg extract image

        const { filePath, imageName, folder } = data;
        const picturePath = path.join(folder, imageName);

        return new Promise<void>((resolve, reject) => {
            const command = spawn(process.env.FFMPEG_PATH, [
                '-ss', '00:00:00',
                '-i', `${filePath}`,
                '-f', 'image2',
                '-vframes', '1',
                '-y', `${picturePath}`,
            ]);

            command.on('close', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(`ffmpeg exited with code ${code}`);
                }
            });

            command.on('error', (error) => {
                console.log(error);
            });

            command.stdout.on('data', (message) => {
                console.log(message.toString());
            });
            command.stderr.on('data', (message) => {
                console.log(message.toString());
            });
        });
    };
};