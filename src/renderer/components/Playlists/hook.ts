import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { selectPageConfig, setPageConfig } from '../../store/pageConfig';
import { selectSelectedFiles } from '../../store/selectedFiles';
import { getPlaylistService } from '../../service/playlist';
import { Playlist } from '../../../common/playlists/types';
import { selectPlaylists, setPlaylist } from '../../store/playlists';
import { sortAsc } from '../../common/array';
import { Media } from '../../../common/medias/types';
import { getPageService } from '../../service/page';

export default function usePlaylists() {

    const [ inputValue, setInputValue ] = useState('Playlist sem título');

    const pageConfig = useSelector(selectPageConfig);
    const selectedItems = useSelector(selectSelectedFiles);
    const filterField: string = pageConfig?.playlistsOrderBy ? pageConfig.playlistsOrderBy : 'name';
    let listItems = useSelector(selectPlaylists);
    let playlists: Playlist[] = [...listItems].sort((a, b) => sortAsc(((a as any)[filterField] || '').toLocaleLowerCase(), ((b as any)[filterField] || '').toLocaleLowerCase()));

    const popupRef = useRef(null);
    const modalCreatePlaylistPopup = useRef(null);
    const closeTooltip = () => popupRef.current && popupRef.current.close();
    const closePlaylistPopup = () => modalCreatePlaylistPopup.current && modalCreatePlaylistPopup.current.close();
    const dispatch = useDispatch();

    const handleChangePlaylistsOrderBy = async (orderBy: string) => {

        dispatch(setPageConfig({ playlistsOrderBy: orderBy }));
        await getPageService().setPageConfig({ playlistsOrderBy: orderBy });
    };

    const handleCreatePlaylist = async () => {

        if (inputValue.trim() === '') {
            setInputValue('Playlist sem título');
        }

        try {
            const playlistService = getPlaylistService();
            const playlist: Playlist = await playlistService.insertPlaylist({
                name: inputValue,
                modificationDate: new Date().toISOString(),
                medias: [] as Media[],
            });

            dispatch(setPlaylist(playlist));
        }
        catch(error) {
            alert(error.message);
        }
        finally {
            closePlaylistPopup();
        }
    };

    useEffect(() => {

        const restoreScrollPosition = async () => {

            const pageConfig = await getPageService().getPageConfig();

            if (pageConfig.scrollPosition && pageConfig.firstRun) {

                document.querySelector('.c-list').scrollTo(0, pageConfig.scrollPosition);
                dispatch(setPageConfig({firstRun: false}));
            }
            else {
                await getPageService().setPageConfig({scrollPosition: 0});
            }
        };

        restoreScrollPosition();
    }, []);

    return {
        playlists, inputValue, pageConfig, popupRef, selectedItems, modalCreatePlaylistPopup, filterField,
        setInputValue, handleCreatePlaylist, mapPlaylistOrderBy, handleChangePlaylistsOrderBy, closeTooltip
    };
}

export function mapPlaylistOrderBy(playlistOrderBy: string) {

    if (playlistOrderBy === 'name') return 'A - Z';
    if (playlistOrderBy === 'modificationDate') return 'Data de modificação';

    return 'Aleatório';
}