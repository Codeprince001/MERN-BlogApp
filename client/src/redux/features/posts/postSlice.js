import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPost = createAsyncThunk(
  'posts/fetchPost', // Action type: 'posts/fetchPost'
  async (slug, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/post/getPosts?slug=${slug}`);
      const data = await response.json();
      console.log(data);
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
    posts: {},
    fetchedPost: []
  },
  reducers: {
    setPosts: (state, action) => {
      state.fetchedPost = { ...action.payload };
      const postsArray = action.payload; // Assuming payload is an array of posts
      if (!state.posts) {
        state.posts = {};
      }
      postsArray.forEach(post => {
        if (post.slug) {
          state.posts[post.slug] = post; // Use a unique identifier (e.g., slug) as the key
        } else {
          console.log("Post slug not in Post");
        }
      });
    },
    appendPosts: (state, action) => {
      state.fetchedPost = [...state.fetchedPost, ...action.payload]; // Append new posts to fetchedPost array
      const postsArray = action.payload;
      postsArray.forEach(post => {
        if (post.slug) {
          state.posts[post.slug] = post; // Add new posts to posts object
        }
      });
    },
    deletePost: (state, action) => {
      state.fetchedPost = state.fetchedPost.filter((post) => post._id !== action.payload);
      delete state.posts[action.payload]; // Also remove from the posts object
    },

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

export const { setPosts, appendPosts, deletePost } = postsSlice.actions;


export default postsSlice.reducer;
