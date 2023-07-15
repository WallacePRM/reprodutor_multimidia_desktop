import React from 'react';
import Popup from 'reactjs-popup';
import { HiOutlinePlus } from 'react-icons/hi';
import { IoChevronDownOutline } from 'react-icons/io5';
import emptyMessageIcon from '../../assets/img/speaker-gradient.svg';
import Button from '../../components/Button';
import EmptyMessage from '../../components/EmptyMessage';
import Margin from '../../components/Animations/Margin';
import Opacity from '../../components/Animations/Opacity';
import PlaylistItem from './PlaylistItem';
import Input from '../../components/Input';
import SelectBlockPlaylist from '../../components/SelectBlock/SelectBlockPlaylist';
import { saveScrollPosition } from '../../common/dom';
import usePlaylists from '../../components/Playlists/hook';

export default function Playlists() {

    const { playlists, inputValue, pageConfig, popupRef, selectedItems, modalCreatePlaylistPopup, filterField,
        setInputValue, handleCreatePlaylist, mapPlaylistOrderBy, handleChangePlaylistsOrderBy, closeTooltip } = usePlaylists();

    return (
        <div className="c-page c-playlists">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Playlists</h1>
            </div>

            { playlists.length > 0 ?
            <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                <div className="d-flex a-items-center">
                        <Popup ref={modalCreatePlaylistPopup} onOpen={() => setInputValue('Playlist sem título')} keepTooltipInside arrow={false} trigger={<div className="c-button box-field btn--primary c-button--no-media-style" style={{maxHeight: '21px'}}><HiOutlinePlus className="c-button__icon mr-10"/><span className="c-button__label">Nova playlist</span></div>}>
                            <Margin cssAnimation={["marginTop"]} className="c-popup c-popup--no-hover bg-acrylic bg-acrylic--popup noselect" style={{minWidth: '300px'}}>
                                <label className="c-popup__item">
                                    <div className="c-popup__item__label">
                                        <Input value={inputValue} onChange={setInputValue} />
                                    </div>
                                </label>
                                <label className="c-popup__item">
                                    <div className="c-popup__item__label" style={{alignItems: 'center'}}>
                                      <Button
                                      onClick={handleCreatePlaylist}
                                      style={{fontSize: '.85rem', width: 'max-content'}}
                                      label="Criar playlist"
                                      className={'btn--primary c-button--no-media-style' +
                                      (inputValue.trim() === '' ? ' disabled' : '')} />
                                    </div>
                                </label>
                            </Margin>
                        </Popup>
                    <div className="c-container__content__title__actions">
                    <Popup keepTooltipInside arrow={false} mouseLeaveDelay={300} mouseEnterDelay={0} ref={popupRef} trigger={<div className="c-container__content__title__actions__item box-field box-field--transparent"><label>Ordernar por: <span className="accent--color">{mapPlaylistOrderBy(filterField)}</span></label><IoChevronDownOutline className="box-field__icon ml-10" /></div>} position="bottom right" >
                            <Margin cssAnimation={["marginTop"]}  className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '130px' }}>
                                <div className={'c-popup__item  c-popup__item--row' + (pageConfig.playlistsOrderBy === 'name' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <div onClick={() => handleChangePlaylistsOrderBy('name')} className="c-popup__item__button-hidden" />
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">A - Z</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                                <div className={'c-popup__item c-popup__item--row' + (pageConfig.playlistsOrderBy === 'modificationDate' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <div onClick={() => handleChangePlaylistsOrderBy('modificationDate')} className="c-popup__item__button-hidden" />
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
                    <SelectBlockPlaylist listItems={playlists}/>
                </Opacity>}
            </Opacity> : null }

            <div className="c-container__content" style={{ height: playlists.length === 0 ? '100%' : '' }}>
                { playlists.length == 0 ?  <EmptyMessage icon={emptyMessageIcon}
                    title="Você não tem playlists"
                    button={
                    <div className="d-flex a-items-center">
                       <Popup ref={modalCreatePlaylistPopup}  keepTooltipInside arrow={false} trigger={<div className="c-button box-field btn--primary c-button--no-media-style" style={{maxHeight: '21px'}}><HiOutlinePlus className="c-button__icon mr-10"/><span className="c-button__label">Criar uma nova lista de reprodução</span></div>}>
                            <Margin cssAnimation={["marginTop"]} className="c-popup c-popup--no-hover bg-acrylic bg-acrylic--popup noselect" style={{minWidth: '300px'}}>
                                <label className="c-popup__item">
                                    <div className="c-popup__item__label">
                                        <Input value={inputValue} onChange={setInputValue} />
                                    </div>
                                </label>
                                <label className="c-popup__item">
                                    <div className="c-popup__item__label" style={{alignItems: 'center'}}>
                                      <Button
                                      onClick={handleCreatePlaylist}
                                      style={{fontSize: '.85rem', width: 'max-content'}}
                                      label="Criar playlist"
                                      className={'btn--primary c-button--no-media-style' +
                                      (inputValue.trim() === '' ? ' disabled' : '')} />
                                    </div>
                                </label>
                            </Margin>
                        </Popup>
                    </div>}
                /> :
                <>
                    <Margin cssAnimation={["marginTop"]}
                    className="c-list c-grid-list"
                    onScroll={saveScrollPosition}>
                        {playlists.map((item) => <PlaylistItem
                        className="c-grid-list__item--playlist"
                        playlist={item}
                        key={item.id}/>)}
                    </Margin>
                </>
                }
            </div>
        </div>
    );
}