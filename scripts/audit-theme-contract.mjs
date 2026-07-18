import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const root = resolve(process.cwd())
const failures = []
const checks = []

function read(path) {
  const absolute = join(root, path)
  if (!existsSync(absolute)) {
    failures.push(`Arquivo obrigatório ausente: ${path}`)
    return ''
  }
  return readFileSync(absolute, 'utf8')
}

function requireFragments(label, content, fragments) {
  const missing = fragments.filter((fragment) => !content.includes(fragment))
  if (missing.length) failures.push(`${label}: faltam ${missing.join(', ')}`)
  else checks.push(label)
}

function walk(directory) {
  const absolute = join(root, directory)
  if (!existsSync(absolute)) return []
  return readdirSync(absolute).flatMap((entry) => {
    const path = join(absolute, entry)
    return statSync(path).isDirectory() ? walk(relative(root, path)) : [path]
  })
}

const variants = [
  'dark_black',
  'dark_image_1',
  'dark_image_2',
  'light_white',
  'light_image_3',
  'light_image_4',
]

const semanticTokens = [
  '--semantic-text',
  '--semantic-muted',
  '--semantic-subtle',
  '--semantic-surface',
  '--semantic-surface-solid',
  '--semantic-surface-raised',
  '--semantic-border',
  '--semantic-icon',
  '--semantic-input-bg',
  '--semantic-input-text',
  '--semantic-input-placeholder',
  '--semantic-header-bg',
  '--semantic-primary-base',
  '--semantic-primary-bg',
  '--semantic-primary-text',
  '--semantic-secondary-bg',
  '--semantic-secondary-text',
  '--semantic-auxiliary-bg',
  '--semantic-auxiliary-text',
  '--semantic-focus',
  '--semantic-modal-backdrop',
  '--semantic-danger',
  '--semantic-success',
  '--semantic-warning',
]

const brandSettings = read('src/lib/brandSettings.ts')
const visualVariants = read('src/lib/cardVisualVariants.ts')
const visualProvider = read('src/contexts/VisualModeProvider.tsx')
const brandProvider = read('src/contexts/BrandSettingsProvider.tsx')
const main = read('src/main.tsx')
const adminPreviewPage = read('src/pages/admin/AdminBrandSettingsPage.tsx')
const brandInterfacePreview = read('src/components/admin/BrandInterfacePreview.tsx')
const brandTemplateElements = read('src/lib/brandTemplateElements.ts')
const templateEditor = read('src/components/admin/TemplateOptionsEditor.tsx')
const employeeLogin = read('src/pages/EmployeeLoginPage.tsx')
const adminLogin = read('src/pages/admin/AdminLoginPage.tsx')
const homePage = read('src/pages/HomePage.tsx')
const managedPageView = read('src/components/ManagedPageView.tsx')
const publicCardPage = read('src/pages/PublicCardPage.tsx')
const signaturePage = read('src/pages/MyCardEmailSignaturePage.tsx')
const cardPreviewModal = read('src/components/admin/CardPreviewModal.tsx')
const publicCardDraftPreview = read('src/components/admin/PublicCardDraftPreview.tsx')
const collaboratorNavigation = read('src/components/collaborator/CollaboratorNavigation.tsx')
const collaboratorAccountMenu = read('src/components/collaborator/CollaboratorAccountMenu.tsx')
const tokenContract = read('src/brand-token-contract.css')
const tokenSpecificity = read('src/brand-token-specificity.css')
const tokenCoverage = read('src/brand-token-coverage.css')
const tokenAuth = read('src/brand-token-auth.css')
const adminBrandPreviewCss = read('src/admin-brand-settings-preview.css')
const mobileExperience = read('src/mobile-experience-overrides.css')
const mobileFollowup = read('src/mobile-experience-followup.css')
const mobilePolish = read('src/mobile-experience-polish.css')

requireFragments('Seis variantes no cadastro', brandSettings, variants)
requireFragments('Seis variantes no seletor', visualVariants, variants)
requireFragments('Gerador semântico completo', visualVariants, semanticTokens)
requireFragments('Aplicação global de tokens', visualProvider, [
  'getVariantSemanticTokens',
  "'--brand-background-image'",
  "'--admin-header-bg'",
  "'--modal-surface'",
  "'--visual-action-primary-bg'",
])
requireFragments('Sincronização entre abas', brandProvider, [
  'BRAND_SETTINGS_CACHE_KEY',
  "window.addEventListener('storage'",
  'normalizeBrandSettings',
])
requireFragments('CSS canônico carregado por último', main, [
  "import './brand-token-contract.css'",
  "import './brand-token-specificity.css'",
  "import './brand-token-coverage.css'",
  "import './brand-token-auth.css'",
  "import './admin-brand-settings-preview.css'",
  "import './mobile-experience-overrides.css'",
  "import './mobile-experience-followup.css'",
  "import './mobile-experience-polish.css'",
])
requireFragments('Prévia administrativa completa e sincronizada', `${adminPreviewPage}\n${brandInterfacePreview}\n${adminBrandPreviewCss}`, [
  'BrandInterfacePreview',
  'activeElement={activeElement}',
  'brand-preview-demo-header',
  'brand-preview-input-demo is-focus',
  'brand-preview-button-matrix',
  'brand-preview-popover',
  'brand-preview-statuses',
  'position: sticky',
  '--admin-desktop-inverse-scale',
])
requireFragments('Campos explicam os componentes afetados', `${brandTemplateElements}\n${templateEditor}`, [
  'affectedComponents',
  'Superfícies, cards e header',
  'Botões e destaques principais',
  'template-element-context',
  'template-affected-components',
  'onActiveElementChange',
])
requireFragments('Escopo institucional documentado no painel', templateEditor, [
  'Tipografia institucional fixa',
  'Escopo fixo:',
  'assinatura de e-mail',
])
requireFragments('Credenciais reconhecíveis no login do colaborador', employeeLogin, [
  'method="post"',
  'name="username"',
  'type="email"',
  'autoComplete="username"',
  'name="password"',
  'autoComplete="current-password"',
  'type="submit"',
  'buildInvestEmail(email)',
])
requireFragments('Credenciais reconhecíveis no login administrativo', adminLogin, [
  'method="post"',
  'name="username"',
  'type="email"',
  'autoComplete="username"',
  'name="password"',
  'autoComplete="current-password"',
  'type="submit"',
  'buildInvestEmail(email)',
])
requireFragments('Contrato base dos componentes', tokenContract, [
  '.primary-button',
  '.secondary-button',
  '.auxiliary-button',
  '.brand-preview-actions',
  '.toast.error',
])
requireFragments('Ponte de especificidade legada', tokenSpecificity, [
  'html:is(.app-visual-mode-light, .app-visual-mode-dark)',
  '.action-panel',
  '.toast.error',
])
requireFragments('Cobertura funcional de componentes', tokenCoverage, [
  '.card-visual',
  '.collaborator-more-menu',
  '.admin-table',
  '.template-picker-grid',
  '.legal-document',
])
requireFragments('Cobertura de autenticação e autofill', tokenAuth, [
  '--auth-input-bg: var(--semantic-input-bg)',
  'input:-webkit-autofill',
  '.password-visibility-button',
  '.email-full-field',
])
requireFragments('Contrato CSS da experiência mobile', mobileExperience, [
  '@media (max-width: 900px)',
  '.home-page-shell .home-actions',
  '.guide-mobile-selector',
  '.auth-page-links.auth-page-links--three',
  '.public-card-actions-panel.mobile-actions-expanded',
])
requireFragments('Controles funcionais da experiência mobile', `${homePage}\n${managedPageView}\n${publicCardPage}`, [
  'home-support-label-mobile',
  'guide-mobile-selector',
  'mobileActionsExpanded',
  'scrollToCardActions',
  'aria-controls="card-lower-actions"',
])
requireFragments('Header autenticado simplificado no mobile', `${collaboratorNavigation}\n${collaboratorAccountMenu}\n${mobileFollowup}`, [
  'collaborator-nav--desktop',
  'collaborator-nav--mobile',
  'includeNavigation',
  'isAdmin={isAdmin}',
  '.collaborator-nav--desktop',
  '.collaborator-nav.collaborator-nav--mobile',
])
requireFragments('Correções de estatísticas e salvamento no mobile', mobileFollowup, [
  '.analytics-filters .period-buttons',
  '.analytics-kpis.analytics-kpis-primary',
  '.analytics-kpis-primary article > strong',
  '.employee-card-form.admin-card-form--desktop-actions .admin-card-form-actions',
])
requireFragments('Prévia de assinatura responsiva e Gmail preferencial', `${signaturePage}\n${mobileFollowup}`, [
  'SIGNATURE_PREVIEW_WIDTH',
  'ResizeObserver',
  "window.location.href = 'googlegmail://'",
  'signature-preview-scale-stage',
])
requireFragments('Compartilhamento nativo da imagem do cartão', `${publicCardPage}\n${mobileFollowup}`, [
  'navigator.canShare({ files: [file] })',
  'navigator.share({',
  'cardImagePreparing',
  'share-image-label-mobile',
  'Salvar como Imagem',
])
requireFragments('Modal de instalação empilhado no mobile', mobileFollowup, [
  '.install-modal-header',
  'grid-template-columns: minmax(0, 1fr)',
  '.install-modal-icon',
])
requireFragments('Refinamentos finais da home e do cartão mobile', `${homePage}\n${mobilePolish}`, [
  'home-theme-label',
  'Selecione o tema',
  '.home-page-shell .brand-logo-main',
  'grid-template-columns: repeat(4, minmax(0, 1fr))',
  '.collaborator-own-card .public-card-contact-list',
])
requireFragments('Preview mobile reutiliza a estrutura pública real', `${cardPreviewModal}\n${publicCardDraftPreview}\n${mobilePolish}`, [
  'PublicCardDraftPreview',
  'PublicCardVisual',
  'PublicCardLanguageToggle',
  'card-preview-modal-public',
  '.draft-public-card-preview',
  '.card-preview-modal-legacy',
])

const tsNoCheckFiles = walk('src')
  .filter((path) => /\.(ts|tsx|js|jsx)$/.test(path))
  .filter((path) => readFileSync(path, 'utf8').includes('@ts-nocheck'))
  .map((path) => relative(root, path))

if (tsNoCheckFiles.length) failures.push(`@ts-nocheck encontrado em: ${tsNoCheckFiles.join(', ')}`)
else checks.push('Ausência de @ts-nocheck')

if (failures.length) {
  console.error('\nAuditoria do contrato visual: REPROVADA\n')
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exitCode = 1
} else {
  console.log('\nAuditoria do contrato visual: APROVADA\n')
  checks.forEach((check) => console.log(`✓ ${check}`))
}
