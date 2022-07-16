import { ipcMain } from "electron";
import { mainWindow } from "../main-window";

export const initListeners = () => {

    ipcMain.handle('window.minimize', () => {

        mainWindow.minimize();
    });

    ipcMain.handle('window.maximize', () => {

        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        }
        else {
            mainWindow.maximize();
        }
    });

    ipcMain.handle('window.close', () => {

        mainWindow.close();
    });
};