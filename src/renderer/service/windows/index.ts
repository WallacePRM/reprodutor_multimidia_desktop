import { ElectronWindowsService } from "./electron-windows-service";

export interface WindowsService {
    getAccentColor(): Promise<string>;
}

export function getWindowsService (): WindowsService {
    return new ElectronWindowsService();
}