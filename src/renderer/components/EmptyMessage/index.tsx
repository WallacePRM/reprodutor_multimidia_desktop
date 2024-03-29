import React from 'react';
import './index.css';

export default function EmptyMessage(props: EmptyMessageProps) {

    return (
        <div className={'c-empty-message' +
        (props.className ? ' ' + props.className : '')}>
            <div className="c-empty-message__container">
                { props.icon && <img className="c-empty-message__icon" src={props.icon} />}
                <div className="c-empty-message__box">
                    <h3 className="c-empty-message__title">{props.title}</h3>
                    { props.description ? <span className="c-empty-message__description">{props.description}</span> : null}
                    { props.button ? props.button : null }
                </div>
            </div>
        </div>
    );
}

interface EmptyMessageProps {
    className?: string;
    title: string,
    description?: string,
    icon?: any,
    button?: any
};