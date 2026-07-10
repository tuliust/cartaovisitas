import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PublicCardPage from './pages/PublicCardPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminCardsPage from './pages/admin/AdminCardsPage'
import AdminCardFormPage from './pages/admin/AdminCardFormPage'
import EmployeeLoginPage from './pages/EmployeeLoginPage'
import RegisterPage from './pages/RegisterPage'
import MyCardRedirectPage from './pages/MyCardRedirectPage'
import MyCardEditPage from './pages/MyCardEditPage'
import PasswordResetRequestPage from './pages/PasswordResetRequestPage'
import PasswordUpdatePage from './pages/PasswordUpdatePage'
import AdminBrandSettingsPage from './pages/admin/AdminBrandSettingsPage'
import { BrandSettingsProvider } from './contexts/BrandSettingsProvider'

function App() {
  return (
    <BrandSettingsProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/entrar" element={<EmployeeLoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/meu-cartao" element={<MyCardRedirectPage />} />
        <Route path="/meu-cartao/editar" element={<MyCardEditPage />} />
        <Route path="/recuperar-senha" element={<PasswordResetRequestPage />} />
        <Route path="/definir-senha" element={<PasswordUpdatePage />} />

        <Route path="/admin" element={<Navigate to="/admin/cartoes" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/cartoes" element={<AdminCardsPage />} />
        <Route path="/admin/cartoes/novo" element={<AdminCardFormPage />} />
        <Route path="/admin/cartoes/:id/editar" element={<AdminCardFormPage />} />
        <Route path="/admin/configuracoes" element={<AdminBrandSettingsPage />} />

        <Route path="/:slug" element={<PublicCardPage />} />
      </Routes>
    </BrowserRouter>
    </BrandSettingsProvider>
  )
}

export default App
