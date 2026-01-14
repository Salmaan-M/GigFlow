import express from "express";
import {
  createBid,
  getBidsForGig, 
  hireBid,
} from "../controllers/bid.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/", protect, createBid);
router.get("/:gigId", protect, getBidsForGig);
router.patch("/:bidId/hire", protect, hireBid);

export default router;
