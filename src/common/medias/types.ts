export type Media = {
    id: number,
    type: string,
    name: string;
    author?: string;
    album?: string;
    genre?: string;
    thumbnail?: string,
    isPlaying?: boolean,
    src: string,
    duration: number,
    releaseDate: string,
};

export type MediaInfo = {
    path: string,
};

export type GetMediasOptions = {
    offSet: number,
    limit: number
};

export function isMediaBlob(media: Blob[] | MediaInfo[]): media is Blob[] {
    return Array.isArray(media) && media[0] instanceof Blob;
};