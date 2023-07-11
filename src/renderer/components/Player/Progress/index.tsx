import React from "react";
import { formatHHMMSS } from "../../../common/time";
import Slider from "../../Slider";
import '../index.css';

export default function PlayerProgress(props: PlayerProgressProps) {

    const { playerState, currentTimePorcents, file, handleChangeFileCurrentTime } = props.options;

    return (
        <div className="c-player__progress">
            <span className="c-player__progress__time">{playerState ? formatHHMMSS(playerState.currentTime, true) : '00:00:00'}</span>
            <Slider className="c-player__progress__bar" onChange={handleChangeFileCurrentTime} data={ {value: currentTimePorcents, min: 0, max: 100} } style={!file ? {filter: 'grayscale(1)'} : {}} />
            <span className="c-player__left__time">{playerState ? formatHHMMSS(playerState.duration - playerState.currentTime, true) : '00:00:00'}</span>
        </div>
    );
}

interface PlayerProgressProps {
    options: any
}