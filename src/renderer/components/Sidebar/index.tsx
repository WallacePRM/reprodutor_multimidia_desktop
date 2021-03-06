import React, { useEffect, useRef, useState } from 'react';

import { ReactComponent as Home } from '@icon/themify-icons/icons/home.svg';
import { ReactComponent as MusicAlt } from '@icon/themify-icons/icons/music-alt.svg';
import { ReactComponent as LayoutWidthDefault } from '@icon/themify-icons/icons/layout-width-default.svg';
import { ReactComponent as LayoutListThumb } from '@icon/themify-icons/icons/layout-list-thumb.svg';
import { ReactComponent as Settings } from '@icon/themify-icons/icons/settings.svg';
import Logo from '../Logo';
import PreviousRouter from '../PreviousRouter';
import Searchbar from '../Searchbar';
import ToggleSidebar from '../ToggleSidebar';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSidebarOpened } from '../../store/sidebarOpened';
import { useDispatch } from 'react-redux';
import { setContainerMargin } from '../../store/containerMargin';

import { IoHomeOutline } from 'react-icons/io5';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { IoFilmOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { FiSpeaker } from 'react-icons/fi';


import './index.css';

function Sidebar() {

    const [ rotate, setRotate ] = useState(false);

    const { pathname } = useLocation();
    const sidebarIsOpened: boolean = useSelector(selectSidebarOpened);
    const ref = useRef<HTMLHeadingElement>(null);
    const dispatch = useDispatch();

    useEffect(() => {

        const margin = document.body.offsetWidth > 655 ? (ref.current?.offsetWidth || 321) * 0.0625 : 0;
        dispatch(setContainerMargin({ margin: margin }));
    }, [ref.current]);

    const setRotateAnimation = () => {

        if (localStorage.getItem('lastRoute') === '/configs') return;
        setRotate(true);
        setTimeout(() => setRotate(false), 700);
    };

    return (
        <div ref={ref} className={'c-sidebar' + (sidebarIsOpened ? ' c-sidebar--opened' : '')}>
            <div className="c-sidebar__header">
                { document.body.clientWidth > 655 ? <PreviousRouter title="Voltar"/> : null }
                { document.body.clientWidth >= 1000 ? <><span className="ml-10"></span><Logo/></> : null }
            </div>
            <div className="c-sidebar__content">
                {document.body.clientWidth < 1000 && document.body.clientWidth > 655 ?
                    <div className="m-5 mb-0" title="Abrir navega????o"><ToggleSidebar /></div>
                : null }
                <div className="c-sidebar__search-field" title="Ctrl+E">
                    <Searchbar />
                </div>
                <nav className="c-sidebar__nav">
                    <Link to="/home" className={'c-sidebar__item' + (pathname === '/home' ? ' c-sidebar__item--active' : '')}  title="In??cio (Ctrl+Shifht+F)">
                        <div className="d-flex a-items-center">
                            {/* <Home className="c-sidebar__item__icon icon-color" /> */}
                            <IoHomeOutline className="c-sidebar__item__icon" />
                            <label className="c-sidebar__item__label" >In??cio</label>
                        </div>
                        <div className="highlighter"></div>
                    </Link>
                    <Link to="/musics" className={'c-sidebar__item' + (pathname === '/musics' ? ' c-sidebar__item--active' : '')} title="Biblioteca de m??sicas (Ctrl+R)">
                        <div className="d-flex a-items-center">
                            {/* <MusicAlt className="c-sidebar__item__icon icon-color" /> */}
                            <IoMusicalNotesOutline className="c-sidebar__item__icon" />
                            <label className="c-sidebar__item__label" >Biblioteca de m??sicas</label>
                        </div>
                        <div className="highlighter" ></div>
                    </Link>
                    <Link to="/videos" className={'c-sidebar__item' + (pathname === '/videos' ? ' c-sidebar__item--active' : '')} title="Biblioteca de v??deos (Ctrl+D)">
                        <div className="d-flex a-items-center">
                            {/* <LayoutWidthDefault className="c-sidebar__item__icon icon-color" /> */}
                            <IoFilmOutline className="c-sidebar__item__icon" />
                            <label className="c-sidebar__item__label" >Biblioteca de v??deos</label>
                        </div>
                        <div className="highlighter"></div>
                    </Link>
                    <div className="c-sidebar__separator" ></div>
                    <Link to="/queue" className={'c-sidebar__item' + (pathname === '/queue' ? ' c-sidebar__item--active' : '')} title="Fila de reprodu????o (Ctrl+Q)">
                        <div className="d-flex a-items-center">
                            {/* <LayoutListThumb className="c-sidebar__item__icon icon-color" /> */}
                            <RiPlayList2Fill className="c-sidebar__item__icon" />
                            <label className="c-sidebar__item__label">Fila de reprodu????o</label>
                        </div>
                        <div className="highlighter"></div>
                    </Link>
                    {/* <Link to="/playlists" className={'c-sidebar__item' + (pathname === '/queue' ? ' c-sidebar__item--active' : '')} title="Fila de reprodu????o (Ctrl+Q)">
                        <div className="d-flex a-items-center">
                            <FiSpeaker className="c-sidebar__item__icon" />
                            <label className="c-sidebar__item__label">Playlists</label>
                        </div>
                        <div className="highlighter"></div>
                    </Link> */}
                </nav>
            </div>
            <div className="c-sidebar__footer">
                <Link onClick={setRotateAnimation} to="/configs" className={'c-sidebar__item' + (rotate ? ' c-sidebar__item--rotate' : '') + (pathname === '/configs' ? ' c-sidebar__item--active' : '')} title="Configura????es (Ctrl+G)">
                    <div className="d-flex a-items-center">
                        {/* <Settings className="c-sidebar__item__icon icon-color" /> */}
                        <IoSettingsOutline className="c-sidebar__item__icon" />
                        <label className="c-sidebar__item__label">Configura????es</label>
                    </div>
                    <div className="highlighter"></div>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;