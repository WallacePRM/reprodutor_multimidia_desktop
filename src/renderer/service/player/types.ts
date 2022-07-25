import { Media } from "../../../common/medias/types";

export type LastMedia = {
    file_id?: number;
    duration?: number;
    currentTime?: number;
    first_load?: boolean;
    current_medias?: Media[] | null;
};

export type PlayerConfig = {
    volume?: number;
    shuffle?: boolean;
    repeatMode?: string | boolean;
    playbackRate?: number;
};