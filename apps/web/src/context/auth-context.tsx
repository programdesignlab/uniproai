import { createContext, useContext, useEffect, useState } from "react"
import { authClient } from "@/lib/auth"

type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (result.data?.user) {
        setUser(result.data.user as User)
      }
      setLoading(false)
    })
  }, [])

  const signOut = async () => {
    await authClient.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
