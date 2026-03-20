import { useEffect } from "react"

export function usePageTitle(page: string) {
  useEffect(() => {
    document.title = `${page} — uniproadvisory AI`
    return () => {
      document.title = "uniproadvisory AI"
    }
  }, [page])
}
