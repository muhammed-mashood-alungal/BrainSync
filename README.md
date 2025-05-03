# 🧠 BrainSync

**BrainSync** is a real-time collaborative study platform built for students who want to study together from anywhere. It combines tools like video calls, whiteboard, code editor, and shared notes — all in one seamless experience.

---

## 🚀 Features

### 👥 Group-Based Collaboration
- Create and manage study groups
- Invite friends via email
- Only group members can start or join a session

### 📚 Study Sessions
- Real-time **video**, **audio**, and **text chat**
- Shared **whiteboard**, **notes**, and **code editor**
- Instant tool-switching between whiteboard, notes, and editor
- Automatic saving of session notes and whiteboard content

### 📊 User Stats
- Track total study time
- Filter stats by **Daily**, **Weekly**, **Monthly**, or **Yearly**

### 🔐 Admin Panel
- Block or unblock users
- Manage and deactivate study groups
- Force-stop sessions if abuse is reported

### 💡 Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose (Repository Pattern)  
- **Real-Time**: Socket.IO + Simple-Peer  
- **Whiteboard**: Fabric.js  
- **Video/Audio**: WebRTC  
- **Charts**: Recharts  
- **Containerization**: Docker (coming soon)  
- **Subscriptions**: In progress

---

## ⚙️ Getting Started

```bash
# Navigate to the backend directory
cd backend

# Build and run the backend container
docker build -t brainsync-backend .
docker run -p 5000:5000 --env-file .env brainsync-backend


# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the app
npm run dev

