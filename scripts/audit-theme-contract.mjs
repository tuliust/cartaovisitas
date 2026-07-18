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
const adminPreview = read('src/pages/admin/AdminBrandSettingsPage.tsx')
const templateEditor = read('src/components/admin/TemplateOptionsEditor.tsx')
const employeeLogin = read('src/pages/EmployeeLoginPage.tsx')
const adminLogin = read('src/pages/admin/AdminLoginPage.tsx')
const tokenContract = read('src/brand-token-contract.css')
const tokenSpecificity = read('src/brand-token-specificity.css')
const tokenCoverage = read('src/brand-token-coverage.css')
const tokenAuth = read('src/brand-token-auth.css')

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
])
requireFragments('Prévia administrativa completa', adminPreview, [
  'brand-preview-input',
  'preview-primary-button',
  'preview-secondary-button',
  'preview-auxiliary-button',
  'brand-preview-statuses',
  'getVariantStyle(values, activeVariant)',
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
