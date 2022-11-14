import { WindowsService } from ".";
import { WindowElectronApi } from "../../preload-types";

export class ElectronWindowsService implements WindowsService {

    private electronApi: WindowElectronApi['electronApi'];

    constructor() {
        this.electronApi = (window as WindowElectronApi).electronApi;
    }

    getAccentColor(): Promise<string> {

        return this.electronApi.getAccentColor();
    }
 }