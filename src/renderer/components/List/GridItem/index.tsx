import React, { useRef, useState, useEffect } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { faBars,faChevronRight, faEllipsis, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as ControlPlay } from '@icon/themify-icons/icons/control-play.svg';
import { ReactComponent as MusicAlt } from '@icon/themify-icons/icons/music-alt.svg';
import { ReactComponent as LayoutWidthDefault } from '@icon/themify-icons/icons/layout-width-default.svg';
import { ReactComponent as LayoutListThumb } from '@icon/themify-icons/icons/layout-list-thumb.svg';
import { ReactComponent as PlayIcon } from '@icon/themify-icons/icons/control-play.svg';
import { ReactComponent as PlayForwardIcon } from '@icon/themify-icons/icons/control-forward.svg';
import { ReactComponent as CheckICon } from '@icon/themify-icons/icons/check.svg';
import { ReactComponent as PlusIcon } from '@icon/themify-icons/icons/plus.svg';
import { ReactComponent as PencilIcon } from '@icon/themify-icons/icons/pencil.svg';
import { ReactComponent as CloseIcon } from '@icon/themify-icons/icons/close.svg';
import { ReactComponent as InfoIcon } from '@icon/themify-icons/icons/info-alt.svg';
import { Media } from '../../../../common/medias/types';
import { formatStrHHMMSS } from "../../../common/time";
import Opacity from "../../Animations/Opacity";
import Margin from "../../Animations/Margin";
import Popup from "reactjs-popup";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentMedias, setCurrentMedias } from "../../../store/player";
import { ApiMediaService } from "../../../service/media/api-media-service";
import { selectMedias, setMedias } from "../../../store/medias";
import { removeSelectedFile, selectSelectedFiles, setSelectedFile } from "../../../store/selectedFiles";
import { setMediaPlaying } from "../../../store/mediaPlaying";

import './index.css';

function GridItem(props: FileProps) {

    const [ animation, setAnimation ] = useState(false);
    const [ selected, setSelected ] = useState(false);

    const { file } = props;
    const selectedItems = useSelector(selectSelectedFiles);
    const popupRef: any = useRef();
    const currentMedias = useSelector(selectCurrentMedias) || [];
    const allMedias = useSelector(selectMedias);
    const dispatch = useDispatch();

    const handleSelectMedia = () => {

        props.onClick(file);
    };

    const handleSetNextMedia = (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        const nextMedias = currentMedias ? [...currentMedias] : [];
        nextMedias.push(file);

        dispatch(setCurrentMedias(nextMedias));

        if (nextMedias.length === 1) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }
    };

    const handleDeleteMedia = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        try {
            await new ApiMediaService().removeMedia(file.id);

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
        <Opacity cssAnimation={["opacity"]} onClick={selectedItems.length === 0 ? handleSelectMedia : undefined } className={'c-grid-list__item' +
        (animation ? ' c-grid-list__item--animated ' : '') +
        (props.className ? ' ' + props.className : '') +
        (selectedItems.length > 0 ? ' select-mode' : '')}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={() => setAnimation(false)}>
            <div className="c-grid-list__item__interface">
                <div className="c-grid-list__item__thumbnail" style={ !file.thumbnail ? { border: '1px solid rgb(var(--border-color--dark), .1)'} : {}}>
                    { file.thumbnail ?
                        <div className="h-100 w-100">
                            <LazyLoadImage src={file.thumbnail}/>
                        </div> :
                        <div className="c-grid-list__item__icon">
                            { file.type === 'folder' ?
                            <><FontAwesomeIcon className="c-grid-list__item__icon__folder" icon={faFolderClosed} />
                            <FontAwesomeIcon className="c-grid-list__item__icon__list" icon={faBars}/></> : null}
                            { file.type === 'music' ?
                            <><MusicAlt className="icon-color--light"/></> : null}
                            { file.type === 'video' ?
                            <><LayoutWidthDefault className="icon-color--light"/></> : null}
                        </div>
                    }
                    <div className="c-grid-list__item__actions">
                        <div className="c-grid-list__item__actions__item c-grid-list__item__actions__item--play">
                            <ControlPlay className="icon-color" />
                        </div>

                        <Popup onOpen={e => e?.stopPropagation()} keepTooltipInside arrow={false} ref={popupRef} trigger={<div className="c-grid-list__item__actions__item c-grid-list__item__actions__item--options"><FontAwesomeIcon icon={faEllipsis} className="icon-color" /></div>} position="top center">
                            <Margin cssAnimation={["marginTop"]} className="c-popup noselect" style={{ minWidth: '200px' }}>
                                <div  className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handleSelectMedia} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <PlayIcon className="c-popup__item__icon icon-color" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Reproduzir</h3>
                                    </div>
                                </div>
                                <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handleSetNextMedia} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <PlayForwardIcon className="c-popup__item__icon icon-color" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Reproduzir em seguida</h3>
                                    </div>
                                </div>
                                {/* <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div style={{ borderTop: 'var(--border)'}} className={'c-popup__item c-popup__item--row'}><div className="c-popup__item__icons"><PlusIcon className="c-popup__item__icon icon-color" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Adicionar a</h3><FontAwesomeIcon className="c-popup__item__description" icon={faChevronRight}/></div></div>} position="right top" >
                                    <div role="tooltip" className="c-popup noselect" style={{ minWidth: '130px' }}>
                                        <div className="c-popup__item c-popup__item--row" style={{ borderBottom: 'var(--border)'}}>
                                            <div className="c-popup__item__icons">
                                                <LayoutListThumb className="c-popup__item__icon icon-color" />
                                            </div>
                                            <div className="c-popup__item__label">
                                                <h3 className="c-popup__item__title">Fila de reprodução</h3>
                                            </div>
                                        </div>
                                        <div className="c-popup__item c-popup__item--row">
                                            <div className="c-popup__item__icons">
                                                <FontAwesomeIcon icon={faPlus} className="c-popup__item__icon icon-color" />
                                            </div>
                                            <div className="c-popup__item__label">
                                                <h3 className="c-popup__item__title">Nova playlist</h3>
                                            </div>
                                        </div>
                                    </div>
                                </Popup> */}
                                <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div onClick={handleDeleteMedia} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <CloseIcon className="c-popup__item__icon icon-color" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Remover</h3>
                                    </div>
                                </div>
                                {/* <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div className="c-popup__item__icons">
                                        <PencilIcon className="c-popup__item__icon icon-color" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Editar informações</h3>
                                    </div>
                                </div> */}
                                {/* <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                    <div className="c-popup__item__icons">
                                        <InfoIcon className="c-popup__item__icon icon-color" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Propriedades</h3>
                                    </div>
                                </div> */}
                                <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                    <div onClick={handleChangeSelected} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <CheckICon className="c-popup__item__icon icon-color" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Selecionar</h3>
                                    </div>
                                </div>
                            </Margin>
                        </Popup>
                    </div>
                </div>
                <div className="c-grid-list__item__info">
                    <span className="c-grid-list__item__title" title={file.name + (file.author ? ` - ${file.author}` : '')}>{file.name + (file.author ? ` - ${file.author}` : '')}</span>
                    { file.type === 'video' ? <span className="c-grid-list__item__subtitle">{file.duration > 0 ? formatStrHHMMSS(file.duration) : ''}</span> : null}
                    { file.type === 'music' ? <span className="c-grid-list__item__subtitle">{file.author || ''}</span> : null}
                </div>
            </div>
            <div onClick={selectedItems.length > 0 ? handleChangeSelected : (e) => e.stopPropagation()} className="c-grid-list__item__actions__item c-grid-list__item__actions__item--checkbox">
                <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                <div onClick={selectedItems.length === 0 ? handleChangeSelected : () => {}} className="checkbox-box"></div>
            </div>
        </Opacity>
    );
}

type FileProps = {
    file: Media & {
        selected?: boolean,
    },
    className?: string,
    onClick: (file: Media) => void,
};

export default GridItem;