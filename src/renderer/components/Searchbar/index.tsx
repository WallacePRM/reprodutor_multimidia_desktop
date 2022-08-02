import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarOpened, toggleSidebar } from '../../store/sidebarOpened';
import Opacity from '../Animations/Opacity';
import { useNavigate } from 'react-router-dom';
import { selectMedias } from '../../store/medias';

import { IoSearchOutline } from 'react-icons/io5';
import { IoCloseOutline } from 'react-icons/io5';

import './index.css';
import Margin from '../Animations/Margin';

function Searchbar() {

    const [ search, setSearch ] = useState('');

    const medias = useSelector(selectMedias);
    const searchItems = medias.filter(x => x.name.toLowerCase().includes(search.toLowerCase())).slice(0, 9);
    const sidebarIsOpened = useSelector(selectSidebarOpened);
    const sidebarIsMaximized = sidebarIsOpened || document.body.clientWidth > 999;
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClear = () => {

        setSearch('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setSearch(e.currentTarget.value);
    };

    const handleToggleSidebar = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!(document.body.clientWidth < 999 && document.body.clientWidth > 655)) return;
        if (!sidebarIsOpened) {
            dispatch(toggleSidebar());
        }

        inputRef.current && inputRef.current.focus();
    };

    const handleSearchItem = (item: string) => () => {

        navigate(`/search-results/${item}`);
        dispatch(toggleSidebar());

        setSearch('');
    };

    const handleSearch = (e: React.FormEvent) => {

        e.preventDefault();


        if (search.trim() !== '' && sidebarIsMaximized) {
            navigate(`/search-results/${search}`);

            dispatch(toggleSidebar());
        }

        setSearch('');
    };

    return (
        <form onSubmit={handleSearch} onClick={handleToggleSidebar} className={'c-searchbar' +
            (sidebarIsOpened ? ' c-searchbar--opened' : '') +
            (search !== '' ? ' c-searchbar--result-opened' : '')}>
            <input onChange={handleChange} value={search} ref={inputRef} className="c-searchbar__field box-field" type="text" placeholder="Pesquisar"/>
            {search !== '' && <IoCloseOutline onClick={handleClear} className="c-searchbar__icon c-searchbar__icon--clear" title="Ctrl+E"/>}
            <IoSearchOutline className="c-searchbar__icon icon--inverted" title="Clique para pesquisar"/>

            {search !== '' && sidebarIsMaximized  && searchItems.length > 0 &&
                <div className="c-popup c-popup--searchbar noselect"
                style={{top: inputRef.current.offsetHeight + 10 + 'px', width: (321 - 54) + 'px'}}>
                    <Margin cssAnimation={["marginTop"]} className="c-popup--searchbar__list">

                        {searchItems.map((item, ) => {
                            return (
                            <Opacity cssAnimation={["opacity"]} onClick={handleSearchItem(item.name)} className="c-popup__item">
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">{item.name}</h3>
                                </div>
                            </Opacity>)
                        })}
                    </Margin>
                </div>
            }
        </form>
    );
}

export default Searchbar;