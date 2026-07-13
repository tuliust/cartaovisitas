import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView())
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [hash, pathname, search])

  return null
}
