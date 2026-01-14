import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false; s.user = a.payload;
      })
      .addCase(register.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })
      .addCase(login.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false; s.user = a.payload;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
      });
  },
});

export default authSlice.reducer;
