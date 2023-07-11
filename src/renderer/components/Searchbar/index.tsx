import React, {  } from 'react';
import Opacity from '../Animations/Opacity';
import { IoSearchOutline } from 'react-icons/io5';
import { IoCloseOutline } from 'react-icons/io5';
import Margin from '../Animations/Margin';
import useSearchbar from './hook';
import './index.css';

export default function Searchbar() {

    const { search, inputRef, searchItems, sidebarIsMaximized, sidebarIsOpened, 
        handleToggleSidebar, handleSearch, handleChange, handleClear, handleSearchItem } = useSearchbar();

    return (
        <form onSubmit={handleSearch} onClick={handleToggleSidebar} className={'c-searchbar' +
            (sidebarIsOpened ? ' c-searchbar--opened' : '') +
            (search !== '' ? ' c-searchbar--result-opened' : '')}>
            <input onChange={handleChange} value={search} ref={inputRef} className="c-searchbar__field box-field" type="text" placeholder="Pesquisar"/>
            {search !== '' && <IoCloseOutline onClick={handleClear} className="c-searchbar__icon c-searchbar__icon--clear" title="Ctrl+E"/>}
            <IoSearchOutline onClick={search ? handleSearch : null} className="c-searchbar__icon icon--inverted" title="Clique para pesquisar"/>

            {search !== '' && sidebarIsMaximized  && searchItems.length > 0 &&
                <div className="c-popup c-popup--searchbar noselect"
                style={{top: inputRef.current.offsetHeight + 10 + 'px', width: (321 - 54) + 'px'}}>
                    <Margin cssAnimation={["marginTop"]} className="c-popup--searchbar__list">

                        {searchItems.map((item, index) => {
                            return (
                                <Opacity key={index} cssAnimation={["opacity"]} onClick={handleSearchItem(item.name)} className="c-popup__item">
                                    <div className="c-popup__item__label">
                                        <h3 className="c-popup__item__title">{item.name}</h3>
                                    </div>
                                </Opacity>
                            )
                        })}
                    </Margin>
                </div>
            }
        </form>
    );
}