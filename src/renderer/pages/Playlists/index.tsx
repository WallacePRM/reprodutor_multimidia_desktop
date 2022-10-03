import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';

import { HiOutlinePlus } from 'react-icons/hi';
import { IoChevronDownOutline } from 'react-icons/io5';

import emptyMessageIcon from '../../assets/img/speaker-gradient.svg';
import Button from '../../components/Button';
import EmptyMessage from '../../components/EmptyMessage';
import Margin from '../../components/Animations/Margin';
import Opacity from '../../components/Animations/Opacity';
import { useSelector } from 'react-redux';
import { selectPageConfig, setPageConfig } from '../../store/pageConfig';
import { selectSelectedFiles } from '../../store/selectedFiles';
import PlaylistItem from './PlaylistItem';
import { getPlaylistService } from '../../service/playlist';
import { Playlist } from '../../../common/playlists/types';
import { selectPlaylists, setPlaylist } from '../../store/playlists';
import { sortAsc } from '../../common/array';
import Input from '../../components/Input';
import { Media } from '../../../common/medias/types';
import { getPageService } from '../../service/page';
import SelectBlockPlaylist from '../../components/SelectBlock/SelectBlockPlaylist';
import { saveScrollPosition } from '../../common/dom';

function Playlists() {

    const [ inputValue, setInputValue ] = useState('Playlist sem título');

    const pageConfig = useSelector(selectPageConfig);
    const selectedItems = useSelector(selectSelectedFiles);
    const filterField: string = pageConfig?.playlistsOrderBy ? pageConfig.playlistsOrderBy : 'name';
    let listItems = useSelector(selectPlaylists);
    let playlists: Playlist[] = [...listItems].sort((a, b) => sortAsc(((a as any)[filterField] || '').toLocaleLowerCase(), ((b as any)[filterField] || '').toLocaleLowerCase()));

    const popupRef = useRef(null);
    const createPlaylistPopup = useRef(null);
    const closeTooltip = () => popupRef.current && popupRef.current.close();
    const closePlaylistPopup = () => createPlaylistPopup.current && createPlaylistPopup.current.close();
    const dispatch = useDispatch();

    const handleChangePlaylistsOrderBy = async (orderBy: string) => {

        dispatch(setPageConfig({ playlistsOrderBy: orderBy }));
        await getPageService().setPageConfig({ playlistsOrderBy: orderBy });
    };

    const handleCreatePlaylist = async () => {

        if (inputValue.trim() === '') {
            setInputValue('Playlist sem título');
        }

        try {
            const playlistService = getPlaylistService();
            const playlist: Playlist = await playlistService.insertPlaylist({
                name: inputValue,
                modificationDate: new Date().toISOString(),
                medias: [] as Media[],
            });

            dispatch(setPlaylist(playlist));
        }
        catch(error) {
            alert(error.message);
        }
        finally {
            closePlaylistPopup();
        }
    };

    useEffect(() => {

        const restoreScrollPosition = async () => {

            const pageConfig = await getPageService().getPageConfig();

            if (pageConfig.scrollPosition && pageConfig.firstRun) {

                document.querySelector('.c-list').scrollTo(0, pageConfig.scrollPosition);
                dispatch(setPageConfig({firstRun: false}));
            }
            else {
                await getPageService().setPageConfig({scrollPosition: 0});
            }
        };

        restoreScrollPosition();
    }, []);

    return (
        <div className="c-page c-playlists">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Playlists</h1>
            </div>

            { playlists.length > 0 ?
            <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                <div className="d-flex a-items-center">
                        <Popup ref={createPlaylistPopup} onOpen={() => setInputValue('Playlist sem título')} keepTooltipInside arrow={false} trigger={<div className="c-button box-field btn--primary c-button--no-media-style" style={{maxHeight: '21px'}}><HiOutlinePlus className="c-button__icon mr-10"/><span className="c-button__label">Nova playlist</span></div>}>
                            <Margin cssAnimation={["marginTop"]} className="c-popup c-popup--no-hover bg-acrylic bg-acrylic--popup noselect" style={{minWidth: '300px'}}>
                                <label className="c-popup__item">
                                    <div className="c-popup__item__label">
                                        <Input value={inputValue} onChange={setInputValue} />
                                    </div>
                                </label>
                                <label className="c-popup__item">
                                    <div className="c-popup__item__label" style={{alignItems: 'center'}}>
                                      <Button
                                      onClick={handleCreatePlaylist}
                                      style={{fontSize: '.85rem', width: 'max-content'}}
                                      label="Criar playlist"
                                      className={'btn--primary c-button--no-media-style' +
                                      (inputValue.trim() === '' ? ' disabled' : '')} />
                                    </div>
                                </label>
                            </Margin>
                        </Popup>
                    <div className="c-container__content__title__actions">
                    <Popup keepTooltipInside arrow={false} mouseLeaveDelay={300} mouseEnterDelay={0} ref={popupRef} trigger={<div className="c-container__content__title__actions__item box-field box-field--transparent"><label>Ordernar por: <span className="accent--color">{mapPlaylistOrderBy(filterField)}</span></label><IoChevronDownOutline className="box-field__icon ml-10" /></div>} position="bottom right" >
                            <Margin cssAnimation={["marginTop"]}  className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '130px' }}>
                                <div className={'c-popup__item  c-popup__item--row' + (pageConfig.playlistsOrderBy === 'name' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <div onClick={() => handleChangePlaylistsOrderBy('name')} className="c-popup__item__button-hidden" />
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">A - Z</h3>
                                    </div>
                                    <div className="highlighter"></div>
                                </div>
                                <div className={'c-popup__item c-popup__item--row' + (pageConfig.playlistsOrderBy === 'modificationDate' ? ' c-popup__item--active' : '')} onClick={closeTooltip}>
                                    <div onClick={() => handleChangePlaylistsOrderBy('modificationDate')} className="c-popup__item__button-hidden" />
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
                    <SelectBlockPlaylist listItems={playlists}/>
                </Opacity>}
            </Opacity> : null }

            <div className="c-container__content" style={{ height: playlists.length === 0 ? '100%' : '' }}>
                { playlists.length == 0 ?  <EmptyMessage icon={emptyMessageIcon}
                    title="Você não tem playlists"
                    button={
                    <div className="d-flex a-items-center">
                       <Popup ref={createPlaylistPopup}  keepTooltipInside arrow={false} trigger={<div className="c-button box-field btn--primary c-button--no-media-style" style={{maxHeight: '21px'}}><HiOutlinePlus className="c-button__icon mr-10"/><span className="c-button__label">Criar uma nova lista de reprodução</span></div>}>
                            <Margin cssAnimation={["marginTop"]} className="c-popup c-popup--no-hover bg-acrylic bg-acrylic--popup noselect" style={{minWidth: '300px'}}>
                                <label className="c-popup__item">
                                    <div className="c-popup__item__label">
                                        <Input value={inputValue} onChange={setInputValue} />
                                    </div>
                                </label>
                                <label className="c-popup__item">
                                    <div className="c-popup__item__label" style={{alignItems: 'center'}}>
                                      <Button
                                      onClick={handleCreatePlaylist}
                                      style={{fontSize: '.85rem', width: 'max-content'}}
                                      label="Criar playlist"
                                      className={'btn--primary c-button--no-media-style' +
                                      (inputValue.trim() === '' ? ' disabled' : '')} />
                                    </div>
                                </label>
                            </Margin>
                        </Popup>
                    </div>}
                /> :
                <>
                    <Margin cssAnimation={["marginTop"]}
                    className="c-list c-grid-list"
                    onScroll={saveScrollPosition}>
                        {playlists.map((item) => <PlaylistItem
                        className="c-grid-list__item--playlist"
                        playlist={item}
                        key={item.id}/>)}
                    </Margin>
                </>
                }
            </div>
        </div>
    );
}

function mapPlaylistOrderBy(playlistOrderBy: string) {

    if (playlistOrderBy === 'name') return 'A - Z';
    if (playlistOrderBy === 'modificationDate') return 'Data de modificação';

    return 'Aleatório';
}

export default Playlists;