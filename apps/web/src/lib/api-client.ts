import { authClient } from "./auth"

const API_BASE = import.meta.env.VITE_API_BASE || ""

export async function apiFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {}

  const { data } = await authClient.token()
  if (data?.token) {
    headers["Authorization"] = `Bearer ${data.token}`
  }

  const url = `${API_BASE}${path}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json()
}
