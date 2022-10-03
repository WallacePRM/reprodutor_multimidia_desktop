import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import SelectBlock from '..';

import { Media } from '../../../../common/medias/types';
import { Playlist } from '../../../../common/playlists/types';
import { getGroupInfoService } from '../../../service/groupInfo';
import { getMediaService } from '../../../service/media';
import { getPlayerService } from '../../../service/player';
import { getPlaylistService } from '../../../service/playlist';
import { selectGroupInfo, setGroupInfo } from '../../../store/groupInfo';
import { selectMediaPlaying, setMediaPlaying } from '../../../store/mediaPlaying';
import { selectMedias, setMedias } from '../../../store/medias';
import { selectCurrentMedias, setCurrentMedias } from '../../../store/player';
import { setPlayerState } from '../../../store/playerState';
import { setPlaylistData, setPlaylists } from '../../../store/playlists';
import { selectSelectedFiles } from '../../../store/selectedFiles';

function SelectBlockMedia(props: SelectBlockMediaProps) {

    const { listItems } = props;

    const allMedias = useSelector(selectMedias);
    const selectedItems = useSelector(selectSelectedFiles);
    const currentMedias = useSelector(selectCurrentMedias);
    const mediaPlaying = useSelector(selectMediaPlaying);
    const groupInfo = useSelector(selectGroupInfo);
    const location = useLocation();
    const dispatch = useDispatch();

    const handlePlaySelectedItems = () => {

        const selectedMedias = listItems.filter(item => selectedItems.some(selectedItem => selectedItem.id === item.id));

        dispatch((setCurrentMedias(null)));
        dispatch(setMediaPlaying(null));
        dispatch(setPlayerState({file_id: -1, currentTime: 0, duration: 0}));

        setTimeout(async () => {
            dispatch((setCurrentMedias(selectedMedias)));
            await getPlayerService().setLastMedia({current_medias: selectedMedias});

            dispatch(setMediaPlaying(selectedMedias[0]));
        }, 0);
    };

    const handleSetNextMedias = async () => {

        const nextMedias = currentMedias ? [...currentMedias] : [];
        for (let item of selectedItems) {

            if (currentMedias.some(m => m.id === item.id)) {
                continue;
            }
            else {

                const media = listItems.find(x => x.id === item.id);
                if (media) {
                    if (media.id !== mediaPlaying?.id) {
                        nextMedias.push(media);
                    }
                }
            }
        }

        dispatch(setCurrentMedias(nextMedias));
        await getPlayerService().setLastMedia({current_medias: nextMedias});

        if (!mediaPlaying) {
            dispatch(setMediaPlaying(nextMedias[0]));
        }
    };

    const handleSetMediasOnPlaylist = async (playlist: Playlist) => {

        const selectedMedias = listItems.filter(m => selectedItems.some(s => s.id === m.id));

        for (const media of selectedMedias) {

            if (!playlist.medias.some(m => m.id === media.id)) {
                playlist.medias.push(media);
            }
        }

        try {
            await getPlaylistService().putPlaylist(playlist);

            dispatch(setPlaylistData(playlist));
        }
        catch(error) {
            alert(error.message);
        }
    };

    const handleDeleteMediasSelected = async () => {

        if (selectedItems.length < 1) return;

        const mediasSelected = listItems.filter(m => selectedItems.some(s => s.id === m.id));

        try {

            if (location.pathname === '/group-info') {

                const mediasRemoved = [];
                const newMedias = [...groupInfo.medias]

                for (const media of mediasSelected) {

                    const mediaIndex = newMedias.findIndex(m => m.id === media.id);

                    if (mediaIndex !== -1) {
                        mediasRemoved.push(media);
                        newMedias.splice(mediaIndex, 1);
                    }
                }

                const newPlaylist = {
                    id: groupInfo.id,
                    medias: newMedias
                }

                await getPlaylistService().deletePlaylist({id: groupInfo.id, medias: mediasRemoved});
                await getGroupInfoService().setGroupInfo(newPlaylist);

                dispatch(setPlaylistData(newPlaylist));
                dispatch(setGroupInfo(newPlaylist));

                return;
            }

            const mediaService = getMediaService();
            await mediaService.deleteMedias(mediasSelected);

            const newListMedias = allMedias.filter(m => !mediasSelected.some(s => s.id === m.id));
            dispatch(setMedias(newListMedias));

            const playlists = await getPlaylistService().getPlaylists();
            dispatch(setPlaylists(playlists));
        }
        catch(error) {

            console.error(error);

            alert('Falha ao remover item');
        }
    };

    return (
        <SelectBlock
        list={listItems}
        onPlay={handlePlaySelectedItems}
        onSetNext={handleSetNextMedias}
        onSetInPlaylist={handleSetMediasOnPlaylist}
        onRemove={location.pathname === '/group-info' ? handleDeleteMediasSelected : null}/>
    );
}

type SelectBlockMediaProps = {
    listItems: Media[];
};

export default SelectBlockMedia;