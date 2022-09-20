import { PlaylistService } from ".";
import { WindowElectronApi } from "../../preload-types";
import { electron } from "process";
import { Playlist } from "../../../common/playlists/types";

export class ElectronPlaylistService implements PlaylistService {

    private electronApi: WindowElectronApi['electronApi'];

    constructor() {
        this.electronApi = (window as WindowElectronApi).electronApi;
    }

    getPlaylists(): Promise<Playlist[]> {

        return this.electronApi.getPlaylists();
    }

    insertPlaylist(playlist: Playlist): Promise<Playlist> {

        return this.electronApi.insertPlaylist(playlist);
    }

    deletePlaylist(playlist: Pick<Playlist, 'id'>): Promise<void> {

        return this.electronApi.deletePlaylist(playlist);
    }

    putPlaylist(playlist: Playlist): Promise<void> {

        return this.electronApi.putPlaylist(playlist);
    }
}