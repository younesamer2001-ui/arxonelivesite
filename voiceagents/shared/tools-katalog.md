# Shared tools-katalog

Alle tools som Arxon-agenter kan bruke, med full JSON-definisjon, når de
skal brukes, og hvilke nisjer som har dem aktivert i MVP.

Kilde: Vapi's `tools`-API (functions, transferCall, endCall, toolCall-arrays).
Vapi godtar OpenAI-function-calling-format for custom tools, pluss et sett
innebygde tools.

**Regel:** Nisjen aktiverer tools via `enabled_tools`-listen i `variables.md`.
Ingen nisje skal kjøre med et tool som ikke er definert her. Hvis du trenger
et nytt tool, legg det til her *først*, så i `variables-schema.md`-toolslisten,
så i nisjens `variables.md`.

---

## 1. Oversikt — hvilke tools har vi

| Tool | Kategori | Lisa | Max | Ella | Beskrivelse |
| --- | --- | --- | --- | --- | --- |
| `transferCall` | Vapi-innebygd | ✓ | ✓ | ✓ | Overfør til telefonnummer (myk/hard) |
| `endCall` | Vapi-innebygd | ✓ | ✓ | ✓ | Avslutt samtalen |
| `stop_recording` | Vapi-innebygd | ✓ | ✓ | ✓ | Slå av opptak midt i samtalen |
| `query_company_knowledge` | Custom (KB) | ✓ | ✓ | ✓ | Slå opp i bedriftens knowledge base |
| `check_availability` | Custom (kalender) | ✓ | ✓ | — | Sjekk ledige tider |
| `book_appointment` | Custom (kalender) | ✓ | ✓ | — | Book time (befaring for Max) |
| `get_quote` | Custom (pris) | — | ✓ | ✓ | Hent pris-range fra KB/regler |
| `create_ticket` | Custom (CRM) | ✓ | ✓ | ✓ | Opprett sak for oppfølging |
| `send_sms_booking_link` | Custom (SMS) | ✓ | ✓ | ✓ | Send SMS med bookinglink |
| `send_sms_quote_summary` | Custom (SMS) | — | ✓ | ✓ | Send SMS med oppsummering + pris |
| `send_sms_callback_confirmation` | Custom (SMS) | ✓ | ✓ | ✓ | Bekreft tilbakeringing på SMS |
| `log_emergency` | Custom (CRM) | ✓ | — | ✓ | Logg akutt-hendelse høyprioritet |

Ella har ikke `check_availability`/`book_appointment` i MVP — elektrikere
jobber mot befaring som avtales manuelt eller via SMS-link (variables
`use_manual_scheduling: true`). Kan legges til i fase 2.

## 2. Innebygde Vapi-tools

### 2.1 `transferCall`

Vapi har dette som førsteklasses tool. Vi registrerer destinations per
nisje, med myk overføring (`transferMode: "warm-transfer-say-message"`) som
default.

```json
{
  "type": "transferCall",
  "destinations": [
    {
      "type": "number",
      "number": "+47{{transfer_primary_number}}",
      "message": "{{transfer_primary_message}}",
      "description": "Primær kontakt for {{business_name}}",
      "transferPlan": {
        "mode": "warm-transfer-say-message",
        "message": "Hei, det er en innringer som vil snakke med deg om [kort oppsummering]. Jeg kobler deg nå."
      }
    },
    {
      "type": "number",
      "number": "+47{{transfer_secondary_number}}",
      "message": "{{transfer_secondary_message}}",
      "description": "Sekundær kontakt (backup)"
    }
  ],
  "function": {
    "name": "transferCall",
    "description": "Overfør samtalen til et menneske når kunden ber om det, uttrykker frustrasjon, eller situasjonen krever et menneske (akutt, erstatningskrav, scope-brudd).",
    "parameters": {
      "type": "object",
      "properties": {
        "destination": {
          "type": "string",
          "enum": ["primary", "secondary"],
          "description": "Hvilken destination å ringe. Start med primary; sekundær hvis primary feiler."
        },
        "reason": {
          "type": "string",
          "enum": ["customer_request", "frustration", "scope_break", "emergency", "tool_failure", "complaint_escalation"],
          "description": "Grunnen til transfer — logges for metrics."
        },
        "summary_for_human": {
          "type": "string",
          "description": "Kort oppsummering som sies til mottaker før call connects."
        }
      },
      "required": ["destination", "reason", "summary_for_human"]
    }
  }
}
```

**Når brukes:**
- Kunden ber om menneske.
- Sentiment < −0.4 i > 20 s.
- Akutt som krever menneskelig beslutning (men *ikke* livstruende — da skal
  agenten si "ring 113" og avslutte, se `log_emergency`).
- Erstatningskrav / juridisk trussel.

**Fallback når transfer feiler:** Vapi prøver sekundær automatisk. Hvis begge
feiler → agenten får `tool_call_result: failed` og skal degradere til
`create_ticket` + `send_sms_callback_confirmation`.

### 2.2 `endCall`

```json
{
  "type": "endCall",
  "function": {
    "name": "endCall",
    "description": "Avslutt samtalen når kunden har sagt ha det, når oppgaven er løst og kunden har takket ja til recap, eller etter stille-timeout. Aldri avslutt uten å ha foreslått et konkret neste steg først (unntak: akutt eller kunden legger på selv).",
    "parameters": {
      "type": "object",
      "properties": {
        "reason": {
          "type": "string",
          "enum": ["completed", "customer_goodbye", "silence_timeout", "emergency_redirect", "escalated_elsewhere"],
          "description": "Hvorfor samtalen avsluttes."
        }
      },
      "required": ["reason"]
    }
  }
}
```

**Når brukes:** Se `skeleton-system-prompt.md` §ENDING THE CALL.

### 2.3 `stop_recording`

```json
{
  "type": "function",
  "function": {
    "name": "stop_recording",
    "description": "Slå av lydopptak for resten av samtalen. Brukes kun når kunden eksplisitt ber om det. Transcript kan fortsatt lagres som tekst iht. retention-policy.",
    "parameters": {
      "type": "object",
      "properties": {
        "confirmation_phrase_heard": {
          "type": "string",
          "description": "Sitat fra kunden som utløste dette — for audit."
        }
      },
      "required": ["confirmation_phrase_heard"]
    }
  }
}
```

**Når brukes:** Kunden sier "ikke ta opp", "slå av opptak", "jeg vil ikke bli
tatt opp". Se `research/07-disclosure-og-samtykke.md §5`.

## 3. Knowledge base tool

### 3.1 `query_company_knowledge`

```json
{
  "type": "function",
  "function": {
    "name": "query_company_knowledge",
    "description": "Slå opp i bedriftens knowledge base (priser, tjenester, åpningstider, policyer, FAQ). Bruk ALLTID dette tool-et når kunden spør om pris, tjenesteomfang, policy eller annen bedriftsspesifikk informasjon. Ikke gjett fra hukommelsen. Tool-et returnerer tekst-utdrag med kildereferanse.",
    "parameters": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Spørsmålet på norsk, slik kunden stilte det eller omformulert til konsist søk. Eksempel: 'pris EU-kontroll personbil', 'åpningstider lørdag', 'refusjon fysioterapi'."
        },
        "topic": {
          "type": "string",
          "enum": "{{knowledge_topics}}",
          "description": "Hvilket tema — brukes for å avgrense søket. Velg det som passer best."
        },
        "max_results": {
          "type": "integer",
          "default": 3,
          "description": "Antall utdrag å hente. Default 3. Øk til 5 hvis første forsøk gir tynne svar."
        }
      },
      "required": ["query", "topic"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/query_company_knowledge",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

**Implementasjon:** Arxon-backend mottar POST, gjør vektorsøk mot Trieve-
dataset for den nisjen (identifisert via `{{knowledge_file_id}}`), returnerer
topp-N utdrag som JSON: `{results: [{snippet, source_doc, confidence}], ...}`.

**Når brukes:** Alle kunnskapsspørsmål — priser, tjenesteomfang, åpningstider,
policyer, refusjon, garanti. Ikke brukes for variabler som *ligger* i prompten
(åpningstider kan ligge i `opening_hours_prose` og trengs ikke slås opp).

**Guardrail i prompt:** "Ikke gjett priser eller policyer fra hukommelsen. Hvis
KB ikke gir svar, si 'jeg finner ikke det akkurat nå' og tilby å ta beskjed."

Full detaljer i `research/09-knowledge-base-strategi.md`.

## 4. Kalender-tools

### 4.1 `check_availability`

```json
{
  "type": "function",
  "function": {
    "name": "check_availability",
    "description": "Sjekk ledige tider i bedriftens kalender. Bruk når kunden vil booke og du trenger å foreslå konkrete tidspunkter.",
    "parameters": {
      "type": "object",
      "properties": {
        "service_type": {
          "type": "string",
          "description": "Type tjeneste — må matche kalenderens tjenestekategori. Eksempler Lisa: 'fysio_45min', 'lege_20min'. Eksempler Max: 'eu_kontroll', 'service_liten', 'service_stor', 'dekkskift'."
        },
        "date_range_start": {
          "type": "string",
          "format": "date",
          "description": "Tidligste dato (YYYY-MM-DD) å søke fra. Default i dag."
        },
        "date_range_end": {
          "type": "string",
          "format": "date",
          "description": "Seneste dato å søke til. Default +14 dager."
        },
        "preferred_time_of_day": {
          "type": "string",
          "enum": ["morning", "midday", "afternoon", "any"],
          "default": "any",
          "description": "Kundens preferanse hvis oppgitt."
        },
        "duration_minutes": {
          "type": "integer",
          "description": "Hvor lang tid tjenesten tar. Hentes fra KB hvis ikke oppgitt av kunden."
        }
      },
      "required": ["service_type"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/check_availability",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

**Respons:** `{slots: [{start: ISO8601, end: ISO8601, staff_id, staff_name}], ...}`.

**Implementasjon:** Backend snakker med nisjens kalendersystem (Lisa: trolig
Aspit/ProMedicus; Max: Autoflyt eller Google Calendar; ikke Ella i MVP).

### 4.2 `book_appointment`

```json
{
  "type": "function",
  "function": {
    "name": "book_appointment",
    "description": "Book en bekreftet tid i kalenderen. Bruk først etter kunden har bekreftet både tidspunkt og at de vil bestille.",
    "parameters": {
      "type": "object",
      "properties": {
        "slot_start_iso": {
          "type": "string",
          "format": "date-time",
          "description": "Starttid ISO8601 (med tidssone), matcher et slot fra check_availability."
        },
        "service_type": {
          "type": "string",
          "description": "Samme enum som check_availability."
        },
        "staff_id": {
          "type": "string",
          "description": "Hvis spesifikk person — ellers bruk første ledige."
        },
        "customer_name": {
          "type": "string"
        },
        "customer_phone": {
          "type": "string",
          "description": "E.164-format foretrukket (+47...)."
        },
        "customer_note": {
          "type": "string",
          "description": "Fritekst — f.eks. 'BMW X3, 2019, oljelampe lyser' eller 'første gang hos oss'. Ikke lagre spesialkategori-data (helse) uten eksplisitt samtykke."
        }
      },
      "required": ["slot_start_iso", "service_type", "customer_name", "customer_phone"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/book_appointment",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

**Respons:** `{booking_id, confirmed_slot_start, confirmed_staff_name, sms_confirmation_sent: true}`.

**Obligatorisk oppfølging:** Backend sender automatisk SMS-bekreftelse. Hvis
SMS feiler, retur `{..., sms_confirmation_sent: false}` og agenten skal tilby
e-post i stedet.

## 5. Pristilbud-tool

### 5.1 `get_quote`

```json
{
  "type": "function",
  "function": {
    "name": "get_quote",
    "description": "Hent prisestimat basert på jobb-beskrivelse. Returnerer en range, ikke eksakt tall, med mindre KB har bindende pris. Bruk ALLTID for pris-spørsmål på jobb (EU-kontroll, ladeboks-installasjon, etc.) — ikke gjett.",
    "parameters": {
      "type": "object",
      "properties": {
        "service_type": {
          "type": "string",
          "description": "Tjeneste-kategori. Eksempler Max: 'eu_kontroll', 'service_liten', 'dekkskift_aluminium'. Eksempler Ella: 'ladeboks_hus', 'sikringsskap_bytte', 'lyspunkt_ekstra'."
        },
        "parameters": {
          "type": "object",
          "description": "Fritt key-value-objekt med relevante detaljer.",
          "properties": {
            "car_make": { "type": "string" },
            "car_model": { "type": "string" },
            "car_year": { "type": "integer" },
            "building_type": { "type": "string", "enum": ["house", "apartment", "commercial"] },
            "building_year": { "type": "integer" },
            "urgent": { "type": "boolean" }
          },
          "additionalProperties": true
        }
      },
      "required": ["service_type"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/get_quote",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

**Respons:** `{price_range_nok: [min, max], is_binding: false, requires_inspection: true|false, notes: "..."}`.

**Regel i prompt:** Agenten skal kommunisere `price_range_nok` som range
("mellom X og Y kroner"), og eksplisitt si om befaring trengs for bindende
tilbud.

## 6. CRM-tools (tickets)

### 6.1 `create_ticket`

```json
{
  "type": "function",
  "function": {
    "name": "create_ticket",
    "description": "Opprett en sak i CRM for oppfølging — brukes når kunden trenger tilbakeringing, har klage, eller transfer ikke er mulig. Backend sender automatisk intern e-post til ansvarlig + SMS til kunde.",
    "parameters": {
      "type": "object",
      "properties": {
        "category": {
          "type": "string",
          "enum": ["booking", "question", "quote", "complaint", "claim", "emergency", "gdpr_request", "callback_request", "other"],
          "description": "Klassifiser saken."
        },
        "priority": {
          "type": "string",
          "enum": ["low", "normal", "high", "critical"],
          "description": "Akutt = critical, erstatningskrav/klage = high, vanlig callback = normal."
        },
        "summary": {
          "type": "string",
          "description": "1–3 setninger som oppsummerer hva kunden trenger. LLM-generert. Skal være forståelig for mennesket som plukker opp saken."
        },
        "transcript_excerpt": {
          "type": "string",
          "description": "Relevant del av samtalen (sitat) som gir kontekst."
        },
        "callback_promised_by_iso": {
          "type": "string",
          "format": "date-time",
          "description": "Når lovet vi å ringe tilbake? ISO8601. Agenten oversetter 'innen en time' til konkret tidspunkt."
        },
        "customer_name": { "type": "string" },
        "customer_phone": { "type": "string" },
        "customer_email": { "type": "string" },
        "tags": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Fri tagging, f.eks. ['frustrated', 'second_call', 'referred_by_friend']."
        }
      },
      "required": ["category", "priority", "summary", "customer_phone"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/create_ticket",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

**Respons:** `{ticket_id: "T-2026-04-0432", sms_sent: true, assigned_to: "...", ...}`.

### 6.2 `log_emergency`

```json
{
  "type": "function",
  "function": {
    "name": "log_emergency",
    "description": "Logg en akutt hendelse med høyeste prioritet. Brukes ETTER agenten har bedt kunden ringe 113/110/112 direkte. Sender umiddelbar e-post + SMS til ansvarlig + on-call nummer.",
    "parameters": {
      "type": "object",
      "properties": {
        "emergency_type": {
          "type": "string",
          "enum": ["medical", "fire", "electrical_shock", "gas_leak", "structural", "other"],
          "description": "Type akutt."
        },
        "keyword_triggered": {
          "type": "string",
          "description": "Hvilket nøkkelord fra kundens replikk trigget dette."
        },
        "summary": { "type": "string" },
        "customer_phone": { "type": "string" },
        "customer_name": { "type": "string" }
      },
      "required": ["emergency_type", "keyword_triggered", "customer_phone"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/log_emergency",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

**Aktivert for:** Lisa (medisinsk), Ella (elektrisk). Ikke Max i MVP — kan
vurderes for gasslekkasje-scenarier fase 2.

## 7. SMS-tools

### 7.1 `send_sms_booking_link`

```json
{
  "type": "function",
  "function": {
    "name": "send_sms_booking_link",
    "description": "Send SMS med link til booking-side, eventuelt pre-utfylt med tjeneste-type og kontaktinfo. Brukes når kunden vil 'tenke på det' eller velge tid selv.",
    "parameters": {
      "type": "object",
      "properties": {
        "customer_phone": { "type": "string" },
        "customer_name": { "type": "string" },
        "prefilled_service": { "type": "string" },
        "prefilled_notes": { "type": "string" }
      },
      "required": ["customer_phone"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/send_sms_booking_link",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

### 7.2 `send_sms_quote_summary`

```json
{
  "type": "function",
  "function": {
    "name": "send_sms_quote_summary",
    "description": "Send SMS med oppsummering av samtalen og pris-range. Brukes når kunden har fått tilbud muntlig og ønsker det skriftlig, eller som default etter vellykket quote-samtale uten booking.",
    "parameters": {
      "type": "object",
      "properties": {
        "customer_phone": { "type": "string" },
        "customer_name": { "type": "string" },
        "service_summary": { "type": "string" },
        "price_range_nok": {
          "type": "array",
          "items": { "type": "integer" },
          "minItems": 2,
          "maxItems": 2
        },
        "validity_days": {
          "type": "integer",
          "default": 14,
          "description": "Hvor lenge tilbudet er gyldig."
        }
      },
      "required": ["customer_phone", "service_summary", "price_range_nok"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/send_sms_quote_summary",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

### 7.3 `send_sms_callback_confirmation`

```json
{
  "type": "function",
  "function": {
    "name": "send_sms_callback_confirmation",
    "description": "Send SMS-bekreftelse når vi har lovet tilbakeringing. Inkluderer ticket-ID og tidsramme. Trigges typisk etter create_ticket med category 'callback_request'.",
    "parameters": {
      "type": "object",
      "properties": {
        "customer_phone": { "type": "string" },
        "customer_name": { "type": "string" },
        "ticket_id": { "type": "string" },
        "callback_promised_by_iso": { "type": "string", "format": "date-time" }
      },
      "required": ["customer_phone", "ticket_id", "callback_promised_by_iso"]
    }
  },
  "server": {
    "url": "{{ARXON_BACKEND_URL}}/tools/send_sms_callback_confirmation",
    "secret": "{{ARXON_WEBHOOK_SECRET}}"
  }
}
```

## 8. Rendering av `{{tools_list_with_when_to_use}}`

Skjelett-prompten har placeholder `{{tools_list_with_when_to_use}}`. Build-
scriptet genererer en kompakt liste kun for tools nisjen har aktivert. Format:

```
- query_company_knowledge: spør KB før du svarer på pris, tjenester, policy.
- check_availability: når kunden vil booke, før du foreslår tid.
- book_appointment: etter kunden har bekreftet både tid og bestilling.
- create_ticket: når du lover tilbakeringing eller logger klage/akutt.
- send_sms_booking_link: når kunden vil "tenke på det".
- transferCall: ved frustrasjon, menneske-forespørsel, erstatningskrav.
- endCall: når kunden sier ha det eller samtalen er ferdig.
```

Merk: Vi skriver *kort* hint per tool i prompt. Full beskrivelse ligger i
tool-ets JSON-`description` og LLM har tilgang til den via function-calling.

## 9. Webhook-sikkerhet

Alle custom tools POSTes til `{{ARXON_BACKEND_URL}}/tools/<name>` med:

- Header `X-Vapi-Secret: {{ARXON_WEBHOOK_SECRET}}` — backend verifiserer.
- Header `X-Vapi-Signature: <hmac-sha256>` (hvis Vapi støtter det).
- Body: Vapi's standard `{call, assistant, tool_call}`-envelope.

Backend skal:
1. Verifisere secret/signature.
2. Rate-limit per `call_id`.
3. Logge innkommende i structured log (ikke PII i klartekst).
4. Returnere JSON-respons innen 2 sekunder (pref. 500 ms) ellers får Vapi
   timeout og agenten må degradere.

## 10. Feilhåndtering — response shape

Alle custom tools skal returnere:

```json
{
  "success": true,
  "data": { ... },           // verktøyspesifikk nyttelast
  "error": null
}
```

eller ved feil:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "KB_TIMEOUT" | "CALENDAR_UNAVAILABLE" | "INVALID_PARAMS" | "INTERNAL",
    "message_for_agent": "Jeg får ikke koblet meg til kalenderen akkurat nå.",
    "suggested_fallback": "create_ticket"
  }
}
```

LLM-prompten har regel: hvis `success: false`, si `message_for_agent` høyt,
og kall `suggested_fallback`-tool. Se `research/08-fallback-og-menneske-overtakelse.md §9`.

## 11. Metrikker per tool

Logges i `end-of-call-report.tool_calls[]`:

```json
{
  "name": "book_appointment",
  "called_at_seconds": 78.2,
  "latency_ms": 420,
  "success": true,
  "error_code": null,
  "retry_count": 0
}
```

Mål:
- `query_company_knowledge`-latens p95 < 500 ms.
- `check_availability`-latens p95 < 800 ms.
- `book_appointment`-suksessrate > 98 % (feil = backend-bug, må fikses).
- `transferCall` initiert innen 15 s etter frustrasjons-signal.

## 12. Sjekkliste før deploy per nisje

- [ ] `enabled_tools` i `variables.md` matcher matrix i §1.
- [ ] Backend-endepunkter registrert for alle custom tools.
- [ ] `ARXON_WEBHOOK_SECRET` satt som Vapi-assistant-secret.
- [ ] Transfer-numre verifisert (ringer ekte person).
- [ ] KB-dataset opplastet og `knowledge_file_id` satt.
- [ ] Kalender-integrasjon testet (Lisa, Max) med mock-booking.
- [ ] SMS-sender verifisert (Twilio short-code eller alpha-sender).
- [ ] Ticket-e-post går til riktig innboks.
- [ ] `log_emergency` testet for Lisa (medisinsk) og Ella (elektrisk).
- [ ] Feilhåndtering testet: timeout, 500, ugyldig respons.

## 13. Versjonering

Denne katalogen versjoneres separat fra skjelettet:

```
tools_catalog_version: "1.0.0"
```

Bumpes når:
- Ny tool legges til (minor).
- Parameter-skjema endres bakoverkompatibelt (patch).
- Breaking change i parameter-skjema (major) — krever oppdatert `variables.md`.

## Referanser

- `skeleton-system-prompt.md` — hvor `{{tools_list_with_when_to_use}}` rendres.
- `variables-schema.md` — hvor `enabled_tools`-listen valideres mot denne katalogen.
- `research/08-fallback-og-menneske-overtakelse.md` — når transfer/ticket trigges.
- `research/09-knowledge-base-strategi.md` — query_company_knowledge-detaljer.
- `research/05-edge-cases-og-guardrails.md` — tool-flow per scenario.
- Vapi docs: `tools`, `transferCall`, `endCall`, function-calling format.
