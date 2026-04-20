#!/usr/bin/env bash
# deploy-vapi-fix.sh — deploy Vapi 400-fix til prod + cleanup korrupt env-var.
#
# Hva dette gjør:
#   1. Sjekker at du står i riktig mappe.
#   2. Kjører en ren lokal build for å validere før deploy.
#   3. Fjerner NEXT_PUBLIC_VAPI_PUBLIC_KEY fra Vercel (hvis satt) siden:
#        - Kode har nå hardkodet ren UUID som fallback (66d0cbad-...)
#        - UUID-regex saniterer også korrupte verdier
#      → Ingen grunn til å ha env-varen i Vercel lenger. Mindre som kan gå galt.
#   4. Deployer til prod.
#
# Kjør fra ~/Desktop/Arxon/nettside:
#     bash deploy-vapi-fix.sh

set -euo pipefail

cd "$(dirname "$0")"

echo "================================================================"
echo " 1/4  Validerer at vi er i nettside/"
echo "================================================================"
# Sjekk at vi er i prosjekt-rot: package.json + src/hooks/useVapi.ts må eksistere.
if [ ! -f package.json ] || [ ! -f src/hooks/useVapi.ts ]; then
  echo "Kjør fra ~/Desktop/Arxon/nettside (finner ikke package.json og src/hooks/useVapi.ts)."
  exit 1
fi

echo
echo "================================================================"
echo " 2/4  Lokal build (next build) for å fange feil før deploy"
echo "================================================================"
rm -rf .next
npx next build

echo
echo "================================================================"
echo " 3/4  Fjern (muligens) korrupt NEXT_PUBLIC_VAPI_PUBLIC_KEY fra Vercel"
echo "================================================================"
echo "Kode har nå ren hardkodet fallback + UUID-sanitering."
echo "Vi fjerner env-var for hvert miljø den finnes i — ignorer feil hvis den ikke finnes."
for env in production preview development; do
  echo "--- $env ---"
  vercel env rm NEXT_PUBLIC_VAPI_PUBLIC_KEY "$env" --yes 2>&1 || echo "(ikke satt i $env, ok)"
done

echo
echo "================================================================"
echo " 4/4  Deploy til prod"
echo "================================================================"
vercel --prod

echo
echo "================================================================"
echo " Ferdig. Smoke-test nå:"
echo "   1. Åpne https://arxon.no i ny fane"
echo "   2. DevTools → Console → lim inn hook-snippeten:"
cat <<'HOOK'

(()=>{const o=window.fetch;window.fetch=function(u,i){const t=String(u);if(t.includes("api.vapi.ai")){console.log("[REQ]",t);console.log("[AUTH]",JSON.stringify(i?.headers));console.log("[BODY]",i?.body)}return o.apply(this,arguments).then(async r=>{if(t.includes("api.vapi.ai")){const c=r.clone();console.log("[RES]",r.status,await c.text())}return r})};console.log("✓ Hook aktiv — trykk Ring nå")})()

HOOK
echo "   3. Trykk Ring. Forvent [RES] 201 og at samtalen starter."
echo "================================================================"
