import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth, useUser, SignIn, UserButton } from '@clerk/react'
import UserDashboard from './pages/UserDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import './styles.css'
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
    {role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
  </div>
)
}

export default App