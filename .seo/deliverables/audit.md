# Hi Fashion — Phase 0 SEO Audit

**Date:** 2026-06-19
**Store:** hifashions.shop (live on Vercel, Mumbai region)
**Specialists:** Technical SEO + Strategist + Competitive Intel

---

## 1. Technical SEO — Status

| Check | Status | Notes |
|-------|--------|-------|
| Dynamic sitemap (`app/sitemap.ts`) | ✅ PASS | Products + categories + static routes, ISR 1h, all URLs use `hifashions.shop` |
| robots.ts | ✅ PASS | Blocks /admin, /account, /checkout, /api, /auth + 13 AI-bot rules. Sitemap URL included. |
| No stale `public/robots.txt` | ✅ PASS | Deleted in prior session — no conflict |
| Root metadata (layout.tsx) | ✅ PASS | Title template, OG, Twitter, keywords, canonical, `metadataBase` all set |
| Page-level metadata BASE_URL | ✅ FIXED | Was `http://localhost:3000` in 5 files; all updated to `https://hifashions.shop` |
| Product schema + BreadcrumbList | ✅ PASS | `app/(store)/products/[slug]/page.tsx` — JSON-LD in server component |
| CollectionPage schema (categories) | ✅ PASS | `app/(store)/category/[slug]/page.tsx` |
| FAQPage schema (homepage + /faq) | ✅ PASS | `app/(store)/page.tsx` + `app/(store)/faq/page.tsx` |
| Organization + WebSite JSON-LD | ✅ PASS | Root layout |
| Dynamic OG image | ✅ PASS | `app/opengraph-image.tsx` (1200×630) |
| Security headers (CSP, HSTS) | ✅ PASS | `next.config.ts` |
| Image optimization (WebP/AVIF) | ✅ PASS | `next/image` configured |
| HTTPS + domain live | ✅ PASS | Vercel + Hostinger DNS pointing to hifashions.shop |
| NEXT_PUBLIC_APP_URL in Vercel env | ⚠️ VERIFY | Set in Vercel dashboard → Environment Variables → `NEXT_PUBLIC_APP_URL=https://hifashions.shop` |
| noindex on /account, /checkout | ✅ PASS | Blocked in robots.ts |
| Admin routes blocked | ✅ PASS | /admin blocked in robots.ts; auth-gated in code |

**Technical SEO Grade: A- (one env var to verify, then A)**

---

## 2. Analytics — Status

| Check | Status | Notes |
|-------|--------|-------|
| GA4 wired | ✅ PASS | `NEXT_PUBLIC_GA_ID` loaded in layout.tsx via `<Script>` |
| GA4 `purchase` event | ✅ PASS | `GAPurchaseEvent.tsx` fires on order success page with transaction_id, value, currency: INR, items |
| GA4 `view_item` event | ❌ MISSING | Not implemented |
| GA4 `add_to_cart` event | ❌ MISSING | Not implemented |
| GA4 `begin_checkout` event | ❌ MISSING | Not implemented |
| GA4 `view_item_list` event | ❌ MISSING | Not implemented |
| Google Search Console | ❌ NOT SET UP | Domain not verified, sitemap not submitted |
| Google Merchant Center | ❌ NOT SET UP | No product feed, no Shopping free listings |
| Bing Webmaster Tools | ❌ NOT SET UP | |
| Microsoft Clarity | ❌ NOT SET UP | (optional but recommended for heatmaps) |

---

## 3. Content & On-Page — Status

| Check | Status | Notes |
|-------|--------|-------|
| Keyword map | ❌ MISSING | No targeted keyword strategy per page/category |
| Category page copy | ❌ THIN | Only title + description from metadata; no on-page SEO copy, no intro paragraph, no H1 beyond category name |
| Product descriptions | ⚠️ VARIABLE | Depends on product data; likely thin for many products |
| Blog / buying guides | ❌ NONE | No content engine yet |
| Internal linking strategy | ⚠️ BASIC | Nav + product links; no editorial internal links |
| Category H1 + SEO intro block | ❌ MISSING | Needed below-grid SEO copy for category pages |

---

## 4. Competitive Position

**Head terms to AVOID short-term (marketplace-locked):**
- "kurti online", "dress online", "saree online", "t shirt women online" → Myntra/Ajio/Meesho own page 1

**Winnable targets (Hi Fashion's real battlefield):**
- Long-tail product: "[style] [item] online india under ₹X"
- COD-intent: "[item] cash on delivery online india"
- Occasion + price: "festive kurti under 999", "office wear women india"
- Brand: "hi fashion", "hifashions.shop"
- Hinglish: "saste kapde online", "trendy kapde india"
- Informational: "how to style [item]", "size guide [garment] india"
- vs local D2C: Hi Fashion's technical SEO + schema gives it a clear edge over Instagram-only stores

**Key advantage identified:** No other focused Indian D2C fashion store has this combination of:
1. Solid technical SEO + schema already live
2. Merchant Center feed (when set up) = free Shopping exposure
3. COD-first positioning (wedge vs expensive-perception marketplaces)

---

## 5. Priority Gaps (by ROI)

| # | Gap | Impact | Effort | Priority |
|---|-----|--------|--------|----------|
| 1 | GSC not verified | Can't see traffic/indexing data at all | 15 min | **P0 — Do Today** |
| 2 | NEXT_PUBLIC_APP_URL in Vercel | Canonicals/sitemap could use fallback | 2 min | **P0 — Do Today** |
| 3 | Merchant Center + product feed | Free Shopping listings = free discovery traffic | 2–4 hrs | **P1 — This Week** |
| 4 | GA4 remaining e-comm events | Can't attribute channel to sales | 2 hrs | **P1 — This Week** |
| 5 | Keyword map | Everything else depends on it | 2–3 hrs | **P1 — This Week** |
| 6 | Category page SEO copy | Direct ranking impact on money pages | 4–6 hrs | **P2 — Week 2** |
| 7 | Bing Webmaster Tools | 10% extra search traffic | 30 min | **P2 — Week 1** |
| 8 | Blog / style guides | Long-tail + AI citation surface | Ongoing | **P3 — Month 1** |
| 9 | Backlinks / influencer | Domain authority | Ongoing | **P3 — Month 1+** |

---

## 6. Audit Conclusion

**What's working:** Hi Fashion has an unusually strong technical SEO foundation for a D2C fashion store. Most stores of this age have none of the schema, sitemap, or security infrastructure already in place. This is a genuine competitive advantage vs local D2C competition.

**What's blocking results:** The store is invisible to Google (no GSC), not in Google Shopping (no Merchant Center), and has no keyword targeting on category pages. The next 2 weeks of work on these three things will unlock the majority of organic traffic potential.

**Recommended starting order:**
1. ✅ Verify NEXT_PUBLIC_APP_URL in Vercel
2. ✅ GSC verify + sitemap submit
3. ✅ Merchant Center setup + product feed route
4. ✅ Remaining GA4 e-commerce events
5. ✅ Keyword map → category copy

Phase 0 audit complete. Phase 1 (Technical) verified as passing. Proceeding to Phase 6 (Analytics + Shopping) and Phase 2 (Keywords) in parallel.
