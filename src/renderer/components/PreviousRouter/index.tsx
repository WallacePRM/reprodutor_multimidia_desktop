import React from 'react';
import { ReactComponent as ArrowLeft } from '@icon/themify-icons/icons/arrow-left.svg';
import { useState } from 'react';
import { useNavigate,  } from 'react-router-dom';

import "./index.css";

function PreviousRouter(props: PreviousRouterProps) {

    const navigate = useNavigate();
    const [ animation, setAnimation ] = useState(false);

    const handleBackToPrevious = () => {
        navigate(-1);
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
        <div onClick={ props.onClick? props.onClick : handleBackToPrevious} onMouseLeave={() => setAnimation(false)} onMouseDown={onMouseDown} onMouseUp={onMouseUp} title={ props.title ? props.title : '' } className={'c-previous-router btn--icon' + ((window.history.state && window.history.state.idx === 0) && !props.onClick ? ' icon--disabled' : '') + (props.className ? ' ' + props.className : '')}>
            <ArrowLeft className={'c-previous-router__icon icon-color transform-x-scale' + (animation ? ' transform-x-scale--active' : '')} />
        </div>
    );
}

type PreviousRouterProps = {
    className?: string;
    title?: string,
    onClick?: () => void;
};

export default PreviousRouter;