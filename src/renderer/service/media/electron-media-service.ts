import { MediaInfo, GetMediasOptions, Media, isMediaBlob } from "../../../common/medias/types";
import { MediaService } from ".";
import { WindowElectronApi } from "../../preload-types";
import { electron } from "process";

export class ElectronMediaService implements MediaService {

    private electronApi: WindowElectronApi['electronApi'];

    constructor() {
        this.electronApi = (window as WindowElectronApi).electronApi;
    }

    getMedias(options: GetMediasOptions): Promise<Media[]> {

        return this.electronApi.getMedias(options);
    }

    insertMedias(medias: Blob[] | MediaInfo[]): Promise<Media[]> {

        if (isMediaBlob(medias)) {

            throw new Error("Invalid medias type");
        }

        return this.electronApi.insertMedias(medias);
    }

    deleteMedias(medias: Media[]): Promise<void> {

        return this.electronApi.deleteMedias(medias);
    }
 }