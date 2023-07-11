import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setSidebarOpened } from '../../store/sidebarOpened';
import { selectContainerMargin } from '../../store/containerMargin';
import { setMedias } from '../../store/medias';
import { getMediaService } from '../../service/media';
import { getPlayerService } from '../../service/player';
import { getPageService } from '../../service/page';
import { setMediaPlaying } from '../../store/mediaPlaying';
import { setCurrentMedias } from '../../store/player';
import { setPlayerState } from '../../store/playerState';
import { setPlayerConfig } from '../../store/playerConfig';
import { selectPageConfig, setPageConfig } from '../../store/pageConfig';
import { selectSelectedFiles, setSelectedFiles } from '../../store/selectedFiles';
import { Media } from '../../../common/medias/types';
import { selectPlayerMode } from '../../store/playerMode';
import { getPlaylistService } from '../../service/playlist';
import { setPlaylists } from '../../store/playlists';
import { getGroupInfoService } from '../../service/groupInfo';
import { setGroupInfo } from '../../store/groupInfo';
import { MainProps } from '.';

export default function useMain(props: MainProps) {

    const [ theme ] = props.windowState;

    const [ preLoad, setPreLoad ] = useState(true);

    const containerMargin = useSelector(selectContainerMargin);
    const selectedItems = useSelector(selectSelectedFiles);
    const playerMode = useSelector(selectPlayerMode);
    const pageConfig = useSelector(selectPageConfig);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {

        const hideSidebar = () => {
            dispatch(setSidebarOpened({ isOpened: false }));
        };

        document.addEventListener('click', hideSidebar);
        return () => document.removeEventListener('click', hideSidebar);
    }, []);

    useEffect(() => {

        const getAllData = async () => {

            try {
                const mediasOptions = {
                    offSet: 0,
                    limit: 10000,
                };

                let medias: Media[] = [];
                while(true) {
                    const result = await getMediaService().getMedias(mediasOptions);
                    medias = medias.concat(result);
                    mediasOptions.offSet += mediasOptions.limit;

                    if (result.length === 0) {
                        break;
                    }
                }

                dispatch(setMedias(medias));

                const playerService = getPlayerService();
                const playerState = await playerService.getLastMedia();
                const playerConfig = await playerService.getPlayerConfig();
                const pageConfig = await getPageService().getPageConfig();
                const playlists = await getPlaylistService().getPlaylists();
                const groupInfo = await getGroupInfoService().getGroupInfo();

                pageConfig.firstRun = true;
                if (pageConfig) {
                    dispatch(setPageConfig(pageConfig));
                }

                if (playerConfig) {
                    dispatch(setPlayerConfig(playerConfig));
                }

                if (playerState) {
                    playerState.first_load = true;

                    let currentMedias: Media[] = [];
                    if (playerState.current_medias) {
                        for (const media of playerState.current_medias) {

                            if (medias.find(m => m.id === media.id))
                            currentMedias.push(media);
                        }
                    }

                    const media = medias.find(item => item.id === playerState.file_id) || null;
                    if (media) {
                        dispatch(setPlayerState(playerState));
                    }

                    dispatch(setPlayerState(null));
                    dispatch(setCurrentMedias(currentMedias ? currentMedias : null));
                    dispatch(setMediaPlaying(media));
                    dispatch(setPlaylists(playlists));
                }

                if (groupInfo) {
                    dispatch(setGroupInfo(groupInfo));
                }
            }
            catch (error) {
                alert(error.message);
            }
            finally {
                setPreLoad(false);
            }
        };

        getAllData();
    }, []);

    useEffect(() => {

        const setDefaultRoute = async () => {

            const lastRoute = location.pathname;

            if (lastRoute !== '/') {

                if (lastRoute === '/group-info') return;

                localStorage.setItem('lastRoute', lastRoute);
            }
        };

        const resetSelectedItems = () => {
            dispatch(setSelectedFiles([]));
        };

        if (selectedItems.length > 0) {
            resetSelectedItems();
        }

        setDefaultRoute();
    }, [location]);

    return {
        preLoad,
        pageConfig,
        theme,
        playerMode, 
        containerMargin
    };
};