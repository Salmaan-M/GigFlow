import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { submitBid, fetchBids, hireBid } from "./bidAPI";

/* ================== THUNKS ================== */

// Submit bid
export const addBid = createAsyncThunk(
  "bids/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await submitBid(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Bid failed"
      );
    }
  }
);

// Get bids for a gig (OWNER only)
export const getBids = createAsyncThunk(
  "bids/get",
  async (gigId, { rejectWithValue }) => {
    try {
      const res = await fetchBids(gigId);

      // ✅ normalize response
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;

      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load bids"
      );
    }
  }
);

// Hire bid
export const hire = createAsyncThunk(
  "bids/hire",
  async (bidId, { rejectWithValue }) => {
    try {
      await hireBid(bidId);
      return bidId;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Hire failed"
      );
    }
  }
);

/* ================== SLICE ================== */

const bidSlice = createSlice({
  name: "bids",
  initialState: {
    list: [],        // ALWAYS ARRAY
    loading: false,
    error: null,
  },
  reducers: {
    clearBids: (state) => {
      state.list = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- ADD BID ---------- */
      .addCase(addBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBid.fulfilled, (state, action) => {
        state.loading = false;

        // push only if payload is valid
        if (action.payload && typeof action.payload === "object") {
          state.list.push(action.payload);
        }
      })
      .addCase(addBid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- GET BIDS ---------- */
      .addCase(getBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBids.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getBids.rejected, (state, action) => {
        state.loading = false;
        state.list = [];
        state.error = action.payload;
      })

      /* ---------- HIRE BID ---------- */
      .addCase(hire.fulfilled, (state, action) => {
        state.list = state.list.map((bid) =>
          bid._id === action.payload
            ? { ...bid, status: "hired" }
            : { ...bid, status: "rejected" }
        );
      })
      .addCase(hire.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearBids } = bidSlice.actions;
export default bidSlice.reducer;
