import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";
import { HiOutlinePlus } from 'react-icons/hi';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { selectCurrentMedias, setCurrentMedias } from "../../store/player";
import Button from "../../components/Button";
import LineItem from "../../components/List/LineItem";
import { isOdd } from "../../common/number";
import { selectMediaPlaying, setMediaPlaying } from "../../store/mediaPlaying";
import Margin from "../../components/Animations/Margin";
import Opacity from "../../components/Animations/Opacity";
import { setPlayerState } from "../../store/playerState";
import { getMediaService } from "../../service/media";
import { setMedias } from "../../store/medias";
import { getPlayerService } from "../../service/player";
import { selectSelectedFiles } from "../../store/selectedFiles";
import { Media } from "../../../common/medias/types";
import { getPageService } from "../../service/page";
import { selectPageConfig, setPageConfig } from "../../store/pageConfig";
import { selectPlaylists, setPlaylistData } from "../../store/playlists";
import { Playlist } from "../../../common/playlists/types";
import { getPlaylistService } from "../../service/playlist";
import SelectBlockMedia from "../../components/SelectBlock/SelectBlockMedia";
import { saveScrollPosition } from "../../common/dom";
import ModalCreatePlaylist from "../../components/Modal/ModalCreatePlaylist";

export default function usePlayQueue() {

    const allPlaylists = useSelector(selectPlaylists);
    const selectedItems = useSelector(selectSelectedFiles);
    let currentMedias = useSelector(selectCurrentMedias) || [];
    const mediaPlaying = useSelector(selectMediaPlaying);
    const dispatch = useDispatch();

    const popupAction: any = useRef();
    const closeActionTooltip = () => popupAction.current && popupAction.current.close();
    const popupRef: any = useRef();
    const closeTooltip = () => popupRef.current && popupRef.current.close();
    const modalCreatePlaylistRef = useRef(null);
    const openModalCreatePlaylist = () => modalCreatePlaylistRef.current && modalCreatePlaylistRef.current.open();

    const handleSelectFile = async (e: React.ChangeEvent<any>) => {

        const input = e.currentTarget;
        const fileList = input.files || [];

        const medias = await getMediaService().insertMedias(fileList);
        dispatch(setMedias(currentMedias.concat(medias)));
    };

    const handleSetMediasOnPlaylist = async (e: React.MouseEvent, playlist: Playlist) => {

        if (e.target !== e.currentTarget) return;

        for (const media of currentMedias) {
            const mediaIndex = playlist.medias.findIndex(m => m.id === media.id);

            if (mediaIndex === -1) {
                playlist.medias.push(media);
            }
        }

        try {
            await getPlaylistService().putPlaylist(playlist);

            dispatch(setPlaylistData(playlist));

            closeActionTooltip();
        }
        catch(error) {
            alert(error.message);
        }
    };

    const handleSelectMedia = (file: Media) => {

        dispatch(setMediaPlaying(file));
    };

    const handleClearQueue = async () => {

        await getPlayerService().setLastMedia({current_medias: []});
        dispatch(setCurrentMedias([] as Media[]));

        dispatch(setMediaPlaying(null));

        setTimeout(async () => {
            dispatch(setPlayerState({ file_id: undefined, currentTime: 0 }));
            await getPlayerService().setLastMedia({ file_id: undefined, currentTime: 0, duration: 0 });
        }, 0);
    };

    const handleRemoveMedia = (file: Media) => {

        const medias = [...currentMedias];
        const mediaIndex = medias.findIndex(media => media.id === file.id);
        if (mediaIndex === -1) return;

        medias.splice(mediaIndex, 1);
        dispatch(setCurrentMedias(medias));
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
        currentMedias, popupRef, allPlaylists, selectedItems, modalCreatePlaylistRef, mediaPlaying,
        handleClearQueue, closeTooltip, openModalCreatePlaylist, handleSetMediasOnPlaylist, handleRemoveMedia, handleSelectMedia
    };
}