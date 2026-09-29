import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'

const API = 'http://localhost:5000/api'

const getIcon = (name) => {
  const ext = name.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️'
  if (ext === 'pdf') return '📕'
  if (['txt', 'md', 'doc', 'docx'].includes(ext)) return '📄'
  return '📁'
}

function Files() {
  const { getToken } = useAuth()
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [inputKey, setInputKey] = useState(0)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const authHeader = async () => ({
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  const showError = (err) => setError(err.response?.data?.error || err.message)

  const loadFiles = async (searchTerm = '') => {
    try {
      const url = searchTerm
        ? `${API}/files?search=${encodeURIComponent(searchTerm)}`
        : `${API}/files`
      const res = await axios.get(url, await authHeader())
      setFiles(res.data)
      setError('')
    } catch (err) {
      showError(err)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  useEffect(() => {
    const delay = setTimeout(() => {
      loadFiles(search)
    }, 400)
    return () => clearTimeout(delay)
  }, [search])

  const uploadFile = async () => {
    if (!selectedFile) return
    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      await axios.post(`${API}/files/upload`, formData, await authHeader())
      setSelectedFile(null)
      setInputKey((k) => k + 1)
      loadFiles(search)
    } catch (err) {
      showError(err)
    }
  }

  const downloadFile = async (id) => {
    try {
      const res = await axios.get(`${API}/files/download/${id}`, await authHeader())
      window.open(res.data.url, '_blank')
    } catch (err) {
      showError(err)
    }
  }

  const deleteFile = async (id) => {
    try {
      await axios.delete(`${API}/files/${id}`, await authHeader())
      loadFiles(search)
    } catch (err) {
      showError(err)
    }
  }

  const renameFile = async (id, oldName) => {
    const newName = prompt('New file name:', oldName)
    if (!newName || !newName.trim()) return
    try {
      await axios.put(`${API}/files/${id}`, { file_name: newName }, await authHeader())
      loadFiles(search)
    } catch (err) {
      showError(err)
    }
  }

  return (
    <div>
      <h2>My Files</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search files..."
      />

      <div>
        <input
          key={inputKey}
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />
        <button onClick={uploadFile}>Upload</button>
      </div>

      <ul className="file-list">
      {files.map((f) => (
      <li key={f.id} className="file-item">
      <span className="file-icon">{getIcon(f.file_name)}</span>
      <div className="file-info">
        <div className="file-name">{f.file_name}</div>
        <div className="file-size">{(f.file_size / 1024).toFixed(1)} KB</div>
      </div>
      <div className="file-actions">
        <button onClick={() => renameFile(f.id, f.file_name)}>Rename</button>
        <button onClick={() => downloadFile(f.id)}>Download</button>
        <button className="danger" onClick={() => deleteFile(f.id)}>Delete</button>
      </div>
      </li>
      ))}
    </ul>
    </div>
  )
}

export default Files