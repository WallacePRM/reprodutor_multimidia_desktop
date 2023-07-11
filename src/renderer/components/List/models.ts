import { Playlist } from "../../../common/playlists/types";
import { Media } from "../../../common/medias/types";

interface FileProps {
    className?: string,
    noSelect?: boolean,
    onPlay: (file: Media) => void,
    onSelectMedia: (file: Media) => void,
    onRemove?: (file: Media) => void
};

export interface GridItemFileProps extends FileProps {
    file: Media & {
        selected?: boolean
    }
};

export interface LineItemFileProps extends FileProps {
    file: Media,
    fileTypeVisible?: boolean
};

export interface GenericItemProps {
    noSelect?: boolean,
    item: GenericItemData,
    className?: string,
    onSelectMedia: (item: GenericItemData) => void,
    onPlay: (item: GenericItemData) => void,
    onRemove?: (item: GenericItemData) => void,
};

export interface GenericItemData {
    id: number,
    selected?: boolean,
    thumbnails: React.ReactNode[],
    thumbnailType: 'img' | 'icon',
    title: string,
    description?: string,
    media?: Media | Playlist,
};