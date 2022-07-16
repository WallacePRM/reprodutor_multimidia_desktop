import React, { useState } from 'react';
import './index.css';

function Slider(props: SliderProps) {

    const [ animation, setAnimation ] = useState(false);
    const { min, max, value, step } = props.data;

    const onMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.button !== 2) {
            setAnimation(true);
        }
    };

    const onMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (e.button !== 2) {
            setAnimation(false);
        }
    };

    return(
        <div className={'c-slider' + (props.className ? ' ' + props.className : '')} style={props.style || {}}>
            <input onChange={props.onChange ? props.onChange : () => {}} className={'c-slider__input' + (animation ? ' input--slider-held-down' : '')} type="range" value={value} min={min} max={max} step={step ? step : ''} onMouseDown={onMouseDown} onMouseUp={onMouseUp} />
            <div className="c-slider__progress-bar" style={{ width: value + '%'}}></div>
        </div>
    );
}

type SliderProps = {
    className?: string;
    style?: {};
    data: SliderData;
    onChange?: (e: React.ChangeEvent) => void;
};

type SliderData = {
    min: number;
    max: number;
    step?: number;
    value: number;
};

export default Slider;