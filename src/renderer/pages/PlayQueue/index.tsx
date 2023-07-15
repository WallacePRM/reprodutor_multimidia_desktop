import React, {  } from "react";
import Popup from "reactjs-popup";
import { HiOutlinePlus } from 'react-icons/hi';
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import Button from "../../components/Button";
import LineItem from "../../components/List/LineItem";
import { isOdd } from "../../common/number";
import Margin from "../../components/Animations/Margin";
import Opacity from "../../components/Animations/Opacity";
import SelectBlockMedia from "../../components/SelectBlock/SelectBlockMedia";
import { saveScrollPosition } from "../../common/dom";
import ModalCreatePlaylist from "../../components/Modal/ModalCreatePlaylist";
import usePlayQueue from "../../components/PlayQueue/hook";

export default function PlayQueue() {

    const { currentMedias, popupRef, allPlaylists, selectedItems, modalCreatePlaylistRef, mediaPlaying,
        handleClearQueue, closeTooltip, openModalCreatePlaylist, handleSetMediasOnPlaylist, handleRemoveMedia, handleSelectMedia } = usePlayQueue();

    return (
        <div className="c-page c-play-queue">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Fila de reprodução</h1>
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