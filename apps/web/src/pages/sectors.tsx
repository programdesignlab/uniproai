import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { useSectors, useWatchlist } from "@/lib/api"
import { compositeScorePct, scoreBgClass, scoreTextClass } from "@/lib/utils"
import { usePageTitle } from "@/lib/use-page-title"

export function SectorsPage() {
  usePageTitle("Sectors")
  const { data: sectors, loading: sectorsLoading } = useSectors()
  const { data: watchlist } = useWatchlist()
  const [selectedSector, setSelectedSector] = useState<string | null>(null)

  const filteredStocks = selectedSector
    ? (watchlist || []).filter((s) => s.sector_name === selectedSector)
    : []

  if (sectorsLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading sectors...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Sector Analysis</h1>
        <p className="text-xs text-muted-foreground">
          Sectors ranked by average momentum score
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sector Rankings</CardTitle>
          <CardDescription>
            Click a sector to see its stocks from the watchlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Sector</TableHead>
                {sectors?.[0]?.parent_sector != null && (
                  <TableHead>Parent</TableHead>
                )}
                <TableHead className="text-right">Avg Momentum</TableHead>
                <TableHead className="text-right">Stocks</TableHead>
                <TableHead>Strength</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(sectors || []).map((sector, i) => {
                const avgMom = sector.avg_momentum ?? 0
                const isPositive = avgMom > 0
                const barWidth = Math.min(100, Math.abs(avgMom) * 0.5)
                const isSelected = selectedSector === sector.sector_name
                return (
                  <TableRow
                    key={sector.sector_name}
                    className={`cursor-pointer transition-colors ${isSelected ? "bg-muted/50" : "hover:bg-muted/30"}`}
                    onClick={() =>
                      setSelectedSector(
                        isSelected ? null : sector.sector_name
                      )
                    }
                  >
                    <TableCell className="tabular-nums text-muted-foreground">
                      {sector.rank || i + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {sector.sector_name}
                    </TableCell>
                    {sectors?.[0]?.parent_sector != null && (
                      <TableCell className="text-muted-foreground">
                        {sector.parent_sector || "\u2014"}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <span
                        className={`tabular-nums font-medium ${
                          isPositive
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {avgMom.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {sector.stock_count}
                    </TableCell>
                    <TableCell className="min-w-32">
                      <div className="h-3 w-full bg-muted/30">
                        <div
                          className={`h-full transition-all ${
                            isPositive
                              ? "bg-emerald-500/30 dark:bg-emerald-400/20"
                              : "bg-red-500/30 dark:bg-red-400/20"
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Filtered stocks view */}
      {selectedSector && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedSector}</CardTitle>
            <CardDescription>
              {filteredStocks.length} stocks from watchlist in this sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStocks.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No watchlist stocks in this sector
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-right">Composite</TableHead>
                    <TableHead className="text-right">Momentum</TableHead>
                    <TableHead>Pattern</TableHead>
                    <TableHead className="text-right">Stop Loss</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map((s, i) => {
                    const pct = compositeScorePct(s.composite_score)
                    return (
                      <TableRow key={s.symbol}>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {i + 1}
                        </TableCell>
                        <TableCell>
                          <Link
                            to={`/stock/${s.symbol}`}
                            className="font-medium hover:underline"
                          >
                            {s.symbol}
                          </Link>
                          <div className="text-[10px] text-muted-foreground">
                            {s.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 text-xs tabular-nums font-semibold ${scoreBgClass(pct)} ${scoreTextClass(pct)}`}
                          >
                            {s.composite_score.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {(s.momentum_score ?? s.scaled_score ?? 0).toFixed(1)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {s.pattern_type || "\u2014"}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {s.stop_loss_level
                            ? s.stop_loss_level.toFixed(2)
                            : "\u2014"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
