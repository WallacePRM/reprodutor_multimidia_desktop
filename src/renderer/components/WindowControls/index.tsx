import React, { useEffect, useState } from 'react';
import { WindowElectronApi } from '../../preload-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareFull } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectContainerMargin } from '../../store/containerMargin';

import './index.css';

function WindowControls(props: WindowControlsProps) {

    const [ isMaximized, setIsMaximized ] = useState(false);

    const containerMargin = useSelector(selectContainerMargin);
    const style = {
        width: (containerMargin.appWidth - (containerMargin.margin === 0 ?  85 : containerMargin.margin / 0.0625)) + 'px',
    };

    const handleClose = async () => {

        await (window as WindowElectronApi).electronApi.closeWindow();
    };

    const handleMaximize = async () => {

        await (window as WindowElectronApi).electronApi.maximizeWindow();
        setIsMaximized(isMaximized);
    };

    const handleMinimize = async () => {

        await (window as WindowElectronApi).electronApi.minimizeWindow();
    };

    useEffect(() => {

        const setWindowMaximed = async () => {
            const isMaximized = await (window as WindowElectronApi).electronApi.isMaximize();
            setIsMaximized(isMaximized);
        };

        setWindowMaximed();

    }), [isMaximized];

    return (
        <div style={style} className={'c-window-controls' + (props.className ? ' ' + props.className : '')}>
            <div className="c-window-controls__item" onClick={handleMinimize}>
                <FontAwesomeIcon icon={faMinus} />
            </div>
            <div className="c-window-controls__item c-window-controls__item--maximize" onClick={handleMaximize}>
                {!isMaximized && <FontAwesomeIcon icon={faSquare}/>}
                {isMaximized && <><FontAwesomeIcon className="c-window-controls__item--maximize-layer-1" icon={faSquare}/><FontAwesomeIcon className="c-window-controls__item--maximize-layer-2" icon={faSquare}/></>}
            </div>
            <div className="c-window-controls__item c-window-controls__item--close" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
        </div>
    );
}

type WindowControlsProps = {
    className?: string;
}

export default WindowControls;