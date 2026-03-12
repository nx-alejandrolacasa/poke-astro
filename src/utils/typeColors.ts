/**
 * Returns the CSS scoping class for a Pokémon type.
 * Add this to a parent element, then use .pt-* utility classes on children.
 * Example: <div className={ptypeClass('fire')}><span className="pt-badge">Fire</span></div>
 */
export function ptypeClass(typeName: string): string {
  return `ptype-${typeName.toLowerCase()}`
}

/**
 * Returns the generation header gradient class.
 */
export function genHeaderClass(genId: number): string {
  return `gen-header-${genId}`
}

/**
 * Returns the generation card class for the home page.
 */
export function genCardClass(genId: number): string {
  return `gen-card-${genId}`
}
