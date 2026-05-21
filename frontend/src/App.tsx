import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'
import Placeholder from './pages/Placeholder'
import MainPage from './pages/MainPage'

// ─── Placeholder ────────────────────────────────────────

function PlaceholderPage({ name }: { name: string }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      fontFamily: 'inherit',
      fontSize: 14,
    }}>
      {name} — em construção
    </div>
  )
}

// ─── Rota protegida ─────────────────────────────────────

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore(s => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

// ─── App ────────────────────────────────────────────────

export default function App() {
  return (
    <Routes>

      {/* ── Públicas ── */}
      <Route path="/"       element={<Landing />} />
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ── Protegidas ── */}
      <Route path="/home" element={
        <PrivateRoute><MainPage /></PrivateRoute>
      } />
      <Route path="/room/:id" element={
        <PrivateRoute><PlaceholderPage name="Room" /></PrivateRoute>
      } />
      <Route path="/dm/:username" element={
        <PrivateRoute><PlaceholderPage name="DM" /></PrivateRoute>
      } />
      <Route path="/profile/:username" element={
        <PrivateRoute><PlaceholderPage name="Profile" /></PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute><Settings /></PrivateRoute>
      } />
      <Route path="/test" element={
        <PrivateRoute><Placeholder /></PrivateRoute>
      } />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}