import { Playlist } from "../../../common/playlists/types";
import { ElectronPlaylistService } from "./electron-playlist-service";

export interface PlaylistService {
    getPlaylists(): Promise<Playlist[]>;
    insertPlaylist(playlist: Omit<Playlist, 'id'>): Promise<Playlist>;
    putPlaylist: (playlist: Playlist) => Promise<void>;
    deletePlaylist(playlist: Pick<Playlist, 'id'>): Promise<void>;
}

export function getPlaylistService (): PlaylistService {
    return new ElectronPlaylistService();
}