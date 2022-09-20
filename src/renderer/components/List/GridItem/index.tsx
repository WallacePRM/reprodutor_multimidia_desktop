import React, { useRef, useState, useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { RiPlayList2Fill } from 'react-icons/ri';
import { MdOutlineChecklist } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi';
import { HiOutlineX } from 'react-icons/hi';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { HiOutlinePencil } from 'react-icons/hi';
import { IoPlayOutline } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { FaPlusCircle } from 'react-icons/fa';
import { FiSpeaker } from 'react-icons/fi';
import { IoMusicalNoteOutline } from "react-icons/io5";
import { IoFilmOutline } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";

import { Media } from '../../../../common/medias/types';
import { formatStrHHMMSS } from "../../../common/time";
import Opacity from "../../Animations/Opacity";
import Margin from "../../Animations/Margin";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentMedias, setCurrentMedias } from "../../../store/player";
import { selectMedias, setMedias } from "../../../store/medias";
import { removeSelectedFile, selectSelectedFiles, setSelectedFile } from "../../../store/selectedFiles";
import { setMediaPlaying } from "../../../store/mediaPlaying";
import { getMediaService } from "../../../service/media";
import { selectPageConfig } from "../../../store/pageConfig";
import { removeMediaExt } from "../../../common/string";
import { selectPlaylists, setPlaylistData } from "../../../store/playlists";
import { Playlist } from "../../../../common/playlists/types";
import { getPlaylistService } from "../../../service/playlist";
import { getPlayerService } from "../../../service/player";

import './index.css';

function GridItem(props: FileProps) {

    const [ animation, setAnimation ] = useState(false);
    const [ selected, setSelected ] = useState(false);
    const [ active, setActive ] = useState(false);

    const { file } = props;
    const selectedItems = useSelector(selectSelectedFiles);
    const popupRef: any = useRef();
    const currentMedias = useSelector(selectCurrentMedias) || [];
    const allMedias = useSelector(selectMedias);
    const allPlaylists = useSelector(selectPlaylists)
    const pageConfig = useSelector(selectPageConfig);
    const dispatch = useDispatch();

    const handleSelectMedia = () => {

        props.onClick(file);
    };

    const handleSetNextMedia = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        const mediaIndex = currentMedias.findIndex(m => m.id === file.id);
        if (mediaIndex != -1) return;

        const nextMedias = currentMedias ? [...currentMedias] : [];
        nextMedias.push(file);

        dispatch(setCurrentMedias(nextMedias));
        await getPlayerService().setLastMedia({current_medias: nextMedias});

        if (nextMedias.length === 1) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }
    };

    const handleSetMediaOnPlaylist = async (e: React.MouseEvent, playlist: Playlist) => {

        if (e.target !== e.currentTarget) return;

        const mediaIndex = playlist.medias.findIndex(m => m.id === file.id);
        if (mediaIndex != -1) return;

        playlist.medias.push(file);

        try {
            await getPlaylistService().putPlaylist(playlist);

            dispatch(setPlaylistData(playlist));
        }
        catch(error) {
            alert(error.message);
        }
    };

    const handleDeleteMedia = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        try {
            const mediaService = getMediaService();
            await mediaService.deleteMedias([file]);

            const medias = allMedias.filter(x => x.id !== file.id);
            dispatch(setMedias(medias));
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
                setTimeout(() => dispatch(setSelectedFile({id: file.id})), 10);
            }
            else {
                setTimeout(() => dispatch(removeSelectedFile({id: file.id})), 10);
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

        if (!(selectedItems.some(i => i.id === file.id))) {
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
                <div className="c-grid-list__item__thumbnail" style={ !file.thumbnail ? { border: '1px solid rgb(var(--border-color--dark), .1)'} : {}}>
                    { file.thumbnail && pageConfig.mediaArt ?
                        <div className="h-100 w-100">
                            <LazyLoadImage src={file.thumbnail}/>
                        </div> :
                        <div className="c-grid-list__item__icon">
                            { file.type === 'folder' ?
                            <><FontAwesomeIcon className="c-grid-list__item__icon__folder" icon={faFolderClosed} />
                            <FontAwesomeIcon className="c-grid-list__item__icon__list" icon={faBars}/></> : null}
                            { file.type === 'music' ?
                            <><IoMusicalNoteOutline className="icon-color--light"/></> : null}
                            { file.type === 'video' ?
                            <><IoFilmOutline className="icon-color--light"/></> : null}
                            { props.className === 'c-grid-list__item--playlist' ?
                            <FiSpeaker className="icon-color--light"/> : null}
                        </div>
                    }

                    <div className="c-grid-list__item__actions">
                        <div className="c-grid-list__item__actions__item c-grid-list__item__actions__item--play">
                            <IoPlayOutline onClick={handleSelectMedia}/>
                        </div>

                        <Popup onOpen={() => setActive(true)} onClose={() => setActive(false)} nested keepTooltipInside arrow={false} ref={popupRef} trigger={<div className="c-grid-list__item__actions__item c-grid-list__item__actions__item--options"><IoEllipsisHorizontal /></div>} position="top center">
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
                                        <div className="c-popup__item c-popup__item--row">
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
                    <span className="c-grid-list__item__title" title={file.name + (file.author ? ` - ${file.author}` : '')}>{removeMediaExt(file.name) + (file.author ? ` - ${file.author}` : '')}</span>
                    { file.type === 'video' ? <span className="c-grid-list__item__subtitle">{file.duration > 0 ? formatStrHHMMSS(file.duration) : ''}</span> : null}
                    { file.type === 'music' ? <span className="c-grid-list__item__subtitle">{file.author || ''}</span> : null}
                    { props.className === 'c-grid-list__item--playlist' ?  <span className="c-grid-list__item__subtitle">{'0 item'}</span> : null}
                </div>
            </div>
            {!props.noSelect && <div onClick={selectedItems.length > 0 ? handleChangeSelected : (e) => e.stopPropagation()} className="c-grid-list__item__actions__item c-grid-list__item__actions__item--checkbox">
                <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                <div onClick={selectedItems.length === 0 ? handleChangeSelected : () => {}} className="checkbox-box"></div>
            </div>}
        </Opacity>
    );
}

type FileProps = {
    noSelect?: boolean,
    file: Media & {
        selected?: boolean,
    },
    className?: string,
    onClick: (file: Media) => void,
};

export default GridItem;