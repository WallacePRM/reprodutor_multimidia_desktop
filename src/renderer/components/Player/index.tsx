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

import './index.css';

let timeoutId: any;
function Player() {

    const [ playerHidden, setPlayerHidden ] = useState(false);

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
        justifyContent: 'center'
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

    const mapVolumeIcon = () => {

        if (playerConfig.volume === 0) return <IoVolumeMuteOutline className="c-player__volume__icon" title="Volume" />;
        if (playerConfig.volume <= 0.5) return <IoVolumeLowOutline className="c-player__volume__icon" title="Volume" />;
        if (playerConfig.volume > 0.5) return <IoVolumeHighOutline className="c-player__volume__icon" title="Volume" />;
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

    let videoComponent = ReactDOM.createPortal(
        <Opacity cssAnimation={["opacity"]}>
            {!pageConfig.fullscreen &&<div onClick={(e) => e.stopPropagation()} className={'c-player-fullscreen__header' + (playerHidden ? ' c-player-fullscreen__header--hidden' : '')} style={{ display: playerMode === 'full' ? undefined : 'none', backgroundColor: 'rgb(24, 24 , 24, .7)' }}>
                <PreviousRouter className="c-player-fullscreen__icon"  onClick={ () => {dispatch(setPlayerMode('default')); clearInterval(timeoutId);} } title="Voltar"/>
                <Logo className="c-player-fullscreen__logo ml-10"/>
                 <WindowControls className={playerMode === 'full' ? 'theme--dark' : ''}/>
            </div>}
            <video key={file?.src} ref={ videoRef } id="player-video" typeof="video/mp4" onClick={handleToggleVideoInterface} onMouseMove={toggleMouseView} className={'c-player__file__cover c-player__file__cover--video' + (playerMode === 'full' ? ' video-full-mode' : ' video-default-mode')}>
                <source src={file?.src} typeof="video/mp4"/>
            </video>
        </Opacity>, document.getElementById('video-container')!
    );

    let audioComponent = (
        <Opacity cssAnimation={["opacity"]} className={'c-player__file__cover' +
        (playerMode === 'full' ? ' c-player__file__cover--music' : '') +
        (pageConfig.fullscreen ? ' c-player__file__cover--fullscreen' : '')
        } style={ file && !file?.thumbnail ? coverStyle : {} }>
            { file?.thumbnail && <img src={file?.thumbnail}/> }
            { !file?.thumbnail && file?.type === 'music' && <IoMusicalNotesOutline className="icon-color--light"/>}
            { !file?.thumbnail && file?.type === 'video' && <IoFilmOutline className="icon-color--light"/>}
        </Opacity>
    );

    if (playerMode === 'full') {
        if (file?.type === 'music') {
            const backgroundImagePath = file?.thumbnail ? `${encodeURI(file?.thumbnail.replace(/\\/g, '/'))}` : '';

            audioComponent = ReactDOM.createPortal(
                <Opacity cssAnimation={["opacity"]} onClick={(e) => e.stopPropagation()} className={'c-player-fullscreen'} style={{ backgroundImage: `url("${backgroundImagePath}")` }}>
                    <div className="c-player-fullscreen__background-music-blur bg-acrylic" style={{ background: file?.thumbnail ? 'rgb(var(--bg-color--solid), .8)' : 'rgb(var(--bg-color--solid), 1)' }}>
                        {!pageConfig.fullscreen && <div className="c-player-fullscreen__header">
                            <PreviousRouter className="c-player-fullscreen__header__icon" onClick={ () => dispatch(setPlayerMode('default'))} title="Voltar"/>
                            <Logo className="ml-10"/>
                         <WindowControls />
                        </div>}
                        {audioComponent}
                    </div>
                </Opacity>,
            document.querySelector('.c-app')! );
        }
    }

    return (
        <div onMouseOver={setPlayerVisible} className={'c-player' + (playerHidden ? ' c-player--hidden' : '') +
        (playerMode === 'full' && file?.type === 'video' ? ' c-player--full-mode-video theme--dark' : '') +
        (playerMode === 'full' && file?.type === 'music' ? ' c-player--full-mode-music' : '') +
        (pageConfig.fullscreen ? ' c-player--fullscreen' : '') +
        (!file ? ' c-player--disabled ' : '')}
        style={{transition: playerMode === 'full' ? '.7s cubic-bezier(0.215, 0.610, 0.355, 1)' : '.2s cubic-bezier(0.075, 0.82, 0.165, 1)'}}>
            <div className="c-player__progress">
                <span className="c-player__progress__time">{playerState ? formatHHMMSS(playerState.currentTime, true) : '00:00:00'}</span>
                <Slider className="c-player__progress__bar" onChange={handleChangeFileCurrentTime} data={ {value: currentTimePorcents, min: 0, max: 100} } style={!file ? {filter: 'grayscale(1)'} : {}} />
                <span className="c-player__left__time">{playerState ? formatHHMMSS(playerState.duration - playerState.currentTime, true) : '00:00:00'}</span>
            </div>
            <div  className="c-player__actions">
                <div className="c-player__file">
                    <div className="c-player__file__track" onClick={handleChangeFullMode} title="Reproduzindo agora (Ctrl+N)" style={pageConfig.fullscreen ? {pointerEvents: 'none'} : {}}>
                        { file?.type !== 'video' ? audioComponent : videoComponent }
                        <div className={'c-player__file__info' + (playerMode === 'default' && file?.type === 'video' ? ' c-player__file__info--margin-video' : '') + (playerMode === 'default' && file?.type === 'music' ? ' c-player__file__info--margin-music' : '')} style={file?.type === 'video' ? {height: '72px'} : {}}>
                            <h3 className="c-player__file__info__title">{file?.name}</h3>
                            <p className="c-player__file__info__author">{file?.author} { file?.album && <span className="c-player__file__info__album">{file?.album}</span>}</p>
                        </div>
                    </div>
                </div>
                <div className="c-player__controls">
                    { document.body.clientWidth > 655 &&
                    <div onClick={handleToggleShuffle} className="c-player__controls__item player--button  c-player__controls__item--shuffle" title={`Embaralhar: ${playerConfig.shuffle ? 'Ativado' : 'Desativado'} (Ctrl+H)`}>
                        {!playerConfig.shuffle && <IoRemoveOutline className="c-player__controls__item--desatived"/>}
                        <IoShuffleOutline/>
                    </div>}
                    <div onClick={handlePrevious} className={'c-player__controls__item player--button'}title="Voltar (Ctrl+B)">
                        <IoPlaySkipBack />
                    </div>
                    { document.body.clientWidth > 655 && file?.type === 'video' && playerMode === 'full' &&
                        <div onClick={handleTimeBack} className={'c-player__controls__item'} title="Retroceder 10 segundos (Ctrl+Esquerdo)">
                            <IoReturnUpBackOutline className="c-player__controls__item--timeskip__arrow"/>
                            <span className="c-player__controls__item--timeskip__number">10</span>
                        </div>
                    }
                    <div onClick={handlePlayPause} className="c-player__controls__item player--button c-player__controls__item--play" title="Executar (Ctrl+P)">
                        {!mediaRef.current || mediaRef.current.paused ? <IoPlay /> : <IoPause />}
                    </div>
                    { document.body.clientWidth > 655 && file?.type === 'video' && playerMode === 'full' &&
                        <div onClick={handleTimeForward} className={'c-player__controls__item'} title="Avançar 30 segundos (Ctrl+Direito)">
                            <IoReturnUpForwardOutline className="c-player__controls__item--timeskip__arrow"/>
                            <span className={'c-player__controls__item--timeskip__number'}>30</span>
                        </div>
                    }
                    <div onClick={handleNext } className={'c-player__controls__item player--button' + (file && (currentMedias?.length === 1 || lastMedia?.id  === file?.id) ? ' disabled' : '')} title="Avançar (Ctrl+F)">
                        <IoPlaySkipForward />
                    </div>
                    { document.body.clientWidth > 655 &&
                    <div onClick={handleChangeRepeatMode} className="c-player__controls__item player--button  c-player__controls__item--repeat" title={`Repetir: ${mapRepeatMode(playerConfig.repeatMode)} (Ctrl+T)`}>
                        {playerConfig.repeatMode === false && <IoRemoveOutline className="c-player__controls__item--desatived"/>}
                        {playerConfig.repeatMode === 'once' && <span className="c-player__controls__item--repeat-once"></span>}
                        <IoRepeatOutline />
                    </div>}
                </div>
                <div className="c-player__options">
                    <Popup keepTooltipInside arrow={false} ref={popupRef} trigger={ <div className="c-player__controls__options__item player--button" title="Volume">{mapVolumeIcon()}</div>} position="top center" >
                        <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '250px', padding: '0.5rem' }}>
                            <div className="c-player__volume">
                                <div onClick={handleMute}>{mapVolumeIcon()}</div>
                                <Slider  onChange={handleChangeVolume} className="c-player__volume__slider" data={{ min: 0, value: currentVolumePorcents, max: 100 }}></Slider>
                                <span className="c-player__volume__value">{currentVolumePorcents}</span>
                            </div>
                        </Margin>
                    </Popup>


                    { document.body.clientWidth >= 850 &&
                    <div onClick={handleToggleFullScreen} className={'c-player__controls__options__item player--button' + (!file ? ' disabled' : '')}>
                        {pageConfig.fullscreen ? <AiOutlineFullscreenExit  title="Sair de tela inteira(F11)"/>
                        : <AiOutlineFullscreen title="Tela inteira(F11)"/>}
                    </div>}
                    <Popup keepTooltipInside nested arrow={false} ref={popupRef} trigger={<div className="c-player__controls__options__item player--button c-player__controls__options__item--config" title="Mais opções"><IoEllipsisHorizontal /></div>} position="top right" >
                        <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect">
                            {/* <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__icons">
                                    <InfoIcon className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Propriedades</h3>
                                    <span className="c-popup__item__description">Ctrl+I</span>
                                </div>
                            </div> */}
                            <Popup keepTooltipInside closeOnDocumentClick={false} arrow={false} nested on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')}><div className="c-popup__item__icons"><IoSpeedometerOutline className="c-popup__item__icon icon--inverted" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Velocidade</h3><IoChevronForwardOutline className="c-popup__item__description"/></div></div>} position="top right" >
                                <Margin cssAnimation={["marginTop"]} className="c-popup bg-acrylic bg-acrylic--popup noselect" style={{ minWidth: '150px', overflowY: 'hidden' }}>
                                    <div className={'c-popup__item c-popup__item--row' + (playerConfig.playbackRate === 0.25 ? ' c-popup__item--active' : '') + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                        <input onClick={handleSetPlayerbackRate} className="c-popup__item__button-hidden" type="number" defaultValue={0.25}/>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">0,25x</h3>
                                            <span className="c-popup__item__description">Ctrl+Shift+G</span>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <div className={'c-popup__item c-popup__item--row' + (playerConfig.playbackRate === 0.5 ? ' c-popup__item--active' : '') + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                        <input onClick={handleSetPlayerbackRate} className="c-popup__item__button-hidden" type="number" defaultValue={0.5}/>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">0,5x</h3>
                                            <span className="c-popup__item__description">Ctrl+Shift+H</span>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <div className={'c-popup__item c-popup__item--row' + (playerConfig.playbackRate === 1 ? ' c-popup__item--active' : '') + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                        <input onClick={handleSetPlayerbackRate} className="c-popup__item__button-hidden" type="number" defaultValue={1}/>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">1x</h3>
                                            <span className="c-popup__item__description">Ctrl+Shift+J</span>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <div className={'c-popup__item c-popup__item--row' + (playerConfig.playbackRate === 1.5 ? ' c-popup__item--active' : '') + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                        <input onClick={handleSetPlayerbackRate} className="c-popup__item__button-hidden" type="number" defaultValue={1.5}/>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">1,5x</h3>
                                            <span className="c-popup__item__description">Ctrl+Shift+K</span>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                    <div className={'c-popup__item c-popup__item--row' + (playerConfig.playbackRate === 2 ? ' c-popup__item--active' : '') + (!file ? ' disabled' : '')}  onClick={closeTooltip}>
                                        <input onClick={handleSetPlayerbackRate} className="c-popup__item__button-hidden" type="number" defaultValue={2}/>
                                        <div className="c-popup__item__label">
                                            <h3 className="c-popup__item__title">2x</h3>
                                            <span className="c-popup__item__description">Ctrl+Shift+L</span>
                                        </div>
                                        <div className="highlighter"></div>
                                    </div>
                                </Margin>
                            </Popup>

                            {!(document.body.clientWidth > 655 && file?.type === 'video' && playerMode === 'full') && <>
                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleTimeBack}></div>
                                <div className="c-popup__item__icons">
                                    <IoReturnUpBackOutline className="c-popup__item__icon c-popup__item__icon--timeskip__arrow"/>
                                    <span className="c-popup__item__icon--timeskip c-popup__item__icon--timeskip__number">10</span>
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Retroceder 10 segundos</h3>
                                    <span className="c-popup__item__description">Ctrl+Esquerdo</span>
                                </div>
                            </div>
                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleTimeForward}></div>
                                <div className="c-popup__item__icons">
                                    <IoReturnUpForwardOutline className="c-popup__item__icon c-popup__item__icon--timeskip__arrow"/>
                                    <span className="c-popup__item__icon--timeskip__number">30</span>
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Avançar 30 segundos</h3>
                                    <span className="c-popup__item__description">Ctrl+Direita</span>
                                </div>
                            </div></>}
                            { document.body.clientWidth < 850 &&
                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleToggleFullScreen}></div>
                                <div className="c-popup__item__icons">
                                    {pageConfig.fullscreen ? <AiOutlineFullscreenExit className="c-popup__item__icon" title="Sair de tela inteira(F11)"/>
                                    : <AiOutlineFullscreen className="c-popup__item__icon" title="Tela inteira(F11)"/>}
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Tela inteira</h3>
                                    <span className="c-popup__item__description">F11</span>
                                </div>
                            </div>}

                            { document.body.clientWidth <= 655 && <>
                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleToggleShuffle}></div>
                                <div className="c-popup__item__icons">
                                    {!playerConfig.shuffle && <IoRemoveOutline className="c-popup__item__icon c-player__controls__item--desatived" style={{height: '1.2rem', width: '1.2rem'}}/>}
                                    <IoShuffleOutline className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Embaralhar: {playerConfig.shuffle ? 'Ativado' : 'Desativado'}</h3>
                                    <span className="c-popup__item__description">Ctrl+H</span>
                                </div>
                            </div>
                            <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleChangeRepeatMode}></div>
                                <div className="c-popup__item__icons">
                                    {playerConfig.repeatMode === false && <IoRemoveOutline className="c-popup__item__icon c-player__controls__item--desatived" style={{height: '1.2rem', width: '1.2rem'}}/>}
                                    {playerConfig.repeatMode === 'once' && <span className="c-player__controls__item--repeat-once" style={{ right: '50%' }}></span>}
                                    <IoRepeatOutline className="c-popup__item__icon" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Repetir: {mapRepeatMode(playerConfig.repeatMode)}</h3>
                                    <span className="c-popup__item__description">Ctrl+T</span>
                                </div>
                            </div></>}
                        </Margin>
                    </Popup>
                </div>
            </div>
        </div>
    )
}

export default Player;