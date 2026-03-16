import { useState, useEffect } from 'react'
import { Users, UserPlus, Edit2, Shield } from 'lucide-react'
import axios from 'axios'
import './UserManagement.css'

const UserManagement = ({ user, token }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeClass = (role) => {
    return `badge badge-${role.toLowerCase()}`
  }

  const getRoleIcon = (role) => {
    const iconProps = { size: 16 }
    switch(role) {
      case 'admin': return <Shield {...iconProps} />
      default: return <Users {...iconProps} />
    }
  }

  if (loading) {
    return (
      <div className="user-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    )
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div>
          <h1>User Management</h1>
          <p>Manage user accounts and role-based permissions</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <Shield size={24} />
          <div>
            <span className="stat-value">
              {users.filter(u => u.role === 'admin').length}
            </span>
            <span className="stat-label">Administrators</span>
          </div>
        </div>
      </div>

      <div className="users-table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Member Since</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <strong>{u.name}</strong>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={getRoleBadgeClass(u.role)}>
                    {getRoleIcon(u.role)}
                    {u.role}
                  </span>
                </td>
                <td>{u.department}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <button className="icon-btn" title="Edit user">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="role-permissions">
        <h3>Role Permissions</h3>
        <div className="permissions-grid">
          <div className="permission-card">
            <h4><Shield size={18} /> Admin</h4>
            <ul>
              <li>Full system access</li>
              <li>User management</li>
              <li>Configuration settings</li>
              <li>Export all data</li>
            </ul>
          </div>
          <div className="permission-card">
            <h4><Users size={18} /> Manager</h4>
            <ul>
              <li>View all analytics</li>
              <li>Export reports</li>
              <li>Modify dashboards</li>
            </ul>
          </div>
          <div className="permission-card">
            <h4><Users size={18} /> Analyst</h4>
            <ul>
              <li>View analytics</li>
              <li>Create reports</li>
              <li>Query data</li>
            </ul>
          </div>
          <div className="permission-card">
            <h4><Users size={18} /> Viewer</h4>
            <ul>
              <li>View dashboards</li>
              <li>Read-only access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
