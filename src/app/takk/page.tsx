"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function TakkPage() {
  return (
    <Suspense fallback={null}>
      <TakkContent />
    </Suspense>
  );
}

function TakkContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") ?? "";

  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          website,
          about,
          contactName,
          contactEmail,
          contactPhone,
          sessionId,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || !data.success) {
        setError(data.error || "Kunne ikke sende skjemaet. Prøv igjen.");
        setSubmitting(false);
        return;
      }
      setSent(true);
      setSubmitting(false);
    } catch {
      setError("Nettverksfeil. Prøv igjen.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Hero / bekreftelse */}
        <div className="text-center space-y-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-7 h-7 text-green-400"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Takk for bestillingen
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Betalingen er mottatt. Kvittering er sendt på e-post. For å komme i gang raskt,
            fyll ut skjemaet under og book et oppsettsmøte.
          </p>
        </div>

        {/* Intake-skjema */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-1">Fortell oss om bedriften</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Dette hjelper oss å forberede AI-resepsjonisten din før oppsettsmøtet.
          </p>

          {sent ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <div>
                <p className="font-semibold text-green-300">Skjema sendt</p>
                <p className="text-sm text-zinc-400 mt-1">
                  Vi har mottatt informasjonen. Book oppsettsmøtet under.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm text-zinc-300 mb-1.5">
                    Bedriftsnavn <span className="text-red-400">*</span>
                  </span>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                    placeholder="Oslo Bilverksted AS"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm text-zinc-300 mb-1.5">Nettside</span>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                    placeholder="https://www.bedriftenmin.no"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-sm text-zinc-300 mb-1.5">
                  Fortell oss om bedriften din <span className="text-red-400">*</span>
                </span>
                <textarea
                  required
                  rows={5}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 resize-none"
                  placeholder="Hva gjør dere? Hvilke typiske spørsmål får dere fra kunder? Åpningstider? Tjenester vi bør kjenne til?"
                />
              </label>

              <div className="grid md:grid-cols-3 gap-4">
                <label className="block">
                  <span className="block text-sm text-zinc-300 mb-1.5">Kontaktperson</span>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                    placeholder="Navn"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm text-zinc-300 mb-1.5">E-post</span>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                    placeholder="deg@bedrift.no"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm text-zinc-300 mb-1.5">Telefon</span>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
                    placeholder="+47 ..."
                  />
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sender…" : "Send informasjon"}
              </button>
            </form>
          )}
        </section>

        {/* Cal.com booking */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-1">Book oppsettsmøte</h2>
          <p className="text-sm text-zinc-500 mb-6">
            Velg et tidspunkt som passer for deg. Vi går gjennom oppsettet sammen (ca. 30 min).
          </p>
          <div className="rounded-xl overflow-hidden border border-zinc-800 bg-white">
            <iframe
              src="https://cal.com/arxon/30min?embed=true&theme=dark"
              className="w-full h-[600px] sm:h-[650px] md:h-[700px]"
              style={{ border: "none" }}
              title="Book oppsettsmøte"
            />
          </div>
        </section>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Tilbake til forsiden
          </Link>
        </div>
      </div>
    </main>
  );
}
