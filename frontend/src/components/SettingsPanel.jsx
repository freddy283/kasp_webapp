import { Settings, User, Bell, Shield, Database } from 'lucide-react'
import './SettingsPanel.css'

const SettingsPanel = ({ user, token }) => {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-header">
            <User size={24} />
            <h3>Profile Information</h3>
          </div>
          <div className="settings-card-content">
            <div className="setting-item">
              <label>Name</label>
              <input type="text" className="input" value={user.name} readOnly />
            </div>
            <div className="setting-item">
              <label>Email</label>
              <input type="email" className="input" value={user.email} readOnly />
            </div>
            <div className="setting-item">
              <label>Role</label>
              <div className={`badge badge-${user.role.toLowerCase()}`}>
                {user.role}
              </div>
            </div>
            <div className="setting-item">
              <label>Department</label>
              <input type="text" className="input" value={user.department} readOnly />
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Bell size={24} />
            <h3>Notifications</h3>
          </div>
          <div className="settings-card-content">
            <div className="setting-toggle">
              <div>
                <strong>Email Notifications</strong>
                <p>Receive updates via email</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-toggle">
              <div>
                <strong>Analytics Alerts</strong>
                <p>Get notified about important metrics</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-toggle">
              <div>
                <strong>Weekly Reports</strong>
                <p>Receive weekly summary reports</p>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Shield size={24} />
            <h3>Security</h3>
          </div>
          <div className="settings-card-content">
            <div className="setting-item">
              <label>Change Password</label>
              <button className="btn btn-secondary">Update Password</button>
            </div>
            <div className="setting-item">
              <label>Two-Factor Authentication</label>
              <button className="btn btn-secondary">Enable 2FA</button>
            </div>
            <div className="setting-item">
              <label>Active Sessions</label>
              <p className="setting-description">1 active session</p>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <Database size={24} />
            <h3>Data & Privacy</h3>
          </div>
          <div className="settings-card-content">
            <div className="setting-item">
              <label>Export My Data</label>
              <button className="btn btn-secondary">Download Data</button>
            </div>
            <div className="setting-item">
              <label>Conversation History</label>
              <button className="btn btn-secondary">Clear History</button>
            </div>
            <div className="setting-toggle">
              <div>
                <strong>Analytics Tracking</strong>
                <p>Help improve the platform</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="system-info">
        <h3>System Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Version</span>
            <span className="info-value">1.0.0</span>
          </div>
          <div className="info-item">
            <span className="info-label">Database</span>
            <span className="info-value">Oracle 23ai</span>
          </div>
          <div className="info-item">
            <span className="info-label">Backend</span>
            <span className="info-value">FastAPI</span>
          </div>
          <div className="info-item">
            <span className="info-label">Frontend</span>
            <span className="info-value">React 18</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
