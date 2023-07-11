import React from "react";
import { IoPause, IoPlay, IoPlaySkipBack, IoPlaySkipForward, IoRemoveOutline, IoRepeatOutline, IoReturnUpBackOutline, IoReturnUpForwardOutline, IoShuffleOutline } from "react-icons/io5";
import usePlayer from "../hook";
import '../index.css';

export default function PlayerControls(props: PlayerControlsProps) {

    const { playerMode, playerConfig, file, mediaRef, currentMedias, lastMedia,
        mapRepeatMode, handleToggleShuffle, handlePrevious, handleTimeBack, handlePlayPause, handleTimeForward, handleNext, handleChangeRepeatMode } = props.options;

    return (
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
    );
} 

interface PlayerControlsProps {
    options: any
}