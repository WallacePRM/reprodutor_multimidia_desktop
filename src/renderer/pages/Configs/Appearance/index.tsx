import React from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as PaletteIcon } from '@icon/themify-icons/icons/palette.svg';
import { ReactComponent as BrushIcon } from '@icon/themify-icons/icons/brush.svg';
import '../index.css';

export default function Appearance(props: AppearanceProps) {

    const { configState, pageConfig, handleShowUp, mapStrTheme, handleChangeTheme } = props.options;

    return (
        <div className="c-configs__block">
            <h2 className="c-configs__block__title">Personalização</h2>
            <div className="c-configs__block__content">
                <div className={'c-configs__block__content__item' + (configState.theme.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                    <div onClick={() => handleShowUp('theme')} className="c-configs__block__content__item__info">
                        <div className="c-configs__block__content__item__label">
                            <BrushIcon className="c-configs__block__content__item__label__icon icon-color" />
                            <span>Tema do aplicativo</span>
                        </div>
                        <div className="c-configs__block__content__item__actions">
                            <span className="c-configs__block__content__item__actions__label">{mapStrTheme(pageConfig.theme)}</span>
                            <div className="c-configs__block__content__item__actions__icon btn--icon">
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        </div>
                    </div>

                    <div className="c-configs__block__content__item__list">
                        <div className="c-configs__block__content__item__list__item">
                            <label className="c-configs__block__content__item__list__item__label">
                                <input onChange={handleChangeTheme} defaultValue="light" className="checkbox-radio" type="radio" checked={pageConfig.theme === 'light' ? true : false} />
                                <span className="ml-10">Claro</span>
                            </label>
                        </div>
                        <div className="c-configs__block__content__item__list__item">
                            <label className="c-configs__block__content__item__list__item__label">
                                <input onChange={handleChangeTheme} defaultValue="dark" className="checkbox-radio" type="radio" checked={pageConfig.theme === 'dark' ? true : false} />
                                <span className="ml-10">Escuro</span>
                            </label>
                        </div>
                        <div className="c-configs__block__content__item__list__item">
                            <label className="c-configs__block__content__item__list__item__label">
                                <input onChange={handleChangeTheme} defaultValue="auto" className="checkbox-radio" type="radio" checked={pageConfig.theme === 'auto' ? true : false} />
                                <span className="ml-10">Usar a configuração do sistema</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className={'c-configs__block__content__item' + (configState.color.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                    <div onClick={() => handleShowUp('color')} className="c-configs__block__content__item__info">
                        <div className="c-configs__block__content__item__label">
                            <PaletteIcon className="c-configs__block__content__item__label__icon icon-color" />
                            <span>Cor de destaque</span>
                        </div>
                        <div className="c-configs__block__content__item__actions">
                            <span className="c-configs__block__content__item__actions__label">Usar a configuração do sistema</span>
                            <div className="c-configs__block__content__item__actions__icon btn--icon">
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        </div>
                    </div>

                    <div className="c-configs__block__content__item__list">
                        <div className="c-configs__block__content__item__list__item">
                            <div className="c-configs__block__content__item__list__item__label">
                                <input className="checkbox-radio" type="radio" checked />
                                <span className="ml-10">Usar a configuração do sistema</span>
                            </div>
                        </div>
                        <div className="c-configs__block__content__item__list__item">
                            <div className="c-configs__block__content__item__list__item__label" style={{}}>
                                <span style={{ fontSize: '.85em', color: 'rgb(var(--text-color--light));' }}>Você verá sua alteração na próxima vez que iniciar o aplicativo.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface AppearanceProps {
    options: any;
}