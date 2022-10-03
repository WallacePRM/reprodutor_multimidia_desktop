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

function PlayQueue() {

    const medias: any = null;
    const allPlaylists = useSelector(selectPlaylists);
    const pageConfig = useSelector(selectPageConfig);
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

    return (
        <div className="c-page c-play-queue">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Fila de reprodução</h1>
                <div className="c-container__header__actions">
                    {/* <Button title="Procure arquivos para reproduzir" label="Abrir arquivo(s)" icon={faFolderClosed} style={{ borderRadius: '.3rem 0 0 .3rem', borderRight: 0 }}/> */}
                    {/* <Popup keepTooltipInside arrow={false} ref={popupRef} trigger={<button className="c-button box-field" style={{ borderRadius: '0 .3rem .3rem 0' }} title="Mais opções para abrir mídia"><FontAwesomeIcon className="c-button__icon" icon={faChevronDown}/></button>} position="bottom right" >
                        <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect">
                            <label className="c-popup__item" onClick={closeTooltip}>
                                <Button className="c-popup__item__button-hidden" onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <FontAwesomeIcon className="c-popup__item__icon" icon={faFolderClosed} />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Adicionar arquivo(s) à fila de reprodução</h3>
                                    <span className="c-popup__item__description">Procurar arquivos para adicionar à fila de reprodução</span>
                                </div>
                            </label>
                            <div className="c-popup__item" onClick={closeTooltip}>
                                <Button className="c-popup__item__button-hidden" onlyFolder onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <FontAwesomeIcon className="c-popup__item__icon" icon={faFolder} />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Adicionar pasta à fila de reprodução</h3>
                                    <span className="c-popup__item__description">Escolha uma pasta e adicione todas as mídias nessa pasta à fila de reprodução</span>
                                </div>
                            </div>
                            <div className="c-popup__item" onClick={closeTooltip}>
                                <div className="c-popup__item__icons">
                                    <FontAwesomeIcon className="c-popup__item__icon" icon={faLink} />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Adicionar uma mídia da URL para reproduzir na fila</h3>
                                    <span className="c-popup__item__description">Insíra uma URL e a mídia desse endereço à fila de reprodução</span>
                                </div>
                            </div>
                        </Margin>
                    </Popup> */}
                </div>
            </div>
            <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                <div className="d-flex a-items-center">
                    <div className={'c-container__content__title__actions' + (currentMedias.length === 0 ? ' disabled' : '')} style={{ margin: '0' }}>
                        <Button onClick={handleClearQueue}
                        className="c-button--large mr-10"
                        label="Limpar"
                        icon={faTrashCan}
                        title="Limpar (Ctrl+Shift+X)"
                        style={{height: 'auto'}}/>

                        <Popup keepTooltipInside nested
                        ref={popupRef}
                        closeOnDocumentClick={false}
                        arrow={false} on="hover"
                        mouseLeaveDelay={300}
                        mouseEnterDelay={300}
                        trigger={<button className="c-button box-field c-button--large" style={{height: 'auto'}}><HiOutlinePlus className="c-button__icon mr-10" /><span className="c-button__label">Adicionar a</span></button>} position="right top" >
                            <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                                <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                    <div onClick={openModalCreatePlaylist} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <HiOutlinePlus className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Nova playlist</h3>
                                    </div>
                                </div>
                                {allPlaylists.length > 0 &&
                                    allPlaylists.map((p, index) => {


                                        return (
                                            <div key={index} className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                                <div onClick={(e) => handleSetMediasOnPlaylist(e, {...p, medias: [...p.medias] })} className="c-popup__item__button-hidden"></div>
                                                <div className="c-popup__item__icons" style={{opacity: 0}}>
                                                    <HiOutlinePlus className="c-popup__item__icon" />
                                                </div>
                                                <div className="c-popup__item__label">
                                                    <h3 className="c-popup__item__title">{p.name}</h3>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </Margin>
                        </Popup>
                    </div>
                </div>
                { selectedItems.length > 0 &&
                <Opacity cssAnimation={["opacity"]}>
                    <SelectBlockMedia listItems={currentMedias}/>
                </Opacity>}
            </Opacity>

            <ModalCreatePlaylist
            medias={currentMedias}
            reference={modalCreatePlaylistRef}
            onOpen={closeTooltip}/>

            <div className="c-container__content" style={{ height: currentMedias.length === 0 ? '100%' : '' }}>
                { currentMedias.length > 0 &&
                    <Margin onScroll={saveScrollPosition} cssAnimation={["marginTop"]} className="c-list c-line-list">
                        { currentMedias.map((item, index) => <LineItem onRemove={handleRemoveMedia} onSelectMedia={null} onPlay={ handleSelectMedia } fileTypeVisible className={(isOdd(index) ? 'c-line-list__item--nostyle' : '') + (item.id === mediaPlaying?.id ? ' c-line-list__item--active' : '')} file={item} key={item.id} />) }
                    </Margin>
                }
            </div>
        </div>
    );
}

export default PlayQueue;