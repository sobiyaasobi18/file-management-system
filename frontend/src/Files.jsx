import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/react'

const API = 'http://localhost:5000/api'

function Files() {
  const { getToken } = useAuth()
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [inputKey, setInputKey] = useState(0)
  const [error, setError] = useState('')

  const authHeader = async () => ({
    headers: { Authorization: `Bearer ${await getToken()}` },
  })

  const showError = (err) => setError(err.response?.data?.error || err.message)

  const loadFiles = async () => {
    try {
      const res = await axios.get(`${API}/files`, await authHeader())
      setFiles(res.data)
      setError('')
    } catch (err) {
      showError(err)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  const uploadFile = async () => {
    if (!selectedFile) return
    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      await axios.post(`${API}/files/upload`, formData, await authHeader())
      setSelectedFile(null)
      setInputKey((k) => k + 1)
      loadFiles()
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
      loadFiles()
    } catch (err) {
      showError(err)
    }
  }

  return (
    <div>
      <h2>My Files</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        key={inputKey}
        type="file"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <button onClick={uploadFile}>Upload</button>

      <ul>
        {files.map((f) => (
          <li key={f.id}>
            {f.file_name} ({(f.file_size / 1024).toFixed(1)} KB){' '}
            <button onClick={() => downloadFile(f.id)}>Download</button>{' '}
            <button onClick={() => deleteFile(f.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Files