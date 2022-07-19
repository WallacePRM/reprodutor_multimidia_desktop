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


    getMedias: (options: GetMediasOptions) => {

        return ipcRenderer.invoke('mediaService.getMedias', options);
    },
    insertMedias: (medias: MediaInfo[]): Promise<Media[]> => {

        return ipcRenderer.invoke('mediaService.insertMedias', medias);
    }
};

contextBridge.exposeInMainWorld("electronApi", electronApi);
