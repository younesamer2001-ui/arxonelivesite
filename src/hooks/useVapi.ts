"use client";
import { useCallback, useEffect, useRef, useState } from "react";

// Vapi public keys er UUID-er. Vercel env add via `printf 'y\n...' | vercel env add`
// har historisk korruptert lagret verdi til noe som `y\n66d0cbad-...`. Da blir
// Authorization-headeren `Bearer y\n66d0cbad-...` og Vapi svarer 400 Bad Request.
// Vi henter derfor bare UUID-mønsteret ut av env-var-verdien; faller tilbake til
// hardkodet ren nøkkel hvis env-var er tom eller ikke inneholder en gyldig UUID.
const UUID_RE = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
const FALLBACK_VAPI_PUBLIC_KEY = "66d0cbad-819e-44bf-9837-62a491f26adf";
const RAW_VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "";
const MATCHED_VAPI_PUBLIC_KEY = RAW_VAPI_PUBLIC_KEY.match(UUID_RE)?.[0];
const VAPI_PUBLIC_KEY = MATCHED_VAPI_PUBLIC_KEY ?? FALLBACK_VAPI_PUBLIC_KEY;

if (
  typeof window !== "undefined" &&
  RAW_VAPI_PUBLIC_KEY &&
  RAW_VAPI_PUBLIC_KEY !== VAPI_PUBLIC_KEY
) {
  // Env-var eksisterer men var ikke en ren UUID — vi saniterte den.
  // Logger én gang så man ser det i Console under feilsøking.
  // eslint-disable-next-line no-console
  console.warn(
    "[Vapi] NEXT_PUBLIC_VAPI_PUBLIC_KEY var ikke en ren UUID; saniterte den.",
  );
}

type CallStatus = "idle" | "connecting" | "active" | "ended";

export interface VapiError {
  code?: string;
  message: string;
}

// Plukk en menneske-lesbar feilmelding ut av det Vapi kaster på oss.
// Typisk form: { error: { message, statusCode } }, men vi godtar alt.
function normalizeVapiError(raw: unknown): VapiError {
  if (!raw) return { message: "Ukjent feil" };
  if (typeof raw === "string") return { message: raw };
  if (raw instanceof Error) return { message: raw.message };
  if (typeof raw === "object") {
    const anyRaw = raw as Record<string, unknown>;
    // Vapi wrapper: { error: { message, statusCode } }
    const inner =
      typeof anyRaw.error === "object" && anyRaw.error !== null
        ? (anyRaw.error as Record<string, unknown>)
        : null;
    const message =
      (typeof anyRaw.message === "string" && anyRaw.message) ||
      (inner && typeof inner.message === "string" && inner.message) ||
      (typeof anyRaw.type === "string" && anyRaw.type) ||
      "Ukjent feil";
    const code =
      (typeof anyRaw.code === "string" && anyRaw.code) ||
      (inner && typeof inner.statusCode !== "undefined"
        ? String(inner.statusCode)
        : undefined) ||
      (typeof anyRaw.statusCode !== "undefined"
        ? String(anyRaw.statusCode)
        : undefined);
    return code ? { code, message } : { message };
  }
  return { message: String(raw) };
}

export function useVapi() {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<VapiError | null>(null);
  const vapiRef = useRef<any>(null);
  const preloadingRef = useRef<Promise<void> | null>(null);

  // Preload the Vapi SDK + instantiate the client. Safe to call multiple
  // times; caches the first attempt. Shaving this off the click→connect
  // path saves ~1-2s since the SDK is ~100KB and needs WebRTC init.
  const preload = useCallback(() => {
    if (vapiRef.current) return Promise.resolve();
    if (preloadingRef.current) return preloadingRef.current;
    preloadingRef.current = (async () => {
      try {
        const { default: Vapi } = await import("@vapi-ai/web");
        if (!vapiRef.current) {
          vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);
          vapiRef.current.on("call-start", () => setStatus("active"));
          vapiRef.current.on("call-end", () => {
            setStatus("ended");
            setTimeout(() => setStatus("idle"), 2000);
          });
          vapiRef.current.on("error", (err: unknown) => {
            console.error("[Vapi] error:", err);
            setError(normalizeVapiError(err));
            setStatus("ended");
            setTimeout(() => setStatus("idle"), 2000);
          });
        }
      } catch (err) {
        console.error("[Vapi] preload failed:", err);
        preloadingRef.current = null; // allow retry
      }
    })();
    return preloadingRef.current;
  }, []);

  const start = useCallback(
    async (assistantId: string) => {
      if (status === "active" || status === "connecting") return;
      setError(null);
      setStatus("connecting");
      try {
        // Preloaded in the background when the widget opened; this is a
        // no-op fast-path if `preload()` has already finished.
        await preload();
        if (!vapiRef.current) throw new Error("Vapi SDK not initialised");
        await vapiRef.current.start(assistantId);
      } catch (err) {
        console.error("[Vapi] start failed:", err);
        setError(normalizeVapiError(err));
        setStatus("idle");
      }
    },
    [status, preload],
  );

  const stop = useCallback(() => {
    if (vapiRef.current) {
      try {
        vapiRef.current.stop();
      } catch {
        /* noop */
      }
      setStatus("ended");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (vapiRef.current) {
      const newMuted = !isMuted;
      try {
        vapiRef.current.setMuted(newMuted);
        setIsMuted(newMuted);
      } catch {
        /* noop */
      }
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch {
          /* noop */
        }
        vapiRef.current = null;
      }
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Keep the same return shape so ChatbotWidget.tsx doesn't need changes.
  return {
    status,
    isMuted,
    error,
    start,
    stop,
    toggleMute,
    clearError,
    preload,
  };
}
