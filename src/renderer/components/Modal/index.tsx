import React from 'react';
import Popup from 'reactjs-popup';
import TranformOpacity from '../Animations/TransformOpacity';
import Button from '../Button';

function Modal(props: ModalProps) {

    const { className, title, children, footer, reference, onOpen, onClose } = props;

    const closeModal = () => {

        reference.current && reference.current.close();
    };

    return (
        <Popup modal keepTooltipInside
        closeOnDocumentClick={false}
        arrow={false}
        ref={reference}
        onOpen={onOpen}
        onClose={onClose}
        overlayStyle={{backgroundColor: "rgb(var(--modal-bg-color), .35)"}}
        >
            <TranformOpacity
            cssAnimation={["transform"]}
            className={'c-modal noselect' + (className ? ' ' + className : '')}>
                <div className="c-modal__header">
                    <h3 className="c-modal__title">{title}</h3>
                </div>
                <div className="c-modal__content">
                    {children}
                </div>
                <div className="c-modal__footer">
                    {footer}
                    <Button onClick={closeModal} className="flex-1 d-flex a-items-center j-content-center ml-10 c-button--no-media-style" label="Cancelar"/>
                </div>
            </TranformOpacity>
        </Popup>
    );
}

type ModalProps = {
    className?: string,
    title: string,
    children: JSX.Element,
    footer: JSX.Element
    reference: any,
    onOpen?: () => void,
    onClose?: () => void,
};

export default Modal;