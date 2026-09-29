import { useState } from 'react'
import '../styles.css'
import Folders from '../components/Folders.jsx'
import Files from '../components/Files.jsx'
import Credentials from '../components/Credentials.jsx'

function UserDashboard() {
  const [tab, setTab] = useState('folders')

  return (
    <div className="layout">
      <div className="sidebar">
        <h3>Digital Vault</h3>
        <button
          className={tab === 'folders' ? 'active' : ''}
          onClick={() => setTab('folders')}
        >
          Folders
        </button>
        <button
          className={tab === 'files' ? 'active' : ''}
          onClick={() => setTab('files')}
        >
          Files
        </button>
        <button
          className={tab === 'credentials' ? 'active' : ''}
          onClick={() => setTab('credentials')}
        >
          Credentials
        </button>
      </div>

    <div className="main">
      <h1>My Vault</h1>
      <div className="card">
        {tab === 'folders' && <Folders />}
        {tab === 'files' && <Files />}
        {tab === 'credentials' && <Credentials />}
      </div>
    </div>
    </div>
  )
}

export default UserDashboard