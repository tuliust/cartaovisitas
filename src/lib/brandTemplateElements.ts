import type { TemplateColor, VisualVariantSettings } from './brandSettings'

export type EditableColorKey =
  | 'background_color'
  | 'overlay_color'
  | 'surface_color'
  | 'raised_surface_color'
  | 'header_color'
  | 'text_color'
  | 'muted_text_color'
  | 'subtle_text_color'
  | 'border_color'
  | 'icon_color'
  | 'input_background_color'
  | 'input_text_color'
  | 'input_placeholder_color'
  | 'primary_button_color'
  | 'primary_button_text_color'
  | 'secondary_button_color'
  | 'secondary_button_text_color'
  | 'auxiliary_button_color'
  | 'auxiliary_button_text_color'
  | 'focus_color'
  | 'modal_backdrop_color'

export type EditableOpacityKey =
  | 'background_opacity'
  | 'surface_opacity'
  | 'raised_surface_opacity'
  | 'header_opacity'
  | 'text_opacity'
  | 'muted_text_opacity'
  | 'subtle_text_opacity'
  | 'border_opacity'
  | 'icon_opacity'
  | 'input_background_opacity'
  | 'input_text_opacity'
  | 'input_placeholder_opacity'
  | 'primary_button_opacity'
  | 'primary_button_text_opacity'
  | 'secondary_button_opacity'
  | 'secondary_button_text_opacity'
  | 'auxiliary_button_opacity'
  | 'auxiliary_button_text_opacity'
  | 'focus_opacity'
  | 'modal_backdrop_opacity'

export type TemplateElementGroupKey = 'backgrounds' | 'texts' | 'controls' | 'buttons'

export type TemplateElementKey =
  | 'background'
  | 'overlay'
  | 'surface'
  | 'raised-surface'
  | 'header'
  | 'input-background'
  | 'modal-backdrop'
  | 'border'
  | 'icon'
  | 'font'
  | 'muted-text'
  | 'subtle-text'
  | 'input-text'
  | 'placeholder'
  | 'focus'
  | 'primary'
  | 'primary-text'
  | 'secondary'
  | 'secondary-text'
  | 'auxiliary'
  | 'auxiliary-text'

export type TemplateElementDefinition = {
  key: TemplateElementKey
  group: TemplateElementGroupKey
  label: string
  description: string
  color: EditableColorKey
  opacity?: EditableOpacityKey
  affectedComponents: readonly string[]
}

export const brandTemplateElementGroups: ReadonlyArray<{ key: TemplateElementGroupKey; label: string }> = [
  { key: 'backgrounds', label: 'Fundos e superfícies' },
  { key: 'texts', label: 'Textos' },
  { key: 'controls', label: 'Controles e estados' },
  { key: 'buttons', label: 'Botões' },
]

// Rótulos do contrato anterior, mantidos documentados para auditoria e migração.
export const legacyTemplateElementLabels = {
  surface: 'Superfícies, cards e header',
  primary: 'Botões e destaques principais',
} as const

export const brandTemplateElements: readonly TemplateElementDefinition[] = [
  {
    key: 'background',
    group: 'backgrounds',
    label: 'Background da página',
    description: 'Define somente a cor base da página. O overlay das imagens, os campos e os modais possuem controles próprios.',
    color: 'background_color',
    affectedComponents: ['Página', 'Áreas sem imagem', 'Fallback dos templates'],
  },
  {
    key: 'overlay',
    group: 'backgrounds',
    label: 'Overlay sobre imagens',
    description: 'Controla a cor e a intensidade da camada aplicada sobre os backgrounds dos quatro templates com imagem.',
    color: 'overlay_color',
    opacity: 'background_opacity',
    affectedComponents: ['Modo Escuro 2', 'Modo Escuro 3', 'Modo Claro 2', 'Modo Claro 3'],
  },
  {
    key: 'surface',
    group: 'backgrounds',
    label: 'Cards e superfícies comuns',
    description: 'Define cards, painéis e blocos comuns. Header, modais e popovers usam tokens independentes.',
    color: 'surface_color',
    opacity: 'surface_opacity',
    affectedComponents: ['Cards', 'Painéis', 'Tabelas', 'Blocos de conteúdo'],
  },
  {
    key: 'raised-surface',
    group: 'backgrounds',
    label: 'Modais, popovers e superfícies elevadas',
    description: 'Define superfícies que precisam se destacar acima dos cards comuns.',
    color: 'raised_surface_color',
    opacity: 'raised_surface_opacity',
    affectedComponents: ['Modais', 'Popovers', 'Menus flutuantes', 'Toasts'],
  },
  {
    key: 'header',
    group: 'backgrounds',
    label: 'Background do header',
    description: 'Controla exclusivamente o fundo do cabeçalho autenticado e suas variações.',
    color: 'header_color',
    opacity: 'header_opacity',
    affectedComponents: ['Header administrativo', 'Header do colaborador'],
  },
  {
    key: 'input-background',
    group: 'backgrounds',
    label: 'Background de campos',
    description: 'Controla o fundo de inputs, selects, áreas de texto e campos compostos.',
    color: 'input_background_color',
    opacity: 'input_background_opacity',
    affectedComponents: ['Inputs', 'Selects', 'Textareas', 'Campos compostos'],
  },
  {
    key: 'modal-backdrop',
    group: 'backgrounds',
    label: 'Backdrop de modais',
    description: 'Controla a camada que escurece ou suaviza o conteúdo atrás de modais e confirmações.',
    color: 'modal_backdrop_color',
    opacity: 'modal_backdrop_opacity',
    affectedComponents: ['Confirmações', 'Recorte de imagem', 'Apple Wallet', 'Convites'],
  },
  {
    key: 'font',
    group: 'texts',
    label: 'Texto principal',
    description: 'Controla títulos, labels, valores e textos principais sem alterar fundos, ícones ou botões.',
    color: 'text_color',
    opacity: 'text_opacity',
    affectedComponents: ['Títulos', 'Labels', 'Valores', 'Textos principais'],
  },
  {
    key: 'muted-text',
    group: 'texts',
    label: 'Texto secundário',
    description: 'Controla descrições, ajudas, metadados e textos de menor hierarquia.',
    color: 'muted_text_color',
    opacity: 'muted_text_opacity',
    affectedComponents: ['Descrições', 'Ajudas', 'Metadados', 'Navegação inativa'],
  },
  {
    key: 'subtle-text',
    group: 'texts',
    label: 'Texto sutil e desabilitado',
    description: 'Controla textos terciários, informações discretas e estados desabilitados.',
    color: 'subtle_text_color',
    opacity: 'subtle_text_opacity',
    affectedComponents: ['Textos terciários', 'Informações discretas', 'Estados desabilitados'],
  },
  {
    key: 'input-text',
    group: 'texts',
    label: 'Texto digitado em campos',
    description: 'Controla somente o conteúdo preenchido em inputs, selects e áreas de texto.',
    color: 'input_text_color',
    opacity: 'input_text_opacity',
    affectedComponents: ['Inputs preenchidos', 'Selects', 'Textareas'],
  },
  {
    key: 'placeholder',
    group: 'texts',
    label: 'Placeholder de campos',
    description: 'Controla o texto de orientação exibido antes do preenchimento dos campos.',
    color: 'input_placeholder_color',
    opacity: 'input_placeholder_opacity',
    affectedComponents: ['Placeholders', 'Exemplos de preenchimento'],
  },
  {
    key: 'border',
    group: 'controls',
    label: 'Bordas gerais',
    description: 'Controla as linhas que delimitam cards, campos, menus, modais e estados da interface.',
    color: 'border_color',
    opacity: 'border_opacity',
    affectedComponents: ['Cards', 'Campos', 'Menus', 'Modais', 'Tabelas'],
  },
  {
    key: 'icon',
    group: 'controls',
    label: 'Ícones de navegação e ações',
    description: 'Controla ícones funcionais. Ícones semânticos de sucesso, alerta e erro permanecem fixos.',
    color: 'icon_color',
    opacity: 'icon_opacity',
    affectedComponents: ['Header', 'Contatos', 'Campos', 'Ações', 'Popovers'],
  },
  {
    key: 'focus',
    group: 'controls',
    label: 'Foco e destaque ativo',
    description: 'Controla outlines, anéis de foco e destaques de campos ou controles ativos.',
    color: 'focus_color',
    opacity: 'focus_opacity',
    affectedComponents: ['Foco de campos', 'Outline de acessibilidade', 'Destaques ativos'],
  },
  {
    key: 'primary',
    group: 'buttons',
    label: 'Fundo do botão principal',
    description: 'Controla o fundo de CTAs e ações de maior prioridade, sem alterar a cor do texto do botão.',
    color: 'primary_button_color',
    opacity: 'primary_button_opacity',
    affectedComponents: ['CTA principal', 'Ação primária', 'Item ativo'],
  },
  {
    key: 'primary-text',
    group: 'buttons',
    label: 'Texto do botão principal',
    description: 'Controla exclusivamente o texto e os ícones internos dos botões principais.',
    color: 'primary_button_text_color',
    opacity: 'primary_button_text_opacity',
    affectedComponents: ['Texto do CTA principal', 'Ícones do botão principal'],
  },
  {
    key: 'secondary',
    group: 'buttons',
    label: 'Fundo do botão secundário',
    description: 'Controla o fundo de ações secundárias, filtros, tiles e estados de hover intermediários.',
    color: 'secondary_button_color',
    opacity: 'secondary_button_opacity',
    affectedComponents: ['Botões secundários', 'Filtros', 'Tiles', 'Hover da navegação'],
  },
  {
    key: 'secondary-text',
    group: 'buttons',
    label: 'Texto do botão secundário',
    description: 'Controla exclusivamente o texto e os ícones internos dos botões secundários.',
    color: 'secondary_button_text_color',
    opacity: 'secondary_button_text_opacity',
    affectedComponents: ['Texto de botões secundários', 'Ícones de ações secundárias'],
  },
  {
    key: 'auxiliary',
    group: 'buttons',
    label: 'Fundo do botão auxiliar',
    description: 'Controla o fundo de ações complementares e funcionalidades adicionais.',
    color: 'auxiliary_button_color',
    opacity: 'auxiliary_button_opacity',
    affectedComponents: ['Botões auxiliares', 'Ações complementares', 'Funcionalidades adicionais'],
  },
  {
    key: 'auxiliary-text',
    group: 'buttons',
    label: 'Texto do botão auxiliar',
    description: 'Controla exclusivamente o texto e os ícones internos dos botões auxiliares.',
    color: 'auxiliary_button_text_color',
    opacity: 'auxiliary_button_text_opacity',
    affectedComponents: ['Texto de botões auxiliares', 'Ícones de ações auxiliares'],
  },
]

export function getBrandTemplateElement(key: TemplateElementKey) {
  return brandTemplateElements.find((element) => element.key === key) ?? brandTemplateElements[0]
}

export function updateVisualVariantToken<K extends keyof VisualVariantSettings>(
  settings: VisualVariantSettings,
  key: K,
  value: VisualVariantSettings[K] | TemplateColor,
) {
  return { ...settings, [key]: value } as VisualVariantSettings
}
