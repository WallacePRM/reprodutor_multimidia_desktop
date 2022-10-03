import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import Popup from 'reactjs-popup';

import { IoPlayOutline } from 'react-icons/io5';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { HiOutlineX } from 'react-icons/hi';
import { RiPlayList2Fill } from 'react-icons/ri';
import { HiOutlinePlus } from 'react-icons/hi';
import { FaPlusCircle } from 'react-icons/fa';
import { AiOutlineScan } from 'react-icons/ai';

import { selectSelectedFiles, setSelectedFiles } from '../../store/selectedFiles';
import { Media } from '../../../common/medias/types';
import { selectContainerMargin } from '../../store/containerMargin';
import Margin from '../Animations/Margin';
import { selectPlaylists } from '../../store/playlists';
import { Playlist } from '../../../common/playlists/types';
import { isPlaylist } from '../../common/array';
import ModalCreatePlaylist from '../Modal/ModalCreatePlaylist';
import ModalRenamePlaylist from '../Modal/ModalRenamePlaylist';

import './index.css';

function SelectBlock(props: SelectBlockProps) {

    const [ selected, setSelected ] = useState(false);
    const [ mediasSelected, setMediasSelected ] = useState([]);

    const { list, onPlay, onRemove, onSetInPlaylist, onSetNext } = props;
    const allPlaylists = useSelector(selectPlaylists);
    const selectedItems = useSelector(selectSelectedFiles);
    const containerMargin = useSelector(selectContainerMargin);
    const containerWidth = containerMargin.appWidth - (containerMargin.margin / 0.0625);
    const popupRef: any = useRef();
    const dispatch = useDispatch();

    const modalCreatePlaylistRef: any = useRef();
    const openModalCreatePlaylistTooltip = () => modalCreatePlaylistRef.current && modalCreatePlaylistRef.current.open();

    const modalRenamePlaylistRef: any = useRef();
    const openModalRenamePlaylistTooltip = () => modalRenamePlaylistRef.current && modalRenamePlaylistRef.current.open();

    const closeTooltip = (e: any) => {
        e.stopPropagation();
        popupRef.current && popupRef.current.close();
    };

    const clearSelectedItems = () => {
        dispatch(setSelectedFiles([]));
    };

    const handleSelectAllItems = () => {

        const newSelectState = !selected;

        setTimeout(() => {
            setSelected(newSelectState);

            if (newSelectState) {

                let newSelectedItems = [];
                for (let media of list) {
                    newSelectedItems.push({id: media.id});
                };

                dispatch(setSelectedFiles(newSelectedItems));
            }
            else {

                dispatch(setSelectedFiles([]));
            }
        }, 0);
    };

    const handleClearSelectedItems = () => {

        clearSelectedItems();
    };

    const handlePlaySelectedItems = (e: React.MouseEvent) => {

        onPlay();

        clearSelectedItems();
    };

    const handleSetNextSelectedItems = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        onSetNext();

        clearSelectedItems();
    };

    const handleSetMediasOnPlaylist = async (e: React.MouseEvent, playlist: Playlist) => {

        if (e.target !== e.currentTarget) return;

        onSetInPlaylist(playlist);

        clearSelectedItems();
    };

    const handleDeleteSelectedItems = async (e: React.MouseEvent) => {

        if (e.target !== e.currentTarget) return;

        onRemove();

        clearSelectedItems();
    };

    useEffect(() => {

        if (selectedItems.length !== list.length) {
            setSelected(false);
        }
        else {
            setSelected(true);
        }

        const getAllMediasSelected = () => {

            setMediasSelected([]);

            if (isPlaylist(list[0])) {

                const selectedPlaylists = (list as Playlist[]).filter(item => selectedItems.some(selectedItem => selectedItem.id === item.id));

                const playlistMediasSelected: Media[] = [];
                for (const playlist of selectedPlaylists) {

                    for (const media of playlist.medias) {
                        if (!playlistMediasSelected.some(m => m.id === media.id)) {
                            playlistMediasSelected.push(media);
                        }
                    }
                }

                setMediasSelected(playlistMediasSelected);
            }
            else {
                setMediasSelected((list as Media[]).filter(item => selectedItems.some(selectedItem => item.id === selectedItem.id)));
            }
        };

        getAllMediasSelected();

    }, [selectedItems]);

    return (
        <div className="c-select-block">
            <div className="c-select-block__info">
                <label onClick={handleSelectAllItems} className="d-flex a-items-center">
                    <input onChange={() => {}} checked={selected} className="checkbox-input" type="checkbox" />
                    <div className="checkbox-box mr-5"></div>
                    <span>{selectedItems.length > 1 ? selectedItems.length + ' itens' : selectedItems.length + ' item'} selecionado</span>
                </label>
                <span onClick={handleClearSelectedItems} className="c-select-block__item--clear accent--color">Limpar</span>
            </div>
            <div className="c-select-block__actions">
                <button onClick={handlePlaySelectedItems} className="c-select-block__actions__item c-button box-field btn--primary c-button--no-media-style">
                    <div className="c-select-block__actions__item__icons">
                        <IoPlayOutline className="c-select-block__actions__item__icon c-button__icon mr-5" style={{color: 'rgb(var(--title-color--inverted))'}}/>
                    </div>
                    <span className="c-button__label">Reproduzir</span>
                </button>
                {containerWidth >= 790 && <button onClick={handleSetNextSelectedItems} className="c-select-block__actions__item c-button box-field ">
                    <div className="c-select-block__actions__item__icons">
                        <IoPlayOutline className="c-select-block__actions__item__icon c-button__icon mr-5"/>
                        <FaPlusCircle className="c-select-block__actions__item__icon c-select-block__actions__item__icon--play-next"/>
                    </div>
                    <span className="c-button__label">Reproduzir em seguida</span>
                </button>}

                {containerWidth > 910 &&
                <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<button className="c-select-block__actions__item c-button box-field "><div className="c-select-block__actions__item__icons"><HiOutlinePlus className="c-select-block__actions__item__icon c-button__icon mr-5"/></div><span className="c-button__label">Adicionar a</span></button>} position="right top" >
                    <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                        <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                            <div onClick={handleSetNextSelectedItems} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <RiPlayList2Fill className="c-popup__item__icon" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Fila de reprodução</h3>
                            </div>
                        </div>
                        <div className="c-popup__item--separator"></div>
                        <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                            <div onClick={openModalCreatePlaylistTooltip} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <HiOutlinePlus className="c-popup__item__icon" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Nova playlist</h3>
                            </div>
                        </div>
                        {allPlaylists.length > 0 &&
                            allPlaylists.map((p, index) => {
                                return (
                                    <div key={index} className="c-popup__item c-popup__item--row">
                                        <div onClick={(e) => handleSetMediasOnPlaylist(e, {...p, medias: [...p.medias] })} className="c-popup__item__button-hidden"></div>
                                        <div className="c-popup__item__icons" style={{opacity: 0}}>
                                            <HiOutlinePlus className="c-popup__item__icon" />
                                        </div>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">{p.name}</h3>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </Margin>
                </Popup>}
                {containerWidth > 910 && selectedItems.length === 1 && isPlaylist(list[0]) && <button onClick={openModalRenamePlaylistTooltip} className="c-select-block__actions__item c-button box-field ">
                    <AiOutlineScan className="c-button__icon mr-5 rotate-90"/>
                    <span className="c-button__label">Renomear</span>
                </button>}

                {onRemove && containerWidth > 1030 && <button onClick={handleDeleteSelectedItems} className="c-select-block__actions__item c-button box-field ">
                    <div className="c-select-block__actions__item__icons">
                        <HiOutlineX className="c-select-block__actions__item__icon c-button__icon mr-5"/>
                    </div>
                    <span className="c-button__label">{isPlaylist(list[0]) ? 'Excluír' : 'Remover'}</span>
                </button>}
                {/* {containerWidth > 1030 && selectedItems.length === 1 && <button className="c-select-block__actions__item c-button box-field ">
                    <PencilIcon className="c-button__icon mr-5"/>
                    <span className="c-button__label">Editar informações</span>
                </button>} */}
                {/* {containerWidth > 1150 && selectedItems.length === 1 && <button className="c-select-block__actions__item c-button box-field ">
                    <InfoAltIcon className="c-button__icon mr-5"/>
                    <span className="c-button__label">Propriedades</span>
                </button>} */}

                {(containerWidth < 910 && selectedItems.length === 1 || containerWidth < 910 && selectedItems.length > 1) && <Popup onOpen={e => e?.stopPropagation()} nested keepTooltipInside arrow={false} ref={popupRef} trigger={ <button className="c-select-block__actions__item c-button box-field ml-10">
                    <IoEllipsisHorizontal className="c-button__icon"/>
                    </button>} position="top center">
                    <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '200px' }}>
                        {containerWidth < 790 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div onClick={handleSetNextSelectedItems} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <IoPlayOutline className="c-popup__item__icon" />
                                <FaPlusCircle className="c-popup__item__icon c-popup__item__icon--play-next"/>
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Reproduzir em seguida</h3>
                            </div>
                        </div>}

                        {containerWidth < 910 && <Popup keepTooltipInside closeOnDocumentClick={false} nested arrow={false} on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div onClick={e => e.stopPropagation()} className={'c-popup__item c-popup__item--row'}><div className="c-popup__item__icons"><HiOutlinePlus className="c-popup__item__icon" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Adicionar a</h3><IoChevronForwardOutline className="c-popup__item__description"/></div></div>} position="right top" >
                            <Margin cssAnimation={["marginTop"]} className="c-popup noselect bg-acrylic bg-acrylic--popup" style={{ minWidth: '130px' }}>
                                <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                    <div onClick={handleSetNextSelectedItems} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <RiPlayList2Fill className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Fila de reprodução</h3>
                                    </div>
                                </div>
                                <div className="c-popup__item--separator"></div>
                                <div className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                    <div onClick={openModalCreatePlaylistTooltip} className="c-popup__item__button-hidden"></div>
                                    <div className="c-popup__item__icons">
                                        <HiOutlinePlus className="c-popup__item__icon" />
                                    </div>
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">Nova playlist</h3>
                                    </div>
                                </div>
                                {allPlaylists.length > 0 &&
                                    allPlaylists.map((p, index) => {


                                        return (
                                            <div key={index} className="c-popup__item c-popup__item--row" onClick={closeTooltip}>
                                                <div onClick={(e) => handleSetMediasOnPlaylist(e, {...p, medias: [...p.medias] })} className="c-popup__item__button-hidden"></div>
                                                <div className="c-popup__item__icons" style={{opacity: 0}}>
                                                    <HiOutlinePlus className="c-popup__item__icon" />
                                                </div>
                                                <div className="c-popup__item__label">
                                                    <h3 className="c-popup__item__title">{p.name}</h3>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </Margin>
                        </Popup>}
                        {containerWidth < 910 && selectedItems.length === 1 && isPlaylist(list[0]) && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div onClick={openModalRenamePlaylistTooltip} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <AiOutlineScan className="c-popup__item__icon rotate-90" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Renomear</h3>
                            </div>
                        </div>}
                        {onRemove && containerWidth < 1030 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div onClick={handleDeleteSelectedItems} className="c-popup__item__button-hidden"></div>
                            <div className="c-popup__item__icons">
                                <HiOutlineX className="c-popup__item__icon" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">{isPlaylist(list[0]) ? 'Excluír' : 'Remover'}</h3>
                            </div>
                        </div>}
                        {/* {containerWidth < 1030 && selectedItems.length === 1 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div className="c-popup__item__icons">
                                <PencilIcon className="c-popup__item__icon" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Editar informações</h3>
                            </div>
                        </div>} */}
                        {/* {containerWidth < 1150 && selectedItems.length === 1 && <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                            <div className="c-popup__item__icons">
                                <InfoIcon className="c-popup__item__icon" />
                            </div>
                            <div className="c-popup__item__label">
                                <h3 className="c-popup__item__title">Propriedades</h3>
                            </div>
                        </div>} */}
                    </Margin>
                </Popup>}

                <ModalCreatePlaylist
                reference={modalCreatePlaylistRef}
                medias={mediasSelected}
                onClose={clearSelectedItems}/>

                {selectedItems.length === 1 && isPlaylist(list[0]) && <ModalRenamePlaylist
                reference={modalRenamePlaylistRef}
                playlist={(list as Playlist[]).find((p: Playlist) => p.id === selectedItems[0].id)}
                onClose={clearSelectedItems}/>}
            </div>
        </div>
    );
}

type SelectBlockProps = {
    list: Media[] | Playlist[];
    onPlay: () => void;
    onSetNext: () => void;
    onSetInPlaylist: (playlist: Playlist) => void;
    onRemove?: () => void;
};

export default SelectBlock;