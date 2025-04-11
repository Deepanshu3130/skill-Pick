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
✅ Prerequisites
Node.js v16 or higher

MongoDB Atlas account

Clerk developer account

Cloudinary account

📦 Installation
1. Clone the Repository
Clone the repo using:

https://github.com/yourusername/skil-pick.git
Then move into the project folder: cd skil-pick

2. Set Up Environment Variables
Create .env files in both /frontend and /server directories with the following values:

🧩 Frontend .env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

VITE_BASE_URL=http://localhost:10000

🖥 Backend .env
Database

dataBase_url=mongodb+srv://your_mongodb_url

Authentication (Clerk)

CLERK_PUBLISHABLE_KEY=your_clerk_key

CLERK_SECRET_KEY=your_clerk_secret

APIs

YOUTUBE_API_KEY=your_youtube_key

BROWSERLESS_TOKEN=your_browserless_token

Cloudinary (for file uploads)

CLOUD_NAME=your_cloud_name

API_KEY=your_cloud_key

API_SECRET=your_cloud_secret

FOLDER_NAME="uploads"

Server

PORT=10000

📂 Install Dependencies
Navigate to the folders and install dependencies:

In frontend: run npm install

In server: run npm install

🧪 Run the Application
Open two separate terminals:

In the first terminal, run the frontend using: npm run dev inside the frontend folder

In the second terminal, run the backend using: node index.cjs inside the server folder
