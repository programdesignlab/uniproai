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
    case "Bull":
      return {
        bg: "bg-emerald-500/10 dark:bg-emerald-400/10",
        border: "border-emerald-500/20 dark:border-emerald-400/20",
        text: "text-emerald-700 dark:text-emerald-300",
        dot: "bg-emerald-500",
      }
    case "Neutral":
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
    default:
      return {
        bg: "bg-muted",
        border: "border-border",
        text: "text-muted-foreground",
        dot: "bg-muted-foreground",
      }
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
