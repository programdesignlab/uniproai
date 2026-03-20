import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useRegime } from "@/lib/api"
import { useAuth } from "@/context/auth-context"
import { formatDate, regimeColor, regimeAllocation } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/watchlist", label: "Watchlist" },
  { to: "/sectors", label: "Sectors" },
  { to: "/screener", label: "Universe" },
  { to: "/regime", label: "Regime" },
]

export function Layout() {
  const { data: regime } = useRegime()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const rc = regime ? regimeColor(regime.regime) : null
  const alloc = regime ? regimeAllocation(regime.regime) : null

  const handleSignOut = async () => {
    await signOut()
    navigate("/sign-in", { replace: true })
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-11 shrink-0 items-center border-b bg-background/95 backdrop-blur-sm px-6">
        <span className="text-sm font-semibold tracking-tight">
          uniproadvisory AI
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
          {regime && rc && (
            <div className="flex items-center gap-2">
              {regime.crash_warning && (
                <span className="inline-flex items-center gap-1 border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-600 dark:text-red-400 animate-pulse">
                  CRASH WARNING
                </span>
              )}
              <div
                className={`flex items-center gap-2 border px-2.5 py-1 text-[11px] font-medium ${rc.bg} ${rc.border} ${rc.text}`}
              >
                <span className={`inline-block size-1.5 ${rc.dot}`} />
                {regime.regime}
                {alloc && (
                  <span className="text-[10px] opacity-60">
                    {alloc.max_equity_pct}% / {alloc.max_positions}pos
                  </span>
                )}
                <span className="text-[10px] opacity-60">
                  {formatDate(regime.date)}
                </span>
              </div>
            </div>
          )}
          <kbd className="border px-1.5 py-0.5 text-[10px] text-muted-foreground">
            d
          </kbd>
          <button
            onClick={handleSignOut}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
