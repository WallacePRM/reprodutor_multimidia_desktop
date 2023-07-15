import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Playlist } from '../../../../common/playlists/types';
import GenericGridItem from '../../../components/List/GenericGridItem';
import { FiSpeaker } from 'react-icons/fi';
import { GenericItemData } from '../../../components/List/models';
import usePlaylistITem from '../../../components/Playlists/PlaylistItem/hook';

export default function PlaylistItem(props: PlaylistItemProps) {

    const { playlist, medias, className, pageConfig, handleSelectPlaylist, handlePlayPlaylist, handleDeletePlaylist } = usePlaylistITem(props);

    const thumbnails = (
    <div className="h-100 w-100" style={{display: medias.length > 1 ? 'grid' : 'flex', gridTemplateColumns: `repeat(2, 1fr)`, gridAutoRows: '1fr', overflow: 'hidden'}}>{
        medias.map((thumbnail, index) => thumbnail ? <LazyLoadImage key={index} style={{borderRadius: 0}} src={thumbnail}/> : <div></div>)}
    </div>);

    const icon = <div className="c-grid-list__item__icon">
        <FiSpeaker className='icon-color--light' />
    </div>;

    const item: GenericItemData = {
        id: playlist.id,
        description: playlist.medias.length + (playlist.medias.length > 1 ? ' itens' : ' item'),
        thumbnails: [playlist.medias.length === 0 || !pageConfig.mediaArt ? icon : thumbnails],
        thumbnailType: 'img',
        media: playlist,
        title: playlist.name,
    };


    return (
        <GenericGridItem
        className={className ? className : ''}
        item={item}
        key={item.id}
        onSelectMedia={handleSelectPlaylist}
        onPlay={handlePlayPlaylist}
        onRemove={handleDeletePlaylist}
        />
    )
}

export interface PlaylistItemProps {
    playlist: Playlist,
    className?: string,
};