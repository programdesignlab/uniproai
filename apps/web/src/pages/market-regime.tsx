import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { useRegime, useRegimeSignals, useFiiDii, useStrategyInfo } from "@/lib/api"
import { regimeColor, regimeAllocation, formatDate, formatCompact, formatStrategyHash } from "@/lib/utils"
import { usePageTitle } from "@/lib/use-page-title"
import type { Regime } from "@/lib/types"

const ALL_REGIMES: Regime[] = ["Strong Bull", "Bull", "Weak", "Bear", "Full Bear"]

const REGIME_DESCRIPTIONS: Record<string, string> = {
  "Strong Bull": "All breadth signals positive. Full exposure, aggressive sizing.",
  Bull: "Most signals positive. High exposure with normal risk limits.",
  Weak: "Mixed breadth. Reduce exposure, tighter stops.",
  Bear: "Weak breadth, rising new lows. Defensive — top picks only.",
  "Full Bear": "All signals negative. Zero new exposure, preserve capital.",
}

export function MarketRegimePage() {
  usePageTitle("Market Regime")
  const { data: regime, loading: regimeLoading } = useRegime()
  const { data: signals, loading: signalsLoading, error: signalsError } = useRegimeSignals()
  const { data: fiiDii, loading: fiiLoading, error: fiiError } = useFiiDii(30)
  const { data: strategy } = useStrategyInfo()

  if (regimeLoading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading regime data...
      </div>
    )
  }

  if (!regime) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32">
        <div className="text-sm font-medium">No regime data</div>
        <div className="text-xs text-muted-foreground">
          Backend not responding.
        </div>
      </div>
    )
  }

  const rc = regimeColor(regime.regime)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Market Regime</h1>
        <p className="text-xs text-muted-foreground">
          Current market conditions and position sizing rules
        </p>
      </div>

      {/* Current regime card */}
      <div className={`border p-5 ${rc.bg} ${rc.border}`}>
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className={`inline-block size-3 ${rc.dot}`} />
              <span className={`text-lg font-bold ${rc.text}`}>
                {regime.regime}
              </span>
              <span className="text-xs text-muted-foreground">
                as of {formatDate(regime.date)}
              </span>
            </div>
            <p className="max-w-lg text-xs text-muted-foreground leading-relaxed">
              {REGIME_DESCRIPTIONS[regime.regime]}
            </p>
          </div>
          {regime.crash_warning && (
            <span className="inline-flex items-center border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 animate-pulse">
              CRASH WARNING ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Allocation table for all 5 regimes */}
      <Card>
        <CardHeader>
          <CardTitle>Position Sizing Rules</CardTitle>
          <CardDescription>
            Allocation limits per regime — current regime highlighted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-px bg-border">
            {ALL_REGIMES.map((r) => {
              const alloc = regimeAllocation(r)
              const rColor = regimeColor(r)
              const isCurrent = r === regime.regime
              return (
                <div
                  key={r}
                  className={`flex flex-col gap-3 bg-background p-4 ${
                    isCurrent ? `ring-2 ring-inset ${rColor.border.replace("border-", "ring-")}` : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block size-2 ${rColor.dot}`} />
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent ? rColor.text : "text-muted-foreground"
                      }`}
                    >
                      {r}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-muted-foreground">Max Equity</span>
                      <span className="text-xs tabular-nums font-medium">
                        {alloc.max_equity_pct}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-muted-foreground">Positions</span>
                      <span className="text-xs tabular-nums font-medium">
                        {alloc.max_positions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] text-muted-foreground">Risk/Trade</span>
                      <span className="text-xs tabular-nums font-medium">
                        {alloc.risk_per_trade_pct}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Strategy & Fast Crash */}
      {strategy && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Version</span>
                  <span className="text-xs font-medium">{strategy.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Hash</span>
                  <span className="text-xs font-mono tabular-nums">{formatStrategyHash(strategy.strategy_hash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Exit Framework</span>
                  <span className="text-xs font-medium">{strategy.exit_framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Hard Blocks</span>
                  <span className="text-xs tabular-nums">{strategy.hard_blocks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Scoring Modules</span>
                  <span className="text-xs tabular-nums">{strategy.scoring_modules}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fast Crash Detector</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Status</span>
                  <span className={`text-xs font-semibold ${strategy.fast_crash_enabled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                    {strategy.fast_crash_enabled ? "Armed" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Trigger</span>
                  <span className="text-xs">Nifty -8% in 5 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Response</span>
                  <span className="text-xs">Sell 50% all positions</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Exit Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Phases</span>
                  <span className="text-xs tabular-nums">{strategy.exit_phases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Cascade Layers</span>
                  <span className="text-xs tabular-nums">{strategy.cascade_layers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Monster Detection</span>
                  <span className={`text-xs font-semibold ${strategy.monster_enabled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                    {strategy.monster_enabled ? "Active" : "Off"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Breadth signals */}
        <Card>
          <CardHeader>
            <CardTitle>Breadth Signals</CardTitle>
            <CardDescription>
              6 market breadth indicators driving regime classification
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signalsLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Loading signals...
              </div>
            ) : signalsError ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <div className="mb-2">Endpoint not available yet</div>
                <div className="text-[10px]">Waiting for /api/v1/regime/signals</div>
              </div>
            ) : signals ? (
              <div className="flex flex-col">
                <div className="flex items-center justify-between py-2 border-b border-border/30">
                  <span className="text-xs font-medium">Regime Score</span>
                  <span className="text-sm tabular-nums font-bold">
                    {signals.score.toFixed(1)} / 6
                  </span>
                </div>
                {Object.entries(signals.signals).map(([key, signal]) => {
                  const passed = signal.value > 0
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                    >
                      <span className="text-xs">{signal.label}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex size-5 items-center justify-center text-[10px] font-bold ${
                            passed
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-red-500/10 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {passed ? "\u2713" : "\u2715"}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* FII/DII flows */}
        <Card>
          <CardHeader>
            <CardTitle>FII/DII Flows</CardTitle>
            <CardDescription>
              Last 30 days of institutional flows (in Cr)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fiiLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Loading flows...
              </div>
            ) : fiiError ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                <div className="mb-2">Endpoint not available yet</div>
                <div className="text-[10px]">Waiting for /api/v1/fii-dii</div>
              </div>
            ) : fiiDii && fiiDii.length > 0 ? (
              <div className="flex flex-col">
                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 pb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      FII Net (30d)
                    </span>
                    {(() => {
                      const total = fiiDii.reduce((s, d) => s + d.fii_net_cr, 0)
                      return (
                        <span
                          className={`text-lg font-bold tabular-nums ${
                            total >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {total >= 0 ? "+" : ""}
                          {formatCompact(total)}
                        </span>
                      )
                    })()}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      DII Net (30d)
                    </span>
                    {(() => {
                      const total = fiiDii.reduce((s, d) => s + d.dii_net_cr, 0)
                      return (
                        <span
                          className={`text-lg font-bold tabular-nums ${
                            total >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {total >= 0 ? "+" : ""}
                          {formatCompact(total)}
                        </span>
                      )
                    })()}
                  </div>
                </div>
                <Separator className="mb-3" />
                {/* Recent days */}
                <div className="flex flex-col max-h-64 overflow-y-auto">
                  <div className="flex items-center gap-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground border-b">
                    <span className="w-20">Date</span>
                    <span className="flex-1 text-right">FII Net</span>
                    <span className="flex-1 text-right">DII Net</span>
                  </div>
                  {fiiDii.slice(0, 15).map((d) => (
                    <div
                      key={d.date}
                      className="flex items-center gap-3 py-1.5 border-b border-border/30 last:border-0"
                    >
                      <span className="w-20 text-[10px] tabular-nums text-muted-foreground">
                        {formatDate(d.date)}
                      </span>
                      <span
                        className={`flex-1 text-right text-xs tabular-nums font-medium ${
                          d.fii_net_cr >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {d.fii_net_cr >= 0 ? "+" : ""}
                        {formatCompact(d.fii_net_cr)}
                      </span>
                      <span
                        className={`flex-1 text-right text-xs tabular-nums font-medium ${
                          d.dii_net_cr >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {d.dii_net_cr >= 0 ? "+" : ""}
                        {formatCompact(d.dii_net_cr)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
