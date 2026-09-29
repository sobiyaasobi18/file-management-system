import { useEffect, useState, lazy, Suspense } from 'react'
import axios from 'axios'
import { useAuth, useUser, SignIn, UserButton } from '@clerk/react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'

const UserDashboard = lazy(() => import('./pages/UserDashboard.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const [role, setRole] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isSignedIn || !user) return

    const saveProfile = async () => {
      try {
        const token = await getToken()
        const res = await axios.post(
          'http://localhost:5000/api/profile',
          {
            full_name: user.fullName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setRole(res.data[0].role)
      } catch (err) {
        setError(err.response?.data?.error || err.message)
      }
    }

    saveProfile()
  }, [isSignedIn, user, getToken])

  if (!isLoaded) return <p>Loading...</p>
  if (!isSignedIn) return <SignIn />
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!role) return <p>Loading profile...</p>

  return (
    <div>
      <div className="user-corner">
        <UserButton />
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route
            path="/admin"
            element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/folders" replace />}
          />
          <Route
            path="/*"
            element={role === 'admin' ? <Navigate to="/admin" replace /> : <UserDashboard />}
          />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App