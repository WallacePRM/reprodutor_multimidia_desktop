import React, {  } from 'react';
import { FiSpeaker } from 'react-icons/fi';
import { IoHomeOutline } from 'react-icons/io5';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { IoFilmOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { IoChevronDownOutline } from 'react-icons/io5';
import Logo from '../Logo';
import PreviousRouter from '../PreviousRouter';
import Searchbar from '../Searchbar';
import ToggleSidebar from '../ToggleSidebar';
import { Link } from 'react-router-dom';
import useSidebar from './hook';
import './index.css';

export default function Sidebar() {

    const { ref, sidebarIsOpened, pathname, playlistsVisibility, rotate, allPlaylists, groupInfo,
        handleGoToPlaylists, setRotateAnimation, handleGoToPlaylistInfo, handleTogglePlaylists } = useSidebar();

    return (
        <div ref={ref} className={'c-sidebar' + (sidebarIsOpened ? ' c-sidebar--opened' : '')}>
            <div className="c-sidebar__header">
                { document.body.clientWidth > 655 ? <PreviousRouter title="Voltar"/> : null }
                { document.body.clientWidth >= 1000 ? <><span className="ml-10"></span><Logo/></> : null }
            </div>
            <div className="c-sidebar__content">
                {document.body.clientWidth < 1000 && document.body.clientWidth > 655 ?
                    <div className="m-5 mb-0" title="Abrir navegação"><ToggleSidebar /></div>
                : null }
                <div className="c-sidebar__search-field" title="Ctrl+E">
                    <Searchbar />
                </div>
                <nav className="c-sidebar__nav">
                    <Link to="/home" className={'c-sidebar__item' + (pathname === '/home' ? ' c-sidebar__item--active' : '')}  title="Início (Ctrl+Shift+F)">
                        <div className="d-flex a-items-center">
                            <div className="c-sidebar__item__icons">
                                <IoHomeOutline className="c-sidebar__item__icon" />
                            </div>
                            <label className="c-sidebar__item__label" >Início</label>
                        </div>
                        <div className="highlighter"></div>
                    </Link>
                    <Link to="/musics" className={'c-sidebar__item' + (pathname === '/musics' ? ' c-sidebar__item--active' : '')} title="Biblioteca de músicas (Ctrl+R)">
                        <div className="d-flex a-items-center">
                            <div className="c-sidebar__item__icons">
                                <IoMusicalNotesOutline className="c-sidebar__item__icon" />
                            </div>
                            <label className="c-sidebar__item__label" >Biblioteca de músicas</label>
                        </div>
                        <div className="highlighter" ></div>
                    </Link>
                    <Link to="/videos" className={'c-sidebar__item' + (pathname === '/videos' ? ' c-sidebar__item--active' : '')} title="Biblioteca de vídeos (Ctrl+D)">
                        <div className="d-flex a-items-center">
                            <div className="c-sidebar__item__icons">
                                <IoFilmOutline className="c-sidebar__item__icon" />
                            </div>
                            <label className="c-sidebar__item__label" >Biblioteca de vídeos</label>
                        </div>
                        <div className="highlighter"></div>
                    </Link>
                    <div className="c-sidebar__separator" ></div>
                    <Link to="/queue" className={'c-sidebar__item' + (pathname === '/queue' ? ' c-sidebar__item--active' : '')} title="Fila de reprodução (Ctrl+Q)">
                        <div className="d-flex a-items-center">
                            <div className="c-sidebar__item__icons">
                                <RiPlayList2Fill className="c-sidebar__item__icon" />
                            </div>
                            <label className="c-sidebar__item__label">Fila de reprodução</label>
                        </div>
                        <div className="highlighter"></div>
                    </Link>
                    <div onClick={handleGoToPlaylists} className={'c-sidebar__item' + (pathname === '/playlists' ? ' c-sidebar__item--active' : '')} title="Fila de reprodução (Ctrl+Q)">
                        <div className="d-flex a-items-center">
                            <div className="c-sidebar__item__icons">
                                <FiSpeaker className="c-sidebar__item__icon" />
                            </div>
                            <label className="c-sidebar__item__label">Playlists</label>
                        </div>
                        {allPlaylists.length > 0 && <IoChevronDownOutline onClick={handleTogglePlaylists} className={'c-sidebar__item__icon c-sidebar__item__icon--playlists--arrow' + (playlistsVisibility ? ' rotate-180' : '')} />}
                        <div className="highlighter"></div>
                    </div>

                    {(sidebarIsOpened || document.body.clientWidth >= 1000) && playlistsVisibility && <div className="c-sidebar__group c-sidebar__group--playlists">
                        {allPlaylists.map(p => {
                            return <Link to="/group-info"
                            className={'c-sidebar__item' + (pathname === '/group-info' && groupInfo.id === p.id ? ' c-sidebar__item--active' : '')}
                            key={p.id}
                            onClick={() => handleGoToPlaylistInfo(p)}>
                                <div className="d-flex a-items-center">
                                    <div className="c-sidebar__item__icons">
                                        <IoMusicalNotesOutline className="c-sidebar__item__icon c-sidebar__item__icon--playlist-music" />
                                        <IoFilmOutline className="c-sidebar__item__icon c-sidebar__item__icon--playlist-video" />
                                    </div>
                                    <label className="c-sidebar__item__label">{p.name}</label>
                                </div>
                                <div className="highlighter"></div>
                            </Link>
                        })}
                    </div>}

                </nav>
            </div>
            <div className="c-sidebar__footer">
                <Link onClick={setRotateAnimation} to="/configs" className={'c-sidebar__item' + (rotate ? ' c-sidebar__item--rotate' : '') + (pathname === '/configs' ? ' c-sidebar__item--active' : '')} title="Configurações (Ctrl+G)">
                    <div className="d-flex a-items-center">
                        <IoSettingsOutline className="c-sidebar__item__icon" />
                        <label className="c-sidebar__item__label">Configurações</label>
                    </div>
                    <div className="highlighter"></div>
                </Link>
            </div>
        </div>
    )
}