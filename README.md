# UniConnect

A real-time chat app for UTA students: direct messages, group chats, and friend requests, with messages delivered over WebSockets.

> Personal project, still in progress.

## Stack

**Frontend** — React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/Base UI, Zustand, Socket.IO client
**Backend** — Node, Express 5, MongoDB with Mongoose, Socket.IO, JWT auth with bcrypt

## Features

- **Direct and group conversations**, with the conversation list sorted unread-first
- **Real-time delivery** over Socket.IO rooms, one room per conversation
- **Presence** — who is online, pushed to every client on connect and disconnect
- **Unread counts** per user per conversation, and read receipts on the newest message
- **Friends** — search by username, send a request with a short note, accept or decline
- **Message history** loaded as you scroll up, 50 at a time
- **Light and dark themes**, driven by CSS custom properties

## How it works

**Auth** uses two tokens. A 15-minute JWT access token lives in memory on the client; a 7-day refresh token is stored as an httpOnly cookie and mirrored in a `sessions` collection with a TTL index. An Axios interceptor catches a 403, refreshes once, and retries, so a reload keeps you signed in without ever putting a token in `localStorage`.

**Messages** are paginated by `createdAt` rather than by page number, so new arrivals never shift pages you have already loaded. Each response returns a `nextPtr` cursor the client sends back to load older messages.

**Unread counts** live on the conversation as a map of user id to count — incremented for every participant except the sender when a message is created, and zeroed when that user opens the chat.

**Client state** is a set of Zustand stores (auth, chat, friends, socket, theme), with the conversation list persisted to `localStorage` so the sidebar paints before the first request returns.

## Running it locally

You need Node 20+ and a MongoDB instance (local or Atlas).

```bash
git clone https://github.com/lannguyen9964/uniconnect.git
cd uniconnect
```

**Backend**

```bash
cd backend
npm install
cp .env.example .env     # then fill in the values
npm run dev              # http://localhost:5001
```

| Variable | Example |
| --- | --- |
| `MONGODB_CONNECTION_STRING` | `mongodb://localhost:27017/uniconnect` |
| `ACCESS_TOKEN_SECRET` | any long random string |
| `CLIENT_URL` | `http://localhost:5173` |
| `PORT` | `5001` |

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env.development
npm run dev              # http://localhost:5173
```

| Variable | Example |
| --- | --- |
| `VITE_API_URL` | `http://localhost:5001/api` |
| `VITE_SOCKET_URL` | `http://localhost:5001/` |

API docs are served at `http://localhost:5001/api-docs`.

## Status

Known gaps:

- Image upload is modelled but not implemented, so messages are text only
- No voice or video calls
- Public course-based chat rooms are planned
- No automated tests yet
