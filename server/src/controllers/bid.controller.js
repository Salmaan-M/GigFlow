import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { io } from "../index.js";

// @route POST /api/bids
// @desc  Submit a bid on a gig
// @access Private
export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== "open") {
      return res.status(400).json({ message: "Gig not open for bidding" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    res.status(201).json(bid);
  } catch (error) {
    // Duplicate bid protection
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already bid on this gig" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/bids/:gigId
// @desc  Get all bids for a gig (owner only)
// @access Private


export const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    
    // Check if gigId exists
    if (!gigId) {
      return res.status(400).json({ message: "Gig ID is required" });
    }
    
    //Clean + Validate ObjectId
    const cleanGigId = gigId.trim(); // Remove \n, spaces
    
    // Validation
    if (!mongoose.Types.ObjectId.isValid(cleanGigId)) {
      return res.status(400).json({ 
        message: "Invalid gig ID format",
        received: cleanGigId 
      });
    }
    
    //Find gig
    const gig = await Gig.findById(cleanGigId);
    
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    
    //Ownership verification
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    //Fetch bids (use clean ID)
    const bids = await Bid.find({ gigId: cleanGigId })
      .populate("freelancerId", "name email")
      .sort({ createdAt: 1 });
    
    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
    
  } catch (error) {
    console.error("🚨 getBidsForGig Error:", error); // Debug log
    res.status(500).json({ message: "Server error" });
  }
};


//Hiring Logic
// @route PATCH /api/bids/:bidId/hire
// @desc  Hire a freelancer (atomic operation)
// @access Private (Gig Owner)
export const hireBid = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) {
      throw new Error("Bid not found");
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      throw new Error("Gig not found");
    }

    // Ownership check
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      throw new Error("Not authorized to hire for this gig");
    }

    // Prevent double hiring
    if (gig.status === "assigned") {
      throw new Error("Gig already assigned");
    }

    // 1. Update gig
    gig.status = "assigned";
    await gig.save({ session });

    // 2. Hire selected bid
    bid.status = "hired";
    await bid.save({ session });

    // 3. Reject others
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    io.to(bid.freelancerId.toString()).emit("hired", {
      message: `You have been hired for "${gig.title}"`,
      gigId: gig._id,
    });

    return res.json({ message: "Freelancer hired successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({ message: error.message });
  }
};

