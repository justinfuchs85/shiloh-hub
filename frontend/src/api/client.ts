import type { PayloadListResponse } from '../types'

const BASE = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

// Generic collection helpers
export const api = {
  list: <T>(collection: string, params?: Record<string, string | number>) => {
    const qs = params ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString() : ''
    return request<PayloadListResponse<T>>(`/${collection}${qs}`)
  },

  getAll: async <T>(collection: string, extra?: Record<string, string | number>): Promise<T[]> => {
    const res = await api.list<T>(collection, { limit: 200, ...extra })
    return res.docs
  },

  get: <T>(collection: string, id: string | number) =>
    request<T>(`/${collection}/${id}`),

  create: <T>(collection: string, data: Partial<T>) =>
    request<T>(`/${collection}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: <T>(collection: string, id: string | number, data: Partial<T>) =>
    request<T>(`/${collection}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (collection: string, id: string | number) =>
    request<{ message: string }>(`/${collection}/${id}`, { method: 'DELETE' }),

  getGlobal: <T>(slug: string) =>
    request<T>(`/globals/${slug}`),

  updateGlobal: <T>(slug: string, data: Partial<T>) =>
    request<T>(`/globals/${slug}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Upload a file to the media collection
export async function uploadMedia(file: File): Promise<{ id: number; url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(`${BASE}/api/media`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  const doc = await res.json()
  return { id: doc.doc?.id ?? doc.id, url: doc.doc?.url ?? doc.url }
}
