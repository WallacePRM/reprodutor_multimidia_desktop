import React, { useState } from 'react';

import { FiSpeaker } from 'react-icons/fi';
import { getPlaylistService } from '../../../service/playlist';
import { Playlist } from '../../../../common/playlists/types';
import { Media } from '../../../../common/medias/types';
import { useDispatch } from 'react-redux';
import { setPlaylist } from '../../../store/playlists';

import Modal from '..';
import Button from '../../Button';
import Input from '../../Input';

export default function ModalCreatePlaylist(props: ModalCreatePlaylistProps) {

    const { medias, reference, onClose, onOpen } = props;

    const [ inputValue, setInputValue ] = useState('Playlist sem título');

    const modalRef = reference;
    const dispatch = useDispatch();

    const handleCreatePlaylist = async () => {

        if (inputValue.trim() === '') {
            setInputValue('Playlist sem título');
        }

        try {
            const playlistService = getPlaylistService();
            const playlist: Playlist = await playlistService.insertPlaylist({
                name: inputValue,
                modificationDate: new Date().toISOString(),
                medias: medias as Media[],
            });

            dispatch(setPlaylist(playlist));
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
        onClose={onClose}
        onOpen={onOpen}
        reference={modalRef}
        title="Adicionar à uma nova playlist"
        footer={<Button
            onClick={handleCreatePlaylist}
            className={'flex-1 d-flex a-items-center j-content-center btn--primary c-button--no-media-style' +
            (inputValue.trim() === '' ? ' disabled' : '')}
            label="Criar"/>}>
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

interface ModalCreatePlaylistProps {
    reference: any;
    medias: Media[];
    onClose?: () => void;
    onOpen?: () => void
};
