import type { TemplateColor, VisualVariantSettings } from './brandSettings'

export type EditableColorKey =
  | 'background_color'
  | 'surface_color'
  | 'border_color'
  | 'icon_color'
  | 'primary_button_color'
  | 'secondary_button_color'
  | 'auxiliary_button_color'

export type EditableOpacityKey =
  | 'background_opacity'
  | 'surface_opacity'
  | 'border_opacity'
  | 'icon_opacity'
  | 'primary_button_opacity'
  | 'secondary_button_opacity'
  | 'auxiliary_button_opacity'

export type TemplateElementKey =
  | 'background'
  | 'surface'
  | 'border'
  | 'icon'
  | 'font'
  | 'primary'
  | 'secondary'
  | 'auxiliary'

export type TemplateElementDefinition = {
  key: TemplateElementKey
  label: string
  description: string
  color?: EditableColorKey
  opacity?: EditableOpacityKey
  affectedComponents: readonly string[]
}

export const brandTemplateElements: readonly TemplateElementDefinition[] = [
  {
    key: 'background',
    label: 'Background da página',
    description: 'Define a cor base e a opacidade aplicada sobre imagens. Também participa da composição do fundo de inputs e do backdrop de modais.',
    color: 'background_color',
    opacity: 'background_opacity',
    affectedComponents: ['Página', 'Overlay de imagem', 'Inputs', 'Backdrop de modal'],
  },
  {
    key: 'surface',
    label: 'Superfícies, cards e header',
    description: 'Define cards e superfícies. O header deriva desta cor com uma mistura técnica fixa de 88% para preservar contraste e legibilidade.',
    color: 'surface_color',
    opacity: 'surface_opacity',
    affectedComponents: ['Cards', 'Header', 'Modais', 'Popovers', 'Tabelas'],
  },
  {
    key: 'border',
    label: 'Bordas de cards, header e campos',
    description: 'Controla a cor e a opacidade das linhas que delimitam componentes e estados da interface.',
    color: 'border_color',
    opacity: 'border_opacity',
    affectedComponents: ['Cards', 'Header', 'Inputs', 'Menus', 'Modais'],
  },
  {
    key: 'icon',
    label: 'Ícones de navegação e ações',
    description: 'Controla ícones funcionais. Cores semânticas de sucesso, alerta e erro permanecem institucionais e fixas.',
    color: 'icon_color',
    opacity: 'icon_opacity',
    affectedComponents: ['Header', 'Contatos', 'Inputs', 'Botões', 'Popovers'],
  },
  {
    key: 'font',
    label: 'Texto e tipografia institucional',
    description: 'A família Inter/sistema, os pesos e os tamanhos são padronizados. A cor do texto é definida automaticamente para cada família clara ou escura.',
    affectedComponents: ['Títulos', 'Textos', 'Labels', 'Placeholders derivados'],
  },
  {
    key: 'primary',
    label: 'Botões e destaques principais',
    description: 'Controla CTAs, item ativo da navegação, foco dos campos e outros destaques de maior prioridade.',
    color: 'primary_button_color',
    opacity: 'primary_button_opacity',
    affectedComponents: ['CTA principal', 'Item ativo', 'Foco', 'Indicadores'],
  },
  {
    key: 'secondary',
    label: 'Botões e superfícies secundárias',
    description: 'Controla ações secundárias e participa dos estados de hover da navegação e de tiles intermediários.',
    color: 'secondary_button_color',
    opacity: 'secondary_button_opacity',
    affectedComponents: ['Botões secundários', 'Hover da navegação', 'Tiles', 'Filtros'],
  },
  {
    key: 'auxiliary',
    label: 'Botões e ações auxiliares',
    description: 'Controla ações complementares, funcionalidades adicionais e superfícies auxiliares.',
    color: 'auxiliary_button_color',
    opacity: 'auxiliary_button_opacity',
    affectedComponents: ['Botões auxiliares', 'Funcionalidades adicionais', 'Ações complementares'],
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
