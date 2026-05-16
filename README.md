<div align="center">

<img src="https://img.shields.io/badge/ExpenseIQ-Full%20Stack%20App-7c3aed?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMSAxOFYxOUMyMSAyMC4xIDIwLjEgMjEgMTkgMjFINUMzLjkgMjEgMyAyMC4xIDMgMTlWNUMzIDMuOSAzLjkgMyA1IDNIMTlDMjAuMSAzIDIxIDMuOSAyMSA1VjZIMTJDMTAuOSA2IDEwIDYuOSAxMCA4VjE2QzEwIDE3LjEgMTAuOSAxOCAxMiAxOEgyMVpNMTIgMTZIMjJWOEgxMlYxNlpNMTYgMTMuNUMxNS4yIDEzLjUgMTQuNSAxMi44IDE0LjUgMTJDMTQuNSAxMS4yIDE1LjIgMTAuNSAxNiAxMC41QzE2LjggMTAuNSAxNy41IDExLjIgMTcuNSAxMkMxNy41IDEyLjggMTYuOCAxMy41IDE2IDEzLjVaIi8+PC9zdmc+" alt="ExpenseIQ" />

# ExpenseIQ

### A production-ready full-stack expense tracking application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-7c3aed?style=flat-square&logo=vercel)](https://expenseiq-two.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-00b86b?style=flat-square&logo=render)](https://expenseiq-backend-codu.onrender.com/health)
[![GitHub](https://img.shields.io/badge/GitHub-adarsh9958-181717?style=flat-square&logo=github)](https://github.com/adarsh9958/expense-tracker)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)

</div>

---

## 📸 Preview

> Dashboard with dark/light mode, charts, and transaction management

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register, login, and logout
- 📊 **Analytics Dashboard** — Income vs expense area charts, category pie chart
- 💸 **Transaction Management** — Add, edit, delete with categories and payment methods
- 🔍 **Search & Filter** — Filter by type, category, date range, keyword
- 📱 **Fully Responsive** — Mobile, tablet, and desktop layouts
- 🌙 **Dark / Light Mode** — Persistent theme preference
- 🔔 **Toast Notifications** — Real-time feedback on all actions
- 📄 **Pagination** — Efficient data loading for large transaction lists

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS v3 | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Recharts | Interactive charts |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |
| date-fns | Date formatting |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT + bcryptjs | Authentication and password hashing |
| Helmet + CORS | Security middleware |
| Morgan | HTTP request logging |
| Nodemon | Development auto-restart |

### Deployment
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting (CDN) |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/adarsh9958/expense-tracker.git
cd expense-tracker
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create `client/.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### 4. Open in browser


---

## 📁 Project Structure
```
expense-tracker/
├── client/                   # Frontend (React + Vite)
│   ├── src/
│   │   ├── api/            # API request functions
│   │   ├── components/       # Reusable components (Chart, Navbar, Pagination, etc.)
│   │   ├── context/          # React Context (Auth, Transactions)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components (Login, Register, Dashboard, Transactions)
│   │   ├── App.jsx           # Main app component with routing
│   │   └── main.jsx          # Entry point
│   ├── .env.local          # Environment variables
│   ├── index.html          # HTML template
│   └── vercel.json           # Vercel deployment config
│
├── server/                   # Backend (Node.js + Express)
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers (auth, transaction)
│   ├── middleware/         # Authentication middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── server.js           # Express server setup
│   └── .env                # Environment variables
│
├── .gitignore              # Files to ignore in Git
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```


---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### Transactions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/transactions` | Get all transactions (paginated) | ✅ |
| GET | `/api/transactions/summary` | Dashboard summary + charts data | ✅ |
| POST | `/api/transactions` | Create transaction | ✅ |
| PUT | `/api/transactions/:id` | Update transaction | ✅ |
| DELETE | `/api/transactions/:id` | Delete transaction | ✅ |

---

## 🌐 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | Token expiry duration (e.g. 30d) |
| `NODE_ENV` | Environment (development/production) |
| `FRONTEND_URL` | Allowed CORS origin |

### Frontend (`client/.env.local`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## 👨‍💻 Author

**Adarsh Pathak**

[![GitHub](https://img.shields.io/badge/GitHub-adarsh9958-181717?style=flat-square&logo=github)](https://github.com/adarsh9958)

---

<div align="center">
  <sub>Built with ❤️ using React, Node.js, and MongoDB</sub>
</div>