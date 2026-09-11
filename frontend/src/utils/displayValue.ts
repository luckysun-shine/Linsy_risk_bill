export function displayValue(
  value: string | number | null | undefined,
  fallback = '--'
): string {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '--'
  return `￥${amount.toLocaleString('zh-CN')}`
}

export function formatDateLabel(dateStr: string | null | undefined): string {
  if (!dateStr) return '--'
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  return `${parts[0]}年${Number(parts[1])}月${Number(parts[2])}日`
}
