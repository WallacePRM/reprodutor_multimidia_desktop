import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { ChangeEventHandler, useRef } from 'react';
import './index.css';

function Button(props: ButtonProps) {

    const { label, icon, style, className, title, accept, onlyFolder, onClick, onRead } = props;
    const inputAtt: any = onlyFolder ? { directory: "", webkitdirectory: "" } : '';
    const ref: any = useRef(null);

    const handleTriggerInput = (e: React.MouseEvent) => {

        e.stopPropagation();

        if (ref.current) {
            ref.current?.click();
        }
    };

    return (
        <>
            <button
            disabled={className?.includes('disabled') ? true : false}
            onClick={ onClick || handleTriggerInput }
            className={'c-button box-field' + ( className ? ` ${className}` : '' )}
            style={ style ? style : {} } title={title ? title : ''}>
                { icon ? <FontAwesomeIcon className={'c-button__icon' + (label ? ' mr-10' : '')} icon={icon} /> : null }
                { label ? <span className="c-button__label">{label}</span> : null }
            </button>
            { !onClick ? <input onChange={ onRead } ref={ ref } type="file" accept={accept ? accept : '*'}  {...inputAtt} multiple hidden/> : null}
        </>
    );
}

type ButtonProps = {
    label?: string,
    icon?: FontAwesomeIconProps['icon'],
    style?: object,
    title?: string,
    className?: string,
    accept?: string,
    onlyFolder?: boolean,
    onClick?: () => void,
    onRead?: ChangeEventHandler<HTMLInputElement>,
};

export default Button;