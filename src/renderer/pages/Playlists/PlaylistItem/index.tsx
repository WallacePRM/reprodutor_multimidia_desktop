import React from 'react';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Playlist } from '../../../../common/playlists/types';
import GenericGridItem, { GenericItemData } from '../../../components/List/GenericGridItem';

import { FiSpeaker } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { GroupInfo } from '../../GroupInfo';
import { setGroupInfo } from '../../../store/groupInfo';
import { useDispatch } from 'react-redux';
import { getGroupInfoService } from '../../../service/groupInfo';
import { useSelector } from 'react-redux';
import { selectPlayerConfig } from '../../../store/playerConfig';
import { shuffle } from '../../../common/array';
import { setCurrentMedias } from '../../../store/player';
import { getPlayerService } from '../../../service/player';
import { selectMediaPlaying, setMediaPlaying } from '../../../store/mediaPlaying';
import { getPlaylistService } from '../../../service/playlist';
import { deletePlaylist } from '../../../store/playlists';
import pageConfig, { selectPageConfig } from '../../../store/pageConfig';

function PlaylistItem(props: PlaylistItemProps) {

    const { playlist, className } = props;

    const medias = playlist.medias.slice(0 , 4).map(m => m.thumbnail);
    const playerConfig = useSelector(selectPlayerConfig);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const pageConfig = useSelector(selectPageConfig);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (medias.length < 4 && medias.length > 1) {
        for (let i = medias.length; i < 4; i++) {
            medias.push(null);
        }
    }

    const thumbnails = (
    <div className="h-100 w-100" style={{display: medias.length > 1 ? 'grid' : 'flex', gridTemplateColumns: `repeat(2, 1fr)`, gridAutoRows: '1fr', overflow: 'hidden'}}>{
        medias.map((thumbnail, index) => thumbnail ? <LazyLoadImage key={index} style={{borderRadius: 0}} src={thumbnail}/> : <div></div>)}
    </div>);

    const icon = <div className="c-grid-list__item__icon">
        <FiSpeaker className='icon-color--light' />
    </div>;

    const handleSelectPlaylist = async () => {

        await getGroupInfoService().setGroupInfo(playlist);
        dispatch(setGroupInfo(playlist));

        navigate('/group-info');
    };

    const handlePlayPlaylist = async () => {

        let medias = playlist.medias;

        if (playerConfig.shuffle) {
            medias = shuffle(playlist.medias);
        }

        dispatch(setCurrentMedias(medias));
        await getPlayerService().setLastMedia({current_medias: medias});

        if (mediaPlaying?.id !== medias[0].id) {
            dispatch(setMediaPlaying(medias[0]));
        }
        else {
            dispatch(setMediaPlaying(null));
            setTimeout(() => dispatch(setMediaPlaying(medias[0])), 0);
        }
    };

    const handleDeletePlaylist = async () => {

        try {

            const playlistService = getPlaylistService();
            await playlistService.deletePlaylist({id: playlist.id});

            dispatch(deletePlaylist({id: playlist.id}));
        }
        catch(error) {

            console.error(error);
            alert('Falha ao remover item');
        }
    };

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

type PlaylistItemProps = {
    playlist: Playlist,
    className?: string,
};


export default PlaylistItem;