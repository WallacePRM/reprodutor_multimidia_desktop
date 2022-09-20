import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faCopyright, faFolder, faFolderClosed } from '@fortawesome/free-regular-svg-icons';
import { faChevronDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as PaletteIcon } from '@icon/themify-icons/icons/palette.svg';
import { ReactComponent as BrushIcon } from '@icon/themify-icons/icons/brush.svg';
import { ReactComponent as WorldIcon } from '@icon/themify-icons/icons/world.svg';
import Button from '../../components/Button';
import Margin from '../../components/Animations/Margin';
import { selectPageConfig, setPageConfig } from '../../store/pageConfig';
import { getPageService } from '../../service/page';
import PathItem from './PathItem';
import { Folder } from '../../../common/folders/type';
import { getFolderService } from '../../service/folder';
import { selectMedias, setMedias } from '../../store/medias';
import { getMediaService } from '../../service/media';
import { extractFilesInfo } from '../../service/media/media-handle';

import './index.css';

function Configs() {

    const [configState, setConfigState] = useState({
        music: {
            isOpen: false,
            folders: [] as Folder[]
        },
        video: {
            isOpen: false,
            folders: [] as Folder[]
        },
        theme: {
            isOpen: false,
        },
        color: {
            isOpen: false,
        }
    });

    const medias = useSelector(selectMedias);
    const pageConfig = useSelector(selectPageConfig);
    const pageService = getPageService();
    const dispatch = useDispatch();

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

        const configStateType = (configState as any)[type];

        setConfigState({
            ...configState,
            [type]: {
                ...configStateType,
                isOpen: !configStateType.isOpen,
            }
        });
    };

    const handleChangeTheme = async (e: React.ChangeEvent<HTMLInputElement>) => {

        e.stopPropagation();

        const theme = e.currentTarget.value;

        await pageService.setPageConfig({theme: theme});
        dispatch(setPageConfig({theme: theme}));
    };

    const HandleToggleMediaArt = async (e: React.ChangeEvent<HTMLInputElement>) => {

        e.stopPropagation();

        const mediaArt = e.currentTarget.checked;

        await pageService.setPageConfig({mediaArt: mediaArt});
        dispatch(setPageConfig({mediaArt: mediaArt}));
    };

    const handleDeletePath = async (pathItem: Folder) => {

        try {
            await getFolderService().deleteFolder(pathItem);

            const configStateType = (configState as any)[pathItem.type];
            setConfigState({
                ...configState,
                [pathItem.type]: {
                    ...configStateType,
                    folders: configStateType.folders.filter((folder: Folder) => folder.id !== pathItem.id)
                }
            });

            const folderPath = 'file://' + pathItem.path;
            const newMedias = medias.filter((media) => !media.src.startsWith(folderPath));

            dispatch(setMedias(newMedias));
        }
        catch {}
    };

    const handleAddPath = async (e: React.ChangeEvent<any>) => {

        e.stopPropagation();

        const input = e.currentTarget as HTMLInputElement;
        const type = input.accept.split('/')[0] === 'audio' ? 'music' : 'video';

        const files: File[] = Array.prototype.slice.call(input.files, 0);
        const fileList = extractFilesInfo(files);

        const pathSeparator = fileList[0].path.includes('/') ? '/' : '\\';
        const fileFolder = {
            path: fileList[0].path.split(pathSeparator).slice(0, -1).join(pathSeparator),
            type: type
        };

        try {

            const newMedias = await getMediaService().insertMedias(fileList);
            dispatch(setMedias(medias.concat(newMedias)));

            const musicFolder = await getFolderService().insertFolder(fileFolder);

            const configStateType = (configState as any)[type];
            setConfigState({
                ...configState,
                [type]: {
                    ...configStateType,
                    folders: [...configStateType.folders, musicFolder]
                }
            });
        }
        catch(e) {
            console.log(e);
        }
    };

    useEffect(() => {

        const getFoldersPath = async () => {

            const folders = await getFolderService().getFolders();
            const musicFolders = folders.filter(folder => folder.type === 'music');
            const videoFolders = folders.filter(folder => folder.type === 'video');

            setConfigState((lastState: any) => ({
                ...lastState,
                music: {
                    ...lastState.music,
                    folders: musicFolders,
                },
                video: {
                    ...lastState.video,
                    folders: videoFolders,
                }
            }));
        };

        getFoldersPath();
    }, []);

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
                                        <Button onRead={handleAddPath} accept="audio/mp3" onlyFolder icon={faFolderClosed} label="Adicionar uma pasta" />
                                        <div className="c-configs__block__content__item__actions__icon btn--icon">
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        </div>
                                    </div>
                                </div>

                                <div className="c-configs__block__content__item__list">
                                    {configState.music.folders.map((item) => <PathItem onDelete={handleDeletePath} pathItem={item} key={item.id}/>)}
                                    {configState.music.folders.length === 0 && <div className="c-configs__block__content__item__list__item c-configs__block__content__item__list__item--empty">Nenhuma pasta foi incluída nesta biblioteca.</div>}
                                </div>
                            </div>
                            <div className={'c-configs__block__content__item' + (configState.video.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                                <div onClick={() => handleShowUp('video')} className="c-configs__block__content__item__info">
                                    <div className="c-configs__block__content__item__label">
                                        <FontAwesomeIcon icon={faFolder} className="c-configs__block__content__item__label__icon" />
                                        <span>Locais na biblioteca de vídeos</span>
                                    </div>
                                    <div className="c-configs__block__content__item__actions">
                                        <Button onRead={handleAddPath} accept="video/mp4" onlyFolder icon={faFolderClosed} label="Adicionar uma pasta" />
                                        <div className="c-configs__block__content__item__actions__icon btn--icon">
                                            <FontAwesomeIcon icon={faChevronDown} />
                                        </div>
                                    </div>
                                </div>

                                <div className="c-configs__block__content__item__list">
                                    {configState.video.folders.map((item) => <PathItem onDelete={handleDeletePath} pathItem={item} key={item.id}/>)}
                                    {configState.video.folders.length === 0 && <div className="c-configs__block__content__item__list__item c-configs__block__content__item__list__item--empty">Nenhuma pasta foi incluída nesta biblioteca.</div>}
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
                                        <label className="c-configs__block__content__item__list__item__label">
                                            <input onChange={handleChangeTheme} defaultValue="light" className="checkbox-radio" type="radio" checked={pageConfig.theme === 'light' ? true : false} />
                                            <span className="ml-10">Claro</span>
                                        </label>
                                    </div>
                                    <div className="c-configs__block__content__item__list__item">
                                        <label className="c-configs__block__content__item__list__item__label">
                                            <input onChange={handleChangeTheme} defaultValue="dark" className="checkbox-radio" type="radio" checked={pageConfig.theme === 'dark' ? true : false}/>
                                            <span className="ml-10">Escuro</span>
                                        </label>
                                    </div>
                                    <div className="c-configs__block__content__item__list__item">
                                        <label className="c-configs__block__content__item__list__item__label">
                                            <input onChange={handleChangeTheme} defaultValue="auto" className="checkbox-radio" type="radio" checked={pageConfig.theme === 'auto' ? true : false}/>
                                            <span className="ml-10">Usar a configuração do sistema</span>
                                        </label>
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
                    <div className="c-configs__block">
                        <h2 className="c-configs__block__title">Informações sobre a mídia</h2>
                        <div className="c-configs__block__content">
                            <div className={'c-configs__block__content__item c-configs__block__content__item--huge' + (configState.theme.isOpen ? ' c-configs__block__content__item--show-up' : '')}>
                                <div className="c-configs__block__content__item__info">
                                    <div className="c-configs__block__content__item__label">
                                        <WorldIcon className="c-configs__block__content__item__label__icon icon-color"/>
                                        <span>Habilitar arte da mídia</span>
                                    </div>
                                    <label className="c-configs__block__content__item__actions">
                                        <span className="c-configs__block__content__item__actions__label">{pageConfig.mediaArt ? 'Ativado' : 'Desativado'}</span>
                                        <input onChange={HandleToggleMediaArt} className="ml-20 checkbox-switch" type="checkbox" checked={pageConfig.mediaArt}/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="c-configs__block c-configs__block--about">
                        <h2 className="c-configs__block__title">Sobre o Reprodutor Multimídia</h2>
                        <div className="c-configs__block__content">
                            <div className="c-configs__block__content__item">Versão 1.1.0</div>
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