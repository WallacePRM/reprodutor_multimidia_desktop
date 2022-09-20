import React from 'react';

import { IoCloseOutline } from 'react-icons/io5';

import './index.css';

function Input(props: InputProps) {

    const { value, onChange } = props;

    const handleClear = () => {

        onChange('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        onChange(e.currentTarget.value);
    };

    return (
        <div className={'c-input'}>
            <input onChange={handleChange} value={value} className="c-input__field box-field" type="text"/>
            {value && <IoCloseOutline onClick={handleClear} className="c-input__icon c-input__icon--clear" title="Ctrl+E"/>}
        </div>
    );
}

type InputProps = {
    value: string,
    onChange: (value: string) => void,
};

export default Input;