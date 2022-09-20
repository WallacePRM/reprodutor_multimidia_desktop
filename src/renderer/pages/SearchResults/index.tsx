import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMediaService } from '../../service/media';
import { Media } from '../../../common/medias/types';
import GridItem from '../../components/List/GridItem';
import LineItem from '../../components/List/LineItem';
import EmptyMessage from '../../components/EmptyMessage';
import { isOdd } from '../../common/number';
import Load from '../../components/Load';
import { arrayUnshiftItem, shuffle } from '../../common/array';
import { selectPlayerConfig } from '../../store/playerConfig';
import { setCurrentMedias } from '../../store/player';
import { getPlayerService } from '../../service/player';
import { selectMediaPlaying, setMediaPlaying } from '../../store/mediaPlaying';
import { setPlayerState } from '../../store/playerState';
import Margin from '../../components/Animations/Margin';
import Opacity from '../../components/Animations/Opacity';

function SearchResults() {

    const [ musics, setMusics ] = React.useState<Media[]>([]);
    const [ videos, setVideos ] = React.useState<Media[]>([]);
    const [ load , setLoad ] = React.useState(false);

    const { search } = useParams();
    const playerConfig = useSelector(selectPlayerConfig);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const dispatch = useDispatch();

    let index = -1;

    const handleSelectMusic = async (file: Media) => {

        let medias = [...musics];
        if (playerConfig.shuffle) {

            medias = shuffle(medias);

            const index = medias.findIndex(item => item.id === file.id);
            medias = arrayUnshiftItem(medias, index);
        }

        dispatch(setCurrentMedias(medias));
        await getPlayerService().setLastMedia({current_medias: medias});

        if (mediaPlaying?.id !== file.id) {
            dispatch(setMediaPlaying(file));
        }
        else {
            dispatch(setMediaPlaying(null));
            setTimeout(() => {
                dispatch(setPlayerState({ file_id: file.id, currentTime: 0, duration: 0 }));
                dispatch(setMediaPlaying(file))
            }, 0);
        }
    };

    const handleSelectVideo = async (file: Media) => {

        let medias = [...videos];
        if (playerConfig.shuffle) {

            medias = shuffle(medias);

            const index = medias.findIndex(item => item.id === file.id);
            medias = arrayUnshiftItem(medias, index);
        }

        dispatch(setCurrentMedias(medias));
        await getPlayerService().setLastMedia({current_medias: medias});

        if (mediaPlaying?.id !== file.id) {
            dispatch(setMediaPlaying(file));
        }
        else {
            dispatch(setMediaPlaying(null));
            setTimeout(() => {
                dispatch(setPlayerState({ file_id: file.id, currentTime: 0, duration: 0 }));
                dispatch(setMediaPlaying(file))
            }, 0);
        }
    };

    const handleGetAllMusicsFiltered = async () => {

        const musics = await getMediaService().getMedias({
            offSet: 0,
            limit: 10000,
            filter: {
                name: search,
                type: 'music',
            }
        });

        setMusics(musics);
        setVideos([]);
    };

    const handleGetAllVideosFiltered = async () => {

        const videos = await getMediaService().getMedias({
            offSet: 0,
            limit: 10000,
            filter: {
                name: search,
                type: 'video',
            }
        });

        setVideos(videos);
        setMusics([]);
    };

    useEffect(() => {

        const getMediasFiltred = async () => {

            try {

                setLoad(true);


                const musics = await getMediaService().getMedias({
                    offSet: 0,
                    limit: 5,
                    filter: {
                        name: search,
                        type: 'music',
                    }
                });

                const videos = await getMediaService().getMedias({
                    offSet: 0,
                    limit: 5,
                    filter: {
                        name: search,
                        type: 'video',
                    }
                });

                setMusics(musics);
                setVideos(videos);
            }
            catch(error) {

                console.log(error);
            }
            finally {

                setLoad(false);
            }
        };

        getMediasFiltred();

    }, [search]);

    return (
        <div className="c-app c-search-results">
            <Opacity cssAnimation={['opacity']} className="c-container__header">
                <h1 className="c-container__header__title" style={{ whiteSpace: 'break-spaces'}}>Procurar resultados para "{search}"</h1>
            </Opacity>
            <div className="c-container__content">
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
                        <LineItem noSelect onClick={handleSelectMusic} className={isOdd(index) ? 'c-line-list__item--nostyle' : ''} key={music.id} file={music}/>))}
                    </div></>
                    }
                    {videos.length > 0 && <>
                    <div className="c-list__title">
                        <h3 className="c-list__title__text">Vídeos</h3>
                        {videos.length <= 5 && videos.length > 1 && <button onClick={handleGetAllVideosFiltered} className="c-list__title__button"><span className="accent--color">Ver tudo</span></button>}
                    </div>
                    <div className="c-grid-list">
                        {videos.map(video => <GridItem className="c-grid-list__item--video" noSelect onClick={handleSelectVideo} key={video.id} file={video}/>)}
                    </div></>}
                </Margin>}
            </div>
        </div>
    );
}

export default SearchResults;