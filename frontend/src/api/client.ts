const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || '/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface ApiEnvelope<T> {
  success: boolean
  data?: T
  error?: { message: string; code?: string }
}

function buildUrl(path: string, params?: Record<string, string>): string {
  const base = API_BASE.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''

  // 绝对地址（生产 / 局域网直连后端）
  if (/^https?:\/\//i.test(base)) {
    return `${base}${normalizedPath}${query}`
  }

  // 相对地址（开发态走 Vite proxy：/api -> localhost:3000）
  return `${base}${normalizedPath}${query}`
}

export async function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const res = await fetch(buildUrl(path, params), {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  const body = (await res.json()) as ApiEnvelope<T>
  if (!res.ok || !body.success) {
    throw new ApiError(body.error?.message ?? res.statusText, res.status)
  }
  return body.data as T
}
