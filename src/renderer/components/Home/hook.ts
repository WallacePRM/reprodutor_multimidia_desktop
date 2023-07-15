import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMediaService } from "../../service/media";
import { selectMedias, setMedias } from "../../store/medias";
import { Media } from '../../../common/medias/types';
import { selectMediaPlaying, setMediaPlaying } from "../../store/mediaPlaying";
import { setPlayerMode } from "../../store/playerMode";
import { revertOrder } from "../../common/array";
import { setPlayerState } from "../../store/playerState";
import { validateUrl } from "../../common/async";
import { selectSelectedFiles } from "../../store/selectedFiles";
import { extractFilesInfo } from "../../service/media/media-handle";
import { setCurrentMedias } from "../../store/player";
import { getPlayerService } from "../../service/player";
import { getPageService } from "../../service/page";
import { setPageConfig } from "../../store/pageConfig";
import { getFolderService } from "../../service/folder";

export default function useHome() {

    const [urlType, setUrlStype] = useState('video');
    const [urlValidate, setUrlValidate] = useState(false);
    const [load, setLoad] = useState(false);

    const allMedias = useSelector(selectMedias);
    const listItems = useSelector(selectMedias);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const selectedItems = useSelector(selectSelectedFiles);
    let recentMedias: any[] = revertOrder(listItems);

    const popupRef: any = useRef();
    const modalRef: any = useRef();
    const urlRef: any = useRef(null);
    const closeTooltip = () => popupRef.current && popupRef.current.close();
    const closeModalTooltip = () => modalRef.current && modalRef.current.close();
    const openModalTooltip = () => modalRef.current && modalRef.current.open();
    const dispatch = useDispatch();

    const handleSelectFile = async (e: React.ChangeEvent<any>) => {

        popupRef.current.close();

        const input = e.currentTarget as HTMLInputElement;
        const files: File[] = Array.prototype.slice.call(input.files, 0);
        const fileList = extractFilesInfo(files);

        try {
            setLoad(true);

            const medias = await getMediaService().insertMedias(fileList);
            dispatch(setMedias(listItems.concat(medias)));

            const pathSeparator = fileList[0].path.includes('/') ? '/' : '\\';
            const fileFolder = {
                path: fileList[0].path.split(pathSeparator).slice(0, -1).join(pathSeparator),
                type: medias[0].type
            };

            const mediasTypes = medias.reduce((result, media) => {
                if (result.some(type => type === media.type)) return result;

                result.push(media.type);
                return result;
            }, []);

            for (const type of mediasTypes) {

                fileFolder.type = type;
                await getFolderService().insertFolder(fileFolder);
            }

            dispatch(setCurrentMedias(medias));
            await getPlayerService().setLastMedia({ current_medias: medias });

            dispatch(setMediaPlaying(medias[0]));
            dispatch(setPlayerMode('full'));
        }
        catch (e) {
            console.log(e.message);
        }
        finally {
            setLoad(false);
        }
    };

    const handleSelectMedia = async (file: Media) => {

        if (file.type === 'video') {
            dispatch(setPlayerMode('full'));
        }

        dispatch(setCurrentMedias([file]));
        await getPlayerService().setLastMedia({ current_medias: [file] });

        if (mediaPlaying?.id !== file.id) {
            dispatch(setMediaPlaying(file));
        }
        else {
            dispatch(setMediaPlaying(null));
            setTimeout(() => {
                dispatch(setPlayerState({ file_id: file.id, currentTime: 0, duration: 0 }));
                dispatch(setMediaPlaying(file))
            }, 0);
        }
    };

    const handleOpenUrl = () => {

        if (!urlRef.current) return;

        const url = (urlRef.current as any).value;
        const type = urlType === 'video' ? 'video' : 'music';
        const file = {
            id: parseInt(Date.now() + Math.random().toString()),
            type,
            src: url,
            name: 'Arquivo desconhecido',
            duration: 0,
            isPlaying: false,
            releaseDate: '',
        };

        dispatch(setCurrentMedias([file]));
        dispatch(setMediaPlaying(file));
        closeModalTooltip();
    };

    const handleChangeUrlType = (urlType: string) => {

        // const urlType = e.currentTarget.value;
        setUrlStype(urlType);
    };

    const handleValidateUrl = (e: React.ChangeEvent) => {

        const url = (e.currentTarget as any).value;
        setUrlValidate(validateUrl(url));
    };

    const mapUrlType = (type: string) => {

        if (type === 'video') return 'Vídeo(s)';
        if (type === 'music') return 'Música(s)';

        return 'Arquivo(s)';
    };

    useEffect(() => {

        const restoreScrollPosition = async () => {

            const pageConfig = await getPageService().getPageConfig();

            if (pageConfig.scrollPosition && pageConfig.firstRun) {

                document.querySelector('.c-list').scrollTo(0, pageConfig.scrollPosition);
                dispatch(setPageConfig({ firstRun: false }));
            }
            else {
                await getPageService().setPageConfig({ scrollPosition: 0 });
            }
        };

        restoreScrollPosition();
    }, []);

    return {
        listItems, popupRef, selectedItems, modalRef, urlRef, urlValidate, load, urlType, recentMedias, 
        handleSelectFile, openModalTooltip, handleOpenUrl, closeTooltip, handleValidateUrl, mapUrlType, handleChangeUrlType, handleSelectMedia
    };
}