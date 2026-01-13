import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
