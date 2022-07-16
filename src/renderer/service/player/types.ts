
export type LastMedia = {
    file_id?: number;
    duration?: number;
    currentTime?: number;
    first_load?: boolean;
};

export type PlayerConfig = {
    volume?: number;
    shuffle?: boolean;
    repeatMode?: string | boolean;
    playbackRate?: number;
};