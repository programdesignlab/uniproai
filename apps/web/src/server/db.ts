import postgres from "postgres"

const sql = postgres("postgresql://arvbsnt@localhost:5432/momentum_edge", {
  max: 5,
  idle_timeout: 20,
})

export default sql
