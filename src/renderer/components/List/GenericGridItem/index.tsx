import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Popup from "reactjs-popup";

import { RiPlayList2Fill } from 'react-icons/ri';
import { MdOutlineChecklist } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi';
import { HiOutlineX } from 'react-icons/hi';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoPlayOutline } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { FaPlusCircle } from 'react-icons/fa';
import { IoChevronForwardOutline } from "react-icons/io5";
import { AiOutlineScan } from 'react-icons/ai';

import { Media } from '../../../../common/medias/types';
import Opacity from "../../Animations/Opacity";
import Margin from "../../Animations/Margin";
import { selectCurrentMedias, setCurrentMedias } from "../../../store/player";
import { removeSelectedFile, selectSelectedFiles, setSelectedFile } from "../../../store/selectedFiles";
import { selectMediaPlaying, setMediaPlaying } from "../../../store/mediaPlaying";
import { selectPlaylists, setPlaylistData } from "../../../store/playlists";
import { Playlist } from "../../../../common/playlists/types";
import { getPlaylistService } from "../../../service/playlist";
import { getPlayerService } from "../../../service/player";
import ModalCreatePlaylist from "../../Modal/ModalCreatePlaylist";
import ModalRenamePlaylist from "../../Modal/ModalRenamePlaylist";
import { isPlaylist } from "../../../common/array";

import './index.css';

function GenericGridItem(props: GenericItemProps) {

    const [ animation, setAnimation ] = useState(false);
    const [ selected, setSelected ] = useState(false);
    const [ active, setActive ] = useState(false);

    const { item, onSelectMedia, onPlay, onRemove } = props;
    const selectedItems = useSelector(selectSelectedFiles);
    const popupRef: any = useRef();
    const currentMedias = useSelector(selectCurrentMedias) || [];
    const mediaPlaying = useSelector(selectMediaPlaying);
    const allPlaylists = useSelector(selectPlaylists);

    const modalCreatePlaylistRef: any = useRef();
    const openModalCreatePlaylistTooltip = () => modalCreatePlaylistRef.current && modalCreatePlaylistRef.current.open();

    const modalRenamePlaylistRef: any = useRef();
    const openModalRenamePlaylistTooltip = () => modalRenamePlaylistRef.current && modalRenamePlaylistRef.current.open();

    const dispatch = useDispatch();

    const handleSelect = () => {

        onSelectMedia(item);
    };

    const handlePlay = () => {
        onPlay(item);
    };

    const handleRemove = () => {

        onRemove(item);
    };

    const handleSetNextMedia = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        const nextMedias = currentMedias ? [...currentMedias] : [];

        if (isPlaylist(item.media)) {

            for (let media of item.media.medias) {

                if (currentMedias.some(m => m.id === media.id)) {
                    continue;
                }
                else {
                    nextMedias.push(media);
                }
            }
        }
        else {
            if (!currentMedias.some(m => m.id === item.media.id)) {

                nextMedias.push(item.media);
            }
        }

        dispatch(setCurrentMedias(nextMedias));
        await getPlayerService().setLastMedia({current_medias: nextMedias});

        if (nextMedias.length === 1 || !mediaPlaying) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }
    };

    const handleSetMediaOnPlaylist = async (e: React.MouseEvent, playlistTarget: Playlist) => {

        if (e.target !== e.currentTarget) return;

        const playlistSource = item.media as Playlist;

        if (playlistSource.id === playlistTarget.id) return;

        const playlistUpdated = {...playlistTarget, medias: [...playlistSource.medias]};

        for (const media of playlistSource.medias) {

            if (!playlistUpdated.medias.some(m => m.id === media.id)) {
                playlistUpdated.medias.push(media);
            }
        }

        try {
            await getPlaylistService().putPlaylist({
                id: playlistUpdated.id,
                medias: playlistUpdated.medias
            });

            dispatch(setPlaylistData(playlistUpdated));
        }
        catch(error) {
            alert(error.message);
        }
    };

    const handleChangeSelected = (e: React.SyntheticEvent) => {

        const newSelectState = !selected;

        setTimeout(() => {
            setSelected(newSelectState);

            if (newSelectState) {
                setTimeout(() => dispatch(setSelectedFile({id: item.id})), 10);
            }
            else {
                setTimeout(() => dispatch(removeSelectedFile({id: item.id})), 10);
            }
        },0);

        // popupRef.current && popupRef.current.close();
    };

    const closeTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.close();
    };

    const openTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.open();
    };

    const onMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.button !== 2) {
            setAnimation(true);
        }
    };

    const onMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.button !== 2) {
            setAnimation(false);
        }
    };

    useEffect(() => {

        if (!(selectedItems.some(i => i.id === item.id))) {
            setSelected(false);
        }
        else {
            setSelected(true);
        }

    }, [selectedItems]);

    return (
        <Opacity cssAnimation={["opacity"]}
        onContextMenu={selectedItems.length === 0 ? openTooltip : null}
        className={'c-grid-list__item' +
        (animation ? ' c-grid-list__item--animated ' : '') +
        (active ? ' c-grid-list__item--active' : '') +
        (props.className ? ' ' + props.className : '') +
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
                                {isPlaylist(item.media) || props.onRemove && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handleRemove} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <HiOutlineX className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Excluír</h3>
                                    </div>
                                </div>}
                                {/* <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div className="c-popup__item__icons">
                                        <HiOutlinePencil className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Editar informações</h3>
                                    </div>
                                </div> */}
                                {/* <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div className="c-popup__item__icons">
                                        <HiOutlineInformationCircle className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Propriedades</h3>
                                    </div>
                                </div> */}
                                {!props.noSelect && <div className="c-popup__item--separator"></div>}
                                {!props.noSelect && <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
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
            {!props.noSelect && <div onClick={selectedItems.length > 0 ? handleChangeSelected : (e) => e.stopPropagation()} className="c-grid-list__item__actions__item c-grid-list__item__actions__item--checkbox">
                <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                <div onClick={selectedItems.length === 0 ? handleChangeSelected : () => {}} className="checkbox-box"></div>
            </div>}
        </Opacity>
    );
}

type GenericItemProps = {
    noSelect?: boolean,
    item: GenericItemData,
    className?: string,
    onSelectMedia: (item: GenericItemData) => void,
    onPlay: (item: GenericItemData) => void,
    onRemove?: (item: GenericItemData) => void,
};

export type GenericItemData = {
    id: number,
    selected?: boolean,
    thumbnails: React.ReactNode[],
    thumbnailType: 'img' | 'icon',
    title: string,
    description?: string,
    media?: Media | Playlist,
};

export default GenericGridItem;