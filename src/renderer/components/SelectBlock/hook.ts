
import { useSelector, useDispatch  } from 'react-redux';
import { selectSelectedFiles, setSelectedFiles } from '../../store/selectedFiles';
import { Media } from '../../../common/medias/types';
import { selectContainerMargin } from '../../store/containerMargin';
import { selectPlaylists } from '../../store/playlists';
import { Playlist } from '../../../common/playlists/types';
import { isPlaylist } from '../../common/array';
import { useEffect, useRef, useState } from 'react';
import { SelectBlockProps } from '.';
import './index.css';

export default function useSelectBlock(props: SelectBlockProps) {

    const [ selected, setSelected ] = useState(false);
    const [ mediasSelected, setMediasSelected ] = useState([]);

    const { list, onPlay, onRemove, onSetInPlaylist, onSetNext } = props;
    const allPlaylists = useSelector(selectPlaylists);
    const selectedItems = useSelector(selectSelectedFiles);
    const containerMargin = useSelector(selectContainerMargin);
    const containerWidth = containerMargin.appWidth - (containerMargin.margin / 0.0625);
    const popupRef: any = useRef();
    const dispatch = useDispatch();

    const modalCreatePlaylistRef: any = useRef();
    const openModalCreatePlaylistTooltip = () => modalCreatePlaylistRef.current && modalCreatePlaylistRef.current.open();

    const modalRenamePlaylistRef: any = useRef();
    const openModalRenamePlaylistTooltip = () => modalRenamePlaylistRef.current && modalRenamePlaylistRef.current.open();

    const closeTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.close();
    };

    const clearSelectedItems = () => {
        dispatch(setSelectedFiles([]));
    };

    const handleSelectAllItems = () => {

        const newSelectState = !selected;

        setTimeout(() => {
            setSelected(newSelectState);

            if (newSelectState) {

                let newSelectedItems = [];
                for (let media of list) {
                    newSelectedItems.push({id: media.id});
                };

                dispatch(setSelectedFiles(newSelectedItems));
            }
            else {

                dispatch(setSelectedFiles([]));
            }
        }, 0);
    };

    const handleClearSelectedItems = () => {

        clearSelectedItems();
    };

    const handlePlaySelectedItems = (e: React.MouseEvent) => {

        onPlay();

        clearSelectedItems();
    };

    const handleSetNextSelectedItems = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        onSetNext();

        clearSelectedItems();
    };

    const handleSetMediasOnPlaylist = async (e: React.MouseEvent, playlist: Playlist) => {

        if (e.target !== e.currentTarget) return;

        onSetInPlaylist(playlist);

        clearSelectedItems();
    };

    const handleDeleteSelectedItems = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        onRemove();

        clearSelectedItems();
    };

    useEffect(() => {

        if (selectedItems.length !== list.length) {
            setSelected(false);
        }
        else {
            setSelected(true);
        }

        const getAllMediasSelected = () => {

            setMediasSelected([]);

            if (isPlaylist(list[0])) {

                const selectedPlaylists = (list as Playlist[]).filter(item => selectedItems.some(selectedItem => selectedItem.id === item.id));

                const playlistMediasSelected: Media[] = [];
                for (const playlist of selectedPlaylists) {

                    for (const media of playlist.medias) {
                        if (!playlistMediasSelected.some(m => m.id === media.id)) {
                            playlistMediasSelected.push(media);
                        }
                    }
                }

                setMediasSelected(playlistMediasSelected);
            }
            else {
                setMediasSelected((list as Media[]).filter(item => selectedItems.some(selectedItem => item.id === selectedItem.id)));
            }
        };

        getAllMediasSelected();

    }, [selectedItems]);


    return {
        selected, selectedItems, containerWidth, modalRenamePlaylistRef, modalCreatePlaylistRef, allPlaylists, list, mediasSelected, popupRef,
        handleSelectAllItems, handleClearSelectedItems, handlePlaySelectedItems, handleSetNextSelectedItems, openModalCreatePlaylistTooltip, handleSetMediasOnPlaylist,
        openModalRenamePlaylistTooltip, handleDeleteSelectedItems, onRemove, clearSelectedItems, closeTooltip
    };
}