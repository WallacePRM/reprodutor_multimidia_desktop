import React from "react";
import { BsGlobe2 } from "react-icons/bs";

export default function InfoMedia(props: InfoMediaProps) {

    const { configState, pageConfig, HandleToggleMediaArt } = props.options;

    return (
        <div className="c-configs__block">
            <h2 className="c-configs__block__title">Informações sobre a mídia</h2>
            <div className="c-configs__block__content">
                <div className={'c-configs__block__content__item c-configs__block__content__item--huge' + (configState.theme.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                    <div className="c-configs__block__content__item__info">
                        <div className="c-configs__block__content__item__label">
                            <BsGlobe2 className="c-configs__block__content__item__label__icon" />
                            <span>Habilitar arte da mídia</span>
                        </div>
                        <label className="c-configs__block__content__item__actions">
                            <span className="c-configs__block__content__item__actions__label">{pageConfig.mediaArt ? 'Ativado' : 'Desativado'}</span>
                            <input onChange={HandleToggleMediaArt} className="ml-20 checkbox-switch" type="checkbox" checked={pageConfig.mediaArt} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface InfoMediaProps {
    options: any;
}