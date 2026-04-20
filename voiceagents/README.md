# Arxon VoiceAgents — Master-dokumentasjon

Dette er *kilden til sannhet* for alle AI-resepsjonistene våre. Før vi bygger, konfigurerer
eller endrer noe i Vapi, skal endringen først være forankret her. Formålet er å kutte
bort «bygg-feil-fiks-rebuild»-syklusen — alt vi senere limer inn i Vapi-dashboardet skal
være et direkte avtrykk av disse filene.

> **Les `PRINSIPPER.md` først.** De fem reglene der overstyrer alt annet i denne mappen
> når det oppstår tvil.

## Arkitektur-beslutning: ett felles skjelett + variabler

Vi har **én** system prompt (`shared/skeleton-system-prompt.md`) som brukes av alle tre
nisjer. Nisje-spesifikk kontekst injiseres via `{{variabler}}` fra nisjens `variables.md`
før vi serialiserer til Vapi-config. Dette gir:

- Kortere prompts → bedre instruksjonstroskap, lavere latency.
- Én plass å fikse felles bugs (f.eks. "ikke gi medisinske råd" gjelder uansett).
- Enklere å legge til nisje nummer fire senere.

Se `PRINSIPPER.md §Regel 3` for bakgrunnen.

## Mappestruktur

```
voiceagents/
├── README.md                 ← Denne filen. Start her.
├── PRINSIPPER.md             ← Ti regler vi bygger etter. Les før du endrer noe.
├── research/                 ← Teknisk grunnforståelse av Vapi og norsk tale.
│   ├── 01-vapi-kapabiliteter.md
│   ├── 02-norsk-transkribering.md
│   ├── 03-norsk-tts-og-uttale.md
│   ├── 04-latens-og-turn-taking.md
│   ├── 05-edge-cases-og-guardrails.md
│   ├── 06-konverterings-psykologi.md
│   ├── 07-disclosure-og-samtykke.md
│   ├── 08-fallback-og-menneske-overtakelse.md
│   └── 09-knowledge-base-strategi.md
├── shared/                   ← Gjenbrukbare byggeklosser på tvers av nisjer.
│   ├── skeleton-system-prompt.md   ← ETT felles skjelett med {{variabler}}
│   ├── variables-schema.md         ← Kontrakten hver nisjes variables.md må fylle
│   ├── fallback-bibliotek-no.md
│   ├── fallback-bibliotek-en.md
│   ├── guardrails.md
│   ├── tools-katalog.md
│   └── scenario-playbook.md
├── lisa-helse/               ← Klinikk-resepsjonisten.
├── max-bilverksted/          ← Verksted-resepsjonisten.
└── ella-elektriker/          ← Elektriker-resepsjonisten.
```

Hver nisje-mappe inneholder:

| Fil | Formål |
| --- | --- |
| `inbound-master-plan.md` | Narrativ beskrivelse: hvem hun/han er, hva de gjør, hva som er utenfor scope, KPI-er. |
| `variables.md` | Nisje-spesifikke verdier som injiseres i `shared/skeleton-system-prompt.md`. Dette er *eneste* sted nisje-prompt-innhold eksisterer. |
| `scenarios.md` | Hvert tenkelige samtale-scenario med konkrete norske + engelske replikker — brukes for å teste at skjelettet + variabler faktisk gir riktig oppførsel. |
| `pronunciation-dictionary.md` | Ord og fraser som TTS-en uttaler feil, med fonetisk fiks. |
| `vapi-config.json` | Komplett Vapi Assistant-config som kan POST-es til `/assistant` API-et. Genereres ved å flette skjelett + variabler + tools-katalog. |

> **Obs:** Det finnes *ingen* `system-prompt.md` per nisje. Hele poenget med
> skjelett-arkitekturen er at vi har én prompt, ikke tre.

## Arbeidsflyt når noe skal endres

1. **Oppdater dokumentasjonen først.** Endre master-plan og/eller scenarios.md.
2. **Oppdater `system-prompt.md` og `vapi-config.json`** slik at de reflekterer endringen.
3. **Lim inn i Vapi dashboard** (eller kjør config mot API-et).
4. **Test i produksjon** via "Ring nå"-knappen på landingssiden.
5. **Logg eventuelle nye edge-cases** tilbake i `scenarios.md`.

Motsatt retning (først fikse i Vapi, så glemme å oppdatere docs) skaper drift og er
årsaken til at vi havnet i rebuild-loopen. Ikke gjør det.

## Dagens scope: kun inbound

Outbound (cold calls, påminnelser, follow-ups) kommer som Fase 2 når inbound er stabil
for alle tre nisjer. Outbound bruker mye av det samme grunnlaget (samme stemmer, samme
system prompt-kjerne), men krever egne scenarios-filer og compliance-regler (GDPR,
samtykke, "ikke forstyrr"-register).

## Hvordan lese filene

- **Leser du for første gang?** Gå i rekkefølge: `research/ → shared/ → en nisje`.
- **Skal du fikse en bug i produksjon?** Hopp rett til nisjens `scenarios.md` og se om
  scenariet finnes. Hvis ikke — legg det til *før* du fikser prompten.
- **Skal du lage en ny assistant?** Kopier mal fra `shared/system-prompt-template.md`
  og `shared/tools-katalog.md`, og fyll inn nisje-spesifikk kontekst.

## Språk-policy

Alt kunde-rettet innhold har **norsk som primærspråk** med engelsk fallback. Hvis
kunden tydelig snakker engelsk (oppdages automatisk av Vapi eller via en kommando
som "speak English"), bytter assistenten språk — men forblir på engelsk resten av
samtalen med mindre kunden bytter tilbake.

## Navnekonvensjon for Vapi-assistenter

```
arxon-[nisje]-[retning]-[miljø]

Eksempler:
arxon-helse-inbound-prod
arxon-bilverksted-inbound-staging
arxon-elektriker-outbound-prod
```

Dette gjør det umulig å forveksle prod- og testmiljø når man klikker i dashboardet.

## Versjoning

Hver master-plan har en versjons-header øverst:

```yaml
---
version: 1.0
last_updated: 2026-04-18
owner: younes
status: draft | in-review | production
---
```

Øk `version` når du gjør ikke-trivielle endringer. Test-samtaler skal kunne knyttes
tilbake til en kjent versjon (skriv inn i Vapi `metadata.prompt_version` når du
deployer).
