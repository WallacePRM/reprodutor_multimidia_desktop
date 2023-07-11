import React from 'react';
import SelectBlock from '..';
import { Playlist } from '../../../../common/playlists/types';
import useSelectBlockPlaylist from './hook';

export default function SelectBlockPlaylist(props: SelectBlockPlaylistProps) {

    const { listItems, handlePlaySelectedItems, handleSetNextMedias, handleSetMediasOnPlaylist, handleDeletePlaylistsSelected } = useSelectBlockPlaylist(props);

    return (
        <>
            <SelectBlock
            list={listItems}
            onPlay={handlePlaySelectedItems}
            onSetNext={handleSetNextMedias}
            onSetInPlaylist={handleSetMediasOnPlaylist}
            onRemove={handleDeletePlaylistsSelected}/>
        </>
    );
}

export interface SelectBlockPlaylistProps {
    listItems: Playlist[];
};