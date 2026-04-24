"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, MessageCircle, Phone, PhoneOff, Mic, MicOff, Maximize2, Minimize2, Calendar, CheckCircle2, Clock, ExternalLink } from "lucide-react"
import { useVapi } from "@/hooks/useVapi"

type SlotSuggestion = {
  start: string
  end: string
  pretty_no: string
  pretty_en: string
}

type SlotsPayload = {
  kind: "demo_30" | "demo_15" | string
  items: SlotSuggestion[]
}

type BookingConfirmation = {
  booking_id: string | number
  start: string
  end: string
  pretty_no: string
  pretty_en: string
  meeting_url: string | null
  manage_url: string | null
}

type Message = {
  role: "user" | "assistant"
  content: string
  slots?: SlotsPayload
  booking?: BookingConfirmation
}

const INITIAL_GREETING: Message = {
  role: "assistant",
  content:
    "Hei! Jeg er Arxon — din digitale resepsjonist. Spør meg om priser, funksjoner, eller trykk på telefonrøret for å snakke med meg direkte.",
}

const QUICK_REPLIES = [
  "Hva koster det?",
  "Hvordan fungerer det?",
  "Book demo",
]

// Foretrekker env-variabel, men faller tilbake til kjent assistant-ID så
// Ring-knappen aldri havner i "ikke satt opp"-grenen bare fordi en Vercel
// NEXT_PUBLIC_*-variabel glapp i forrige bygg. Vi plukker også UUID-en ut
// av env-verdien for å tåle korrupte Vercel-verdier (f.eks. 'y\n42414a1e-...'
// som oppstår når `printf 'y\n' | vercel env add` brukes).
const ARXON_ASSISTANT_UUID_RE =
  /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
const ARXON_ASSISTANT_ID =
  (process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ARXON ?? "").match(
    ARXON_ASSISTANT_UUID_RE,
  )?.[0] || "42414a1e-adf9-41d1-a22c-3a61c5b95d01"

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [compact, setCompact] = useState(false)
  // Brukeren har klikket en slot og venter nå på å fylle ut navn + e-post.
  // Null = ingen aktiv booking-flyt. Vi tillater én aktiv om gangen.
  const [pendingSlot, setPendingSlot] = useState<SlotSuggestion | null>(null)
  const [bookingName, setBookingName] = useState("")
  const [bookingEmail, setBookingEmail] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const micPrewarmedRef = useRef(false)

  const vapi = useVapi()
  const inCall = vapi.status === "connecting" || vapi.status === "active"

  // Auto-enter compact mode as soon as a call starts so the page stays visible.
  useEffect(() => {
    if (inCall) setCompact(true)
    else setCompact(false)
  }, [inCall])

  // Pre-warm mic on first pointerdown over the Ring button — primes browser
  // permission + audio device so vapi.start() doesn't pay the getUserMedia cost.
  const prewarmMic = useCallback(async () => {
    if (micPrewarmedRef.current) return
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return
    micPrewarmedRef.current = true
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
    } catch {
      // User denied or device unavailable — will be handled when they actually click
      micPrewarmedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (open && inputRef.current && !inCall) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open, inCall])

  const startCall = useCallback(() => {
    if (!ARXON_ASSISTANT_ID) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Stemme-demoen er ikke helt satt opp ennå (mangler NEXT_PUBLIC_VAPI_ASSISTANT_ARXON). Du kan bruke chatten her, eller ringe +47 78 89 63 86.",
        },
      ])
      return
    }
    setHasInteracted(true)
    void vapi.start(ARXON_ASSISTANT_ID)
  }, [vapi])

  // Når Vapi-hooken setter en feil, vis den i chatten én gang slik at brukeren
  // ikke står og lurer på hvorfor Ring-knappen ikke gjør noe.
  const lastReportedErrorRef = useRef<string | null>(null)
  useEffect(() => {
    if (!vapi.error) return
    const key = `${vapi.error.code ?? ""}:${vapi.error.message}`
    if (lastReportedErrorRef.current === key) return
    lastReportedErrorRef.current = key
    const friendly = (() => {
      const msg = vapi.error.message.toLowerCase()
      if (msg.includes("permission") || msg.includes("notallowed") || msg.includes("denied"))
        return "Jeg trenger tilgang til mikrofonen din for å ringe. Sjekk nettleserens mikrofon-innstillinger og prøv igjen."
      if (msg.includes("assistant") && msg.includes("not found"))
        return "Stemme-agenten er ikke riktig konfigurert (assistant not found). Bruk chatten her i mellomtiden, eller ring +47 78 89 63 86."
      if (msg.includes("domain") || msg.includes("origin") || msg.includes("cors"))
        return "Denne siden er ikke godkjent for stemme-demoen ennå. Bruk chatten her, eller ring +47 78 89 63 86."
      if (msg.includes("key") || msg.includes("unauthorized") || msg.includes("401") || msg.includes("403"))
        return "Stemme-demoen er ikke autentisert riktig akkurat nå. Bruk chatten her, eller ring +47 78 89 63 86."
      return `Klarte ikke å koble opp stemme-samtalen (${vapi.error.message}). Bruk chatten her, eller ring +47 78 89 63 86.`
    })()
    setMessages((prev) => [...prev, { role: "assistant", content: friendly }])
  }, [vapi.error])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return

      const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }]
      setMessages(nextMessages)
      setInput("")
      setLoading(true)
      setHasInteracted(true)

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        })

        if (!res.ok) throw new Error("Chat request failed")

        const data = (await res.json()) as {
          reply?: string
          slots?: SlotsPayload
          booking?: BookingConfirmation
        }
        const reply =
          data.reply?.trim() ||
          "Beklager, noe gikk galt. Send meg en e-post på kontakt@arxon.no så hjelper vi deg."

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: reply,
            ...(data.slots && data.slots.items?.length ? { slots: data.slots } : {}),
            ...(data.booking ? { booking: data.booking } : {}),
          },
        ])
        // Når en bekreftet booking kommer tilbake, rydd eventuelt pågående skjema.
        if (data.booking) {
          setPendingSlot(null)
          setBookingName("")
          setBookingEmail("")
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Beklager, jeg er litt treg akkurat nå. Send en e-post til kontakt@arxon.no, eller book demo direkte: https://cal.com/arxon/30min",
          },
        ])
      } finally {
        setLoading(false)
      }
    },
    [messages, loading]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void sendMessage(input)
    }
  }

  // Send en strukturert booking-melding til agenten. Formatet matcher det
  // system-prompten i /api/chat ber om, slik at agenten kan sende ISO-en
  // uendret videre til book_meeting.
  const submitBooking = useCallback(() => {
    if (!pendingSlot) return
    const name = bookingName.trim()
    const email = bookingEmail.trim()
    if (!name || !email) return
    const composed = `Book ${pendingSlot.start}. Navn: ${name}. E-post: ${email}.`
    // Rydd UI før vi sender — svaret fra serveren setter eventuelt booking-kortet.
    setPendingSlot(null)
    setBookingName("")
    setBookingEmail("")
    void sendMessage(composed)
  }, [pendingSlot, bookingName, bookingEmail, sendMessage])

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chat-button"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            onClick={() => setOpen(true)}
            aria-label="Åpne chat med Arxon"
            className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-[60] group"
          >
            <span className="absolute inset-0 rounded-full bg-white/20 blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
            <span className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/40 via-zinc-400/20 to-transparent blur-md opacity-40" />
            <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 text-black shadow-[0_10px_40px_-10px_rgba(255,255,255,0.35)] ring-1 ring-white/20 transition-transform group-hover:scale-105 group-active:scale-95">
              <MessageCircle className="h-6 w-6" strokeWidth={2.2} />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-black/60" />
            </span>
            {!hasInteracted && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="hidden sm:block absolute right-[calc(100%+0.75rem)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-black/80 backdrop-blur px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/10 shadow-lg"
              >
                Spør eller ring Arxon
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Compact in-call pill — shown only during an active call when minimized
          so the user can still scroll the page behind it. */}
      <AnimatePresence>
        {open && inCall && compact && (
          <motion.div
            key="chat-pill"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="fixed bottom-4 right-4 z-[60] w-[min(92vw,320px)]"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-950/95 px-2 py-2 pl-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="relative flex-shrink-0">
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-400/40 blur-md"
                  animate={{
                    scale: vapi.status === "active" ? [1, 1.25, 1] : 1,
                    opacity: vapi.status === "active" ? [0.4, 0.8, 0.4] : 0.3,
                  }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 text-black ring-1 ring-white/20">
                  <span className="text-[11px] font-black tracking-tighter">A</span>
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-xs font-semibold text-white">Arxon</span>
                <span className="truncate text-[10px] text-emerald-400/90">
                  {vapi.status === "connecting"
                    ? "Kobler til..."
                    : vapi.isMuted
                      ? "Mikrofon av"
                      : "I samtale"}
                </span>
              </div>
              <button
                type="button"
                onClick={vapi.toggleMute}
                disabled={vapi.status !== "active"}
                aria-label={vapi.isMuted ? "Skru på mikrofon" : "Mute mikrofon"}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ring-1 transition-all disabled:opacity-40 ${
                  vapi.isMuted
                    ? "bg-white text-black ring-white/30"
                    : "bg-white/10 text-white ring-white/15 hover:bg-white/15"
                }`}
              >
                {vapi.isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setCompact(false)}
                aria-label="Utvid samtalevindu"
                title="Utvid"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/15 hover:bg-white/15 hover:text-white transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={vapi.stop}
                aria-label="Avslutt samtale"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-white ring-1 ring-red-400/40 shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
              >
                <PhoneOff className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full chat / call panel */}
      <AnimatePresence>
        {open && !(inCall && compact) && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed inset-x-3 bottom-3 z-[60] sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px]"
          >
            <div className="flex h-[min(80vh,600px)] sm:h-[560px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-950 to-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-600 text-black ring-1 ring-white/20">
                      <span className="text-xs font-black tracking-tighter">A</span>
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">Arxon</p>
                    <p className="text-[11px] text-emerald-400/90">
                      {inCall
                        ? vapi.status === "connecting"
                          ? "Kobler til..."
                          : "I samtale"
                        : "Online — svarer nå"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!inCall && (
                    <button
                      type="button"
                      onPointerDown={() => { void prewarmMic() }}
                      onPointerEnter={() => { void prewarmMic() }}
                      onFocus={() => { void prewarmMic() }}
                      onClick={startCall}
                      aria-label="Ring Arxon"
                      title="Ring Arxon (snakk direkte)"
                      className="flex items-center gap-1.5 rounded-full bg-emerald-500/90 hover:bg-emerald-500 text-black px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
                    >
                      <Phone className="h-3 w-3" />
                      Ring
                    </button>
                  )}
                  {inCall && (
                    <button
                      type="button"
                      onClick={() => setCompact(true)}
                      aria-label="Minimer samtalevindu"
                      title="Minimer"
                      className="rounded-full p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (inCall) vapi.stop()
                      setOpen(false)
                    }}
                    aria-label="Lukk chat"
                    className="rounded-full p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {inCall ? (
                /* Call UI */
                <div className="flex flex-1 flex-col items-center justify-between p-6">
                  <div className="flex flex-1 flex-col items-center justify-center gap-6 w-full">
                    {/* Animated avatar */}
                    <div className="relative">
                      <motion.span
                        className="absolute inset-0 rounded-full bg-emerald-400/30 blur-2xl"
                        animate={{
                          scale: vapi.status === "active" ? [1, 1.3, 1] : 1,
                          opacity: vapi.status === "active" ? [0.5, 0.9, 0.5] : 0.4,
                        }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.span
                        className="absolute -inset-3 rounded-full border border-white/20"
                        animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                      <motion.span
                        className="absolute -inset-3 rounded-full border border-white/20"
                        animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: 1,
                        }}
                      />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 text-black ring-1 ring-white/20 shadow-[0_20px_60px_-10px_rgba(255,255,255,0.25)]">
                        <span className="text-3xl font-black tracking-tighter">A</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-semibold text-white">Arxon</p>
                      <p className="text-sm text-white/60 mt-1">
                        {vapi.status === "connecting"
                          ? "Kobler til..."
                          : vapi.isMuted
                            ? "Mikrofon av"
                            : "Si hei — jeg lytter"}
                      </p>
                    </div>

                    {/* Audio wave */}
                    {vapi.status === "active" && (
                      <div className="flex items-end gap-1 h-8">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1 rounded-full bg-gradient-to-t from-emerald-500 to-emerald-300"
                            animate={{
                              height: vapi.isMuted
                                ? "4px"
                                : ["8px", "24px", "12px", "28px", "8px"],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.1,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Call controls */}
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={vapi.toggleMute}
                      disabled={vapi.status !== "active"}
                      aria-label={vapi.isMuted ? "Skru på mikrofon" : "Mute mikrofon"}
                      className={`flex h-12 w-12 items-center justify-center rounded-full ring-1 transition-all disabled:opacity-40 ${
                        vapi.isMuted
                          ? "bg-white text-black ring-white/30"
                          : "bg-white/10 text-white ring-white/20 hover:bg-white/15"
                      }`}
                    >
                      {vapi.isMuted ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={vapi.stop}
                      aria-label="Avslutt samtale"
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white ring-1 ring-red-400/40 shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
                    >
                      <PhoneOff className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
                  >
                    {messages.map((m, i) => {
                      const isLastAssistant =
                        m.role === "assistant" &&
                        i === messages.length - 1
                      const showSlotButtons =
                        isLastAssistant &&
                        !!m.slots &&
                        m.slots.items.length > 0 &&
                        !m.booking
                      const showBookingCard = m.role === "assistant" && !!m.booking
                      return (
                        <div key={i} className="space-y-2">
                          <div
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                                m.role === "user"
                                  ? "bg-white text-black rounded-br-sm"
                                  : "bg-zinc-800/80 text-zinc-100 ring-1 ring-white/5 rounded-bl-sm"
                              }`}
                            >
                              {m.content}
                            </div>
                          </div>

                          {showSlotButtons && m.slots && (
                            <div className="flex flex-col items-start gap-2 pl-1">
                              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40">
                                <Calendar className="h-3 w-3" />
                                Ledige tider
                              </div>
                              <div className="flex flex-wrap gap-1.5 max-w-full">
                                {m.slots.items.map((slot) => {
                                  const selected = pendingSlot?.start === slot.start
                                  return (
                                    <button
                                      key={slot.start}
                                      type="button"
                                      onClick={() => {
                                        setPendingSlot(slot)
                                      }}
                                      className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                        selected
                                          ? "bg-emerald-500 text-black ring-1 ring-emerald-300 shadow-[0_4px_14px_-4px_rgba(16,185,129,0.6)]"
                                          : "bg-white/5 text-white/90 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/25"
                                      }`}
                                    >
                                      <Clock
                                        className={`h-3 w-3 ${
                                          selected ? "text-black/80" : "text-white/50 group-hover:text-white/80"
                                        }`}
                                      />
                                      {slot.pretty_no}
                                    </button>
                                  )
                                })}
                              </div>

                              {pendingSlot &&
                                m.slots.items.some((s) => s.start === pendingSlot.start) && (
                                  <motion.form
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.18 }}
                                    onSubmit={(e) => {
                                      e.preventDefault()
                                      submitBooking()
                                    }}
                                    className="mt-1 w-full max-w-[85%] space-y-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-3"
                                  >
                                    <p className="text-[11px] text-white/60">
                                      Book <span className="text-white">{pendingSlot.pretty_no}</span> — fyll inn
                                      navn og e-post:
                                    </p>
                                    <input
                                      type="text"
                                      value={bookingName}
                                      onChange={(e) => setBookingName(e.target.value)}
                                      placeholder="Navn"
                                      autoComplete="name"
                                      className="w-full rounded-lg bg-zinc-900/80 px-3 py-2 text-base sm:text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 focus:ring-white/30 outline-none"
                                    />
                                    <input
                                      type="email"
                                      value={bookingEmail}
                                      onChange={(e) => setBookingEmail(e.target.value)}
                                      placeholder="E-post"
                                      autoComplete="email"
                                      className="w-full rounded-lg bg-zinc-900/80 px-3 py-2 text-base sm:text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 focus:ring-white/30 outline-none"
                                    />
                                    <div className="flex items-center gap-2 pt-0.5">
                                      <button
                                        type="submit"
                                        disabled={
                                          loading ||
                                          !bookingName.trim() ||
                                          !bookingEmail.trim()
                                        }
                                        className="flex-1 rounded-lg bg-emerald-500 text-black px-3 py-2 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors"
                                      >
                                        Bekreft booking
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setPendingSlot(null)
                                          setBookingName("")
                                          setBookingEmail("")
                                        }}
                                        className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10 hover:bg-white/10 transition-colors"
                                      >
                                        Avbryt
                                      </button>
                                    </div>
                                  </motion.form>
                                )}
                            </div>
                          )}

                          {showBookingCard && m.booking && (
                            <div className="flex justify-start">
                              <div className="max-w-[85%] space-y-2 rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-3 ring-1 ring-emerald-400/10">
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                  <div className="space-y-0.5">
                                    <p className="text-xs font-semibold text-emerald-300">
                                      Booking bekreftet
                                    </p>
                                    <p className="text-sm font-medium text-white">
                                      {m.booking.pretty_no}
                                    </p>
                                    <p className="text-[11px] text-white/60">
                                      Bekreftelse sendt på e-post.
                                    </p>
                                  </div>
                                </div>
                                {(m.booking.meeting_url || m.booking.manage_url) && (
                                  <div className="flex flex-wrap gap-1.5 pt-1">
                                    {m.booking.meeting_url && (
                                      <a
                                        href={m.booking.meeting_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-full bg-white text-black px-2.5 py-1 text-[11px] font-medium hover:bg-zinc-200 transition-colors"
                                      >
                                        Bli med i møtet
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                    {m.booking.manage_url && (
                                      <a
                                        href={m.booking.manage_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-full bg-white/5 text-white/80 ring-1 ring-white/10 px-2.5 py-1 text-[11px] hover:bg-white/10 transition-colors"
                                      >
                                        Endre / avlys
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl rounded-bl-sm bg-zinc-800/80 ring-1 ring-white/5 px-3.5 py-3 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce" />
                        </div>
                      </div>
                    )}

                    {!hasInteracted && !loading && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {QUICK_REPLIES.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => void sendMessage(q)}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10 hover:border-white/20 transition-all"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={handleSubmit}
                    className="border-t border-white/10 bg-gradient-to-t from-white/[0.02] to-transparent p-3"
                  >
                    <div className="flex items-end gap-2 rounded-xl bg-zinc-900/80 ring-1 ring-white/10 focus-within:ring-white/25 transition-all p-2">
                      <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Skriv meldingen din..."
                        rows={1}
                        className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-white/40 outline-none max-h-28 px-1.5 py-1.5 text-base sm:text-sm"
                        disabled={loading}
                      />
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        aria-label="Send melding"
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-black disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2 text-[10px] text-white/30 text-center">
                      AI kan gjøre feil. Sjekk viktig info.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
