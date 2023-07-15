import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Media } from '../../../common/medias/types';
import { selectContainerMargin } from '../../store/containerMargin';
import { deletePlaylist, selectPlaylists, setPlaylistData } from '../../store/playlists';
import { Playlist } from '../../../common/playlists/types';
import { getPlaylistService } from '../../service/playlist';
import { selectGroupInfo, setGroupInfo } from '../../store/groupInfo';
import { selectSelectedFiles } from '../../store/selectedFiles';
import { selectCurrentMedias, setCurrentMedias } from '../../store/player';
import { selectMediaPlaying, setMediaPlaying } from '../../store/mediaPlaying';
import { getPlayerService } from '../../service/player';
import { selectPlayerConfig } from '../../store/playerConfig';
import { shuffle } from '../../common/array';
import { selectPageConfig } from '../../store/pageConfig';
import { getGroupInfoService } from '../../service/groupInfo';

export default function useGroupInfo() {

    const [ headerMinimized, setHeaderMinimized ] = useState(false);
    
    const allPlaylists = useSelector(selectPlaylists);
    const selectedItems = useSelector(selectSelectedFiles);
    const group = useSelector(selectGroupInfo);
    const currentMedias = useSelector(selectCurrentMedias);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const containerMargin = useSelector(selectContainerMargin);
    const playerConfig = useSelector(selectPlayerConfig);
    const pageConfig = useSelector(selectPageConfig);
    const containerWidth = containerMargin.appWidth - (containerMargin.margin / 0.0625);
    const popupRef: any = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const modalCreatePlaylistRef: any = useRef();
    const openModalCreatePlaylistTooltip = () => modalCreatePlaylistRef.current && modalCreatePlaylistRef.current.open();
    const modalRenamePlaylistRef: any = useRef();
    const openModalRenamePlatlistTooltip = () => modalRenamePlaylistRef.current && modalRenamePlaylistRef.current.open();

    const medias = group.medias.slice(0 , 4).map(media => media.thumbnail);
    if (medias.length < 4 && medias.length > 1) {
        for (let i = medias.length; i < 4; i++) {
            medias.push(null);
        }
    }

   
    const handlePlay = async () => {

        let medias = group.medias;
        if (playerConfig.shuffle) {
            medias = shuffle(group.medias);
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

    const handleRemoveMedia = async (file: Media) => {

        const playlistMedias = [...group.medias];
        const medias = playlistMedias.filter(media => media.id !== file.id);

        const playlistUpdated = {
            id: group.id,
            medias: medias
        } as Playlist;

        await getPlaylistService().deletePlaylist({id: playlistUpdated.id, medias: [{id: file.id}]});
        await getGroupInfoService().setGroupInfo(playlistUpdated);

        dispatch(setGroupInfo(playlistUpdated));
        dispatch(setPlaylistData(playlistUpdated));
    };

    const handleDeletePlaylist = async () => {

        try {

            await getPlaylistService().deletePlaylist({id: group.id});

            dispatch(deletePlaylist({id: group.id}));
            navigate('/playlists', {replace: true});
        }
        catch(error) {

            console.error(error);
            alert('Falha ao remover item');
        }
    };

    const handleSetNextMedias = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        const nextMedias = currentMedias ? [...currentMedias] : [];
        for (let media of group.medias) {

            if (!currentMedias.some(m => m.id === media.id)) {
                nextMedias.push(media);
            }
        }

        dispatch(setCurrentMedias(nextMedias));
        await getPlayerService().setLastMedia({current_medias: nextMedias});

        if (nextMedias.length === 1 || !mediaPlaying) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }
    };

    const handleSetMediasOnPlaylist = async (e: React.MouseEvent, playlist: Playlist) => {

        if (e.target !== e.currentTarget) return;

        for (const media of group.medias) {
            const mediaIndex = playlist.medias.findIndex(m => m.id === media.id);

            if (mediaIndex === -1) {
                playlist.medias.push(media);
            }
        }

        try {
            await getPlaylistService().putPlaylist(playlist);

            dispatch(setPlaylistData(playlist));

            popupRef.current.close();
        }
        catch(error) {
            alert(error.message);
        }
    };

    const onScrollToBottom = () => {

        const scrollPosition = document.querySelector('.c-list').scrollTop;

        if (scrollPosition > 0 && headerMinimized === false) {
            setHeaderMinimized(true);
        }

        if (scrollPosition <= 0 && headerMinimized === true) {
            setHeaderMinimized(false);
        }
    };

    const closeTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.close();
    };

    return {
        group, pageConfig, headerMinimized, containerWidth, allPlaylists, selectedItems, popupRef, modalRenamePlaylistRef, modalCreatePlaylistRef, mediaPlaying, medias,
        handlePlay, handleSetNextMedias, closeTooltip, openModalCreatePlaylistTooltip, handleSetMediasOnPlaylist, openModalRenamePlatlistTooltip, handleDeletePlaylist,
        onScrollToBottom, handleRemoveMedia
    };
}