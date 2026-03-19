import type {
  WatchlistEntry,
  SectorRanking,
  MarketOverview,
  StockDetail,
} from "./types"

export const marketOverview: MarketOverview = {
  regime: "Bull",
  exposure: "Aggressive",
  date: "2026-03-17",
  niftyClose: 23847.55,
  niftyChange: 1.24,
  stocksScanned: 50,
  trendTemplatePasses: 18,
  watchlistCount: 12,
}

export const sectorRankings: SectorRanking[] = [
  { rank: 1, sectorName: "Information Technology", avgRsScore: 18.5, stocksNearHigh: 4, totalStocks: 8, score: 85.2 },
  { rank: 2, sectorName: "Financial Services", avgRsScore: 15.2, stocksNearHigh: 3, totalStocks: 10, score: 72.8 },
  { rank: 3, sectorName: "Energy", avgRsScore: 12.8, stocksNearHigh: 2, totalStocks: 5, score: 68.4 },
  { rank: 4, sectorName: "Consumer Goods", avgRsScore: 10.1, stocksNearHigh: 2, totalStocks: 6, score: 55.3 },
  { rank: 5, sectorName: "Healthcare", avgRsScore: 8.7, stocksNearHigh: 1, totalStocks: 4, score: 48.9 },
  { rank: 6, sectorName: "Automobile", avgRsScore: 7.2, stocksNearHigh: 1, totalStocks: 5, score: 42.1 },
  { rank: 7, sectorName: "Metals & Mining", avgRsScore: 5.4, stocksNearHigh: 0, totalStocks: 3, score: 35.6 },
  { rank: 8, sectorName: "Telecom", avgRsScore: 3.1, stocksNearHigh: 0, totalStocks: 2, score: 22.4 },
]

export const watchlist: WatchlistEntry[] = [
  { rank: 1, stockId: 1, symbol: "INFY", name: "Infosys Ltd", compositeScore: 98.2, patternType: "VCP", regime: "Bull", stopLossLevel: 1842.30, sectorName: "Information Technology", sectorRank: 1, momentumScore: 36.5, fundamentalScore: 22.0, sectorScore: 20.0, technicalScore: 13.5, accumulationScore: 4.2, breakoutScore: 2.0 },
  { rank: 2, stockId: 2, symbol: "TCS", name: "Tata Consultancy Services", compositeScore: 94.7, patternType: "Base", regime: "Bull", stopLossLevel: 4120.50, sectorName: "Information Technology", sectorRank: 1, momentumScore: 34.2, fundamentalScore: 21.5, sectorScore: 20.0, technicalScore: 12.8, accumulationScore: 4.0, breakoutScore: 2.2 },
  { rank: 3, stockId: 3, symbol: "HDFCBANK", name: "HDFC Bank Ltd", compositeScore: 91.3, patternType: "Breakout", regime: "Bull", stopLossLevel: 1685.20, sectorName: "Financial Services", sectorRank: 2, momentumScore: 33.8, fundamentalScore: 20.0, sectorScore: 15.0, technicalScore: 14.0, accumulationScore: 5.5, breakoutScore: 3.0 },
  { rank: 4, stockId: 4, symbol: "RELIANCE", name: "Reliance Industries", compositeScore: 88.9, patternType: "VCP", regime: "Bull", stopLossLevel: 2450.80, sectorName: "Energy", sectorRank: 3, momentumScore: 32.1, fundamentalScore: 19.5, sectorScore: 12.0, technicalScore: 13.2, accumulationScore: 7.1, breakoutScore: 5.0 },
  { rank: 5, stockId: 5, symbol: "HCLTECH", name: "HCL Technologies", compositeScore: 86.4, patternType: "Base", regime: "Bull", stopLossLevel: 1780.40, sectorName: "Information Technology", sectorRank: 1, momentumScore: 31.5, fundamentalScore: 18.0, sectorScore: 20.0, technicalScore: 11.5, accumulationScore: 3.4, breakoutScore: 2.0 },
  { rank: 6, stockId: 6, symbol: "ICICIBANK", name: "ICICI Bank Ltd", compositeScore: 83.1, patternType: null, regime: "Bull", stopLossLevel: 1120.60, sectorName: "Financial Services", sectorRank: 2, momentumScore: 30.2, fundamentalScore: 17.5, sectorScore: 15.0, technicalScore: 12.0, accumulationScore: 5.4, breakoutScore: 3.0 },
  { rank: 7, stockId: 7, symbol: "WIPRO", name: "Wipro Ltd", compositeScore: 79.8, patternType: "VCP", regime: "Bull", stopLossLevel: 485.30, sectorName: "Information Technology", sectorRank: 1, momentumScore: 28.8, fundamentalScore: 16.0, sectorScore: 20.0, technicalScore: 10.5, accumulationScore: 2.5, breakoutScore: 2.0 },
  { rank: 8, stockId: 8, symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", compositeScore: 76.5, patternType: "Breakout", regime: "Bull", stopLossLevel: 7250.00, sectorName: "Financial Services", sectorRank: 2, momentumScore: 27.5, fundamentalScore: 15.0, sectorScore: 15.0, technicalScore: 11.0, accumulationScore: 5.0, breakoutScore: 3.0 },
  { rank: 9, stockId: 9, symbol: "SUNPHARMA", name: "Sun Pharmaceutical", compositeScore: 72.3, patternType: null, regime: "Bull", stopLossLevel: 1640.20, sectorName: "Healthcare", sectorRank: 5, momentumScore: 26.1, fundamentalScore: 14.5, sectorScore: 8.0, technicalScore: 12.2, accumulationScore: 6.5, breakoutScore: 5.0 },
  { rank: 10, stockId: 10, symbol: "TATAMOTORS", name: "Tata Motors Ltd", compositeScore: 68.7, patternType: "Base", regime: "Bull", stopLossLevel: 920.50, sectorName: "Automobile", sectorRank: 6, momentumScore: 24.3, fundamentalScore: 13.0, sectorScore: 6.0, technicalScore: 13.8, accumulationScore: 6.6, breakoutScore: 5.0 },
  { rank: 11, stockId: 11, symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", compositeScore: 65.2, patternType: null, regime: "Bull", stopLossLevel: 1520.80, sectorName: "Telecom", sectorRank: 8, momentumScore: 23.0, fundamentalScore: 12.5, sectorScore: 4.0, technicalScore: 14.2, accumulationScore: 7.5, breakoutScore: 4.0 },
  { rank: 12, stockId: 12, symbol: "LTIM", name: "LTIMindtree Ltd", compositeScore: 62.1, patternType: "VCP", regime: "Bull", stopLossLevel: 5420.30, sectorName: "Information Technology", sectorRank: 1, momentumScore: 21.5, fundamentalScore: 11.0, sectorScore: 20.0, technicalScore: 5.6, accumulationScore: 2.0, breakoutScore: 2.0 },
]

export const stockDetails: Record<string, StockDetail> = {
  INFY: {
    stock: { id: 1, symbol: "INFY", name: "Infosys Ltd", sector: "Information Technology", marketCap: 634000, isActive: true },
    latestPrice: { date: "2026-03-17", open: 1892.50, high: 1915.80, low: 1878.20, close: 1908.65, volume: 12450000 },
    indicators: { ma50: 1845.20, ma150: 1720.50, ma200: 1685.30, rsScore: 18.5, atr: 32.4, high52w: 1925.00, low52w: 1320.50 },
    scores: { momentumScore: 36.5, fundamentalScore: 22.0, sectorScore: 20.0, technicalScore: 13.5, accumulationScore: 4.2, breakoutScore: 2.0, compositeScore: 98.2 },
    fundamentals: { quarter: "Q3FY26", eps: 18.42, epsYoyGrowth: 32.5, revenue: 41250, revenueYoyGrowth: 28.3, roe: 28.5, netMargin: 18.2, peRatio: 28.4, debtToEquity: 0.12 },
    patternType: "VCP",
    stopLossLevel: 1842.30,
  },
  TCS: {
    stock: { id: 2, symbol: "TCS", name: "Tata Consultancy Services", sector: "Information Technology", marketCap: 1520000, isActive: true },
    latestPrice: { date: "2026-03-17", open: 4180.00, high: 4225.50, low: 4165.30, close: 4210.75, volume: 8920000 },
    indicators: { ma50: 4085.60, ma150: 3920.30, ma200: 3840.20, rsScore: 16.2, atr: 48.7, high52w: 4250.00, low52w: 3180.00 },
    scores: { momentumScore: 34.2, fundamentalScore: 21.5, sectorScore: 20.0, technicalScore: 12.8, accumulationScore: 4.0, breakoutScore: 2.2, compositeScore: 94.7 },
    fundamentals: { quarter: "Q3FY26", eps: 32.15, epsYoyGrowth: 28.8, revenue: 62340, revenueYoyGrowth: 24.5, roe: 42.3, netMargin: 22.1, peRatio: 32.8, debtToEquity: 0.05 },
    patternType: "Base",
    stopLossLevel: 4120.50,
  },
  HDFCBANK: {
    stock: { id: 3, symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Financial Services", marketCap: 1280000, isActive: true },
    latestPrice: { date: "2026-03-17", open: 1720.00, high: 1748.50, low: 1715.20, close: 1742.80, volume: 15680000 },
    indicators: { ma50: 1695.40, ma150: 1620.80, ma200: 1580.50, rsScore: 15.2, atr: 28.5, high52w: 1760.00, low52w: 1380.00 },
    scores: { momentumScore: 33.8, fundamentalScore: 20.0, sectorScore: 15.0, technicalScore: 14.0, accumulationScore: 5.5, breakoutScore: 3.0, compositeScore: 91.3 },
    fundamentals: { quarter: "Q3FY26", eps: 25.80, epsYoyGrowth: 35.2, revenue: 58900, revenueYoyGrowth: 22.1, roe: 16.8, netMargin: 24.5, peRatio: 22.1, debtToEquity: 0.85 },
    patternType: "Breakout",
    stopLossLevel: 1685.20,
  },
  RELIANCE: {
    stock: { id: 4, symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", marketCap: 1720000, isActive: true },
    latestPrice: { date: "2026-03-17", open: 2510.00, high: 2545.80, low: 2498.50, close: 2538.25, volume: 18250000 },
    indicators: { ma50: 2480.30, ma150: 2350.60, ma200: 2280.40, rsScore: 12.8, atr: 45.2, high52w: 2560.00, low52w: 2050.00 },
    scores: { momentumScore: 32.1, fundamentalScore: 19.5, sectorScore: 12.0, technicalScore: 13.2, accumulationScore: 7.1, breakoutScore: 5.0, compositeScore: 88.9 },
    fundamentals: { quarter: "Q3FY26", eps: 42.50, epsYoyGrowth: 26.4, revenue: 235800, revenueYoyGrowth: 21.8, roe: 12.5, netMargin: 8.2, peRatio: 28.5, debtToEquity: 0.42 },
    patternType: "VCP",
    stopLossLevel: 2450.80,
  },
}
