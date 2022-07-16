import { PageConfig } from "./type";

export interface PageService {
    getPageConfig(): Promise<PageConfig>;
    setPageConfig(config: Partial<PageConfig>): Promise<void>;
}

export class LocalPageService implements PageService {

    getPageConfig(): Promise<PageConfig> {

        const pageConfig = JSON.parse(localStorage.getItem("pageConfig") || "null");

        return Promise.resolve(pageConfig);
    }

    setPageConfig(pageConfig: Partial<PageConfig>): Promise<void> {

        this.getPageConfig().then(config => {
            const newPageConfig = { ...config, ...pageConfig };
            localStorage.setItem('pageConfig', JSON.stringify(newPageConfig));
        });

        return Promise.resolve();
    }
}

export function getPageService(): PageService {
    return new LocalPageService();
}