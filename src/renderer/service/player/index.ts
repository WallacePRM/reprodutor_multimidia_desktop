import { LastMedia, PlayerConfig } from "./types";

export interface PlayerService {
    getLastMedia(): Promise<LastMedia>;
    setLastMedia(lastMedia: LastMedia): Promise<void>;
    getPlayerConfig(): Promise<PlayerConfig>;
    setPlayerConfig(playerConfig: Partial<PlayerConfig>): Promise<void>;
}

export class LocalPlayerService implements PlayerService {

    getLastMedia(): Promise<LastMedia> {

        const lastMedia = JSON.parse(localStorage.getItem("lastMedia") || "null");

        return Promise.resolve(lastMedia);
    }

    setLastMedia(lastMedia: Partial<LastMedia>): Promise<void> {

        this.getLastMedia().then(media => {
            const newLastMedia = { ...media, ...lastMedia };
            localStorage.setItem('lastMedia', JSON.stringify(newLastMedia));
        });

        return Promise.resolve();
    }

    getPlayerConfig(): Promise<PlayerConfig> {

        const playerConfig = JSON.parse(localStorage.getItem("playerConfig") || "null");

        return Promise.resolve(playerConfig);
    }

    setPlayerConfig(playerConfig: Partial<PlayerConfig>): Promise<void> {

        this.getPlayerConfig().then(config => {
            const newPlayerConfig = { ...config, ...playerConfig };
            localStorage.setItem('playerConfig', JSON.stringify(newPlayerConfig));
        });

        return Promise.resolve();
    }
}

export function getPlayerService(): PlayerService {
    return new LocalPlayerService();
}