import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComment = createAsyncThunk(
  'comments/fetchComment', // Action type: 'comments/fetchComment'
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comment/getPostComments/${postId}`);
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue("Failed to load comment");
      }
      return data;
    } catch (error) {
      return rejectWithValue("Error Fetching comments");
    }
  }
);

const commentsSlice = createSlice({
  name: 'comment', // Slice name
  initialState: {
    error: null,
    loading: false,
    comments: {}
  },
  reducers: {
    setComments: (state, action) => {
      const commentsArray = action.payload; // Assuming payload is an array of comments

      if (!state.comments) {
        state.comments = {}; // Initialize the comments object
      }

      commentsArray.forEach((comment) => {
        const { postId } = comment; // Extract postId from comment
        if (postId) {
          // Initialize the array for the postId if it doesn't already exist
          if (!state.comments[postId]) {
            state.comments[comment.postId] = [];
          }
          // Add the comment to the array
          state.comments[comment.postId].push(comment.postId);
        } else {
          console.log("comment missing postId:", comment);
        }
      });
    },
    addComment: (state, action) => {
      const newComment = action.payload;
      if (newComment.postId) {
        // Ensure state.comments[postId] is an array
        if (!state.comments[newComment.postId]) {
          state.comments[newComment.postId] = [];
        }
        // Add the new comment to the array
        state.comments[newComment.postId].push(newComment);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.comments[action.payload.postId] = action.payload;
      })
      .addCase(fetchComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setComments } = commentsSlice.actions;


export default commentsSlice.reducer;
