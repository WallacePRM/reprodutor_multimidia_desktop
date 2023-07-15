import React from 'react';
import Popup from "reactjs-popup";
import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import EmptyMessage from "../../components/EmptyMessage";
import emptyMessageIcon from "../../assets/img/video.svg";
import GridItem from "../../components/List/GridItem";
import Margin from "../../components/Animations/Margin";
import Opacity from "../../components/Animations/Opacity";
import Load from '../../components/Load';
import SelectBlockMedia from '../../components/SelectBlock/SelectBlockMedia';
import { saveScrollPosition } from '../../common/dom';
import useVideos from '../../components/Videos/hook';
import './index.css';

export default function Videos() {

    const { videoList, popupRef, pageConfig, selectedItems, load, filterField,
        handleSelectFile, handleChangeOrderBy, handleSelectMedia, closeTooltip, mapvideosOrderBy } = useVideos();

    return (
        <div className="c-page c-videos">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Vídeo</h1>
                <div className="c-container__header__actions">
                    { videoList.length > 0 && <Button onRead={handleSelectFile} onlyFolder accept="video/mp4" title="Procure arquivos para reproduzir" label="Adicionar pasta" icon={faFolderClosed} />}
                </div>
            </div>

            { videoList.length > 0 &&
            <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                <div className="d-flex a-items-center">
                    <div className="c-container__content__title__actions">
                        <Popup keepTooltipInside arrow={false} mouseLeaveDelay={300} mouseEnterDelay={0} ref={popupRef} trigger={<div className="c-container__content__title__actions__item box-field box-field--transparent"><label>Ordernar por: <span className="accent--color">{mapvideosOrderBy(filterField)}</span></label><FontAwesomeIcon className="box-field__icon ml-10" icon={faChevronDown} /></div>} position="bottom right" >
                            <Margin cssAnimation={["marginTop"]}  className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '130px' }}>
                                <div className={'c-popup__item  c-popup__item--row' + (pageConfig.videosOrderBy === 'name' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onChange={() => {}} onClick={handleChangeOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="name"/>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">A - Z</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                                <div onChange={() => {}} className={'c-popup__item  c-popup__item--row' + (pageConfig.videosOrderBy === 'releaseDate' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <input onClick={handleChangeOrderBy} className="c-popup__item__button-hidden" value="releaseDate"></input>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Data de modificação</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                            </Margin>
                        </Popup>
                    </div>
                </div>
                { selectedItems.length > 0 &&
                <Opacity cssAnimation={["opacity"]}>
                    <SelectBlockMedia listItems={videoList}/>
                </Opacity>}
            </Opacity>
            }

            <div className="c-container__content" style={{ height: videoList.length === 0 ? '100%' : '' }}>
                {load && <Load style={{backgroundColor: 'rgb(var(--bg-color))'}}/>}
                { videoList.length == 0 ?  <EmptyMessage icon={emptyMessageIcon}
                    title="Não conseguimos encontrar nenhum vídeo"
                    description="Sua biblioteca de vídeos não contém nenhum conteúdo de vídeo."
                    button={<div className="d-flex a-items-center">
                    <Button onRead={handleSelectFile} onlyFolder accept="video/mp4" className="btn--primary c-button--no-media-style" label="Adicionar pasta" icon={faFolderClosed}/>
                    </div>}
                /> :
                <>
                    <Margin onScroll={saveScrollPosition} cssAnimation={["marginTop"]} className="c-list c-grid-list">
                        {videoList.map((item) => <GridItem
                        className="c-grid-list__item--video"
                        onPlay={ handleSelectMedia }
                        onSelectMedia={ handleSelectMedia }
                        file={item} key={item.id}/>)}
                    </Margin>
                </>
                }
            </div>
        </div>
    );
}