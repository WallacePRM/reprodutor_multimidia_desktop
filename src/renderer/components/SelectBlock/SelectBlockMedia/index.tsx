import React from 'react';
import SelectBlock from '..';
import { Media } from '../../../../common/medias/types';
import useSelectBlockMedia from './hook';

export default function SelectBlockMedia(props: SelectBlockMediaProps) {

    const { listItems, handlePlaySelectedItems, handleDeleteMediasSelected, handleSetNextMedias, handleSetMediasOnPlaylist } = useSelectBlockMedia(props);

    return (
        <SelectBlock
        list={listItems}
        onPlay={handlePlaySelectedItems}
        onSetNext={handleSetNextMedias}
        onSetInPlaylist={handleSetMediasOnPlaylist}
        onRemove={location.pathname === '/group-info' ? handleDeleteMediasSelected : null}/>
    );
}

export interface SelectBlockMediaProps {
    listItems: Media[];
};