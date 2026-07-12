import { useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { recordAuditLog } from '../../lib/audit'
import { importCardRows, parseCardImportFile, type CardImportRow, type ImportMode } from '../../lib/cardImport'
import { getFriendlyErrorMessage } from '../../lib/errors'

type CardImportModalProps = {
  onClose: () => void
  onImported: () => Promise<void> | void
}

export default function CardImportModal({ onClose, onImported }: CardImportModalProps) {
  const toast = useToast()
  const [rows, setRows] = useState<CardImportRow[]>([])
  const [mode, setMode] = useState<ImportMode>('new')
  const [loading, setLoading] = useState(false)

  async function select(file?: File) {
    if (!file) return

    setLoading(true)

    try {
      const parsed = await parseCardImportFile(file)
      setRows(parsed)
      toast.info(`${parsed.length} linha(s) carregada(s) para revisão.`)
    } catch (error) {
      const message = getFriendlyErrorMessage(error)
      await recordAuditLog({
        action: 'bulk_import_failed',
        targetType: 'business_card',
        metadata: { phase: 'validation', message },
      })
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function confirm() {
    setLoading(true)
    await recordAuditLog({
      action: 'bulk_import_started',
      targetType: 'business_card',
      metadata: { rows: rows.length, mode },
    })

    try {
      const result = await importCardRows(rows, mode)
      await recordAuditLog({
        action: 'bulk_import_completed',
        targetType: 'business_card',
        metadata: result,
      })
      toast.success(
        `${result.created} cartões criados, ${result.updated} atualizados, ${result.ignored} ignorados.`,
      )
      await onImported()
      onClose()
    } catch (error) {
      const message = getFriendlyErrorMessage(error)
      await recordAuditLog({
        action: 'bulk_import_failed',
        targetType: 'business_card',
        metadata: { message },
      })
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="confirmation-backdrop import-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose()
      }}
    >
      <section
        className="confirmation-modal import-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-title"
        aria-describedby="import-description"
      >
        <header className="import-modal-header">
          <h2 id="import-title">Importar planilha</h2>
          <p id="import-description">
            Selecione um arquivo CSV, revise as linhas e confirme a importação.
          </p>
        </header>

        <div className="import-modal-body">
          <label htmlFor="card-import-file">
            Arquivo CSV
            <input
              id="card-import-file"
              type="file"
              accept=".csv,text/csv"
              onChange={(event) => void select(event.target.files?.[0])}
            />
          </label>

          {rows.length ? (
            <>
              <label htmlFor="card-import-mode">
                Modo
                <select
                  id="card-import-mode"
                  value={mode}
                  onChange={(event) => setMode(event.target.value as ImportMode)}
                >
                  <option value="new">Criar apenas novos</option>
                  <option value="email">Criar e atualizar por e-mail</option>
                  <option value="slug">Criar e atualizar por slug</option>
                </select>
              </label>

              <div
                className="import-preview"
                tabIndex={0}
                role="region"
                aria-label="Prévia das linhas da importação"
              >
                <table>
                  <thead>
                    <tr>
                      <th>Linha</th>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Slug</th>
                      <th>Validação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr className={row.errors.length ? 'invalid' : 'valid'} key={row.line}>
                        <td>{row.line}</td>
                        <td>{row.values.full_name}</td>
                        <td>{row.values.email}</td>
                        <td>{row.values.slug}</td>
                        <td>{row.errors.length ? row.errors.join(' ') : 'Válida'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}
        </div>

        <div className="confirmation-actions import-modal-actions">
          <button className="secondary-button" type="button" disabled={loading} onClick={onClose}>
            Cancelar
          </button>
          <button
            className="primary-button"
            type="button"
            disabled={loading || !rows.length || rows.some((row) => row.errors.length > 0)}
            onClick={() => void confirm()}
          >
            {loading ? 'Processando...' : 'Confirmar importação'}
          </button>
        </div>
      </section>
    </div>
  )
}
