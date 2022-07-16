import React, { useEffect, useRef, useState } from 'react';

import { ReactComponent as PlayIcon } from '@icon/themify-icons/icons/control-play.svg';
import { ReactComponent as PlayForwardIcon } from '@icon/themify-icons/icons/control-forward.svg';
import { ReactComponent as PlusIcon } from '@icon/themify-icons/icons/plus.svg';
import { ReactComponent as PencilIcon } from '@icon/themify-icons/icons/pencil.svg';
import { ReactComponent as InfoAltIcon } from '@icon/themify-icons/icons/info-alt.svg';
import { ReactComponent as LayoutListThumb } from '@icon/themify-icons/icons/layout-list-thumb.svg';
import { ReactComponent as InfoIcon } from '@icon/themify-icons/icons/info-alt.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectSelectedFiles, setSelectedFiles } from '../../store/selectedFiles';
import { useDispatch } from 'react-redux';
import { selectCurrentMedias, setCurrentMedias } from '../../store/player';
import { selectMediaPlaying, setMediaPlaying } from '../../store/mediaPlaying';
import { Media } from '../../service/media/types';
import { setPlayerState } from '../../store/playerState';
import { selectContainerMargin } from '../../store/containerMargin';
import Popup from 'reactjs-popup';
import Margin from '../Animations/Margin';

import './index.css';

function SelectBlock(props: SelectBlockProps) {

    const [ selected, setSelected ] = useState(false);

    const medias = props.list;
    const currentMedias: Media[] | null = useSelector(selectCurrentMedias);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const selectedItems = useSelector(selectSelectedFiles);
    const containerMargin = useSelector(selectContainerMargin);
    const containerWidth = containerMargin.appWidth - (containerMargin.margin / 0.0625);
    const popupRef: any = useRef();
    const dispatch = useDispatch();

    const closeTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.close();
    };

    const clearSelectedItems = () => {
        dispatch(setSelectedFiles([]));
    };

    const handleClearSelectedItems = () => {

        clearSelectedItems();
    };

    const handlePlaySelectedItems = () => {

        const selectedMedias = medias.filter(m => selectedItems.some(s => s.id === m.id));

        dispatch((setCurrentMedias(null)));
        dispatch(setMediaPlaying(null));
        dispatch(setPlayerState({file_id: -1, currentTime: 0, duration: 0}));

        setTimeout(() => {
            dispatch((setCurrentMedias(selectedMedias)));
            dispatch(setMediaPlaying(selectedMedias[0]));
        }, 0);

        clearSelectedItems();
    };

    const handleSelectAllItems = () => {

        const newSelectState = !selected;

        setTimeout(() => {
            setSelected(newSelectState);

            if (newSelectState) {

                let newSelectedItems = [];
                for (let media of medias) {
                    newSelectedItems.push({id: media.id});
                };

                dispatch(setSelectedFiles(newSelectedItems));
            }
            else {

                dispatch(setSelectedFiles([]));
            }
        }, 0);
    };

    const handleSetNextMedias = (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        const nextMedias = currentMedias ? [...currentMedias] : [];
        for (let item of selectedItems) {

            const media = medias.find(x => x.id === item.id);
            if (media) {
                if (media.id !== mediaPlaying?.id) {
                    nextMedias.push(media);
                }
            }
        }

        dispatch(setCurrentMedias(nextMedias));
        if (!mediaPlaying) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }

        clearSelectedItems();
    };

    useEffect(() => {

        if (selectedItems.length !== medias.length) {
            setSelected(false);
        }
        else {
            setSelected(true);
        }

    }, [selectedItems]);

    return (
        <div className="c-select-block">
            <div className="c-select-block__info">
                <label onClick={handleSelectAllItems} className="d-flex a-items-center">
                    <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                    <div className="checkbox-box mr-5"></div>
                    <span>{selectedItems.length > 1 ? selectedItems.length + ' itens' : selectedItems.length + ' item'} selecionado</span>
                </label>
                <span onClick={handleClearSelectedItems} className="c-select-block__item--clear accent-color">Limpar</span>
            </div>
            <div className="c-select-block__actions">
                <button onClick={handlePlaySelectedItems} className="c-select-block__actions__item c-button box-field btn--primary c-button--no-media-style">
                    <PlayIcon className="c-button__icon icon-color--inverted mr-5"/>
                    <span className="c-button__label">Reproduzir</span>
                </button>
                {containerWidth >= 790 && <button onClick={handleSetNextMedias} className="c-select-block__actions__item c-button box-field ">
                    <PlayForwardIcon className="c-button__icon mr-5"/>
                    <span className="c-button__label">Reproduzir em seguida</span>
                </button>}
                {containerWidth > 910 && <button className="c-select-block__actions__item c-button box-field ">
                    <PlusIcon className="c-button__icon mr-5"/>
                    <span className="c-button__label">Adicionar a</span>
                </button>}
                {containerWidth > 1030 && selectedItems.length === 1 && <button className="c-select-block__actions__item c-button box-field ">
                    <PencilIcon className="c-button__icon mr-5"/>
                    <span className="c-button__label">Editar informações</span>
                </button>}
                {containerWidth > 1150 && selectedItems.length === 1 && <button className="c-select-block__actions__item c-button box-field ">
                    <InfoAltIcon className="c-button__icon mr-5"/>
                    <span className="c-button__label">Propriedades</span>
                </button>}

                {(containerWidth < 1150 && selectedItems.length === 1 || containerWidth < 910 && selectedItems.length > 1) && <Popup onOpen={e => e?.stopPropagation()} keepTooltipInside arrow={false} ref={popupRef} trigger={ <button className="c-select-block__actions__item c-button box-field ml-10">
                    <FontAwesomeIcon icon={faEllipsis} className="c-button__icon icon-color"/>
                    </button>} position="top center">
                    <Margin cssAnimation={["marginTop"]} className="c-popup noselect" style={{ minWidth: '200px' }}>
                        {containerWidth < 790 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div onClick={handleSetNextMedias} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <PlayForwardIcon className="c-popup__item__icon icon-color" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Reproduzir em seguida</h3>
                            </div>
                        </div>}
                        {containerWidth < 910 && <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div className={'c-popup__item c-popup__item--row'}><div className="c-popup__item__icons"><PlusIcon className="c-popup__item__icon icon-color" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Adicionar a</h3><FontAwesomeIcon className="c-popup__item__description" icon={faChevronRight}/></div></div>} position="right top" >
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
                        </Popup>}
                        {containerWidth < 1030 && selectedItems.length === 1 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div className="c-popup__item__icons">
                                <PencilIcon className="c-popup__item__icon icon-color" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Editar informações</h3>
                            </div>
                        </div>}
                        {containerWidth < 1150 && selectedItems.length === 1 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div className="c-popup__item__icons">
                                <InfoIcon className="c-popup__item__icon icon-color" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Propriedades</h3>
                            </div>
                        </div>}
                    </Margin>
                </Popup>}
            </div>
        </div>
    );
}

type SelectBlockProps = {
    list: Media[];
};

export default SelectBlock;