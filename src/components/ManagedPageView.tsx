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
import { useEffect, useState } from 'react'
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
  useEffect(() => { let mounted = true; void getManagedPage(pageKey).then((loaded) => { if (mounted) setPage(loaded) }); return () => { mounted = false } }, [pageKey])

  if (variant === 'guide') return <CollaboratorLayout title={page.title} subtitle={page.subtitle}>
    <div className="guide-layout">
      <nav className="guide-index" aria-label="Índice do guia">
        <ol>{page.content.sections.map((section, index) => {
          const Icon = getGuideIcon(section.id)
          return <li key={section.id}><a href={`#${section.id}`}><span className="guide-index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /><span>{section.title}</span></a></li>
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
