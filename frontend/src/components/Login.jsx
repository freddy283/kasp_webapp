import { useState } from 'react'
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import './Login.css'

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const demoUsers = [
    { email: 'admin@kasp.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@kasp.com', password: 'manager123', role: 'Manager' },
    { email: 'analyst@kasp.com', password: 'analyst123', role: 'Analyst' },
    { email: 'viewer@kasp.com', password: 'viewer123', role: 'Viewer' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', {
        email: email.toLowerCase(),
        password
      })

      const { access_token, user } = response.data
      onLogin(user, access_token)
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">
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
              <div>
                <h1 className="logo-title">KASP Analytics</h1>
                <p className="logo-subtitle">AI-Powered Business Intelligence</p>
              </div>
            </div>
            <p className="login-description">
              Enterprise on-premise analytics platform with role-based access control
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="demo-section">
            <div className="demo-divider">
              <span>Demo Accounts</span>
            </div>
            <div className="demo-users">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  className="demo-user-btn"
                  onClick={() => quickLogin(user.email, user.password)}
                >
                  <div className={`role-badge badge-${user.role.toLowerCase()}`}>
                    {user.role}
                  </div>
                  <span className="demo-email">{user.email}</span>
                </button>
              ))}
            </div>
            <p className="demo-note">
              Click any demo account to auto-fill credentials
            </p>
          </div>
        </div>

        <div className="login-footer">
          <p>© 2026 KASP Analytics. Enterprise On-Premise Solution.</p>
          <p className="version-info">Version 1.0.0</p>
        </div>
      </div>
    </div>
  )
}

export default Login
