import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGigs, createGig } from "./gigAPI";

export const getGigs = createAsyncThunk(
  "gigs/get",
  async (search, { rejectWithValue }) => {
    try {
      const res = await fetchGigs(search);
      return res.data;
    } catch {
      return rejectWithValue("Failed to load gigs");
    }
  }
);

export const addGig = createAsyncThunk(
  "gigs/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createGig(data);
      return res.data;
    } catch {
      return rejectWithValue("Failed to create gig");
    }
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGigs.pending, (s) => {
        s.loading = true;
      })
      .addCase(getGigs.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(getGigs.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(addGig.fulfilled, (s, a) => {
        s.list.unshift(a.payload);
      });
  },
});

export default gigSlice.reducer;
