import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { Playlist } from "../../../common/playlists/types";

const playlistsSlice = createSlice({
    name: 'playlists',
    initialState: {
        data: [] as Playlist[]
    },
    reducers: {

        setPlaylists(state, action: PayloadAction<Playlist[]>) {
            state.data = (action.payload);
        },

        setPlaylist(state, action: PayloadAction<Playlist>) {
            state.data.push(action.payload);
        },

        setPlaylistData(state, action: PayloadAction< Partial<Playlist> >) {

            const playlistIndex = state.data.findIndex(p => p.id === action.payload.id);
            state.data[playlistIndex] = {
                ...state.data[playlistIndex],
                ...action.payload
            }

        },

        deletePlaylist(state, action: PayloadAction< Pick<Playlist, 'id'> >) {

            const playlistIndex = state.data.findIndex(p => p.id === action.payload.id);
            state.data.splice(playlistIndex, 1);
        }
    }
});

export const { setPlaylists, setPlaylist, setPlaylistData, deletePlaylist } = playlistsSlice.actions;
export const selectPlaylists = (state: RootState) => state.playlists.data;
export const selectPlaylist = (playlistId: number) => (state: RootState) => state.playlists.data.find(p => p.id === playlistId);

export default playlistsSlice.reducer;