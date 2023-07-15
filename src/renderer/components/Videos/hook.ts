import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux";
import { sortAsc } from "../../common/array";
import { selectMedias, setMedias } from "../../store/medias";
import { useDispatch } from "react-redux";
import { setCurrentMedias } from "../../store/player";
import { Media } from '../../../common/medias/types';
import { getMediaService } from "../../service/media";
import { selectMediaPlaying, setMediaPlaying } from "../../store/mediaPlaying";
import { setPlayerMode } from "../../store/playerMode";
import { setPlayerState } from "../../store/playerState";
import { selectSelectedFiles } from "../../store/selectedFiles";
import { selectPageConfig, setPageConfig } from "../../store/pageConfig";
import { getPageService } from "../../service/page";
import { extractFilesInfo } from '../../service/media/media-handle';
import { getFolderService } from '../../service/folder';
import { getPlayerService } from '../../service/player';

export default function useVideos() {

    const [ load, setLoad ] = useState(false);

    const selectedItems = useSelector(selectSelectedFiles);
    const listItems = useSelector(selectMedias);
    const pageConfig = useSelector(selectPageConfig);
    const filterField = pageConfig?.videosOrderBy ? pageConfig.videosOrderBy : 'name';
    const videoList = getVideosFromMedias(listItems, filterField);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const popupRef: any = useRef();
    const closeTooltip = () => popupRef.current && popupRef.current.close();
    const dispatch = useDispatch();

    const handleSelectFile = async (e: React.ChangeEvent<any>) => {

        const input = e.currentTarget as HTMLInputElement;
        const files: File[] = Array.prototype.slice.call(input.files, 0);
        const fileList = extractFilesInfo(files);

        const pathSeparator = fileList[0].path.includes('/') ? '/' : '\\';
        const fileFolder = {
            path: fileList[0].path.split(pathSeparator).slice(0, -1).join(pathSeparator),
            type: 'video'
        };

        try {
            setLoad(true);

            const medias = await getMediaService().insertMedias(fileList);
            dispatch(setMedias(listItems.concat(medias)));

            const videoFolder = await getFolderService().insertFolder(fileFolder);
        }
        catch(error) {
            console.log(error.message);
        }
        finally {
            setLoad(false);
        }
    };

    const handleSelectMedia = async (file: Media) => {

        if (file.type === 'video') {
            dispatch(setPlayerMode('full'));
        }

        dispatch(setCurrentMedias(videoList));
        await getPlayerService().setLastMedia({current_medias: videoList});

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

    const handleChangeOrderBy = async (e: React.ChangeEvent<any>) => {

        const value = e.currentTarget.value;
        dispatch(setPageConfig({ videosOrderBy: value }));
        await getPageService().setPageConfig({ videosOrderBy: value });
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
        videoList, popupRef, pageConfig, selectedItems, load, filterField,
        handleSelectFile, handleChangeOrderBy, handleSelectMedia, closeTooltip, mapvideosOrderBy
    };
}

export function getVideosFromMedias(list: Media[], filterField: string) {

    const videos = list.filter(item => item.type === 'video');
    videos.sort((a, b) => { 

        let aValue = (a as any)[filterField].toLocaleLowerCase();
        let bValue = (b as any)[filterField].toLocaleLowerCase();

        if (filterField === 'releaseDate') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        return sortAsc(aValue, bValue);
    });

    return videos;
};

export function mapvideosOrderBy(videosOrderBy: string) {

    if (videosOrderBy === 'name') return 'A - Z';
    if (videosOrderBy === 'releaseDate') return 'Data de modificação';

    return 'Aleatório';
};