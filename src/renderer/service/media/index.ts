import { ApiMediaService } from "./api-media-service";
import { GetMediasOptions, Media } from "./types";

export interface MediaService {
    getMedias(options: GetMediasOptions): Promise<Media[]>;
    insertMedias(medias: Blob[]): Promise<Media[]>;
}

export function getMediaService (): MediaService {
    return new ApiMediaService();
}