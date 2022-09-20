import React, { useEffect, useState } from 'react';
import { AnimatePresence } from "framer-motion";

import PreLoad from '../../components/PreLoad';
import Sidebar from '../../components/Sidebar';
import Player from '../../components/Player';
import Logo from '../../components/Logo';
import ToggleSidebar from '../../components/ToggleSidebar';
import PreviousRouter from '../../components/PreviousRouter';
import { WindowState } from '../../App.hook';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSidebarOpened } from '../../store/sidebarOpened';
import { useSelector } from 'react-redux';
import { selectContainerMargin } from '../../store/containerMargin';
import { selectMedias, setMedias } from '../../store/medias';
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
import WindowControls from '../WindowControls';
import { selectPlayerMode } from '../../store/playerMode';
import { PageConfig } from '../../service/page/type';
import { getPlaylistService } from '../../service/playlist';
import { setPlaylists } from '../../store/playlists';

function Main(props: MainProps) {

    const [ preLoad, setPreLoad ] = useState(true);

    const [theme] = props.windowState;
    const location = useLocation();
    const containerMargin = useSelector(selectContainerMargin);
    const selectedItems = useSelector(selectSelectedFiles);
    const listItems = useSelector(selectMedias);
    const playerMode = useSelector(selectPlayerMode);
    const pageConfig = useSelector(selectPageConfig);
    const dispatch = useDispatch();

    useEffect(() => {

        const hideSidebar = () => {
            dispatch(setSidebarOpened({ isOpened: false }));
        };

        document.addEventListener('click', hideSidebar);
        return () => document.removeEventListener('click', hideSidebar);
    }, []);

    useEffect(() => {
        if (listItems.length > 0) {
            setTimeout(() => {
                setPreLoad(false);
            }, 1000);

            return;
        };

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

    if (preLoad) {
        return <PreLoad />
    }
    return (
        <div className={'c-app noselect' +
        (pageConfig?.theme ? ' theme--' + theme : '')}>
            {(playerMode !== 'full' && !pageConfig.fullscreen) && <WindowControls />}
            <main id="popup-root" className="c-app__content">
                <Sidebar />
                <div style={{ marginLeft: `${containerMargin.margin}rem` }} className="c-container">
                    {document.body.clientWidth < 1000 ?
                        <div className="c-app__logo">
                            {document.body.clientWidth <= 655 ?
                                <div className="d-flex a-items-center z-index-6">
                                    <PreviousRouter />
                                    <ToggleSidebar />
                                    <span className="ml-10"></span>
                                </div> : null
                            }
                            <div className="z-index-6"><Logo /></div>
                        </div> : null}
                    <div className="c-container__pages">
                        <AnimatePresence>
                            <Outlet />
                        </AnimatePresence>
                    </div>
                </div>
            </main>
            <Player />
        </div>
    );
}

type MainProps = {
    windowState: WindowState;
};

export default Main;