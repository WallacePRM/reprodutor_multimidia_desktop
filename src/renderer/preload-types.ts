import { Media, GetMediasOptions, MediaInfo } from "../common/medias/types";

export type WindowElectronApi = Window & typeof globalThis & {
    electronApi: {
        closeWindow: () => Promise<void>;
        minimizeWindow: () => Promise<void>;
        maximizeWindow: () => Promise<void>;
        isMaximize: () => Promise<boolean>;
        getMedias: (options: GetMediasOptions) => Promise<Media[]>;
        insertMedias: (medias: MediaInfo[]) => Promise<Media[]>;
        deleteMedias: (medias: Media[]) => Promise<void>;
    }
};