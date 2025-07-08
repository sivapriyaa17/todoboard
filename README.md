#  Real-Time Collaborative Todo Board

A responsive full-stack Kanban board app for task management, featuring real-time updates, smart assignment logic, conflict handling, and activity logs.

---

# Project Overview

This Kanban board allows multiple users to collaborate in real time on tasks. Users can:
- Add, update, drag, and delete tasks.
- Automatically assign tasks using a "Smart Assign" system.
- Detect and handle task update conflicts.
- View activity logs of all actions.
- Use the app seamlessly on both desktop and mobile.(Responsiveness)

---

##  Tech Stack

### Frontend
- **React.js** + **Vite** (for performance)
- **Tailwind CSS** (for styling)
- **React Beautiful DnD** (for drag-and-drop)
- **Socket.io-client** (real-time updates)

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **Socket.io** (websockets)
- **dotenv** (environment config)
- **Cors & JWT** (authentication)

---

## Setup & Installation

### Prerequisites
- Node.js & npm
- MongoDB (local or Atlas)
- Git

---

###  Backend Setup

```bash
git clone https://github.com/sivapriyaa17/todoboard.git
cd kanban/backend

# Install dependencies
npm install

# Configure environment variables
.env contains port JWT KEY and mongodb url 

# Start backend server
npm run dev
