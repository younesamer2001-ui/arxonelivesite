#!/usr/bin/env bash
# fix-vapi-webhook-auth.sh — fix "Unauthorized" fra /api/vapi/webhook.
#
# Hva dette gjør:
#   1. Leser VAPI_WEBHOOK_SECRET fra .env.local som sannhets-kilde.
#   2. Validerer at det er 64 hex-tegn (forventet format).
#   3. Fjerner evt. eksisterende (muligens korrupt) verdi fra Vercel production.
#   4. Legger verdien inn på nytt — IKKE via `printf 'y\n...'`-pipen som
#      tidligere korrupterte verdier med `y↵` foran (se
#      feedback_printf_env_corruption.md). Bruker `printf '%s'` uten newline.
#   5. Redeployer prod.
#   6. Smoke-tester webhook med shared-secret-header.
#
# Hvorfor vi trenger dette:
#   Chat-agenten får "Unauthorized" fra tool-calls. Server-URL-en på Vapi-
#   assistenten er allerede fikset (peker til arxon.no/api/vapi/webhook). Nå
#   feiler HMAC-verifiseringen fordi secreten på Vapi-siden (satt av
#   vapi-fix-server.sh til .env.local-verdien) ikke matcher det Vercel har.
#
# Kjør fra ~/Desktop/Arxon/nettside:
#     bash fix-vapi-webhook-auth.sh

set -euo pipefail

cd "$(dirname "$0")"

echo "================================================================"
echo " 1/6  Validerer at vi er i nettside/"
echo "================================================================"
if [ ! -f package.json ] || [ ! -f src/app/api/vapi/webhook/route.ts ]; then
  echo "Kjør fra ~/Desktop/Arxon/nettside (finner ikke package.json eller webhook/route.ts)."
  exit 1
fi
if [ ! -f .env.local ]; then
  echo "Mangler .env.local — trenger VAPI_WEBHOOK_SECRET derfra."
  exit 1
fi

echo
echo "================================================================"
echo " 2/6  Henter VAPI_WEBHOOK_SECRET fra .env.local"
echo "================================================================"
# Plukk ut kun verdien, uten navn/likhetstegn, uten quotes.
SECRET_VALUE="$(grep -E '^VAPI_WEBHOOK_SECRET=' .env.local | head -n1 | cut -d'=' -f2-)"
# Fjern evt. omsluttende anførselstegn.
SECRET_VALUE="${SECRET_VALUE%\"}"
SECRET_VALUE="${SECRET_VALUE#\"}"
SECRET_VALUE="${SECRET_VALUE%\'}"
SECRET_VALUE="${SECRET_VALUE#\'}"

if [ -z "$SECRET_VALUE" ]; then
  echo "Fant ikke VAPI_WEBHOOK_SECRET i .env.local."
  exit 1
fi

# Validering: forvent 64 hex-tegn. Ikke fatal, bare advarsel.
if ! printf '%s' "$SECRET_VALUE" | grep -qE '^[0-9a-fA-F]{64}$'; then
  echo "ADVARSEL: VAPI_WEBHOOK_SECRET ser ikke ut som 64 hex-tegn."
  echo "Lengde: ${#SECRET_VALUE} tegn. Fortsetter likevel."
fi

# Vis maskert verdi (første 6 + siste 4 tegn) så man bekrefter hvilken secret vi bruker.
MASK="${SECRET_VALUE:0:6}…${SECRET_VALUE: -4}"
echo "Bruker secret: $MASK  (lengde ${#SECRET_VALUE})"

echo
echo "================================================================"
echo " 3/6  Fjerner VAPI_WEBHOOK_SECRET fra Vercel production (hvis satt)"
echo "================================================================"
vercel env rm VAPI_WEBHOOK_SECRET production --yes 2>&1 || echo "(ikke satt i production, ok)"

echo
echo "================================================================"
echo " 4/6  Legger inn VAPI_WEBHOOK_SECRET på nytt — uten korrupt pipe"
echo "================================================================"
# VIKTIG: `printf '%s'` uten newline. IKKE `printf 'y\n$VALUE'` eller `echo`.
# `echo` legger på newline som Vercel lagrer. `printf '%s'` sender verdien rent.
printf '%s' "$SECRET_VALUE" | vercel env add VAPI_WEBHOOK_SECRET production

echo
echo "================================================================"
echo " 5/6  Redeployer prod så nye env-verdier trer i kraft"
echo "================================================================"
vercel --prod

echo
echo "================================================================"
echo " 6/6  Smoke-test webhook med shared-secret-header"
echo "================================================================"
# Vent litt så deployet er live.
echo "Venter 8 sek på at deployet blir live..."
sleep 8

# Post et minimalt status-update og bekreft 200 (ikke 401).
HTTP_CODE="$(curl -sS -o /tmp/vapi_webhook_test.out -w '%{http_code}' \
  -X POST https://arxon.no/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $SECRET_VALUE" \
  --data '{"message":{"type":"status-update","status":"in-progress"}}' \
  || true)"

echo "HTTP $HTTP_CODE"
echo "--- body ---"
cat /tmp/vapi_webhook_test.out
echo
echo "--- end ---"

if [ "$HTTP_CODE" = "200" ]; then
  echo "✓ Webhook godtar shared secret. Tool-calls skal funke nå."
  echo "  Prøv: Åpne https://arxon.no, start chat, be om å booke demo."
elif [ "$HTTP_CODE" = "401" ]; then
  echo "✗ Fortsatt Unauthorized. Mulige årsaker:"
  echo "    - Vapi-assistentens server.secret matcher ikke .env.local-verdien."
  echo "      Kjør ~/Downloads/vapi-fix-server.sh på nytt for å synke den."
  echo "    - Vercel-deployet har ikke trådt i kraft enda (vent ~30s og test igjen)."
  exit 1
else
  echo "Uventet HTTP-kode. Sjekk output over."
  exit 1
fi
