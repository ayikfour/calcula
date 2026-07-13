export const CATEGORY_COLORS: Record<string, string> = {
  'Groceries': '#f0a868',
  'Snack': '#e0a8d8',
  'Food': '#e8847c',
  'Services': '#9b8cd9',
  'Drink': '#c9976b',
  'Commute': '#6ba3d6',
  'Pet': '#d6c178',
  'Lend': '#7bc9a8',
  'Health': '#8fd3c7',
  'Laundry': '#a8b8c9',
}

const FALLBACK_COLOR = '#8a8a8a'

export function categoryColor(name: string): string {
  return CATEGORY_COLORS[name] ?? FALLBACK_COLOR
}
