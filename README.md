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

## ⚙️ Setup Instructions

### 1. Clone the repository
git clone https://github.com/yourusername/skil-pick.git
cd skil-pick

###2. Install dependencies
cd frontend
npm install

cd server
npm install

🔐 Environment Variables
Frontend (/client/.env)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:10000
 
🖥️ Backend (/server/.env)
# MongoDB
dataBase_url=mongodb+srv://your_mongodb_url

# Clerk Auth
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# Cloudinary (for file uploads)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME="deepanshu"

# Puppeteer / Browserless
BROWSERLESS_TOKEN=your_browserless_token

# Server Port
PORT=10000
⚠️ Note: Cloudinary-related keys (CLOUD_NAME, API_KEY, API_SECRET, FOLDER_NAME) are used for image uploads.

🧪 Running the App
Run the frontend and backend in separate terminals:
▶️ Frontend
cd frontend
npm run dev

🖥️ Backend
cd server
node index.cjs

🤝 Contributing
Feel free to fork this repo and open a PR if you want to contribute. Issues and ideas are always welcome!
