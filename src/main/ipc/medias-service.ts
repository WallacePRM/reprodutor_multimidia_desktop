import { ipcMain } from "electron";
import { AppDataSource } from "../database";
import { Media as MediaDb } from "../database/entities/media";
import { GetMediasOptions, Media, MediaInfo } from "../../common/medias/types";

import { app } from 'electron';
import musicMetadata from "music-metadata";
import fs from "fs";
import path from 'path';
import { spawn } from "child_process";
import { Like } from "typeorm";

export const initListeners = () => {

    ipcMain.handle('mediaService.getMedias', async (event, options: GetMediasOptions) => {

        const result = await AppDataSource.getRepository(MediaDb).find({
            take: options.limit,
            skip: options.offSet,
            where: options.filter ? {
                name: options.filter.name ? Like(`%${options.filter.name}%`) : undefined,
                type: options.filter.type ?  options.filter.type : undefined,
            } : undefined,
        });

        return (result || []).map(x => mapMedia(x));
    });

    ipcMain.handle('mediaService.insertMedias', async (event, medias: MediaInfo[]) => {

        let mediasCreated: MediaDb[] = [];

        for (const mediaInfo of medias) {

            const mediaType = mapMediaType(path.extname(mediaInfo.path));
            if (mediaType === null) {
                continue;
            };

            const mediaMetadata = await getMediaMetadata(mediaInfo.path);
            const media: MediaDb = {
                id: null,
                filename: mediaInfo.path,
                name: getNameFromPath(mediaInfo.path),
                duration: mediaMetadata.duration,
                releaseDate: new Date(),
                album: mediaMetadata.album,
                genre: null,
                author: mediaMetadata.artist,
                thumbnail: mediaMetadata.thumbnailPath,
                type: mediaType,
            };

            mediasCreated.push(media);
        }

        await AppDataSource.transaction(async (transaction) => {

            await transaction.createQueryBuilder().
            insert()
            .into(MediaDb)
            .values(mediasCreated)
            .execute()
        });

        return mediasCreated.map(x => mapMedia(x));
    });

    ipcMain.handle('mediaService.deleteMedias', async (event, medias: Media[]) => {

        const result = await AppDataSource.manager.createQueryBuilder(MediaDb, 'medias')
        .where('medias.id IN (:...ids)', { ids: medias.map(x => x.id) })
        .select('medias.thumbnail')
        .getMany();

        await AppDataSource.transaction(async (transaction) => {

            await transaction.createQueryBuilder(MediaDb, 'medias')
            .where('medias.id IN (:...ids)', { ids: medias.map(x => x.id) })
            .delete()
            .execute();
        });

        for (let media of result) {

            fs.rmSync(media.thumbnail);
        }
    });

    const mapMedia = (media: MediaDb) => {
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

    const getNameFromPath = (fileName: string) => {

        let name = path.basename(fileName);
        name = name.replace(path.extname(name), '');

        return name;
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