import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComment = createAsyncThunk(
  'comments/fetchComment', // Action type: 'comments/fetchComment'
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comment/getPostComments/${postId}`);
      const data = await response.json();
      console.log("Comment data", data);
      if (!response.ok) {
        return rejectWithValue("Failed to load comment");
      }
      return { postId, comments: data.comments };
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
      const { postId, comments } = action.payload;
      state.comments[postId] = comments;
    },
    addComment: (state, action) => {
      const newComment = action.payload;
      if (newComment.postId) {
        if (!state.comments[newComment.postId]) {
          state.comments[newComment.postId] = { comments: [] };// Initialize array if it doesn't exist
        }
        state.comments[newComment.postId].comments.push(newComment); // Add new comment to the array
      }
    },
    updateCommentLikes: (state, action) => {
      const { commentId, likes, numberOfLikes, postId } = action.payload;
      const postComments = state.comments[postId]?.comments;
      if (postComments) {
        const comment = postComments.find((c) => c._id === commentId);
        if (comment) {
          comment.likes = likes;
          comment.numberOfLikes = numberOfLikes;
        }
      }
    },
    editComment: (state, action) => {
      const { postId, commentId, content } = action.payload;
      const postComments = state.comments[postId]?.comments || [];
      const commentIndex = postComments.findIndex((c) => c._id === commentId);
      if (commentIndex !== -1) {
        postComments[commentIndex].content = content;
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
        const { postId, comments } = action.payload;
        state.comments[postId] = {
          comments: comments || [], // Ensure comments is an array
        };
      })
      .addCase(fetchComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setComments, addComment, updateCommentLikes, editComment } = commentsSlice.actions;


export default commentsSlice.reducer;
