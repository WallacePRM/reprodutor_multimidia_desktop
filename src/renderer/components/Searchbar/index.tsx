import React, { useRef } from 'react';
import { ReactComponent as Search } from '@icon/themify-icons/icons/search.svg';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarOpened, toggleSidebar } from '../../store/sidebarOpened';

import './index.css';

function Searchbar(props: SearchbarProps) {

    const inputRef: any = useRef(null);

    const dispatch = useDispatch();
    const sidebarIsOpened = useSelector(selectSidebarOpened);
    const handleToggleSidebar = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!(document.body.clientWidth < 999 && document.body.clientWidth > 655)) return;
        if (!sidebarIsOpened) {
            dispatch(toggleSidebar());
        }

        inputRef.current && inputRef.current.focus();
    };

    return (
        <div onClick={handleToggleSidebar} className={'c-searchbar' + (sidebarIsOpened ? ' c-searchbar--opened' : '')}>
            <input ref={inputRef} className="c-searchbar__field box-field" type="text" placeholder="Pesquisar"/>
            <Search className="c-searchbar__icon icon-color icon--inverted" title="Clique para pesquisar"/>
        </div>
    );
}

type SearchbarProps = {

}

export default Searchbar;