import React from 'react';
import './index.css';

export default function Load(props: LoadProps) {

    const { style } = props;

    return (
        <div onClick={e => e.stopPropagation()} className={'c-load-container' + (props.className ? ' ' + props.className : '')} style={style ? style : {}}>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    );
}

interface LoadProps {
    className?: string;
    style?: React.CSSProperties,
}