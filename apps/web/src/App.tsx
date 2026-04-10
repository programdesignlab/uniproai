import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/auth-context"
import { Layout } from "@/components/layout"
import { ProtectedRoute } from "@/components/protected-route"
import { DashboardPage } from "@/pages/dashboard"
import { WatchlistPage } from "@/pages/watchlist"
import { StockDetailPage } from "@/pages/stock-detail"
import { SectorsPage } from "@/pages/sectors"
import { ScreenerPage } from "@/pages/screener"
import { MarketRegimePage } from "@/pages/market-regime"
import { ExclusionsPage } from "@/pages/exclusions"
import { TurnaroundPage } from "@/pages/turnaround"
import { StrategyPage } from "@/pages/strategy"
import { SignInPage } from "@/pages/sign-in"

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="sign-in" element={<SignInPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="stock/:symbol" element={<StockDetailPage />} />
            <Route path="sectors" element={<SectorsPage />} />
            <Route path="screener" element={<ScreenerPage />} />
            <Route path="regime" element={<MarketRegimePage />} />
            <Route path="exclusions" element={<ExclusionsPage />} />
            <Route path="turnaround" element={<TurnaroundPage />} />
            <Route path="strategy" element={<StrategyPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
