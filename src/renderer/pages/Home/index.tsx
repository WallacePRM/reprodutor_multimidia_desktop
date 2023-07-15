import React, {  } from "react";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faFolder, faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { BsGlobe2 } from 'react-icons/bs';
import Button from "../../components/Button";
import EmptyMessage from "../../components/EmptyMessage";
import emptyMessageIcon from '../../assets/img/men-headset.svg';
import GridItem from '../../components/List/GridItem';
import Margin from "../../components/Animations/Margin";
import Opacity from "../../components/Animations/Opacity";
import Load from "../../components/Load";
import Modal from "../../components/Modal";
import SelectBlockMedia from "../../components/SelectBlock/SelectBlockMedia";
import { saveScrollPosition } from "../../common/dom";
import useHome from "../../components/Home/hook";

export default function Home() {

    const { listItems, popupRef, selectedItems, modalRef, urlRef, urlValidate, load, urlType, recentMedias, 
        handleSelectFile, openModalTooltip, handleOpenUrl, closeTooltip, handleValidateUrl, mapUrlType, handleChangeUrlType, handleSelectMedia } = useHome();

    return (
        <div className="c-app c-home">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Início</h1>
                <div className="c-container__header__actions">
                    { listItems.length > 0 ? <>
                    <Button onRead={ handleSelectFile } accept="audio/*,video/*" title="Procure arquivos para reproduzir" label="Abrir arquivo(s)" icon={faFolderClosed} style={{ borderRadius: '.3rem 0 0 .3rem', borderRight: 0 }}/>

                    <Popup
                    arrow={false}
                    ref={popupRef}
                    keepTooltipInside
                    trigger={<button className="c-button box-field" style={{ borderRadius: '0 .3rem .3rem 0' }} title="Mais opções para abrir mídia"><FontAwesomeIcon className="c-button__icon" style={{fontSize: '.5rem'}} icon={faChevronDown}/></button>} position="bottom right" >
                        <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect">
                            <label className="c-popup__item" >
                                <Button className="c-popup__item__button-hidden" onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <FontAwesomeIcon icon={faFolderClosed} className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir arquivo(s)</h3>
                                    <span className="c-popup__item__description">Procure arquivos para reproduzir</span>
                                </div>
                            </label>
                            <div className="c-popup__item">
                                <Button className="c-popup__item__button-hidden" onlyFolder onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <FontAwesomeIcon icon={faFolder} className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir pasta</h3>
                                    <span className="c-popup__item__description">Escolha uma pasta e reproduza todas as mídias nessa pasta</span>
                                </div>
                            </div>
                            <div className="c-popup__item">
                                <div className="c-popup__item__button-hidden" onClick={openModalTooltip}></div>
                                <div className="c-popup__item__icons">
                                    <BsGlobe2 className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir URL</h3>
                                    <span className="c-popup__item__description">Insíra uma URL e faça streaming de mídia desse endereço</span>
                                </div>
                            </div>
                        </Margin>
                    </Popup>
                    </> : null }
                </div>
            </div>

            { listItems.length > 0 ?
                <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                    <h3 className="c-container__content__title__text">Mídia recente</h3>
                    { selectedItems.length > 0 &&
                    <Opacity cssAnimation={["opacity"]}>
                        <SelectBlockMedia listItems={listItems}/>
                    </Opacity>}
                </Opacity>
            : null }

            <Modal
            title="Abrir um URL"
            footer={<Button onClick={handleOpenUrl} className={'flex-1 d-flex a-items-center j-content-center btn--primary c-button--no-media-style' + (!urlValidate ? ' disabled' : '')} label="Abrir"/>}
            onOpen={closeTooltip}
            reference={modalRef}
            >
                <>
                    <div className="c-modal__content__item">
                        <input onChange={handleValidateUrl} ref={urlRef} placeholder="Insira a URL de um arquivo, streaming ou playlist" className="box-field box-field--input flex-1" type="url"/>
                    </div>
                    <div className="c-modal__content__item mt-20">
                        <label className="c-modal__content__item__label">Tipo: </label>
                        <div className="d-flex a-items-center">
                            <Button
                            onClick={() => {}}
                            className="c-button--no-media-style"
                            label={mapUrlType(urlType)}
                            style={{ borderRadius: '.3rem 0 0 .3rem' }} />
                            <Popup nested arrow={false} ref={popupRef} keepTooltipInside trigger={<button className="c-button box-field" style={{ borderRadius: '0 .3rem .3rem 0', borderLeft: 'none' }} title="Mais opções para abrir mídia"><FontAwesomeIcon className="c-button__icon" style={{fontSize: '.5rem'}} icon={faChevronDown}/></button>} position="bottom right" >
                                <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{minWidth: '100px'}}>
                                    <div className="c-popup__item" onClick={closeTooltip}>
                                        <div onClick={(e) => handleChangeUrlType('video')} className="c-popup__item__button-hidden"/>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">Vídeo(s)</h3>
                                        </div>
                                    </div>
                                    <div className="c-popup__item" onClick={closeTooltip}>
                                        <div onClick={(e) => handleChangeUrlType('music')} className="c-popup__item__button-hidden"/>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">Música(s)</h3>
                                        </div>
                                    </div>
                                </Margin>
                            </Popup>
                        </div>
                    </div>
                </>
            </Modal>

            <div className="c-container__content" style={{ height: listItems.length === 0 ? '100%' : '' }}>
                {load && <Load style={{backgroundColor: 'rgb(var(--bg-color))'}}/>}
                { listItems.length == 0 ?  <EmptyMessage icon={emptyMessageIcon}
                    title="Conheça o novo Reprodutor Multimídia"
                    description="Use este aplicativo para reproduzir seus arquivos de áudio e vídeo e explorar suas bibliotecas pessoais."
                    button={<div className="d-flex a-items-center">
                    <Button onRead={ handleSelectFile } accept="audio/*,video/*" className="btn--primary c-button--no-media-style" label="Abrir arquivo" icon={faFolderClosed} style={{ borderRadius: '.3rem 0 0 .3rem', borderRight: 0 }}/>
                    <Popup arrow={false} ref={popupRef} keepTooltipInside trigger={<button className="btn--primary c-button box-field" style={{ borderRadius: '0 .3rem .3rem 0' }} title="Mais opções para abrir mídia"><FontAwesomeIcon className="c-button__icon" icon={faChevronDown}/></button>} position="bottom right" >
                        <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect">
                            <div className="c-popup__item" >
                                <Button className="c-popup__item__button-hidden" onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <FontAwesomeIcon icon={faFolderClosed} className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir arquivo(s)</h3>
                                    <span className="c-popup__item__description">Procure arquivos para reproduzir</span>
                                </div>
                            </div>
                            <div className="c-popup__item" >
                                <Button className="c-popup__item__button-hidden" onlyFolder onRead={ handleSelectFile } accept="audio/*,video/*"/>
                                <div className="c-popup__item__icons">
                                    <FontAwesomeIcon className="c-popup__item__icon" icon={faFolder} />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir pasta</h3>
                                    <span className="c-popup__item__description">Escolha uma pasta e reproduza todas as mídias nessa pasta</span>
                                </div>
                            </div>
                            <div className="c-popup__item" onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={openModalTooltip}></div>
                                <div className="c-popup__item__icons">
                                    <BsGlobe2 className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Abrir URL</h3>
                                    <span className="c-popup__item__description">Insíra uma URL e faça streaming de mídia desse endereço</span>
                                </div>
                            </div>

                        </Margin>
                    </Popup></div>}
                /> :
                <>
                    <Margin onScroll={saveScrollPosition} cssAnimation={["marginTop"]} className="c-list c-grid-list">
                        {recentMedias.map((media) => <GridItem
                        onSelectMedia={handleSelectMedia}
                        onPlay={ handleSelectMedia }
                        file={media}
                        key={media.id}/>)}
                    </Margin>
                </>
                }
            </div>
        </div>
    );
}