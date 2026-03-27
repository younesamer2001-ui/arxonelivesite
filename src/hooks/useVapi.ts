"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const VAPI_PUBLIC_KEY = "66d0cbad-819e-44bf-9837-62a491f26adf";

type CallStatus = "idle" | "connecting" | "active" | "ended";

export function useVapi() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const vapiRef = useRef<any>(null);

  const start = useCallback(async (assistantId: string) => {
    if (status === "active" || status === "connecting") return;
    setStatus("connecting");
    try {
      const { default: Vapi } = await import("@vapi-ai/web");
      if (!vapiRef.current) {
        vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
        vapiRef.current.on("call-start", () => setStatus("active"));
        vapiRef.current.on("call-end", () => {
          setStatus("ended");
          setTimeout(() => setStatus("idle"), 2000);
        });
        vapiRef.current.on("error", () => {
          setStatus("ended");
          setTimeout(() => setStatus("idle"), 2000);
        });
      }
      await vapiRef.current.start(assistantId);
    } catch (err) {
      console.error("Vapi error:", err);
      setStatus("idle");
    }
  }, [status]);

  const stop = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      setStatus("ended");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      const newMuted = !isMuted;
      vapiRef.current.setMuted(newMuted);
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  }, []);

  return { status, isMuted, start, stop, toggleMute };
}
