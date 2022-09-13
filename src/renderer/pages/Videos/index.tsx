import React, { useEffect, useState } from 'react';
import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { useSelector } from "react-redux";
import { sortAsc } from "../../common/array";
import { selectMedias, setMedias } from "../../store/medias";
import Button from "../../components/Button";
import EmptyMessage from "../../components/EmptyMessage";
import emptyMessageIcon from "../../assets/img/video.svg";
import { useDispatch } from "react-redux";
import GridItem from "../../components/List/GridItem";
import { setCurrentMedias } from "../../store/player";
import { Media } from '../../../common/medias/types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getMediaService } from "../../service/media";
import { selectMediaPlaying, setMediaPlaying } from "../../store/mediaPlaying";
import { setPlayerMode } from "../../store/playerMode";
import Margin from "../../components/Animations/Margin";
import Opacity from "../../components/Animations/Opacity";
import { setPlayerState } from "../../store/playerState";
import Popup from "reactjs-popup";
import { useRef } from "react";
import SelectBlock from "../../components/SelectBlock";
import { selectSelectedFiles } from "../../store/selectedFiles";
import { selectPageConfig, setPageConfig } from "../../store/pageConfig";
import { getPageService } from "../../service/page";
import { extractFilesInfo } from '../../service/media/media-handle';
import Load from '../../components/Load';
import { getFolderService } from '../../service/folder';
import { getPlayerService } from '../../service/player';
import { delay } from '../../common/async';

import './index.css';

function Videos() {

    const [ load, setLoad ] = useState(false);

    const selectedItems = useSelector(selectSelectedFiles);
    const listItems = useSelector(selectMedias);
    const pageConfig = useSelector(selectPageConfig);
    const firstRun = pageConfig.firstRun;
    const filterField = pageConfig?.videosOrderBy ? pageConfig.videosOrderBy : 'name';
    const videoList = getVideosFromMedias(listItems, filterField);
    const files: any[] = [];
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
        catch(e) {
            console.log(e);
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
        <div className="c-page c-videos">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Vídeo</h1>
                <div className="c-container__header__actions">
                    { videoList.length > 0 && <Button onRead={handleSelectFile} onlyFolder accept="video/mp4" title="Procure arquivos para reproduzir" label="Adicionar pasta" icon={faFolderClosed} />}
                </div>
            </div>

            { videoList.length > 0 &&
            <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                <div className="d-flex a-items-center">
                    <div className="c-container__content__title__actions">
                        <Popup keepTooltipInside arrow={false} mouseLeaveDelay={300} mouseEnterDelay={0} ref={popupRef} trigger={<div className="c-container__content__title__actions__item box-field box-field--transparent"><label>Ordernar por: <span className="accent--color">{mapvideosOrderBy(filterField)}</span></label><FontAwesomeIcon className="box-field__icon ml-10" icon={faChevronDown} /></div>} position="bottom right" >
                            <Margin cssAnimation={["marginTop"]}  className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '130px' }}>
                                <div className={'c-popup__item  c-popup__item--row' + (pageConfig.videosOrderBy === 'name' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onChange={() => {}} onClick={handleChangeOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="name"/>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">A - Z</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                                <div onChange={() => {}} className={'c-popup__item  c-popup__item--row' + (pageConfig.videosOrderBy === 'releaseDate' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onClick={handleChangeOrderBy} className="c-popup__item__button-hidden" value="releaseDate"></input>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Data de modificação</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                            </Margin>
                        </Popup>
                    </div>
                </div>
                { selectedItems.length > 0 &&
                <Opacity cssAnimation={["opacity"]}>
                    <SelectBlock list={videoList}/>
                </Opacity>}
            </Opacity>
            }

            <div className="c-container__content" style={{ height: videoList.length === 0 ? '100%' : '' }}>
                {load && <Load style={{backgroundColor: 'rgb(var(--bg-color))'}}/>}
                { videoList.length == 0 ?  <EmptyMessage icon={emptyMessageIcon}
                    title="Não conseguimos encontrar nenhum vídeo"
                    description="Sua biblioteca de vídeos não contém nenhum conteúdo de vídeo."
                    button={<div className="d-flex a-items-center">
                    <Button onRead={handleSelectFile} onlyFolder accept="video/mp4" className="btn--primary c-button--no-media-style" label="Adicionar pasta" icon={faFolderClosed}/>
                    </div>}
                /> :
                <>
                    <Margin onScroll={saveScrollPosition} cssAnimation={["marginTop"]} className="c-list c-grid-list">
                        {videoList.map((item) => <GridItem className="c-grid-list__item--video"  onClick={ handleSelectMedia } file={item} key={item.id}/>)}
                    </Margin>
                </>
                }
            </div>
        </div>
    );
}

const getVideosFromMedias = (list: Media[], filterField: string) => {

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

const mapvideosOrderBy = (videosOrderBy: string) => {

    if (videosOrderBy === 'name') return 'A - Z';
    if (videosOrderBy === 'releaseDate') return 'Data de modificação';

    return 'Aleatório';
};


export default Videos;