import { useEffect, useMemo, useState } from 'react'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import { useCollaborator } from '../contexts/CollaboratorContext'
import { useToast } from '../contexts/ToastContext'
import type { AdminBusinessCard } from '../lib/adminCards'
import { getOwnerCardEvents, type OwnerCardEvent } from '../lib/adminAnalytics'
import { getFriendlyErrorMessage } from '../lib/errors'

type Period = '7' | '30' | '90' | 'custom'
const eventLabels: Record<string, string> = { view: 'Visualizações', vcard: 'Interações com vCard', share: 'Compartilhamentos', qr: 'Interações com QR Code' }
function dateInput(date: Date) { return date.toISOString().slice(0, 10) }
function percent(value: number) { return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)}%` }

export default function MyCardAnalyticsPage() {
  const { card } = useCollaborator()
  return <CollaboratorLayout title="Estatísticas de Compartilhamento" subtitle="Acompanhe as interações registradas para o seu cartão.">{card ? <AnalyticsDashboard card={card} /> : <p className="state-card">Salve seu cartão para começar a acompanhar as estatísticas.</p>}</CollaboratorLayout>
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
    {invalidRange ? <p className="admin-error" role="alert">Informe um período válido.</p> : loading ? <div className="state-card" role="status">Carregando estatísticas...</div> : error ? <p className="admin-error" role="alert">{error}</p> : <>
      <section className="analytics-kpis analytics-kpis-primary" aria-label="Indicadores principais"><article><span>Visualizações</span><strong>{counts.view}</strong></article><article><span>Interações com vCard</span><strong>{counts.vcard}</strong></article><article><span>Compartilhamentos</span><strong>{counts.share}</strong></article><article><span>Interações com QR Code</span><strong>{counts.qr}</strong></article></section>
      <section className="analytics-kpis analytics-kpis-secondary" aria-label="Indicadores complementares"><article><span>Última visualização</span><strong>{lastView ? new Date(lastView).toLocaleString('pt-BR') : 'Nenhuma'}</strong></article><article><span>Conversão para vCard</span><strong>{percent(counts.view ? counts.vcard / counts.view * 100 : 0)}</strong></article><article><span>Taxa de compartilhamento</span><strong>{percent(counts.view ? counts.share / counts.view * 100 : 0)}</strong></article></section>
      {events.length === 0 ? <div className="collaborator-card analytics-empty"><h2>Nenhuma interação no período</h2><p>Altere o filtro ou compartilhe seu cartão para começar a registrar eventos.</p></div> : <div className="analytics-grid">
        <section className="collaborator-card analytics-chart"><h2>Evolução diária</h2><svg viewBox="0 0 700 220" role="img" aria-labelledby="daily-chart-title daily-chart-description"><title id="daily-chart-title">Evolução diária de interações</title><desc id="daily-chart-description">Total de interações por dia no período selecionado.</desc><line x1="20" y1="200" x2="680" y2="200" /><polyline points={points} /><g>{days.map((day, index) => <circle key={day.key} cx={days.length === 1 ? 350 : 20 + index * (660 / (days.length - 1))} cy={200 - day.total / maxDaily * 170} r="5"><title>{day.label}: {day.total} interações</title></circle>)}</g></svg><details><summary>Resumo textual diário</summary><table><thead><tr><th>Dia</th><th>Interações</th></tr></thead><tbody>{days.map((day) => <tr key={day.key}><td>{day.label}</td><td>{day.total}</td></tr>)}</tbody></table></details></section>
        <section className="collaborator-card analytics-comparison"><h2>Comparação por tipo</h2><div role="img" aria-label="Comparação dos tipos de evento">{Object.entries(eventLabels).map(([type, label]) => { const value = counts[type]; const maximum = Math.max(1, ...Object.keys(eventLabels).map((key) => counts[key])); return <div className="analytics-bar" key={type}><span>{label}</span><div><i style={{ width: `${value / maximum * 100}%` }} /></div><strong>{value}</strong></div> })}</div><p className="field-help">Interações com QR Code representam usos registrados pelo endpoint do QR; não distinguem leitura física de outros acessos.</p></section>
      </div>}
    </>}
  </>
}
