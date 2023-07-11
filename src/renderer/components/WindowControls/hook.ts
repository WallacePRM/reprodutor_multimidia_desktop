
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { WindowElectronApi } from '../../preload-types';
import { selectContainerMargin } from '../../store/containerMargin';

export default function useWindowControls() {

    const [isMaximized, setIsMaximized] = useState(false);

    const containerMargin = useSelector(selectContainerMargin);
    const style = {
        width: (containerMargin.appWidth - (containerMargin.margin === 0 ? 85 : containerMargin.margin / 0.0625)) + 'px',
    };

    const handleClose = async () => {

        await (window as WindowElectronApi).electronApi.closeWindow();
    };

    const handleMaximize = async () => {

        await (window as WindowElectronApi).electronApi.maximizeWindow();
        setIsMaximized(isMaximized);
    };

    const handleMinimize = async () => {

        await (window as WindowElectronApi).electronApi.minimizeWindow();
    };

    useEffect(() => {

        const setWindowMaximed = async () => {
            const isMaximized = await (window as WindowElectronApi).electronApi.isMaximize();
            setIsMaximized(isMaximized);
        };

        setWindowMaximed();

    }), [isMaximized];

    return {
        style,
        isMaximized,
        handleMinimize,
        handleMaximize,
        handleClose
    };
}