import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { useStocks, useSectors } from "@/lib/api"
import { formatCompact } from "@/lib/utils"
import { usePageTitle } from "@/lib/use-page-title"
type SortKey = "symbol" | "name" | "sector" | "market_cap"
type SortDir = "asc" | "desc"

export function ScreenerPage() {
  usePageTitle("Universe")
  const { data: stocks, loading: stocksLoading } = useStocks()
  const { data: sectors } = useSectors()

  const [sectorFilter, setSectorFilter] = useState<string>("all")
  const [asmFilter, setAsmFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("market_cap")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const sectorNames = useMemo(() => {
    if (!sectors) return []
    return sectors.map((s) => s.sector_name).sort()
  }, [sectors])

  const filtered = useMemo(() => {
    let list = stocks || []
    if (sectorFilter !== "all") {
      list = list.filter((s) => s.sector === sectorFilter)
    }
    if (asmFilter === "asm") {
      list = list.filter((s) => s.is_asm)
    } else if (asmFilter === "esm") {
      list = list.filter((s) => s.is_esm)
    } else if (asmFilter === "clean") {
      list = list.filter((s) => !s.is_asm && !s.is_esm)
    }
    return list
  }, [stocks, sectorFilter, asmFilter])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case "symbol":
          cmp = a.symbol.localeCompare(b.symbol)
          break
        case "name":
          cmp = a.name.localeCompare(b.name)
          break
        case "sector":
          cmp = (a.sector || "").localeCompare(b.sector || "")
          break
        case "market_cap":
          cmp = (a.market_cap || 0) - (b.market_cap || 0)
          break
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return copy
  }, [filtered, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir(key === "symbol" || key === "name" ? "asc" : "desc")
    }
  }

  function SortHeader({
    label,
    field,
    className,
  }: {
    label: string
    field: SortKey
    className?: string
  }) {
    const active = sortKey === field
    return (
      <TableHead
        className={`cursor-pointer select-none hover:text-foreground ${className || ""}`}
        onClick={() => toggleSort(field)}
      >
        {label}
        {active && (
          <span className="ml-1 text-[9px]">
            {sortDir === "asc" ? "\u25B2" : "\u25BC"}
          </span>
        )}
      </TableHead>
    )
  }

  if (stocksLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading universe...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Stock Universe</h1>
        <p className="text-xs text-muted-foreground">
          {(stocks || []).length} active stocks — filter and sort to find candidates
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sector:</span>
          <Select value={sectorFilter} onValueChange={(v) => setSectorFilter(v || "all")}>
            <SelectTrigger className="h-8 w-48 text-xs">
              <SelectValue placeholder="All sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sectors</SelectItem>
              {sectorNames.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">ASM/ESM:</span>
          <Select value={asmFilter} onValueChange={(v) => setAsmFilter(v || "all")}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="clean">Clean only</SelectItem>
              <SelectItem value="asm">ASM only</SelectItem>
              <SelectItem value="esm">ESM only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="ml-auto text-xs text-muted-foreground">
          {sorted.length} results
        </span>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <SortHeader label="Symbol" field="symbol" />
                <SortHeader label="Name" field="name" />
                <SortHeader label="Sector" field="sector" />
                <SortHeader label="Market Cap" field="market_cap" className="text-right" />
                <TableHead className="text-right">Promoter</TableHead>
                <TableHead className="text-right">FII</TableHead>
                <TableHead className="text-right">DII</TableHead>
                <TableHead className="text-right">Pledge</TableHead>
                <TableHead className="text-right">Beta</TableHead>
                <TableHead className="text-center">Flags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((stock, i) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {i + 1}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/stock/${stock.symbol}`}
                      className="font-medium hover:underline"
                    >
                      {stock.symbol}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-48 truncate text-muted-foreground">
                    {stock.name}
                  </TableCell>
                  <TableCell className="max-w-32 truncate text-muted-foreground">
                    {stock.sector || "\u2014"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {stock.market_cap
                      ? formatCompact(stock.market_cap)
                      : "\u2014"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {stock.promoter_holding_pct != null
                      ? `${stock.promoter_holding_pct.toFixed(1)}%`
                      : "\u2014"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {stock.fii_holding_pct != null
                      ? `${stock.fii_holding_pct.toFixed(1)}%`
                      : "\u2014"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {stock.dii_holding_pct != null
                      ? `${stock.dii_holding_pct.toFixed(1)}%`
                      : "\u2014"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {stock.pledge_pct != null && stock.pledge_pct > 0
                      ? <span className={stock.pledge_pct > 20 ? "text-red-600 dark:text-red-400" : ""}>{(stock.pledge_pct * 100).toFixed(1)}%</span>
                      : "\u2014"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {stock.beta != null
                      ? <span className={stock.beta > 2.5 ? "text-red-600 dark:text-red-400" : ""}>{stock.beta.toFixed(2)}</span>
                      : "\u2014"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {stock.is_psu && (
                        <span className="inline-flex items-center border border-sky-500/20 bg-sky-500/10 px-1 py-0.5 text-[8px] font-medium text-sky-700 dark:text-sky-300">
                          PSU
                        </span>
                      )}
                      {stock.is_asm && (
                        <span className="inline-flex items-center border border-amber-500/20 bg-amber-500/10 px-1 py-0.5 text-[8px] font-medium text-amber-700 dark:text-amber-300">
                          ASM
                        </span>
                      )}
                      {stock.is_esm && (
                        <span className="inline-flex items-center border border-red-500/20 bg-red-500/10 px-1 py-0.5 text-[8px] font-medium text-red-700 dark:text-red-300">
                          ESM
                        </span>
                      )}
                      {stock.sebi_fine_last_24m && (
                        <span className="inline-flex items-center border border-rose-500/20 bg-rose-500/10 px-1 py-0.5 text-[8px] font-medium text-rose-700 dark:text-rose-300">
                          SEBI
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
