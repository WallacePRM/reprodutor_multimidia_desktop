import { MediaInfo } from "../../../common/medias/types";

export const extractFilesInfo = (files: File[]) => {

    const filesInfo: MediaInfo[] = files.map(file => ({
        path: file.path,
    }));

    console.log(filesInfo);

    return filesInfo;
};