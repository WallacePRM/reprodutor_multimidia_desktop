import { ipcMain, systemPreferences } from "electron";

export const initListeners = () => {

    ipcMain.handle('windowsService.getAccentColor', (event) => {

        const accentColor = systemPreferences.getAccentColor();

        return accentColor;
    });
};