import { Media } from "../medias/types";

export type Playlist = {
    id: number,
    name: string,
    modificationDate: string,
    medias: Media[]
};