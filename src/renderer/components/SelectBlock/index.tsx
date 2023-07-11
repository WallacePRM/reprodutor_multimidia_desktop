import React, {  } from 'react';
import Popup from 'reactjs-popup';
import { IoPlayOutline } from 'react-icons/io5';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { HiOutlineX } from 'react-icons/hi';
import { RiPlayList2Fill } from 'react-icons/ri';
import { HiOutlinePlus } from 'react-icons/hi';
import { FaPlusCircle } from 'react-icons/fa';
import { AiOutlineScan } from 'react-icons/ai';
import { Media } from '../../../common/medias/types';
import Margin from '../Animations/Margin';
import { Playlist } from '../../../common/playlists/types';
import { isPlaylist } from '../../common/array';
import ModalCreatePlaylist from '../Modal/ModalCreatePlaylist';
import ModalRenamePlaylist from '../Modal/ModalRenamePlaylist';
import useSelectBlock from './hook';
import './index.css';

export default function SelectBlock(props: SelectBlockProps) {

    const { selected, selectedItems, containerWidth, modalRenamePlaylistRef, modalCreatePlaylistRef, allPlaylists, list, mediasSelected, popupRef,
        handleSelectAllItems, handleClearSelectedItems, handlePlaySelectedItems, handleSetNextSelectedItems, openModalCreatePlaylistTooltip, handleSetMediasOnPlaylist,
        openModalRenamePlaylistTooltip, handleDeleteSelectedItems, onRemove, clearSelectedItems, closeTooltip } = useSelectBlock(props);
    
    return (
        <div className="c-select-block">
            <div className="c-select-block__info">
                <label onClick={handleSelectAllItems} className="d-flex a-items-center">
                    <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                    <div className="checkbox-box mr-5"></div>
                    <span>{selectedItems.length > 1 ? selectedItems.length + ' itens' : selectedItems.length + ' item'} selecionado</span>
                </label>
                <span onClick={handleClearSelectedItems} className="c-select-block__item--clear accent--color">Limpar</span>
            </div>
            <div className="c-select-block__actions">
                <button onClick={handlePlaySelectedItems} className="c-select-block__actions__item c-button box-field btn--primary c-button--no-media-style">
                    <div className="c-select-block__actions__item__icons">
                        <IoPlayOutline className="c-select-block__actions__item__icon c-button__icon mr-5" style={{color: 'rgb(var(--title-color--inverted))'}}/>
                    </div>
                    <span className="c-button__label">Reproduzir</span>
                </button>
                {containerWidth >= 790 && <button onClick={handleSetNextSelectedItems} className="c-select-block__actions__item c-button box-field ">
                    <div className="c-select-block__actions__item__icons">
                        <IoPlayOutline className="c-select-block__actions__item__icon c-button__icon mr-5"/>
                        <FaPlusCircle className="c-select-block__actions__item__icon c-select-block__actions__item__icon--play-next"/>
                    </div>
                    <span className="c-button__label">Reproduzir em seguida</span>
                </button>}

                {containerWidth > 910 &&
                <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<button className="c-select-block__actions__item c-button box-field "><div className="c-select-block__actions__item__icons"><HiOutlinePlus className="c-select-block__actions__item__icon c-button__icon mr-5"/></div><span className="c-button__label">Adicionar a</span></button>} position="right top" >
                    <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                        <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                            <div onClick={handleSetNextSelectedItems} className="c-popup__item__button-hidden"></div>
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
                                    <div key={index} className="c-popup__item c-popup__item--row">
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
                </Popup>}
                {containerWidth > 910 && selectedItems.length === 1 && isPlaylist(list[0]) && <button onClick={openModalRenamePlaylistTooltip} className="c-select-block__actions__item c-button box-field ">
                    <AiOutlineScan className="c-button__icon mr-5 rotate-90"/>
                    <span className="c-button__label">Renomear</span>
                </button>}

                {onRemove && containerWidth > 1030 && <button onClick={handleDeleteSelectedItems} className="c-select-block__actions__item c-button box-field ">
                    <div className="c-select-block__actions__item__icons">
                        <HiOutlineX className="c-select-block__actions__item__icon c-button__icon mr-5"/>
                    </div>
                    <span className="c-button__label">{isPlaylist(list[0]) ? 'Excluír' : 'Remover'}</span>
                </button>}

                {(containerWidth < 910 && selectedItems.length === 1 || containerWidth < 910 && selectedItems.length > 1) && <Popup onOpen={e => e?.stopPropagation()} nested keepTooltipInside arrow={false} ref={popupRef} trigger={ <button className="c-select-block__actions__item c-button box-field ml-10">
                    <IoEllipsisHorizontal className="c-button__icon"/>
                    </button>} position="top center">
                    <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '200px' }}>
                        {containerWidth < 790 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div onClick={handleSetNextSelectedItems} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <IoPlayOutline className="c-popup__item__icon" />
                                <FaPlusCircle className="c-popup__item__icon c-popup__item__icon--play-next"/>
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Reproduzir em seguida</h3>
                            </div>
                        </div>}

                        {containerWidth < 910 && <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div onClick={e => e.stopPropagation()} className={'c-popup__item c-popup__item--row'}><div className="c-popup__item__icons"><HiOutlinePlus className="c-popup__item__icon" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Adicionar a</h3><IoChevronForwardOutline className="c-popup__item__description"/></div></div>} position="right top" >
                            <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                                <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                    <div onClick={handleSetNextSelectedItems} className="c-popup__item__button-hidden"></div>
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
                        </Popup>}
                        {containerWidth < 910 && selectedItems.length === 1 && isPlaylist(list[0]) && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div onClick={openModalRenamePlaylistTooltip} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <AiOutlineScan className="c-popup__item__icon rotate-90" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Renomear</h3>
                            </div>
                        </div>}
                        {onRemove && containerWidth < 1030 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div onClick={handleDeleteSelectedItems} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <HiOutlineX className="c-popup__item__icon" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">{isPlaylist(list[0]) ? 'Excluír' : 'Remover'}</h3>
                            </div>
                        </div>}
                    </Margin>
                </Popup>}

                <ModalCreatePlaylist
                reference={modalCreatePlaylistRef}
                medias={mediasSelected}
                onClose={clearSelectedItems}/>

                {selectedItems.length === 1 && isPlaylist(list[0]) && <ModalRenamePlaylist
                reference={modalRenamePlaylistRef}
                playlist={(list as Playlist[]).find((p: Playlist) => p.id === selectedItems[0].id)}
                onClose={clearSelectedItems}/>}
            </div>
        </div>
    );
}

export interface SelectBlockProps {
    list: Media[] | Playlist[];
    onPlay: () => void;
    onSetNext: () => void;
    onSetInPlaylist: (playlist: Playlist) => void;
    onRemove?: () => void;
};