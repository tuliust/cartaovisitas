import { useEffect, useState } from 'react'
import CollaboratorLayout from './collaborator/CollaboratorLayout'
import { getManagedPage } from '../lib/managedPages'
import { managedPageDefaults, type ManagedPage, type ManagedPageKey } from '../lib/managedPageDefaults'

type ManagedPageViewProps = { pageKey: ManagedPageKey; variant: 'guide' | 'legal' }

export function ManagedPageView({ pageKey, variant }: ManagedPageViewProps) {
  const [page, setPage] = useState<ManagedPage>(() => managedPageDefaults[pageKey])
  useEffect(() => { let mounted = true; void getManagedPage(pageKey).then((loaded) => { if (mounted) setPage(loaded) }); return () => { mounted = false } }, [pageKey])

  if (variant === 'guide') return <CollaboratorLayout title={page.title} subtitle={page.subtitle}>
    <div className="guide-layout"><nav className="guide-index" aria-label="Índice do guia"><h2>Neste guia</h2><ol>{page.content.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
      <article className="guide-content">{page.content.sections.map((section) => <section id={section.id} key={section.id}><h2>{section.title}</h2><p>{section.body}</p></section>)}</article>
    </div>
  </CollaboratorLayout>

  return <CollaboratorLayout title={page.title} subtitle={page.subtitle}>
    <article className="legal-document">{page.content.notice ? <aside role="note"><strong>{page.content.notice.title}</strong><p>{page.content.notice.body}</p></aside> : null}
      {page.content.sections.map((section) => <section id={section.id} key={section.id}><h2>{section.title}</h2><p>{section.body}</p></section>)}
      {page.version_label ? <footer><h2>Data e versão do documento</h2><p>{page.version_label}</p></footer> : null}
    </article>
  </CollaboratorLayout>
}
