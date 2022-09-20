import { ipcMain } from "electron";
import { stringify } from "querystring";
import { Media } from "../../common/medias/types";
import { Playlist } from "../../common/playlists/types";
import { AppDataSource } from "../database";
import { Media as MediaDb } from "../database/entities/media";
import { Playlist as PlaylistDb } from "../database/entities/playlist";

export const initListeners = () => {

    ipcMain.handle('playlistService.getPlaylists', async (event) => {

        const repository = AppDataSource.getRepository(PlaylistDb);

        const playlists = await repository.find({
            relations: {
                medias: true,
            }
        });

        const playlistMapped = playlists.map(p => mapPlaylist(p));
        const names: Record<string, number> = {};
        for (let i = 0; i < playlistMapped.length; i++) {

            let nameCount = names[playlistMapped[i].name];
            names[playlistMapped[i].name] = nameCount === undefined ? 1 : ++nameCount;

            if (nameCount > 1) {
                playlistMapped[i].name =  playlistMapped[i].name + ` (${nameCount})`;
            }
        }

        return playlistMapped;
    });

    ipcMain.handle('playlistService.insertPlaylist', async (event, playlist: Playlist) => {

        const repository = AppDataSource.getRepository(PlaylistDb);

        const playlistCreated = await repository.save({
            name: playlist.name,
            modificationDate: new Date(playlist.modificationDate),
            medias: playlist.medias.map((media) => ({id: media.id}))
        });

        const count = await repository.createQueryBuilder()
        .where('LOWER(name) = LOWER(:name)', { name: playlist.name })
        .getCount();

        if (count > 1) {

            playlistCreated.name = `${playlistCreated.name} (${count})`;
        }

        return mapPlaylist(playlistCreated);
    });

    ipcMain.handle('playlistService.putPlaylist', async (event, playlist: Playlist) => {

        const repository = AppDataSource.getRepository(PlaylistDb);

        const playlistDb = (await repository.find({
            relations: {
                medias: true,
            },
            where: {
                id: playlist.id
            }
        }))[0];

        playlistDb.modificationDate = new Date(playlist.modificationDate || playlistDb.modificationDate);
        playlistDb.medias = playlistDb.medias.concat(playlist.medias.map((media) => ({id: media.id} as any)));

        await repository.save(playlistDb);
    });

    ipcMain.handle('playlistService.deletePlaylist', async (event, playlist: Omit<Playlist, 'name'>) => {

        const repository = AppDataSource.getRepository(PlaylistDb);

        if (playlist.medias && playlist.medias.length > 0) {

            const playlistDb = await repository.findOneBy({
                id: playlist.id
            });

            for (const media of playlistDb.medias) {

                const mediaIndex = playlist.medias.findIndex((x) => x.id === media.id);
                if (mediaIndex !== -1) {

                    playlistDb.medias.splice(mediaIndex, 1);
                }
            }

            await repository.save(playlistDb);
        }
        else {
            await repository.delete(playlist.id);
        }
    });
};

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

const mapPlaylist = (playlistDb: PlaylistDb) => {

    const playlistMapped: Playlist = {
        id: playlistDb.id,
        name: playlistDb.name,
        modificationDate: playlistDb.modificationDate?.toISOString(),
        medias: playlistDb.medias.map(m => mapMedia(m)),
    };

    return playlistMapped;
};
