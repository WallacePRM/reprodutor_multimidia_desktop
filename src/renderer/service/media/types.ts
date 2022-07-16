export type Media = {
    id: number,
    type: string,
    name: string;
    author?: string;
    album?: string;
    genre?: string;
    thumbnail?: string,
    src: string,
    duration: number,
    isPlaying: boolean,
    releaseDate: string,
};

export type GetMediasOptions = {
    offSet: number,
    limit: number
};