import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { formatHHMMSS } from '../../../common/time';
import { Media } from '../../../../common/medias/types';
import { selectMediaPlaying, setMediaPlaying } from '../../../store/mediaPlaying';
import Opacity from '../../Animations/Opacity';
import { useEffect, useState } from 'react';
import { removeSelectedFile, selectSelectedFiles, setSelectedFile } from '../../../store/selectedFiles';
import Popup from 'reactjs-popup';
import Margin from '../../Animations/Margin';

import { IoPlayOutline } from 'react-icons/io5';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { IoFilmOutline } from 'react-icons/io5';
import { RiPlayList2Fill } from 'react-icons/ri';
import { MdOutlineChecklist } from 'react-icons/md';
import { HiOutlinePlus } from 'react-icons/hi';
import { HiOutlineX } from 'react-icons/hi';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { HiOutlinePencil } from 'react-icons/hi';
import { FaPlusCircle } from 'react-icons/fa';
import { IoMusicalNoteOutline } from "react-icons/io5";
import { IoChevronForwardOutline } from "react-icons/io5";

import { selectCurrentMedias, setCurrentMedias } from '../../../store/player';
import { selectPlaylists, setPlaylistData } from '../../../store/playlists';
import { Playlist } from '../../../../common/playlists/types';
import { getMediaService } from '../../../service/media';
import { selectMedias, setMedias } from '../../../store/medias';
import { getPlayerService } from '../../../service/player';
import { getPlaylistService } from '../../../service/playlist';

import './index.css';

function LineItem(props: FileProps) {

    const [ selected, setSelected ] = useState(false);

    const { file } = props;
    let duration = file.duration;
    const selectedItems = useSelector(selectSelectedFiles);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const currentMedias = useSelector(selectCurrentMedias) || [];
    const popupRef: any = useRef(null);
    const allPlaylists = useSelector(selectPlaylists);
    const allMedias = useSelector(selectMedias);
    const dispatch = useDispatch();

    const handleChangeSelected = (e: React.SyntheticEvent) => {

        e.stopPropagation();

        const newSelectState = !selected;

        setTimeout(() => {
            setSelected(newSelectState);

            if (newSelectState) {
                setTimeout(() => dispatch(setSelectedFile({id: file.id})), 10);
            }
            else {
                setTimeout(() => dispatch(removeSelectedFile({id: file.id})), 10);
            }

            popupRef.current.close();
        },0);
    };

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

    const closeTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.close();
    };

    const openTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.open();
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
        <Opacity cssAnimation={["opacity"]} className={'c-line-list__item' +
        (props.className ? ` ${props.className}` : '') +
        (selectedItems.length > 0 ? ' select-mode' : '')}
        onContextMenu={selectedItems.length === 0 ? openTooltip : null}>
            <Popup nested keepTooltipInside arrow={false} ref={popupRef} trigger={<div></div>} position="top center">
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
            { mediaPlaying?.id === file.id &&
            <div className={'c-line-animated c-line-list__item--active-icon' + ( mediaPlaying.isPlaying ? ' c-line-animated--start' : '')}>
                <div className="c-line-animated__item c-line-animated__item--first"></div>
                <div className="c-line-animated__item c-line-animated__item--second"></div>
                <div className="c-line-animated__item c-line-animated__item--third"></div>
            </div>
            }
            {props.fileTypeVisible &&
            <div className={'c-line-list__item__type-icon' + (mediaPlaying?.id === file.id ? ' accent--color' : '')}>
                { file?.type === 'music' && <IoMusicalNotesOutline /> }
                { file?.type === 'video' && <IoFilmOutline /> }
            </div>}
            {!props.noSelect && <div onClick={selectedItems.length > 0 ? handleChangeSelected : (e) => e.stopPropagation()} className="c-line-list__item__actions c-line-list__item__actions--checkbox">
                <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                <label onClick={selectedItems.length === 0 ? handleChangeSelected : () => {}} className="checkbox-box"></label>
            </div>}
            <div className="c-line-list__item__actions">
                <div onClick={ handleSelectMedia } className="c-line-list__item__actions__item">
                    {/* <Play className="icon-color" /> */}
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
                <span>{duration ? formatHHMMSS(duration) : '00:00'}</span>
            </div>
        </Opacity>
    );
}

type FileProps = {
    file: Media,
    className?: string,
    fileTypeVisible?: boolean,
    noSelect?: boolean,
    onClick: (file: Media) => void,
};

export default LineItem;