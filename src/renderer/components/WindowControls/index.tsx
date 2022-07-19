import React from 'react';
import { WindowElectronApi } from '../../preload-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareFull } from '@fortawesome/free-regular-svg-icons';
import { faMinus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectContainerMargin } from '../../store/containerMargin';

import './index.css';

function WindowControls(props: WindowControlsProps) {

    const containerMargin = useSelector(selectContainerMargin);
    const style = {
        width: (containerMargin.appWidth - containerMargin.margin / 0.0625) + 'px',
    };

    const handleClose = async () => {

        await (window as WindowElectronApi).electronApi.closeWindow();
    };

    const handleMaximize = async () => {

        await (window as WindowElectronApi).electronApi.maximizeWindow();
    };

    const handleMinimize = async () => {

        await (window as WindowElectronApi).electronApi.minimizeWindow();
    };

    return (
        <div style={style} className={'c-window-controls' + (props.className ? ' ' + props.className : '')}>
            <div className="c-window-controls__item" onClick={handleMinimize}>
                <FontAwesomeIcon icon={faMinus} />
            </div>
            <div className="c-window-controls__item c-window-controls__item--maximize" onClick={handleMaximize}>
                <FontAwesomeIcon icon={faSquare}/>
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