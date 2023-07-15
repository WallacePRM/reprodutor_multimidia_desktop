import React, { useEffect } from 'react';
import { isVisible, saveScrollPosition } from "../../common/dom";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMediaService } from "../../service/media";
import { selectMedias, setMedias } from "../../store/medias";
import { Media } from '../../../common/medias/types';
import { setCurrentMedias } from "../../store/player";
import { arrayUnshiftItem, shuffle, sortAsc } from "../../common/array";
import { hasSymbol } from "../../common/string";
import { selectMediaPlaying, setMediaPlaying } from "../../store/mediaPlaying";
import { setPlayerState } from "../../store/playerState";
import { selectPlayerConfig } from "../../store/playerConfig";
import { selectPageConfig, setPageConfig } from "../../store/pageConfig";
import { getPageService } from "../../service/page";
import { selectSelectedFiles } from "../../store/selectedFiles";
import { extractFilesInfo } from '../../service/media/media-handle';
import { getFolderService } from '../../service/folder';
import { getPlayerService } from '../../service/player';

export default function useMusics() {

    const [ load, setLoad ] = useState(false);
    const [ filterBlock, setFilterBlock ] = useState(false);

    const selectedItems = useSelector(selectSelectedFiles);
    const pageConfig = useSelector(selectPageConfig);
    const filterField: string = pageConfig?.musicsOrderBy ? pageConfig.musicsOrderBy : 'name';
    const listItems = useSelector(selectMedias);
    const playerConfig = useSelector(selectPlayerConfig);
    const musics = (listItems.filter(item => item.type === 'music')).sort((a, b) => sortAsc(((a as any)[filterField] || '').toLocaleLowerCase(), ((b as any)[filterField] || '').toLocaleLowerCase()));
    const listSeparators = createSeparators(musics as any, filterField);
    const [ lastSeparatorInvisible, setLastSeparatorInvisible ] = useState<string | null>(listSeparators[0] || '');
    const mediaPlaying = useSelector(selectMediaPlaying);
    const popupRef: any = useRef();
    const separatorRef: any = useRef();
    const closeTooltip = () => popupRef.current && popupRef.current.close();
    let timeoutId: any = null;
    const dispatch = useDispatch();

    const handleSelectFile = async (e: React.ChangeEvent<any>) => {

        const input = e.currentTarget as HTMLInputElement;
        const files: File[] = Array.prototype.slice.call(input.files, 0);
        const fileList = extractFilesInfo(files);

        const pathSeparator = fileList[0].path.includes('/') ? '/' : '\\';
        const fileFolder = {
            path: fileList[0].path.split(pathSeparator).slice(0, -1).join(pathSeparator),
            type: 'music'
        };

        try {
            setLoad(true);

            const medias = await getMediaService().insertMedias(fileList);
            dispatch(setMedias(listItems.concat(medias)));

            await getFolderService().insertFolder(fileFolder);
        }
        catch(error) {
            console.log(error.message);
        }
        finally {
            setLoad(false);
        }
    };

    const handleSelectMedia = async (file: Media) => {

        let medias = [...musics];
        if (playerConfig.shuffle) {

            medias = shuffle(medias);

            const index = medias.findIndex(item => item.id === file.id);
            medias = arrayUnshiftItem(medias, index);
        }

        dispatch(setCurrentMedias(medias));
        await getPlayerService().setLastMedia({current_medias: medias});

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

    const handleShuffle = async () => {

        const shuffled = shuffle(musics);

        dispatch(setCurrentMedias(shuffled));
        await getPlayerService().setLastMedia({current_medias: shuffled});

        if (mediaPlaying?.id !== shuffled[0].id) {
            dispatch(setMediaPlaying(shuffled[0]));
        }
        else {
            dispatch(setMediaPlaying(null));
            setTimeout(() => dispatch(setMediaPlaying(shuffled[0])), 0);
        }
    };

    const handleChangeMusicsOrderBy = async (e: React.ChangeEvent<any>) => {

        const value = e.currentTarget.value;
        dispatch(setPageConfig({ musicsOrderBy: value }));
        await getPageService().setPageConfig({ musicsOrderBy: value });
        setLastSeparatorInvisible(createLastSeparator());
    };

    const handleShowUpFilterBlock = () => {

        setFilterBlock(true);
    };

    const hanndleGoToFilterSelected = (e: React.MouseEvent) => {

        const filter = e.currentTarget.textContent;

        const separators = document.querySelectorAll(`.c-line-list__separator`);
        separators.forEach(separator => {
            if (separator.innerHTML === filter) {
                separator.scrollIntoView({ block: 'start' });
            }
        });

        setFilterBlock(false);
    };

    const onScrollToBottom = () => {

        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {

            setLastSeparatorInvisible(createLastSeparator());
        }, 50);

        saveScrollPosition();
    };

    const mapSeparatorByFilter = (filter: string) => {

        if (!filter) return mapMusicsOrderBy(filterField) + ' desconhecido';

        return filter;
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
        musics, selectedItems, popupRef, filterField, pageConfig, load, filterBlock, listSeparators, separatorRef, mediaPlaying, lastSeparatorInvisible,
        handleShuffle, mapMusicsOrderBy, handleChangeMusicsOrderBy, handleSelectFile, hanndleGoToFilterSelected, onScrollToBottom, handleShowUpFilterBlock,
        handleSelectMedia, mapListSeparators, mapSeparatorByFilter, closeTooltip
    };
}

export function mapMusicsOrderBy(musicsOrderBy: string) {

    if (musicsOrderBy === 'name') return 'A - Z';
    if (musicsOrderBy === 'author') return 'Artista';
    if (musicsOrderBy === 'album') return 'Álbum';
    if (musicsOrderBy === 'genre') return 'Gênero';
    if (musicsOrderBy === 'releaseDate') return 'Ano de lançamento';

    return 'Aleatório';
}

export function mapListSeparators(letter: string) {

    // Se for número, adicionar #
    if (!isNaN(parseInt(letter))) return '#';

    // Se for caractere especial, adicionar &
    if (hasSymbol(letter))  return '&';

    return letter;
}

export function createSeparators(listItems: Media[], filterField: string) {

    const listSeparators: string[] = listItems.reduce((obj, item: any) => {

        let separator: string = '';
        if (filterField === 'name') {
            separator = mapListSeparators((item[filterField] || '').charAt(0).toLocaleUpperCase());
        }
        else {
            if (item[filterField]) {
                separator = item[filterField];
            }
            else {
                separator = mapMusicsOrderBy(filterField) + ' desconhecido';
            }
        }

        if (!obj.index[separator]) {
            obj.index[separator] = true;

            obj.separators.push(separator);
        }

        return obj;

    }, { index: {} as any, separators: [] as string[] }).separators;

    return listSeparators;
}

export function createLastSeparator() {

    const separators: HTMLElement[] = Array.prototype.slice.call(document.querySelectorAll('.c-line-list__separator:not(.c-line-list__separator--fixed)') as NodeListOf<HTMLElement>, 0);
    const separatorsFormated = separators.map(separator => ({
        isVisible: isVisible(separator),
        letter: separator.innerText
    }));

    const firstIndex = separatorsFormated.findIndex(separator => separator.isVisible);

    if (firstIndex > 0) {
        const lastSeparator = separatorsFormated[firstIndex - 1];
        return (lastSeparator.letter);
    }
    else {
        return (separatorsFormated[0].letter);
    }
}
