import { useEffect } from 'react'

const DESKTOP_MIN_WIDTH = 900
const REFERENCE_WIDTH = 2290
const REFERENCE_HEIGHT = 1290
const MIN_SCALE = 0.62
const MAX_SCALE = 1

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function AdaptiveViewportDensity() {
  useEffect(() => {
    const root = document.documentElement

    function updateDensity() {
      const width = window.innerWidth
      const height = window.innerHeight
      const isDesktop = width >= DESKTOP_MIN_WIDTH
      const scale = isDesktop
        ? clamp(Math.min(width / REFERENCE_WIDTH, height / REFERENCE_HEIGHT), MIN_SCALE, MAX_SCALE)
        : 1

      root.style.setProperty('--app-density-scale', scale.toFixed(4))
      root.style.setProperty('--app-density-inverse', (1 / scale).toFixed(4))
      root.dataset.densityMode = isDesktop ? 'adaptive-desktop' : 'native-mobile'
    }

    updateDensity()
    window.addEventListener('resize', updateDensity, { passive: true })
    window.visualViewport?.addEventListener('resize', updateDensity, { passive: true })

    return () => {
      window.removeEventListener('resize', updateDensity)
      window.visualViewport?.removeEventListener('resize', updateDensity)
      root.style.removeProperty('--app-density-scale')
      root.style.removeProperty('--app-density-inverse')
      delete root.dataset.densityMode
    }
  }, [])

  return null
}
