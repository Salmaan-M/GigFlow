# GigFlow – Mini Freelance Marketplace

## Tech Stack
- React + Vite + Tailwind
- Node.js + Express
- MongoDB (Atlas)
- Redux Toolkit
- JWT (HttpOnly cookies)
- Socket.io

## Features
- User authentication
- Post & browse gigs
- Bid on gigs
- Atomic hiring logic (MongoDB transactions)
- Real-time hire notifications

## Hiring Logic (Important)
- Only one freelancer can be hired
- Uses MongoDB transactions to prevent race conditions
- Other bids are auto-rejected

## Setup
### Backend
```bash
cd gigflow-backend
npm install
npm run dev
Frontend
bash
Copy code
cd gigflow-frontend
npm install
npm run dev
Environment Variables
See .env.example

