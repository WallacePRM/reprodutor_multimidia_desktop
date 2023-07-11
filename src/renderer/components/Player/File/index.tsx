import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { setPlayerMode } from '../../../store/playerMode';
import PreviousRouter from '../../PreviousRouter';
import Logo from '../../Logo';
import Opacity from '../../Animations/Opacity';
import WindowControls from '../../WindowControls';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { IoFilmOutline } from 'react-icons/io5';
import React from "react";
import '../index.css';
import usePlayer from "../hook";

export default function PlayerFile(props: PlayerFileProps) {

    const { pageConfig, playerMode, file, videoRef, playerHidden, thumbCaptureSucess, coverStyle, toggleMouseView, timeoutId,
        handleToggleVideoInterface, setThumbCaptureSucess, handleChangeFullMode } = props.options;

    const dispatch = useDispatch();

    const videoComponent = ReactDOM.createPortal(
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
        } style={ file && (!file?.thumbnail || !thumbCaptureSucess) ? coverStyle : {} }>
            { file?.thumbnail && thumbCaptureSucess && <img src={file?.thumbnail} onErrorCapture={() => setThumbCaptureSucess(false)} /> }
            { (!file?.thumbnail || !thumbCaptureSucess) && file?.type === 'music' && <IoMusicalNotesOutline className="icon-color--light"/>}
            { (!file?.thumbnail || !thumbCaptureSucess) && file?.type === 'video' && <IoFilmOutline className="icon-color--light"/>}
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
        <div className="c-player__file">
            <div className="c-player__file__track" onClick={handleChangeFullMode} title="Reproduzindo agora (Ctrl+N)" style={pageConfig.fullscreen ? {pointerEvents: 'none'} : {}}>
                { file?.type !== 'video' ? audioComponent : videoComponent }
                <div className={'c-player__file__info' +
                (playerMode === 'default' && file?.type === 'video' ? ' c-player__file__info--margin-video' : '') +
                (playerMode === 'default' && file?.type === 'music' ? ' c-player__file__info--margin-music' : '')}
                style={playerMode === 'full' ? {height: '72px'} : {}}>
                    <h3 className="c-player__file__info__title">{file?.name}</h3>
                    <p className="c-player__file__info__author">{file?.author} { file?.album && <span className="c-player__file__info__album">{file?.album}</span>}</p>
                </div>
            </div>
        </div>
    );
}

interface PlayerFileProps {
    options: any;
}