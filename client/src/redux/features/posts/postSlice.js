import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPost = createAsyncThunk(
  'posts/fetchPost', // Action type: 'posts/fetchPost'
  async (slug, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/post/getPosts?slug=${slug}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue("Failed to load Post");
      }
      return data.posts[0];
    } catch (error) {
      return rejectWithValue("Error Fetching posts");
    }
  }
);

const postsSlice = createSlice({
  name: 'post', // Slice name
  initialState: {
    error: null,
    loading: false,
    posts: {}
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.posts[action.payload.slug] = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postsSlice.reducer;
