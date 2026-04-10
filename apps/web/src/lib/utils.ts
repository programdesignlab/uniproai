import type { Tier, AllocationConfig } from "./types"

export function formatDate(d: string) {
  return d.split("T")[0]
}

export function formatCurrency(n: number) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2 })
}

export function formatCompact(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `${(n / 100000).toFixed(2)} L`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString("en-IN")
}

export function formatVolume(n: number) {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`
  if (n >= 100000) return `${(n / 100000).toFixed(2)} L`
  return n.toLocaleString("en-IN")
}

/** Visual cap for composite score percentage calculations */
const COMPOSITE_CAP = 250

/** Returns percentage for composite score using 250 cap */
export function compositeScorePct(score: number): number {
  return (Math.min(score, COMPOSITE_CAP) / COMPOSITE_CAP) * 100
}

/** Returns a Tailwind-compatible HSL color for a score percentage (0-100) */
export function scoreColor(pct: number): string {
  if (pct >= 75) return "var(--color-score-high)"
  if (pct >= 50) return "var(--color-score-mid)"
  if (pct >= 25) return "var(--color-score-low)"
  return "var(--color-score-none)"
}

export function scoreTextClass(pct: number): string {
  if (pct >= 75) return "text-emerald-600 dark:text-emerald-400"
  if (pct >= 50) return "text-amber-600 dark:text-amber-400"
  if (pct >= 25) return "text-orange-600 dark:text-orange-400"
  return "text-muted-foreground"
}

export function scoreBgClass(pct: number): string {
  if (pct >= 75) return "bg-emerald-500/15 dark:bg-emerald-400/15"
  if (pct >= 50) return "bg-amber-500/15 dark:bg-amber-400/15"
  if (pct >= 25) return "bg-orange-500/15 dark:bg-orange-400/15"
  return "bg-muted"
}

export function changeClass(val: number): string {
  if (val > 0) return "text-emerald-600 dark:text-emerald-400"
  if (val < 0) return "text-red-600 dark:text-red-400"
  return "text-muted-foreground"
}

export function regimeColor(regime: string) {
  switch (regime) {
    case "Strong Bull":
      return {
        bg: "bg-green-500/10 dark:bg-green-400/10",
        border: "border-green-500/20 dark:border-green-400/20",
        text: "text-green-700 dark:text-green-300",
        dot: "bg-green-500",
      }
    case "Bull":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-400/10",
        border: "border-emerald-500/20 dark:border-emerald-400/20",
        text: "text-emerald-700 dark:text-emerald-300",
        dot: "bg-emerald-500",
      }
    case "Weak":
      return {
        bg: "bg-amber-500/10 dark:bg-amber-400/10",
        border: "border-amber-500/20 dark:border-amber-400/20",
        text: "text-amber-700 dark:text-amber-300",
        dot: "bg-amber-500",
      }
    case "Bear":
      return {
        bg: "bg-red-500/10 dark:bg-red-400/10",
        border: "border-red-500/20 dark:border-red-400/20",
        text: "text-red-700 dark:text-red-300",
        dot: "bg-red-500",
      }
    case "Full Bear":
      return {
        bg: "bg-rose-600/10 dark:bg-rose-500/10",
        border: "border-rose-600/20 dark:border-rose-500/20",
        text: "text-rose-700 dark:text-rose-300",
        dot: "bg-rose-600",
      }
    default:
      return {
        bg: "bg-muted",
        border: "border-border",
        text: "text-muted-foreground",
        dot: "bg-muted-foreground",
      }
  }
}

export function regimeAllocation(regime: string): AllocationConfig {
  switch (regime) {
    case "Strong Bull":
      return { max_equity_pct: 100, max_positions: 15, risk_per_trade_pct: 2.0 }
    case "Bull":
      return { max_equity_pct: 80, max_positions: 12, risk_per_trade_pct: 1.5 }
    case "Weak":
      return { max_equity_pct: 50, max_positions: 8, risk_per_trade_pct: 1.0 }
    case "Bear":
      return { max_equity_pct: 25, max_positions: 4, risk_per_trade_pct: 0.5 }
    case "Full Bear":
      return { max_equity_pct: 0, max_positions: 0, risk_per_trade_pct: 0 }
    default:
      return { max_equity_pct: 50, max_positions: 8, risk_per_trade_pct: 1.0 }
  }
}

export function tierLabel(tier: Tier): string {
  switch (tier) {
    case 1: return "Buy Now"
    case 2: return "Near Pivot"
    case 3: return "On Radar"
  }
}

export function tierColor(tier: Tier) {
  switch (tier) {
    case 1:
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
    case 2:
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20"
    case 3:
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20"
  }
}

export function patternColor(pattern: string | null) {
  switch (pattern) {
    case "VCP":
      return "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/20"
    case "Base":
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/20"
    case "Breakout":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20"
    default:
      return ""
  }
}

// ─── v16 helpers ────────────────────────────────────────────────

export function formatStrategyHash(hash: string): string {
  return hash.slice(0, 8)
}

export function blockNameLabel(name: string): string {
  const labels: Record<string, string> = {
    market_cap_band: "Market Cap",
    liquidity: "Liquidity",
    surveillance: "ASM/ESM",
    eps_junk: "EPS Quality",
    ocf_quality: "OCF Quality",
    promoter_pledge: "Pledge",
    sebi_fine: "SEBI Fine",
    ipo_age: "IPO Age",
    business_pivot: "Biz Pivot",
  }
  return labels[name] || name
}

export function blockNameColor(name: string): string {
  const colors: Record<string, string> = {
    market_cap_band: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    liquidity: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    surveillance: "bg-red-500/15 text-red-700 dark:text-red-300",
    eps_junk: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
    ocf_quality: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
    promoter_pledge: "bg-pink-500/15 text-pink-700 dark:text-pink-300",
    sebi_fine: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
    ipo_age: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  }
  return colors[name] || "bg-muted text-muted-foreground"
}

export function turnaroundStatusColor(status: string): string {
  switch (status) {
    case "watching":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300"
    case "cleared":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
    case "expired":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}
