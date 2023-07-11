import { useEffect, useRef, useState } from "react";
import { LineItemFileProps } from "../models";
import { useDispatch, useSelector } from "react-redux";
import { removeSelectedFile, selectSelectedFiles, setSelectedFile } from "../../../store/selectedFiles";
import { selectMediaPlaying, setMediaPlaying } from "../../../store/mediaPlaying";
import { selectCurrentMedias, setCurrentMedias } from "../../../store/player";
import { selectPlaylists, setPlaylistData } from "../../../store/playlists";
import { Playlist } from "../../../../common/playlists/types";
import { getPlayerService } from "../../../service/player";
import { getPlaylistService } from "../../../service/playlist";

export default function useLineItem(props: LineItemFileProps) {

    const { className, file, noSelect, fileTypeVisible,
            onPlay, onRemove, onSelectMedia } = props;
    const [ selected, setSelected ] = useState(false);

    const selectedItems = useSelector(selectSelectedFiles);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const currentMedias = useSelector(selectCurrentMedias) || [];
    const allPlaylists = useSelector(selectPlaylists);
    const dispatch = useDispatch();

    const popupRef: any = useRef(null);
    const modalRef: any = useRef();
    const openModalTooltip = () => modalRef.current && modalRef.current.open();

    
    const handlePlay = (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        onPlay(file);
    };

    const handleSelectMedia = (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        onSelectMedia(file);
    };

    const handleDeleteMedia = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        onRemove(file);
    };

    const handleChangeSelected = (e: React.SyntheticEvent) => {

        e.stopPropagation();

        const newSelectState = !selected;

        setTimeout(() => {
            setSelected(newSelectState);

            if (newSelectState) {
                setTimeout(() => dispatch(setSelectedFile({id: file.id})), 10);
            }
            else {
                setTimeout(() => dispatch(removeSelectedFile({id: file.id})), 10);
            }

            popupRef.current.close();
        },0);
    };

    const handleSetNextMedia = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        const mediaIndex = currentMedias.findIndex(m => m.id === file.id);
        if (mediaIndex != -1) return;

        const nextMedias = currentMedias ? [...currentMedias] : [];
        nextMedias.push(file);

        dispatch(setCurrentMedias(nextMedias));
        await getPlayerService().setLastMedia({current_medias: nextMedias});

        if (nextMedias.length === 1) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }
    };

    const handleSetMediaOnPlaylist = async (e: React.MouseEvent, playlist: Playlist) => {

        if (e.target !== e.currentTarget) return;

        const mediaIndex = playlist.medias.findIndex(m => m.id === file.id);
        if (mediaIndex != -1) return;

        playlist.medias.push(file);

        try {
            await getPlaylistService().putPlaylist({
                id: playlist.id,
                medias: playlist.medias
            });

            dispatch(setPlaylistData(playlist));
        }
        catch(error) {
            alert(error.message);
        }
    };

    const closeTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.close();
    };

    const openTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.open();
    };

    useEffect(() => {

        if (!(selectedItems.some(i => i.id === file.id))) {
            setSelected(false);
        }
        else {
            setSelected(true);
        }

    }, [selectedItems]);

    return {
        selectedItems,
        mediaPlaying,
        file,
        selected,
        className,
        noSelect,
        fileTypeVisible,
        allPlaylists,
        popupRef,
        modalRef,
        onRemove,
        handleDeleteMedia,
        handleSelectMedia,
        handleChangeSelected,
        handlePlay,
        handleSetMediaOnPlaylist,
        handleSetNextMedia,
        openTooltip,
        openModalTooltip,
        closeTooltip,
    };
}