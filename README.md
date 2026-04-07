# 🎓 EduBond — Peer-to-Peer College Skill Exchange

EduBond is a peer-to-peer skill exchange platform built for college communities. Teach what you know, learn what you need — earn tokens for every session and build a reputation that opens doors.

## ✨ Features

- **🔍 Smart Skill Matching** — Custom matching algorithm scoring mutual skill alignment, availability, and reputation
- **💬 In-App Messaging** — Chat with learning partners to coordinate sessions
- **📅 Session Scheduling** — Book, manage, and track teaching/learning sessions with calendar export (.ics)
- **🪙 Token Economy** — Earn tokens by teaching, spend them to learn; every new user starts with 50 tokens
- **⭐ Reputation System** — Rate and review peers after sessions to build trust across the community
- **🏅 Gamified Badges** — Unlock achievements like Top Teacher, 5-Week Streak, Polymath, and more
- **👤 Rich Profiles** — Showcase your skills, major, university, bio, and earned badges
- **🔐 Auth System** — Email-based (.edu) registration and Google Sign-In
- **🛡️ Admin Dashboard** — Platform moderation tools including user management and data export
- **📊 Wallet & Transactions** — Full transaction history with CSV export support

## 🛠️ Tech Stack & Architecture

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router & Turbopack |
| **React 19** | UI component library |
| **TypeScript** | Type-safe development |
| **Context API** | Global state management (`store.tsx`) |
| **Vanilla CSS** | Custom styling with glassmorphism & dark theme |

### Database
| Technology | Purpose |
|-----------|---------|
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Prisma 7** | ORM for data modeling & schema management |

### Matching Engine
- Custom scoring algorithm in `src/lib/matching.ts`
- Scores mutual skill alignment between users
- Factors: skill overlap (direct swap vs one-way), proficiency levels, reputation score

### Dev & Deployment
| Tool | Purpose |
|------|---------|
| **GitHub** | Version control & collaboration |
| **dotenv** | Environment configuration |
| **Turbopack** | Fast dev server bundling |

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard page
│   ├── auth/
│   │   ├── login/          # Login page (.edu email + Google)
│   │   └── register/       # Registration page
│   ├── messages/           # Chat / messaging page
│   ├── profile/            # User profile page
│   ├── schedule/           # Session scheduling page
│   ├── wallet/             # Token wallet & transaction history
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Landing / home page
│   └── globals.css         # Global styles & design system
├── components/
│   ├── client-shell.tsx    # Client-side wrapper
│   ├── navbar.tsx          # Navigation bar
│   └── overlays.tsx        # Modals & overlay components
└── lib/
    ├── matching.ts         # Smart skill matching algorithm
    └── store.tsx           # App state management (React Context)

prisma/
└── schema.prisma           # Database schema (MongoDB)
prisma.config.ts            # Prisma 7 datasource configuration
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

The MongoDB database includes the following collections (defined in `prisma/schema.prisma`):

- **User** — Profile, credentials, reputation score, token balance
- **Skill** — Skill catalog with categories
- **UserSkillToTeach / UserSkillToLearn** — User skill mappings with proficiency levels
- **Match** — Connection between two users (pending/accepted/rejected/completed)
- **Session** — Scheduled teaching/learning sessions with token cost
- **Review** — Post-session ratings (1–5) and comments
- **Message** — In-app chat messages between matched users
- **TokenTransaction** — Token earning/spending ledger
- **Badge / UserBadge** — Achievement system with auto-award criteria

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
