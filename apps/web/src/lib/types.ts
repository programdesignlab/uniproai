export type Regime = "Strong Bull" | "Bull" | "Weak" | "Bear" | "Full Bear"

export type PatternType = "VCP" | "Base" | "Breakout" | null

export type Tier = 1 | 2 | 3

export interface Stock {
  id: number
  symbol: string
  name: string
  sector: string
  industry?: string
  market_cap: number
  is_active: boolean
  is_asm?: boolean
  is_esm?: boolean
  promoter_holding_pct?: number | null
  fii_holding_pct?: number | null
  dii_holding_pct?: number | null
  // v16
  pledge_pct?: number | null
  beta?: number | null
  is_psu?: boolean
  sebi_fine_last_24m?: boolean
  sebi_investigation_active?: boolean
}

export interface WatchlistEntry {
  rank: number
  symbol: string
  name: string
  composite_score: number
  pattern_type: PatternType
  regime: Regime
  stop_loss_level: number
  sector_name: string
  sector_rank: number
  // score breakdown — backend sends momentum_score as null, uses scaled_score
  momentum_score: number | null
  scaled_score?: number | null
  fundamental_score: number
  sector_score: number
  technical_score: number
  accumulation_score: number
  breakout_score: number
  // enriched fields
  tier?: Tier | null
  entry_zone_low?: number | null
  entry_zone_high?: number | null
  earnings_date?: string | null
  earnings_flag?: boolean | null
  vol_scalar?: number | null
  suggested_size_pct?: number | null
  inst_flow_signal?: string | null
  inst_flow_positive?: boolean | null
  obv_bonus?: number | null
  adl_ratio?: number | null
  delivery_trend?: string | null
}

export interface SectorRanking {
  id?: number
  sector_name: string
  avg_momentum: number | null
  stock_count: number
  parent_sector?: string | null
  rank?: number
}

export interface RegimeResponse {
  regime: Regime
  date: string
  crash_warning?: boolean
}

export interface AllocationConfig {
  max_equity_pct: number
  max_positions: number
  risk_per_trade_pct: number
}

export interface StockDetail {
  stock: Stock
  latest_price: {
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
    rs_score: number
    atr: number
    high_52w: number
    low_52w: number
  } | null
  scores: {
    momentum_score: number
    fundamental_score: number
    sector_score: number
    technical_score: number
    accumulation_score: number
    breakout_score: number
    composite_score: number
  } | null
  fundamentals: {
    quarter: string
    eps: number
    eps_yoy_growth: number | null
    revenue: number
    revenue_yoy_growth: number | null
    roe: number | null
    net_margin: number | null
    pe_ratio: number | null
    debt_to_equity: number | null
  }[] | null
  pattern_type: PatternType
  stop_loss_level: number
  // v16
  monster: {
    score: number
    meets_threshold: boolean
    components: Record<string, number>
  } | null
  exclusion: {
    block_name: string
    reason: string
    data_missing: boolean
  } | null
  strategy_hash: string | null
}

export interface RegimeSignalItem {
  value: number
  label: string
  [key: string]: unknown // additional fields like nifty_close, ma200, breadth_pct, etc.
}

export interface RegimeSignalsResponse {
  date: string
  regime: string
  score: number
  crash_warning: boolean
  signals: Record<string, RegimeSignalItem>
}

export interface FiiDiiFlow {
  date: string
  fii_buy_cr?: number
  fii_sell_cr?: number
  fii_net_cr: number
  dii_buy_cr?: number
  dii_sell_cr?: number
  dii_net_cr: number
}

// ─── v16 additions ──────────────────────────────────────────────

export interface StrategyInfo {
  name: string
  version: string
  description: string
  strategy_hash: string
  exit_framework: string
  hard_blocks: number
  scoring_modules: number
  exit_phases: number
  cascade_layers: number
  monster_enabled: boolean
  fast_crash_enabled: boolean
}

export interface ExclusionEntry {
  date: string
  symbol: string
  block_name: string
  reason: string
  data_missing: boolean
  strategy_hash: string
}

export interface ExclusionsResponse {
  count: number
  exclusions: ExclusionEntry[]
}

export interface TurnaroundCandidate {
  stock_id: number
  symbol: string
  sector: string
  detected_date: string
  eps_trend: (number | null)[]
  revenue_growth_yoy: number | null
  suppressed: boolean
  suppression_reason: string | null
  status: string
}

export interface TurnaroundResponse {
  count: number
  candidates: TurnaroundCandidate[]
}

export interface ExclusionSummary {
  date: string | null
  total_excluded: number
  by_block: Record<string, number>
}
