import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth, useUser, SignIn, UserButton } from '@clerk/react'
import Folders from './Folders.jsx'
import Files from './Files.jsx'
import Credentials from './Credentials.jsx'

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()
  const [message, setMessage] = useState('')

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
        setMessage('Profile saved: ' + res.data[0].id)
      } catch (err) {
        setMessage('Error: ' + (err.response?.data?.error || err.message))
      }
    }

    saveProfile()
  }, [isSignedIn, user, getToken])

  if (!isLoaded) return <p>Loading...</p>
  if (!isSignedIn) return <SignIn />

  return (
    <div>
      <UserButton />
      <h1>Personal Digital Vault</h1>
      <p>{message}</p>
      <Folders />
      <Files />
      <Credentials />

    </div>
  )
}

export default App