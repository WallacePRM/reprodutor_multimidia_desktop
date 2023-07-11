import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { IoCloseOutline } from 'react-icons/io5';
import useWindowControls from './hook';
import './index.css';

export default function WindowControls(props: WindowControlsProps) {

    const { style, isMaximized, handleMinimize, handleMaximize, handleClose } = useWindowControls();

    return (
        <div style={style} className={'c-window-controls' + (props.className ? ' ' + props.className : '')}>
            <div className="c-window-controls__item c-window-controls__item--minimize" onClick={handleMinimize}>
                <FontAwesomeIcon icon={faMinus} />
            </div>
            <div className="c-window-controls__item c-window-controls__item--maximize" onClick={handleMaximize}>
                {!isMaximized && <FontAwesomeIcon icon={faSquare}/>}
                {isMaximized && <><FontAwesomeIcon className="c-window-controls__item--maximize-layer-1" icon={faSquare}/><FontAwesomeIcon className="c-window-controls__item--maximize-layer-2" icon={faSquare}/></>}
            </div>
            <div className="c-window-controls__item c-window-controls__item--close" onClick={handleClose}>
                <IoCloseOutline />
            </div>
        </div>
    );
}

interface WindowControlsProps {
    className?: string;
}