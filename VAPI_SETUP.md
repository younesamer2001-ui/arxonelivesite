# Vapi-oppsett for Arxon "Ring nå"-demo

Denne guiden viser hvordan du setter opp Vapi så kunder kan ringe Lisa, Max og Ella
direkte i nettleseren fra `MeetAgents`-seksjonen ("Trent for din bransje").

---

## 1. Opprett Vapi-konto

1. Gå til https://vapi.ai og registrer deg (gratis opp til $10 credits).
2. Verifiser e-post og logg inn på https://dashboard.vapi.ai

## 2. Finn Public API Key

Public key ligger allerede hardkodet i `src/hooks/useVapi.ts`:

```
66d0cbad-819e-44bf-9837-62a491f26adf
```

**Hvis dette ikke er din nøkkel** (f.eks. du har egen Vapi-konto):
1. Dashboard → **API Keys** → kopier din **Public Key**
2. Erstatt verdien i `src/hooks/useVapi.ts` linje 4.

> Merk: Vapi public key er designet for å være klient-synlig.
> Det er server-side **Private Key** som ALDRI skal i frontend-kode.

## 3. Opprett tre assistenter

I Dashboard → **Assistants** → **Create Assistant**. Opprett én per bransje:

### Lisa — Helse & Klinikk

- **Name**: `Lisa - Helse`
- **First Message**: `Hei, du har ringt klinikken. Jeg heter Lisa, hva kan jeg hjelpe deg med?`
- **System Prompt**:
  ```
  Du er Lisa, en vennlig AI-resepsjonist for en helseklinikk i Norge.
  Du hjelper med timebooking, påminnelser og generelle pasienthenvendelser.
  Svar alltid på norsk. Vær kort, varm og profesjonell.
  Hvis noen trenger akutt hjelp, be dem ringe 113.
  Du kan ikke gi medisinske råd — henvis til lege.
  ```
- **Voice**: Velg en norsk stemme (f.eks. ElevenLabs `Matilda` eller Azure `nb-NO-IselinNeural`)
- **Model**: `GPT-4o-mini` (raskt og billig for demo)
- **Transcriber**: Deepgram `nova-2`, språk `no` (norsk)

Lagre → kopier **Assistant ID** (ser ut som `abc12345-6789-...`).

### Max — Bilverksted

- **Name**: `Max - Bilverksted`
- **First Message**: `Hei, du har ringt verkstedet. Max her, hva kan jeg hjelpe deg med i dag?`
- **System Prompt**:
  ```
  Du er Max, resepsjonist på et norsk bilverksted.
  Du håndterer bestilling av service, EU-kontroll, dekkskift og reparasjoner.
  Svar alltid på norsk. Vær rask og konkret.
  Spør om bilmerke, modell og reg.nummer når relevant.
  Foreslå ledige tider denne uka eller neste uke.
  ```
- Samme stemme-/modell-oppsett som Lisa (gjerne en mannlig stemme, f.eks. `Daniel`)

### Ella — Elektriker

- **Name**: `Ella - Elektriker`
- **First Message**: `Hei, du har ringt elektrikerfirmaet. Ella her, hva kan jeg hjelpe deg med?`
- **System Prompt**:
  ```
  Du er Ella, resepsjonist for et norsk elektrikerfirma.
  Du tar imot feilmeldinger, bookinger av oppdrag og generelle henvendelser.
  Svar alltid på norsk. Spør om adresse og problem-beskrivelse.
  Hvis det er akutt (gnister, røyk, strømbrudd) — be dem ringe 110 først.
  ```

Kopier alle tre Assistant ID-ene.

## 4. Legg ID-ene inn i prosjektet

Åpne `.env.local` i rotmappen (`/Users/younesamer/Desktop/Arxon/nettside/.env.local`) og lim inn:

```bash
NEXT_PUBLIC_VAPI_ASSISTANT_LISA=abc12345-6789-...
NEXT_PUBLIC_VAPI_ASSISTANT_MAX=def67890-1234-...
NEXT_PUBLIC_VAPI_ASSISTANT_ELLA=ghi11111-2222-...
```

Restart dev-serveren:
```bash
npm run dev
```

Nå vil "Ring nå"-knappene bli aktive. Uten IDs vises "Demo kommer snart" i stedet.

## 5. Vercel (produksjon)

Legg de samme tre env-variablene inn på Vercel:

```bash
vercel env add NEXT_PUBLIC_VAPI_ASSISTANT_LISA production
vercel env add NEXT_PUBLIC_VAPI_ASSISTANT_MAX production
vercel env add NEXT_PUBLIC_VAPI_ASSISTANT_ELLA production
```

Eller via dashboard: https://vercel.com → Project → Settings → Environment Variables.

## 6. Test lokalt

1. Åpne http://localhost:3000/#prov-ai
2. Klikk "Ring nå" på Lisa-kortet
3. Godkjenn mikrofon i browseren
4. Samtalen kobles til innen ~1 sekund og "Live"-indikator dukker opp
5. Nedtelleren viser gjenstående tid (2:00 → 0:00). Auto-hangup ved 2 min.
6. Klikk "Legg på" for å avslutte tidlig, eller mikrofon-ikonet for å dempe.

## 7. Browser-krav

Vapi bruker WebRTC og krever:
- **HTTPS** i prod (Vercel har dette by default, localhost er unntatt)
- **Moderne browser**: Chrome/Edge/Safari/Firefox (ikke IE)
- **Mikrofon-tillatelse** (brukeren får prompt første gang)

## 8. Kostnadskontroll

For å unngå at noen misbruker demoen:

- **2-min grense** håndheves client-side i `MeetAgents.tsx` (konstanten `MAX_CALL_SECONDS`)
- **Server-side kill switch**: Sett `maxDurationSeconds: 120` på hver assistant i Vapi dashboard
  (Settings → Call Duration Limit). Da kan ikke klienten omgå grensen.
- **Daily spend cap**: Dashboard → Billing → sett "Max daily spend" (anbefalt: $5/dag)

## 9. Feilsøking

**"Demo kommer snart" vises selv etter env er satt**
→ Restart dev-server. Next.js leser `NEXT_PUBLIC_*` på build-tid.

**Samtale kobler aldri til**
→ Åpne DevTools Console. Se etter `Vapi error:`. Vanligste årsaker:
  - Feil assistant ID
  - Public key mismatch
  - Mikrofon ikke godkjent
  - CORS (hvis lokalt IP ≠ localhost)

**Lyden knekker / latency**
→ Bytt LLM i Vapi fra GPT-4 til GPT-4o-mini. Bytt TTS til ElevenLabs Turbo.

**Robotisk norsk stemme**
→ Azure `nb-NO-IselinNeural` er gratis og lyder godt.
  ElevenLabs multilingual v2 er bedre, men koster ~3× mer.

---

Ferdig satt opp? Kunder kan nå teste AI-resepsjonisten direkte i nettleseren.
