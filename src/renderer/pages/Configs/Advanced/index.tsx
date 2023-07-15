import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { MdInfo } from "react-icons/md";

export default function Advanced(props: AdvancedProps) {

    const { configState, messagesEndRef, medias, handleWipeData, handleShowUp } = props.options;

    return (
        <div className={'c-configs__block'}>
            <div className="c-configs__block__content">
                <div className={'c-configs__block__content__item' + (configState.medias.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                    <div ref={messagesEndRef} onClick={() => handleShowUp('medias')} className="c-configs__block__content__item__info">
                        <div className="c-configs__block__content__item__label">
                            <FontAwesomeIcon icon={faTrashCan} className="c-configs__block__content__item__label__icon" />
                            <span>Forçar exclusão de mídias</span>
                        </div>
                        <div className="c-configs__block__content__item__actions">
                            <span onClick={handleWipeData} className={'c-configs__block__content__item__actions__label btn--icon' + (medias.length <= 0 ? ' disabled' : '')} style={{ color: 'rgb(var(--red-color))' }}>Deletar todas</span>
                            <div className="c-configs__block__content__item__actions__icon btn--icon">
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        </div>
                    </div>

                    <div className="c-configs__block__content__item__list c-configs__block__content__item__list--alert">
                        <div className="c-configs__block__content__item__list__item" style={{ justifyContent: 'start' }}>
                            <MdInfo className="mr-10" style={{ color: 'rgb(var(--brown-color))' }} />
                            Esta opção irá excluír todas as mídias e bibliotecas.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface AdvancedProps {
    options: any;
}