import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as ErrorSvg } from '../../../assets/img/404.svg';
import './index.css';

function NotFound() {

    return (
        <div className="c-notfound">
            <div className="c-notfound__img">
                <ErrorSvg />
            </div>
            <div className="c-notfound__message">
                <h1  className="c-notfound__title">Ooops...404!</h1>
                <span  className="c-notfound__description">A página solicitada não pôde ser encontrada.</span>
            </div>
            <Link to="/home" className="link">Voltar para o início</Link>
        </div>
    );
}

export default NotFound;