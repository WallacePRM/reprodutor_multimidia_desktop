// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
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
    }
};

contextBridge.exposeInMainWorld("electronApi", electronApi);
