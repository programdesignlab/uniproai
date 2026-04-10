import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { useRegime, useSectors, useWatchlist, useStrategyInfo } from "@/lib/api"
import {
  regimeColor,
  regimeAllocation,
  patternColor,
  scoreBgClass,
  scoreTextClass,
  compositeScorePct,
  formatStrategyHash,
} from "@/lib/utils"
import { StackedScoreBar } from "@/components/score-bar"
import { usePageTitle } from "@/lib/use-page-title"
import type { WatchlistEntry } from "@/lib/types"

function getMomentum(entry: WatchlistEntry): number {
  return entry.momentum_score ?? entry.scaled_score ?? 0
}

const REGIME_DESC: Record<string, string> = {
  "Strong Bull": "All breadth signals positive, broad participation, new highs dominate. Full exposure recommended.",
  Bull: "Most breadth indicators positive. Aggressive position sizing advised.",
  Weak: "Mixed signals. Moderate position sizing — reduce new entries.",
  Bear: "Weak breadth, new lows dominate. Defensive positioning — top picks only.",
  "Full Bear": "All signals negative, crash risk elevated. Cash is king — zero new exposure.",
}

export function DashboardPage() {
  usePageTitle("Overview")
  const { data: regime, loading: regimeLoading } = useRegime()
  const { data: sectors, loading: sectorsLoading } = useSectors()
  const { data: watchlistData, loading: watchlistLoading } = useWatchlist()
  const { data: strategy } = useStrategyInfo()

  if (regimeLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Connecting to backend...
      </div>
    )
  }

  if (!regime) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32">
        <div className="text-sm font-medium">No scan data</div>
        <div className="text-xs text-muted-foreground">
          Backend not responding. Check API connection.
        </div>
      </div>
    )
  }

  const rc = regimeColor(regime.regime)
  const alloc = regimeAllocation(regime.regime)
  const wl = watchlistData || []
  const topWatchlist = wl.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      {/* Regime banner */}
      <div className={`border p-4 ${rc.bg} ${rc.border}`}>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`inline-block size-2.5 ${rc.dot}`} />
              <span className={`text-sm font-semibold ${rc.text}`}>
                {regime.regime} Market
              </span>
              {regime.crash_warning && (
                <span className="inline-flex items-center border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400 animate-pulse">
                  CRASH WARNING
                </span>
              )}
            </div>
            <p className="max-w-xl text-xs text-muted-foreground leading-relaxed">
              {REGIME_DESC[regime.regime] || "Market regime not classified."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {strategy && (
              <span className="text-[10px] tabular-nums text-muted-foreground font-mono">
                {strategy.name} v{strategy.version} [{formatStrategyHash(strategy.strategy_hash)}]
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className={`text-2xl font-bold tabular-nums ${rc.text}`}>
              {wl.length}
            </span>
            <span className="text-[10px] text-muted-foreground">
              stocks in watchlist
            </span>
          </div>
        </div>
      </div>

      {/* Allocation + Pipeline stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        <div className="flex flex-col gap-1 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Regime
          </span>
          <span className={`text-2xl font-bold ${rc.text}`}>
            {regime.regime}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {regime.date}
          </span>
        </div>
        <div className="flex flex-col gap-1 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Max Equity
          </span>
          <span className="text-2xl font-bold tabular-nums">
            {alloc.max_equity_pct}%
          </span>
          <span className="text-[10px] text-muted-foreground">
            of portfolio
          </span>
        </div>
        <div className="flex flex-col gap-1 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Max Positions
          </span>
          <span className="text-2xl font-bold tabular-nums">
            {alloc.max_positions}
          </span>
          <span className="text-[10px] text-muted-foreground">
            concurrent trades
          </span>
        </div>
        <div className="flex flex-col gap-1 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Risk/Trade
          </span>
          <span className="text-2xl font-bold tabular-nums">
            {alloc.risk_per_trade_pct}%
          </span>
          <span className="text-[10px] text-muted-foreground">
            per position
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Sector Rotation — wider */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sector Rotation</CardTitle>
              <CardDescription>
                Ranked by average momentum score
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sectorsLoading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Loading sectors...
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {(sectors || []).map((sector, i) => {
                    const avgMom = sector.avg_momentum ?? 0
                    const isPositive = avgMom > 0
                    const barWidth = Math.min(
                      100,
                      Math.abs(avgMom) * 0.5
                    )
                    return (
                      <Link
                        key={sector.sector_name}
                        to={`/sectors`}
                        className="group flex items-center gap-3 hover:bg-muted/30 transition-colors -mx-1 px-1"
                      >
                        <span className="w-5 text-right text-[10px] tabular-nums text-muted-foreground">
                          {sector.rank || i + 1}
                        </span>
                        <span className="w-36 truncate text-xs">
                          {sector.sector_name}
                        </span>
                        <div className="relative flex h-4 flex-1 items-center">
                          <div
                            className={`h-full transition-all ${
                              isPositive
                                ? "bg-emerald-500/20 dark:bg-emerald-400/15"
                                : "bg-red-500/20 dark:bg-red-400/15"
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                          <span
                            className={`absolute left-1 text-[10px] tabular-nums font-medium ${
                              isPositive
                                ? "text-emerald-700 dark:text-emerald-300"
                                : "text-red-700 dark:text-red-300"
                            }`}
                          >
                            {avgMom.toFixed(1)}
                          </span>
                        </div>
                        <span className="w-8 text-right text-[10px] tabular-nums text-muted-foreground">
                          {sector.stock_count}
                        </span>
                      </Link>
                    )
                  })}
                  <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-muted-foreground">
                    <span>Avg momentum &middot; Stock count</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Ranked */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Top Ranked</CardTitle>
                <CardDescription>
                  Highest composite scores across all modules
                </CardDescription>
              </div>
              <Link
                to="/watchlist"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View all {wl.length} &rarr;
              </Link>
            </CardHeader>
            <CardContent>
              {watchlistLoading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-3 border-b pb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    <span className="w-6">#</span>
                    <span className="w-24">Symbol</span>
                    <span className="w-14 text-right">Score</span>
                    <span className="w-16">Pattern</span>
                    <span className="flex-1">Score Breakdown</span>
                    <span className="w-28 text-right">Sector</span>
                  </div>
                  {topWatchlist.map((entry, i) => {
                    const pct = compositeScorePct(entry.composite_score)
                    return (
                      <div
                        key={entry.symbol}
                        className="flex items-center gap-3 border-b border-border/50 py-2.5 last:border-0"
                      >
                        <span className="w-6 text-xs tabular-nums text-muted-foreground">
                          {entry.rank || i + 1}
                        </span>
                        <div className="w-24">
                          <Link
                            to={`/stock/${entry.symbol}`}
                            className="text-xs font-medium hover:underline"
                          >
                            {entry.symbol}
                          </Link>
                        </div>
                        <div className="w-14 text-right">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 text-xs tabular-nums font-semibold ${scoreBgClass(pct)} ${scoreTextClass(pct)}`}
                          >
                            {entry.composite_score.toFixed(1)}
                          </span>
                        </div>
                        <div className="w-16">
                          {entry.pattern_type ? (
                            <span
                              className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] font-medium ${patternColor(entry.pattern_type)}`}
                            >
                              {entry.pattern_type}
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/50">
                              &mdash;
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <StackedScoreBar
                            momentum={getMomentum(entry)}
                            fundamental={entry.fundamental_score}
                            sector={entry.sector_score}
                            technical={entry.technical_score}
                            accumulation={entry.accumulation_score}
                            breakout={entry.breakout_score}
                          />
                        </div>
                        <span className="w-28 text-right text-[10px] text-muted-foreground truncate">
                          {entry.sector_name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Score distribution — quick view of all watchlist stocks */}
      {wl.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>
              All {wl.length} watchlist stocks — click any to view details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {wl.map((s) => {
                const pct = compositeScorePct(s.composite_score)
                return (
                  <Link
                    key={s.symbol}
                    to={`/stock/${s.symbol}`}
                    className={`group flex flex-col items-center border p-1.5 transition-colors hover:border-foreground/30 ${scoreBgClass(pct)}`}
                    title={`${s.symbol}: ${s.composite_score.toFixed(1)}`}
                  >
                    <span className="text-[9px] font-medium group-hover:underline">
                      {s.symbol}
                    </span>
                    <span
                      className={`text-[10px] tabular-nums font-semibold ${scoreTextClass(pct)}`}
                    >
                      {s.composite_score.toFixed(0)}
                    </span>
                  </Link>
                )
              })}
            </div>
            <Separator className="my-3" />
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 bg-emerald-500/15" />
                75%+
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 bg-amber-500/15" />
                50-74%
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 bg-orange-500/15" />
                25-49%
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block size-2 bg-muted" />
                &lt;25%
              </span>
              <span className="ml-auto">Composite score (250 cap)</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
