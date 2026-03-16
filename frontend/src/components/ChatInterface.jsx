import { useState, useEffect, useRef } from 'react'
import { Send, Loader, Sparkles, TrendingUp, Users as UsersIcon, DollarSign, BarChart } from 'lucide-react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import './ChatInterface.css'

const ChatInterface = ({ user, token, conversation, onNewConversation }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(conversation?.id || null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages || [])
      setConversationId(conversation.id)
    } else {
      setMessages([])
      setConversationId(null)
    }
  }, [conversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('/api/chat', {
        content: input,
        conversation_id: conversationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp
      }

      setMessages(prev => [...prev, aiMessage])
      
      if (!conversationId) {
        setConversationId(response.data.conversation_id)
      }
      onNewConversation()
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickPrompts = [
    {
      icon: TrendingUp,
      text: 'Show me Q1 2025 sales performance',
      prompt: 'What are the Q1 2025 sales results by region?'
    },
    {
      icon: DollarSign,
      text: 'Top performing products',
      prompt: 'Which products are performing best in terms of revenue and margin?'
    },
    {
      icon: UsersIcon,
      text: 'Customer metrics overview',
      prompt: 'What are the key customer metrics including churn and retention rates?'
    },
    {
      icon: BarChart,
      text: 'Performance KPIs',
      prompt: 'Show me the current performance KPIs and target achievement'
    }
  ]

  const handleQuickPrompt = (prompt) => {
    setInput(prompt)
  }

  return (
    <div className="chat-interface">
      {messages.length === 0 ? (
        <div className="chat-welcome">
          <div className="welcome-header">
            <div className="welcome-icon">
              <Sparkles size={48} />
            </div>
            <h1>Welcome to KASP Analytics AI</h1>
            <p>Your intelligent analytics assistant powered by advanced AI</p>
            <div className="user-greeting">
              <span>Logged in as <strong>{user.name}</strong></span>
              <span className={`badge badge-${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="quick-prompts">
            <h3>Quick Start</h3>
            <div className="prompt-grid">
              {quickPrompts.map((item, index) => (
                <button
                  key={index}
                  className="prompt-card"
                  onClick={() => handleQuickPrompt(item.prompt)}
                >
                  <item.icon size={24} />
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="capabilities">
            <h3>What I Can Do</h3>
            <div className="capability-list">
              <div className="capability-item">
                <BarChart size={20} />
                <div>
                  <strong>Sales Analytics</strong>
                  <p>Analyze revenue, growth trends, and regional performance</p>
                </div>
              </div>
              <div className="capability-item">
                <DollarSign size={20} />
                <div>
                  <strong>Product Insights</strong>
                  <p>Track product performance, margins, and market positioning</p>
                </div>
              </div>
              <div className="capability-item">
                <UsersIcon size={20} />
                <div>
                  <strong>Customer Metrics</strong>
                  <p>Monitor churn, retention, satisfaction, and contract values</p>
                </div>
              </div>
              <div className="capability-item">
                <TrendingUp size={20} />
                <div>
                  <strong>KPI Tracking</strong>
                  <p>View real-time KPIs, targets, and performance indicators</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role} ${message.error ? 'error' : ''}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <Sparkles size={20} />
                )}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-author">
                    {message.role === 'user' ? user.name : 'KASP AI Assistant'}
                  </span>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="message-text">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant loading">
              <div className="message-avatar">
                <Loader className="spinning" size={20} />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-author">KASP AI Assistant</span>
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            placeholder="Ask me anything about your analytics data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            disabled={loading}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <Loader className="spinning" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        <p className="input-hint">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

export default ChatInterface
