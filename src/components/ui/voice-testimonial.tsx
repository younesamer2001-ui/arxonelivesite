"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Loader2, Mic, MicOff } from "lucide-react";
import { useVapi } from "@/hooks/useVapi";

export interface Testimonial {
  image?: string;
  name?: string;
  jobtitle?: string;
  text?: string;
  audio?: string;
  phoneNumber?: string;
  icon?: React.ReactNode;
  assistantId?: string;
}

interface VoiceTestimonialProps {
  testimonials: Testimonial[];
  mode?: "light" | "dark";
  autoScroll?: boolean;
}

/* ───────── call button ───────── */
function CallButton({
  assistantId,
  status,
  isThisCall,
  isMuted,
  onStart,
  onStop,
  onToggleMute,
  disabled,
}: {
  assistantId?: string;
  status: string;
  isThisCall: boolean;
  isMuted: boolean;
  onStart: (id: string) => void;
  onStop: () => void;
  onToggleMute: () => void;
  disabled: boolean;
}) {
  if (!assistantId) return null;

  /* connecting */
  if (isThisCall && status === "connecting") {
    return (
      <div className="flex gap-2 mt-3">
        <button
          disabled
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-yellow-500/20 text-yellow-300 cursor-wait"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Kobler til...
        </button>
      </div>
    );
  }

  /* active */
  if (isThisCall && status === "active") {
    return (
      <div className="flex gap-2 mt-3">
        <button
          onClick={onStop}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
        >
          <PhoneOff className="w-4 h-4" />
          Legg på
        </button>
        <button
          onClick={onToggleMute}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title={isMuted ? "Slå på mikrofon" : "Demp mikrofon"}
        >
          {isMuted ? (
            <MicOff className="w-4 h-4 text-red-400" />
          ) : (
            <Mic className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    );
  }

  /* ended */
  if (isThisCall && status === "ended") {
    return (
      <div className="flex gap-2 mt-3">
        <span className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-white/10 text-white/60">
          Samtale avsluttet
        </span>
      </div>
    );
  }

  /* idle / default */
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => onStart(assistantId)}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          disabled
            ? "bg-white/5 text-white/30 cursor-not-allowed"
            : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
        }`}
      >
        <Phone className="w-4 h-4" />
        Ring nå
      </button>
    </div>
  );
}

/* ───────── single card ───────── */
function TestimonialCard({
  testimonial,
  status,
  isThisCall,
  isAnyCallActive,
  isMuted,
  onStart,
  onStop,
  onToggleMute,
}: {
  testimonial: Testimonial;
  status: string;
  isThisCall: boolean;
  isAnyCallActive: boolean;
  isMuted: boolean;
  onStart: (id: string) => void;
  onStop: () => void;
  onToggleMute: () => void;
}) {
  return (
    <div
      className={`relative flex-shrink-0 w-[320px] rounded-2xl p-6 transition-all duration-300 ${
        isThisCall && status === "active"
          ? "bg-white/[0.08] ring-2 ring-green-400/50 shadow-lg shadow-green-500/10"
          : "bg-white/[0.05] hover:bg-white/[0.08]"
      }`}
    >
      {/* live indicator */}
      {isThisCall && status === "active" && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      )}

      {/* icon + name */}
      <div className="flex items-center gap-4 mb-4">
        {testimonial.icon && (
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
            {testimonial.icon}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-white">{testimonial.name}</h4>
          <p className="text-sm text-white/60">{testimonial.jobtitle}</p>
        </div>
      </div>

      {/* description */}
      <p className="text-sm text-white/70 leading-relaxed mb-2">
        {testimonial.text}
      </p>

      {/* call button */}
      <CallButton
        assistantId={testimonial.assistantId}
        status={status}
        isThisCall={isThisCall}
        isMuted={isMuted}
        onStart={onStart}
        onStop={onStop}
        onToggleMute={onToggleMute}
        disabled={isAnyCallActive && !isThisCall}
      />
    </div>
  );
}

/* ───────── main component ───────── */
export default function VoiceTestimonial({
  testimonials,
  mode = "dark",
  autoScroll = true,
}: VoiceTestimonialProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { status, isMuted, start, stop, toggleMute } = useVapi();
  const [activeAssistantId, setActiveAssistantId] = useState<string | null>(
    null
  );

  const isAnyCallActive = status === "active" || status === "connecting";

  const handleStart = useCallback(
    (assistantId: string) => {
      setActiveAssistantId(assistantId);
      start(assistantId);
    },
    [start]
  );

  const handleStop = useCallback(() => {
    stop();
    /* activeAssistantId cleared after "ended" timeout via status effect */
  }, [stop]);

  useEffect(() => {
    if (status === "idle" && activeAssistantId) {
      setActiveAssistantId(null);
    }
  }, [status, activeAssistantId]);

  /* pause auto-scroll while a call is active */
  useEffect(() => {
    if (isAnyCallActive) setIsPaused(true);
  }, [isAnyCallActive]);

  /* auto-scroll */
  useEffect(() => {
    if (!autoScroll || isPaused || !scrollRef.current) return;
    const el = scrollRef.current;
    let raf: number;
    const step = () => {
      el.scrollLeft += 0.5;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [autoScroll, isPaused]);

  const doubled = [...testimonials, ...testimonials];

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isAnyCallActive) setIsPaused(false);
      }}
    >
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto py-4 px-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard
            key={`${t.name}-${i}`}
            testimonial={t}
            status={status}
            isThisCall={t.assistantId === activeAssistantId}
            isAnyCallActive={isAnyCallActive}
            isMuted={isMuted}
            onStart={handleStart}
            onStop={handleStop}
            onToggleMute={toggleMute}
          />
        ))}
      </div>
    </div>
  );
}
