import React, {  } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import WindowControls from '../WindowControls';
import { WindowState } from '../../App.hook';
import PreLoad from '../../components/PreLoad';
import Sidebar from '../../components/Sidebar';
import Player from '../../components/Player';
import Logo from '../../components/Logo';
import ToggleSidebar from '../../components/ToggleSidebar';
import PreviousRouter from '../../components/PreviousRouter';
import useMain from './hook';

export default function Main(props: MainProps) {

    const { preLoad, pageConfig, theme, playerMode, containerMargin } = useMain(props);

    if (preLoad) {
        return <PreLoad />
    }
    return (
        <div className={'c-app noselect' +
        (pageConfig?.theme ? ' theme--' + theme : '')}
        >
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

export type MainProps = {
    windowState: WindowState;
};