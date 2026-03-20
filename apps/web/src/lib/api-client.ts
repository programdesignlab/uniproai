const API_BASE = import.meta.env.VITE_API_BASE || ""
const NEON_AUTH_URL = import.meta.env.VITE_NEON_AUTH_URL || ""

async function getJwt(): Promise<string | null> {
  try {
    const res = await fetch(`${NEON_AUTH_URL}/token`, { credentials: "include" })
    if (!res.ok) return null
    const data = await res.json()
    return data?.token ?? null
  } catch {
    return null
  }
}

export async function apiFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {}

  const token = await getJwt()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const url = `${API_BASE}${path}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.json()
}
