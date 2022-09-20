import React from 'react';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Playlist } from '../../../../common/playlists/types';
import GenericGridItem, { GenericItemData } from '../../../components/List/GenericGridItem';

import { FiSpeaker } from 'react-icons/fi';

function PlaylistItem(props: PlaylistItemProps) {

    const { playlist, className, onClick } = props;

    const medias = playlist.medias.slice(0 , 4).map(m => m.thumbnail);

    if (medias.length < 4) {
        for (let i = medias.length; i < 4; i++) {
            medias.push(null);
        }
    }

    const thumbnails = (
    <div className="h-100 w-100" style={{display: 'grid', gridTemplateColumns: `repeat(2, 1fr)`, gridAutoRows: '1fr', overflow: 'hidden'}}>{
        medias.map((thumbnail, index) => thumbnail ? <LazyLoadImage key={index} style={{borderRadius: 0}} src={thumbnail}/> : <div></div>)}
    </div>);

    const icon = <div className="c-grid-list__item__icon">
        <FiSpeaker className='icon-color--light' />
    </div>;


    const item: GenericItemData = {
        id: playlist.id,
        description: playlist.medias.length + (playlist.medias.length > 1 ? ' itens' : ' item'),
        thumbnails: [playlist.medias.length === 0 ? icon : thumbnails],
        thumbnailType: 'img',
        media: playlist,
        title: playlist.name,
    };

    return (
        <GenericGridItem
        className={className ? className : ''}
        item={item}
        onClick={item => onClick(item.media as Playlist)} />
    )
}

type PlaylistItemProps = {
    playlist: Playlist,
    className?: string,
    onClick: (item: Playlist) => void,
};


export default PlaylistItem;