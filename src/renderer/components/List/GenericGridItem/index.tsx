import React from "react";
import Popup from "reactjs-popup";
import { RiPlayList2Fill } from 'react-icons/ri';
import { MdOutlineChecklist } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi';
import { HiOutlineX } from 'react-icons/hi';
import { IoPlayOutline } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { FaPlusCircle } from 'react-icons/fa';
import { IoChevronForwardOutline } from "react-icons/io5";
import { AiOutlineScan } from 'react-icons/ai';
import { Media } from '../../../../common/medias/types';
import Opacity from "../../Animations/Opacity";
import Margin from "../../Animations/Margin";
import ModalCreatePlaylist from "../../Modal/ModalCreatePlaylist";
import ModalRenamePlaylist from "../../Modal/ModalRenamePlaylist";
import { isPlaylist } from "../../../common/array";
import { GenericItemProps } from "../models";
import useGenericGridItem from "./hook";
import './index.css';

export default function GenericGridItem(props: GenericItemProps) {

    const { className, active, selectedItems, animation, noSelect, item, selected, popupRef, allPlaylists, modalCreatePlaylistRef, modalRenamePlaylistRef,
            handleSelect, setActive, openTooltip, onMouseDown, onMouseUp, setAnimation, handlePlay, handleSetNextMedia, closeTooltip,
            onRemove, handleSetMediaOnPlaylist, handleChangeSelected, handleRemove, openModalCreatePlaylistTooltip, openModalRenamePlaylistTooltip } = useGenericGridItem(props);

    return (
        <Opacity cssAnimation={["opacity"]}
        onContextMenu={selectedItems.length === 0 ? openTooltip : null}
        className={'c-grid-list__item' +
        (animation ? ' c-grid-list__item--animated ' : '') +
        (active ? ' c-grid-list__item--active' : '') +
        (className ? ' ' + className : '') +
        (selectedItems.length > 0 ? ' select-mode' : '')}>
            <div className="c-grid-list__item__interface">
                <div onClick={selectedItems.length === 0 ? handleSelect : null } className={'c-grid-list--click-event'}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={() => setAnimation(false)}></div>
                <div className="c-grid-list__item__thumbnail" style={ item.thumbnailType === 'icon' ? { border: '1px solid rgb(var(--border-color--dark), .1)'} : {}}>
                    {item.thumbnails}

                    <div className="c-grid-list__item__actions">
                        <div className="c-grid-list__item__actions__item c-grid-list__item__actions__item--play">
                            <IoPlayOutline onClick={handlePlay}/>
                        </div>
                        <Popup
                        nested keepTooltipInside
                        onOpen={() => setActive(true)}
                        onClose={() => setActive(false)}
                        arrow={false}
                        ref={popupRef}
                        trigger={<div className="c-grid-list__item__actions__item c-grid-list__item__actions__item--options"><IoEllipsisHorizontal /></div>} position="top center">
                            <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '200px' }}>
                                <div  className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handlePlay} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <IoPlayOutline className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Reproduzir</h3>
                                    </div>
                                </div>
                                <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handleSetNextMedia} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <IoPlayOutline className="c-popup__item__icon" />
                                        <FaPlusCircle className="c-popup__item__icon c-popup__item__icon--play-next"/>
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Reproduzir em seguida</h3>
                                    </div>
                                </div>
                                <div className="c-popup__item--separator"></div>
                                <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div className={'c-popup__item c-popup__item--row'}><div className="c-popup__item__icons"><HiOutlinePlus className="c-popup__item__icon" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Adicionar a</h3><IoChevronForwardOutline className="c-popup__item__description"/></div></div>} position="right top" >
                                    <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                                        <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                            <div onClick={handleSetNextMedia} className="c-popup__item__button-hidden"></div>
                                            <div className="c-popup__item__icons">
                                                <RiPlayList2Fill className="c-popup__item__icon" />
                                            </div>
                                            <div className="c-popup__item__label">
                                                <h3 className="c-popup__item__title">Fila de reprodução</h3>
                                            </div>
                                        </div>
                                        <div className="c-popup__item--separator"></div>
                                        <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                            <div onClick={openModalCreatePlaylistTooltip} className="c-popup__item__button-hidden"></div>
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
                                                        <div onClick={(e) => handleSetMediaOnPlaylist(e, p)} className="c-popup__item__button-hidden"></div>
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
                                {isPlaylist(item.media) && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={openModalRenamePlaylistTooltip} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <AiOutlineScan className="c-popup__item__icon rotate-90" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Renomear</h3>
                                    </div>
                                </div>}
                                {isPlaylist(item.media) || onRemove && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handleRemove} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <HiOutlineX className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Excluír</h3>
                                    </div>
                                </div>}
                                {!noSelect && <div className="c-popup__item--separator"></div>}
                                {!noSelect && <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                    <div onClick={handleChangeSelected} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <MdOutlineChecklist className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Selecionar</h3>
                                    </div>
                                </div>}
                            </Margin>
                        </Popup>

                        <ModalCreatePlaylist
                        reference={modalCreatePlaylistRef}
                        medias={isPlaylist(item.media) ? (item.media.medias) : [item as any as Media]}/>

                        {isPlaylist(item.media) && <ModalRenamePlaylist
                        reference={modalRenamePlaylistRef}
                        playlist={item.media}/>}
                    </div>
                </div>
                <div className="c-grid-list__item__info">
                    <span className="c-grid-list__item__title" title={item.title}>{item.title}</span>
                    <span className="c-grid-list__item__subtitle">{item.description}</span>
                </div>
            </div>
            {!noSelect && <div onClick={selectedItems.length > 0 ? handleChangeSelected : (e) => e.stopPropagation()} className="c-grid-list__item__actions__item c-grid-list__item__actions__item--checkbox">
                <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                <div onClick={selectedItems.length === 0 ? handleChangeSelected : () => {}} className="checkbox-box"></div>
            </div>}
        </Opacity>
    );
}