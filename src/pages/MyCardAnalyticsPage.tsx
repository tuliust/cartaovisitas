import { useEffect, useMemo, useState } from 'react'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import { useCollaborator } from '../contexts/CollaboratorContext'
import { useToast } from '../contexts/ToastContext'
import type { AdminBusinessCard } from '../lib/adminCards'
import { getOwnerCardEvents, type OwnerCardEvent } from '../lib/adminAnalytics'
import { getFriendlyErrorMessage } from '../lib/errors'

type Period = '7' | '30' | '90' | 'custom'

type MetricCopy = { label: string; description: string }
const eventLabels: Record<string, MetricCopy> = {
  view: { label: 'Aberturas do cartão', description: 'Número de vezes que a página do seu cartão foi aberta. Uma mesma pessoa pode acessar mais de uma vez.' },
  vcard: { label: 'Aberturas do contato', description: 'Quantas vezes alguém abriu o arquivo usado para salvar seu contato no celular.' },
  share: { label: 'Compartilhamentos', description: 'Quantas vezes as opções de compartilhamento do cartão foram utilizadas.' },
  qr: { label: 'Acessos pelo QR Code', description: 'Quantas vezes o QR Code foi usado para abrir seu contato.' },
}
function dateInput(date: Date) { return date.toISOString().slice(0, 10) }
function percent(value: number) { return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)}%` }

export default function MyCardAnalyticsPage() {
  const { card } = useCollaborator()
  return <CollaboratorLayout title="Resultados do meu cartão" subtitle="Veja, de forma simples, como as pessoas abriram, salvaram e compartilharam seu contato.">{card ? <AnalyticsDashboard card={card} /> : <p className="state-card">Salve seu cartão para começar a acompanhar os resultados.</p>}</CollaboratorLayout>
}

function AnalyticsDashboard({ card }: { card: AdminBusinessCard }) {
  const toast = useToast()
  const [initialDates] = useState(() => { const end = new Date(); return { end, today: dateInput(end), start: dateInput(new Date(end.getTime() - 29 * 86400000)) } })
  const [period, setPeriod] = useState<Period>('30')
  const [customStart, setCustomStart] = useState(initialDates.start)
  const [customEnd, setCustomEnd] = useState(initialDates.today)
  const [events, setEvents] = useState<OwnerCardEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const range = useMemo(() => { const end = period === 'custom' ? new Date(`${customEnd}T23:59:59.999`) : initialDates.end; const days = period === 'custom' ? 0 : Number(period); const start = period === 'custom' ? new Date(`${customStart}T00:00:00`) : new Date(end.getTime() - (days - 1) * 86400000); return { start, end } }, [customEnd, customStart, initialDates, period])
  const invalidRange = Number.isNaN(range.start.getTime()) || Number.isNaN(range.end.getTime()) || range.start > range.end

  useEffect(() => {
    if (invalidRange) return
    let mounted = true
    void (async () => { await Promise.resolve(); if (mounted) { setLoading(true); setError('') }; try { const data = await getOwnerCardEvents(card.id, range.start.toISOString(), range.end.toISOString()); if (mounted) setEvents(data) } catch (reason) { if (mounted) { const message = getFriendlyErrorMessage(reason); setError(message); toast.error(message) } } finally { if (mounted) setLoading(false) } })()
    return () => { mounted = false }
  }, [card.id, invalidRange, range.end, range.start, toast])

  const counts = useMemo(() => Object.fromEntries(Object.keys(eventLabels).map((type) => [type, events.filter((event) => event.event_type === type).length])) as Record<string, number>, [events])
  const days = useMemo(() => { const result: Array<{ key: string; label: string; total: number }> = []; for (let cursor = new Date(range.start); cursor <= range.end; cursor = new Date(cursor.getTime() + 86400000)) { const key = dateInput(cursor); result.push({ key, label: cursor.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), total: events.filter((event) => event.created_at?.startsWith(key)).length }) } return result }, [events, range.end, range.start])
  const lastView = events.filter((event) => event.event_type === 'view' && event.created_at).at(-1)?.created_at ?? null
  const maxDaily = Math.max(1, ...days.map((day) => day.total))
  const points = days.map((day, index) => `${days.length === 1 ? 350 : 20 + index * (660 / (days.length - 1))},${200 - day.total / maxDaily * 170}`).join(' ')

  return <>
    <section className="collaborator-card analytics-filters" aria-label="Filtros de período"><div className="period-buttons">{(['7', '30', '90'] as const).map((value) => <button type="button" className={period === value ? 'active' : ''} aria-pressed={period === value} key={value} onClick={() => setPeriod(value)}>{value} dias</button>)}<button type="button" className={period === 'custom' ? 'active' : ''} aria-pressed={period === 'custom'} onClick={() => setPeriod('custom')}>Personalizado</button></div>{period === 'custom' ? <div className="custom-period"><label>Data inicial<input type="date" value={customStart} max={customEnd} onChange={(event) => setCustomStart(event.target.value)} /></label><label>Data final<input type="date" value={customEnd} min={customStart} max={initialDates.today} onChange={(event) => setCustomEnd(event.target.value)} /></label></div> : null}</section>
    {invalidRange ? <p className="admin-error" role="alert">Informe um período válido.</p> : loading ? <div className="state-card" role="status">Carregando resultados...</div> : error ? <p className="admin-error" role="alert">{error}</p> : <>
      <section className="analytics-kpis analytics-kpis-primary" aria-label="Principais resultados">{Object.entries(eventLabels).map(([type, copy]) => <article key={type}><span>{copy.label}</span><strong>{counts[type]}</strong><small>{copy.description}</small></article>)}</section>
      <section className="analytics-kpis analytics-kpis-secondary" aria-label="Informações complementares"><article><span>Último acesso</span><strong>{lastView ? new Date(lastView).toLocaleString('pt-BR') : 'Nenhum'}</strong><small>Data e horário da abertura mais recente do cartão.</small></article><article><span>Aberturas que chegaram ao contato</span><strong>{percent(counts.view ? counts.vcard / counts.view * 100 : 0)}</strong><small>Percentual das aberturas que avançaram para o arquivo de contato.</small></article><article><span>Aberturas que geraram compartilhamento</span><strong>{percent(counts.view ? counts.share / counts.view * 100 : 0)}</strong><small>Percentual das aberturas em que uma opção de compartilhamento foi utilizada.</small></article></section>
      {events.length === 0 ? <div className="collaborator-card analytics-empty"><h2>Nenhuma atividade no período</h2><p>Altere o período ou compartilhe seu cartão para começar a acompanhar os resultados.</p></div> : <div className="analytics-grid">
        <section className="collaborator-card analytics-chart"><h2>Movimento por dia</h2><p className="analytics-section-description">Quantidade total de ações registradas no cartão em cada dia.</p><svg viewBox="0 0 700 220" role="img" aria-labelledby="daily-chart-title daily-chart-description"><title id="daily-chart-title">Movimento diário do cartão</title><desc id="daily-chart-description">Total de ações registradas por dia no período selecionado.</desc><line x1="20" y1="200" x2="680" y2="200" /><polyline points={points} /><g>{days.map((day, index) => <circle key={day.key} cx={days.length === 1 ? 350 : 20 + index * (660 / (days.length - 1))} cy={200 - day.total / maxDaily * 170} r="5"><title>{day.label}: {day.total} ações</title></circle>)}</g></svg><details><summary>Ver resultados por dia</summary><table><thead><tr><th>Dia</th><th>Ações registradas</th></tr></thead><tbody>{days.map((day) => <tr key={day.key}><td>{day.label}</td><td>{day.total}</td></tr>)}</tbody></table></details></section>
        <section className="collaborator-card analytics-comparison"><h2>O que as pessoas fizeram</h2><p className="analytics-section-description">Comparação entre os principais tipos de ação no cartão.</p><div role="img" aria-label="Comparação das ações realizadas no cartão">{Object.entries(eventLabels).map(([type, copy]) => { const value = counts[type]; const maximum = Math.max(1, ...Object.keys(eventLabels).map((key) => counts[key])); return <div className="analytics-bar" key={type}><span>{copy.label}</span><div><i style={{ width: `${value / maximum * 100}%` }} /></div><strong>{value}</strong></div> })}</div><p className="field-help">O acesso pelo QR Code mostra quantas vezes o código foi usado para abrir o contato. Ele não identifica pessoas diferentes.</p></section>
      </div>}
    </>}
  </>
}
