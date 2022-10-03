import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { FiSpeaker } from 'react-icons/fi';

import Modal from '..';
import Button from '../../Button';
import Input from '../../Input';
import { getPlaylistService } from '../../../service/playlist';
import { Playlist } from '../../../../common/playlists/types';
import { setPlaylistData } from '../../../store/playlists';
import { setGroupInfo } from '../../../store/groupInfo';
import { getGroupInfoService } from '../../../service/groupInfo';

function ModalRenamePlaylist(props: ModalRenamePlaylistProps) {

    const { reference, playlist, onClose, onOpen } = props;

    const [ inputValue, setInputValue ] = useState(playlist.name);

    const modalRef = reference;
    const dispatch = useDispatch();

    const handleRenamePlaylist = async () => {

        if (inputValue.trim() === '') {
            setInputValue(playlist.name);
        }

        try {

            const playlistUpdated = {
                id: playlist.id,
                name: inputValue,
                modificationDate: new Date().toISOString(),
                medias: playlist.medias
            };

            await getPlaylistService().putPlaylist(playlistUpdated);
            await getGroupInfoService().setGroupInfo(playlistUpdated);

            dispatch(setPlaylistData(playlistUpdated));
            dispatch(setGroupInfo(playlistUpdated));
        }
        catch(error) {
            alert(error.message);
        }
        finally {
            modalRef.current.close();
        }
    };

    return (

        <Modal
        reference={modalRef}
        title="Renomear a playlist"
        onClose={onClose}
        onOpen={onOpen}
        footer={<Button
            onClick={handleRenamePlaylist}
            className={'flex-1 d-flex a-items-center j-content-center btn--primary c-button--no-media-style' +
            (inputValue.trim() === '' ? ' disabled' : '')}
            label="Renomear"/>}>
            <>

            <div className="c-modal__content__item" style={{justifyContent: 'center'}}>
                <div className="box-square mb-20" >
                    <FiSpeaker className="icon-color--light" />
                </div>
            </div>
            <div className="c-modal__content__item">
                <Input value={inputValue} onChange={setInputValue}/>
            </div>
            </>
        </Modal>
    );
}

type ModalRenamePlaylistProps = {
    playlist: Omit<Playlist, 'modificationDate'>,
    reference: any,
    onClose?: () => void;
    onOpen?: () => void;
};

export default ModalRenamePlaylist;