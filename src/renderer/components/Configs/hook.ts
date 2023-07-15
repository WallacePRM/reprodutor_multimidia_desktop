import { useEffect, useRef, useState } from "react";
import { Folder } from "../../../common/folders/type";
import { useDispatch, useSelector } from "react-redux";
import { getPageService } from "../../service/page";
import { selectPageConfig, setPageConfig } from "../../store/pageConfig";
import { selectMediaPlaying, setMediaPlaying } from "../../store/mediaPlaying";
import { selectCurrentMedias, setCurrentMedias } from "../../store/player";
import { selectMedias, setMedias } from "../../store/medias";
import { getFolderService } from "../../service/folder";
import { getPlaylistService } from "../../service/playlist";
import { setPlaylists } from "../../store/playlists";
import { extractFilesInfo } from "../../service/media/media-handle";
import { getMediaService } from "../../service/media";
import { version } from "../../../config";

export default function useConfigs() {

    const [configState, setConfigState] = useState({
        music: {
            isOpen: false,
            folders: [] as Folder[]
        },
        video: {
            isOpen: false,
            folders: [] as Folder[]
        },
        theme: {
            isOpen: false,
        },
        color: {
            isOpen: false,
        },
        advanced: {
            isOpen: false,
        },
        medias: {
            isOpen: false,
        }
    });

    const medias = useSelector(selectMedias);
    const currentMedias = useSelector(selectCurrentMedias);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const pageConfig = useSelector(selectPageConfig);
    const pageService = getPageService();
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();

    const mapStrTheme = (theme: string) => {
        switch (theme) {
            case 'light':
                return 'Claro';
            case 'dark':
                return 'Escuro';
            default:
                return 'Usar a configuração do sistema';
        }
    };

    const handleShowUp = (type: string) => {

        const configStateType = (configState as any)[type];

        setConfigState({
            ...configState,
            [type]: {
                ...configStateType,
                isOpen: !configStateType.isOpen,
            }
        });
    };

    const handleChangeTheme = async (e: React.ChangeEvent<HTMLInputElement>) => {

        e.stopPropagation();

        const theme = e.currentTarget.value;

        await pageService.setPageConfig({theme: theme});
        dispatch(setPageConfig({theme: theme}));
    };

    const HandleToggleMediaArt = async (e: React.ChangeEvent<HTMLInputElement>) => {

        e.stopPropagation();

        const mediaArt = e.currentTarget.checked;

        await pageService.setPageConfig({mediaArt: mediaArt});
        dispatch(setPageConfig({mediaArt: mediaArt}));
    };

    const handleDeletePath = async (pathItem: Folder) => {

        try {
            await getFolderService().deleteFolder(pathItem);

            const configStateType = (configState as any)[pathItem.type];
            setConfigState({
                ...configState,
                [pathItem.type]: {
                    ...configStateType,
                    folders: configStateType.folders.filter((folder: Folder) => folder.id !== pathItem.id)
                }
            });

            const folderPath = 'file://' + pathItem.path;
            const newMedias = medias.filter((media) => !(media.src.startsWith(folderPath) && media.type === pathItem.type));

            dispatch(setMedias(newMedias));

            const playlists = await getPlaylistService().getPlaylists();
            dispatch(setPlaylists(playlists));

            const newCurrentMedias = [];
            for (const currentMedia of currentMedias) {

                const media = newMedias.find(m => m.id === currentMedia.id);
                if (media) {
                    newCurrentMedias.push(media);
                }
            }
            dispatch(setCurrentMedias(newCurrentMedias.length === 0 ? null : newCurrentMedias));

            if (!newCurrentMedias.some(m => m.id === mediaPlaying?.id)) {
                dispatch(setMediaPlaying(null));
            }

        }
        catch(e) {
            
            console.log(e.message);
        }
    };

    const handleAddPath = async (e: React.ChangeEvent<any>) => {

        e.stopPropagation();

        const input = e.currentTarget as HTMLInputElement;
        const type = input.accept.split('/')[0] === 'audio' ? 'music' : 'video';

        const files: File[] = Array.prototype.slice.call(input.files, 0);
        const fileList = extractFilesInfo(files);

        const pathSeparator = fileList[0].path.includes('/') ? '/' : '\\';
        const fileFolder = {
            path: fileList[0].path.split(pathSeparator).slice(0, -1).join(pathSeparator),
            type: type
        };

        try {

            const newMedias = await getMediaService().insertMedias(fileList);
            dispatch(setMedias(medias.concat(newMedias)));

            const musicFolder = await getFolderService().insertFolder(fileFolder);

            const configStateType = (configState as any)[type];
            setConfigState({
                ...configState,
                [type]: {
                    ...configStateType,
                    folders: [...configStateType.folders, musicFolder]
                }
            });
        }
        catch(e) {
            console.log(e);
        }
    };

    const handleWipeData = async (e: React.MouseEvent) => {

        e.stopPropagation();

        try {
            await getMediaService().deleteMedias(medias);

            const folders: Folder[] = (configState.video.folders.concat(...configState.music.folders)) as Folder[];
            for (const folder of folders) {
                await getFolderService().deleteFolder(folder);
            }

            dispatch(setMedias([]));
            setConfigState((lastState: any) => ({
                ...lastState,
                music: {
                    ...lastState.music,
                    folders: [],
                },
                video: {
                    ...lastState.video,
                    folders: [],
                }
            }));
        }
        catch(e) {

            console.log(e.message);
        }
    };

    const handleShowAdvancedOptions = () => {

        handleShowUp('advanced'); 
        setTimeout(() => messagesEndRef.current?.scrollIntoView(), 0);
    };

    useEffect(() => {

        const getFoldersPath = async () => {

            const folders = await getFolderService().getFolders();
            const musicFolders = folders.filter(folder => folder.type === 'music');
            const videoFolders = folders.filter(folder => folder.type === 'video');

            setConfigState((lastState: any) => ({
                ...lastState,
                music: {
                    ...lastState.music,
                    folders: musicFolders,
                },
                video: {
                    ...lastState.video,
                    folders: videoFolders,
                }
            }));
        };

        getFoldersPath();
    }, []);

    return {
        configState, pageConfig, messagesEndRef, medias, version,
        handleShowUp, handleAddPath, handleDeletePath, mapStrTheme, handleChangeTheme, HandleToggleMediaArt, handleWipeData, handleShowAdvancedOptions
    }
}