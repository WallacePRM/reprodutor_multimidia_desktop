import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

const pageConfigSlice = createSlice({
    name: 'pageConfig',
    initialState: {
        config: {
            fullscreen: false,
            musicsOrderBy: 'name',
            videosOrderBy: 'name',
            playlistsOrderBy: 'name',
            theme: 'auto',
            accentColor: 'systemPreferences.getAccentColor()',
            mediaArt: true,
            firstRun: true,
        } as pageConfig,
    },
    reducers: {
        setPageConfig: (state, action: PayloadAction<Partial<pageConfig>>) => {
            state.config = {
              ...state.config,
              ...action.payload
            }
        }
    }
});

export const { setPageConfig } = pageConfigSlice.actions;
export const selectPageConfig = (state: RootState) => state.pageConfig.config;

export type pageConfig = {
    fullscreen?: boolean,
    musicsOrderBy?: string;
    videosOrderBy?: string;
    playlistsOrderBy: string;
    theme?: string;
    accentColor?: string;
    mediaArt?: boolean;
    firstRun?: boolean;
};

export default pageConfigSlice.reducer;