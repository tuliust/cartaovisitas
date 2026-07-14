import {
  ChartNoAxesCombined,
  CircleHelp,
  ContactRound,
  Copy,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Link2,
  Mail,
  Palette,
  PencilLine,
  QrCode,
  Share2,
  UserRound,
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

function getGuideIcon(id: string) {
  return guideIcons[id] ?? FileText
}

function GuideBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
  return <div className="guide-section-body">{paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>)}</div>
}

export function ManagedPageView({ pageKey, variant }: ManagedPageViewProps) {
  const [page, setPage] = useState<ManagedPage>(() => managedPageDefaults[pageKey])
  const [activeGuideSection, setActiveGuideSection] = useState(() => managedPageDefaults.usage_guide.content.sections[0]?.id ?? '')
  const [guideSearch, setGuideSearch] = useState('')
  useEffect(() => { let mounted = true; void getManagedPage(pageKey).then((loaded) => { if (mounted) setPage(loaded) }); return () => { mounted = false } }, [pageKey])

  useEffect(() => {
    if (variant !== 'guide') return
    const sections = page.content.sections.map((section) => document.getElementById(section.id)).filter((section): section is HTMLElement => Boolean(section))
    if (!sections.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => Math.abs(a.boundingClientRect.top - 120) - Math.abs(b.boundingClientRect.top - 120))[0]
      if (visible?.target.id) setActiveGuideSection(visible.target.id)
    }, { rootMargin: '-12% 0px -68% 0px', threshold: [0, 0.1, 0.5] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [page.content.sections, variant])

  const guideSuggestions = useMemo(() => {
    const term = guideSearch.trim().toLocaleLowerCase('pt-BR')
    if (!term) return []
    return page.content.sections
      .filter((section) => `${section.title} ${section.body}`.toLocaleLowerCase('pt-BR').includes(term))
      .sort((a, b) => Number(b.title.toLocaleLowerCase('pt-BR').includes(term)) - Number(a.title.toLocaleLowerCase('pt-BR').includes(term)))
      .slice(0, 6)
  }, [guideSearch, page.content.sections])

  function goToGuideSection(sectionId: string) {
    setActiveGuideSection(sectionId)
    setGuideSearch('')
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (variant === 'guide') return <CollaboratorLayout title={page.title} useBackButton headerContent={<div className="guide-search"><label htmlFor="guide-search-input"><Search aria-hidden="true" /><span className="sr-only">Buscar no guia</span><input id="guide-search-input" type="search" value={guideSearch} onChange={(event) => setGuideSearch(event.target.value)} placeholder="Buscar no guia" autoComplete="off" aria-controls="guide-search-suggestions" aria-expanded={Boolean(guideSearch)} /></label>{guideSearch ? <div className="guide-search-suggestions" id="guide-search-suggestions" role="listbox" aria-label="Sugestões do guia">{guideSuggestions.length ? guideSuggestions.map((section) => <button type="button" role="option" aria-selected={section.id === activeGuideSection} key={section.id} onClick={() => goToGuideSection(section.id)}><Search aria-hidden="true" /><span>{section.title}</span></button>) : <p>Nenhum tópico encontrado.</p>}</div> : null}</div>}>
    <div className="guide-layout">
      <nav className="guide-index" aria-label="Índice do guia">
        <ol>{page.content.sections.map((section, index) => {
          const Icon = getGuideIcon(section.id)
          return <li key={section.id}><a className={activeGuideSection === section.id ? 'active' : ''} aria-current={activeGuideSection === section.id ? 'location' : undefined} href={`#${section.id}`} onClick={(event) => { event.preventDefault(); goToGuideSection(section.id) }}><span className="guide-index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /><span>{section.title}</span></a></li>
        })}</ol>
      </nav>
      <article className="guide-content">{page.content.sections.map((section, index) => {
        const Icon = getGuideIcon(section.id)
        return <section id={section.id} key={section.id}>
          <header className="guide-section-header">
            <span className="guide-section-icon" aria-hidden="true"><Icon /></span>
            <div><p className="guide-section-kicker">Tópico {String(index + 1).padStart(2, '0')}</p><h2>{section.title}</h2></div>
          </header>
          <GuideBody body={section.body} />
        </section>
      })}</article>
    </div>
  </CollaboratorLayout>

  return <CollaboratorLayout title={page.title} subtitle={page.subtitle}>
    <article className="legal-document">{page.content.notice ? <aside role="note"><strong>{page.content.notice.title}</strong><p>{page.content.notice.body}</p></aside> : null}
      {page.content.sections.map((section) => <section id={section.id} key={section.id}><h2>{section.title}</h2><p>{section.body}</p></section>)}
      {page.version_label ? <footer><h2>Data e versão do documento</h2><p>{page.version_label}</p></footer> : null}
    </article>
  </CollaboratorLayout>
}
