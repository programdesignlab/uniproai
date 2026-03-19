import type { Plugin } from "vite"
import sql from "./db"

export function apiPlugin(): Plugin {
  return {
    name: "momentum-edge-api",
    configureServer(server) {
      server.middlewares.use("/api/overview", async (_req, res) => {
        try {
          const [result] = await sql`
            WITH latest AS (
              SELECT MAX(date) as d FROM watchlist
            ),
            latest_scores AS (
              SELECT MAX(date) as d FROM scores
            )
            SELECT
              (SELECT regime FROM watchlist WHERE date = (SELECT d FROM latest) LIMIT 1) as regime,
              (SELECT d FROM latest) as date,
              (SELECT count(*) FROM stocks WHERE is_active = true) as stocks_scanned,
              (SELECT count(*) FROM indicators WHERE date = (SELECT d FROM latest_scores)) as indicators_count,
              (SELECT count(*) FROM scores WHERE date = (SELECT d FROM latest_scores) AND technical_score >= 12) as trend_passes,
              (SELECT count(*) FROM watchlist WHERE date = (SELECT d FROM latest)) as watchlist_count
          `

          if (!result?.date) {
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(null))
            return
          }

          const regime = result.regime || "Unknown"
          const exposure =
            regime === "Bull"
              ? "Aggressive"
              : regime === "Neutral"
                ? "Moderate"
                : "Defensive"

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(
            JSON.stringify({
              regime,
              exposure,
              date: result.date,
              stocksScanned: Number(result.stocks_scanned),
              trendTemplatePasses: Number(result.trend_passes),
              watchlistCount: Number(result.watchlist_count),
            })
          )
        } catch (err) {
          console.error("API /overview error:", err)
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Database error" }))
        }
      })

      server.middlewares.use("/api/sectors", async (_req, res) => {
        try {
          const rows = await sql`
            WITH latest AS (
              SELECT MAX(date) as d FROM scores
            )
            SELECT
              sd.sector_name,
              ROUND(AVG(i.rs_score)::numeric, 1) as avg_rs_score,
              COUNT(*) FILTER (
                WHERE i.high_52w > 0
                AND ep.close >= i.high_52w * 0.9
              ) as stocks_near_high,
              COUNT(*) as total_stocks,
              ROUND(AVG(sc.sector_score)::numeric, 1) as avg_sector_score
            FROM stocks s
            JOIN sector_data sd ON sd.id = s.sector_id
            LEFT JOIN indicators i ON i.stock_id = s.id AND i.date = (SELECT d FROM latest)
            LEFT JOIN scores sc ON sc.stock_id = s.id AND sc.date = (SELECT d FROM latest)
            LEFT JOIN LATERAL (
              SELECT close FROM eod_prices WHERE stock_id = s.id ORDER BY date DESC LIMIT 1
            ) ep ON true
            WHERE s.is_active = true
            GROUP BY sd.sector_name
            ORDER BY avg_rs_score DESC NULLS LAST
          `

          const sectors = rows.map((r, i) => ({
            rank: i + 1,
            sectorName: r.sector_name,
            avgRsScore: Number(r.avg_rs_score) || 0,
            stocksNearHigh: Number(r.stocks_near_high),
            totalStocks: Number(r.total_stocks),
            score: Number(r.avg_sector_score) || 0,
          }))

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify(sectors))
        } catch (err) {
          console.error("API /sectors error:", err)
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Database error" }))
        }
      })

      server.middlewares.use("/api/watchlist", async (_req, res) => {
        try {
          const rows = await sql`
            SELECT
              w.rank, w.stock_id, s.symbol, s.name, w.composite_score,
              w.pattern_type, w.regime, w.stop_loss_level,
              w.sector_name, w.sector_rank,
              sc.momentum_score, sc.fundamental_score, sc.sector_score,
              sc.technical_score, sc.accumulation_score, sc.breakout_score
            FROM watchlist w
            JOIN stocks s ON s.id = w.stock_id
            LEFT JOIN scores sc ON sc.stock_id = w.stock_id AND sc.date = w.date
            WHERE w.date = (SELECT MAX(date) FROM watchlist)
            ORDER BY w.rank
          `

          const watchlist = rows.map((r) => ({
            rank: r.rank,
            stockId: r.stock_id,
            symbol: r.symbol,
            name: r.name,
            compositeScore: Number(r.composite_score) || 0,
            patternType: r.pattern_type || null,
            regime: r.regime,
            stopLossLevel: Number(r.stop_loss_level) || 0,
            sectorName: r.sector_name || "",
            sectorRank: r.sector_rank || 0,
            momentumScore: Number(r.momentum_score) || 0,
            fundamentalScore: Number(r.fundamental_score) || 0,
            sectorScore: Number(r.sector_score) || 0,
            technicalScore: Number(r.technical_score) || 0,
            accumulationScore: Number(r.accumulation_score) || 0,
            breakoutScore: Number(r.breakout_score) || 0,
          }))

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify(watchlist))
        } catch (err) {
          console.error("API /watchlist error:", err)
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Database error" }))
        }
      })

      server.middlewares.use("/api/scores", async (_req, res) => {
        try {
          const rows = await sql`
            SELECT
              s.symbol, s.name,
              sc.momentum_score, sc.fundamental_score, sc.sector_score,
              sc.technical_score, sc.accumulation_score, sc.breakout_score,
              sc.composite_score,
              w.rank, w.pattern_type, w.regime, w.stop_loss_level,
              w.sector_name, w.sector_rank
            FROM scores sc
            JOIN stocks s ON s.id = sc.stock_id
            LEFT JOIN watchlist w ON w.stock_id = sc.stock_id AND w.date = sc.date
            WHERE sc.date = (SELECT MAX(date) FROM scores)
            AND sc.composite_score > 0
            ORDER BY sc.composite_score DESC
          `

          const scores = rows.map((r, i) => ({
            rank: r.rank || i + 1,
            stockId: 0,
            symbol: r.symbol,
            name: r.name,
            compositeScore: Number(r.composite_score) || 0,
            patternType: r.pattern_type || null,
            regime: r.regime || "",
            stopLossLevel: Number(r.stop_loss_level) || 0,
            sectorName: r.sector_name || "",
            sectorRank: r.sector_rank || 0,
            momentumScore: Number(r.momentum_score) || 0,
            fundamentalScore: Number(r.fundamental_score) || 0,
            sectorScore: Number(r.sector_score) || 0,
            technicalScore: Number(r.technical_score) || 0,
            accumulationScore: Number(r.accumulation_score) || 0,
            breakoutScore: Number(r.breakout_score) || 0,
          }))

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify(scores))
        } catch (err) {
          console.error("API /scores error:", err)
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Database error" }))
        }
      })

      // Stock detail endpoint - matches /api/stock/:symbol
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/api\/stock\/([A-Z0-9-]+)$/)
        if (!match) return next()

        const symbol = match[1]
        try {
          const [stock] = await sql`
            SELECT s.id, s.symbol, s.name, sd.sector_name as sector, s.market_cap, s.is_active
            FROM stocks s
            LEFT JOIN sector_data sd ON sd.id = s.sector_id
            WHERE s.symbol = ${symbol}
          `
          if (!stock) {
            res.writeHead(404, { "Content-Type": "application/json" })
            res.end(JSON.stringify({ error: "Stock not found" }))
            return
          }

          const [price] = await sql`
            SELECT date, open, high, low, close, volume
            FROM eod_prices
            WHERE stock_id = ${stock.id}
            ORDER BY date DESC LIMIT 1
          `

          const [indicator] = await sql`
            SELECT ma50, ma150, ma200, rs_score, atr, high_52w, low_52w
            FROM indicators
            WHERE stock_id = ${stock.id}
            ORDER BY date DESC LIMIT 1
          `

          const [score] = await sql`
            SELECT momentum_score, fundamental_score, sector_score,
                   technical_score, accumulation_score, breakout_score, composite_score
            FROM scores WHERE stock_id = ${stock.id}
            ORDER BY date DESC LIMIT 1
          `

          const [fundamental] = await sql`
            SELECT quarter, eps, eps_yoy_growth, revenue, revenue_yoy_growth,
                   roe, net_margin, pe_ratio, debt_to_equity
            FROM fundamentals WHERE stock_id = ${stock.id}
            ORDER BY quarter DESC LIMIT 1
          `

          const [wl] = await sql`
            SELECT pattern_type, stop_loss_level
            FROM watchlist WHERE stock_id = ${stock.id}
            ORDER BY date DESC LIMIT 1
          `

          const detail = {
            stock: {
              id: stock.id,
              symbol: stock.symbol,
              name: stock.name,
              sector: stock.sector || "",
              marketCap: Number(stock.market_cap) || 0,
              isActive: stock.is_active,
            },
            latestPrice: price
              ? {
                  date: price.date,
                  open: Number(price.open),
                  high: Number(price.high),
                  low: Number(price.low),
                  close: Number(price.close),
                  volume: Number(price.volume),
                }
              : null,
            indicators: indicator
              ? {
                  ma50: Number(indicator.ma50) || 0,
                  ma150: Number(indicator.ma150) || 0,
                  ma200: Number(indicator.ma200) || 0,
                  rsScore: Number(indicator.rs_score) || 0,
                  atr: Number(indicator.atr) || 0,
                  high52w: Number(indicator.high_52w) || 0,
                  low52w: Number(indicator.low_52w) || 0,
                }
              : null,
            scores: score
              ? {
                  momentumScore: Number(score.momentum_score) || 0,
                  fundamentalScore: Number(score.fundamental_score) || 0,
                  sectorScore: Number(score.sector_score) || 0,
                  technicalScore: Number(score.technical_score) || 0,
                  accumulationScore: Number(score.accumulation_score) || 0,
                  breakoutScore: Number(score.breakout_score) || 0,
                  compositeScore: Number(score.composite_score) || 0,
                }
              : null,
            fundamentals: fundamental
              ? {
                  quarter: fundamental.quarter,
                  eps: Number(fundamental.eps) || 0,
                  epsYoyGrowth: Number(fundamental.eps_yoy_growth) || 0,
                  revenue: Number(fundamental.revenue) || 0,
                  revenueYoyGrowth: Number(fundamental.revenue_yoy_growth) || 0,
                  roe: Number(fundamental.roe) || 0,
                  netMargin: Number(fundamental.net_margin) || 0,
                  peRatio: Number(fundamental.pe_ratio) || 0,
                  debtToEquity: Number(fundamental.debt_to_equity) || 0,
                }
              : null,
            patternType: wl?.pattern_type || null,
            stopLossLevel: Number(wl?.stop_loss_level) || 0,
          }

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify(detail))
        } catch (err) {
          console.error(`API /stock/${symbol} error:`, err)
          res.writeHead(500, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ error: "Database error" }))
        }
      })
    },
  }
}
