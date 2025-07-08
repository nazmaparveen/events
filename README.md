# 📲 Event app master Frontend

This is the frontend mobile application for the **Event-app-master** system. Built using **React Native (Expo)**, it allows users to log in, view events, and join check-ins in real time.

---

## 🚀 Features

- 🔐 Login via email
- 🗓️ View upcoming events
- 🎫 Join events with one tap
- ⚡ Real-time event updates (via WebSockets)
- 🧠 Global state management with Zustand
- 📡 GraphQL API integration with Apollo Client
- 🧠 Local token storage via AsyncStorage

---

## 🧱 Tech Stack

- React Native (Expo)
- Apollo Client (GraphQL)
- Zustand for global state
- React Navigation (Stack)
- AsyncStorage for auth tokens
- TypeScript

---

## 📦 Installation

### 1. Clone the repo

```bash
git clone https://github.com/your-username/event-checkin-frontend.git
cd event-checkin-frontend



# 🗓️ Event Check-In Backend

This is the backend server for the Event Check-In App. It provides a GraphQL API for user authentication, event management, and attendee check-ins. Built with **Node.js**, **TypeScript**, **Apollo Server**, and **Prisma ORM**, and connects to a MySQL database.

---

## 🚀 Features

- ✅ User login via email (JWT-based auth)
- 📅 Create & manage events
- 🎫 Join events as attendees
- 🔐 Secure API with token-based authentication
- 🔎 GraphQL Playground for testing

---

## 🧱 Tech Stack

- Node.js + TypeScript
- Apollo Server (GraphQL)
- Prisma ORM
- MySQL or PostgreSQL
- Express.js
- JWT (JSON Web Tokens)
- dotenv for config

---

## 📦 Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/event-checkin-backend.git
cd event-checkin-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
