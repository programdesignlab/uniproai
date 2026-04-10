import { useMemo, useState } from "react"
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
import { useExclusions } from "@/lib/api"
import { formatDate, blockNameLabel, blockNameColor } from "@/lib/utils"
import { usePageTitle } from "@/lib/use-page-title"

export function ExclusionsPage() {
  usePageTitle("Exclusions")
  const { data, loading, error } = useExclusions()
  const [blockFilter, setBlockFilter] = useState<string>("all")

  const exclusions = data?.exclusions || []

  const filtered = useMemo(() => {
    if (blockFilter === "all") return exclusions
    return exclusions.filter((e) => e.block_name === blockFilter)
  }, [exclusions, blockFilter])

  // Count by block
  const blockCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const e of exclusions) {
      counts[e.block_name] = (counts[e.block_name] || 0) + 1
    }
    return counts
  }, [exclusions])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading exclusions...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Exclusion Audit</h1>
        <p className="text-xs text-muted-foreground">
          Why stocks were excluded from the universe by hard block filters
        </p>
      </div>

      {/* Block breakdown badges */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(blockCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => (
            <button
              key={name}
              onClick={() => setBlockFilter(blockFilter === name ? "all" : name)}
              className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                blockFilter === name
                  ? "border-foreground/30 bg-foreground/5"
                  : "border-border hover:border-foreground/20"
              } ${blockNameColor(name)}`}
            >
              {blockNameLabel(name)}
              <span className="tabular-nums opacity-70">{count}</span>
            </button>
          ))}
        {blockFilter !== "all" && (
          <button
            onClick={() => setBlockFilter("all")}
            className="px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filtered.length} exclusion{filtered.length !== 1 ? "s" : ""}
            {blockFilter !== "all" && ` (${blockNameLabel(blockFilter)})`}
          </CardTitle>
          <CardDescription>
            {data?.count || 0} total exclusions in latest scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Exclusion log not available yet. Run the pipeline to generate data.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Date</TableHead>
                  <TableHead className="w-24">Symbol</TableHead>
                  <TableHead className="w-28">Block</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="w-20 text-center">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((e, i) => (
                  <TableRow key={`${e.symbol}-${e.block_name}-${i}`}>
                    <TableCell className="text-[11px] tabular-nums text-muted-foreground">
                      {formatDate(e.date)}
                    </TableCell>
                    <TableCell className="text-xs font-medium">{e.symbol}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium ${blockNameColor(e.block_name)}`}
                      >
                        {blockNameLabel(e.block_name)}
                      </span>
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">
                      {e.reason}
                    </TableCell>
                    <TableCell className="text-center">
                      {e.data_missing && (
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/15 text-amber-700 dark:text-amber-300">
                          Missing
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                      No exclusions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
