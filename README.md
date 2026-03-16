# KASP AI Analytics Assistant 🚀

Enterprise-grade AI Analytics Platform with RAG Architecture, RBAC, and Oracle Integration

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)

## 🎯 Overview

KASP AI Analytics Assistant is a fully on-premise AI-powered analytics platform designed for enterprise use with beautiful modern UI, role-based access control, and intelligent chat capabilities.

### ✨ Key Features

- 🤖 **AI Chat Interface** - Natural language queries for analytics insights
- 🔐 **RBAC** - 4 user roles (Admin, Manager, Analyst, Viewer)
- 📊 **Analytics Dashboard** - Interactive charts and real-time KPIs  
- 👥 **User Management** - Complete admin panel
- 🎨 **Modern UI** - Dark/Light mode with beautiful animations
- 🗄️ **Oracle Ready** - Easy database connection configuration

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@kasp.com | admin123 |
| 📈 Manager | manager@kasp.com | manager123 |
| 🔍 Analyst | analyst@kasp.com | analyst123 |
| 👀 Viewer | viewer@kasp.com | viewer123 |

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Backend runs on `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Access the Application

1. Open `http://localhost:3000`
2. Click any demo account to auto-fill credentials
3. Click "Sign In"
4. Start exploring!

## 🗄️ Database Configuration

### Current: Mock Database
The app uses an in-memory database with realistic dummy data for demonstration.

### Connect to Real Oracle

Edit `backend/main.py` to replace mock database:

```python
import oracledb

# Your Oracle credentials
DB_CONFIG = {
    "user": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD",
    "dsn": "YOUR_HOST:1521/YOUR_SERVICE",
}

# Create connection pool
connection_pool = oracledb.create_pool(**DB_CONFIG, min=2, max=10)
```

Install Oracle client:
```bash
pip install oracledb
```

## 📊 Mock Data Included

- **Sales Data**: Regional performance, Q1 2025 results
- **Products**: Revenue, margins, units sold
- **Customers**: 3,456 total, 94.8% renewal rate
- **KPIs**: $15.29M YTD revenue, 102.3% target achievement

## 🎨 Features Walkthrough

### Chat Interface
- Ask natural language questions about your data
- Get AI-powered insights instantly
- Quick prompts for common queries
- Conversation history

### Analytics Dashboard
- Interactive charts (Bar, Line, Pie)
- Real-time KPI cards
- Regional sales breakdown
- Product performance tables

### User Management (Admin)
- View all users
- Edit roles and permissions
- Department assignments
- Role permission matrix

### Settings
- Profile management
- Notification preferences
- Security settings
- Theme toggle (Dark/Light)

## 📁 Project Structure

```
kasp-ai-analytics-assistant/
├── backend/
│   ├── main.py              # FastAPI app with mock DB
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔌 API Endpoints

### Auth
- `POST /auth/login` - Login
- `GET /auth/me` - Current user

### Chat
- `POST /chat` - Send message
- `GET /conversations` - Get conversations

### Analytics  
- `GET /analytics/data` - Get data (role-filtered)

### Admin
- `GET /users` - List users
- `PUT /users/{id}` - Update user

## 🎯 Technology Stack

**Backend:**
- FastAPI (Python)
- JWT Authentication
- Oracle DB Ready

**Frontend:**
- React 18 + Vite
- Recharts
- Lucide Icons
- Axios

## 🔧 Production Deployment

### Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
npm run build
npm run preview
```

## 🌟 Screenshots

The application features:
- Beautiful gradient login screen
- Responsive sidebar navigation  
- Modern chat interface with typing indicators
- Interactive analytics dashboard
- Comprehensive admin panel
- Clean settings interface

## 📝 Notes

- Mock data simulates real Oracle database structure
- All API calls are authenticated with JWT
- RBAC enforced on all endpoints
- Ready for OpenAI/Anthropic API integration

## 🚀 Next Steps

1. **Connect Real Database**: Replace mock DB with Oracle
2. **Add LLM API**: Integrate OpenAI or Anthropic
3. **Deploy**: Use Docker or your preferred method
4. **Customize**: Add your company branding

---

**Built with ❤️ for KASP** | Version 1.0.0 | Enterprise On-Premise Solution
