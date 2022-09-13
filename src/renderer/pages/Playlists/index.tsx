import React from 'react';
import { faChevronDown, faPlus, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import emptyMessageIcon from '../../assets/img/yt-gradient.svg';
import Button from '../../components/Button';
import EmptyMessage from '../../components/EmptyMessage';
import Margin from '../../components/Animations/Margin';
import GridItem from '../../components/List/GridItem';
import Opacity from '../../components/Animations/Opacity';

function Playlists() {

    const playlists: any[] = [];
    const dispatch = useDispatch();

    const handleSelectMedia = () => {

    };

    return (
        <div className="c-page c-playlists">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Playlists</h1>
            </div>

            { playlists.length > 0 ?
            <Opacity cssAnimation={["opacity"]} className="c-container__content__title">
                <div className="d-flex a-items-center">
                    <Button className="btn--primary c-button--no-media-style" label="Nova playlist" icon={faPlus} />
                    <div className="c-container__content__title__actions">
                        <div className="c-container__content__title__actions__item box-field box-field--transparent">
                            <label>Ordernar por: <span className="accent--color">A - Z</span></label>
                            <FontAwesomeIcon className="box-field__icon ml-10" icon={faChevronDown} />
                        </div>
                    </div>
                </div>
            </Opacity> : null }

            <div className="c-container__content" style={{ height: playlists.length === 0 ? '100%' : '' }}>
                { playlists.length == 0 ?  <EmptyMessage icon={emptyMessageIcon}
                    title="Você não tem playlists"
                    button={<div className="d-flex a-items-center">
                    <Button className="btn--primary c-button--no-media-style" label="Criar uma nova lista de reprodução" icon={faPlus}/>
                    </div>}
                /> :
                <>
                    <Margin cssAnimation={["marginTop"]} className="c-list c-grid-list">
                        {playlists.map((item) => <GridItem className="c-grid-list__item--video"  onClick={ handleSelectMedia } file={item} key={item.id}/>)}
                    </Margin>
                </>
                }
            </div>
        </div>
    );
}

export default Playlists;