"""
KASP AI Analytics Assistant - Backend Server
FastAPI backend with Oracle DB simulation, RBAC, and OpenAI integration
"""

from fastapi import FastAPI, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import jwt
import hashlib
import json
import uuid
from enum import Enum
import asyncio

app = FastAPI(title="KASP AI Analytics Assistant API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
SECRET_KEY = "kasp-ai-analytics-secret-key-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()

# ==================== ROLE DEFINITIONS ====================
class Role(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    ANALYST = "analyst"
    VIEWER = "viewer"

ROLE_PERMISSIONS = {
    Role.ADMIN: ["read", "write", "delete", "admin", "export", "user_management"],
    Role.MANAGER: ["read", "write", "export"],
    Role.ANALYST: ["read", "write"],
    Role.VIEWER: ["read"]
}

# ==================== MOCK DATABASE ====================
# Simulating Oracle Database with realistic KASP data

USERS_DB = {
    "admin@kasp.com": {
        "id": "USR001",
        "email": "admin@kasp.com",
        "password": hashlib.sha256("admin123".encode()).hexdigest(),
        "name": "John Anderson",
        "role": Role.ADMIN,
        "department": "IT Administration",
        "created_at": "2025-01-15T10:00:00Z"
    },
    "manager@kasp.com": {
        "id": "USR002",
        "email": "manager@kasp.com",
        "password": hashlib.sha256("manager123".encode()).hexdigest(),
        "name": "Sarah Mitchell",
        "role": Role.MANAGER,
        "department": "Sales Operations",
        "created_at": "2025-01-16T09:30:00Z"
    },
    "analyst@kasp.com": {
        "id": "USR003",
        "email": "analyst@kasp.com",
        "password": hashlib.sha256("analyst123".encode()).hexdigest(),
        "name": "Michael Chen",
        "role": Role.ANALYST,
        "department": "Data Analytics",
        "created_at": "2025-01-17T11:00:00Z"
    },
    "viewer@kasp.com": {
        "id": "USR004",
        "email": "viewer@kasp.com",
        "password": hashlib.sha256("viewer123".encode()).hexdigest(),
        "name": "Emily Rodriguez",
        "role": Role.VIEWER,
        "department": "Business Intelligence",
        "created_at": "2025-01-18T14:20:00Z"
    }
}

# Simulated Analytics Data - What an Oracle DB might contain
ANALYTICS_DATA = {
    "sales_summary": [
        {"region": "North America", "q1_2025": 4520000, "q4_2024": 4180000, "growth": "8.1%"},
        {"region": "Europe", "q1_2025": 3890000, "q4_2024": 3720000, "growth": "4.6%"},
        {"region": "Asia Pacific", "q1_2025": 5230000, "q4_2024": 4950000, "growth": "5.7%"},
        {"region": "Latin America", "q1_2025": 1650000, "q4_2024": 1580000, "growth": "4.4%"},
    ],
    "top_products": [
        {"product": "KASP Analytics Pro", "revenue": 2340000, "units": 1567, "margin": "62%"},
        {"product": "KASP DataViz Suite", "revenue": 1890000, "units": 2341, "margin": "58%"},
        {"product": "KASP AI Insights", "revenue": 3120000, "units": 892, "margin": "71%"},
        {"product": "KASP Enterprise Dashboard", "revenue": 2980000, "units": 456, "margin": "68%"},
    ],
    "customer_metrics": {
        "total_customers": 3456,
        "active_subscriptions": 3128,
        "churn_rate": "3.2%",
        "avg_contract_value": 145000,
        "renewal_rate": "94.8%"
    },
    "performance_kpis": {
        "revenue_ytd": 15290000,
        "target_achievement": "102.3%",
        "market_share": "18.7%",
        "customer_satisfaction": "4.6/5.0",
        "nps_score": 72
    }
}

# Conversation History Storage
CONVERSATIONS_DB = {}

# ==================== MODELS ====================
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class ChatMessage(BaseModel):
    content: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[Role] = None
    department: Optional[str] = None

# ==================== HELPER FUNCTIONS ====================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None or email not in USERS_DB:
            raise HTTPException(status_code=401, detail="Invalid authentication")
        return USERS_DB[email]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def check_permission(user: dict, required_permission: str):
    user_role = user["role"]
    if required_permission not in ROLE_PERMISSIONS[user_role]:
        raise HTTPException(
            status_code=403, 
            detail=f"Permission denied. Role '{user_role}' doesn't have '{required_permission}' permission"
        )

def generate_ai_response(message: str, user: dict, context: Dict = None) -> str:
    """
    Generate AI response based on user query
    In production, this would call OpenAI API
    For demo, we use intelligent pattern matching
    """
    message_lower = message.lower()
    
    # Sales queries
    if any(word in message_lower for word in ["sales", "revenue", "quarterly"]):
        sales = ANALYTICS_DATA["sales_summary"]
        total_q1 = sum(r["q1_2025"] for r in sales)
        response = f"Based on our Q1 2025 data, total sales reached ${total_q1:,}. "
        response += "Here's the breakdown by region:\n\n"
        for region in sales:
            response += f"• {region['region']}: ${region['q1_2025']:,} ({region['growth']} growth)\n"
        return response
    
    # Product performance
    elif any(word in message_lower for word in ["product", "top selling", "best"]):
        products = ANALYTICS_DATA["top_products"]
        response = "Our top-performing products in Q1 2025:\n\n"
        for i, prod in enumerate(products, 1):
            response += f"{i}. {prod['product']}: ${prod['revenue']:,} revenue, {prod['margin']} margin\n"
        return response
    
    # Customer metrics
    elif any(word in message_lower for word in ["customer", "churn", "retention", "subscription"]):
        metrics = ANALYTICS_DATA["customer_metrics"]
        response = f"Customer Metrics Overview:\n\n"
        response += f"• Total Customers: {metrics['total_customers']:,}\n"
        response += f"• Active Subscriptions: {metrics['active_subscriptions']:,}\n"
        response += f"• Churn Rate: {metrics['churn_rate']}\n"
        response += f"• Renewal Rate: {metrics['renewal_rate']}\n"
        response += f"• Average Contract Value: ${metrics['avg_contract_value']:,}\n"
        return response
    
    # KPIs
    elif any(word in message_lower for word in ["kpi", "performance", "target", "goal"]):
        kpis = ANALYTICS_DATA["performance_kpis"]
        response = "Performance KPIs - Year to Date:\n\n"
        response += f"• Revenue YTD: ${kpis['revenue_ytd']:,}\n"
        response += f"• Target Achievement: {kpis['target_achievement']}\n"
        response += f"• Market Share: {kpis['market_share']}\n"
        response += f"• Customer Satisfaction: {kpis['customer_satisfaction']}\n"
        response += f"• NPS Score: {kpis['nps_score']}\n"
        return response
    
    # Region specific
    elif "north america" in message_lower or "na region" in message_lower:
        na_data = next(r for r in ANALYTICS_DATA["sales_summary"] if r["region"] == "North America")
        return f"North America Performance:\n• Q1 2025 Revenue: ${na_data['q1_2025']:,}\n• Growth: {na_data['growth']}\n• Leading region in contract renewals"
    
    # Default intelligent response
    else:
        return f"Hello {user['name']}! As a {user['role'].upper()} user, you have access to various analytics insights. Try asking about:\n\n• Sales performance and quarterly revenue\n• Top products and their margins\n• Customer metrics and retention rates\n• Performance KPIs and targets\n• Regional breakdowns\n\nHow can I help you analyze your data today?"

# ==================== API ENDPOINTS ====================

@app.get("/")
async def root():
    return {
        "service": "KASP AI Analytics Assistant",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "llm": "ready",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/auth/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    """User login with email and password"""
    email = credentials.email.lower()
    password_hash = hashlib.sha256(credentials.password.encode()).hexdigest()
    
    if email not in USERS_DB:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = USERS_DB[email]
    if user["password"] != password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token({"sub": email, "role": user["role"]})
    
    # Return user data without password
    user_data = {k: v for k, v in user.items() if k != "password"}
    
    return TokenResponse(
        access_token=access_token,
        user=user_data
    )

@app.get("/auth/me")
async def get_current_user(user: dict = Depends(verify_token)):
    """Get current authenticated user"""
    return {k: v for k, v in user.items() if k != "password"}

@app.post("/conversations")
async def create_conversation(
    conversation: ConversationCreate,
    user: dict = Depends(verify_token)
):
    """Create a new conversation"""
    check_permission(user, "read")
    
    conv_id = str(uuid.uuid4())
    CONVERSATIONS_DB[conv_id] = {
        "id": conv_id,
        "title": conversation.title,
        "user_id": user["id"],
        "created_at": datetime.utcnow().isoformat(),
        "messages": []
    }
    
    return CONVERSATIONS_DB[conv_id]

@app.get("/conversations")
async def get_conversations(user: dict = Depends(verify_token)):
    """Get all conversations for current user"""
    check_permission(user, "read")
    
    user_conversations = [
        conv for conv in CONVERSATIONS_DB.values()
        if conv["user_id"] == user["id"]
    ]
    
    return sorted(user_conversations, key=lambda x: x["created_at"], reverse=True)

@app.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user: dict = Depends(verify_token)
):
    """Get a specific conversation"""
    check_permission(user, "read")
    
    if conversation_id not in CONVERSATIONS_DB:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv = CONVERSATIONS_DB[conversation_id]
    if conv["user_id"] != user["id"] and user["role"] != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return conv

@app.post("/chat", response_model=ChatResponse)
async def chat(
    message: ChatMessage,
    user: dict = Depends(verify_token)
):
    """Send a chat message and get AI response"""
    check_permission(user, "read")
    
    # Get or create conversation
    if message.conversation_id and message.conversation_id in CONVERSATIONS_DB:
        conv = CONVERSATIONS_DB[message.conversation_id]
    else:
        conv_id = str(uuid.uuid4())
        conv = {
            "id": conv_id,
            "title": message.content[:50] + "..." if len(message.content) > 50 else message.content,
            "user_id": user["id"],
            "created_at": datetime.utcnow().isoformat(),
            "messages": []
        }
        CONVERSATIONS_DB[conv_id] = conv
    
    # Add user message
    user_message = {
        "role": "user",
        "content": message.content,
        "timestamp": datetime.utcnow().isoformat()
    }
    conv["messages"].append(user_message)
    
    # Generate AI response
    ai_response = generate_ai_response(message.content, user)
    
    # Add AI message
    ai_message = {
        "role": "assistant",
        "content": ai_response,
        "timestamp": datetime.utcnow().isoformat()
    }
    conv["messages"].append(ai_message)
    
    return ChatResponse(
        response=ai_response,
        conversation_id=conv["id"],
        timestamp=datetime.utcnow().isoformat(),
        metadata={
            "user_role": user["role"],
            "message_count": len(conv["messages"])
        }
    )

@app.get("/analytics/data")
async def get_analytics_data(user: dict = Depends(verify_token)):
    """Get analytics data based on user role"""
    check_permission(user, "read")
    
    # Role-based data filtering
    if user["role"] == Role.VIEWER:
        # Viewers get limited summary data
        return {
            "sales_summary": ANALYTICS_DATA["sales_summary"],
            "customer_metrics": {
                "total_customers": ANALYTICS_DATA["customer_metrics"]["total_customers"],
                "churn_rate": ANALYTICS_DATA["customer_metrics"]["churn_rate"]
            }
        }
    else:
        # Other roles get full access
        return ANALYTICS_DATA

@app.get("/users")
async def get_users(user: dict = Depends(verify_token)):
    """Get all users (admin only)"""
    check_permission(user, "user_management")
    
    return [
        {k: v for k, v in u.items() if k != "password"}
        for u in USERS_DB.values()
    ]

@app.put("/users/{user_id}")
async def update_user(
    user_id: str,
    updates: UserUpdate,
    current_user: dict = Depends(verify_token)
):
    """Update user (admin only)"""
    check_permission(current_user, "user_management")
    
    target_user = next((u for u in USERS_DB.values() if u["id"] == user_id), None)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if updates.name:
        target_user["name"] = updates.name
    if updates.role:
        target_user["role"] = updates.role
    if updates.department:
        target_user["department"] = updates.department
    
    return {k: v for k, v in target_user.items() if k != "password"}

@app.get("/stats/overview")
async def get_stats_overview(user: dict = Depends(verify_token)):
    """Get system statistics"""
    check_permission(user, "read")
    
    total_conversations = len([c for c in CONVERSATIONS_DB.values() if c["user_id"] == user["id"]])
    total_messages = sum(
        len(c["messages"]) 
        for c in CONVERSATIONS_DB.values() 
        if c["user_id"] == user["id"]
    )
    
    return {
        "total_conversations": total_conversations,
        "total_messages": total_messages,
        "user_role": user["role"],
        "department": user["department"],
        "member_since": user["created_at"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
