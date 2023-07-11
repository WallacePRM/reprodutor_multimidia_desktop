import React from 'react';
import Popup from 'reactjs-popup';
import { IoPlayOutline } from 'react-icons/io5';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { IoFilmOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { MdOutlineChecklist } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi';
import { HiOutlineX } from 'react-icons/hi';
import { FaPlusCircle } from 'react-icons/fa';
import { IoChevronForwardOutline } from "react-icons/io5";
import { formatHHMMSS } from '../../../common/time';
import Opacity from '../../Animations/Opacity';
import Margin from '../../Animations/Margin';
import ModalCreatePlaylist from '../../Modal/ModalCreatePlaylist';
import { LineItemFileProps } from '../models';
import useLineItem from './hook';
import './index.css';

export default function LineItem(props: LineItemFileProps) {

    const { className, noSelect, fileTypeVisible, selectedItems, mediaPlaying, file, selected, allPlaylists, popupRef, modalRef,
        onRemove, handleChangeSelected, handleDeleteMedia, handlePlay, handleSelectMedia, handleSetMediaOnPlaylist, handleSetNextMedia, openModalTooltip, openTooltip, closeTooltip } = useLineItem(props);

    return (
        <Opacity cssAnimation={["opacity"]} className={'c-line-list__item' +
        (className ? ` ${className}` : '') +
        (selectedItems.length > 0 ? ' select-mode' : '')}
        onClick={handleSelectMedia}
        onContextMenu={selectedItems.length === 0 ? openTooltip : null}>

            { mediaPlaying?.id === file.id &&
            <div className={'c-line-animated c-line-list__item--active-icon' + ( mediaPlaying.isPlaying ? ' c-line-animated--start' : '')}>
                <div className="c-line-animated__item c-line-animated__item--first"></div>
                <div className="c-line-animated__item c-line-animated__item--second"></div>
                <div className="c-line-animated__item c-line-animated__item--third"></div>
            </div>
            }
            {fileTypeVisible &&
            <div className={'c-line-list__item__type-icon' + (mediaPlaying?.id === file.id ? ' accent--color' : '')}>
                { file?.type === 'music' && <IoMusicalNotesOutline /> }
                { file?.type === 'video' && <IoFilmOutline /> }
            </div>}
            {!noSelect && <div onClick={selectedItems.length > 0 ? handleChangeSelected : (e) => e.stopPropagation()} className="c-line-list__item__actions c-line-list__item__actions--checkbox">
                <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                <label onClick={selectedItems.length === 0 ? handleChangeSelected : () => {}} className="checkbox-box"></label>
            </div>}
            <div className="c-line-list__item__actions">
                <div onClick={ handlePlay } className="c-line-list__item__actions__item">
                    <IoPlayOutline className="accent--color"/>
                </div>
            </div>
            <div className="c-line-list__item__info c-line-list__item__title" >
                <span>{file.name}</span>
            </div>
            <div className="c-line-list__item__info c-line-list__item__singer" >
                <span>{file.author ? file.author : 'Artista desconhecido'}</span>
            </div>
            <div className="c-line-list__item__info c-line-list__item__album" >
                <span>{file.album ? file.album : 'Álbum desconhecido'}</span>
            </div>
            <div className="c-line-list__item__info">

                <span className="c-line-list__item__releaseDate">{file.releaseDate ? new Date(file.releaseDate).getFullYear() : ''}</span>
                <span className="c-line-list__item__genre ml-10"> {file.genre ? file.genre : 'Gênero desconhecido'}</span>

            </div>
            <div className="c-line-list__item__info c-line-list__item__duration">
                <span>{file?.duration ? formatHHMMSS(file?.duration) : '00:00'}</span>
            </div>

            <Popup nested keepTooltipInside
                onClose={e => e.stopPropagation()}
                arrow={false}
                ref={popupRef}
                trigger={<div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}></div>} position="top center">
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
                                <div onClick={openModalTooltip} className="c-popup__item__button-hidden"></div>
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
                                            <div onClick={(e) => handleSetMediaOnPlaylist(e, {...p, medias: [...p.medias] })} className="c-popup__item__button-hidden"></div>
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
                    {onRemove && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                        <div onClick={handleDeleteMedia} className="c-popup__item__button-hidden"></div>
                        <div className="c-popup__item__icons">
                            <HiOutlineX className="c-popup__item__icon" />
                        </div>
                        <div className="c-popup__item__label">
                            <h3 className="c-popup__item__title">Remover</h3>
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
            reference={modalRef}
            medias={[file]}/>
        </Opacity>
    );
}