import { MediaInfo } from "../../../common/medias/types";

export const extractFilesInfo = (files: File[]) => {

    const filesInfo: MediaInfo[] = files.map(file => ({
        path: file.path,
    }));

    return filesInfo;
};