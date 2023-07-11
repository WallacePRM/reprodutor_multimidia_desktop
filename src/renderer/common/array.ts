import { Media } from "../../common/medias/types";
import { Playlist } from "../../common/playlists/types";

export const sortAsc = (a: any, b: any) => {
    if (a > b) return 1;

    if (a < b) return -1;

    return 0;
};

export const sortDesc = (a: any, b: any) => {

    if (a > b) return -1;

    if (a < b) return 1;

    return 0;
};

export const shuffle = (array: any[]) => {

    return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const revertOrder = (array: any[]) => {

    return array.slice().reverse();
};

export const arrayUnshiftItem = (array: any[], index: number) => {

    const newArray = [...array];
    const element = newArray[index];
    newArray.splice(index, 1);
    newArray.unshift(element);
    return newArray;
};

export const distinct = <TItem>(array: TItem[], distinctBy: (item: TItem) => any) => {

    return array.reduce((obj, item) => {

        const id = distinctBy(item);
        if (!obj.index[id]) {

            obj.result.push(item);
            obj.index[id] = true;
        }

        return obj;
    }, {index: {} as any, result: []}).result;
};

export const isPlaylist = (item: Media | Playlist): item is Playlist => {

    return Array.isArray((item as Playlist).medias);
};

export const getAlphabetList = () => {

    return [ '&', '#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '...'];
};