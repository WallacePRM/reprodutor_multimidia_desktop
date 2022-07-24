import { WindowElectronApi } from "../../../renderer/preload-types";
import { Folder } from "../../../common/folders/type";
import { FolderService } from ".";

export class ElectronFolderService implements FolderService {

    private electronApi: WindowElectronApi['electronApi'];

    constructor() {
        this.electronApi = (window as WindowElectronApi).electronApi;
    }

    getFolders(): Promise<Folder[]> {

        return this.electronApi.getFolders();
    };

    insertFolder(folder: Folder): Promise<Folder> {

        return this.electronApi.insertFolder(folder);
    };

    deleteFolder(folder: Folder): Promise<void> {

        return this.electronApi.deleteFolder(folder);
    };
};