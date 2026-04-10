import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"
import { useStrategyInfo } from "@/lib/api"
import { usePageTitle } from "@/lib/use-page-title"

export function StrategyPage() {
  usePageTitle("Strategy")
  const { data: strategy, loading, error } = useStrategyInfo()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-xs text-muted-foreground">
        Loading strategy info...
      </div>
    )
  }

  if (!strategy || error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32">
        <div className="text-sm font-medium">Strategy info not available</div>
        <div className="text-xs text-muted-foreground">
          Backend may not have the /strategy/info endpoint deployed yet.
        </div>
      </div>
    )
  }

  const features = [
    { label: "Exit Framework", value: strategy.exit_framework, active: true },
    { label: "Hard Block Filters", value: `${strategy.hard_blocks} active`, active: strategy.hard_blocks > 0 },
    { label: "Scoring Modules", value: `${strategy.scoring_modules} active`, active: strategy.scoring_modules > 0 },
    { label: "Exit Phases", value: `${strategy.exit_phases} phases`, active: strategy.exit_phases > 0 },
    { label: "Cascade Layers", value: `${strategy.cascade_layers} layers`, active: strategy.cascade_layers > 0 },
    { label: "Monster Detection", value: strategy.monster_enabled ? "Active" : "Disabled", active: strategy.monster_enabled },
    { label: "Fast Crash", value: strategy.fast_crash_enabled ? "Armed" : "Disabled", active: strategy.fast_crash_enabled },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Strategy Configuration</h1>
        <p className="text-xs text-muted-foreground">
          Active strategy parameters driving the scanning engine
        </p>
      </div>

      {/* Identity */}
      <Card>
        <CardHeader>
          <CardTitle>{strategy.name}</CardTitle>
          <CardDescription>{strategy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Version
              </span>
              <span className="text-2xl font-bold tabular-nums">
                {strategy.version}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Strategy Hash
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums">
                {strategy.strategy_hash}
              </span>
              <span className="text-[10px] text-muted-foreground">
                SHA-256 of config (excl. meta)
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Framework
              </span>
              <span className="text-2xl font-bold">
                {strategy.exit_framework === "phase_based" ? "Phase-Based" : strategy.exit_framework}
              </span>
              <span className="text-[10px] text-muted-foreground">
                4-phase gain-based exit engine
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature flags */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Engine capabilities and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-px bg-border">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between bg-background p-3"
              >
                <span className="text-xs">{f.label}</span>
                <span
                  className={`text-xs font-medium ${
                    f.active
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exit phases */}
      <Card>
        <CardHeader>
          <CardTitle>Exit Phases</CardTitle>
          <CardDescription>
            4-phase gain-based exit framework — rules loosen as positions prove themselves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-px bg-border">
            {[
              { name: "Prove It", range: "0-25%", rule: "8% fixed stop", color: "text-amber-600 dark:text-amber-400" },
              { name: "Let It Run", range: "25-100%", rule: "20% trailing stop", color: "text-emerald-600 dark:text-emerald-400" },
              { name: "Working Compounder", range: "100-200%", rule: "15% trailing stop", color: "text-sky-600 dark:text-sky-400" },
              { name: "Monster Run", range: "200%+", rule: "50MA + 12% trail", color: "text-violet-600 dark:text-violet-400" },
            ].map((phase) => (
              <div key={phase.name} className="flex flex-col gap-2 bg-background p-4">
                <span className={`text-xs font-semibold ${phase.color}`}>{phase.name}</span>
                <span className="text-lg font-bold tabular-nums">{phase.range}</span>
                <span className="text-[10px] text-muted-foreground">{phase.rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
