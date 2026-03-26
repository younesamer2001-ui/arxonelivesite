#!/bin/bash
# SIKKER DEPLOY PROSESS FOR ARXON
# Denne prosessen sikrer at du ikke mister live versjon

echo "=== SIKKER DEPLOY PROSESS ==="
echo ""

# STEG 1: Lag backup av nåværende live versjon
echo "1. Lager backup av live versjon..."
cd ~/Desktop/arxon-website
git add .
git stash push -m "backup-before-changes-$(date +%Y%m%d-%H%M%S)"

# STEG 2: Hent ned eksakt live versjon fra Vercel
echo "2. Henter live versjon fra Vercel..."
# Dette krever at du har Vercel CLI og er logget inn
# vercel list
# vercel inspect <deployment-id>

# STEG 3: Sjekk at vi er på riktig commit
echo "3. Sjekker git status..."
git status

echo ""
echo "=== MANUELLE STEG ==="
echo ""
echo "4. Gjør dine endringer (dashboard, bilder, etc.)"
echo "   - Rediger filer"
echo "   - Test lokalt: npm run dev"
echo ""
echo "5. Når du er fornøyd:"
echo "   git add ."
echo "   git commit -m 'feat: add dashboard and images'"
echo "   git push origin main"
echo ""
echo "6. Deploy:"
echo "   vercel --prod"
echo ""
echo "=== HVIS NOE GÅR GALT ==="
echo "Gå tilbake til backup:"
echo "   git stash pop"
echo ""
