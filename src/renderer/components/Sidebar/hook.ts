import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectSidebarOpened, setSidebarOpened } from '../../store/sidebarOpened';
import { useDispatch } from 'react-redux';
import { setContainerMargin } from '../../store/containerMargin';
import { selectPlaylists } from '../../store/playlists';
import { selectGroupInfo, setGroupInfo } from '../../store/groupInfo';
import { Playlist } from '../../../common/playlists/types';
import { getGroupInfoService } from '../../service/groupInfo';

export default function useSidebar() {

    const { pathname } = useLocation();

    const [ rotate, setRotate ] = useState(false);
    const [ playlistsVisibility, setPlaylistsVisibity ] = useState(true);

    const allPlaylists = useSelector(selectPlaylists);
    const groupInfo = useSelector(selectGroupInfo);
    const sidebarIsOpened: boolean = useSelector(selectSidebarOpened);

    const ref = useRef<HTMLHeadingElement>(null);
    const navigate = useNavigate();
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

    const togglePlaylists = () => {

        setPlaylistsVisibity(!playlistsVisibility);
    };

    const handleGoToPlaylists = (e: React.MouseEvent) => {

        e.stopPropagation();

        togglePlaylists();

        navigate('/playlists');
        dispatch(setSidebarOpened({isOpened: false}));
    };

    const handleTogglePlaylists = (e: React.MouseEvent) => {

        e.stopPropagation();

        togglePlaylists();
    };

    const handleGoToPlaylistInfo = async (playlist: Playlist) => {

        await getGroupInfoService().setGroupInfo(playlist);
        dispatch(setGroupInfo(playlist));
    };

    return {
        ref, sidebarIsOpened, pathname, playlistsVisibility, rotate, allPlaylists, groupInfo,
        handleGoToPlaylists, setRotateAnimation, handleGoToPlaylistInfo, handleTogglePlaylists
    };
}