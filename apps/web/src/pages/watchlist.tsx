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
import { Separator } from "@workspace/ui/components/separator"
import { useOverview, useWatchlist, useAllScores } from "@/lib/api"
import {
  formatDate,
  patternColor,
  scoreBgClass,
  scoreTextClass,
} from "@/lib/utils"
import { StackedScoreBar, ScoreCell } from "@/components/score-bar"

interface StockRow {
  rank: number
  symbol: string
  name: string
  compositeScore: number
  patternType: string | null
  stopLossLevel: number
  sectorName: string
  sectorRank: number
  momentumScore: number
  fundamentalScore: number
  sectorScore: number
  technicalScore: number
  accumulationScore: number
  breakoutScore: number
}

function StockTable({ rows }: { rows: StockRow[] }) {
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
          <TableHead className="text-right">Stop Loss</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Breakdown</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((entry, i) => {
          const pct = (entry.compositeScore / 125) * 100
          return (
            <TableRow key={entry.symbol}>
              <TableCell className="tabular-nums text-muted-foreground">
                {entry.rank || i + 1}
              </TableCell>
              <TableCell>
                <Link
                  to={`/stock/${entry.symbol}`}
                  className="font-medium hover:underline"
                >
                  {entry.symbol}
                </Link>
                <div className="text-[10px] text-muted-foreground leading-tight max-w-32 truncate">
                  {entry.name}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 text-xs tabular-nums font-semibold ${scoreBgClass(pct)} ${scoreTextClass(pct)}`}
                >
                  {entry.compositeScore.toFixed(1)}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.momentumScore} max={40} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.fundamentalScore} max={25} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.sectorScore} max={20} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.technicalScore} max={15} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.accumulationScore} max={15} />
              </TableCell>
              <TableCell className="text-center">
                <ScoreCell value={entry.breakoutScore} max={10} />
              </TableCell>
              <TableCell>
                {entry.patternType ? (
                  <span
                    className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] font-medium ${patternColor(entry.patternType)}`}
                  >
                    {entry.patternType}
                  </span>
                ) : (
                  <span className="text-muted-foreground/40">&mdash;</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {entry.stopLossLevel
                  ? entry.stopLossLevel.toFixed(2)
                  : "\u2014"}
              </TableCell>
              <TableCell className="max-w-28 truncate text-muted-foreground">
                {entry.sectorName || "\u2014"}
              </TableCell>
              <TableCell className="min-w-44">
                <StackedScoreBar
                  momentum={entry.momentumScore}
                  fundamental={entry.fundamentalScore}
                  sector={entry.sectorScore}
                  technical={entry.technicalScore}
                  accumulation={entry.accumulationScore}
                  breakout={entry.breakoutScore}
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
  const { data: overview, loading: overviewLoading } = useOverview()
  const { data: watchlistData, loading: wlLoading } = useWatchlist()
  const { data: allScores, loading: scoresLoading } = useAllScores()

  const loading = overviewLoading || wlLoading || scoresLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading...
      </div>
    )
  }

  const wl = watchlistData || []
  const scored = allScores || []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold">Watchlist</h1>
          <p className="text-xs text-muted-foreground">
            {overview?.date
              ? `Scan results for ${formatDate(overview.date)}`
              : "Latest scan results"}
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-sky-500 dark:bg-sky-400" />
            Mom/40
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-emerald-500 dark:bg-emerald-400" />
            Fund/25
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-violet-500 dark:bg-violet-400" />
            Sect/20
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-amber-500 dark:bg-amber-400" />
            Tech/15
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-orange-500 dark:bg-orange-400" />
            Accum/15
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 bg-pink-500 dark:bg-pink-400" />
            Brk/10
          </span>
        </div>
      </div>

      <Tabs defaultValue={wl.length > 0 ? "watchlist" : "all"}>
        <TabsList>
          <TabsTrigger value="watchlist">
            Watchlist ({wl.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Scored ({scored.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <Card>
            <CardHeader>
              <CardTitle>
                {wl.length} stocks in {overview?.regime || "regime"}-filtered
                watchlist
              </CardTitle>
              <CardDescription>
                {overview?.regime === "Bear"
                  ? "Bear market: only top 5 by composite score"
                  : overview?.regime === "Neutral"
                    ? "Neutral market: top 50% of scored stocks"
                    : "Bull market: full ranked list"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wl.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12">
                  <div className="text-sm text-muted-foreground">
                    No stocks passed regime filter
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Switch to "All Scored" to see all results
                  </div>
                </div>
              ) : (
                <StockTable rows={wl} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>
                All {scored.length} stocks with composite scores
              </CardTitle>
              <CardDescription>
                Unfiltered ranking — includes stocks that didn't make the
                watchlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scored.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12">
                  <div className="text-sm text-muted-foreground">
                    No scores available
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Run the scan pipeline first
                  </div>
                </div>
              ) : (
                <StockTable rows={scored} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
