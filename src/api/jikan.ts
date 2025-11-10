// src/api/jikan.ts
export type JikanSearchResponse = {
  results: any[]; // tighten types if desired
  pagination?: { last_visible_page?: number; has_next_page?: boolean }
}

const BASE = 'https://api.jikan.moe/v4'

export async function searchAnime(query: string, page = 1, signal?: AbortSignal) {
  const q = encodeURIComponent(query)
  const url = `${BASE}/anime?q=${q}&page=${page}&limit=20`
  const res = await fetch(url, { signal })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }
  const json = await res.json()
  return json as JikanSearchResponse
}

export async function getAnimeById(id: string, signal?: AbortSignal) {
  const url = `${BASE}/anime/${id}/full`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error('Failed to fetch anime details')
  return res.json()
}
