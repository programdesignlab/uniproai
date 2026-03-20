/** Compact stacked horizontal bar showing all 6 score modules */
export function StackedScoreBar({
  momentum,
  fundamental,
  sector,
  technical,
  accumulation,
  breakout,
}: {
  momentum: number
  fundamental: number
  sector: number
  technical: number
  accumulation: number
  breakout: number
}) {
  const segments = [
    { value: momentum, max: 200, color: "bg-sky-500 dark:bg-sky-400", label: "Mom" },
    { value: fundamental, max: 20, color: "bg-emerald-500 dark:bg-emerald-400", label: "Fund" },
    { value: sector, max: 10, color: "bg-violet-500 dark:bg-violet-400", label: "Sect" },
    { value: technical, max: 15, color: "bg-amber-500 dark:bg-amber-400", label: "Tech" },
    { value: accumulation, max: 11, color: "bg-orange-500 dark:bg-orange-400", label: "Accum" },
    { value: breakout, max: 10, color: "bg-pink-500 dark:bg-pink-400", label: "Brk" },
  ]
  // Theoretical max = 200+20+10+15+11+10 = 266, but use 246 as practical denominator
  const composite = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0)
  const denominator = Math.max(composite, 246)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-2 w-full overflow-hidden bg-muted/50">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} transition-all`}
            style={{ width: `${(Math.max(0, seg.value) / denominator) * 100}%` }}
            title={`${seg.label}: ${seg.value.toFixed(1)}/${seg.max}`}
          />
        ))}
      </div>
      <div className="flex gap-2 text-[9px] text-muted-foreground">
        {segments.map((seg) => (
          <span key={seg.label} className="tabular-nums">
            <span
              className={`mr-0.5 inline-block size-1.5 ${seg.color}`}
            />
            {seg.value.toFixed(0)}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Score gauge with colored fill — supports negative min values */
export function ScoreGauge({
  label,
  sublabel,
  value,
  max,
  min = 0,
  color,
}: {
  label: string
  sublabel?: string
  value: number
  max: number
  min?: number
  color: string
}) {
  const range = max - min
  const zeroOffset = min < 0 ? (Math.abs(min) / range) * 100 : 0
  const valuePct = ((value - min) / range) * 100
  const isNegative = value < 0

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium">{label}</span>
          {sublabel && (
            <span className="text-[10px] text-muted-foreground">
              {sublabel}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-sm tabular-nums font-semibold ${isNegative ? "text-red-600 dark:text-red-400" : ""}`}>
            {value.toFixed(1)}
          </span>
          <span className="text-[10px] text-muted-foreground">/{max}</span>
        </div>
      </div>
      <div className="relative h-1.5 w-full bg-muted/50">
        {min < 0 && (
          <div
            className="absolute top-0 h-full w-px bg-foreground/30"
            style={{ left: `${zeroOffset}%` }}
          />
        )}
        {isNegative ? (
          <div
            className="absolute top-0 h-full bg-red-500/50 transition-all"
            style={{
              left: `${valuePct}%`,
              width: `${zeroOffset - valuePct}%`,
            }}
          />
        ) : (
          <div
            className={`absolute top-0 h-full ${color} transition-all`}
            style={{
              left: `${zeroOffset}%`,
              width: `${valuePct - zeroOffset}%`,
            }}
          />
        )}
      </div>
    </div>
  )
}

/** Compact score cell with heat-map background */
export function ScoreCell({
  value,
  max,
}: {
  value: number
  max: number
}) {
  const pct = max > 0 ? (Math.max(0, value) / max) * 100 : 0
  let bg = "bg-muted/30"
  let text = "text-muted-foreground"
  if (value < 0) {
    bg = "bg-red-500/10 dark:bg-red-400/10"
    text = "text-red-700 dark:text-red-300"
  } else if (pct >= 75) {
    bg = "bg-emerald-500/15 dark:bg-emerald-400/10"
    text = "text-emerald-700 dark:text-emerald-300"
  } else if (pct >= 50) {
    bg = "bg-amber-500/10 dark:bg-amber-400/10"
    text = "text-amber-700 dark:text-amber-300"
  } else if (pct >= 30) {
    bg = "bg-orange-500/10 dark:bg-orange-400/10"
    text = "text-orange-700 dark:text-orange-300"
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] tabular-nums font-medium ${bg} ${text}`}
    >
      {value.toFixed(1)}
    </span>
  )
}
