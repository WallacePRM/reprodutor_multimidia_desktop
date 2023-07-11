
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { formatHHMMSS } from '../../common/time';
import { selectMediaPlaying, setMediaPlaying } from '../../store/mediaPlaying';
import { selectCurrentMedias, setCurrentMedias } from '../../store/player';
import { selectPlayerMode, setPlayerMode } from '../../store/playerMode';
import PreviousRouter from '../PreviousRouter';
import Logo from '../Logo';
import Opacity from '../Animations/Opacity';
import Slider from '../Slider';
import { selectPlayerConfig, setPlayerConfig } from '../../store/playerConfig';
import { arrayUnshiftItem, shuffle, sortAsc } from '../../common/array';
import Popup from 'reactjs-popup';
import { getPlayerService } from '../../service/player';
import { selectPlayerState, setPlayerState } from '../../store/playerState';
import { Media } from '../../../common/medias/types';
import WindowControls from '../WindowControls';
import Margin from '../Animations/Margin';
import { selectPageConfig, setPageConfig } from '../../store/pageConfig';

import { IoRemoveOutline } from 'react-icons/io5';
import { IoVolumeHighOutline } from 'react-icons/io5';
import { IoVolumeLowOutline } from 'react-icons/io5';
import { IoVolumeMuteOutline } from 'react-icons/io5';
import { IoPlaySkipForward } from 'react-icons/io5';
import { IoPlaySkipBack } from 'react-icons/io5';
import { IoPlay } from 'react-icons/io5';
import { IoPause } from 'react-icons/io5';
import { IoShuffleOutline } from 'react-icons/io5';
import { IoRepeatOutline } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { IoReturnUpForwardOutline } from 'react-icons/io5';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { IoSpeedometerOutline } from 'react-icons/io5';
import { AiOutlineFullscreen } from 'react-icons/ai';
import { AiOutlineFullscreenExit } from 'react-icons/ai';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { IoFilmOutline } from 'react-icons/io5';

let timeoutId: any;
export default function usePlayer() {

    const [ playerHidden, setPlayerHidden ] = useState(false);
    const [ thumbCaptureSucess, setThumbCaptureSucess ] = useState(true);

    const playerService = getPlayerService();
    const playerConfig = useSelector(selectPlayerConfig);
    const pageConfig = useSelector(selectPageConfig);
    const currentMedias = useSelector(selectCurrentMedias) || [];
    const file = useSelector(selectMediaPlaying);
    const playerMode = useSelector(selectPlayerMode);
    const mediaRef = useRef<HTMLAudioElement>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const currentMediasRef = useRef<Media[] | null>();
    currentMediasRef.current = currentMedias;
    const refLastFileId = useRef<number>();

    (window as any).audio = mediaRef;

    let playerState = useSelector(selectPlayerState);
    let currentTimePorcents = 0;
    if (playerState) {
        currentTimePorcents = playerState.duration > 0 ? playerState.currentTime / playerState.duration * 100 : 0;
    }
    else {
        playerState = { file_id: -1, duration: 0, currentTime: 0 };
    }

    const currentVolumePorcents = playerConfig.volume ? parseInt((playerConfig.volume * 100).toFixed(0)) : 0;
    const lastMedia = currentMedias && currentMedias[currentMedias.length - 1];
    const popupRef: any = useRef();
    const closeTooltip = () => popupRef.current && popupRef.current.close();
    const dispatch = useDispatch();
    const coverStyle = {
        border: '1px solid rgb(var(--border-color--dark), 0.1)',
        borderRadius: '.3rem',
        backgroundColor: 'rgb(var(--bg-color--light))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: playerMode === 'full' ? '5rem' : '1rem'
    };

    const toggleMouseView = (e: any) => {

        e.stopPropagation();
        clearTimeout(timeoutId);

        if (playerMode === 'full') {

            document.body.style.cursor = "default";
            playerHidden && setPlayerHidden(false);

            timeoutId = setTimeout(() => {
                if (mediaRef.current?.paused === false && playerMode === 'full') {
                    setPlayerHidden(true);
                    document.body.style.cursor = "none";
                }
            }, 3500);
        }
    };

    const mapRepeatMode = (mode: string | boolean) => {

        if (mode === 'all') {
            return 'Tudo';
        }

        if (mode === 'once') {
            return 'Um';
        }

        return 'Desativado';
    };

    const setPlayerVisible = () => {

        if (file && file.type === 'video') {
            clearTimeout(timeoutId);
            document.body.style.cursor = "default";
        }
    };

    const playSameMedia = async () => {

        const newTime = 0;
        mediaRef.current.currentTime = newTime;

        const newLastMedia = { currentTime: newTime };
        await playerService.setLastMedia(newLastMedia);
        dispatch(setPlayerState(newLastMedia));

        if (mediaRef.current.paused) {
            mediaRef.current.play();
        }
    };

    const handlePlayPause = () => {

        if (!mediaRef.current || !file) return;

        if (mediaRef.current.paused) {

            mediaRef.current.play();
        }
        else {

            const newFile = {
                ...file,
                isPlaying: false,
            };
            dispatch(setMediaPlaying(newFile));

            mediaRef.current.pause();
        }
    };

    const handlePrevious = async () => {

        const index = currentMedias.findIndex((media) => media.id === file?.id);

        const hourTemp = playerState.currentTime / 3600;
        const hour = Math.trunc(hourTemp);

        const minutesTemp = (hourTemp - hour) * 60;
        const minutes =  Math.trunc(minutesTemp);

        const seconds = Math.round((minutesTemp - minutes) * 60);

        if (seconds > 5 || index === 0) {

            await playSameMedia();

            return;
        }

        if (index > 0) {

            const newFile = currentMedias[index - 1];
            dispatch(setMediaPlaying(newFile));

        }
    };

    const handleNext = () => {

        const index = currentMedias.findIndex((media) => media.id === file?.id);
        if (index < currentMedias.length - 1) {
            const newFile = currentMedias[index + 1];
            dispatch(setMediaPlaying(newFile));
        }
    };

    const handleChangeFullMode = () => {

        if (playerMode === 'default') {
            dispatch(setPlayerMode('full'));
        }
        else {
            dispatch(setPlayerMode('default'));
            clearInterval(timeoutId);
        }
    };

    const handleToggleVideoInterface = (e: React.MouseEvent) => {
        if (playerMode === 'full') {
            e.stopPropagation();

            if (mediaRef.current?.paused) {

                mediaRef.current?.play();
                setTimeout(() => {
                    setPlayerHidden(true);
                    document.body.style.cursor = "none";
                }, 100);
            }
            else {
                mediaRef.current?.pause();
                setPlayerHidden(false);
                document.body.style.cursor = "default";
            }
        }
    };

    const handleChangeFileCurrentTime = async (e: any) => {
        if (mediaRef.current) {

            const newTime = e.target.value / 100 * playerState.duration;
            mediaRef.current.currentTime = newTime;

            const newLastMedia = { currentTime: newTime };
            await playerService.setLastMedia(newLastMedia);
            dispatch(setPlayerState(newLastMedia));
        }
    };

    const handleToggleShuffle = async () => {

        let newMedias = [...currentMedias];
        if (playerConfig.shuffle) {
            newMedias = newMedias.sort((a, b) => sortAsc(a.name, b.name));
            dispatch(setCurrentMedias(newMedias));

            dispatch(setPlayerConfig({ shuffle: false }));
            await playerService.setPlayerConfig({ shuffle: false });
        }
        else {
            newMedias = shuffle(newMedias);
            if (file) {
                const index = newMedias.findIndex(item => item.id === file.id);
                newMedias = arrayUnshiftItem(newMedias, index);
            }

            dispatch(setCurrentMedias(newMedias));
            dispatch(setPlayerConfig({ shuffle: true }));
            await playerService.setPlayerConfig({ shuffle: true });
        }
    };

    const handleChangeRepeatMode = async () => {

        if (playerConfig.repeatMode === 'all') {
            dispatch(setPlayerConfig({ repeatMode: 'once' }));
            await playerService.setPlayerConfig({ repeatMode: 'once' });
        }

        if (playerConfig.repeatMode === 'once') {
            dispatch(setPlayerConfig({ repeatMode: false }));
            await playerService.setPlayerConfig({ repeatMode: false });
        }

        if (playerConfig.repeatMode === false) {
            dispatch(setPlayerConfig({ repeatMode: 'all' }));
            await playerService.setPlayerConfig({ repeatMode: 'all' });
        }
    };

    const handleTimeForward = async () => {

        if (mediaRef.current) {

            const newTime = mediaRef.current.currentTime + 30;
            mediaRef.current.currentTime = newTime;

            const newLastMedia = { currentTime: newTime };
            await playerService.setLastMedia(newLastMedia);
            dispatch(setPlayerState(newLastMedia));
        }
    };

    const handleTimeBack = async () => {

        if (mediaRef.current) {

            const newTime = mediaRef.current.currentTime - 10;
            mediaRef.current.currentTime = newTime;

            const newLastMedia = { currentTime: newTime };
            await playerService.setLastMedia(newLastMedia);
            dispatch(setPlayerState(newLastMedia));
        }
    };

    const handleChangeVolume = async (e: any) => {

        const newVolume = e.target.value / 100;
        if (mediaRef.current) {
            mediaRef.current.volume = newVolume;
        }

        dispatch(setPlayerConfig({ volume: newVolume }));
        await playerService.setPlayerConfig({ volume: newVolume });
    };

    const handleMute = async () => {

        if (playerConfig.volume > 0) {

            if (mediaRef.current) {
                mediaRef.current.volume = 0;
            }
            dispatch(setPlayerConfig({ volume: 0 }));
            await playerService.setPlayerConfig({ volume: 0 });
        }
        else {

            if (mediaRef.current) {
                mediaRef.current.volume = 1;
            }
            dispatch(setPlayerConfig({ volume: 1 }));
            await playerService.setPlayerConfig({ volume: 1 });
        }
    };

    const handleSetPlayerbackRate = async (e: any) => {

        const newRate = parseFloat(e.target.value);
        if (mediaRef.current) {
            mediaRef.current.playbackRate = newRate;
        }

        dispatch(setPlayerConfig({ playbackRate: newRate }));
        await playerService.setPlayerConfig({ playbackRate: newRate });
    };

    const handleToggleFullScreen = () => {
        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();
            dispatch(setPageConfig({fullscreen: true}));
            dispatch(setPlayerMode('full'));
        }
        else {
            if (document.exitFullscreen) {

                document.exitFullscreen();
                dispatch(setPageConfig({fullscreen: false}));
                dispatch(setPlayerMode('default'));
            }
        }
    };

    useEffect(() => {
        if (file) {

            refLastFileId.current = file.id;
            if (mediaRef.current)  {
                mediaRef.current.pause();
            }
            if (file.type === 'music') {
                mediaRef.current = new Audio(file.src);
            }
            else {
                mediaRef.current = videoRef.current as HTMLVideoElement;
            }

            mediaRef.current.addEventListener('loadeddata', () => {
                setTimeout(async () => {
                    if (mediaRef.current)  {
                        mediaRef.current.currentTime = file.id === playerState.file_id ? playerState.currentTime : 0;
                        mediaRef.current.playbackRate = playerConfig.playbackRate;
                        mediaRef.current.volume = playerConfig.volume;
                    }

                    const newLastMedia = {
                        file_id: file.id,
                        duration: mediaRef.current?.duration || 0,
                        currentTime: mediaRef.current?.currentTime || 0,
                        first_load: false,
                    };

                    await playerService.setLastMedia(newLastMedia);
                    dispatch(setPlayerState(newLastMedia));

                    if (playerState.first_load !== true) {
                        mediaRef.current?.play();
                    }

                }, 200);
            });
            mediaRef.current.addEventListener('timeupdate', async () => {

                const newLastMedia = {currentTime: mediaRef.current?.currentTime || 0,};
                await playerService.setLastMedia(newLastMedia);
                dispatch(setPlayerState(newLastMedia));

            });
            mediaRef.current.addEventListener('ended', async () => {

                const currentMedias = currentMediasRef.current || [];
                file.type === 'video' && setPlayerHidden(false);

                const newLastMedia = {currentTime: 0};
                await playerService.setLastMedia(newLastMedia);
                dispatch(setPlayerState(newLastMedia));

                const newFile = {
                    ...file,
                    isPlaying: false,
                };

                if (playerConfig.repeatMode === 'once') {
                    playSameMedia();
                    return;
                }
                else {
                    dispatch(setMediaPlaying(newFile));
                }

                const index = currentMedias.findIndex((media) => media.id === file.id);
                if (!(index >= currentMedias.length - 1)) {
                    const nextFile = currentMedias[index + 1];
                    dispatch(setMediaPlaying(nextFile));
                }

                if (playerConfig.repeatMode === 'all' && index >= currentMedias.length - 1) {
                    if (newFile.id === currentMedias[0].id) {
                        playSameMedia();

                        return;
                    }

                    setTimeout(() => dispatch(setMediaPlaying(currentMedias[0])), 0);
                }
            });
            mediaRef.current.addEventListener('playing', () => {

                const newFile = {
                    ...file,
                    isPlaying: true,
                };
                dispatch(setMediaPlaying(newFile));
            });
            mediaRef.current.addEventListener('error', () => {

                alert('Falha ao carregar o arquivo');
                return;
            });
        }
        else {
            if (mediaRef.current) {
                mediaRef.current.pause();

                setTimeout(async () => {
                    const newLastMedia = {
                        duration: 0,
                        currentTime: 0,
                    };

                    await playerService.setLastMedia(newLastMedia);
                    dispatch(setPlayerState(newLastMedia));
                }, 0);
            };
        }
    }, [file?.id]);

    return {
        playerMode, playerHidden, file, pageConfig, playerState, currentTimePorcents, currentMedias, lastMedia, playerConfig, popupRef,
        currentVolumePorcents, mediaRef, videoRef, timeoutId, thumbCaptureSucess, coverStyle,
        setPlayerVisible, handleChangeFileCurrentTime, handleChangeFullMode, handleToggleShuffle, handlePrevious, handleTimeBack, handlePlayPause,
        handleTimeForward, handleNext, mapRepeatMode, handleChangeRepeatMode, handleToggleFullScreen, closeTooltip, handleSetPlayerbackRate,
        handleMute, handleChangeVolume, handleToggleVideoInterface, toggleMouseView, setThumbCaptureSucess, dispatch
    };
}