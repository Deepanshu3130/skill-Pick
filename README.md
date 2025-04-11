# 🚀 Skil-Pick - Course Discovery Platform

![Skil-Pick Banner](https://via.placeholder.com/1200x400?text=Skil-Pick+-+Find+Your+Perfect+Course)

A dynamic platform for discovering skill-based courses across YouTube, Coursera, and Udemy with real-time community features.

---

## 🌟 Key Features

- 🔍 Unified course search across multiple platforms
- 🎚️ Smart filtering by platform, price, and skill level
- 💬 Real-time chat (group & 1:1) with Socket.IO
- 🔐 Secure authentication via Clerk
- ☁️ Media uploads with Cloudinary integration

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React | Core framework |
| Tailwind CSS | Utility-first styling |
| Clerk | Authentication |
| Zustand | State management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express | API framework |
| MongoDB | Database |
| Puppeteer | Web scraping |
| Socket.IO | Real-time communication |
| Cloudinary | Media storage |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Clerk developer account
- Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/skil-pick.git
cd skil-pick
```

2. Set Up Environment
Create .env files:<br/>

Frontend (/frontend/.env)
 ```

VITE_CLERK_PUBLISHABLE_KEY=your_pub_key
VITE_BASE_URL=http://localhost:3000/api/v1
```
Backend (/server/.env)
```

# Database
dataBase_url=mongodb+srv://your_mongo_uri

# APIs
YOUTUBE_API_KEY=your_youtube_api_key
BROWSERLESS_TOKEN=your_browserless_token

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
FOLDER_NAME="uploads"

# Server
PORT=10000
```

3. Install Dependencies
```
# Frontend dependencies
cd frontend && npm install

# Backend dependencies
cd ../server && npm install
```
🖥️ Running the Application
  Development Mode
  ```
# Start frontend 
cd frontend && npm run dev

# Start backend 
cd ../server && node index.cjs
```
Production Build
```
cd frontend && npm run build
```





