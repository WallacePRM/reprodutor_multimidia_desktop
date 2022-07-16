import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as Play } from '@icon/themify-icons/icons/control-play.svg';
import { useSelector } from 'react-redux';
import { formatMMSS } from '../../../common/time';
import { Media } from "../../../service/media/types";
import { selectMediaPlaying } from '../../../store/mediaPlaying';
import { faFilm, faMusic } from '@fortawesome/free-solid-svg-icons';
import Opacity from '../../Animations/Opacity';
import { useEffect, useState } from 'react';
import { removeSelectedFile, selectSelectedFiles, setSelectedFile } from '../../../store/selectedFiles';
import { useDispatch } from 'react-redux';

import './index.css';

function LineItem(props: FileProps) {

    const [ selected, setSelected ] = useState(false);

    const { file } = props;
    let duration = file.duration;
    const selectedItems = useSelector(selectSelectedFiles);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const dispatch = useDispatch();

    const handleSelectFile = () => {
        props.onClick(file);
    };

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
        },0);
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
        (selectedItems.length > 0 ? ' select-mode' : '')}>
            { mediaPlaying?.id === file.id &&
            <div className={'c-line-animated c-line-list__item--active-icon' + ( mediaPlaying.isPlaying ? ' c-line-animated--start' : '')}>
                <div className="c-line-animated__item c-line-animated__item--first"></div>
                <div className="c-line-animated__item c-line-animated__item--second"></div>
                <div className="c-line-animated__item c-line-animated__item--third"></div>
            </div>
            }
            {props.fileTypeVisible &&
            <div className={'c-line-list__item__type-icon' + (mediaPlaying?.id === file.id ? ' accent--color' : ' icon-color--light')}>
                { file?.type === 'music' && <FontAwesomeIcon icon={faMusic} /> }
                { file?.type === 'video' && <FontAwesomeIcon icon={faFilm} /> }
            </div>}
            <div onClick={selectedItems.length > 0 ? handleChangeSelected : (e) => e.stopPropagation()} className="c-line-list__item__actions c-line-list__item__actions--checkbox">
                <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                <label onClick={selectedItems.length === 0 ? handleChangeSelected : () => {}} className="checkbox-box"></label>
            </div>
            <div className="c-line-list__item__actions">
                <div onClick={ handleSelectFile } className="c-line-list__item__actions__item">
                    <Play className="icon-color" />
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
            <div className="c-line-list__item__info c-line-list__item__genre" >
                <span>{file.releaseDate ? new Date(file.releaseDate).getFullYear() : ''}</span>
                <span className="ml-10"> {file.genre ? file.genre : 'Gênero desconhecido'}</span>
            </div>
            <div className="c-line-list__item__info c-line-list__item__duration">
                <span>{duration ? formatMMSS(duration) : '00:00'}</span>
            </div>
        </Opacity>
    );
}

type FileProps = {
    file: Media,
    className?: string,
    fileTypeVisible?: boolean,
    onClick: (file: Media) => void,
};

export default LineItem;