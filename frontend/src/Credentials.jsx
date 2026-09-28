import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'

const API = 'http://localhost:5000/api'

function Credentials() {
  const { getToken } = useAuth()
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [secret, setSecret] = useState('')
  const [visibleId, setVisibleId] = useState(null)
  const [error, setError] = useState('')

  const authHeader = async () => ({
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  const showError = (err) => setError(err.response?.data?.error || err.message)

  const loadItems = async () => {
    try {
      const res = await axios.get(`${API}/credentials`, await authHeader())
      setItems(res.data)
      setError('')
    } catch (err) {
      showError(err)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const addItem = async () => {
    if (!title.trim() || !secret.trim()) return
    try {
      await axios.post(
        `${API}/credentials`,
        { title, secret_value: secret },
        await authHeader()
      )
      setTitle('')
      setSecret('')
      loadItems()
    } catch (err) {
      showError(err)
    }
  }

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API}/credentials/${id}`, await authHeader())
      loadItems()
    } catch (err) {
      showError(err)
    }
  }

  return (
    <div>
      <h2>My Credentials</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (e.g. Gmail)"
      />{' '}
      <input
        type="password"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        placeholder="Secret"
      />{' '}
      <button onClick={addItem}>Add</button>

      <ul>
        {items.map((c) => (
          <li key={c.id}>
            {c.title}:{' '}
            {visibleId === c.id ? c.secret_value : '••••••••'}{' '}
            <button onClick={() => setVisibleId(visibleId === c.id ? null : c.id)}>
              {visibleId === c.id ? 'Hide' : 'Show'}
            </button>{' '}
            <button onClick={() => deleteItem(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Credentials