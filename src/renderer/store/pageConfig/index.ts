import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

const pageConfigSlice = createSlice({
    name: 'pageConfig',
    initialState: {
        config: {
           musicsOrderBy: 'name',
           videosOrderBy: 'name',
           theme: 'auto',
           accentColor: 'systemPreferences.getAccentColor()',
           mediaArt: true,
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
    musicsOrderBy?: string;
    videosOrderBy?: string;
    theme?: string;
    accentColor?: string;
    mediaArt?: boolean;
};

export default pageConfigSlice.reducer;