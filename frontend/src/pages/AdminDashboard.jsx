import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'
import '../styles.css'

const API = 'http://localhost:5000/api'

function AdminDashboard() {
  const { getToken } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        const headers = { Authorization: `Bearer ${token}` }
        const [statsRes, usersRes] = await Promise.all([
          axios.get(`${API}/admin/stats`, { headers }),
          axios.get(`${API}/admin/users`, { headers }),
        ])
        setStats(statsRes.data)
        setUsers(usersRes.data)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      }
    }
    load()
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

      <h2 className="mt-4">Users</h2>
      <div className="table-responsive">
        <table className="table table-striped">
     <thead>
       <tr>
         <th>Name</th>
         <th>Email</th>
         <th>Role</th>
       </tr>
     </thead>
     <tbody>
       {users.map((u) => (
         <tr key={u.id}>
           <td>{u.full_name}</td>
           <td>{u.email}</td>
           <td>{u.role}</td>
         </tr>
       ))}
     </tbody>
        </table>
      </div>
    </div>
  </div>
  )
}

export default AdminDashboard