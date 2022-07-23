import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { delay } from './common/async';
import { setContainerMargin } from "./store/containerMargin";
import { selectPageConfig } from "./store/pageConfig";
import { setSidebarOpened } from "./store/sidebarOpened";

export function useWindowState(): WindowState {

    const [ windowFocused, setWindowFocused]  = useState(true);
    const [ theme, setTheme ] = useState('auto');

    let pageConfig = useRef(null);
    pageConfig.current = useSelector(selectPageConfig);
    const dispatch = useDispatch();

    useEffect(() => {

        window.onfocus = function () {

            setWindowFocused(true);
        };
        window.onblur = function () {

            setWindowFocused(false);
        };
    }, []);

    useEffect(() => {

        if (pageConfig.current.theme === 'light') {
            setTheme('light');
            return;
        }
        if (pageConfig.current.theme === 'dark') {
            setTheme('dark');
            return;
        }
        if (pageConfig.current.theme === 'auto') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {

                setTheme('dark');
            } else {

                setTheme('light');
            }
        }

        const handleChangeTheme = () => {

            if (theme === 'auto') {

                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {

                    setTheme('dark');
                } else {

                    setTheme('light');
                }
            }

            console.log('handleChangeTheme', theme);
        };

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleChangeTheme);

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleChangeTheme);
        }

    }, [pageConfig.current.theme]);

    useEffect(() => {
        const handleResize = () => {
            delay(() => {
                if (document.body.clientWidth < 1000) {
                    if (document.body.clientWidth <= 655) {
                        dispatch(setContainerMargin({
                            margin: 0,
                            appWidth: document.body.clientWidth
                        }));
                    }
                    else {
                        dispatch(setContainerMargin({
                            margin: 3,
                            appWidth: document.body.clientWidth
                        }));
                    }
                }

                if (document.body.clientWidth >= 1000) {
                    dispatch(setContainerMargin({
                        margin: 20,
                        appWidth: document.body.clientWidth
                    }));
                }

                dispatch(setSidebarOpened({ isOpened: false }));
            }, 0);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return [
        windowFocused,
        theme,
    ]
};

export type WindowState = [boolean, string];