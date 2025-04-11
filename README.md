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

## 🚀 Installation

### 1. Clone Repository
---
git clone https://github.com/yourusername/skil-pick.git
cd skil-pick
---

### 2. Set Up Environment
Create `.env` files in both `/frontend` and `/server` directories:

#### Frontend (.env)
---
VITE_CLERK_PUBLISHABLE_KEY=your_pub_key
VITE_BASE_URL=http://localhost:10000
---

#### Backend (.env)
---
# Database
dataBase_url=mongodb+srv://your_mongo_url

# APIs
YOUTUBE_API_KEY=your_yt_key
BROWSERLESS_TOKEN=your_browserless_token

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
FOLDER_NAME="uploads"
---

### 3. Install Dependencies
---
# Frontend
cd frontend && npm install

# Backend
cd ../server && npm install
---

## 🖥️ Running the App

### Development Mode
---
# Terminal 1 (Frontend)
cd frontend && npm run dev

# Terminal 2 (Backend)
cd ../server && node index.cjs
---

### Production Build
---
cd frontend && npm run build
---
