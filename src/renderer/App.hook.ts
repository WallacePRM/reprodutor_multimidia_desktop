import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hexToRgb } from "./common/string";
import { getWindowsService } from "./service/windows";
import { setContainerMargin } from "./store/containerMargin";
import { selectMediaPlaying } from "./store/mediaPlaying";
import { selectPageConfig, setPageConfig } from "./store/pageConfig";
import { setPlayerMode } from "./store/playerMode";
import { setSidebarOpened } from "./store/sidebarOpened";

export function useWindowState(): WindowState {

    const [ theme, setTheme ] = useState('auto');

    let pageConfig = useRef(null);
    pageConfig.current = useSelector(selectPageConfig);
    let mediaPlaying = useRef(null);
    mediaPlaying.current = useSelector(selectMediaPlaying);

    const dispatch = useDispatch();

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

            if (pageConfig.current.theme === 'auto') {

                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {

                    setTheme('dark');
                } else {

                    setTheme('light');
                }
            }
        };

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleChangeTheme);

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleChangeTheme);
        }

    }, [pageConfig.current.theme]);

    useEffect(() => {

        const setAccentColor = async () => {

            const accentColor = await getWindowsService().getAccentColor();
            console.log(accentColor);

            const rgbColor = hexToRgb(accentColor) || pageConfig.current.accentColor;
            const rgbFormated = `${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]} `;

            dispatch(setPageConfig({ accentColor: rgbFormated }));
            document.documentElement.style.setProperty('--accent-color', rgbFormated);
        };

        setAccentColor();

    }, [pageConfig.current.accentColor]);

    useEffect(() => {

        const toggleFullScreenState = (e: any) => {

            const  code = e.code;

            if (code === 'F11') {

                e.preventDefault();

                if (!mediaPlaying.current) return;

                if (!document.fullscreenElement) {

                    document.documentElement.requestFullscreen();
                    dispatch(setPageConfig({fullscreen: true}));
                    dispatch(setPlayerMode('full'));
                }
                else {
                    if (document.exitFullscreen) {

                        document.exitFullscreen();
                        dispatch(setPageConfig({fullscreen: false}));

                        if (!mediaPlaying.current.isPlaying || mediaPlaying.current.type === 'music') {
                            dispatch(setPlayerMode('default'));
                        }
                    }
                }
            }
        };

        window.addEventListener('keydown', toggleFullScreenState);

        return () => {
            window.removeEventListener('keydown', toggleFullScreenState);
        }

    }, [])

    useEffect(() => {

        let timoutRisezeId: any = null;
        const handleResize = () => {

            if (timoutRisezeId) clearTimeout(timoutRisezeId);

            timoutRisezeId = setTimeout(() => {
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
        theme,
    ]
};

export type WindowState = [string];