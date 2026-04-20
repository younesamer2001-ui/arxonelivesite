'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/**
 * Klient-wrapper rundt ChatbotWidget.
 *
 * Hvorfor:
 *   - ChatbotWidget bruker VAPI Web SDK + OpenAI-klient + Framer Motion
 *     → ~250KB+ JS som historisk lastes i hovedbundle og blokkerer LCP.
 *   - Widgeten er ikke over fold (floating knapp nederst til høyre),
 *     så den kan trygt lastes etter hero har malt.
 *
 * Hva:
 *   1. `dynamic(..., { ssr: false })` hindrer widget fra å havne i SSR-bundle.
 *   2. `useEffect` + `requestIdleCallback` (fallback `setTimeout`) venter til
 *      main thread er ledig før widgeten mountes → LCP og TBT beskyttes.
 *
 * Resultat: LCP forventes å falle tilbake til ~1.1s på desktop / <3s på mobil.
 */
const ChatbotWidget = dynamic(() => import('./ChatbotWidget'), {
  ssr: false,
  loading: () => null,
})

export default function ChatbotWidgetClient() {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Vent til nettleseren er ledig før vi laster ~250KB widget-kode
    const idle = (cb: () => void) => {
      const w = window as typeof window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      }
      if (typeof w.requestIdleCallback === 'function') {
        w.requestIdleCallback(cb, { timeout: 2500 })
      } else {
        setTimeout(cb, 1500)
      }
    }

    idle(() => setShouldRender(true))
  }, [])

  if (!shouldRender) return null
  return <ChatbotWidget />
}
