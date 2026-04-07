# 🎓 EduBond — Peer-to-Peer College Skill Exchange

EduBond is a peer-to-peer skill exchange platform built for college communities. Teach what you know, learn what you need — earn tokens for every session and build a reputation that opens doors.

## ✨ Features

- **🔍 Smart Skill Matching** — Custom matching algorithm using MongoDB `$in` queries filtered by skill overlap, sorted by rating score
- **💬 Real-Time Messaging** — Live chat powered by Socket.io to coordinate sessions with learning partners
- **📅 Session Scheduling** — Book, manage, and track teaching/learning sessions with calendar sync
- **🪙 Token Economy** — Earn tokens by teaching, spend them to learn; every new user starts with 50 tokens
- **⭐ Reputation System** — Rate and review peers after sessions to build trust across the community
- **🏅 Gamified Badges** — Unlock achievements like Top Teacher, 5-Week Streak, Polymath, and more
- **👤 Rich Profiles** — Showcase your skills, major, university, bio, and earned badges
- **🔐 Secure Auth** — JWT-based authentication with bcrypt password hashing
- **🛡️ Admin Dashboard** — Platform moderation tools including user management and data export
- **📊 Wallet & Transactions** — Full transaction history with CSV export support

## 🛠️ Tech Stack & Architecture

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React.js** | UI component library |
| **React Router** | Client-side routing |
| **Axios** | HTTP client for API requests |
| **TailwindCSS** | Utility-first CSS framework |
| **Context API** | Global state management |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | REST API framework |
| **JWT** | Token-based authentication |
| **bcrypt** | Password hashing |
| **Socket.io** | Real-time messaging |

### Database
| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose ODM** | Data modeling & schema validation |

### Matching Engine
- Custom algorithm using MongoDB `$in` queries
- Filtered by skill overlap between users
- Sorted by reputation/rating score

### Dev & Deployment
| Tool | Purpose |
|------|---------|
| **GitHub** | Version control & collaboration |
| **Postman** | API testing |
| **Vercel** | Frontend deployment |
| **Render** | Backend deployment |
| **dotenv** | Environment configuration |

## 📁 Project Structure

```
├── client/                 # Frontend (React.js)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   │   ├── Home
│   │   │   ├── Login
│   │   │   ├── Register
│   │   │   ├── Profile
│   │   │   ├── Messages
│   │   │   ├── Schedule
│   │   │   ├── Wallet
│   │   │   └── Admin
│   │   ├── context/        # React Context (global state)
│   │   ├── utils/          # Axios config, helpers
│   │   └── App.js          # Router setup
│   └── package.json
│
├── server/                 # Backend (Express.js)
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Skill.js
│   │   ├── Match.js
│   │   ├── Session.js
│   │   ├── Review.js
│   │   ├── Message.js
│   │   └── TokenTransaction.js
│   ├── routes/             # API route handlers
│   ├── middleware/          # JWT auth middleware
│   ├── config/             # DB connection, env config
│   ├── socket/             # Socket.io event handlers
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranavchinnawar/EduBond.git
   cd EduBond
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server/` directory:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/edubond?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend (in a new terminal)
   cd client
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The MongoDB database includes the following collections:

- **Users** — Profile, credentials, hashed passwords, reputation, token balance
- **Skills** — Skill catalog with categories
- **Matches** — Connection between two users (pending/accepted/rejected)
- **Sessions** — Scheduled teaching/learning sessions with token cost
- **Reviews** — Post-session ratings and comments
- **Messages** — Real-time chat messages via Socket.io
- **TokenTransactions** — Token earning/spending ledger
- **Badges** — Achievement system with auto-award criteria

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login & receive JWT token |
| GET | `/api/users/profile` | Get current user profile |
| PUT | `/api/users/profile` | Update profile & skills |
| GET | `/api/matches` | Get skill-matched users |
| POST | `/api/matches/connect` | Send connection request |
| GET | `/api/sessions` | Get user's sessions |
| POST | `/api/sessions` | Schedule a new session |
| POST | `/api/reviews` | Submit a review |
| GET | `/api/wallet` | Get token balance & history |
| GET | `/api/messages/:matchId` | Get conversation messages |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for college communities
