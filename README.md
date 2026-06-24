# 3W Social App
## Live - (https://threew-test1-1.onrender.com)

A full-stack social media-style application built with React, Node.js, Express, and MongoDB Atlas.


## Features
- User signup and login
- Create posts with text and image support
- Public feed with posts from all users
- Like, comment, and share actions
- Follow and unfollow users
- Profile section and social stats

## Tech Stack
- Frontend: React.js
- Backend: Node.js + Express
- Database: MongoDB Atlas

## Setup
1. Clone the repository
2. Install frontend dependencies:
   - `cd frontend && npm install`
3. Install backend dependencies:
   - `cd backend && npm install`
4. Create a `.env` file in the backend folder using `.env.example` as a template
5. Start the backend:
   - `cd backend && npm run dev`
6. Start the frontend:
   - `cd frontend && npm run dev`

## Environment Variables
Create a backend `.env` file with:
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`

## Deployment
- Frontend: Vercel / Netlify
- Backend: Render
- Database: MongoDB Atlas
