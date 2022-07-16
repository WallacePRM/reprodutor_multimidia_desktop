import React from 'react';
import logo from '../../logo.svg';
import './index.css';

function Logo(props: LogoProps) {
    return (
        <div className={'c-logo noselect ' + (props.className ? props.className : '')}>
            <img className="c-logo__image" src={logo} />
            <h1 className="c-logo__title">Reprodutor Multimídia</h1>
        </div>
    );
}

type LogoProps = {
    className?: string;
};

export default Logo;