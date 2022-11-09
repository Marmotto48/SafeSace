import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//create new post
export const addpost = createAsyncThunk(
  "post/addpost",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const result = await axios.post("/blog/newpost", info.postInfo, {
        headers: { token: localStorage.getItem("token") },
      });
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
      // ? console.log(error.response.data.msg)
      // : error.response.data.errors.password.msg;
    }
  }
);
//get all posts
export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (info, { rejectWithValue }) => {
    try {
      const res = await axios.get("/blog/");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
//get a post
export const getPost = createAsyncThunk(
  "post/getPost",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.get(`/blog/post/${id}`);
      // const result = await axios.get(`http://localhost:5000/blog/post/${id}`);
      return result.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//get private posts
export const getPrivatePosts = createAsyncThunk(
  "posts/getPrivatePosts",
  async (info, { rejectWithValue }) => {
    try {
      const res = await axios.get("/blog/private");
      // const res = await axios.get("http://localhost:5000/blog/private");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

//get private posts
export const getPublicPosts = createAsyncThunk(
  "posts/getPublicPosts",
  async (info, { rejectWithValue }) => {
    try {
      const result = await axios.get("/blog/public");
      return result.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//get current user posts
export const getCurrentPosts = createAsyncThunk(
  "posts/getCurrentPosts",
  async (info, { rejectWithValue }) => {
    try {
      const res = await axios.get("/blog/currentuserpost", {
        headers: { token: localStorage.getItem("token") },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//Update post
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(
        `/blog/update/${info.id}`,
        // `http://localhost:5000/blog/update/${info.id}`,
        info.data,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      dispatch(getPost(info.id));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//Add likes
export const postLike = createAsyncThunk(
  "posts/postLike",
  async (postId, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(
        `/blog/likes/${postId}`,
        // `http://localhost:5000/blog/likes/${postId}`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      dispatch(getPost(postId));

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

//Add comment
export const addComment = createAsyncThunk(
  "posts/updateComment",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.put(
        `/blog/post/comment/${info.postId}`,
        // `http://localhost:5000/blog/post/comment/${info.postId}`,
        { desc: info.desc },
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      dispatch(getPost(info.postId));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`/blog/deletePost/${info.id}`, info.data, {
        headers: { token: localStorage.getItem("token") },
      });
      dispatch(getPosts());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    succeeded: false,
    rejected: false,
    postErrors: null,
    postsErrors: null,
    post: {},
  },
  extraReducers: {
    [addpost.pending]: (state) => {
      state.loading = true;
      state.succeeded = false;
      state.rejected = false;
    },
    [addpost.fulfilled]: (state, action) => {
      state.loading = false;
      state.succeeded = true;
      state.rejected = false;
      state.postErrors = null;
      state.post = action.payload;
    },
    [addpost.rejected]: (state, action) => {
      state.loading = false;
      state.succeeded = false;
      state.rejected = true;
      state.errors = action.payload;
    },
    [getPosts.pending]: (state) => {
      state.loading = true;
    },
    [getPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
      state.postsErrors = null;
    },
    [getPosts.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    //get private posts
    [getPrivatePosts.pending]: (state) => {
      state.loading = true;
    },
    [getPrivatePosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
      state.postsErrors = null;
    },
    [getPrivatePosts.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    //
    //get public posts
    [getPublicPosts.pending]: (state) => {
      state.loading = true;
    },
    [getPublicPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
      state.postsErrors = null;
    },
    [getPublicPosts.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    //get Current posts
    [getCurrentPosts.pending]: (state) => {
      state.loading = true;
    },
    [getCurrentPosts.fulfilled]: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
      state.postsErrors = null;
    },
    [getCurrentPosts.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    [getPost.pending]: (state) => {
      state.loading = true;
    },
    [getPost.fulfilled]: (state, action) => {
      state.post = action.payload;
      state.loading = false;
      state.postsErrors = null;
    },
    [getPost.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    [addComment.fulfilled]: (state, action) => {
      state.post = action.payload;
    },
  },
});

export default postSlice.reducer;
