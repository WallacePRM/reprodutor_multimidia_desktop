import React from 'react';
import { faFolder, faFolderClosed } from '@fortawesome/free-regular-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/Button';
import PathItem from '../PathItem';
import { Folder } from '../../../../common/folders/type';
import '../index.css';

export default function Folders(props: FoldersProps) {

    const { configState, handleShowUp, handleAddPath, handleDeletePath } = props.options;

    return (
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
                            <Button
                                className='c-button--no-media-style'
                                onlyFolder
                                onRead={handleAddPath}
                                accept="audio/mp3"
                                icon={faFolderClosed}
                                label="Adicionar uma pasta" />
                            <div className="c-configs__block__content__item__actions__icon btn--icon">
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        </div>
                    </div>

                    <div className="c-configs__block__content__item__list">
                        {configState.music.folders.map((folder: Folder) => <PathItem onDelete={handleDeletePath} pathItem={folder} key={folder.id} />)}
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
                            <Button
                                className='c-button--no-media-style'
                                onRead={handleAddPath}
                                accept="video/mp4"
                                onlyFolder
                                icon={faFolderClosed}
                                label="Adicionar uma pasta" />
                            <div className="c-configs__block__content__item__actions__icon btn--icon">
                                <FontAwesomeIcon icon={faChevronDown} />
                            </div>
                        </div>
                    </div>

                    <div className="c-configs__block__content__item__list">
                        {configState.video.folders.map((folder: Folder) => <PathItem onDelete={handleDeletePath} pathItem={folder} key={folder.id} />)}
                        {configState.video.folders.length === 0 && <div className="c-configs__block__content__item__list__item c-configs__block__content__item__list__item--empty">Nenhuma pasta foi incluída nesta biblioteca.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface FoldersProps {
    options: any
}