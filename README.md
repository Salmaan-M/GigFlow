# 🚀 GigFlow – Mini Freelance Marketplace built using MERN

**GigFlow** is a modern, full-stack freelance platform designed for speed and reliability. It features a robust bidding system with **atomic hiring logic**, real-time updates via **Socket.io**, and a secure authentication flow using **HttpOnly cookies**.

## 🌐 Live Demo

**[View GigFlow on Render](https://gigflow-official.onrender.com/)** 👈

---

## ✨ Key Features

* **🛡️ Atomic Hiring Logic:** Utilizes **MongoDB Transactions** to ensure that only one freelancer can be hired per gig, preventing race conditions.
* **⚡ Real-Time Notifications:** Instant "Hired" or "Rejected" alerts powered by **Socket.io**.
* **🔐 Secure Auth:** Identity management via **JWT** stored in secure, **HttpOnly cookies** to mitigate XSS attacks.
* **📊 Bid Management:** Freelancers can browse gigs and place bids; clients can review and hire in one click.
* **🎨 Responsive Design:** Built with **Tailwind CSS** for a seamless experience across desktop and mobile.

---

## 🛠️ Tech Stack

| Frontend | Backend | Database & Tools |
| --- | --- | --- |
| React + Vite | Node.js | MongoDB Atlas |
| Redux Toolkit | Express | Socket.io |
| Tailwind CSS | JWT (HttpOnly) |

---

## 🏗️ Project Structure

```text
GigFlow/
├── client/          # React + Vite frontend
├── server/          # Node.js + Express backend
│   └── src/         # API logic & Socket handlers
└── package.json     # Root scripts for deployment

```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gigflow.git
cd gigflow

```

### 2. Environment Configuration

Create a `.env` file in the `server` directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
NODE_ENV=development or production

```

### 3. Install & Run (Root Directory)

Using the automated scripts in the root `package.json`:

```bash
# Install all dependencies (Frontend & Backend)
npm run install-all

# Run both locally
npm run dev

```

---

## 🧠 Technical Deep Dive: Atomic Hiring

To prevent multiple freelancers from being hired for the same gig simultaneously, GigFlow implements a **MongoDB Session Transaction**:

1. **Start Session:** Initiates a database transaction.
2. **Check Status:** Verifies if the gig is still "Open".
3. **Update Gig:** Marks the gig as "Hired" and assigns the Freelancer ID.
4. **Auto-Reject:** In the same operation, all other pending bids for that gig are set to "Rejected".
5. **Commit:** If any step fails, the entire process rolls back.

---
