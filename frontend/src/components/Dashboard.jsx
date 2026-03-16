import { useState, useEffect } from 'react'
import { 
  MessageSquare, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
  Plus,
  Clock
} from 'lucide-react'
import ChatInterface from './ChatInterface'
import Analytics from './Analytics'
import UserManagement from './UserManagement'
import SettingsPanel from './SettingsPanel'
import axios from 'axios'
import './Dashboard.css'

const Dashboard = ({ user, token, onLogout, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('chat')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [stats, setStats] = useState(null)
  const [chatKey, setChatKey] = useState(0)

  useEffect(() => {
    fetchConversations()
    fetchStats()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setConversations(response.data)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats/overview', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleNewChat = () => {
    setCurrentConversation(null)
    setChatKey(prev => prev + 1)
    setActiveTab('chat')
  }

  const handleUpdate = () => {
    fetchConversations()
    fetchStats()
  }

  const handleConversationSelect = (conv) => {
    setCurrentConversation(conv)
    setActiveTab('chat')
  }

  const getRoleBadgeClass = (role) => {
    return `badge badge-${role.toLowerCase()}`
  }

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ...(user.role === 'admin' ? [{ id: 'users', label: 'Users', icon: Users }] : []),
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-icon-small">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gradient1)" />
                <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="url(#gradient2)" />
                <defs>
                  <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="12">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="2" y1="12" x2="22" y2="22">
                    <stop offset="0%" stopColor="#f093fb" />
                    <stop offset="100%" stopColor="#f5576c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {sidebarOpen && (
              <div className="logo-text">
                <h2>KASP</h2>
                <span>Analytics AI</span>
              </div>
            )}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="sidebar-content">
          {/* New Chat Button */}
          {activeTab === 'chat' && (
            <button className="new-chat-btn" onClick={handleNewChat}>
              <Plus size={20} />
              {sidebarOpen && <span>New Chat</span>}
            </button>
          )}

          {/* Navigation Tabs */}
          <nav className="sidebar-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={20} />
                {sidebarOpen && <span>{tab.label}</span>}
              </button>
            ))}
          </nav>

          {/* Recent Conversations */}
          {activeTab === 'chat' && sidebarOpen && conversations.length > 0 && (
            <div className="recent-conversations">
              <h3 className="section-title">Recent Chats</h3>
              <div className="conversation-list">
                {conversations.slice(0, 5).map(conv => (
                  <button
                    key={conv.id}
                    className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => handleConversationSelect(conv)}
                  >
                    <MessageSquare size={16} />
                    <div className="conversation-info">
                      <span className="conversation-title">{conv.title}</span>
                      <span className="conversation-time">
                        <Clock size={12} />
                        {new Date(conv.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <div className="sidebar-footer">
          {sidebarOpen && stats && (
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-label">Conversations</span>
                <span className="stat-value">{stats.total_conversations}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Messages</span>
                <span className="stat-value">{stats.total_messages}</span>
              </div>
            </div>
          )}
          <div className="user-profile">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className={getRoleBadgeClass(user.role)}>
                  {user.role}
                </span>
              </div>
            )}
          </div>
          <div className="profile-actions">
            <button 
              className="icon-btn" 
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button 
              className="icon-btn logout-btn" 
              onClick={onLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          {activeTab === 'chat' && (
            <ChatInterface 
              key={chatKey}
              user={user} 
              token={token}
              conversation={currentConversation}
              onNewConversation={handleUpdate}
            />
          )}
          {activeTab === 'analytics' && (
            <Analytics user={user} token={token} />
          )}
          {activeTab === 'users' && user.role === 'admin' && (
            <UserManagement user={user} token={token} />
          )}
          {activeTab === 'settings' && (
            <SettingsPanel user={user} token={token} />
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
