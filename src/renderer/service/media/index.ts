import { GetMediasOptions, Media, MediaInfo } from "../../../common/medias/types";
import { ElectronMediaService } from "./electron-media-service";

export interface MediaService {
    getMedias(options: GetMediasOptions): Promise<Media[]>;
    insertMedias(medias: Blob[]): Promise<Media[]>;
    insertMedias(medias: MediaInfo[]): Promise<Media[]>;
}

export function getMediaService (): MediaService {
    return new ElectronMediaService();
}