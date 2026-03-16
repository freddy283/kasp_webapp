# KASP AI Analytics Assistant - Setup Guide

## 📋 Quick Start (3 Easy Steps)

### Step 1: Install Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Start Servers
```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 3: Access Application
Open browser: `http://localhost:3000`

**Or use the automated script:**
```bash
chmod +x start.sh
./start.sh
```

## 🔐 Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@kasp.com | admin123 | Full system access, user management |
| **Manager** | manager@kasp.com | manager123 | Analytics, reports, data export |
| **Analyst** | analyst@kasp.com | analyst123 | Analytics, data queries |
| **Viewer** | viewer@kasp.com | viewer123 | Read-only dashboard access |

## 🗄️ Database Configuration

### Current Setup
Uses **in-memory mock database** with realistic data:
- Sales performance by region
- Product revenue and margins  
- Customer metrics and KPIs
- User accounts with RBAC

### Connect to Oracle Database

1. **Install Oracle Client:**
```bash
pip install oracledb
```

2. **Update `backend/main.py`:**

Replace the mock database section with:
```python
import oracledb

# Oracle Database Configuration
DB_CONFIG = {
    "user": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD", 
    "dsn": "YOUR_HOST:1521/YOUR_SERVICE_NAME",
}

# Create connection pool
try:
    connection_pool = oracledb.create_pool(
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        dsn=DB_CONFIG["dsn"],
        min=2,
        max=10
    )
    print("✅ Connected to Oracle Database")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
```

3. **Update Data Queries:**
Replace the mock data dictionaries with actual SQL queries:
```python
def get_sales_data():
    with connection_pool.acquire() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT region, q1_2025, q4_2024, growth
                FROM sales_summary
            """)
            return cursor.fetchall()
```

## 🔌 API Integration

### OpenAI Integration (Optional)

1. **Install OpenAI SDK:**
```bash
pip install openai
```

2. **Update `backend/main.py`:**
```python
import openai

openai.api_key = "YOUR_API_KEY"

def generate_ai_response(message: str, user: dict) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a business analytics assistant."},
            {"role": "user", "content": message}
        ]
    )
    return response.choices[0].message.content
```

### Anthropic Claude Integration (Alternative)

```bash
pip install anthropic
```

```python
import anthropic

client = anthropic.Anthropic(api_key="YOUR_API_KEY")

def generate_ai_response(message: str, user: dict) -> str:
    response = client.messages.create(
        model="claude-3-sonnet-20240229",
        max_tokens=1024,
        messages=[{"role": "user", "content": message}]
    )
    return response.content[0].text
```

## 🎨 Customization

### Change Branding

**Frontend Colors** (`frontend/src/index.css`):
```css
:root {
  --accent-primary: #YOUR_COLOR;
  --gradient-primary: linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%);
}
```

**Company Logo** (`frontend/src/components/Login.jsx`):
Replace the SVG logo with your own image/logo.

### Modify Theme

Edit `frontend/src/index.css` to customize:
- Color schemes
- Font families
- Border radius
- Shadow effects

## 📊 Data Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(10) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sales Summary Table
```sql
CREATE TABLE sales_summary (
    id INT PRIMARY KEY,
    region VARCHAR(50),
    q1_2025 DECIMAL(12,2),
    q4_2024 DECIMAL(12,2),
    growth VARCHAR(10)
);
```

### Products Table
```sql
CREATE TABLE top_products (
    id INT PRIMARY KEY,
    product VARCHAR(255),
    revenue DECIMAL(12,2),
    units INT,
    margin VARCHAR(10)
);
```

## 🚀 Deployment

### Production Backend

**Using Uvicorn:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Using Gunicorn:**
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Production Frontend

```bash
cd frontend
npm run build
```

Serve the `dist` folder with:
- Nginx
- Apache
- Any static file server

### Docker Deployment

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=oracle://user:pass@db:1521/service
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 🔧 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

**Import errors:**
```bash
pip install -r requirements.txt --upgrade
```

### Frontend Issues

**npm install fails:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 in use:**
Edit `vite.config.js`:
```javascript
server: {
  port: 3001
}
```

### CORS Issues

Update `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📝 Environment Variables

Create `.env` files:

**Backend `.env`:**
```
SECRET_KEY=your-super-secret-key-change-this
DATABASE_URL=oracle://user:pass@localhost:1521/XEPDB1
CORS_ORIGINS=http://localhost:3000,http://your-domain.com
OPENAI_API_KEY=sk-...
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=KASP Analytics
```

## 🎯 Next Steps

1. ✅ **Test the application** with demo accounts
2. 🗄️ **Connect your Oracle database**
3. 🤖 **Integrate AI API** (OpenAI/Anthropic)
4. 🎨 **Customize branding** and colors
5. 👥 **Add real users** via admin panel
6. 📊 **Import your data** into Oracle
7. 🚀 **Deploy to production**

## 📞 Support

For questions or issues:
- Check the main README.md
- Review API docs at `/docs` endpoint
- Contact: support@kasp.com

---

**Happy Building! 🚀**
