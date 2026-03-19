export type Regime = "Bull" | "Neutral" | "Bear"

export type PatternType = "VCP" | "Base" | "Breakout" | null

export interface Stock {
  id: number
  symbol: string
  name: string
  sector: string
  marketCap: number // crores
  isActive: boolean
}

export interface WatchlistEntry {
  rank: number
  stockId: number
  symbol: string
  name: string
  compositeScore: number
  patternType: PatternType
  regime: Regime
  stopLossLevel: number
  sectorName: string
  sectorRank: number
  // score breakdown
  momentumScore: number
  fundamentalScore: number
  sectorScore: number
  technicalScore: number
  accumulationScore: number
  breakoutScore: number
}

export interface SectorRanking {
  rank: number
  sectorName: string
  avgRsScore: number
  stocksNearHigh: number
  totalStocks: number
  score: number
}

export interface MarketOverview {
  regime: Regime
  exposure: string
  date: string
  niftyClose: number
  niftyChange: number
  stocksScanned: number
  trendTemplatePasses: number
  watchlistCount: number
}

export interface StockDetail {
  stock: Stock
  latestPrice: {
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }
  indicators: {
    ma50: number
    ma150: number
    ma200: number
    rsScore: number
    atr: number
    high52w: number
    low52w: number
  }
  scores: {
    momentumScore: number
    fundamentalScore: number
    sectorScore: number
    technicalScore: number
    accumulationScore: number
    breakoutScore: number
    compositeScore: number
  }
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
  }
  patternType: PatternType
  stopLossLevel: number
}
