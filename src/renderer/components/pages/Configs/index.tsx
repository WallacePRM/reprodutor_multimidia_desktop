import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faCopyright, faFolder, faFolderClosed } from '@fortawesome/free-regular-svg-icons';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as PaletteIcon } from '@icon/themify-icons/icons/palette.svg';
import { ReactComponent as BrushIcon } from '@icon/themify-icons/icons/brush.svg';
import Button from '../../Button';
import Margin from '../../Animations/Margin';
import { selectPageConfig, setPageConfig } from '../../../store/pageConfig';
import { getPageService } from '../../../service/page';

import './index.css';

function Configs() {

    const [configState, setConfigState] = useState({
        music: {
            isOpen: false,
        },
        video: {
            isOpen: false,
        },
        theme: {
            isOpen: false,
        },
        color: {
            isOpen: false,
        }
    } as any);

    const dispatch = useDispatch();
    const pageConfig = useSelector(selectPageConfig);
    const pageService = getPageService();

    const mapStrTheme = (theme: string) => {
        switch (theme) {
            case 'light':
                return 'Claro';
            case 'dark':
                return 'Escuro';
            default:
                return 'Usar a configuração do sistema';
        }
    };

    const handleShowUp = (type: string) => {

        setConfigState({
            ...configState,
            [type]: {
                ...configState[type],
                isOpen: !configState[type].isOpen,
            }
        });
    };

    const handleSelectTheme = (e: any) => {

        e.currentTarget.querySelector('input').click();
    };

    const handleChangeTheme = async (e: any) => {

        e.stopPropagation();

        const theme = e.currentTarget.value;

        await pageService.setPageConfig({theme: theme});
        dispatch(setPageConfig({theme: theme}));
    };

    useEffect(() => {

        const setPageConfig = () => {
            setConfigState({
                ...configState,
                theme: {
                    ...configState.theme,
                    current: pageConfig.theme,
                }
            });
        };

        setPageConfig();

    }, [pageConfig]);

    return (
        <div className="c-app c-configs">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Configurações</h1>
            </div>

            <div className="c-container__content">
                <Margin cssAnimation={["marginTop"]} className="c-list">
                    <div className="c-configs__block">
                        <h2 className="c-configs__block__title">Bibliotecas</h2>
                        <div className="c-configs__block__content">
                            <div className={'c-configs__block__content__item' + (configState.music.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                                <div onClick={() => handleShowUp('music')} className="c-configs__block__content__item__info">
                                    <div className="c-configs__block__content__item__label">
                                        <FontAwesomeIcon icon={faFolder} className="c-configs__block__content__item__label__icon" />
                                        <span>Locais na biblioteca de músicas</span>
                                    </div>
                                    <div className="c-configs__block__content__item__actions">
                                        <Button icon={faFolderClosed} label="Adicionar uma pasta" />
                                        <div className="c-configs__block__content__item__actions__icon btn--icon">
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        </div>
                                    </div>
                                </div>

                                <div className="c-configs__block__content__item__list">
                                    <div className="c-configs__block__content__item__list__item">
                                        <div className="c-configs__block__content__item__list__item__label">
                                            <span>D:\Músicas</span>
                                        </div>
                                        <div className="c-configs__block__content__item__list__item__actions">
                                            <Button icon={faTimes} onClick={() => {}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={'c-configs__block__content__item' + (configState.video.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                                <div onClick={() => handleShowUp('video')} className="c-configs__block__content__item__info">
                                    <div className="c-configs__block__content__item__label">
                                        <FontAwesomeIcon icon={faFolder} className="c-configs__block__content__item__label__icon" />
                                        <span>Locais na biblioteca de vídeos</span>
                                    </div>
                                    <div className="c-configs__block__content__item__actions">
                                        <Button icon={faFolderClosed} label="Adicionar uma pasta" />
                                        <div className="c-configs__block__content__item__actions__icon btn--icon">
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        </div>
                                    </div>
                                </div>

                                <div className="c-configs__block__content__item__list">
                                    <div className="c-configs__block__content__item__list__item">
                                        <div className="c-configs__block__content__item__list__item__label">
                                            <span>D:\_Dev\Utilitários\Vídeos</span>
                                        </div>
                                        <div className="c-configs__block__content__item__list__item__actions">
                                            <Button icon={faTimes} onClick={() => {}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="c-configs__block">
                        <h2 className="c-configs__block__title">Personalização</h2>
                        <div className="c-configs__block__content">
                            <div className={'c-configs__block__content__item' + (configState.theme.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                                <div onClick={() => handleShowUp('theme')} className="c-configs__block__content__item__info">
                                    <div className="c-configs__block__content__item__label">
                                        <BrushIcon className="c-configs__block__content__item__label__icon icon-color"/>
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
                                        <div onClick={handleSelectTheme} className="c-configs__block__content__item__list__item__label">
                                            <input onClick={handleChangeTheme} defaultValue="light" className="checkbox-radio" type="radio" checked={configState.theme.current === 'light' ? true : false} />
                                            <span className="ml-10">Claro</span>
                                        </div>
                                    </div>
                                    <div className="c-configs__block__content__item__list__item">
                                        <div onClick={handleSelectTheme} className="c-configs__block__content__item__list__item__label">
                                            <input onClick={handleChangeTheme} defaultValue="dark" className="checkbox-radio" type="radio" checked={configState.theme.current === 'dark' ? true : false}/>
                                            <span className="ml-10">Escuro</span>
                                        </div>
                                    </div>
                                    <div className="c-configs__block__content__item__list__item">
                                        <div onClick={handleSelectTheme} className="c-configs__block__content__item__list__item__label">
                                            <input onClick={handleChangeTheme} defaultValue="auto" className="checkbox-radio" type="radio" checked={configState.theme.current === 'auto' ? true : false}/>
                                            <span className="ml-10">Usar a configuração do sistema</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={'c-configs__block__content__item' + (configState.color.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                                <div onClick={() => handleShowUp('color')} className="c-configs__block__content__item__info">
                                    <div className="c-configs__block__content__item__label">
                                        <PaletteIcon className="c-configs__block__content__item__label__icon icon-color"/>
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="c-configs__block c-configs__block--about">
                        <h2 className="c-configs__block__title">Sobre o Reprodutor Multimídia</h2>
                        <div className="c-configs__block__content">
                            <div className="c-configs__block__content__item">Versão 1.0.0</div>
                            <div className="c-configs__block__content__item">
                                <div className="d-flex a-items-center">
                                    <FontAwesomeIcon icon={faCopyright} className="mr-5" />
                                    <span>2022 Wprm-Dev. Todos os direitos reservados.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Margin>
            </div>
        </div>
    );
}

export default Configs;