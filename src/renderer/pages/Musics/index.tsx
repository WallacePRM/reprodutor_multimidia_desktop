import React from 'react';
import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { IoChevronDownOutline } from 'react-icons/io5';
import { IoShuffleOutline } from 'react-icons/io5';
import Button from "../../components/Button";
import EmptyMessage from "../../components/EmptyMessage";
import emptyMessageIcon from '../../assets/img/music-gradient.svg';
import LineItem from '../../components/List/LineItem';
import { Media } from '../../../common/medias/types';
import { isOdd } from "../../common/number";
import { capitalizeFirstLetter } from "../../common/string";
import Margin from "../../components/Animations/Margin";
import Opacity from "../../components/Animations/Opacity";
import Popup from "reactjs-popup";
import Load from '../../components/Load';
import FilterBlock from '../../components/FilterBlock';
import SelectBlockMedia from '../../components/SelectBlock/SelectBlockMedia';
import useMusics from '../../components/Musics/hook';

export default function Musics() {

    let fileIndex: number = 0;
    const { musics, selectedItems, popupRef, filterField, pageConfig, load, filterBlock, listSeparators, separatorRef, mediaPlaying, lastSeparatorInvisible,
        handleShuffle, mapMusicsOrderBy, handleChangeMusicsOrderBy, handleSelectFile, hanndleGoToFilterSelected, onScrollToBottom, handleShowUpFilterBlock,
        handleSelectMedia, mapListSeparators, mapSeparatorByFilter, closeTooltip } = useMusics();

    return (
        <div className="c-app c-musics">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Música</h1>
                <div className="c-container__header__actions">
                    {musics.length > 0 ? <>
                        <Button onRead={handleSelectFile} onlyFolder accept="audio/mp3" icon={faFolderClosed} title="Adicionar uma pasta à biblioteca de músicas" label="Adicionar uma pasta" />
                    </> : null}
                </div>
            </div>

            {musics.length > 0 ?
                <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                    <div className="d-flex a-items-center">
                        <button onClick={handleShuffle} className="c-button box-field c-button--no-media-style btn--primary" title={document.body.clientWidth <= 655 ? 'Ordem aleatória e reproduzir' : ''}>
                            <IoShuffleOutline className="c-button__icon mr-10" />
                            <span className="c-button__label">Ordem aleatória e reproduzir</span>
                        </button>

                        <div className="c-container__content__title__actions">

                            <Popup keepTooltipInside arrow={false} mouseLeaveDelay={300} mouseEnterDelay={0} ref={popupRef} trigger={<div className="c-container__content__title__actions__item box-field box-field--transparent"><label>Ordernar por: <span className="accent--color">{mapMusicsOrderBy(filterField)}</span></label><IoChevronDownOutline className="box-field__icon ml-10" /></div>} position="bottom right" >
                                <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '130px' }}>
                                    <div className={'c-popup__item  c-popup__item--row' + (pageConfig.musicsOrderBy === 'name' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                        <input onClick={handleChangeMusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="name" />
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">A - Z</h3>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <div className={'c-popup__item c-popup__item--row' + (pageConfig.musicsOrderBy === 'author' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                        <input onClick={handleChangeMusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="author" />
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">Artista</h3>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <div className={'c-popup__item c-popup__item--row' + (pageConfig.musicsOrderBy === 'album' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                        <input onClick={handleChangeMusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="album" />
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">Álbum</h3>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <div className={'c-popup__item c-popup__item--row' + (pageConfig.musicsOrderBy === 'genre' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                        <input onClick={handleChangeMusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="genre" />
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">Gênero</h3>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <div className={'c-popup__item c-popup__item--row' + (pageConfig.musicsOrderBy === 'releaseDate' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                        <input onClick={handleChangeMusicsOrderBy} className="c-popup__item__button-hidden" type="text" defaultValue="releaseDate" />
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">Ano de lançamento</h3>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                </Margin>
                            </Popup>

                        </div>
                    </div>
                    {selectedItems.length > 0 &&
                        <Opacity cssAnimation={["opacity"]}>
                            <SelectBlockMedia listItems={musics} />
                        </Opacity>}
                </Opacity> : null}

            <div className="c-container__content" style={{ height: musics.length === 0 ? '100%' : '' }}>
                {load && <Load style={{ backgroundColor: 'rgb(var(--bg-color))' }} />}
                {musics.length === 0 ? <EmptyMessage icon={emptyMessageIcon}
                    title="Não foi possível encontrar nenhuma música"
                    description="Sua biblioteca de música não contém nenhum conteúdo de música."
                    button={
                        <div className="d-flex a-items-center">
                            <Button onRead={handleSelectFile} onlyFolder accept="audio/mp3" className="btn--primary c-button--no-media-style" icon={faFolderClosed} title="Adicionar pasta" label="Adicionar uma pasta" />
                        </div>}
                /> :

                    <>
                        {filterBlock && <FilterBlock onSelectItem={hanndleGoToFilterSelected} filterList={listSeparators} filter={filterField} ></FilterBlock>}
                        <Margin cssAnimation={["marginTop"]} onScroll={onScrollToBottom} className="c-list c-line-list">
                            <div onClick={handleShowUpFilterBlock} ref={separatorRef} className="w-100"><div className={'c-line-list__separator c-line-list__separator--fixed z-index-1'} style={{ width: separatorRef.current ? separatorRef.current.offsetWidth : '100%' }}><span className="accent--color">{capitalizeFirstLetter(lastSeparatorInvisible || '')}</span></div></div>

                            {listSeparators.map((separator) => {

                                const elements: React.ReactNode[] = [];
                                elements.push(<div onClick={handleShowUpFilterBlock} className={'c-line-list__separator accent--color'} key={separator}>{capitalizeFirstLetter(separator)}</div>);

                                let musicsFiltred: Media[] = [];
                                if (filterField === 'name') {
                                    musicsFiltred = musics.filter(music => mapListSeparators((music[filterField] || '').charAt(0).toLocaleUpperCase()) === separator);
                                }
                                else {
                                    musicsFiltred = musics.filter(music => mapSeparatorByFilter((music as any)[filterField]) === separator);
                                }

                                musicsFiltred.forEach((music) => {

                                    elements.push(<LineItem
                                        onPlay={handleSelectMedia}
                                        onSelectMedia={null}
                                        className={(isOdd(fileIndex) ? 'c-line-list__item--nostyle' : '') + (music.id === mediaPlaying?.id ? ' c-line-list__item--active' : '')}
                                        file={music}
                                        key={music.id} />);
                                    fileIndex++;
                                });

                                return elements;
                            })}
                        </Margin>
                    </>
                }
            </div>
        </div>
    );
}
