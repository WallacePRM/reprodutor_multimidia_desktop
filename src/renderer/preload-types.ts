export type windowElectronApi = Window & typeof globalThis & {
    electronApi: {
        closeWindow: () => Promise<void>;
        minimizeWindow: () => Promise<void>;
        maximizeWindow: () => Promise<void>;
    }
};