export type AnalyticsProps = Record<string, string | number | boolean | undefined>

export type AnalyticsEntry = {
  event: string
  props: AnalyticsProps
}

declare global {
  interface Window {
    __neonAnalytics?: AnalyticsEntry[]
  }
}

/** Console + in-memory analytics. No external SDK. Safe no-op if window missing. */
export function track(event: string, props: AnalyticsProps = {}): void {
  console.info('[neon-analytics]', event, props)
  if (typeof window === 'undefined') return
  window.__neonAnalytics = window.__neonAnalytics || []
  window.__neonAnalytics.push({ event, props })
}
