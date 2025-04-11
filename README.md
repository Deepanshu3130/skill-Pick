# 🚀 Skil-Pick

Skil-Pick is a dynamic platform that helps users search for skill-based courses (e.g., Web Development, UI/UX, etc.) across platforms like YouTube, Coursera, and Udemy. It also provides an interactive community with real-time group and private chats powered by Clerk authentication.

---

## 🌟 Features

- 🔍 Search courses across multiple platforms
- 🧠 Smart filtering by platform & price
- 💬 Real-time community & 1:1 chat using Socket.IO
- 🔐 Secure authentication via Clerk
- ☁️ Media upload integration with Cloudinary

---

## 🛠 Tech Stack

**Frontend**  
- React  
- Tailwind CSS  
- Clerk (for Auth)  
- Zustand (for state management)  

**Backend**  
- Node.js  
- Express  
- MongoDB + Mongoose  
- Puppeteer (for scraping)
- Cloudinary (image upload)
- Socket.IO

---
🚀 Getting Started
Prerequisites
Node.js v16+

MongoDB Atlas account

Clerk developer account

Cloudinary account

Installation
Clone the repository

bash
Copy
git clone https://github.com/yourusername/skil-pick.git
cd skil-pick
Set up environment variables
Create .env files in both /frontend and /server directories with required credentials.

Install dependencies

bash
Copy
cd frontend && npm install
cd ../server && npm install
Configuration
Frontend (.env)
env
Copy
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BASE_URL=http://localhost:10000
Backend (.env)
env
Copy
# Database
dataBase_url=mongodb+srv://your_mongodb_url

# Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# APIs
YOUTUBE_API_KEY=your_youtube_key
BROWSERLESS_TOKEN=your_browserless_token

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_cloud_key
API_SECRET=your_cloud_secret
FOLDER_NAME="uploads"

# Server
PORT=10000
Running the Application
Development Mode:

bash
Copy
# Frontend
cd frontend && npm run dev

# Backend
cd server && node index.cjs
Production Build:

bash
Copy
cd frontend && npm run build
