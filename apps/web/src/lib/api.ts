import { useState, useEffect } from "react"
import { apiFetch } from "./api-client"
import type {
  RegimeResponse,
  SectorRanking,
  WatchlistEntry,
  Stock,
  StockDetail,
  RegimeSignalsResponse,
  FiiDiiFlow,
  StrategyInfo,
  ExclusionsResponse,
  TurnaroundResponse,
} from "./types"

function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    apiFetch<T>(path)
      .then((json) => {
        if (!cancelled) {
          setData(json)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [path])

  return { data, loading, error }
}

export function useRegime() {
  return useApi<RegimeResponse>("/api/v1/regime")
}

export function useSectors() {
  return useApi<SectorRanking[]>("/api/v1/sectors")
}

export function useWatchlist(date?: string) {
  const path = date
    ? `/api/v1/watchlist?date=${date}`
    : "/api/v1/watchlist"
  return useApi<WatchlistEntry[]>(path)
}

export function useScores(symbol: string) {
  return useApi<{
    momentum_score: number
    fundamental_score: number
    sector_score: number
    technical_score: number
    accumulation_score: number
    breakout_score: number
    composite_score: number
  }>(`/api/v1/scores/${symbol}`)
}

export function useStocks() {
  return useApi<Stock[]>("/api/v1/stocks?active=true")
}

export function useStockDetail(symbol: string) {
  return useApi<StockDetail>(`/api/v1/stock/${symbol}/detail`)
}

export function useRegimeSignals() {
  return useApi<RegimeSignalsResponse>("/api/v1/regime/signals")
}

export function useFiiDii(days: number = 30) {
  return useApi<FiiDiiFlow[]>(`/api/v1/fii-dii?days=${days}`)
}

// ─── v16 hooks ──────────────────────────────────────────────────

export function useStrategyInfo() {
  return useApi<StrategyInfo>("/api/v1/strategy/info")
}

export function useExclusions(date?: string) {
  const path = date
    ? `/api/v1/exclusions?date=${date}&limit=200`
    : "/api/v1/exclusions?limit=200"
  return useApi<ExclusionsResponse>(path)
}

export function useTurnaroundWatch() {
  return useApi<TurnaroundResponse>("/api/v1/turnaround-watch")
}
