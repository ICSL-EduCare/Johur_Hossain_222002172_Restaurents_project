// Money & date helpers (currency: Bangladeshi Taka)
const moneyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const CURRENCY = '৳'
export const VAT_RATE = 0.05 // 5% VAT

export function money(value) {
  return `${CURRENCY} ${moneyFormatter.format(Number(value) || 0)}`
}

export function plainMoney(value) {
  return `BDT ${moneyFormatter.format(Number(value) || 0)}`
}

export function dateTime(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(iso) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff} min ago`
  const hours = Math.round(diff / 60)
  if (hours < 24) return `${hours} h ago`
  return `${Math.round(hours / 24)} d ago`
}
