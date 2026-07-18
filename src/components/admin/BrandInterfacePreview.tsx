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
      aria-label="Prévia em tempo real dos componentes da identidade visual"
    >
      <div className="brand-preview-demo-header" data-preview-target="background surface border">
        <img src={getVariantLogo(settings, activeVariant)} alt="Invest RS" />
        <div className="brand-preview-demo-nav" aria-label="Amostra do header">
          <span className="brand-preview-nav-item" data-preview-target="icon font"><Home aria-hidden="true" /><span>Home</span></span>
          <span className="brand-preview-nav-item is-active" data-preview-target="icon primary font"><ContactRound aria-hidden="true" /><span>Minha Página</span></span>
          <span className="brand-preview-nav-item" data-preview-target="icon font"><PencilLine aria-hidden="true" /><span>Editar</span></span>
          <span className="brand-preview-nav-item is-hover" data-preview-target="icon secondary border font"><Ellipsis aria-hidden="true" /><span>Mais</span></span>
          <span className="brand-preview-nav-item is-logout" data-preview-target="icon font"><LogOut aria-hidden="true" /><span>Sair</span></span>
        </div>
      </div>

      <div className="brand-preview-scroll-area">
        <section className="brand-preview-overview" data-preview-target="background border font">
          <div className="brand-preview-heading">
            <span className="template-preview-icon" data-preview-target="icon auxiliary border" aria-hidden="true"><Palette /></span>
            <div>
              <p>Componentes da interface</p>
              <h2>Identidade Invest RS</h2>
            </div>
          </div>
          <p>Visualização simultânea dos componentes e dos estados derivados do modo selecionado.</p>
        </section>

        <section className="brand-preview-editing-summary">
          <span>Editando agora</span>
          <strong>{activeDefinition.label}</strong>
          <p>{activeDefinition.description}</p>
          <div className="brand-preview-affected-list" aria-label="Componentes afetados">
            {activeDefinition.affectedComponents.map((component) => <span key={component}>{component}</span>)}
          </div>
        </section>

        <section className="brand-preview-surface-card" data-preview-target="surface border font icon">
          <div className="brand-preview-card-title">
            <span data-preview-target="icon auxiliary border"><Palette aria-hidden="true" /></span>
            <div><small>Superfície comum</small><h3>Card institucional</h3></div>
          </div>
          <p>Texto principal, texto secundário, ícone e borda usam os tokens deste modo.</p>
          <hr />
          <small>Superfícies elevadas são usadas em menus, modais e popovers.</small>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-fields-title">
          <div className="brand-preview-section-heading"><Search aria-hidden="true" data-preview-target="icon" /><h3 id="preview-fields-title">Campos e foco</h3></div>
          <div className="brand-preview-fields">
            <label data-preview-target="font border background surface icon">
              Campo vazio
              <span className="brand-preview-input-demo is-placeholder"><Mail aria-hidden="true" /><span>seu.nome@investrs.org.br</span></span>
            </label>
            <label data-preview-target="font border background surface icon">
              Campo preenchido
              <span className="brand-preview-input-demo"><Mail aria-hidden="true" /><span>contato@investrs.org.br</span></span>
            </label>
            <label data-preview-target="font border background surface icon primary">
              Campo em foco
              <span className="brand-preview-input-demo is-focus"><Mail aria-hidden="true" /><span>comunicacao@investrs.org.br</span></span>
            </label>
          </div>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-buttons-title">
          <div className="brand-preview-section-heading"><Palette aria-hidden="true" data-preview-target="icon" /><h3 id="preview-buttons-title">Botões normais e hover</h3></div>
          <div className="brand-preview-button-matrix">
            <div><small>Normal</small><PreviewButton className="is-primary" label="Principal" targets="primary border font" /><PreviewButton className="is-secondary" label="Secundário" targets="secondary border font" /><PreviewButton className="is-auxiliary" label="Auxiliar" targets="auxiliary border font" /></div>
            <div><small>Hover</small><PreviewButton className="is-primary is-hover" label="Principal" targets="primary border font" /><PreviewButton className="is-secondary is-hover" label="Secundário" targets="secondary border font" /><PreviewButton className="is-auxiliary is-hover" label="Auxiliar" targets="auxiliary border font" /></div>
          </div>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-popover-title">
          <div className="brand-preview-section-heading"><Ellipsis aria-hidden="true" data-preview-target="icon" /><h3 id="preview-popover-title">Popover e superfície elevada</h3></div>
          <div className="brand-preview-popover" data-preview-target="surface border font icon secondary">
            <span><ContactRound aria-hidden="true" />Abrir meu cartão</span>
            <span className="is-hover"><PencilLine aria-hidden="true" />Editar dados</span>
            <span><LogOut aria-hidden="true" />Sair</span>
          </div>
        </section>

        <section className="brand-preview-section" aria-labelledby="preview-states-title">
          <div className="brand-preview-section-heading"><ShieldAlert aria-hidden="true" data-preview-target="icon" /><h3 id="preview-states-title">Estados institucionais fixos</h3></div>
          <div className="brand-preview-statuses">
            <span className="success"><CheckCircle2 aria-hidden="true" />Sucesso</span>
            <span className="warning"><AlertTriangle aria-hidden="true" />Alerta</span>
            <span className="error"><ShieldAlert aria-hidden="true" />Erro</span>
            <span className="disabled">Desabilitado</span>
          </div>
          <p className="brand-preview-fixed-note">Sucesso, alerta e erro mantêm cores semânticas institucionais e não são alterados pela paleta dos seis modos.</p>
        </section>
      </div>
    </aside>
  )
}
