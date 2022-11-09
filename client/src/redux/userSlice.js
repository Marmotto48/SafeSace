import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//register user
export const register = createAsyncThunk(
  "user/register",
  async (info, { rejectWithValue }) => {
    try {
      const result = await axios.post("/user/register", info);
      if (result.status === 201) {
        return result.data;
      } else {
        return rejectWithValue(result.data.msg);
      }
    } catch (error) {
      return rejectWithValue(
        error.response.data.msg
          ? error.response.data.msg
          : error.response.data.errors.password.msg
      );
    }
  }
);
//login user
export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const result = await axios.post("/user/login", data);
      // if (result.status === 201) {
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//get user
export const getUser = createAsyncThunk(
  "user/getUser",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.get(`/user/getuser/${id}`);
      // const result = await axios.get(`http://localhost:5000/user/${id}`);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//delete user
export const deleteUser = createAsyncThunk(
  "posts/deleteUser",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.delete(`/user/deleteuser/${info.id}`, info.data, {
        headers: { token: localStorage.getItem("token") },
      });
      dispatch(logout());
      // dispatch(getUsers())
      // history.push("/");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//get all users
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (info, { rejectWithValue }) => {
    try {
      const result = await axios.get("/user/");
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//get all users
export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (search, { rejectWithValue }) => {
    try {
      const result = await axios.get(`/user/searchuser?search=${search}`, {
        headers: { token: localStorage.getItem("token") },
      });
      return result;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const result = await axios.put(`/user/update/${info.id}`, info.data, {
        headers: { token: localStorage.getItem("token") },
      });
      console.log(info.id);
      dispatch(getUser(info.id));
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//get all Doctors
export const getDocs = createAsyncThunk(
  "users/getDocs",
  async (info, { rejectWithValue }) => {
    try {
      const result = await axios.get("/user/doctors");
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);
//update avatar
export const avatarUpdate = createAsyncThunk(
  "user/avatarUpdate",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("userImg", info.file);
      const res = await axios.put(
        `/user/uploadimg/${info.id}`,
        // const res = await axios.put(`/user/uploadimg/${info.id}`
        formData,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      dispatch(getUsers());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    user: {},
    searchUsers: [],
    userInfo: JSON.parse(localStorage.getItem("user")),
    loading: false,
    registerErrors: null,
    loginErrors: null,
    usersErrors: null,
    token: localStorage.getItem("token"),
    isAuth: Boolean(localStorage.getItem("isAuth")),
  },
  reducers: {
    logout: (state) => {
      // localStorage.clear();
      state.isAuth = false;
      state.userInfo = {};
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuth");
    },
    clearErrors: (state) => {
      state.registerErrors = null;
      state.loginErrors = null;
    },
  },
  extraReducers: {
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      state.errors = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuth", true);
    },
    [register.rejected]: (state, action) => {
      state.registerErrors = action.payload;
      state.isAuth = false;
    },
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      state.errors = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuth", true);
    },
    [login.rejected]: (state, action) => {
      state.loginErrors = action.payload;
      state.isAuth = false;
    },
    //get user
    [getUser.pending]: (state) => {
      state.loading = true;
    },
    [getUser.fulfilled]: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.errors = null;
    },
    [getUser.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    //get users
    [getUsers.pending]: (state) => {
      state.loading = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.usersErrors = null;
    },
    [getUsers.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    //search users
    [searchUsers.pending]: (state) => {
      state.loading = true;
    },
    [searchUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.searchUsers = action.payload;
      state.usersErrors = null;
    },
    [searchUsers.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
    //get users
    [getDocs.pending]: (state) => {
      state.loading = true;
    },
    [getDocs.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.usersErrors = null;
    },
    [getDocs.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { logout, clearErrors, loginErrors } = userSlice.actions;
