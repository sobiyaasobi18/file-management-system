import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'

const API = 'http://localhost:5000/api'

function Credentials() {
  const { getToken } = useAuth()
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [secret, setSecret] = useState('')
  const [revealed, setRevealed] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const addItem = async () => {
    if (!title.trim() || !secret) return
    try {
      await axios.post(`${API}/credentials`, { title, secret_value: secret }, await authHeader())
      setTitle('')
      setSecret('')
      loadItems()
    } catch (err) {
      showError(err)
    }
  }

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this credential?')) return
    try {
      await axios.delete(`${API}/credentials/${id}`, await authHeader())
      loadItems()
    } catch (err) {
      showError(err)
    }
  }

  const toggleReveal = (id) =>
    setRevealed((r) => ({ ...r, [id]: !r[id] }))

  return (
    <div>
      <h2>My Credentials</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
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
      </div>

      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && <p className="empty">No credentials yet.</p>}

      <ul>
     {items.map((c) => (
       <li key={c.id}>
         {c.title}: {revealed[c.id] ? c.secret_value : '••••••••'}{' '}
         <button onClick={() => toggleReveal(c.id)}>
           {revealed[c.id] ? 'Hide' : 'Show'}
         </button>{' '}
         <button className="danger" onClick={() => deleteItem(c.id)}>Delete</button>
       </li>
     ))}
   </ul>
 </div>
  )
}

export default Credentials