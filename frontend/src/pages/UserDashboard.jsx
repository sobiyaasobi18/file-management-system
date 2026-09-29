import { lazy, Suspense } from 'react'
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom'
import '../styles.css'

const Folders = lazy(() => import('../components/Folders.jsx'))
const Files = lazy(() => import('../components/Files.jsx'))
const Credentials = lazy(() => import('../components/Credentials.jsx'))
const Profile = lazy(() => import('../components/Profile.jsx'))

const tabs = [
  ['folders', 'Folders'],
  ['files', 'Files'],
  ['credentials', 'Credentials'],
  ['profile', 'Profile'],
]

function UserDashboard() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="layout">
      <div className="sidebar">
        <h3>Digital Vault</h3>
        {tabs.map(([path, label]) => (
          <button
            key={path}
            className={pathname === `/${path}` ? 'active' : ''}
            onClick={() => navigate(`/${path}`)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="main">
        <h1>My Vault</h1>
        <div className="card">
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path="folders" element={<Folders />} />
              <Route path="files" element={<Files />} />
              <Route path="credentials" element={<Credentials />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/folders" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard