import { useState, useEffect } from "react"

function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
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
  }, [url])

  return { data, loading, error }
}

export function useOverview() {
  return useApi<{
    regime: string
    exposure: string
    date: string
    stocksScanned: number
    trendTemplatePasses: number
    watchlistCount: number
  }>("/api/overview")
}

export function useSectors() {
  return useApi<
    {
      rank: number
      sectorName: string
      avgRsScore: number
      stocksNearHigh: number
      totalStocks: number
      score: number
    }[]
  >("/api/sectors")
}

export function useWatchlist() {
  return useApi<
    {
      rank: number
      stockId: number
      symbol: string
      name: string
      compositeScore: number
      patternType: string | null
      regime: string
      stopLossLevel: number
      sectorName: string
      sectorRank: number
      momentumScore: number
      fundamentalScore: number
      sectorScore: number
      technicalScore: number
      accumulationScore: number
      breakoutScore: number
    }[]
  >("/api/watchlist")
}

export function useAllScores() {
  return useApi<
    {
      rank: number
      symbol: string
      name: string
      compositeScore: number
      patternType: string | null
      regime: string
      stopLossLevel: number
      sectorName: string
      sectorRank: number
      momentumScore: number
      fundamentalScore: number
      sectorScore: number
      technicalScore: number
      accumulationScore: number
      breakoutScore: number
    }[]
  >("/api/scores")
}

export function useStockDetail(symbol: string) {
  return useApi<{
    stock: {
      id: number
      symbol: string
      name: string
      sector: string
      marketCap: number
      isActive: boolean
    }
    latestPrice: {
      date: string
      open: number
      high: number
      low: number
      close: number
      volume: number
    } | null
    indicators: {
      ma50: number
      ma150: number
      ma200: number
      rsScore: number
      atr: number
      high52w: number
      low52w: number
    } | null
    scores: {
      momentumScore: number
      fundamentalScore: number
      sectorScore: number
      technicalScore: number
      accumulationScore: number
      breakoutScore: number
      compositeScore: number
    } | null
    fundamentals: {
      quarter: string
      eps: number
      epsYoyGrowth: number
      revenue: number
      revenueYoyGrowth: number
      roe: number
      netMargin: number
      peRatio: number
      debtToEquity: number
    } | null
    patternType: string | null
    stopLossLevel: number
  }>(`/api/stock/${symbol}`)
}
