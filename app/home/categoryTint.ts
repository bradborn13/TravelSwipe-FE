// Each category name maps to one stable pale tint with the dark of its own hue as ink,
// so "Café" reads the same colour on every card and in the filters.
const TINTS = ['blue', 'green', 'teal', 'rose'] as const

// FNV-1a: spreads short, similar names (Bar, Cocktail Bar) across the tints
function hash(name: string) {
  let h = 0x811c9dc5
  for (const c of name) {
    h ^= c.codePointAt(0)!
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function categoryTint(name: string) {
  const tint = TINTS[hash(name) % TINTS.length]
  return { background: `var(--cat-${tint}-bg)`, color: `var(--cat-${tint}-ink)` }
}
