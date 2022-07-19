import { MediaInfo, GetMediasOptions, Media, isMediaBlob } from "../../../common/medias/types";
import { MediaService } from ".";
import { WindowElectronApi } from "../../preload-types";

export class ElectronMediaService implements MediaService {

    getMedias(options: GetMediasOptions): Promise<Media[]> {

        return (window as WindowElectronApi).electronApi.getMedias(options);
    }

    insertMedias(medias: Blob[] | MediaInfo[]): Promise<Media[]> {

        if (isMediaBlob(medias)) {

            throw new Error("Invalid medias type");
        }

        return (window as WindowElectronApi).electronApi.insertMedias(medias);
    }
}