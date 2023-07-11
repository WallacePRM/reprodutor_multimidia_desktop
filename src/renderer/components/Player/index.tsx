import React from 'react';
import usePlayer from './hook';
import PlayerFile from './File';
import PlayerProgress from './Progress';
import PlayerControls from './Controls';
import PlayerOptions from './Options';
import './index.css';

export default function Player() {

    const {playerConfig, mediaRef, currentMedias, lastMedia, pageConfig, playerMode, file, videoRef, playerHidden,
        thumbCaptureSucess, coverStyle, timeoutId, popupRef, currentVolumePorcents, playerState, currentTimePorcents,
        handleChangeFileCurrentTime, handleMute, handleChangeVolume, handleToggleFullScreen, handleSetPlayerbackRate, closeTooltip,
        handleToggleVideoInterface, setThumbCaptureSucess, handleChangeFullMode, toggleMouseView, handleNext, handleTimeForward,
        setPlayerVisible, mapRepeatMode, handleToggleShuffle, handlePrevious, handleTimeBack, handlePlayPause, handleChangeRepeatMode } = usePlayer();

    const playerFile = { pageConfig, playerMode, file, videoRef, playerHidden, thumbCaptureSucess, coverStyle, timeoutId, toggleMouseView, handleToggleVideoInterface, setThumbCaptureSucess, handleChangeFullMode };
    const playerControls = { playerMode, playerConfig, file, mediaRef, currentMedias, lastMedia, mapRepeatMode, handleToggleShuffle, handlePrevious, handleTimeBack, handlePlayPause, handleTimeForward, handleNext, handleChangeRepeatMode }
    const playerOptions = { popupRef, currentVolumePorcents, playerConfig, pageConfig, file, playerMode, handleMute, handleChangeVolume, handleToggleFullScreen, handleSetPlayerbackRate, handleTimeBack, closeTooltip, handleTimeForward, handleToggleShuffle, handleChangeRepeatMode, mapRepeatMode};
    const playerProgress = { playerState, currentTimePorcents, file, handleChangeFileCurrentTime };

    return (
        <div onMouseOver={setPlayerVisible} className={'c-player' + (playerHidden ? ' c-player--hidden' : '') +
        (playerMode === 'full' && file?.type === 'video' ? ' c-player--full-mode-video theme--dark' : '') +
        (playerMode === 'full' && file?.type === 'music' ? ' c-player--full-mode-music' : '') +
        (pageConfig.fullscreen ? ' c-player--fullscreen' : '') +
        (!file ? ' c-player--disabled ' : '')}
        style={{transition: playerMode === 'full' ? '.7s cubic-bezier(0.215, 0.610, 0.355, 1)' : '.2s cubic-bezier(0.075, 0.82, 0.165, 1)'}}>
            <PlayerProgress options={playerProgress}/>
            <div className="c-player__actions">
                <PlayerFile options={playerFile} />
                <PlayerControls options={playerControls} />
                <PlayerOptions options={playerOptions}/>
            </div>
        </div>
    )
}