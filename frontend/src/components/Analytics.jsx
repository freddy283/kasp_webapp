import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, Users, Target, Download } from 'lucide-react'
import axios from 'axios'
import './Analytics.css'

const Analytics = ({ user, token }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics/data', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="analytics-error">
        <p>Failed to load analytics data</p>
      </div>
    )
  }

  const kpis = data.performance_kpis || {}
  const customerMetrics = data.customer_metrics || {}

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c']

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Real-time business intelligence and performance metrics</p>
        </div>
        <button className="btn btn-primary">
          <Download size={20} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Revenue YTD</span>
            <span className="kpi-value">${(kpis.revenue_ytd / 1000000).toFixed(1)}M</span>
            <span className="kpi-change positive">+12.3% vs last year</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <Target size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Target Achievement</span>
            <span className="kpi-value">{kpis.target_achievement}</span>
            <span className="kpi-change positive">Above target</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <Users size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Active Customers</span>
            <span className="kpi-value">{customerMetrics.active_subscriptions?.toLocaleString()}</span>
            <span className="kpi-change positive">Renewal: {customerMetrics.renewal_rate}</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">NPS Score</span>
            <span className="kpi-value">{kpis.nps_score}</span>
            <span className="kpi-change positive">Excellent</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {data.sales_summary && (
          <div className="chart-card">
            <h3>Regional Sales Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.sales_summary}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="region" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="q1_2025" fill="#667eea" name="Q1 2025" />
                <Bar dataKey="q4_2024" fill="#764ba2" name="Q4 2024" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.top_products && (
          <div className="chart-card">
            <h3>Top Products by Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.top_products}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.product.split(' ').slice(-1)[0]}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {data.top_products.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `$${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Product Table */}
      {data.top_products && (
        <div className="table-card">
          <h3>Product Performance Details</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Revenue</th>
                  <th>Units Sold</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {data.top_products.map((product, index) => (
                  <tr key={index}>
                    <td><strong>{product.product}</strong></td>
                    <td>${product.revenue.toLocaleString()}</td>
                    <td>{product.units.toLocaleString()}</td>
                    <td>
                      <span className="badge badge-success">{product.margin}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
