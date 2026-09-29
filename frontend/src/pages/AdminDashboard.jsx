import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'
import '../styles.css'

const API = 'http://localhost:5000/api'

function AdminDashboard() {
  const { getToken } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = await getToken()
        const res = await axios.get(`${API}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(res.data)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      }
    }
    loadStats()
  }, [getToken])

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!stats) return <p>Loading...</p>

  return (
    <div className="layout">
      <div className="sidebar">
        <h3>Digital Vault</h3>
        <button className="active">Dashboard</button>
      </div>

      <div className="main">
       <h1>Admin Dashboard</h1>
   <div className="stat-grid">
     <div className="stat-card">
       <div className="stat-label">Total Users</div>
       <div className="stat-value">{stats.userCount}</div>
     </div>
     <div className="stat-card">
       <div className="stat-label">Total Storage</div>
       <div className="stat-value">
         {(stats.totalStorage / 1024 / 1024).toFixed(2)} MB
       </div>
     </div>
     <div className="stat-card">
       <div className="stat-label">Total Uploads</div>
       <div className="stat-value">{stats.uploadCount}</div>
     </div>
   </div>
     </div>
   </div>
  )
}

export default AdminDashboard