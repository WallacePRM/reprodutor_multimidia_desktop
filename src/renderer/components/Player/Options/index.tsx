import React from "react";
import { IoRemoveOutline, IoVolumeHighOutline, IoVolumeLowOutline, IoVolumeMuteOutline } from 'react-icons/io5';
import { IoShuffleOutline } from 'react-icons/io5';
import { IoRepeatOutline } from 'react-icons/io5';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { IoReturnUpForwardOutline } from 'react-icons/io5';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { IoSpeedometerOutline } from 'react-icons/io5';
import { AiOutlineFullscreen } from 'react-icons/ai';
import { AiOutlineFullscreenExit } from 'react-icons/ai';
import { IoChevronForwardOutline } from 'react-icons/io5';
import Popup from "reactjs-popup";
import Margin from "../../Animations/Margin";
import Slider from "../../Slider";

export default function PlayerOptions(props: PlayerOptionsProps) {

    const { popupRef, currentVolumePorcents, playerConfig, pageConfig, file, playerMode,
        handleMute, handleChangeVolume, handleToggleFullScreen, handleSetPlayerbackRate, handleTimeBack, closeTooltip,
        handleTimeForward, handleToggleShuffle, handleChangeRepeatMode, mapRepeatMode } = props.options;

    const mapVolumeIcon = () => {

        if (playerConfig.volume === 0) return <IoVolumeMuteOutline className="c-player__volume__icon" title="Volume" />;
        if (playerConfig.volume <= 0.5) return <IoVolumeLowOutline className="c-player__volume__icon" title="Volume" />;
        if (playerConfig.volume > 0.5) return <IoVolumeHighOutline className="c-player__volume__icon" title="Volume" />;
    };

    return (
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
    );
}

interface PlayerOptionsProps {
    options: any
}