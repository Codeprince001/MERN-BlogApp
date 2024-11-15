import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    error: null,
    loading: false
  },
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false,
        state.error = action.payload;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFailure: () => {
      state.loading = false,
        state.error = action.payload;
    },
    updateStart: () => {
      state.loading = true;
      state.error = null;
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    }

  }
});

export const { signoutSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signInFailure, signInStart, signInSuccess, updateStart, updateFailure, updateSuccess } = userSlice.actions;

export default userSlice.reducer;