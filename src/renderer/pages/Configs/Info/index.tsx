import React from "react";
import { CgCopyright } from "react-icons/cg";

export default function Info(props: InfoProps) {

    const { configState, version, handleShowAdvancedOptions } = props.options;

    return (
        <div className="c-configs__block c-configs__block--about">
            <h2 className="c-configs__block__title">Sobre o Reprodutor Multimídia</h2>
            <div className="c-configs__block__content">
                <div className="c-configs__block__content__item">Versão {version}</div>

                <div className="c-configs__block__content__item">
                    <div className="d-flex a-items-center">
                        <CgCopyright className="mr-5" />
                        <span>2022 Wprm-Dev. Todos os direitos reservados.</span>
                    </div>
                </div>
                <div onClick={handleShowAdvancedOptions} className="c-configs__block__content__item accent--color">{configState.advanced.isOpen ? 'Ocultar' : 'Mostrar'} opções avançadas</div>

            </div>
        </div>
    );
}

interface InfoProps {
    options: any;
}