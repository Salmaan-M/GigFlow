import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import gigRoutes from "./routes/gig.routes.js";
import bidRoutes from "./routes/bid.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);




export default app;
