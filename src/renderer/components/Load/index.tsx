import React from 'react';

import './index.css';

function Load(props: LoadProps) {

    const { style, className } = props;

    return (
        <div onClick={e => e.stopPropagation()} className={'c-load-container' + (' ' + className || '')} style={style ? style : {}}>
            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    );
}

type LoadProps = {
    className?: string;
    style?: React.CSSProperties,
}

export default Load;