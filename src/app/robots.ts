import { MetadataRoute } from "next"

/**
 * Explicit rules for AI crawlers (AEO) in addition to the default wildcard.
 *
 * Why list each AI bot separately:
 *   - LLM providers publish user-agents and respect allow/disallow per bot.
 *   - Explicit "allow" signals intentional opt-in, which helps us show up in
 *     ChatGPT / Claude / Perplexity answers. A silent wildcard is ambiguous.
 *   - Google-Extended is the specific UA Google uses for Bard/Gemini training;
 *     it is NOT the same as Googlebot for search.
 *
 * If we ever want to block a specific bot, switch its rule to `disallow: "/"`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // OpenAI
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      // Anthropic
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      // Google AI (separate from Googlebot search)
      { userAgent: "Google-Extended", allow: "/" },
      // Meta (Llama training)
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      // Common Crawl (used by most training pipelines)
      { userAgent: "CCBot", allow: "/" },
      // Apple Intelligence
      { userAgent: "Applebot-Extended", allow: "/" },
      // Bing / Copilot
      { userAgent: "bingbot", allow: "/" },
    ],
    sitemap: "https://arxon.no/sitemap.xml",
    host: "https://arxon.no",
  }
}
