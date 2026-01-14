import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bidReducer from "../features/bids/bidSlice";
import gigReducer from "../features/gigs/gigSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigReducer,
    bids: bidReducer,
  },

});
