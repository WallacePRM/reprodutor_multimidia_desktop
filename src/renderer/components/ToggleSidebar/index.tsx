import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as Menu } from '@icon/themify-icons/icons/menu.svg';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/sidebarOpened';

import './index.css';

function ToggleSidebar() {

    const dispatch = useDispatch();
    const [ animation, setAnimation ] = useState(false);

    const handleToggleSidebar = (e: React.MouseEvent) => {
        e.stopPropagation();

        dispatch(toggleSidebar());
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

    return (
        <div onClick={handleToggleSidebar} onMouseLeave={() => setAnimation(false)} onMouseUp={onMouseUp} onMouseDown={onMouseDown} className="c-toggle-sidebar btn--icon">
            <Menu className={'icon-color transform-x-scale' + (animation ? ' transform-x-scale--active' : '')} />
        </div>
    );
};

export default ToggleSidebar;