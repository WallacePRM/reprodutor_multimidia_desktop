
import { useDispatch, useSelector } from 'react-redux';
import { Media } from '../../../../common/medias/types';
import { Playlist } from '../../../../common/playlists/types';
import { shuffle } from '../../../common/array';
import { getPlayerService } from '../../../service/player';
import { getPlaylistService } from '../../../service/playlist';
import { selectMediaPlaying, setMediaPlaying } from '../../../store/mediaPlaying';
import { selectCurrentMedias, setCurrentMedias } from '../../../store/player';
import { selectPlayerConfig } from '../../../store/playerConfig';
import { setPlayerState } from '../../../store/playerState';
import { selectPlaylists, setPlaylistData, setPlaylists } from '../../../store/playlists';
import { selectSelectedFiles } from '../../../store/selectedFiles';
import { SelectBlockPlaylistProps } from '.';

export default function useSelectBlockPlaylist(props: SelectBlockPlaylistProps) {

    const { listItems } = props;

    const allPlaylists = useSelector(selectPlaylists);
    const selectedItems = useSelector(selectSelectedFiles);
    const currentMedias = useSelector(selectCurrentMedias);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const playerConfig = useSelector(selectPlayerConfig);
    const dispatch = useDispatch();

    const handlePlaySelectedItems = () => {

        const selectedPlaylists = listItems.filter(item => selectedItems.some(selectedItem => selectedItem.id === item.id));

        dispatch((setCurrentMedias(null)));
        dispatch(setMediaPlaying(null));
        dispatch(setPlayerState({ file_id: -1, currentTime: 0, duration: 0 }));

        setTimeout(async () => {

            let newCurrentMedias: Media[] = [];

            for (const playlist of selectedPlaylists) {

                for (const media of playlist.medias) {

                    if (!newCurrentMedias.some(m => m.id === media.id)) {
                        newCurrentMedias.push(media);
                    }
                }
            }

            if (playerConfig.shuffle) {
                newCurrentMedias = shuffle(newCurrentMedias);
            }

            dispatch((setCurrentMedias(newCurrentMedias)));
            await getPlayerService().setLastMedia({ current_medias: newCurrentMedias });

            dispatch(setMediaPlaying(newCurrentMedias[0]));

        }, 0);
    };

    const handleSetNextMedias = async () => {

        const selectedPlaylists = listItems.filter(item => selectedItems.some(selectedItem => selectedItem.id === item.id));

        const newCurrentMedias: Media[] = [...currentMedias];

        for (const playlist of selectedPlaylists) {

            for (const media of playlist.medias) {

                if (!newCurrentMedias.some(m => m.id === media.id)) {
                    newCurrentMedias.push(media);
                }
            }
        }

        dispatch((setCurrentMedias(newCurrentMedias)));
        await getPlayerService().setLastMedia({ current_medias: newCurrentMedias });

        if (!mediaPlaying) {
            dispatch(setMediaPlaying(newCurrentMedias[0]));
        }
    };

    const handleSetMediasOnPlaylist = async (playlist: Playlist) => {

        const selectedPlaylists = listItems.filter(item => selectedItems.some(selectedItem => selectedItem.id === item.id));

        const playlistUpdated = { ...playlist };
        for (const playlist of selectedPlaylists) {

            for (const media of playlist.medias) {

                if (!playlistUpdated.medias.some(m => m.id === media.id)) {
                    playlistUpdated.medias.push(media);
                }
            }
        }

        try {
            await getPlaylistService().putPlaylist({
                id: playlistUpdated.id,
                medias: playlistUpdated.medias
            });

            dispatch(setPlaylistData(playlistUpdated));
        }
        catch (error) {
            alert(error.message);
        }
    };

    const handleDeletePlaylistsSelected = async () => {

        const selectedPlaylists = listItems.filter(item => selectedItems.some(selectedItem => selectedItem.id === item.id));

        try {

            const playlistService = getPlaylistService();

            for (const playlist of selectedPlaylists) {

                await playlistService.deletePlaylist({ id: playlist.id });
            }

            const newListPlaylists = allPlaylists.filter(p => !selectedPlaylists.some(s => s.id === p.id));
            dispatch(setPlaylists(newListPlaylists));
        }
        catch (error) {

            console.error(error);

            alert('Falha ao remover item');
        }
    };

    return {
        listItems,
        handlePlaySelectedItems,
        handleSetNextMedias,
        handleSetMediasOnPlaylist,
        handleDeletePlaylistsSelected
    };
}