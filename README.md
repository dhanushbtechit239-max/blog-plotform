# 🚀 BlogVerse — Modern Blog Platform

A full-stack blog platform with real-time comments, animated UI, and JWT authentication.

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS v4 + Motion
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Auth**: JWT + bcrypt

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ✗ | Register new user |
| POST | /api/auth/login | ✗ | Login user |
| GET | /api/auth/me | ✓ | Get current user |
| GET | /api/posts | ✗ | List all posts (paginated) |
| GET | /api/posts/:id | ✗ | Get single post |
| POST | /api/posts | ✓ | Create post |
| PUT | /api/posts/:id | ✓ | Update post (author only) |
| DELETE | /api/posts/:id | ✓ | Delete post (author only) |
| PUT | /api/posts/:id/like | ✓ | Toggle like |
| GET | /api/comments/:postId | ✗ | Get comments for post |
| POST | /api/comments/:postId | ✓ | Add comment |
| DELETE | /api/comments/:id | ✓ | Delete comment (author only) |

## Features

- ✅ JWT Authentication (Register/Login/Logout)
- ✅ CRUD Blog Posts
- ✅ Real-time Comments via Socket.io
- ✅ Like/Unlike Posts
- ✅ Search & Pagination
- ✅ User Dashboard
- ✅ Animated UI with Motion
- ✅ Dark Mode Design
- ✅ Responsive Layout
