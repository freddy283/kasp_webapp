#!/bin/bash

# KASP AI Analytics Assistant - Startup Script
# This script starts both backend and frontend servers

echo "========================================="
echo "🚀 KASP AI Analytics Assistant"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Python 3 is not installed. Please install Python 3.11+${NC}"
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
echo ""

# Install backend dependencies
echo -e "${GREEN}Backend:${NC}"
cd backend
pip install -r requirements.txt -q
cd ..

# Install frontend dependencies
echo -e "${GREEN}Frontend:${NC}"
cd frontend
npm install --silent
cd ..

echo ""
echo -e "${GREEN}✅ Dependencies installed!${NC}"
echo ""

# Start backend
echo -e "${BLUE}🔧 Starting backend server...${NC}"
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo -e "${BLUE}🎨 Starting frontend server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================="
echo -e "${GREEN}✅ KASP AI Analytics Assistant is running!${NC}"
echo "========================================="
echo ""
echo -e "${BLUE}Backend:${NC}  http://localhost:8000"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}API Docs:${NC} http://localhost:8000/docs"
echo ""
echo "========================================="
echo -e "${YELLOW}Demo Accounts:${NC}"
echo ""
echo "  Admin:   admin@kasp.com   / admin123"
echo "  Manager: manager@kasp.com / manager123"
echo "  Analyst: analyst@kasp.com / analyst123"
echo "  Viewer:  viewer@kasp.com  / viewer123"
echo ""
echo "========================================="
echo -e "${GREEN}Press Ctrl+C to stop all servers${NC}"
echo "========================================="
echo ""

# Wait for user interrupt
trap "echo ''; echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT
wait
