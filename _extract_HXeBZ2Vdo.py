import json, sys

src = "/sessions/nifty-busy-hamilton/mnt/.claude/projects/-Users-younesamer-Library-Application-Support-Claude-local-agent-mode-sessions-c5506a8d-4b73-4b6b-9f6c-5eb47bcfac5b-a5ac5807-71ff-4ab5-bfe4-0570fbaba99b-local-430c1afa-a3dd-4897-ab5a-1feb78ffe6ce-outp-tainct/d946d4e1-1ac2-4f0f-baca-3eeb131f3127/tool-results/mcp-4a08f06a-24ce-4f75-bf84-c8db957686ea-web_fetch_vercel_url-1776551111139.txt"
out = "/sessions/nifty-busy-hamilton/mnt/Arxon/arxon-command-center/_HXeBZ2Vdo.html"

with open(src, "r", encoding="utf-8") as f:
    outer = json.load(f)
outer_text = outer[0]["text"]
inner = json.loads(outer_text)
html = inner["text"]

checks = {
    "length": len(html),
    "starts_doctype": html.lstrip().startswith("<" + "!DOCTYPE"),
    "has_dagens_plan": "Dagens plan" in html,
    "has_v3": "v3.0" in html,
    "has_intern_bruk": "Intern bruk" in html,
    "has_prospektering": "Prospektering" in html,
    "has_ukesplan": "Ukesplan" in html,
    "has_milepaeler": "Milepæler" in html,
    "has_mrr": "MRR" in html,
    "has_supabase": "supabase" in html,
    "has_handz": "Handz" in html,
    "has_lemonwax": "Lemonwax" in html,
    "has_god_morgen": "God morgen" in html,
}
for k, v in checks.items():
    sys.stderr.write(f"{k}: {v}\n")

with open(out, "w", encoding="utf-8") as f:
    f.write(html)
sys.stderr.write(f"wrote {out} ({len(html)} bytes)\n")
