import { Folder } from "../../../common/folders/type";
import { ElectronFolderService } from "./electron-folder-service";

export interface FolderService {
    getFolders(): Promise<Folder[]>;
    insertFolder(folder: Omit<Folder, 'id'>): Promise<Folder>;
    deleteFolder(folder: Folder): Promise<void>;
};

export const getFolderService = (): FolderService => {
    return new ElectronFolderService();
}
