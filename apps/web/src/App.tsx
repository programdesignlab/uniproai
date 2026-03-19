import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout"
import { DashboardPage } from "@/pages/dashboard"
import { WatchlistPage } from "@/pages/watchlist"
import { StockDetailPage } from "@/pages/stock-detail"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="watchlist" element={<WatchlistPage />} />
          <Route path="stock/:symbol" element={<StockDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
