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

export default function useSearchResults() {

    const [ musics, setMusics ] = React.useState<Media[]>([]);
    const [ videos, setVideos ] = React.useState<Media[]>([]);
    const [ load , setLoad ] = React.useState(false);

    const { search } = useParams();
    const playerConfig = useSelector(selectPlayerConfig);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const dispatch = useDispatch();

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

    }, [search])

    return {
        load, musics, videos, search,
        handleGetAllMusicsFiltered, handleSelectMusic, handleGetAllVideosFiltered, handleSelectVideo
    };
}