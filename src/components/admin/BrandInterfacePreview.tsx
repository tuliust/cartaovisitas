import {
  AlertTriangle,
  CheckCircle2,
  ContactRound,
  Ellipsis,
  Home,
  LogOut,
  Mail,
  Palette,
  PencilLine,
  Search,
  ShieldAlert,
} from 'lucide-react'
import type { BrandSettings } from '../../lib/brandSettings'
import {
  getVariantClassName,
  getVariantLogo,
  getVariantStyle,
  type PublicVisualVariant,
} from '../../lib/cardVisualVariants'
import {
  getBrandTemplateElement,
  type TemplateElementKey,
} from '../../lib/brandTemplateElements'

type BrandInterfacePreviewProps = {
  settings: BrandSettings
  activeVariant: PublicVisualVariant
  activeElement: TemplateElementKey
}

function PreviewButton({ className, label, targets }: { className: string; label: string; targets: string }) {
  return <span className={`brand-preview-button ${className}`} data-preview-target={targets}>{label}</span>
}

export default function BrandInterfacePreview({ settings, activeVariant, activeElement }: BrandInterfacePreviewProps) {
  const activeDefinition = getBrandTemplateElement(activeElement)

  return (
    <aside
      className={`brand-interface-preview ${getVariantClassName(settings, activeVariant)} is-editing-${activeElement}`}
      style={getVariantStyle(settings, activeVariant)}
      data-preview-target="background overlay"
      aria-label="Prévia em tempo real dos componentes da identidade visual"
    >
      <div className="brand-preview-demo-header" data-preview-target="header border">
        <img src={getVariantLogo(settings, activeVariant)} alt="Invest RS" />
        <div className="brand-preview-demo-nav" aria-label="Amostra do header">
          <span className="brand-preview-nav-item" data-preview-target="icon muted-text"><Home aria-hidden="true" /><span>Home</span></span>
          <span className="brand-preview-nav-item is-active" data-preview-target="icon primary"><ContactRound aria-hidden="true" /><span>Minha Página</span></span>
          <span className="brand-preview-nav-item" data-preview-target="icon muted-text"><PencilLine aria-hidden="true" /><span>Editar</span></span>
          <span className="brand-preview-nav-item is-hover" data-preview-target="icon secondary secondary-text border"><Ellipsis aria-hidden="true" /><span>Mais</span></span>
          <span className="brand-preview-nav-item is-logout"><LogOut aria-hidden="true" /><span>Sair</span></span>
        </div>
      </div>

      <div className="brand-preview-scroll-area">
        <section className="brand-preview-overview" data-preview-target="surface border font muted-text">
          <div className="brand-preview-heading">
            <span className="template-preview-icon" data-preview-target="icon auxiliary border" aria-hidden="true"><Palette /></span>
            <div>
              <p>Componentes da interface</p>
              <h2>Identidade Invest RS</h2>
            </div>
          </div>
          <p>Visualização simultânea dos componentes e dos estados derivados do modo selecionado.</p>
        </section>

        <section className="brand-preview-editing-summary" data-preview-target="raised-surface border font muted-text">
          <span>Editando agora</span>
          <strong>{activeDefinition.label}</strong>
          <p>{activeDefinition.description}</p>
          <div className="brand-preview-affected-list" aria-label="Componentes afetados">
            {activeDefinition.affectedComponents.map((component) => <span key={component}>{component}</span>)}
          </div>
        </section>

        <section className="brand-preview-surface-card" data-preview-target="surface border font muted-text icon">
          <div className="brand-preview-card-title">
            <span data-preview-target="icon auxiliary border"><Palette aria-hidden="true" /></span>
            <div><small>Superfície comum</small><h3>Card institucional</h3></div>
          </div>
          <p>Texto principal, texto secundário, ícone e borda usam tokens independentes deste modo.</p>
          <hr />
          <small data-preview-target="subtle-text">Superfícies elevadas são usadas em menus, modais e popovers.</small>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-fields-title">
          <div className="brand-preview-section-heading"><Search aria-hidden="true" data-preview-target="icon" /><h3 id="preview-fields-title" data-preview-target="font">Campos e foco</h3></div>
          <div className="brand-preview-fields">
            <label data-preview-target="font">
              Campo vazio
              <span className="brand-preview-input-demo is-placeholder" data-preview-target="input-background border placeholder icon"><Mail aria-hidden="true" /><span>seu.nome@investrs.org.br</span></span>
            </label>
            <label data-preview-target="font">
              Campo preenchido
              <span className="brand-preview-input-demo" data-preview-target="input-background border input-text icon"><Mail aria-hidden="true" /><span>contato@investrs.org.br</span></span>
            </label>
            <label data-preview-target="font">
              Campo em foco
              <span className="brand-preview-input-demo is-focus" data-preview-target="input-background border input-text icon focus"><Mail aria-hidden="true" /><span>comunicacao@investrs.org.br</span></span>
            </label>
          </div>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-buttons-title">
          <div className="brand-preview-section-heading"><Palette aria-hidden="true" data-preview-target="icon" /><h3 id="preview-buttons-title" data-preview-target="font">Botões normais e hover</h3></div>
          <div className="brand-preview-button-matrix">
            <div><small data-preview-target="muted-text">Normal</small><PreviewButton className="is-primary" label="Principal" targets="primary primary-text" /><PreviewButton className="is-secondary" label="Secundário" targets="secondary secondary-text border" /><PreviewButton className="is-auxiliary" label="Auxiliar" targets="auxiliary auxiliary-text border" /></div>
            <div><small data-preview-target="muted-text">Hover</small><PreviewButton className="is-primary is-hover" label="Principal" targets="primary primary-text" /><PreviewButton className="is-secondary is-hover" label="Secundário" targets="secondary secondary-text border" /><PreviewButton className="is-auxiliary is-hover" label="Auxiliar" targets="auxiliary auxiliary-text border" /></div>
          </div>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-popover-title">
          <div className="brand-preview-section-heading"><Ellipsis aria-hidden="true" data-preview-target="icon" /><h3 id="preview-popover-title" data-preview-target="font">Popover e superfície elevada</h3></div>
          <div className="brand-preview-popover" data-preview-target="raised-surface border font icon secondary secondary-text">
            <span><ContactRound aria-hidden="true" />Abrir meu cartão</span>
            <span className="is-hover"><PencilLine aria-hidden="true" />Editar dados</span>
            <span><LogOut aria-hidden="true" />Sair</span>
          </div>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-modal-title">
          <div className="brand-preview-section-heading"><ShieldAlert aria-hidden="true" data-preview-target="icon" /><h3 id="preview-modal-title" data-preview-target="font">Modal e backdrop</h3></div>
          <div className="brand-preview-modal-backdrop" data-preview-target="modal-backdrop">
            <div className="brand-preview-modal-card" data-preview-target="raised-surface border font muted-text">
              <strong>Confirmar alteração</strong>
              <p>Esta amostra separa a superfície do modal da camada aplicada atrás dele.</p>
              <div><PreviewButton className="is-secondary" label="Cancelar" targets="secondary secondary-text border" /><PreviewButton className="is-primary" label="Confirmar" targets="primary primary-text" /></div>
            </div>
          </div>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-states-title">
          <div className="brand-preview-section-heading"><ShieldAlert aria-hidden="true" data-preview-target="icon" /><h3 id="preview-states-title" data-preview-target="font">Estados institucionais fixos</h3></div>
          <div className="brand-preview-statuses">
            <span className="success"><CheckCircle2 aria-hidden="true" />Sucesso</span>
            <span className="warning"><AlertTriangle aria-hidden="true" />Alerta</span>
            <span className="error"><ShieldAlert aria-hidden="true" />Erro</span>
            <span className="disabled" data-preview-target="subtle-text">Desabilitado</span>
          </div>
          <p className="brand-preview-fixed-note" data-preview-target="muted-text">Sucesso, alerta e erro mantêm cores semânticas institucionais e não são alterados pela paleta dos seis modos.</p>
        </section>
      </div>
    </aside>
  )
}
