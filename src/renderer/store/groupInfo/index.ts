import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { GroupInfo } from "../../pages/GroupInfo";

const groupInfoSlice = createSlice({
    name: 'groupInfo',
    initialState: {
        data: {
            id: null,
            name: null,
            medias: null,
        } as GroupInfo,
    },
    reducers: {
        setGroupInfo: (state, action: PayloadAction<Partial<GroupInfo>>) => {
            state.data = {
              ...state.data,
              ...action.payload
            }
        }
    }
});

export const { setGroupInfo } = groupInfoSlice.actions;
export const selectGroupInfo = (state: RootState) => state.groupInfo.data;

export default groupInfoSlice.reducer;