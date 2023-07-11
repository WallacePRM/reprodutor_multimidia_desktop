import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMediaPlaying, setMediaPlaying } from "../../../store/mediaPlaying";
import { selectCurrentMedias, setCurrentMedias } from "../../../store/player";
import { selectPlaylists, setPlaylistData } from "../../../store/playlists";
import { removeSelectedFile, selectSelectedFiles, setSelectedFile } from "../../../store/selectedFiles";
import { GenericItemProps } from "../models";
import { Playlist } from "../../../../common/playlists/types";
import { getPlaylistService } from "../../../service/playlist";
import { isPlaylist } from "../../../common/array";
import { getPlayerService } from "../../../service/player";

export default function useGenericGridItem(props: GenericItemProps) {

    const { noSelect, className, item, onSelectMedia, onPlay, onRemove } = props;

    const [ animation, setAnimation ] = useState(false);
    const [ selected, setSelected ] = useState(false);
    const [ active, setActive ] = useState(false);
    
    const selectedItems = useSelector(selectSelectedFiles);
    const currentMedias = useSelector(selectCurrentMedias) || [];
    const mediaPlaying = useSelector(selectMediaPlaying);
    const allPlaylists = useSelector(selectPlaylists);
    
    const popupRef: any = useRef();
    const modalCreatePlaylistRef: any = useRef();
    const openModalCreatePlaylistTooltip = () => modalCreatePlaylistRef.current && modalCreatePlaylistRef.current.open();
    const modalRenamePlaylistRef: any = useRef();
    const openModalRenamePlaylistTooltip = () => modalRenamePlaylistRef.current && modalRenamePlaylistRef.current.open();

    const dispatch = useDispatch();

    const handleSelect = () => {

        onSelectMedia(item);
    };

    const handlePlay = () => {
        onPlay(item);
    };

    const handleRemove = () => {

        onRemove(item);
    };
    

    const handleSetNextMedia = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        const nextMedias = currentMedias ? [...currentMedias] : [];

        if (isPlaylist(item.media)) {

            for (let media of item.media.medias) {

                if (currentMedias.some(m => m.id === media.id)) {
                    continue;
                }
                else {
                    nextMedias.push(media);
                }
            }
        }
        else {
            if (!currentMedias.some(m => m.id === item.media.id)) {

                nextMedias.push(item.media);
            }
        }

        dispatch(setCurrentMedias(nextMedias));
        await getPlayerService().setLastMedia({current_medias: nextMedias});

        if (nextMedias.length === 1 || !mediaPlaying) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }
    };

    const handleSetMediaOnPlaylist = async (e: React.MouseEvent, playlistTarget: Playlist) => {

        if (e.target !== e.currentTarget) return;

        const playlistSource = item.media as Playlist;

        if (playlistSource.id === playlistTarget.id) return;

        const playlistUpdated = {...playlistTarget, medias: [...playlistSource.medias]};

        for (const media of playlistSource.medias) {

            if (!playlistUpdated.medias.some(m => m.id === media.id)) {
                playlistUpdated.medias.push(media);
            }
        }

        try {
            await getPlaylistService().putPlaylist({
                id: playlistUpdated.id,
                medias: playlistUpdated.medias
            });

            dispatch(setPlaylistData(playlistUpdated));
        }
        catch(error) {
            alert(error.message);
        }
    };

    const handleChangeSelected = (e: React.SyntheticEvent) => {

        const newSelectState = !selected;

        setTimeout(() => {
            setSelected(newSelectState);

            if (newSelectState) {
                setTimeout(() => dispatch(setSelectedFile({id: item.id})), 10);
            }
            else {
                setTimeout(() => dispatch(removeSelectedFile({id: item.id})), 10);
            }
        },0);
    };

    const closeTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.close();
    };

    const openTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.open();
    };

    const onMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.button !== 2) {
            setAnimation(true);
        }
    };

    const onMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.button !== 2) {
            setAnimation(false);
        }
    };

    useEffect(() => {

        if (!(selectedItems.some(i => i.id === item.id))) {
            setSelected(false);
        }
        else {
            setSelected(true);
        }

    }, [selectedItems]);

    return {
        className,
        active,
        selectedItems, 
        animation, 
        noSelect,
        item,
        selected,
        allPlaylists,
        modalCreatePlaylistRef,
        popupRef,
        modalRenamePlaylistRef,
        openModalCreatePlaylistTooltip,
        openModalRenamePlaylistTooltip,
        handleSelect,
        setActive,
        openTooltip,
        onMouseDown,
        onMouseUp,
        setAnimation,
        handlePlay,
        handleSetNextMedia,
        closeTooltip,
        onRemove,
        handleSetMediaOnPlaylist,
        handleChangeSelected,
        handleRemove
    };
}