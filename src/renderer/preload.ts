// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { windowElectronApi } from "./preload-types";

const electronApi: windowElectronApi['electronApi'] = {

    closeWindow: () => {

        return ipcRenderer.invoke("window.close");
    },
    minimizeWindow: () => {

        return ipcRenderer.invoke("window.minimize");
    },
    maximizeWindow: () => {

        return ipcRenderer.invoke("window.maximize");
    },
};

contextBridge.exposeInMainWorld("electronApi", electronApi);
