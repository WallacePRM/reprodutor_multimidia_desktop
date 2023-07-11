import React from 'react';
import './index.css';

export default function PreLoad(props: PreLoadProps) {
    return (
        <div className={'c-preload ' + (props.className ? props.className : '')}>
            <svg className="c-preload__logo" width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M225 225C266.421 183.579 266.421 116.422 225 75.0002C183.579 33.5788 116.421 33.5788 75 75.0002C33.5786 116.422 33.5786 183.579 75 225C116.421 266.422 183.579 266.422 225 225Z" fill="url(#paint0_linear_1_5)" />
                <path d="M150 235C196.944 235 235 196.944 235 150C235 103.056 196.944 65 150 65C103.056 65 65 103.056 65 150C65 196.944 103.056 235 150 235Z" fill="#333333" />
                <path d="M195.75 140.885C202.75 144.936 202.75 155.064 195.75 159.115L132.75 195.574C125.75 199.625 117 194.562 117 186.459V113.541C117 105.438 125.75 100.375 132.75 104.426L195.75 140.885Z" fill="white" />
                <defs>
                    <linearGradient id="paint0_linear_1_5" x1="75" y1="75.0002" x2="225" y2="225" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFA26D" />
                        <stop offset="1" stop-color="#C464C6" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

interface PreLoadProps {
    className?: string;
};