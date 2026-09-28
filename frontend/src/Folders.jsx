import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'

const API = 'http://localhost:5000/api'

function Folders() {
  const { getToken } = useAuth()
  const [folders, setFolders] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const authHeader = async () => ({
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  const loadFolders = async () => {
    try {
      const res = await axios.get(`${API}/folders`, await authHeader())
      setFolders(res.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  useEffect(() => {
    loadFolders()
  }, [])

  const createFolder = async () => {
    if (!name.trim()) return
    try {
      await axios.post(`${API}/folders`, { name }, await authHeader())
      setName('')
      loadFolders()
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  const deleteFolder = async (id) => {
    try {
      await axios.delete(`${API}/folders/${id}`, await authHeader())
      loadFolders()
    } catch (err) {
      setError(err.response?.data?.error || err.message)
    }
  }

  return (
    <div>
      <h2>My Folders</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New folder name"
      />
      <button onClick={createFolder}>Create</button>

      <ul>
        {folders.map((f) => (
          <li key={f.id}>
            {f.name} <button onClick={() => deleteFolder(f.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Folders