# Deploy voiceagents — activation runbook

End-to-end sequence for going from local configs to "Ring nå" placing a real
call on the live Arxon landing page. Follow **in order**; each step depends
on the output of the previous.

---

## 0. One-time env setup

Edit `.env.local` and Vercel Project → Settings → Environment Variables
and set:

```
VAPI_PRIVATE_KEY=<from dashboard.vapi.ai → API keys>
VAPI_API_BASE=https://api.vapi.ai
VAPI_WEBHOOK_SECRET=<generate 48+ random hex chars>

TRIEVE_API_KEY=<from dashboard.trieve.ai>
TRIEVE_HOST=https://api.trieve.ai
TRIEVE_DATASET_LISA=<dataset uuid>
TRIEVE_DATASET_MAX=<dataset uuid>
TRIEVE_DATASET_ELLA=<dataset uuid>

# filled in by step 4:
NEXT_PUBLIC_VAPI_ASSISTANT_LISA=
NEXT_PUBLIC_VAPI_ASSISTANT_MAX=
NEXT_PUBLIC_VAPI_ASSISTANT_ELLA=
```

`NEXT_PUBLIC_*` vars must also be configured in Vercel for production
builds to pick them up.

---

## 1. Resolve variable-substituted prompts

```
npm run resolve:voiceagents
```

Reads `voiceagents/shared/skeleton-system-prompt.md` and each niche's
`variables.md`, renders `{{placeholders}}` (except runtime SSML markers
like `{{tel:}}`, `{{time:}}`), and writes:

- `voiceagents/<niche>/resolved-system-prompt.txt`
- `voiceagents/<niche>/vapi-config.resolved.json`

Re-run any time you edit a `variables.md` or the skeleton.

---

## 2. Seed the Trieve knowledge base

Dry-run first:

```
npm run load:kb -- --dry-run
```

When chunks look right, upload:

```
npm run load:kb
```

Idempotent — tracking IDs are `<niche>:<filename>:<chunk_idx>`, so reruns
upsert instead of duplicating.

---

## 3. Deploy the webhook

The webhook route is `src/app/api/vapi/webhook/route.ts`. Push to Vercel:

```
git add -A && git commit -m "voiceagents: webhook + provisioning" && git push
```

After deploy, confirm the endpoint answers `GET` 200:

```
curl https://<your-domain>/api/vapi/webhook
# → {"ok":true,"service":"arxon-vapi-webhook"}
```

The webhook verifies either `X-Vapi-Secret` header (shared token) or
`X-Vapi-Signature: sha256=<hex>` (HMAC of raw body) against
`VAPI_WEBHOOK_SECRET`.

> Heads-up: the niche configs reference `https://api.arxon.no/vapi/webhook`
> as `serverUrl`. If you're on the default Vercel domain instead, either
> (a) alias the domain, or (b) edit `serverUrl` in each
> `voiceagents/<niche>/vapi-config.json` before step 4.

---

## 4. Provision assistants on Vapi

Dry-run first — prints sanitised payload without calling Vapi:

```
npm run provision:vapi -- --dry-run
```

Then go live:

```
npm run provision:vapi
```

On success the script prints a paste-ready block:

```
NEXT_PUBLIC_VAPI_ASSISTANT_LISA=asst_...
NEXT_PUBLIC_VAPI_ASSISTANT_MAX=asst_...
NEXT_PUBLIC_VAPI_ASSISTANT_ELLA=asst_...
```

Paste those three values into `.env.local` **and** Vercel Project → Env.
If an `NEXT_PUBLIC_VAPI_ASSISTANT_*` is already set, the script sends
`PATCH /assistant/<id>` instead of `POST /assistant`, so reruns update
the existing Vapi assistant in place.

Trigger a redeploy on Vercel so the public-runtime IDs ship.

---

## 5. Smoke-test from the landing page

1. Open the deployed site.
2. Click **Ring nå** on each of Lisa / Max / Ella.
3. Browser will ask for microphone permission. Allow.
4. You should hear the niche-specific `firstMessage` inside ~1.5 s.
5. Try a scripted path:
   - Lisa: "Jeg vil bestille time hos fastlege."
   - Max: "Jeg vil bestille EU-kontroll."
   - Ella: "Jeg har strømbrudd, dere må komme nå."
6. Watch Vercel → Functions → Logs for `/api/vapi/webhook` traffic —
   you should see `tool-calls`, `transcript`, and `end-of-call-report`
   message types.

The hard call cap is 2 min (`MAX_CALL_SECONDS=120` in `MeetAgents.tsx`),
enforced client-side on top of Vapi's own `maxDurationSeconds: 600`.

---

## 6. Rollback

If an assistant misbehaves in production:

- **Soft disable:** clear the assistant's env var in Vercel and redeploy.
  The "Ring nå" button shows **Demo kommer snart** again — zero user-facing
  errors, zero further billable minutes on that agent.
- **Hard disable:** in Vapi dashboard, archive the assistant. Any existing
  browser session attempting to start a new call will fail the
  `vapi.start()` SDK call (caught → status returns to `idle`).

---

## Where the pieces live

| File | Purpose |
| --- | --- |
| `voiceagents/shared/skeleton-system-prompt.md` | Single prompt template, one source of truth. |
| `voiceagents/<niche>/variables.md` | Per-niche values that fill the skeleton. |
| `voiceagents/<niche>/vapi-config.json` | Hand-authored Vapi assistant config shell. |
| `voiceagents/<niche>/kb/*.md` | KB source markdown → Trieve chunks. |
| `scripts/resolve-variables.ts` | Skeleton + variables → resolved prompt + resolved config. |
| `scripts/load-kb-to-trieve.ts` | KB markdown → Trieve `/api/chunk` upserts. |
| `scripts/provision-vapi.ts` | Resolved config → Vapi `/assistant` POST/PATCH. |
| `src/app/api/vapi/webhook/route.ts` | Tool-call router + HMAC verification. |
| `src/hooks/useVapi.ts` | Client SDK wrapper (call lifecycle, mute). |
| `src/components/MeetAgents.tsx` | Landing-page UI with 3 "Ring nå" cards. |
