import React from 'react';
import GridItem from '../../components/List/GridItem';
import LineItem from '../../components/List/LineItem';
import EmptyMessage from '../../components/EmptyMessage';
import { isOdd } from '../../common/number';
import Load from '../../components/Load';
import Margin from '../../components/Animations/Margin';
import Opacity from '../../components/Animations/Opacity';
import useSearchResults from '../../components/SearchResults/hook';

export default function SearchResults() {

    let index = -1;
    const { load, musics, videos, search,
        handleGetAllMusicsFiltered, handleSelectMusic, handleGetAllVideosFiltered, handleSelectVideo } = useSearchResults();

    return (
        <div className="c-app c-search-results">
            <Opacity cssAnimation={['opacity']} className="c-container__header">
                <h1 className="c-container__header__title" style={{ whiteSpace: 'break-spaces'}}>Procurar resultados para "{search}"</h1>
            </Opacity>
            <div className="c-container__content" style={musics.length === 0 && videos.length === 0 ? {flex: '1'} : {}}>
                {load && <Load/>}
                {musics.length === 0 && videos.length === 0 ? <EmptyMessage className="c-list__empty-message" title="Nenhum resultado" description="Tente procurar algo diferente"/>
                : <Margin cssAnimation={["marginTop"]} className="c-list">
                    {musics.length > 0 && <>
                    <div className="c-list__title">
                        <h3 className="c-list__title__text">Músicas</h3>
                        {musics.length <= 5 && musics.length > 1 && <button onClick={handleGetAllMusicsFiltered} className="c-list__title__button"><span className="accent--color">Ver tudo</span></button>}
                    </div>
                    <div className="c-line-list">
                        {musics.map(music => (
                        index++,
                        <LineItem noSelect
                        onPlay={handleSelectMusic}
                        onSelectMedia={handleSelectMusic}
                        className={isOdd(index) ? 'c-line-list__item--nostyle' : ''}
                        key={music.id}
                        file={music}/>))}
                    </div></>
                    }
                    {videos.length > 0 && <>
                    <div className="c-list__title">
                        <h3 className="c-list__title__text">Vídeos</h3>
                        {videos.length <= 5 && videos.length > 1 && <button onClick={handleGetAllVideosFiltered} className="c-list__title__button"><span className="accent--color">Ver tudo</span></button>}
                    </div>
                    <div className="c-grid-list">
                        {videos.map(video => <GridItem className="c-grid-list__item--video" noSelect
                        onPlay={handleSelectVideo}
                        onSelectMedia={handleSelectVideo}
                        key={video.id}
                        file={video}/>)}
                    </div></>}
                </Margin>}
            </div>
        </div>
    );
}