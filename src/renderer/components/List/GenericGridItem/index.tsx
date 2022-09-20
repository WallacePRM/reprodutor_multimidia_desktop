import React, { useRef, useState, useEffect } from "react";

import { faChevronRight, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as ControlPlay } from '@icon/themify-icons/icons/control-play.svg';

import { RiPlayList2Fill } from 'react-icons/ri';
import { MdOutlineChecklist } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi';
import { HiOutlineX } from 'react-icons/hi';
import { IoPlayOutline } from 'react-icons/io5';
import { FaPlusCircle } from 'react-icons/fa';

import { Media } from '../../../../common/medias/types';
import { Playlist } from "../../../../common/playlists/types";
import Opacity from "../../Animations/Opacity";
import Margin from "../../Animations/Margin";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentMedias, setCurrentMedias } from "../../../store/player";
import { selectMedias, setMedias } from "../../../store/medias";
import { removeSelectedFile, selectSelectedFiles, setSelectedFile } from "../../../store/selectedFiles";
import { setMediaPlaying } from "../../../store/mediaPlaying";
import { getMediaService } from "../../../service/media";
import { getPlaylistService } from "../../../service/playlist";
import { deletePlaylist } from "../../../store/playlists";

import './index.css';

function GenericGridItem(props: GenericItemProps) {

    const [ animation, setAnimation ] = useState(false);
    const [ selected, setSelected ] = useState(false);
    const [ active, setActive ] = useState(false);

    const { item } = props;
    const selectedItems = useSelector(selectSelectedFiles);
    const popupRef: any = useRef();
    const currentMedias = useSelector(selectCurrentMedias) || [];
    const allMedias = useSelector(selectMedias);

    const dispatch = useDispatch();

    const handleSelectMedia = () => {

        props.onClick(item);
    };

    const handleSetNextMedia = (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        const nextMedias = currentMedias ? [...currentMedias] : [];

        if (isPlaylist(item.media)) {

            item.media.medias.forEach(m => nextMedias.push(m));
        }
        else {
            nextMedias.push(item.media);
        }

        dispatch(setCurrentMedias(nextMedias));

        if (nextMedias.length === 1) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }
    };

    const handleDeleteMedia = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        try {
            if (isPlaylist(item.media)) {

                const playlistService = getPlaylistService();
                await playlistService.deletePlaylist({id: item.id});

                dispatch(deletePlaylist({id: item.id}));
            }
            else {
                const mediaService = getMediaService();
                await mediaService.deleteMedias([item.media]);

                const medias = allMedias.filter(x => x.id !== item.id);
                dispatch(setMedias(medias));
            }
        }
        catch(error) {

            console.error(error);
            alert('Falha ao remover item');
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

    const isPlaylist = (item: Media | Playlist): item is Playlist => {

        return Array.isArray((item as Playlist).medias);
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
                <div onClick={selectedItems.length === 0 ? handleSelectMedia : null } className={'c-grid-list--click-event'}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseLeave={() => setAnimation(false)}></div>
                <div className="c-grid-list__item__thumbnail" style={ item.thumbnailType === 'icon' ? { border: '1px solid rgb(var(--border-color--dark), .1)'} : {}}>
                    {item.thumbnails}

                    <div className="c-grid-list__item__actions">
                        <div className="c-grid-list__item__actions__item c-grid-list__item__actions__item--play">
                            <IoPlayOutline onClick={handleSelectMedia}/>
                        </div>

                        <Popup onOpen={() => setActive(true)} onClose={() => setActive(false)} nested keepTooltipInside arrow={false} ref={popupRef} trigger={<div className="c-grid-list__item__actions__item c-grid-list__item__actions__item--options"><FontAwesomeIcon icon={faEllipsis} /></div>} position="top center">
                            <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '200px' }}>
                                <div  className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handleSelectMedia} className="c-popup__item__button-hidden"></div>
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
                                <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div className={'c-popup__item c-popup__item--row'}><div className="c-popup__item__icons"><HiOutlinePlus className="c-popup__item__icon" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Adicionar a</h3><FontAwesomeIcon className="c-popup__item__description" icon={faChevronRight}/></div></div>} position="right top" >
                                    <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                                        <div className="c-popup__item c-popup__item--row">
                                            <div className="c-popup__item__icons">
                                                <RiPlayList2Fill className="c-popup__item__icon" />
                                            </div>
                                            <div className="c-popup__item__label">
                                                <h3 className="c-popup__item__title">Fila de reprodução</h3>
                                            </div>
                                        </div>
                                        <div className="c-popup__item--separator"></div>
                                        <div className="c-popup__item c-popup__item--row">
                                            <div className="c-popup__item__icons">
                                                <HiOutlinePlus className="c-popup__item__icon" />
                                            </div>
                                            <div className="c-popup__item__label">
                                                <h3 className="c-popup__item__title">Nova playlist</h3>
                                            </div>
                                        </div>
                                    </Margin>
                                </Popup>
                                <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handleDeleteMedia} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <HiOutlineX className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Remover</h3>
                                    </div>
                                </div>
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
    onClick: (item: GenericItemData) => void,
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