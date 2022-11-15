import { app, BrowserWindow } from 'electron';
import "reflect-metadata";

import { initListeners as initListenersWindowsService} from './main/ipc/windows-service';
import { initListeners as initListenersWindowControls} from './main/ipc/window-controls';
import { initListeners as initListenersMediaService} from './main/ipc/medias-service';
import { initListeners as initListenersFolderService} from './main/ipc/folders-service';
import { initListeners as initListenersPlaylistService} from './main/ipc/playlists-service';
import { createWindow } from './main/main-window';
import path from 'path';
import { initDataSource } from './main/database';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    // eslint-disable-line global-require
    app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const binPath = path.join(__dirname, 'libs');
process.env.FFMPEG_PATH = path.join(binPath, "ffmpeg.exe");
process.env.FFPROBE_PATH = path.join(binPath, "ffprobe.exe");

initListenersWindowsService();
initListenersWindowControls();
initListenersMediaService();
initListenersFolderService();
initListenersPlaylistService();

(async () => {

    try {
        await initDataSource();
    }
    catch(err) {
        console.log(err);
    }
})();