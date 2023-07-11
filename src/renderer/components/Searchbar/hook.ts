import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectMedias } from "../../store/medias";
import { selectSidebarOpened, toggleSidebar } from "../../store/sidebarOpened";

export default function useSearchbar() {

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


    return {
        search, inputRef, searchItems, sidebarIsMaximized, sidebarIsOpened,
        handleToggleSidebar, handleSearch, handleChange, handleClear, handleSearchItem
    };
}