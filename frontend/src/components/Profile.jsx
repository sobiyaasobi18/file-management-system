import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'
import { useForm } from 'react-hook-form'

const API = 'http://localhost:5000/api'

function Profile() {
  const { getToken } = useAuth()
  const [profile, setProfile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { full_name: '' } })

  const authHeader = async () => ({
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  const showError = (err) => setError(err.response?.data?.error || err.message)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(`${API}/profile`, await authHeader())
        setProfile(res.data)
        reset({ full_name: res.data.full_name || '' })
      } catch (err) {
        showError(err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const onSubmit = async ({ full_name }) => {
    setMessage('')
    setError('')
    try {
      await axios.put(`${API}/profile`, { full_name }, await authHeader())
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <p>
            <label>Full name</label><br />
            <input
              {...register('full_name', {
                validate: (v) => v.trim() !== '' || 'Full name is required',
                maxLength: { value: 100, message: 'Max 100 characters' },
              })}
            />
            {errors.full_name && (
              <span style={{ color: 'red', display: 'block' }}>
                {errors.full_name.message}
              </span>
            )}
          </p>
          <p>
            <label>Email</label><br />
            <input value={profile.email || ''} disabled />
          </p>
          <p>
            <label>Role</label><br />
            <input value={profile.role || ''} disabled />
          </p>
          <button type="submit" disabled={isSubmitting}>Save</button>
        </form>
      )}
    </div>
  )
}

export default Profile