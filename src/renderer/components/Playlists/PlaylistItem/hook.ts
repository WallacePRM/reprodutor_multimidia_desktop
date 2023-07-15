import React from 'react';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Playlist } from '../../../../common/playlists/types';
import GenericGridItem from '../../../components/List/GenericGridItem';
import { FiSpeaker } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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
import { selectPageConfig } from '../../../store/pageConfig';
import { GenericItemData } from '../../../components/List/models';
import { PlaylistItemProps } from '../../../pages/Playlists/PlaylistItem';

export default function usePlaylistITem(props: PlaylistItemProps) {

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

    

    return {
        playlist, medias, className, pageConfig, handleSelectPlaylist, handlePlayPlaylist, handleDeletePlaylist 
    };
}