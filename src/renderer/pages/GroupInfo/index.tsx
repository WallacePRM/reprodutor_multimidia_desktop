import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Popup from 'reactjs-popup';
import { FiSpeaker } from 'react-icons/fi';
import { IoPlayOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { HiOutlinePlus } from 'react-icons/hi';
import { HiOutlineX } from 'react-icons/hi';
import { AiOutlineScan } from 'react-icons/ai';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { Media } from '../../../common/medias/types';
import { isOdd } from '../../common/number';
import Margin from '../../components/Animations/Margin';
import LineItem from '../../components/List/LineItem';
import Opacity from '../../components/Animations/Opacity';
import ModalCreatePlaylist from '../../components/Modal/ModalCreatePlaylist';
import ModalRenamePlaylist from '../../components/Modal/ModalRenamePlaylist';
import SelectBlockMedia from '../../components/SelectBlock/SelectBlockMedia';
import useGroupInfo from '../../components/GroupInfo/hook';
import './index.css';

export default function GroupInfo() {

    const { group, pageConfig, headerMinimized, containerWidth, allPlaylists, selectedItems, popupRef, modalRenamePlaylistRef, modalCreatePlaylistRef, mediaPlaying, medias,
        handlePlay, handleSetNextMedias, closeTooltip, openModalCreatePlaylistTooltip, handleSetMediasOnPlaylist, openModalRenamePlatlistTooltip, handleDeletePlaylist,
        onScrollToBottom, handleRemoveMedia } = useGroupInfo();

    const thumbnails = (
        <div className="h-100 w-100" style={{display: medias.length > 1 ? 'grid' : 'flex', gridTemplateColumns: `repeat(2, 1fr)`, gridAutoRows: '1fr', overflow: 'hidden'}}>{
            medias.map((thumbnail, index) => thumbnail ? <LazyLoadImage key={index} style={{borderRadius: 0}} src={thumbnail}/> : <div></div>)}
        </div>
    );
    const icon = <div className="c-group-info__thumbnail__icon"><FiSpeaker className="icon-color--light" /></div>;

    return (
        <div className="c-app c-group-info">
            <div className={'c-container__header c-group-info__header' + (headerMinimized ? ' c-group-info__header--minimized' : '')}>
                <div className="c-group-info__header__container">
                    <div className="c-group-info__thumbnail">
                        {[group.medias.length === 0 || !pageConfig.mediaArt ? icon : thumbnails]}
                    </div>
                    <Opacity cssAnimation={['opacity']} className="c-group-info__description">
                        <div className="c-group-info__title">
                            <h3>{group.name}</h3>
                            <span className="c-group-info__items-count">{group.medias.length + (group.medias.length > 1 ? ' itens' : ' item')}</span>
                        </div>
                        <div className="c-group-info__actions">
                            <button onClick={handlePlay} className={'c-group-info__actions__item c-button box-field btn--primary c-button--no-media-style' + (selectedItems.length > 0 ? ' disabled' : '')}>
                                <div className="c-group-info__actions__item__icons">
                                    <IoPlayOutline className="c-group-info__actions__item__icon c-button__icon mr-5" style={{color: 'rgb(var(--title-color--inverted))'}}/>
                                </div>
                                <span className="c-button__label">Reproduzir</span>
                            </button>
                            {containerWidth > 510 && <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<button className={'c-group-info__actions__item c-button box-field' + (selectedItems.length > 0 ? ' disabled' : '')}><div className="c-group-info__actions__item__icons"><HiOutlinePlus className="c-group-info__actions__item__icon c-button__icon mr-5"/></div><span className="c-button__label">Adicionar a</span></button>} position="right top" >
                                <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                                    <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                        <div onClick={handleSetNextMedias} className="c-popup__item__button-hidden"></div>
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
                            {containerWidth > 780 && <button onClick={openModalRenamePlatlistTooltip} className="c-group-info__actions__item c-button box-field c-button--no-media-style">
                                <div className="c-group-info__actions__item__icons">
                                    <AiOutlineScan className="c-group-info__actions__item__icon c-button__icon mr-5 rotate-90"/>
                                </div>
                                <span className="c-button__label">Renomear</span>
                            </button>}
                            {containerWidth > 890 && <button onClick={handleDeletePlaylist} className="c-group-info__actions__item c-button box-field c-button--no-media-style">
                                <div className="c-group-info__actions__item__icons">
                                    <HiOutlineX className="c-group-info__actions__item__icon c-button__icon mr-5"/>
                                </div>
                                <span className="c-button__label">Excluír</span>
                            </button>}
                            {containerWidth < 890 && <Popup onOpen={e => e?.stopPropagation()} nested keepTooltipInside arrow={false} ref={popupRef} trigger={ <button className="c-select-block__actions__item c-button box-field ml-10">
                                <IoEllipsisHorizontal className="c-button__icon"/>
                                </button>} position="top center">
                                <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '200px' }}>
                                    {containerWidth < 510 && <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div onClick={e => e.stopPropagation()} className={'c-popup__item c-popup__item--row' + (selectedItems.length > 0 ? ' disabled' : '')}><div className="c-popup__item__icons"><HiOutlinePlus className="c-popup__item__icon" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Adicionar a</h3><IoChevronForwardOutline className="c-popup__item__description"/></div></div>} position="right top" >
                                        <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                                            <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                                <div onClick={handleSetNextMedias} className="c-popup__item__button-hidden"></div>
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
                                    {containerWidth < 780 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                        <div onClick={openModalRenamePlatlistTooltip} className="c-popup__item__button-hidden"></div>
                                        <div className="c-popup__item__icons">
                                            <AiOutlineScan className="c-popup__item__icon rotate-90" />
                                        </div>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">Renomear</h3>
                                        </div>
                                    </div>}
                                    {containerWidth < 890 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                        <div onClick={handleDeletePlaylist} className="c-popup__item__button-hidden"></div>
                                        <div className="c-popup__item__icons">
                                            <HiOutlineX className="c-popup__item__icon" />
                                        </div>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">Excluír</h3>
                                        </div>
                                    </div>}
                                </Margin>
                            </Popup>}
                        </div>
                    </Opacity>
                </div>
            </div>

            <Opacity cssAnimation={["opacity"]} className="c-container__content__title" style={headerMinimized ? {marginBottom: 0, paddingBottom: 0} : {marginBottom:  '1.5rem'}}>
                <h3 className="c-container__content__title__text"></h3>
                { selectedItems.length > 0 &&
                <Opacity cssAnimation={["opacity"]}>
                    <SelectBlockMedia listItems={group.medias}/>
                </Opacity>}
            </Opacity>

            <ModalCreatePlaylist
            reference={modalCreatePlaylistRef}
            medias={group.medias}/>

            <ModalRenamePlaylist
            reference={modalRenamePlaylistRef}
            playlist={group}/>

            <div className="c-container__content">
                <Margin onScroll={onScrollToBottom} cssAnimation={['marginTop']} className="c-list c-line-list">
                    {group.medias.map((media, index) => <LineItem
                    fileTypeVisible
                    className={(isOdd(index) ? 'c-line-list__item--nostyle' : '') + (mediaPlaying && mediaPlaying.id === media.id ? ' c-line-list__item--active' : '')}
                    file={media}
                    onPlay={handlePlay}
                    onSelectMedia={handlePlay}
                    onRemove={handleRemoveMedia}
                    key={media.id}/>)}
                </Margin>
            </div>
        </div>
    );
}

export interface GroupInfo {
    id: number,
    name: string,
    medias: Media[]
};