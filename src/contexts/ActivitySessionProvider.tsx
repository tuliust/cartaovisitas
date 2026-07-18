import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentSession, onAuthSessionChange, signOut } from '../lib/auth'
import { ActivitySessionContext } from './ActivitySessionContext'
import { useVisualMode } from './VisualModeContext'

const ACTIVITY_TIMEOUT_MS = 30 * 60 * 1000
const ACTIVITY_WRITE_THROTTLE_MS = 15 * 1000
const ACTIVITY_CHECK_INTERVAL_MS = 30 * 1000
const LAST_ACTIVITY_STORAGE_KEY = 'invest-rs-last-authenticated-activity'
const EXPIRED_SESSION_STORAGE_KEY = 'invest-rs-inactivity-expired-session'
const EXPIRATION_LOCK_STORAGE_KEY = 'invest-rs-inactivity-expiration-lock'
const EXPIRATION_LOCK_MS = 10 * 1000

function readLastActivity() {
  const value = Number(window.localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY))
  return Number.isFinite(value) && value > 0 ? value : 0
}

function getSessionKey(session: Session) {
  return `${session.user.id}:${session.expires_at ?? ''}`
}

export function ActivitySessionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { clearAuthenticatedDefault } = useVisualMode()
  const [authenticated, setAuthenticated] = useState(false)
  const sessionRef = useRef<Session | null>(null)
  const lastActivityRef = useRef(0)
  const expiringRef = useRef(false)

  const expireSession = useCallback(async (session = sessionRef.current) => {
    if (!session || expiringRef.current) return

    expiringRef.current = true
    const sessionKey = getSessionKey(session)
    const now = Date.now()
    const lockValue = window.localStorage.getItem(EXPIRATION_LOCK_STORAGE_KEY)
    const [lockedSessionKey, lockedAtValue] = lockValue?.split('|') ?? []
    const lockedAt = Number(lockedAtValue)
    const anotherTabIsExpiring = lockedSessionKey === sessionKey && Number.isFinite(lockedAt) && now - lockedAt < EXPIRATION_LOCK_MS

    if (!anotherTabIsExpiring) {
      window.localStorage.setItem(EXPIRATION_LOCK_STORAGE_KEY, `${sessionKey}|${now}`)
    }
    window.sessionStorage.setItem(EXPIRED_SESSION_STORAGE_KEY, sessionKey)
    window.localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY)
    lastActivityRef.current = 0
    clearAuthenticatedDefault()
    navigate('/', { replace: true })

    if (anotherTabIsExpiring) {
      expiringRef.current = false
      return
    }

    try {
      await signOut()
    } catch (error) {
      console.warn('Nao foi possivel concluir o signOut remoto por inatividade.', error)
    } finally {
      expiringRef.current = false
    }
  }, [clearAuthenticatedDefault, navigate])

  const ensureActiveSession = useCallback(async () => {
    const session = await getCurrentSession().catch(() => null)
    if (!session) return false

    const sessionKey = getSessionKey(session)
    if (window.sessionStorage.getItem(EXPIRED_SESSION_STORAGE_KEY) === sessionKey) {
      await expireSession(session)
      return false
    }

    const lastActivity = readLastActivity()
    if (lastActivity && Date.now() - lastActivity >= ACTIVITY_TIMEOUT_MS) {
      await expireSession(session)
      return false
    }

    return true
  }, [expireSession])

  useEffect(() => {
    let mounted = true

    function applySession(session: Session | null) {
      if (!mounted) return

      sessionRef.current = session
      setAuthenticated(Boolean(session))

      if (!session) {
        lastActivityRef.current = 0
        window.localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY)
        window.localStorage.removeItem(EXPIRATION_LOCK_STORAGE_KEY)
        window.sessionStorage.removeItem(EXPIRED_SESSION_STORAGE_KEY)
        return
      }

      const sessionKey = getSessionKey(session)
      const expiredSessionKey = window.sessionStorage.getItem(EXPIRED_SESSION_STORAGE_KEY)
      if (expiredSessionKey && expiredSessionKey !== sessionKey) {
        window.sessionStorage.removeItem(EXPIRED_SESSION_STORAGE_KEY)
        window.localStorage.removeItem(EXPIRATION_LOCK_STORAGE_KEY)
      }

      const lastActivity = readLastActivity()
      if (!lastActivity) {
        const now = Date.now()
        lastActivityRef.current = now
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(now))
      } else {
        lastActivityRef.current = lastActivity
      }

      if (expiredSessionKey === sessionKey || Date.now() - lastActivityRef.current >= ACTIVITY_TIMEOUT_MS) {
        window.setTimeout(() => void expireSession(session), 0)
      }
    }

    void getCurrentSession().then(applySession).catch(() => applySession(null))
    const subscription = onAuthSessionChange(applySession)

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [expireSession])

  useEffect(() => {
    if (!authenticated) return

    let expirationTimer = 0

    const scheduleExpiration = () => {
      window.clearTimeout(expirationTimer)
      const remaining = Math.max(0, ACTIVITY_TIMEOUT_MS - (Date.now() - lastActivityRef.current))
      expirationTimer = window.setTimeout(() => void expireSession(), remaining)
    }

    const checkBeforeActivity = () => {
      if (Date.now() - lastActivityRef.current >= ACTIVITY_TIMEOUT_MS) {
        void expireSession()
        return false
      }
      return true
    }

    const recordActivity = () => {
      if (!checkBeforeActivity()) return
      const now = Date.now()
      if (now - lastActivityRef.current < ACTIVITY_WRITE_THROTTLE_MS) return
      lastActivityRef.current = now
      window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(now))
      scheduleExpiration()
    }

    const handleVisibilityChange = () => recordActivity()

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== LAST_ACTIVITY_STORAGE_KEY || !event.newValue) return
      const nextActivity = Number(event.newValue)
      if (!Number.isFinite(nextActivity) || nextActivity <= lastActivityRef.current) return
      lastActivityRef.current = nextActivity
      scheduleExpiration()
    }

    const activityEvents: (keyof WindowEventMap)[] = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'scroll']
    activityEvents.forEach((eventName) => window.addEventListener(eventName, recordActivity, { capture: true, passive: true }))
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('storage', handleStorage)
    const interval = window.setInterval(checkBeforeActivity, ACTIVITY_CHECK_INTERVAL_MS)
    scheduleExpiration()

    return () => {
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, recordActivity, true))
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('storage', handleStorage)
      window.clearInterval(interval)
      window.clearTimeout(expirationTimer)
    }
  }, [authenticated, expireSession])

  const value = useMemo(() => ({ ensureActiveSession }), [ensureActiveSession])
  return <ActivitySessionContext.Provider value={value}>{children}</ActivitySessionContext.Provider>
}
