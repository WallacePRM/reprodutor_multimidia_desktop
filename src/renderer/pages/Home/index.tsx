import React, { useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup";

import Button from "../../components/Button";
import EmptyMessage from "../../components/EmptyMessage";
import emptyMessageIcon from '../../assets/img/men-headset.svg';
import GridItem from '../../components/List/GridItem';
import { useDispatch, useSelector } from "react-redux";
import { getMediaService } from "../../service/media";
import { selectMedias, setMedias } from "../../store/medias";
import { Media } from '../../../common/medias/types';
import { selectMediaPlaying, setMediaPlaying } from "../../store/mediaPlaying";
import { setPlayerMode } from "../../store/playerMode";
import { arrayUnshiftItem, revertOrder } from "../../common/array";
import Margin from "../../components/Animations/Margin";
import Opacity from "../../components/Animations/Opacity";
import { setPlayerState } from "../../store/playerState";

import TranformOpacity from "../../components/Animations/TransformOpacity";
import { delay, validateUrl } from "../../common/async";
import SelectBlock from "../../components/SelectBlock";
import { selectSelectedFiles } from "../../store/selectedFiles";
import { extractFilesInfo } from "../../service/media/media-handle";
import Load from "../../components/Load";
import { setCurrentMedias } from "../../store/player";
import { getPlayerService } from "../../service/player";
import { getPageService } from "../../service/page";
import { selectPageConfig, setPageConfig } from "../../store/pageConfig";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faLink } from "@fortawesome/free-solid-svg-icons";
import { faFolder, faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { BsFolder } from 'react-icons/bs';
import { BsFolder2Open } from 'react-icons/bs';
import { VscGlobe } from 'react-icons/vsc';

function Home() {

    const [ urlType, setUrlStype ] = useState('video');
    const [ urlValidate, setUrlValidate ] = useState(false);
    const [ load, setLoad ] = useState(false);

    const listItems = useSelector(selectMedias);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const selectedItems = useSelector(selectSelectedFiles);
    const pageConfig = useSelector(selectPageConfig);
    const firstRun = pageConfig.firstRun;
    // const itemIndex = listItems.findIndex(item => item.id === mediaPlaying?.id);
    let recentMedias: any[] = revertOrder(listItems);
    const popupRef: any = useRef();
    const modalRef: any = useRef();
    const urlRef: any = useRef(null);
    const listRef: any = useRef(null);
    const closeTooltip = () => setTimeout(() => popupRef.current && popupRef.current.close(), 0);
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

            dispatch(setCurrentMedias(medias));
            await getPlayerService().setLastMedia({current_medias: medias});

            dispatch(setMediaPlaying(medias[0]));
            dispatch(setPlayerMode('full'));
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

        dispatch(setCurrentMedias([file]));
        await getPlayerService().setLastMedia({current_medias: [file]});

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

    const handleChangeUrlType = (e: any) => {

        const urlType = e.currentTarget.value;
        setUrlStype(urlType);
    };

    const handleValidateUrl = (e: React.ChangeEvent) => {

        const url = (e.currentTarget as any).value;
        setUrlValidate(validateUrl(url));
    };

    const saveScrollPosition = () => {

        delay(async () => {

            const scrollPosition = document.querySelector('.c-list').scrollTop;
            await getPageService().setPageConfig({scrollPosition: scrollPosition});

        }, 500);
    };

    const mapUrlType = (type: string) => {

        if (type === 'video')  return 'Vídeo(s)';
        if (type === 'music')  return 'Música(s)';

        return 'Arquivo(s)';
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

    // useEffect(() => {

    //     const orderByRecents = () => {

    //         if (itemIndex !== -1) {
    //             recentMedias = arrayUnshiftItem(recentMedias, itemIndex);
    //             dispatch(setMedias(recentMedias));
    //         }
    //     };

    //     orderByRecents();
    // }, [mediaPlaying?.id]);

    return (
        <div className="c-app c-home">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Início</h1>
                <div className="c-container__header__actions">
                    { listItems.length > 0 ? <>
                    <Button onRead={ handleSelectFile } accept="audio/*,video/*" title="Procure arquivos para reproduzir" label="Abrir arquivo(s)" icon={faFolderClosed} style={{ borderRadius: '.3rem 0 0 .3rem', borderRight: 0 }}/>
                    <Popup arrow={false} ref={popupRef} keepTooltipInside trigger={<button className="c-button box-field" style={{ borderRadius: '0 .3rem .3rem 0' }} title="Mais opções para abrir mídia"><FontAwesomeIcon className="c-button__icon" icon={faChevronDown}/></button>} position="bottom right" >
                        <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect">
                            <label className="c-popup__item" >
                                <Button className="c-popup__item__button-hidden" onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <BsFolder2Open className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir arquivo(s)</h3>
                                    <span className="c-popup__item__description">Procure arquivos para reproduzir</span>
                                </div>
                            </label>
                            <div className="c-popup__item">
                                <Button className="c-popup__item__button-hidden" onlyFolder onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <BsFolder className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir pasta</h3>
                                    <span className="c-popup__item__description">Escolha uma pasta e reproduza todas as mídias nessa pasta</span>
                                </div>
                            </div>
                            <div className="c-popup__item">
                                <div className="c-popup__item__button-hidden" onClick={openModalTooltip}></div>
                                <div className="c-popup__item__icons">
                                    <VscGlobe className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir URL</h3>
                                    <span className="c-popup__item__description">Insíra uma URL e faça streaming de mídia desse endereço</span>
                                </div>
                            </div>
                        </Margin>
                    </Popup>

                    <Popup onOpen={() => closeTooltip()} ref={modalRef} modal closeOnDocumentClick={false} arrow={false} keepTooltipInside overlayStyle={{backgroundColor: "rgb(var(--modal-bg-color), .35)"}}>
                        <TranformOpacity cssAnimation={["transform"]} className="c-modal noselect">
                            <div className="c-modal__header">
                                <h3 className="c-modal__title">Abrir um URL</h3>
                            </div>
                            <div className="c-modal__content">
                                <div className="c-modal__content__item">
                                    <input onChange={handleValidateUrl} ref={urlRef} placeholder="Insira a URL de um arquivo, streaming ou playlist" className="box-field box-field--input flex-1" type="url"/>
                                </div>
                                <div className="c-modal__content__item mt-20">
                                    <label className="c-modal__content__item__label">Tipo: </label>
                                    <div className="d-flex a-items-center">
                                        <Button onClick={() => {}} className="c-button--no-media-style" label={mapUrlType(urlType)} style={{ borderRadius: '.3rem 0 0 .3rem' }} />
                                        <Popup nested arrow={false} ref={popupRef} keepTooltipInside trigger={<button className="c-button box-field" style={{ borderRadius: '0 .3rem .3rem 0', borderLeft: 'none' }} title="Mais opções para abrir mídia"><FontAwesomeIcon className="c-button__icon" icon={faChevronDown}/></button>} position="bottom right" >
                                            <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{minWidth: '100px'}}>
                                                <label className="c-popup__item" onClick={closeTooltip}>
                                                    <input onClick={handleChangeUrlType} className="c-popup__item__button-hidden" type="text" defaultValue="video"/>
                                                    <div className="c-popup__item__label">
                                                        <h3 className="c-popup__item__title">Vídeo(s)</h3>
                                                    </div>
                                                </label>
                                                <div className="c-popup__item" onClick={closeTooltip}>
                                                <input onClick={handleChangeUrlType} className="c-popup__item__button-hidden" type="text" defaultValue="music"/>
                                                    <div className="c-popup__item__label">
                                                        <h3 className="c-popup__item__title">Música(s)</h3>
                                                    </div>
                                                </div>
                                            </Margin>
                                        </Popup>
                                    </div>
                                </div>
                            </div>
                            <div className="c-modal__footer">
                                <Button onClick={handleOpenUrl} className={'flex-1 d-flex a-items-center j-content-center btn--primary c-button--no-media-style' + (!urlValidate ? ' disabled' : '')} label="Abrir"/>
                                <Button onClick={() => closeModalTooltip()}  className="flex-1 d-flex a-items-center j-content-center ml-10 c-button--no-media-style" label="Cancelar"/>
                            </div>
                        </TranformOpacity>
                    </Popup>
                    </> : null }
                </div>
            </div>

            { listItems.length > 0 ?
                <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                    <h3 className="c-container__content__title__text">Mídia recente</h3>
                    { selectedItems.length > 0 &&
                    <Opacity cssAnimation={["opacity"]}>
                        <SelectBlock list={listItems}/>
                    </Opacity>}
                </Opacity>
            : null }

            <div className="c-container__content" style={{ height: listItems.length === 0 ? '100%' : '' }}>
                {load && <Load style={{backgroundColor: 'rgb(var(--bg-color))'}}/>}
                { listItems.length == 0 ?  <EmptyMessage icon={emptyMessageIcon}
                    title="Conheça o novo Reprodutor Multimídia"
                    description="Use este aplicativo para reproduzir seus arquivos de áudio e vídeo e explorar suas bibliotecas pessoais."
                    button={<div className="d-flex a-items-center">
                    <Button onRead={ handleSelectFile } accept="audio/*,video/*" className="btn--primary c-button--no-media-style" label="Abrir arquivo" icon={faFolderClosed} style={{ borderRadius: '.3rem 0 0 .3rem', borderRight: 0 }}/>
                    <Popup arrow={false} ref={popupRef} keepTooltipInside trigger={<button className="btn--primary c-button box-field" style={{ borderRadius: '0 .3rem .3rem 0' }} title="Mais opções para abrir mídia"><FontAwesomeIcon className="c-button__icon" icon={faChevronDown}/></button>} position="bottom right" >
                        <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect">
                            <label className="c-popup__item">
                                <Button className="c-popup__item__button-hidden" onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    {/* <FontAwesomeIcon className="c-popup__item__icon" icon={faFolderClosed} /> */}
                                    <BsFolder2Open className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir arquivo(s)</h3>
                                    <span className="c-popup__item__description">Procure arquivos para reproduzir</span>
                                </div>
                            </label>
                            <div className="c-popup__item">
                                <Button className="c-popup__item__button-hidden" onlyFolder onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <BsFolder className="c-popup__item__icon"/>
                                    {/* <FontAwesomeIcon className="c-popup__item__icon" icon={faFolder} /> */}
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir pasta</h3>
                                    <span className="c-popup__item__description">Escolha uma pasta e reproduza todas as mídias nessa pasta</span>
                                </div>
                            </div>

                            <Popup ref={modalRef} modal closeOnDocumentClick={false} arrow={false} keepTooltipInside trigger={<div className="c-popup__item" onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={closeTooltip}></div>
                                <div className="c-popup__item__icons">
                                    <VscGlobe className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir URL</h3>
                                    <span className="c-popup__item__description">Insíra uma URL e faça streaming de mídia desse endereço</span>
                                </div>
                            </div>}>
                                <Margin cssAnimation={["marginTop"]} className="c-modal bg-acrylic bg-acrylic--popup noselect">
                                    <div className="c-modal__header">
                                        <h3 className="c-modal__title">Abrir um URL</h3>
                                    </div>
                                    <div className="c-modal__content">
                                        <input className="box-field box-filed--input" type="text" />
                                    </div>
                                    <div className="c-modal__footer">
                                        <Button className="btn--primary" label="Abrir"/>
                                        <Button onClick={() => closeModalTooltip()} label="Cancelar"/>
                                    </div>
                                </Margin>
                            </Popup>
                        </Margin>
                    </Popup></div>}
                /> :
                <>
                    <Margin onScroll={saveScrollPosition} cssAnimation={["marginTop"]} className="c-list c-grid-list">
                        {recentMedias.map((item) => <GridItem onClick={ handleSelectMedia } file={item} key={item.id}/>)}
                    </Margin>
                </>
                }
            </div>
        </div>
    );
}

export default Home;