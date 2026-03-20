import { Link } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { useRegime, useWatchlist } from "@/lib/api"
import {
  formatDate,
  patternColor,
  scoreBgClass,
  scoreTextClass,
  compositeScorePct,
  tierLabel,
  tierColor,
} from "@/lib/utils"
import { StackedScoreBar, ScoreCell } from "@/components/score-bar"
import type { WatchlistEntry, Tier } from "@/lib/types"

/** Backend sends momentum_score as null in watchlist; use scaled_score instead */
function getMomentum(entry: WatchlistEntry): number {
  return entry.momentum_score ?? entry.scaled_score ?? 0
}

function StockTable({ rows }: { rows: WatchlistEntry[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">#</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead className="text-right">Score</TableHead>
          <TableHead className="text-center">Mom</TableHead>
          <TableHead className="text-center">Fund</TableHead>
          <TableHead className="text-center">Sect</TableHead>
          <TableHead className="text-center">Tech</TableHead>
          <TableHead className="text-center">Accum</TableHead>
          <TableHead className="text-center">Brk</TableHead>
          <TableHead>Pattern</TableHead>
          <TableHead className="text-right">Entry Zone</TableHead>
          <TableHead className="text-right">Stop Loss</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Breakdown</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((entry, i) => {
          const pct = compositeScorePct(entry.composite_score)
          return (
            <TableRow key={entry.symbol}>
              <TableCell className="tabular-nums text-muted-foreground">
                {entry.rank || i + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/stock/${entry.symbol}`}
                    className="font-medium hover:underline"
                  >
                    {entry.symbol}
                  </Link>
                  {entry.tier && (
                    <span className={`inline-flex items-center border px-1 py-0.5 text-[8px] font-medium ${tierColor(entry.tier)}`}>
                      T{entry.tier}
                    </span>
                  )}
                  {entry.earnings_flag && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400" title={`Earnings: ${entry.earnings_date || "soon"}`}>
                      E
                    </span>
                  )}
                  {entry.inst_flow_positive && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400" title={`Inst: ${entry.inst_flow_signal}`}>
                      I
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight max-w-32 truncate">
                  {entry.name}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 text-xs tabular-nums font-semibold ${scoreBgClass(pct)} ${scoreTextClass(pct)}`}
                >
                  {entry.composite_score.toFixed(1)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={getMomentum(entry)} max={200} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.fundamental_score} max={20} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.sector_score} max={10} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.technical_score} max={15} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.accumulation_score} max={11} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.breakout_score} max={10} />
              </TableCell>
              <TableCell>
                {entry.pattern_type ? (
                  <span
                    className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] font-medium ${patternColor(entry.pattern_type)}`}
                  >
                    {entry.pattern_type}
                  </span>
                ) : (
                  <span className="text-muted-foreground/40">&mdash;</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums text-[11px] text-muted-foreground">
                {entry.entry_zone_low && entry.entry_zone_high
                  ? `${entry.entry_zone_low.toFixed(0)}–${entry.entry_zone_high.toFixed(0)}`
                  : "\u2014"}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {entry.stop_loss_level
                  ? entry.stop_loss_level.toFixed(2)
                  : "\u2014"}
              </TableCell>
              <TableCell className="max-w-28 truncate text-muted-foreground">
                {entry.sector_name || "\u2014"}
              </TableCell>
              <TableCell className="min-w-44">
                <StackedScoreBar
                  momentum={getMomentum(entry)}
                  fundamental={entry.fundamental_score}
                  sector={entry.sector_score}
                  technical={entry.technical_score}
                  accumulation={entry.accumulation_score}
                  breakout={entry.breakout_score}
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function WatchlistPage() {
  const { data: regime, loading: regimeLoading } = useRegime()
  const { data: watchlistData, loading: wlLoading } = useWatchlist()

  const loading = regimeLoading || wlLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading...
      </div>
    )
  }

  const wl = watchlistData || []
  const hasTiers = wl.some((s) => s.tier != null)

  // Group by tier if enriched data available
  const tier1 = wl.filter((s) => s.tier === 1)
  const tier2 = wl.filter((s) => s.tier === 2)
  const tier3 = wl.filter((s) => s.tier === 3)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold">Watchlist</h1>
          <p className="text-xs text-muted-foreground">
            {regime?.date
              ? `Scan results for ${formatDate(regime.date)}`
              : "Latest scan results"}
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-sky-500 dark:bg-sky-400" />
            Mom/200
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-emerald-500 dark:bg-emerald-400" />
            Fund/20
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-violet-500 dark:bg-violet-400" />
            Sect/10
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-amber-500 dark:bg-amber-400" />
            Tech/15
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-orange-500 dark:bg-orange-400" />
            Accum/11
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-pink-500 dark:bg-pink-400" />
            Brk/10
          </span>
        </div>
      </div>

      {hasTiers ? (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({wl.length})</TabsTrigger>
            <TabsTrigger value="tier1">
              Tier 1 — Buy Now ({tier1.length})
            </TabsTrigger>
            <TabsTrigger value="tier2">
              Tier 2 — Near Pivot ({tier2.length})
            </TabsTrigger>
            <TabsTrigger value="tier3">
              Tier 3 — On Radar ({tier3.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>
                  {wl.length} stocks in {regime?.regime || "regime"}-filtered watchlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StockTable rows={wl} />
              </CardContent>
            </Card>
          </TabsContent>

          {([
            { key: "tier1", rows: tier1, tier: 1 as Tier },
            { key: "tier2", rows: tier2, tier: 2 as Tier },
            { key: "tier3", rows: tier3, tier: 3 as Tier },
          ]).map((t) => (
            <TabsContent key={t.key} value={t.key}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tierLabel(t.tier)} — {t.rows.length} stocks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {t.rows.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      No stocks in this tier
                    </div>
                  ) : (
                    <StockTable rows={t.rows} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {wl.length} stocks in {regime?.regime || "regime"}-filtered watchlist
            </CardTitle>
            <CardDescription>
              Ranked by composite score
            </CardDescription>
          </CardHeader>
          <CardContent>
            {wl.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12">
                <div className="text-sm text-muted-foreground">
                  No stocks in watchlist
                </div>
              </div>
            ) : (
              <StockTable rows={wl} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
