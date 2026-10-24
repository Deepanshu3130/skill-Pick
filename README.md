# 🚀 Skill-Pick - Skill & Resource Discovery Platform

A modern, dynamic platform for discovering skill-based courses and open-source repositories across official YouTube and GitHub APIs with real-time community rooms.

---

## 🌟 Key Features

- 🔍 **Unified Skill Search**: Autocomplete powered by MongoDB Atlas Search.
- 📺 **Official YouTube Courses**: Curated playlists and full courses.
- 🐙 **GitHub Repositories**: Starred open-source repositories and code roadmaps.
- 🔗 **Resource Submission Panel**: Add custom resources via link with SSRF protection and OpenGraph metadata.
- 💬 **Real-time In-Room Chat**: Group rooms and verified private in-room DMs with Socket.IO.
- 🔐 **Secure Authentication**: JWT-authenticated connections via Clerk.
- ☁️ **Media Uploads**: Cloudinary integration for attachments.

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | Core framework |
| Vite | Frontend tooling |
| Tailwind CSS / DaisyUI | Styling & UI components |
| Clerk | Authentication |
| Zustand | State management |
| Socket.IO Client | Real-time chat |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js / Express | API framework |
| MongoDB / Mongoose | Database & Atlas Search |
| YouTube Data API v3 | Official course data |
| GitHub REST API | Official repository data |
| Socket.IO | Real-time communication with JWT verification |
| Cloudinary | Media storage |

---

## 🚀 Getting Started

### 1. Set Up Environment
Copy the example files and configure your credentials:
```bash
cp server/.env.example server/.env
cp frontend/.env.example frontend/.env
```

### 2. Install Dependencies
```bash
cd frontend && npm install
cd ../server && npm install
```

### 3. Seed Topic Database
```bash
cd server && node scripts/seedTopics.js
```

### 4. Running the Application
Development Mode:
```bash
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
cd frontend && npm run dev
```
