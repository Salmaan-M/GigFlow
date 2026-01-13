import express from "express";
import {
  createGig,
  getGigs,
  getGigById,
} from "../controllers/gig.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createGig);
router.get("/", getGigs);
router.get("/:id", getGigById);

export default router;
