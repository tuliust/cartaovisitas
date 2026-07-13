import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
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
import ToastProvider from './components/ToastProvider'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminAuditPage from './pages/admin/AdminAuditPage'
import { VisualModeProvider } from './contexts/VisualModeProvider'
import { useBrandSettings } from './contexts/BrandSettingsContext'
import { CollaboratorProvider } from './contexts/CollaboratorProvider'
import MyCardGuidePage from './pages/MyCardGuidePage'
import MyCardEmailSignaturePage from './pages/MyCardEmailSignaturePage'
import MyCardAnalyticsPage from './pages/MyCardAnalyticsPage'
import TermsAndPrivacyPage from './pages/TermsAndPrivacyPage'

function PrivateCollaboratorRoutes() { return <CollaboratorProvider><Outlet /></CollaboratorProvider> }

function ResolvedApplication() {
  const { status } = useBrandSettings()
  if (status === 'loading') return <main className="brand-loading-shell"><div className="brand-loading-placeholder" role="status"><span className="sr-only">Carregando configurações...</span></div></main>
  return (
    <VisualModeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/entrar" element={<EmployeeLoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<PasswordResetRequestPage />} />
        <Route path="/definir-senha" element={<PasswordUpdatePage />} />
        <Route path="/termos-de-uso-e-privacidade" element={<CollaboratorProvider required={false}><TermsAndPrivacyPage /></CollaboratorProvider>} />

        <Route element={<PrivateCollaboratorRoutes />}>
          <Route path="/meu-cartao" element={<MyCardRedirectPage />} />
          <Route path="/meu-cartao/editar" element={<MyCardEditPage />} />
          <Route path="/meu-cartao/guia" element={<MyCardGuidePage />} />
          <Route path="/meu-cartao/assinatura-de-email" element={<MyCardEmailSignaturePage />} />
          <Route path="/meu-cartao/estatisticas" element={<MyCardAnalyticsPage />} />
          <Route path="/:slug" element={<PublicCardPage />} />
        </Route>

        <Route path="/admin" element={<Navigate to="/admin/cartoes" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/cartoes" element={<AdminCardsPage />} />
        <Route path="/admin/cartoes/novo" element={<AdminCardFormPage />} />
        <Route path="/admin/cartoes/:id/editar" element={<AdminCardFormPage />} />
        <Route path="/admin/configuracoes" element={<AdminBrandSettingsPage />} />
        <Route path="/admin/usuarios" element={<AdminUsersPage />} />
        <Route path="/admin/auditoria" element={<AdminAuditPage />} />

          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </VisualModeProvider>
  )
}

function App() {
  return (
    <BrandSettingsProvider>
      <ResolvedApplication />
    </BrandSettingsProvider>
  )
}

export default App
