import {
  ChartNoAxesCombined,
  CircleHelp,
  ContactRound,
  Cookie,
  Copy,
  Database,
  ExternalLink,
  FileText,
  HardDrive,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  Mail,
  Palette,
  PencilLine,
  QrCode,
  Scale,
  Share2,
  ShieldCheck,
  UserCheck,
  UserRound,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from 'lucide-react'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import CollaboratorLayout from './collaborator/CollaboratorLayout'
import { getManagedPage } from '../lib/managedPages'
import { managedPageDefaults, type ManagedPage, type ManagedPageKey } from '../lib/managedPageDefaults'

type ManagedPageViewProps = { pageKey: ManagedPageKey; variant: 'guide' | 'legal' }

const guideIcons: Record<string, LucideIcon> = {
  'visao-geral': LayoutDashboard,
  'primeiro-cartao': ContactRound,
  slug: Link2,
  editar: PencilLine,
  foto: UserRound,
  visual: Palette,
  'minha-pagina': ExternalLink,
  compartilhar: Share2,
  copiar: Copy,
  qr: QrCode,
  wallet: WalletCards,
  gmail: Mail,
  estatisticas: ChartNoAxesCombined,
  faq: CircleHelp,
}

const legalIcons: Record<string, LucideIcon> = {
  'termos-de-uso': FileText,
  controlador: ShieldCheck,
  'dados-coletados': Database,
  finalidades: LayoutDashboard,
  'bases-legais': Scale,
  compartilhamento: Share2,
  'armazenamento-e-retencao': HardDrive,
  'cookies-e-localstorage': Cookie,
  seguranca: LockKeyhole,
  'direitos-do-titular': UserCheck,
  'responsabilidades-do-usuario': UsersRound,
  'disponibilidade-do-servico': CircleHelp,
  'canal-de-contato': Mail,
}

function getSectionIcon(id: string, variant: ManagedPageViewProps['variant']) {
  return (variant === 'guide' ? guideIcons[id] : legalIcons[id]) ?? FileText
}

function SectionBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
  return <div className="guide-section-body">{paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>)}</div>
}

export function ManagedPageView({ pageKey, variant }: ManagedPageViewProps) {
  const [page, setPage] = useState<ManagedPage>(() => managedPageDefaults[pageKey])
  const [activeSection, setActiveSection] = useState(() => managedPageDefaults[pageKey].content.sections[0]?.id ?? '')
  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true
    void getManagedPage(pageKey).then((loaded) => {
      if (!mounted) return
      setPage(loaded)
      setActiveSection((current) => current || loaded.content.sections[0]?.id || '')
    })
    return () => { mounted = false }
  }, [pageKey])

  useEffect(() => {
    const sections = page.content.sections.map((section) => document.getElementById(section.id)).filter((section): section is HTMLElement => Boolean(section))
    if (!sections.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => Math.abs(a.boundingClientRect.top - 120) - Math.abs(b.boundingClientRect.top - 120))[0]
      if (visible?.target.id) setActiveSection(visible.target.id)
    }, { rootMargin: '-12% 0px -68% 0px', threshold: [0, 0.1, 0.5] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [page.content.sections])

  const suggestions = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    if (!term) return []
    return page.content.sections
      .filter((section) => `${section.title} ${section.body}`.toLocaleLowerCase('pt-BR').includes(term))
      .sort((a, b) => Number(b.title.toLocaleLowerCase('pt-BR').includes(term)) - Number(a.title.toLocaleLowerCase('pt-BR').includes(term)))
      .slice(0, 6)
  }, [search, page.content.sections])

  function goToSection(sectionId: string) {
    setActiveSection(sectionId)
    setSearch('')
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const searchId = variant === 'guide' ? 'guide-search-input' : 'legal-search-input'
  const suggestionsId = variant === 'guide' ? 'guide-search-suggestions' : 'legal-search-suggestions'
  const searchLabel = variant === 'guide' ? 'Buscar no guia' : 'Buscar nos termos'
  const topicLabel = variant === 'guide' ? 'Selecionar tópico do guia' : 'Selecionar seção dos termos'

  return <CollaboratorLayout title={page.title} useBackButton headerContent={<div className="guide-search"><label htmlFor={searchId}><Search aria-hidden="true" /><span className="sr-only">{searchLabel}</span><input id={searchId} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={searchLabel} autoComplete="off" aria-controls={suggestionsId} aria-expanded={Boolean(search)} /></label>{search ? <div className="guide-search-suggestions" id={suggestionsId} role="listbox" aria-label={variant === 'guide' ? 'Sugestões do guia' : 'Sugestões dos termos'}>{suggestions.length ? suggestions.map((section) => <button type="button" role="option" aria-selected={section.id === activeSection} key={section.id} onClick={() => goToSection(section.id)}><Search aria-hidden="true" /><span>{section.title}</span></button>) : <p>Nenhum tópico encontrado.</p>}</div> : null}</div>}>
    <div className={`guide-layout${variant === 'legal' ? ' legal-guide-layout' : ''}`}>
      <label className="guide-mobile-selector">
        <span>{topicLabel}</span>
        <select value={activeSection} onChange={(event) => goToSection(event.target.value)} aria-label={topicLabel}>
          {page.content.sections.map((section, index) => <option value={section.id} key={section.id}>{String(index + 1).padStart(2, '0')} — {section.title}</option>)}
        </select>
      </label>
      <nav className="guide-index" aria-label={variant === 'guide' ? 'Índice do guia' : 'Índice dos termos'}>
        <ol>{page.content.sections.map((section, index) => {
          const Icon = getSectionIcon(section.id, variant)
          return <li key={section.id}><a className={activeSection === section.id ? 'active' : ''} aria-current={activeSection === section.id ? 'location' : undefined} href={`#${section.id}`} onClick={(event) => { event.preventDefault(); goToSection(section.id) }}><span className="guide-index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /><span>{section.title}</span></a></li>
        })}</ol>
      </nav>
      <article className="guide-content">
        {page.content.notice ? <aside className="legal-guide-notice" role="note"><strong>{page.content.notice.title}</strong><p>{page.content.notice.body}</p></aside> : null}
        {page.content.sections.map((section, index) => {
          const Icon = getSectionIcon(section.id, variant)
          return <section id={section.id} key={section.id}>
            <header className="guide-section-header">
              <span className="guide-section-icon" aria-hidden="true"><Icon /></span>
              <div><p className="guide-section-kicker">{variant === 'guide' ? 'Tópico' : 'Seção'} {String(index + 1).padStart(2, '0')}</p><h2>{section.title}</h2></div>
            </header>
            <SectionBody body={section.body} />
          </section>
        })}
        {variant === 'legal' && page.version_label ? <footer className="legal-guide-version"><h2>Data e versão do documento</h2><p>{page.version_label}</p></footer> : null}
      </article>
    </div>
  </CollaboratorLayout>
}
