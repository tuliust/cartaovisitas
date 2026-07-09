import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PublicCardPage from './pages/PublicCardPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminCardsPage from './pages/admin/AdminCardsPage'
import AdminCardFormPage from './pages/admin/AdminCardFormPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/admin" element={<Navigate to="/admin/cartoes" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/cartoes" element={<AdminCardsPage />} />
        <Route path="/admin/cartoes/novo" element={<AdminCardFormPage />} />
        <Route path="/admin/cartoes/:id/editar" element={<AdminCardFormPage />} />

        <Route path="/:slug" element={<PublicCardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App