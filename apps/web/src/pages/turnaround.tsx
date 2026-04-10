import {
  Card,
  CardContent,
} from "@workspace/ui/components/card"
import { Link } from "react-router-dom"
import { useTurnaroundWatch } from "@/lib/api"
import { formatDate, changeClass, turnaroundStatusColor } from "@/lib/utils"
import { usePageTitle } from "@/lib/use-page-title"
import type { TurnaroundCandidate } from "@/lib/types"

function EpsTrendBar({ trend }: { trend: (number | null)[] }) {
  if (!trend || trend.length === 0) return null

  const values = trend.map((v) => v ?? 0)
  const maxAbs = Math.max(...values.map(Math.abs), 1)

  return (
    <div className="flex items-end gap-px h-6">
      {values.map((v, i) => {
        const height = Math.abs(v) / maxAbs
        return (
          <div
            key={i}
            className={`w-2.5 transition-all ${
              v > 0
                ? "bg-emerald-500/60 dark:bg-emerald-400/50"
                : v < 0
                  ? "bg-red-500/60 dark:bg-red-400/50"
                  : "bg-muted"
            }`}
            style={{ height: `${Math.max(height * 100, 8)}%` }}
            title={`Q${trend.length - i}: ${v.toFixed(2)}`}
          />
        )
      })}
    </div>
  )
}

function CandidateCard({ candidate }: { candidate: TurnaroundCandidate }) {
  const isSuppressed = candidate.suppressed

  return (
    <Card className={isSuppressed ? "opacity-50" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Link
                to={`/stock/${candidate.symbol}`}
                className="text-sm font-semibold hover:underline"
              >
                {candidate.symbol}
              </Link>
              <span
                className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium ${turnaroundStatusColor(candidate.status)}`}
              >
                {candidate.status}
              </span>
              {isSuppressed && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium bg-red-500/10 text-red-700 dark:text-red-300">
                  Suppressed
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {candidate.sector}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] text-muted-foreground">
              Detected {formatDate(candidate.detected_date)}
            </span>
            {candidate.revenue_growth_yoy != null && (
              <span className={`text-xs tabular-nums font-medium ${changeClass(candidate.revenue_growth_yoy)}`}>
                Rev {candidate.revenue_growth_yoy > 0 ? "+" : ""}{candidate.revenue_growth_yoy.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground">EPS Trend (8Q)</span>
            <EpsTrendBar trend={candidate.eps_trend} />
          </div>
        </div>

        {isSuppressed && candidate.suppression_reason && (
          <div className="mt-2 text-[10px] text-red-600 dark:text-red-400">
            Suppressed: {candidate.suppression_reason}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TurnaroundPage() {
  usePageTitle("Turnaround Watch")
  const { data, loading, error } = useTurnaroundWatch()

  const candidates = data?.candidates || []
  const active = candidates.filter((c) => !c.suppressed)
  const suppressed = candidates.filter((c) => c.suppressed)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading turnaround watch...
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Turnaround Watch</h1>
        <p className="text-xs text-muted-foreground">
          Stocks with improving EPS trajectory that may clear the hard block filter in 1-3 quarters
        </p>
      </div>

      {error || candidates.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-xs text-muted-foreground">
              {error
                ? "Turnaround watch not available yet. Run the pipeline to generate data."
                : "No turnaround candidates detected in the current scan."}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Active ({active.length})
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {active.map((c) => (
                  <CandidateCard key={`${c.symbol}-${c.detected_date}`} candidate={c} />
                ))}
              </div>
            </div>
          )}

          {suppressed.length > 0 && (
            <div>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Suppressed ({suppressed.length})
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {suppressed.map((c) => (
                  <CandidateCard key={`${c.symbol}-${c.detected_date}`} candidate={c} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
