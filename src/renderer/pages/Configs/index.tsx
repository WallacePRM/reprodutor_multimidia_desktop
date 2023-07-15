import React from 'react';
import Margin from '../../components/Animations/Margin';
import Folders from './Folders';
import Appearance from './Appearance';
import InfoMedia from './InfoMedia';
import Info from './Info';
import Advanced from './Advanced';
import useConfigs from '../../components/Configs/hook';
import './index.css';

export default function Configs() {

    const { configState, pageConfig, messagesEndRef, medias, version,
        handleShowUp, handleAddPath, handleDeletePath, mapStrTheme, handleChangeTheme, HandleToggleMediaArt, handleWipeData, handleShowAdvancedOptions } = useConfigs();

    const ConfigsFolders = { configState, handleShowUp, handleAddPath, handleDeletePath };
    const ConfigsAppearance = { configState, pageConfig, handleShowUp, mapStrTheme, handleChangeTheme };
    const ConfigsInfomedia = { configState, pageConfig, HandleToggleMediaArt };
    const ConfigsInfo = { configState, version, handleShowAdvancedOptions, };
    const ConfigsAdvanced = { configState, messagesEndRef, medias, handleWipeData, handleShowUp };

    return (
        <div className="c-app c-configs">
            <div className="c-container__header">
                <h1 className="c-container__header__title">Configurações</h1>
            </div>

            <div className="c-container__content">
                <Margin cssAnimation={["marginTop"]} className="c-list">
                    <Folders options={ConfigsFolders}/>
                    <Appearance options={ConfigsAppearance}/>
                    <InfoMedia options={ConfigsInfomedia}/>
                    <Info options={ConfigsInfo}/>
                    {configState.advanced.isOpen && <Advanced options={ConfigsAdvanced}/>}
                </Margin>
            </div>
        </div>
    );
}