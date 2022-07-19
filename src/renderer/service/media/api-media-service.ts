import { GetMediasOptions, Media, MediaInfo, isMediaBlob } from "../../../common/medias/types";
import { MediaService } from ".";

export const urlBase = 'http://localhost:5004';//window.location.hostname === 'localhost' ? 'http://localhost:5004' : 'https://reprodutor-multimidia-api.herokuapp.com';

export class ApiMediaService implements MediaService {

    public async getMedias(options: GetMediasOptions): Promise<Media[]> {

        const response = await fetch(urlBase + `/medias?offset=${options.offSet || 0}&limit=${options.limit || 50}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.status !== 200) {
            throw new Error(`Error ${response.status}`);
        }

        const medias = await response.json();
        return medias;
    }

    public async insertMedias(medias: Blob[] | MediaInfo[]): Promise<Media[]> {

        if (!isMediaBlob(medias)) {
            throw new Error('Invalid medias type');
        }

        const formData = new FormData();
        for (const media of medias) {
            formData.append('files', media);
        }

        const response = await fetch(urlBase + '/medias/upload', {
            method: 'POST',
            body: formData
        });

        if (response.status !== 200) {
            throw new Error(`Error ${response.status}`);
        }

        const newMedias = await response.json();
        return newMedias;
    }

    public async removeMedia(id: number) {

        const response = await fetch(urlBase + `/medias/${id}`, {
            method: 'DELETE'
        });

        if (response.status !== 200) {
            throw new Error(`Error ${response.status}`);
        }
    }

    public async putMedia(media: Partial<Media>) {

        const response = await fetch(urlBase + '/medias', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(media)
        });
        if (response.status !== 200) {
            throw new Error(`Error ${response.status}`);
        }
    }
}