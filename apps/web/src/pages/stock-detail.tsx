import { useParams, Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { useStockDetail } from "@/lib/api"
import { usePageTitle } from "@/lib/use-page-title"
import {
  formatCurrency,
  formatVolume,
  changeClass,
  patternColor,
  scoreTextClass,
  compositeScorePct,
} from "@/lib/utils"
import { ScoreGauge } from "@/components/score-bar"

function StatRow({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs tabular-nums font-medium ${className || ""}`}>
        {value}
      </span>
    </div>
  )
}

function TrendCheck({
  label,
  passed,
  detail,
}: {
  label: string
  passed: boolean
  detail: string
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-border/30 last:border-0">
      <span
        className={`inline-flex size-4 items-center justify-center text-[10px] font-bold ${
          passed
            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
            : "bg-red-500/10 text-red-600/60 dark:text-red-400/60"
        }`}
      >
        {passed ? "\u2713" : "\u2715"}
      </span>
      <span className="flex-1 text-xs">{label}</span>
      <span className="text-[10px] tabular-nums text-muted-foreground">
        {detail}
      </span>
    </div>
  )
}

export function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>()
  usePageTitle(symbol ?? "Stock")
  const { data: detail, loading, error } = useStockDetail(symbol || "")

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading {symbol}...
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <div className="text-sm font-medium">Not found</div>
        <p className="text-xs text-muted-foreground">
          No data available for{" "}
          <span className="font-medium text-foreground">{symbol}</span>
        </p>
        <Link to="/watchlist" className="text-xs underline">
          Back to watchlist
        </Link>
      </div>
    )
  }

  const { stock, latest_price, indicators, scores } = detail
  const fundamentals = Array.isArray(detail.fundamentals)
    ? detail.fundamentals[0] ?? null
    : detail.fundamentals
  const priceChange =
    latest_price && latest_price.open > 0
      ? ((latest_price.close - latest_price.open) / latest_price.open) * 100
      : 0
  const distFrom52wHigh =
    indicators && indicators.high_52w > 0 && latest_price
      ? ((indicators.high_52w - latest_price.close) / indicators.high_52w) * 100
      : 0
  const pricePctOf52wH =
    indicators && indicators.high_52w > 0 && latest_price
      ? (latest_price.close / indicators.high_52w) * 100
      : 0

  const compositePct = scores ? compositeScorePct(scores.composite_score) : 0

  // Trend template conditions
  const trendConditions =
    latest_price && indicators
      ? [
          {
            label: "Price > 50 DMA",
            passed: latest_price.close > indicators.ma50,
            detail: `${formatCurrency(latest_price.close)} vs ${formatCurrency(indicators.ma50)}`,
          },
          {
            label: "Price > 150 DMA",
            passed: latest_price.close > indicators.ma150,
            detail: `${formatCurrency(latest_price.close)} vs ${formatCurrency(indicators.ma150)}`,
          },
          {
            label: "Price > 200 DMA",
            passed: latest_price.close > indicators.ma200,
            detail: `${formatCurrency(latest_price.close)} vs ${formatCurrency(indicators.ma200)}`,
          },
          {
            label: "50 DMA > 150 DMA",
            passed: indicators.ma50 > indicators.ma150,
            detail: `${formatCurrency(indicators.ma50)} vs ${formatCurrency(indicators.ma150)}`,
          },
          {
            label: "150 DMA > 200 DMA",
            passed: indicators.ma150 > indicators.ma200,
            detail: `${formatCurrency(indicators.ma150)} vs ${formatCurrency(indicators.ma200)}`,
          },
          {
            label: "Within 25% of 52W high",
            passed: pricePctOf52wH >= 75,
            detail: `${pricePctOf52wH.toFixed(1)}% of high`,
          },
        ]
      : []

  const trendPassCount = trendConditions.filter((c) => c.passed).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <Link
            to="/watchlist"
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to watchlist
          </Link>
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-bold">{stock.symbol}</h1>
            <span className="text-sm text-muted-foreground">{stock.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {detail.pattern_type && (
            <span
              className={`inline-flex items-center border px-2 py-1 text-[11px] font-medium ${patternColor(detail.pattern_type)}`}
            >
              {detail.pattern_type}
            </span>
          )}
          <Badge variant="secondary">{stock.sector || "Unknown"}</Badge>
        </div>
      </div>

      {/* Hero stats row */}
      <div className="grid grid-cols-5 gap-px bg-border">
        {/* Price */}
        <div className="flex flex-col gap-0.5 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Close
          </span>
          {latest_price ? (
            <>
              <span className="text-2xl font-bold tabular-nums">
                {formatCurrency(latest_price.close)}
              </span>
              <span
                className={`text-xs tabular-nums font-medium ${changeClass(priceChange)}`}
              >
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)}%
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No data</span>
          )}
        </div>

        {/* Composite score with ring chart */}
        <div className="flex flex-col gap-0.5 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Composite
          </span>
          {scores ? (
            <>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl font-bold tabular-nums ${scoreTextClass(compositePct)}`}
                >
                  {scores.composite_score.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">/250</span>
              </div>
              <div className="mt-0.5 h-1.5 w-full bg-muted/50">
                <div
                  className={`h-full transition-all ${compositePct >= 60 ? "bg-emerald-500" : compositePct >= 40 ? "bg-amber-500" : "bg-orange-500"}`}
                  style={{ width: `${compositePct}%` }}
                />
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">Not scored</span>
          )}
        </div>

        {/* 52W range */}
        <div className="flex flex-col gap-0.5 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            52W Range
          </span>
          {indicators && latest_price ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-xs tabular-nums text-muted-foreground">
                  {formatCurrency(indicators.low_52w)}
                </span>
                <span className="text-muted-foreground">&mdash;</span>
                <span className="text-xs tabular-nums font-medium">
                  {formatCurrency(indicators.high_52w)}
                </span>
              </div>
              <div className="relative mt-1 h-1.5 w-full bg-muted/50">
                <div
                  className="absolute top-0 h-full bg-foreground/20"
                  style={{
                    left: "0%",
                    width: `${Math.min(100, pricePctOf52wH)}%`,
                  }}
                />
                <div
                  className="absolute top-[-2px] h-[calc(100%+4px)] w-px bg-foreground"
                  style={{
                    left: `${Math.min(100, ((latest_price.close - indicators.low_52w) / (indicators.high_52w - indicators.low_52w)) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {distFrom52wHigh.toFixed(1)}% from high
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No data</span>
          )}
        </div>

        {/* Volume */}
        <div className="flex flex-col gap-0.5 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Volume
          </span>
          {latest_price ? (
            <>
              <span className="text-lg font-bold tabular-nums">
                {formatVolume(latest_price.volume)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {latest_price.date?.toString().split("T")[0]}
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No data</span>
          )}
        </div>

        {/* Stop Loss */}
        <div className="flex flex-col gap-0.5 bg-background p-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Stop Loss
          </span>
          {detail.stop_loss_level > 0 && latest_price ? (
            <>
              <span className="text-lg font-bold tabular-nums">
                {formatCurrency(detail.stop_loss_level)}
              </span>
              <span className="text-[10px] text-red-600 dark:text-red-400 tabular-nums">
                {(
                  ((latest_price.close - detail.stop_loss_level) /
                    latest_price.close) *
                  100
                ).toFixed(1)}
                % risk
              </span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">N/A</span>
          )}
        </div>
      </div>

      {/* Main content */}
      <Tabs defaultValue="scores">
        <TabsList>
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="trend">
            Trend Template ({trendPassCount}/6)
          </TabsTrigger>
          <TabsTrigger value="technicals">Technicals</TabsTrigger>
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
        </TabsList>

        <TabsContent value="scores">
          {scores ? (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Module Breakdown</CardTitle>
                  <CardDescription>
                    6 scoring modules — composite uncapped
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <ScoreGauge
                    label="Momentum"
                    sublabel="Multi-timeframe returns + relative strength"
                    value={scores.momentum_score}
                    max={200}
                    color="bg-sky-500 dark:bg-sky-400"
                  />
                  <ScoreGauge
                    label="Fundamental"
                    sublabel="CANSLIM: EPS, revenue, ROE growth filters"
                    value={scores.fundamental_score}
                    max={20}
                    min={-5}
                    color="bg-emerald-500 dark:bg-emerald-400"
                  />
                  <ScoreGauge
                    label="Sector"
                    sublabel="Sector momentum rotation ranking"
                    value={scores.sector_score}
                    max={10}
                    min={-5}
                    color="bg-violet-500 dark:bg-violet-400"
                  />
                  <ScoreGauge
                    label="Technical"
                    sublabel="Minervini 6-condition trend template"
                    value={scores.technical_score}
                    max={15}
                    color="bg-amber-500 dark:bg-amber-400"
                  />
                  <ScoreGauge
                    label="Accumulation"
                    sublabel="Delivery trends, OBV, ADL, inst flow"
                    value={scores.accumulation_score}
                    max={11}
                    color="bg-orange-500 dark:bg-orange-400"
                  />
                  <ScoreGauge
                    label="Breakout"
                    sublabel="VCP, base, resistance, volume breakout"
                    value={scores.breakout_score}
                    max={10}
                    color="bg-pink-500 dark:bg-pink-400"
                  />
                </CardContent>
              </Card>

              {/* Score summary with ring chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Composite Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="relative flex size-40 items-center justify-center">
                      <svg
                        className="absolute inset-0 -rotate-90"
                        viewBox="0 0 160 160"
                      >
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          className="stroke-muted"
                          strokeWidth="8"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          fill="none"
                          className={
                            compositePct >= 60
                              ? "stroke-emerald-500"
                              : compositePct >= 40
                                ? "stroke-amber-500"
                                : "stroke-orange-500"
                          }
                          strokeWidth="8"
                          strokeDasharray={`${(Math.min(compositePct, 100) / 100) * 440} 440`}
                          strokeLinecap="butt"
                        />
                      </svg>
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-3xl font-bold tabular-nums ${scoreTextClass(compositePct)}`}
                        >
                          {scores.composite_score.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          of 250
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Score module chips */}
                    <div className="grid w-full grid-cols-3 gap-2">
                      {[
                        { label: "Mom", value: scores.momentum_score, max: 200, color: "bg-sky-500" },
                        { label: "Fund", value: scores.fundamental_score, max: 20, color: "bg-emerald-500" },
                        { label: "Sect", value: scores.sector_score, max: 10, color: "bg-violet-500" },
                        { label: "Tech", value: scores.technical_score, max: 15, color: "bg-amber-500" },
                        { label: "Accum", value: scores.accumulation_score, max: 11, color: "bg-orange-500" },
                        { label: "Brk", value: scores.breakout_score, max: 10, color: "bg-pink-500" },
                      ].map((m) => (
                        <div
                          key={m.label}
                          className="flex items-center gap-2 border p-2"
                        >
                          <span
                            className={`inline-block size-2 ${m.color}`}
                          />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground">
                              {m.label}
                            </span>
                            <span className="text-xs tabular-nums font-semibold">
                              {m.value.toFixed(1)}
                              <span className="text-[10px] text-muted-foreground font-normal">
                                /{m.max}
                              </span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-xs text-muted-foreground">
                No scores available for this stock.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trend">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Minervini Trend Template
                </CardTitle>
                <CardDescription>
                  All 6 conditions must pass for a stock to be considered in an
                  established uptrend
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col">
                {trendConditions.length > 0 ? (
                  <>
                    {trendConditions.map((c) => (
                      <TrendCheck key={c.label} {...c} />
                    ))}
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Result</span>
                      <span
                        className={`text-xs font-semibold ${
                          trendPassCount === 6
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {trendPassCount === 6
                          ? "PASSES"
                          : `FAILS (${trendPassCount}/6)`}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No indicator data to evaluate
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moving Average Stack</CardTitle>
                <CardDescription>
                  Price position relative to key moving averages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {indicators && latest_price ? (
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Price", value: latest_price.close, isPrice: true },
                      { label: "50 DMA", value: indicators.ma50 },
                      { label: "150 DMA", value: indicators.ma150 },
                      { label: "200 DMA", value: indicators.ma200 },
                    ]
                      .sort((a, b) => b.value - a.value)
                      .map((item) => {
                        const maxVal = Math.max(
                          latest_price.close,
                          indicators.ma50,
                          indicators.ma150,
                          indicators.ma200
                        )
                        const barWidth = (item.value / maxVal) * 100
                        return (
                          <div
                            key={item.label}
                            className="flex items-center gap-3"
                          >
                            <span
                              className={`w-16 text-right text-xs ${
                                item.isPrice
                                  ? "font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {item.label}
                            </span>
                            <div className="relative flex-1 h-5">
                              <div
                                className={`h-full transition-all ${
                                  item.isPrice
                                    ? "bg-foreground/15"
                                    : "bg-muted"
                                }`}
                                style={{ width: `${barWidth}%` }}
                              />
                              <span
                                className={`absolute right-1 top-0.5 text-[10px] tabular-nums ${
                                  item.isPrice
                                    ? "font-semibold"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {formatCurrency(item.value)}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No indicator data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technicals">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Action</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                {latest_price ? (
                  <>
                    <StatRow label="Open" value={formatCurrency(latest_price.open)} />
                    <StatRow label="High" value={formatCurrency(latest_price.high)} />
                    <StatRow label="Low" value={formatCurrency(latest_price.low)} />
                    <StatRow label="Close" value={formatCurrency(latest_price.close)} />
                    <StatRow label="Volume" value={formatVolume(latest_price.volume)} />
                    {latest_price.high > 0 && (
                      <StatRow
                        label="Day Range"
                        value={`${(((latest_price.high - latest_price.low) / latest_price.low) * 100).toFixed(2)}%`}
                      />
                    )}
                  </>
                ) : (
                  <div className="py-4 text-xs text-muted-foreground">
                    No price data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Indicators</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                {indicators ? (
                  <>
                    <StatRow
                      label="Relative Strength vs Nifty"
                      value={`${indicators.rs_score > 0 ? "+" : ""}${indicators.rs_score.toFixed(1)}%`}
                      className={changeClass(indicators.rs_score)}
                    />
                    <StatRow
                      label="ATR (14d)"
                      value={formatCurrency(indicators.atr)}
                    />
                    <StatRow
                      label="52W High"
                      value={formatCurrency(indicators.high_52w)}
                    />
                    <StatRow
                      label="52W Low"
                      value={formatCurrency(indicators.low_52w)}
                    />
                    <StatRow
                      label="From 52W High"
                      value={`-${distFrom52wHigh.toFixed(1)}%`}
                      className={
                        distFrom52wHigh < 10
                          ? "text-emerald-600 dark:text-emerald-400"
                          : distFrom52wHigh < 25
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                      }
                    />
                    {stock.market_cap > 0 && (
                      <StatRow
                        label="Market Cap"
                        value={`${(stock.market_cap / 100).toFixed(0)} Cr`}
                      />
                    )}
                  </>
                ) : (
                  <div className="py-4 text-xs text-muted-foreground">
                    No indicator data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fundamentals">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Earnings &amp; Revenue
                  {fundamentals ? ` (${fundamentals.quarter})` : ""}
                </CardTitle>
                <CardDescription>
                  CANSLIM requires EPS &ge; 25% and Revenue &ge; 20% YoY
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col">
                {fundamentals ? (
                  <>
                    <StatRow
                      label="EPS"
                      value={fundamentals.eps?.toFixed(2) ?? "\u2014"}
                    />
                    {fundamentals.eps_yoy_growth != null && (
                      <StatRow
                        label="EPS YoY Growth"
                        value={`${fundamentals.eps_yoy_growth >= 0 ? "+" : ""}${fundamentals.eps_yoy_growth.toFixed(1)}%`}
                        className={
                          fundamentals.eps_yoy_growth >= 25
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      />
                    )}
                    <StatRow
                      label="Revenue"
                      value={fundamentals.revenue ? `${fundamentals.revenue.toLocaleString("en-IN")} Cr` : "\u2014"}
                    />
                    {fundamentals.revenue_yoy_growth != null && (
                      <StatRow
                        label="Revenue YoY Growth"
                        value={`${fundamentals.revenue_yoy_growth >= 0 ? "+" : ""}${fundamentals.revenue_yoy_growth.toFixed(1)}%`}
                        className={
                          fundamentals.revenue_yoy_growth >= 20
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      />
                    )}
                  </>
                ) : (
                  <div className="py-4 text-xs text-muted-foreground">
                    No fundamental data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valuation &amp; Health</CardTitle>
                <CardDescription>
                  CANSLIM requires ROE &ge; 15%
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col">
                {fundamentals ? (
                  <>
                    {fundamentals.roe != null && (
                      <StatRow
                        label="ROE"
                        value={`${fundamentals.roe.toFixed(1)}%`}
                        className={
                          fundamentals.roe >= 15
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      />
                    )}
                    {fundamentals.net_margin != null && (
                      <StatRow
                        label="Net Margin"
                        value={`${fundamentals.net_margin.toFixed(1)}%`}
                      />
                    )}
                    {fundamentals.pe_ratio != null && (
                      <StatRow
                        label="P/E Ratio"
                        value={fundamentals.pe_ratio.toFixed(1)}
                      />
                    )}
                    {fundamentals.debt_to_equity != null && (
                      <StatRow
                        label="Debt/Equity"
                        value={fundamentals.debt_to_equity.toFixed(2)}
                        className={
                          fundamentals.debt_to_equity < 0.5
                            ? "text-emerald-600 dark:text-emerald-400"
                            : fundamentals.debt_to_equity < 1
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                        }
                      />
                    )}
                    {stock.market_cap > 0 && (
                      <StatRow
                        label="Market Cap"
                        value={`${stock.market_cap.toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr`}
                      />
                    )}
                  </>
                ) : (
                  <div className="py-4 text-xs text-muted-foreground">
                    No fundamental data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
