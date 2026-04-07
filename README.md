# 🎓 EduBond — Peer-to-Peer College Skill Exchange

EduBond is a peer-to-peer skill exchange platform built for college communities. Teach what you know, learn what you need — earn tokens for every session and build a reputation that opens doors.

## ✨ Features

- **🔍 Smart Skill Matching** — Algorithmic matching based on mutual skill alignment, availability, and reputation
- **💬 Real-Time Messaging** — In-app chat to coordinate sessions with learning partners
- **📅 Session Scheduling** — Book, manage, and track teaching/learning sessions with calendar sync
- **🪙 Token Economy** — Earn tokens by teaching, spend them to learn; every new user starts with 50 tokens
- **⭐ Reputation System** — Rate and review peers after sessions to build trust across the community
- **🏅 Gamified Badges** — Unlock achievements like Top Teacher, 5-Week Streak, Polymath, and more
- **👤 Rich Profiles** — Showcase your skills, major, university, bio, and earned badges
- **🛡️ Admin Dashboard** — Platform moderation tools including user management and data export
- **📊 Wallet & Transactions** — Full transaction history with CSV export support

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | TypeScript |
| **Frontend** | React 19 |
| **Styling** | Vanilla CSS (glassmorphism, gradients, dark theme) |
| **ORM** | [Prisma 7](https://www.prisma.io/) |
| **Database** | MongoDB Atlas |
| **Auth** | Email (.edu) + Google Sign-In |

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/          # Admin dashboard
│   ├── auth/
│   │   ├── login/      # Login page
│   │   └── register/   # Registration page
│   ├── messages/       # Chat / messaging
│   ├── profile/        # User profile
│   ├── schedule/       # Session scheduling
│   ├── wallet/         # Token wallet & transactions
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Landing / home page
│   └── globals.css     # Global styles & design system
├── components/
│   ├── client-shell.tsx
│   ├── navbar.tsx      # Navigation bar
│   └── overlays.tsx    # Modals & overlays
└── lib/
    ├── matching.ts     # Smart matching algorithm
    └── store.tsx       # App state management (React Context)
prisma/
└── schema.prisma       # Database schema (MongoDB)
prisma.config.ts        # Prisma 7 configuration
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranavchinnawar/EduBond.git
   cd EduBond
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   MONGO_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/edubond?retryWrites=true&w=majority"
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma client |

## 🗄️ Database Schema

The MongoDB database includes the following collections:

- **User** — Profile, credentials, reputation, token balance
- **Skill** — Skill catalog with categories
- **UserSkillToTeach / UserSkillToLearn** — User skill mappings
- **Match** — Connection between two users
- **Session** — Scheduled teaching/learning sessions
- **Review** — Post-session ratings and comments
- **Message** — In-app chat messages
- **TokenTransaction** — Token earning/spending ledger
- **Badge / UserBadge** — Achievement system

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
