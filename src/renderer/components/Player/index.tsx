import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { ReactComponent as VolumeIcon } from '@icon/themify-icons/icons/volume.svg';
import { ReactComponent as ShuffleIcon } from '@icon/themify-icons/icons/control-shuffle.svg';
import { ReactComponent as ShuffleDesativeIcon } from '@icon/themify-icons/icons/layout-line-solid.svg';
import { ReactComponent as LoopIcon } from '@icon/themify-icons/icons/loop.svg';
import { ReactComponent as InfoIcon } from '@icon/themify-icons/icons/info-alt.svg';
import { ReactComponent as SpeedometerIcon } from '@icon/themify-icons/icons/dashboard.svg';
import { ReactComponent as BackLeftIcon } from '@icon/themify-icons/icons/back-left.svg';
import { ReactComponent as BackRightIcon } from '@icon/themify-icons/icons/back-right.svg';
import { ReactComponent as ArrowsCornerIcon } from '@icon/themify-icons/icons/arrows-corner.svg';
import { faFolderClosed } from "@fortawesome/free-regular-svg-icons";
import { faBars, faChevronRight, faPause } from "@fortawesome/free-solid-svg-icons";
import { ReactComponent as MusicAlt } from '@icon/themify-icons/icons/music-alt.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackwardStep, faEllipsis, faForwardStep, faPlay } from '@fortawesome/free-solid-svg-icons';
import { formatHHMMSS } from '../../common/time';
import { useDispatch } from 'react-redux';
import { selectMediaPlaying, setMediaPlaying } from '../../store/mediaPlaying';
import { selectCurrentMedias, setCurrentMedias } from '../../store/player';
import { selectPlayerMode, setPlayerMode } from '../../store/playerMode';
import ReactDOM from 'react-dom';
import PreviousRouter from '../PreviousRouter';
import Logo from '../Logo';
import Opacity from '../Animations/Opacity';
import Slider from '../Slider';
import { selectPlayerConfig, setPlayerConfig } from '../../store/playerConfig';
import { arrayUnshiftItem, shuffle, sortAsc } from '../../common/array';
import Popup from 'reactjs-popup';
import { toggleFullScreen } from '../../common/dom';
import { getPlayerService } from '../../service/player';
import { selectPlayerState, setPlayerState } from '../../store/playerState';
import { Media } from '../../service/media/types';
import Load from '../Load';
import WindowControls from '../WindowControls';
import { selectPageConfig } from '../../store/pageConfig';

import './index.css';

let timeoutId: any;
function Player() {

    const [ playerHidden, setPlayerHidden ] = useState(false);
    const [ mediaLoad, setMediaLoad ] = useState(false);

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
    const mediaLoadRef = useRef<boolean>();
    mediaLoadRef.current = mediaLoad;
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
    const firstMedia = currentMedias && currentMedias[0];
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

    const handlePrevious = () => {

        const index = currentMedias.findIndex((media) => media.id === file?.id);
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

        console.log('chamou');
        const newRate = parseFloat(e.target.value);
        if (mediaRef.current) {
            mediaRef.current.playbackRate = newRate;
        }

        dispatch(setPlayerConfig({ playbackRate: newRate }));
        await playerService.setPlayerConfig({ playbackRate: newRate });
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
            mediaRef.current.addEventListener('waiting', () => {

                if (mediaLoadRef.current === false) setMediaLoad(true);
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
                    dispatch(setMediaPlaying(null));
                    setTimeout(async () => {

                        const newLastMedia = {currentTime: 0}
                        await playerService.setLastMedia(newLastMedia);
                        dispatch(setPlayerState(newLastMedia));
                        dispatch(setMediaPlaying(newFile));
                    }, 0);
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
                        dispatch(setMediaPlaying(null));
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

                if (mediaLoadRef.current) setMediaLoad(false);
            });
            mediaRef.current.addEventListener('pause', () => {

                // const newFile = {
                //     ...file,
                //     isPlaying: false,
                // };
                // dispatch(setMediaPlaying(newFile));

                if (mediaLoadRef.current) setMediaLoad(false);
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
            <div onClick={(e) => e.stopPropagation()} className={'c-player-fullscreen__header' + (playerHidden ? ' c-player-fullscreen__header--hidden' : '')} style={{ display: playerMode === 'full' ? undefined : 'none', backgroundColor: 'rgb(24, 24 , 24, .7)' }}>
                <PreviousRouter className="c-player-fullscreen__icon"  onClick={ () => {dispatch(setPlayerMode('default')); clearInterval(timeoutId);} } title="Voltar"/>
                <Logo className="c-player-fullscreen__logo ml-10"/>
                <WindowControls className={playerMode === 'full' ? 'theme--dark' : ''}/>
            </div>
            <video key={file?.src} ref={ videoRef } id="player-video" typeof="video/mp4" onClick={handleToggleVideoInterface} onMouseMove={toggleMouseView} className={'c-player__file__cover c-player__file__cover--video' + (playerMode === 'full' ? ' video-full-mode' : ' video-default-mode')}>
                <source src={file?.src} typeof="video/mp4"/>
            </video>
            {mediaLoad && <Load className='player-load' style={playerMode === 'default' && videoRef.current ? {zIndex: '12', top: videoRef.current.offsetTop, left: videoRef.current.offsetLeft , height: videoRef.current.offsetHeight, width: videoRef.current.offsetWidth} : {}}/>}
        </Opacity>, document.getElementById('video-container')!
    );

    let audioComponent = (
        <Opacity cssAnimation={["opacity"]} className={'c-player__file__cover' + (playerMode === 'full' ? ' c-player__file__cover--music' : '')} style={ file && !file?.thumbnail ? coverStyle : {} }>
            { file?.thumbnail && <img src={file?.thumbnail}/> }
            { !file?.thumbnail && file?.type === 'folder' &&
                <><FontAwesomeIcon className="c-grid-list__item__icon__folder" icon={faFolderClosed} />
                <FontAwesomeIcon className="c-grid-list__item__icon__list" icon={faBars}/></> }
            { !file?.thumbnail && file?.type === 'music' && <MusicAlt className="icon-color--light" style={{ height: '1.5rem', width: '1.5rem' }}/>}
            {mediaLoad && playerMode === 'default' && <Load className="player-load"/>}
        </Opacity>
    );

    if (playerMode === 'full') {
        if (file?.type === 'music') {
        audioComponent = ReactDOM.createPortal(
            <Opacity cssAnimation={["opacity"]} onClick={(e) => e.stopPropagation()} className={'c-player-fullscreen'} style={{ backgroundImage: `url(${file?.thumbnail || ''})` }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: 'calc(100% - 7.3rem)', width: '100%', background: file?.thumbnail ? 'rgb(var(--bg-color--solid), .8)' : 'rgb(var(--bg-color--solid), 1)', backdropFilter: 'blur(2rem)' }}>
                    <div className="c-player-fullscreen__header">
                        <PreviousRouter className="c-player-fullscreen__header__icon" onClick={ () => dispatch(setPlayerMode('default'))} title="Voltar"/>
                        <Logo className="ml-10"/>
                        <WindowControls />
                    </div>
                    {audioComponent}
                </div>
                {mediaLoad && playerMode === 'full' && <Load className="player-load"/>}
            </Opacity>,
        document.querySelector('.c-app')! );
        }
    }

    return (
        <div onMouseOver={setPlayerVisible} className={'c-player' + (playerHidden ? ' c-player--hidden' : '') +
        (playerMode === 'full' && file?.type === 'video' ? ' c-player--full-mode-video theme--dark' : '') +
        (playerMode === 'full' && file?.type === 'music' ? ' c-player--full-mode-music' : '') +
        (!file ? ' c-player--disabled ' : '')}>
            <div className="c-player__progress">
                <span className="c-player__progress__time">{playerState ? formatHHMMSS(playerState.currentTime) : '00:00:00'}</span>
                <Slider className="c-player__progress__bar" onChange={handleChangeFileCurrentTime} data={ {value: currentTimePorcents, min: 0, max: 100} } style={!file ? {filter: 'grayscale(1)'} : {}} />
                <span className="c-player__left__time">{playerState ? formatHHMMSS(playerState.duration - playerState.currentTime) : '00:00:00'}</span>
            </div>
            <div  className="c-player__actions">
                <div className="c-player__file">
                    <div className="c-player__file__track" onClick={handleChangeFullMode} title="Reproduzindo agora (Ctrl+N)">
                        { file?.type !== 'video' ? audioComponent : videoComponent }
                        <div className={'c-player__file__info' + (playerMode === 'default' && file?.type === 'video' ? ' c-player__file__info--margin-video' : '') + (playerMode === 'default' && file?.type === 'music' ? ' c-player__file__info--margin-music' : '')}>
                            <h3 className="c-player__file__info__title">{file?.name}</h3>
                            <p className="c-player__file__info__author">{file?.author} { file?.album && <span className="c-player__file__info__album">{file?.album}</span>}</p>
                        </div>
                    </div>
                </div>
                <div className="c-player__controls">
                    { document.body.clientWidth > 655 &&
                    <div onClick={handleToggleShuffle} className="c-player__controls__item player--button  c-player__controls__item--shuffle" title={`Embaralhar: ${playerConfig.shuffle ? 'Ativado' : 'Desativado'} (Ctrl+H)`}>
                        {!playerConfig.shuffle && <ShuffleDesativeIcon className="icon-color c-player__controls__item--desatived"/>}
                        <ShuffleIcon className="icon-color"/>
                    </div>}
                    <div onClick={handlePrevious} className={'c-player__controls__item player--button' + (file && (currentMedias?.length === 1 || firstMedia?.id === file?.id) ? ' disabled' : '')} title="Voltar (Ctrl+B)">
                        <FontAwesomeIcon icon={faBackwardStep}/>
                    </div>
                    { document.body.clientWidth > 655 && file?.type === 'video' && playerMode === 'full' &&
                        <div onClick={handleTimeBack} className={'c-player__controls__item'} title="Retroceder 10 segundos (Ctrl+Esquerdo)">
                            <BackLeftIcon className="icon-color"/>
                        </div>
                    }
                    <div onClick={handlePlayPause} className="c-player__controls__item player--button c-player__controls__item--play" title="Executar (Ctrl+P)">
                        <FontAwesomeIcon icon={!mediaRef.current || mediaRef.current.paused ? faPlay : faPause}/>
                    </div>
                    { document.body.clientWidth > 655 && file?.type === 'video' && playerMode === 'full' &&
                        <div onClick={handleTimeForward} className={'c-player__controls__item'} title="Avançar 30 segundos (Ctrl+Direito)">
                            <BackRightIcon className="icon-color"/>
                        </div>
                    }
                    <div onClick={handleNext } className={'c-player__controls__item player--button' + (file && (currentMedias?.length === 1 || lastMedia?.id  === file?.id) ? ' disabled' : '')} title="Avançar (Ctrl+F)">
                        <FontAwesomeIcon icon={faForwardStep}/>
                    </div>
                    { document.body.clientWidth > 655 &&
                    <div onClick={handleChangeRepeatMode} className="c-player__controls__item player--button  c-player__controls__item--repeat" title={`Repetir: ${mapRepeatMode(playerConfig.repeatMode)} (Ctrl+T)`}>
                        {playerConfig.repeatMode === false && <ShuffleDesativeIcon className="icon-color c-player__controls__item--desatived"/>}
                        {playerConfig.repeatMode === 'once' && <span className="c-player__controls__item--repeat-once"></span>}
                        <LoopIcon className="icon-color"/>
                    </div>}
                </div>
                <div className="c-player__options">
                    <Popup keepTooltipInside arrow={false} ref={popupRef} trigger={ <div className="c-player__controls__options__item player--button"><VolumeIcon className="icon-color" title="Volume"/></div>} position="top center" >
                        <div className="c-popup noselect" style={{ minWidth: '250px' }}>
                            <div className="c-player__volume">
                                <VolumeIcon onClick={handleMute} className="c-player__volume__icon icon-color" title="Mudo"/>
                                <Slider  onChange={handleChangeVolume} className="c-player__volume__slider" data={{ min: 0, value: currentVolumePorcents, max: 100 }}></Slider>
                                <span className="c-player__volume__value">{currentVolumePorcents}</span>
                            </div>
                        </div>
                    </Popup>


                    { document.body.clientWidth > 655 &&
                    <div onClick={toggleFullScreen} className={'c-player__controls__options__item player--button' + (!file ? ' disabled' : '')}>
                        <ArrowsCornerIcon className="icon-color icon--inverted" title="Tela inteira(F11)"/>
                    </div>}
                    <Popup keepTooltipInside nested arrow={false} ref={popupRef} trigger={<div className="c-player__controls__options__item player--button c-player__controls__options__item--config" title="Mais opções"><FontAwesomeIcon icon={faEllipsis}/></div>} position="top right" >
                        <div className="c-popup noselect">
                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__icons">
                                    <InfoIcon className="c-popup__item__icon icon-color" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Propriedades</h3>
                                    <span className="c-popup__item__description">Ctrl+I</span>
                                </div>
                            </div>
                            <Popup keepTooltipInside closeOnDocumentClick={false} arrow={false} nested on="hover" mouseLeaveDelay={300} mouseEnterDelay={300} trigger={<div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')}><div className="c-popup__item__icons"><SpeedometerIcon className="c-popup__item__icon icon-color icon--inverted" /></div><div className="c-popup__item__label"><h3 className="c-popup__item__title">Velocidade</h3><FontAwesomeIcon className="c-popup__item__description" icon={faChevronRight}/></div></div>} position="top right" >
                                <div className="c-popup noselect" style={{ minWidth: '150px' }}>
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
                                </div>
                            </Popup>

                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleTimeBack}></div>
                                <div className="c-popup__item__icons">
                                    <BackLeftIcon className="c-popup__item__icon icon-color" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Retroceder 10 segundos</h3>
                                    <span className="c-popup__item__description">Ctrl+Esquerdo</span>
                                </div>
                            </div>
                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleTimeForward}></div>
                                <div className="c-popup__item__icons">
                                    <BackRightIcon className="c-popup__item__icon icon-color" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Avançar 30 segundos</h3>
                                    <span className="c-popup__item__description">Ctrl+Direita</span>
                                </div>
                            </div>
                            { document.body.clientWidth <= 655 && <>
                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleToggleShuffle}></div>
                                <div className="c-popup__item__icons">
                                    {!playerConfig.shuffle && <ShuffleDesativeIcon className="icon-color c-player__controls__item--desatived"/>}
                                    <ShuffleIcon className="c-popup__item__icon icon-color" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Embaralhar: {playerConfig.shuffle ? 'Ativado' : 'Desativado'}</h3>
                                    <span className="c-popup__item__description">Ctrl+H</span>
                                </div>
                            </div>
                            <div className={'c-popup__item c-popup__item--row'} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={handleChangeRepeatMode}></div>
                                <div className="c-popup__item__icons">
                                {playerConfig.repeatMode === false && <ShuffleDesativeIcon className="icon-color c-player__controls__item--desatived"/>}
                                {playerConfig.repeatMode === 'once' && <span className="c-player__controls__item--repeat-once" style={{ right: '50%' }}></span>}
                                    <LoopIcon className="c-popup__item__icon icon-color" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Repetir: {mapRepeatMode(playerConfig.repeatMode)}</h3>
                                    <span className="c-popup__item__description">Ctrl+T</span>
                                </div>
                            </div>
                            <div className={'c-popup__item c-popup__item--row' + (!file ? ' disabled' : '')} onClick={closeTooltip}>
                                <div className="c-popup__item__button-hidden" onClick={toggleFullScreen}></div>
                                <div className="c-popup__item__icons">
                                    <ArrowsCornerIcon className="c-popup__item__icon icon-color icon--inverted" />
                                </div>
                                <div className="c-popup__item__label">
                                    <h3 className="c-popup__item__title">Tela inteira</h3>
                                    <span className="c-popup__item__description">F11</span>
                                </div>
                            </div></>}
                        </div>
                    </Popup>
                </div>
            </div>
        </div>
    )
}

export default Player;