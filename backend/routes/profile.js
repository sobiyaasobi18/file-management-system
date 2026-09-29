import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'

const API = 'http://localhost:5000/api'

function Profile() {
  const { getToken } = useAuth()
  const [profile, setProfile] = useState(null)
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const authHeader = async () => ({
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  const showError = (err) => setError(err.response?.data?.error || err.message)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API}/profile`, await authHeader())
        setProfile(res.data)
        setFullName(res.data.full_name || '')
      } catch (err) {
        showError(err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const saveProfile = async () => {
    setMessage('')
    setError('')
    try {
      await axios.put(`${API}/profile`, { full_name: fullName }, await authHeader())
      setMessage('Saved')
    } catch (err) {
      showError(err)
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2>My Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {profile && (
        <div>
          <p>
            <label>Full name</label><br />
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </p>
          <p>
            <label>Email</label><br />
            <input value={profile.email || ''} disabled />
          </p>
          <p>
            <label>Role</label><br />
            <input value={profile.role || ''} disabled />
          </p>
          <button onClick={saveProfile}>Save</button>
        </div>
      )}
    </div>
  )
}

export default Profile;