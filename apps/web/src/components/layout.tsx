import { NavLink, Outlet } from "react-router-dom"
import { useOverview } from "@/lib/api"
import { formatDate, regimeColor } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/watchlist", label: "Watchlist" },
]

export function Layout() {
  const { data: overview } = useOverview()
  const rc = overview ? regimeColor(overview.regime) : null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-11 shrink-0 items-center border-b bg-background/95 backdrop-blur-sm px-6">
        <span className="text-sm font-semibold tracking-tight">
          MomentumEdge
        </span>

        <nav className="ml-8 flex items-center gap-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {overview && rc && (
            <div
              className={`flex items-center gap-2 border px-2.5 py-1 text-[11px] font-medium ${rc.bg} ${rc.border} ${rc.text}`}
            >
              <span className={`inline-block size-1.5 ${rc.dot}`} />
              {overview.regime} &middot; {overview.exposure}
              <span className="text-[10px] opacity-60">
                {formatDate(overview.date)}
              </span>
            </div>
          )}
          <kbd className="border px-1.5 py-0.5 text-[10px] text-muted-foreground">
            d
          </kbd>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
