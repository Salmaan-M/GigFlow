import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";


dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
export const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Frontend serving - PROJECT ROOT PATH
if (process.env.NODE_ENV === 'production') {
  const path = await import('path');
  
  // Point to project root client/dist
  const frontendPath = path.join(process.cwd(), '..', 'client', 'dist');
  
  console.log('Frontend path:', frontendPath);
  
  // Static files
  app.use(express.static(frontendPath));
  
  // Express 5 wildcard
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
  
  console.log('Frontend serving enabled');
}


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
