import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faShuffle } from "@fortawesome/free-solid-svg-icons";
import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import Button from "../../Button";
import EmptyMessage from "../../EmptyMessage";
import emptyMessageIcon from '../../../assets/img/music-gradient.svg';
import LineItem from '../../List/LineItem';
import { isVisible } from "../../../common/dom";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMediaService } from "../../../service/media";
import { selectMedias, setMedias } from "../../../store/medias";
import { Media } from '../../../../common/medias/types';
import { setCurrentMedias } from "../../../store/player";
import { arrayUnshiftItem, shuffle, sortAsc } from "../../../common/array";
import { isOdd } from "../../../common/number";
import { capitalizeFirstLetter, hasSymbol } from "../../../common/string";
import { selectMediaPlaying, setMediaPlaying } from "../../../store/mediaPlaying";
import Margin from "../../Animations/Margin";
import Opacity from "../../Animations/Opacity";
import { setPlayerState } from "../../../store/playerState";
import { selectPlayerConfig } from "../../../store/playerConfig";
import Popup from "reactjs-popup";
import { selectPageConfig, setPageConfig } from "../../../store/pageConfig";
import { getPageService } from "../../../service/page";
import SelectBlock from "../../SelectBlock";
import { selectSelectedFiles } from "../../../store/selectedFiles";
import { extractFilesInfo } from '../../../service/media/media-handle';
import Load from '../../Load';
import { getFolderService } from '../../../service/folder';
import FilterBlock from '../../FilterBlock';
import { getPlayerService } from '../../../service/player';
import { delay } from '../../../common/async';


function Musics() {

    const [ load, setLoad ] = useState(false);
    const [ filterBlock, setFilterBlock ] = useState(false);

    const selectedItems = useSelector(selectSelectedFiles);
    const pageConfig = useSelector(selectPageConfig);
    const firstRun = pageConfig.firstRun;
    const filterField: string = pageConfig?.musicsOrderBy ? pageConfig.musicsOrderBy : 'name';
    const listItems = useSelector(selectMedias);
    const playerConfig = useSelector(selectPlayerConfig);
    const musics = (listItems.filter(item => item.type === 'music')).sort((a, b) => sortAsc(((a as any)[filterField] || '').toLocaleLowerCase(), ((b as any)[filterField] || '').toLocaleLowerCase()));
    const listSeparators = createSeparators(musics as any, filterField);
    const [ lastSeparatorInvisible, setLastSeparatorInvisible ] = useState<string | null>(listSeparators[0] || '');
    const dispatch = useDispatch();
    const mediaPlaying = useSelector(selectMediaPlaying);
    const popupRef: any = useRef();
    const separatorRef: any = useRef();
    const closeTooltip = () => popupRef.current && popupRef.current.close();
    let fileIndex: number = 0;
    let timeoutId: any = null;

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

            const musicFolder = await getFolderService().insertFolder(fileFolder);
        }
        catch(e) {
            console.log(e);
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

    const handleChangemusicsOrderBy = async (e: React.ChangeEvent<any>) => {

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

        delay(() => {
            saveScrollPosition();
        }, 500);
    };

    const mapSeparatorByFilter = (filter: string) => {

        if (!filter) return mapMusicsOrderBy(filterField) + ' desconhecido';

        return filter;
    };

    const saveScrollPosition = () => {

        delay(async () => {

            const scrollPosition = document.querySelector('.c-list').scrollTop;
            await getPageService().setPageConfig({scrollPosition: scrollPosition});

        }, 500);
    };

    useEffect(() => {

        const restoreScrollPosition = async () => {

            const pageConfig = await getPageService().getPageConfig();

            if (pageConfig.scrollPosition && firstRun) {

                document.querySelector('.c-list').scrollTo(0, pageConfig.scrollPosition);

                dispatch(setPageConfig({firstRun: false}));
            }
            else {
                await getPageService().setPageConfig({scrollPosition: 0});
            }
        };

        restoreScrollPosition();
    }, []);

    return (
        <div className="c-app c-musics">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Música</h1>
                <div className="c-container__header__actions">
                    { musics.length > 0 ? <>
                    <Button onRead={ handleSelectFile } onlyFolder accept="audio/mp3" icon={faFolderClosed} title="Adicionar uma pasta à biblioteca de músicas" label="Adicionar uma pasta" />
                    </> : null }
                </div>
            </div>

            { musics.length > 0 ?
            <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                <div className="d-flex a-items-center">
                    <Button onClick={ handleShuffle } className="btn--primary c-button--no-media-style" label="Ordem aleatória e reproduzir" icon={faShuffle} title={ document.body.clientWidth <= 655 ? 'Ordem aleatória e reproduzir' : ''}/>
                    <div className="c-container__content__title__actions">

                        <Popup keepTooltipInside arrow={false} mouseLeaveDelay={300} mouseEnterDelay={0} ref={popupRef} trigger={<div className="c-container__content__title__actions__item box-field box-field--transparent"><label>Ordernar por: <span className="accent--color">{mapMusicsOrderBy(filterField)}</span></label><FontAwesomeIcon className="box-field__icon ml-10" icon={faChevronDown} /></div>} position="bottom right" >
                            <Margin cssAnimation={["marginTop"]}  className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '130px' }}>
                                <div className={'c-popup__item  c-popup__item--row' + (pageConfig.musicsOrderBy === 'name' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onClick={handleChangemusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="name"/>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">A - Z</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                                <div className={'c-popup__item c-popup__item--row' + (pageConfig.musicsOrderBy === 'author' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onClick={handleChangemusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="author"/>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Artista</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                                <div className={'c-popup__item c-popup__item--row' + (pageConfig.musicsOrderBy === 'album' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onClick={handleChangemusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="album"/>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Álbum</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                                <div className={'c-popup__item c-popup__item--row' + (pageConfig.musicsOrderBy === 'genre' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onClick={handleChangemusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="genre"/>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Gênero</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                                <div className={'c-popup__item c-popup__item--row' + (pageConfig.musicsOrderBy === 'releaseDate' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onClick={handleChangemusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="releaseDate"/>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Ano de lançamento</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                            </Margin>
                        </Popup>

                    </div>
                </div>
                { selectedItems.length > 0 &&
                <Opacity cssAnimation={["opacity"]}>
                    <SelectBlock list={musics}/>
                </Opacity>}
            </Opacity> : null }

            <div className="c-container__content" style={{ height: musics.length === 0 ? '100%' : '' }}>
                {load && <Load style={{backgroundColor: 'rgb(var(--bg-color))'}}/>}
                { musics.length === 0 ?  <EmptyMessage icon={emptyMessageIcon}
                    title="Não foi possível encontrar nenhuma música"
                    description="Sua biblioteca de música não contém nenhum conteúdo de música."
                    button={
                    <div className="d-flex a-items-center">
                        <Button onRead={ handleSelectFile } onlyFolder accept="audio/mp3" className="btn--primary c-button--no-media-style" icon={faFolderClosed} title="Adicionar pasta" label="Adicionar uma pasta" />
                    </div>}
                /> :

                <>
                    {filterBlock && <FilterBlock onSelectItem={hanndleGoToFilterSelected} filterList={listSeparators} filter={filterField} ></FilterBlock>}
                    <Margin cssAnimation={["marginTop"]} onScroll={onScrollToBottom} className="c-list c-line-list">
                        <div onClick={handleShowUpFilterBlock} ref={separatorRef} className="w-100"><div className={'c-line-list__separator c-line-list__separator--fixed z-index-1'} style={{width: separatorRef.current ? separatorRef.current.offsetWidth : '100%'}}><span className="accent--color">{capitalizeFirstLetter(lastSeparatorInvisible || '')}</span></div></div>

                        {
                            listSeparators.map((separator) => {

                                const elements: React.ReactNode[] = [];
                                elements.push(<div onClick={handleShowUpFilterBlock} className={'c-line-list__separator accent--color'} key={separator}>{capitalizeFirstLetter(separator)}</div>);

                                let musicsFiltred: Media[] = [];
                                if (filterField === 'name') {
                                    musicsFiltred = musics.filter(item => mapListSeparators((item[filterField] || '').charAt(0).toLocaleUpperCase()) === separator);
                                }
                                else {
                                    musicsFiltred = musics.filter(item => mapSeparatorByFilter((item as any)[filterField]) === separator);
                                }

                                musicsFiltred.forEach((item) => {

                                    elements.push(<LineItem onClick={ handleSelectMedia } className={(isOdd(fileIndex) ? 'c-line-list__item--nostyle' : '') + (item.id === mediaPlaying?.id ? ' c-line-list__item--active' : '')} file={item} key={item.id}/>);
                                    fileIndex++;
                                });

                                return elements;
                            })
                        }
                    </Margin>
                </>
                }
            </div>
        </div>
    );
}

function mapMusicsOrderBy(musicsOrderBy: string) {

    if (musicsOrderBy === 'name') return 'A - Z';
    if (musicsOrderBy === 'author') return 'Artista';
    if (musicsOrderBy === 'album') return 'Álbum';
    if (musicsOrderBy === 'genre') return 'Gênero';
    if (musicsOrderBy === 'releaseDate') return 'Ano de lançamento';

    return 'Aleatório';
}

function mapListSeparators(letter: string) {

    // Se for número, adicionar #
    if (!isNaN(parseInt(letter))) return '#';

    // Se for caractere especial, adicionar &
    if (hasSymbol(letter))  return '&';

    return letter;
}

function createSeparators(listItems: Media[], filterField: string) {

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

function createLastSeparator() {

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

export default Musics;
