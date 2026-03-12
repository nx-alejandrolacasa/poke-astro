export type TypeColorSet = {
  light: string
  medium: string
  dark: string
  accent: string
}

export const TYPE_COLORS: Record<string, TypeColorSet> = {
  normal: { light: '#F5F0E8', medium: '#C6B98C', dark: '#6B6744', accent: '#A8A77A' },
  fire: { light: '#FDE8D4', medium: '#F4A261', dark: '#B85E1B', accent: '#EE8130' },
  water: { light: '#D8EAFD', medium: '#6EA8E0', dark: '#2A5EA0', accent: '#6390F0' },
  electric: { light: '#FDF5D4', medium: '#F0D252', dark: '#8B7A0A', accent: '#F7D02C' },
  grass: { light: '#DAEFD4', medium: '#7CC263', dark: '#3A6A22', accent: '#7AC74C' },
  ice: { light: '#D4F0F0', medium: '#81CCC8', dark: '#2A6E6A', accent: '#96D9D6' },
  fighting: { light: '#F4D4D4', medium: '#D45353', dark: '#8B1F1A', accent: '#C22E28' },
  poison: { light: '#E8D4F0', medium: '#A768B4', dark: '#6B2F79', accent: '#A33EA1' },
  ground: { light: '#F4EAD4', medium: '#D4AD5E', dark: '#7A5F22', accent: '#E2BF65' },
  flying: { light: '#E0D8F4', medium: '#A190D0', dark: '#5A4A8B', accent: '#A98FF3' },
  psychic: { light: '#F8D4E0', medium: '#E66B8A', dark: '#8B2A4E', accent: '#F95587' },
  bug: { light: '#E4F0D4', medium: '#98B620', dark: '#5E700A', accent: '#A6B91A' },
  rock: { light: '#EDE8D4', medium: '#B69E3A', dark: '#6A5B1F', accent: '#B6A136' },
  ghost: { light: '#DCD4E8', medium: '#7B619B', dark: '#4A3068', accent: '#735797' },
  dragon: { light: '#D8D0F8', medium: '#7B4FE0', dark: '#4A1EB0', accent: '#6F35FC' },
  dark: { light: '#DED8D4', medium: '#8A6F5E', dark: '#4A3024', accent: '#705746' },
  steel: { light: '#E4E4EC', medium: '#A0A0BC', dark: '#5E5E7A', accent: '#B7B7CE' },
  fairy: { light: '#F4D8EA', medium: '#D085AD', dark: '#7A2A5A', accent: '#D685AD' },
}

export const GENERATION_THEMES = [
  { from: '#F8A4A4', to: '#A4D4E8' },
  { from: '#F4D88C', to: '#C8C8D0' },
  { from: '#E8948C', to: '#8CD4A8' },
  { from: '#8CB8E8', to: '#E8B8C8' },
  { from: '#8896A8', to: '#D0D4D8' },
  { from: '#8CA8E8', to: '#E8948C' },
  { from: '#F0C470', to: '#90B8E8' },
  { from: '#B88CD4', to: '#8CB0D8' },
  { from: '#E89090', to: '#B088D0' },
]

export function getTypeColor(typeName: string): TypeColorSet {
  return TYPE_COLORS[typeName.toLowerCase()] || TYPE_COLORS.normal
}
