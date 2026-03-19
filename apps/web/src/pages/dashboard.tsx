import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { useOverview, useSectors, useWatchlist, useAllScores } from "@/lib/api"
import { regimeColor, patternColor, scoreBgClass, scoreTextClass } from "@/lib/utils"
import { StackedScoreBar, ScoreCell } from "@/components/score-bar"

const REGIME_DESC: Record<string, string> = {
  Bull: "Nifty above 200 DMA, broad participation, new highs dominate. Full exposure recommended.",
  Neutral: "Mixed signals. 2 of 3 breadth indicators positive. Moderate position sizing advised.",
  Bear: "Nifty below 200 DMA, weak breadth, new lows dominate. Defensive positioning — top 5 only.",
}

export function DashboardPage() {
  const { data: overview, loading: overviewLoading } = useOverview()
  const { data: sectors, loading: sectorsLoading } = useSectors()
  const { data: watchlistData, loading: watchlistLoading } = useWatchlist()
  const { data: allScores } = useAllScores()

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Connecting to database...
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32">
        <div className="text-sm font-medium">No scan data</div>
        <div className="text-xs text-muted-foreground">
          Run the pipeline first:{" "}
          <code className="bg-muted px-1.5 py-0.5">
            PYTHONPATH=src uv run python main.py run
          </code>
        </div>
      </div>
    )
  }

  const rc = regimeColor(overview.regime)
  const topWatchlist = (watchlistData || []).slice(0, 5)
  const scored = allScores || []
  const trendPct = overview.stocksScanned > 0
    ? Math.round((overview.trendTemplatePasses / overview.stocksScanned) * 100)
    : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Regime banner */}
      <div className={`border p-4 ${rc.bg} ${rc.border}`}>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`inline-block size-2.5 ${rc.dot}`} />
              <span className={`text-sm font-semibold ${rc.text}`}>
                {overview.regime} Market
              </span>
              <span className="text-xs text-muted-foreground">
                &middot; {overview.exposure} exposure
              </span>
            </div>
            <p className="max-w-xl text-xs text-muted-foreground leading-relaxed">
              {REGIME_DESC[overview.regime] || "Market regime not classified."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className={`text-2xl font-bold tabular-nums ${rc.text}`}>
              {overview.watchlistCount}
            </span>
            <span className="text-[10px] text-muted-foreground">
              stocks in watchlist
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline stats */}
      <div className="grid grid-cols-4 gap-px bg-border">
        {[
          {
            label: "Universe",
            value: overview.stocksScanned,
            sub: "Nifty 50 constituents",
          },
          {
            label: "Trend Template",
            value: overview.trendTemplatePasses,
            sub: `${trendPct}% pass rate`,
            highlight: trendPct > 50,
          },
          {
            label: "Total Scored",
            value: scored.length,
            sub: "with composite > 0",
          },
          {
            label: "Watchlist",
            value: overview.watchlistCount,
            sub: `regime-filtered (${overview.regime})`,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 bg-background p-4"
          >
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
            <span className="text-2xl font-bold tabular-nums">
              {stat.value}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Sector Rotation — wider */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sector Rotation</CardTitle>
              <CardDescription>
                Ranked by relative strength vs Nifty 50
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sectorsLoading ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Loading sectors...
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {(sectors || []).map((sector) => {
                    const isPositive = sector.avgRsScore > 0
                    const barWidth = Math.min(
                      100,
                      Math.abs(sector.avgRsScore) * 3
                    )
                    return (
                      <div
                        key={sector.sectorName}
                        className="group flex items-center gap-3"
                      >
                        <span className="w-5 text-right text-[10px] tabular-nums text-muted-foreground">
                          {sector.rank}
                        </span>
                        <span className="w-36 truncate text-xs">
                          {sector.sectorName}
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
                            {isPositive ? "+" : ""}
                            {sector.avgRsScore}%
                          </span>
                        </div>
                        <span className="w-12 text-right text-[10px] tabular-nums text-muted-foreground">
                          {sector.stocksNearHigh}/{sector.totalStocks}
                        </span>
                      </div>
                    )
                  })}
                  <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-muted-foreground">
                    <span>Stocks near 52w high / total</span>
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
                View all {scored.length} &rarr;
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
                  {/* Use watchlist if available, else top scored */}
                  {(topWatchlist.length > 0
                    ? topWatchlist
                    : scored.slice(0, 8)
                  ).map((entry, i) => {
                    const pct = (entry.compositeScore / 125) * 100
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
                            {entry.compositeScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="w-16">
                          {entry.patternType ? (
                            <span
                              className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] font-medium ${patternColor(entry.patternType)}`}
                            >
                              {entry.patternType}
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/50">
                              &mdash;
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <StackedScoreBar
                            momentum={entry.momentumScore}
                            fundamental={entry.fundamentalScore}
                            sector={entry.sectorScore}
                            technical={entry.technicalScore}
                            accumulation={entry.accumulationScore}
                            breakout={entry.breakoutScore}
                          />
                        </div>
                        <span className="w-28 text-right text-[10px] text-muted-foreground truncate">
                          {entry.sectorName}
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

      {/* Score distribution — quick view of all 50 stocks */}
      {scored.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>
              All {scored.length} scored stocks — click any to view details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {scored.map((s) => {
                const pct = (s.compositeScore / 125) * 100
                return (
                  <Link
                    key={s.symbol}
                    to={`/stock/${s.symbol}`}
                    className={`group flex flex-col items-center border p-1.5 transition-colors hover:border-foreground/30 ${scoreBgClass(pct)}`}
                    title={`${s.symbol}: ${s.compositeScore.toFixed(1)}/125`}
                  >
                    <span className="text-[9px] font-medium group-hover:underline">
                      {s.symbol}
                    </span>
                    <span
                      className={`text-[10px] tabular-nums font-semibold ${scoreTextClass(pct)}`}
                    >
                      {s.compositeScore.toFixed(0)}
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
              <span className="ml-auto">Score out of 125</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
