// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Playlist } from "../common/playlists/types";
import { Folder } from "../common/folders/type";
import { GetMediasOptions, Media, MediaInfo } from "../common/medias/types";
import { WindowElectronApi } from "./preload-types";

const electronApi: WindowElectronApi['electronApi'] = {

    closeWindow: () => {

        return ipcRenderer.invoke("window.close");
    },
    minimizeWindow: () => {

        return ipcRenderer.invoke("window.minimize");
    },
    maximizeWindow: () => {

        return ipcRenderer.invoke("window.maximize");
    },
    isMaximize: () => {

        return ipcRenderer.invoke("window.isMaximize");
    },

    getMedias: (options: GetMediasOptions) => {

        return ipcRenderer.invoke('mediaService.getMedias', options);
    },
    insertMedias: (medias: MediaInfo[]): Promise<Media[]> => {

        return ipcRenderer.invoke('mediaService.insertMedias', medias);
    },
    deleteMedias: (medias: Media[]): Promise<void> => {
        return ipcRenderer.invoke('mediaService.deleteMedias', medias);
    },

    getPlaylists: () => {

        return ipcRenderer.invoke('playlistService.getPlaylists');
    },
    insertPlaylist: (playlist: Playlist) => {

        return ipcRenderer.invoke('playlistService.insertPlaylist', playlist);
    },
    putPlaylist: (playlist: Playlist) => {

        return ipcRenderer.invoke('playlistService.putPlaylist', playlist);
    },
    deletePlaylist: (playlist: Omit<Playlist, 'name'>): Promise<void> => {

        return ipcRenderer.invoke('playlistService.deletePlaylist', playlist);
    },

    getFolders(): Promise<Folder[]> {

        return ipcRenderer.invoke('folderService.getFolders');
    },

    insertFolder(folder: Folder): Promise<Folder> {

        return ipcRenderer.invoke('folderService.insertFolder', folder);
    },

    deleteFolder(folder: Folder): Promise<void> {

        return ipcRenderer.invoke('folderService.deleteFolder', folder);
    },

    getAccentColor(): Promise<string> {

        return ipcRenderer.invoke('windowsService.getAccentColor');
    }
};

contextBridge.exposeInMainWorld("electronApi", electronApi);
