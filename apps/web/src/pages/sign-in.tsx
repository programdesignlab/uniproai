import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth"
import { useAuth } from "@/context/auth-context"

type Mode = "signin" | "signup"

export function SignInPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mode, setMode] = useState<Mode>("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) {
    navigate("/", { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (mode === "signup") {
      const result = await authClient.signUp.email({ name, email, password })
      setLoading(false)
      if (result.error) {
        setError(result.error.message ?? "Sign up failed")
        return
      }
    } else {
      const result = await authClient.signIn.email({ email, password })
      setLoading(false)
      if (result.error) {
        setError(result.error.message ?? "Sign in failed")
        return
      }
    }

    navigate("/", { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm border border-border p-8 space-y-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">MomentumEdge</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin" ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Your name"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading
              ? mode === "signin" ? "Signing in…" : "Creating account…"
              : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null) }}
            className="underline underline-offset-2"
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  )
}
