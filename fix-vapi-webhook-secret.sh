#!/usr/bin/env bash
# fix-vapi-webhook-secret.sh — 2026-04-19
# ---------------------------------------------------------------
# Løser 401 "Unauthorized / signature mismatch" fra /api/vapi/webhook
# ved å synke VAPI_WEBHOOK_SECRET mellom .env.local og Vercel prod,
# deretter deploye og verifisere.
#
# Kjøres fra ~/Desktop/Arxon/nettside:
#     bash fix-vapi-webhook-secret.sh
#
# Dette scriptet:
#   1. Validerer miljø og leser secret fra .env.local.
#   2. Deployer nåværende working tree (webhook GET har et midlertidig
#      secret-fingerprint-endepunkt som vi bruker til å verifisere).
#   3. Sjekker fingerprint på prod. Hvis matcher .env.local → ferdig.
#      Hvis ikke → fjerner og re-legger inn via stdin (uten y-prefix).
#   4. Redeployer og verifiserer på nytt.
#   5. Smoke-tester POST med x-vapi-secret-header.

set -euo pipefail
cd "$(dirname "$0")"

# --- 0) sanity -------------------------------------------------------------
[ -f package.json ] && [ -f src/app/api/vapi/webhook/route.ts ] \
  || { echo "FEIL: kjør fra ~/Desktop/Arxon/nettside"; exit 1; }
[ -f .env.local ] || { echo "FEIL: mangler .env.local"; exit 1; }
command -v vercel >/dev/null || { echo "FEIL: mangler vercel CLI i PATH"; exit 1; }

# --- 1) les secret fra .env.local -----------------------------------------
LOCAL_SECRET="$(awk -F= '/^VAPI_WEBHOOK_SECRET=/{sub(/^VAPI_WEBHOOK_SECRET=/,""); print; exit}' .env.local)"
# strip evt. quotes
LOCAL_SECRET="${LOCAL_SECRET%\"}"; LOCAL_SECRET="${LOCAL_SECRET#\"}"
LOCAL_SECRET="${LOCAL_SECRET%\'}"; LOCAL_SECRET="${LOCAL_SECRET#\'}"
[ -n "$LOCAL_SECRET" ] || { echo "FEIL: fant ikke VAPI_WEBHOOK_SECRET i .env.local"; exit 1; }

EXPECTED_FP8="$(printf '%s' "$LOCAL_SECRET" | shasum -a 256 | cut -c1-8)"
echo "[1/5] Lokal secret-lengde: ${#LOCAL_SECRET}"
echo "      Forventet fingerprint: $EXPECTED_FP8"

# --- 2) første deploy (med midlertidig diagnose i GET) --------------------
echo ""
echo "[2/5] Deployer nåværende working tree (vercel output under)..."
echo "----------------------------------------------------------------"
vercel --prod --yes
echo "----------------------------------------------------------------"
# sleep litt så live
echo "Venter 10 sek på at deployet blir live..."
sleep 10

# --- 3) sammenlign fingerprint -------------------------------------------
echo ""
echo "[3/5] Sjekker prod-fingerprint..."
PROD_JSON="$(curl -sS https://arxon.no/api/vapi/webhook || true)"
echo "      $PROD_JSON"
PROD_FP8="$(printf '%s' "$PROD_JSON" | sed -n 's/.*"secret_fp8":"\([^"]*\)".*/\1/p')"
PROD_LEN="$(printf '%s' "$PROD_JSON"  | sed -n 's/.*"secret_len":\([0-9]*\).*/\1/p')"

if [ "$PROD_FP8" = "$EXPECTED_FP8" ] && [ "$PROD_LEN" = "${#LOCAL_SECRET}" ]; then
  echo "      ✓ Fingerprint matcher — Vercel har riktig secret. Hopper til smoke-test."
else
  echo "      ✗ Mismatch (prod=$PROD_FP8 len=$PROD_LEN vs expected=$EXPECTED_FP8 len=${#LOCAL_SECRET})."
  echo ""
  echo "[4/5] Fjerner og re-legger inn VAPI_WEBHOOK_SECRET i production..."
  vercel env rm VAPI_WEBHOOK_SECRET production --yes >/dev/null 2>&1 || true
  # KRITISK: bare verdien via printf '%s' — IKKE 'y\n' (korrupterer verdien).
  printf '%s' "$LOCAL_SECRET" | vercel env add VAPI_WEBHOOK_SECRET production
  echo ""
  echo "      Redeployer så ny env trer i kraft..."
  vercel --prod --yes
  echo "Venter 10 sek på at deployet blir live..."
  sleep 10

  # verifiser på nytt
  PROD_JSON2="$(curl -sS https://arxon.no/api/vapi/webhook || true)"
  echo "      $PROD_JSON2"
  PROD_FP8_2="$(printf '%s' "$PROD_JSON2" | sed -n 's/.*"secret_fp8":"\([^"]*\)".*/\1/p')"
  if [ "$PROD_FP8_2" != "$EXPECTED_FP8" ]; then
    echo "      ✗ Fortsatt mismatch. Stopper — sjekk vercel env ls manuelt."
    exit 1
  fi
  echo "      ✓ Prod har nå riktig secret."
fi

# --- 4) smoke-test POST med x-vapi-secret --------------------------------
echo ""
echo "[5/5] Smoke-test POST..."
HTTP="$(curl -sS -o /tmp/vapi_test.out -w '%{http_code}' \
  -X POST https://arxon.no/api/vapi/webhook \
  -H "Content-Type: application/json" \
  -H "x-vapi-secret: $LOCAL_SECRET" \
  --data '{"message":{"type":"status-update","status":"in-progress"}}' || echo 000)"
echo "      HTTP $HTTP"
cat /tmp/vapi_test.out; echo

if [ "$HTTP" = "200" ]; then
  echo "✓ Webhook godtar shared secret. Chat-agenten skal nå kunne booke demoer."
else
  echo "✗ Uventet HTTP $HTTP — sjekk output over."
  exit 1
fi
