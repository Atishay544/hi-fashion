# Hi-Fashion — New Client Setup Checklist
> Complete reset guide: everything from the original "Layers Factory" project that must be replaced before going live.

---

## PART 1 — CREDENTIALS & API KEYS TO RESET

### 1.1 Supabase (Database + Auth)
> Create a brand-new Supabase project for this client. Never reuse the original project.

| What | Current (OLD — DO NOT USE) | Action |
|------|---------------------------|--------|
| Project URL | `https://hcewnrbsxsageztlilxu.supabase.co` | Create new project → copy new URL |
| Anon Key | `eyJhbGci...V1kK5pZBaTRXA9Zi...` | Auto-generated on new project |
| Service Role Key | `eyJhbGci...LDF_VlKYzGp...` | Auto-generated on new project |

**Steps:**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Run all migrations: `supabase/migrations/*.sql` (in order)
3. Run `supabase/seed.sql` to add starter categories
4. Go to **Auth → Configuration → URL Configuration**:
   - Set **Site URL** → `https://www.CLIENT-DOMAIN.com`
   - Add **Redirect URLs** → `https://www.CLIENT-DOMAIN.com/**`
5. Go to **Auth → Providers → Google** → add client's Google OAuth credentials
6. Enable **Realtime** for tables: `chat_sessions`, `chat_messages`
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
   ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
   ```
7. Promote admin user after first login:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR-USER-UUID';
   ```

---

### 1.2 Razorpay (Payment Gateway)
> Client must create their own Razorpay account at [razorpay.com](https://razorpay.com).

| What | Current (OLD) | Action |
|------|--------------|--------|
| Public Key ID | `rzp_live_SdKsdbXtwiCKrP` | Client's new live key |
| Secret Key | `7QvMtKcZgiE6rzLwx7KKU688` | Client's new secret |
| Webhook Secret | `REPLACE_WITH_RAZORPAY_WEBHOOK_SECRET` | Generate in Razorpay dashboard |

**Steps:**
1. Client logs in to Razorpay → Settings → API Keys → Generate Live Key
2. In Razorpay → Settings → Webhooks → Add webhook:
   - URL: `https://www.CLIENT-DOMAIN.com/api/razorpay/webhook`
   - Events: `payment.captured`, `payment.failed`, `order.paid`
   - Copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`
3. Switch to **test keys** first while testing, then swap to live

---

### 1.3 Delhivery (Shipping / Courier)
> Client must have their own Delhivery account. Current token belongs to Layers Factory.

| What | Current (OLD) | Action |
|------|--------------|--------|
| API Token | `12e658f448594e850ff77b7856dc87ab79a80c37` | Client's new token |
| Webhook Token | `4c41e5052543c5c0f32df1e93a2cc35b0d8352bfd0adfa2448c827bee0b65b7b` | Client's new webhook token |
| Base URL | `https://track.delhivery.com` | Keep (same for all) |
| Store Name | `Layers Factory` | **→ Client's store name** |
| GST Number | *(empty)* | Client's GST number |

**Pickup Address to fill (all blank — must get from client):**

| Variable | Value Needed |
|----------|-------------|
| `DELHIVERY_PICKUP_LOCATION` | Location name as registered in Delhivery dashboard |
| `DELHIVERY_PICKUP_PINCODE` | Warehouse/pickup pincode |
| `DELHIVERY_PICKUP_ADDRESS` | Full street address |
| `DELHIVERY_PICKUP_CITY` | City |
| `DELHIVERY_PICKUP_STATE` | State |
| `DELHIVERY_PICKUP_PHONE` | Contact phone at pickup location |

**Steps:**
1. Client registers at [delhivery.com](https://www.delhivery.com) → Business Account
2. Go to Settings → Pickup Addresses → copy the exact location name
3. Go to Settings → API → generate new token
4. Set webhook URL in Delhivery dashboard: `https://www.CLIENT-DOMAIN.com/api/delhivery/webhook`

---

### 1.4 Resend (Email Service)
> Current API key and sender email (`support@layerfactory.in`) belongs to the original store.

| What | Current (OLD) | Action |
|------|--------------|--------|
| API Key | `re_EzjxqnuA_96MbHL7XYuk9HTk7hxsxPPPs` | New key from client's Resend account |
| Sender `FROM` | `LayerFactory <support@layerfactory.in>` | `ClientBrand <support@CLIENT-DOMAIN.com>` |
| Orders Alert Email | `atishayjain54@gmail.com` | **→ Client's email address** |

**Steps:**
1. Client creates account at [resend.com](https://resend.com)
2. Add & verify their domain (DNS TXT/MX records)
3. Generate API key → copy to `RESEND_API_KEY`
4. Update `ORDERS_EMAIL` to client's operational email

---

### 1.5 Redis (Railway)
> Current Redis belongs to the developer's Railway account.

| What | Current (OLD) | Action |
|------|--------------|--------|
| Redis URL | `redis://default:NaQkkFcwJRYWDTXowXXJxgcAwmREWbiZ@shortline.proxy.rlwy.net:51054` | New Redis on client's Railway |

**Steps:**
1. Create new Railway project → Add Redis plugin
2. Copy the `REDIS_URL` from Railway dashboard

---

### 1.6 Cloudflare Turnstile (Bot Protection)
> Current keys are tied to developer's Cloudflare account and `layerfactory.in` domain.

| What | Current (OLD) | Action |
|------|--------------|--------|
| Site Key | `0x4AAAAAAC9yjTCbkkFBqne0` | New key for client's domain |
| Secret Key | `0x4AAAAAAC9yjawObBIU8Gq2ZTE82eJaqD0` | New secret |

**Steps:**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → Add Site
2. Enter client's domain → get new site key + secret key

---

### 1.7 Google Analytics (GA4)
> Current GA ID `G-PNV9D2JEP4` tracks the original store's traffic.

| What | Current (OLD) | Action |
|------|--------------|--------|
| GA4 Measurement ID | `G-PNV9D2JEP4` | Client's new GA4 property |

**Steps:**
1. Client creates Google Analytics account at analytics.google.com
2. Create new GA4 property → copy Measurement ID (`G-XXXXXXXXXX`)

---

### 1.8 Google OAuth (for "Sign in with Google")
> Google OAuth credentials must match the new domain.

| What | Action |
|------|--------|
| `GOOGLE_CLIENT_ID` | Create new OAuth client in Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

**Steps:**
1. Google Cloud Console → APIs & Services → Credentials → Create OAuth Client
2. Authorized redirect URIs: `https://hcewnrbsxsageztlilxu.supabase.co/auth/v1/callback` ← replace with new Supabase URL
3. Add the client ID/secret to Supabase Auth → Google provider

---

## PART 2 — COMPLETE .env.local FOR NEW CLIENT

```bash
# ─── Supabase ─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://NEW-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=NEW_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=NEW_SERVICE_ROLE_KEY

# ─── Razorpay ─────────────────────────────────────────────
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_CLIENT_KEY
RAZORPAY_KEY_ID=rzp_live_CLIENT_KEY
RAZORPAY_KEY_SECRET=CLIENT_SECRET
RAZORPAY_WEBHOOK_SECRET=CLIENT_WEBHOOK_SECRET

# ─── Redis ────────────────────────────────────────────────
REDIS_URL=redis://default:NEW_PASSWORD@NEW_HOST:PORT

# ─── Delhivery ────────────────────────────────────────────
DELHIVERY_API_TOKEN=CLIENT_NEW_TOKEN
DELHIVERY_WEBHOOK_TOKEN=CLIENT_NEW_WEBHOOK_TOKEN
DELHIVERY_BASE_URL=https://track.delhivery.com
DELHIVERY_PICKUP_LOCATION=CLIENT_PICKUP_LOCATION_NAME
DELHIVERY_PICKUP_PINCODE=CLIENT_PINCODE
DELHIVERY_PICKUP_ADDRESS=CLIENT_FULL_ADDRESS
DELHIVERY_PICKUP_CITY=CLIENT_CITY
DELHIVERY_PICKUP_STATE=CLIENT_STATE
DELHIVERY_PICKUP_PHONE=CLIENT_PHONE
DELHIVERY_STORE_NAME=CLIENT_STORE_NAME
DELHIVERY_GST=CLIENT_GST_NUMBER

# ─── Email — Resend ───────────────────────────────────────
RESEND_API_KEY=re_CLIENT_NEW_KEY
ORDERS_EMAIL=client-orders@theirdomain.com

# ─── Cloudflare Turnstile ─────────────────────────────────
NEXT_PUBLIC_TURNSTILE_SITE_KEY=CLIENT_SITE_KEY
TURNSTILE_SECRET_KEY=CLIENT_SECRET_KEY

# ─── App ──────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://www.CLIENT-DOMAIN.com
NODE_ENV=production
NEXT_PUBLIC_GA_ID=G-CLIENT_GA_ID
```

---

## PART 3 — BRAND IDENTITY IN SOURCE CODE

> These are hardcoded strings inside `.ts` / `.tsx` files that must be replaced. The `NEXT_PUBLIC_APP_URL` env var handles URLs in most places, but these need direct code edits.

### 3.1 Brand Name / Store Name

| File | Line(s) | Current Text | Replace With |
|------|---------|-------------|-------------|
| [ecom-frontend/components/storefront/Header.tsx](ecom-frontend/components/storefront/Header.tsx#L61) | 61 | `LayerFactory` (text logo) | Client's brand name |
| [ecom-frontend/components/storefront/Footer.tsx](ecom-frontend/components/storefront/Footer.tsx#L39) | 39, 89 | `Layers Factory` | Client's brand name |
| [ecom-frontend/lib/email.ts](ecom-frontend/lib/email.ts#L7) | 7, 37, 41, 108 | `LayerFactory`, `Layers Factory` | Client's brand name |
| [ecom-frontend/lib/invoice.ts](ecom-frontend/lib/invoice.ts#L79) | 79, 272 | `Layers Factory` | Client's brand name |
| [ecom-frontend/app/layout.tsx](ecom-frontend/app/layout.tsx#L25) | 25–98 | `Layers Factory`, `LayerFactory` | Client's brand name |
| [ecom-frontend/app/opengraph-image.tsx](ecom-frontend/app/opengraph-image.tsx#L4) | 4, 32 | `LayerFactory` | Client's brand name |
| [ecom-frontend/app/(auth)/login/page.tsx](ecom-frontend/app/(auth)/login/page.tsx#L166) | 166 | `LayerFactory` | Client's brand name |
| [ecom-frontend/app/(store)/page.tsx](ecom-frontend/app/(store)/page.tsx#L108) | 108, 120, 135 | `Layers Factory`, `layerfactory.in` | Client brand + domain |
| [ecom-frontend/app/(store)/faq/page.tsx](ecom-frontend/app/(store)/faq/page.tsx#L14) | 14–22 | `LayerFactory` | Client's brand name |
| [ecom-frontend/app/(store)/products/page.tsx](ecom-frontend/app/(store)/products/page.tsx#L16) | 16–24 | `LayerFactory` | Client's brand name |
| [ecom-frontend/app/(store)/products/[slug]/page.tsx](ecom-frontend/app/(store)/products/[slug]/page.tsx#L236) | 236, 249, 304, 314 | `LayerFactory` | Client's brand name |
| [ecom-frontend/app/(store)/category/[slug]/page.tsx](ecom-frontend/app/(store)/category/[slug]/page.tsx#L49) | 49–119 | `LayerFactory` | Client's brand name |
| [ecom-frontend/public/llms.txt](ecom-frontend/public/llms.txt) | All | Entire file — Layers Factory info | Rewrite with client's brand info |

---

### 3.2 Contact Details (Email & Phone)

| File | Line(s) | Current | Replace With |
|------|---------|---------|-------------|
| [ecom-frontend/components/storefront/Footer.tsx](ecom-frontend/components/storefront/Footer.tsx#L91) | 91, 93 | `support@layerfactory.in` / `+91 6396855019` | Client's email / phone |
| [ecom-frontend/app/(store)/contact/page.tsx](ecom-frontend/app/(store)/contact/page.tsx#L37) | 37–46 | `support@layerfactory.in` / `+91 6396855019` | Client's email / phone |
| [ecom-frontend/app/api/chat/bot-reply/route.ts](ecom-frontend/app/api/chat/bot-reply/route.ts#L46) | 46, 159 | `support@layerfactory.in` / `+91 6396855019` | Client's email / phone |
| [ecom-frontend/lib/email.ts](ecom-frontend/lib/email.ts#L7) | 7, 41, 148 | `support@layerfactory.in` / `atishayjain54@gmail.com` | Client's support email |
| [ecom-frontend/lib/invoice.ts](ecom-frontend/lib/invoice.ts#L86) | 85–86, 278 | `support@layerfactory.in` / `www.layerfactory.in` | Client's email / domain |
| [ecom-frontend/app/layout.tsx](ecom-frontend/app/layout.tsx#L116) | 116–117, 124 | `support@layerfactory.in` / `+916396855019` | Client's email / phone |
| [ecom-frontend/public/llms.txt](ecom-frontend/public/llms.txt#L32) | 32–34 | `support@aitalk247.com` / `orders@aitalk247.com` | Client's email addresses |

---

### 3.3 Logo & Favicon

| What | File | Action |
|------|------|--------|
| Logo image | `ecom-frontend/public/lf-logo.png` | **Replace** with client's logo (keep same filename OR update references in layout.tsx lines 30–33 and Footer.tsx line 38) |
| Favicon | `ecom-frontend/app/favicon.ico` | **Replace** with client's favicon |
| OG Image | `ecom-frontend/app/opengraph-image.tsx` | Update brand name + optionally brand colors |
| Invoice prefix | `ecom-frontend/lib/invoice.ts` line 112/282 | `LF-` → client's prefix (e.g. `HF-`) |

---

### 3.4 Founder / Author Name

| File | Line | Current | Replace With |
|------|------|---------|-------------|
| [ecom-frontend/app/layout.tsx](ecom-frontend/app/layout.tsx#L44) | 44–45, 110 | `Atishay Jain` | Client's name |
| [ecom-frontend/public/llms.txt](ecom-frontend/public/llms.txt#L7) | 7 | `Founded by Atishay Jain` | Client's founder name |

---

### 3.5 Product/Business Description (SEO & JSON-LD)

> These are the marketing texts used in Google search results and AI assistants. Must be rewritten to match client's actual products.

| File | What to Rewrite |
|------|----------------|
| [ecom-frontend/app/layout.tsx](ecom-frontend/app/layout.tsx#L35) | `description`, `keywords`, `hasOfferCatalog` — currently about marble temples |
| [ecom-frontend/app/(store)/page.tsx](ecom-frontend/app/(store)/page.tsx#L108) | FAQ JSON-LD answers mentioning marble, layerfactory.in |
| [ecom-frontend/app/(store)/products/page.tsx](ecom-frontend/app/(store)/products/page.tsx#L16) | Title: "Marble Temples & Spiritual Decor" → client's category |
| [ecom-frontend/app/(store)/products/[slug]/page.tsx](ecom-frontend/app/(store)/products/[slug]/page.tsx#L236) | Product description fallback |
| [ecom-frontend/public/llms.txt](ecom-frontend/public/llms.txt) | Entire file — rewrite for client's products |

---

### 3.6 Social Media Links

| File | Line | Current | Replace With |
|------|------|---------|-------------|
| [ecom-frontend/components/storefront/Footer.tsx](ecom-frontend/components/storefront/Footer.tsx#L24) | 24–28 | `href: '#'` (placeholder) | Client's actual IG/Twitter/Facebook URLs |
| [ecom-frontend/app/layout.tsx](ecom-frontend/app/layout.tsx#L140) | 140 | `sameAs: []` (empty) | Client's social profile URLs |

---

## PART 4 — VERCEL ENVIRONMENT VARIABLES

Set ALL of these in **Vercel Dashboard → Project → Settings → Environment Variables**:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
REDIS_URL
DELHIVERY_API_TOKEN
DELHIVERY_WEBHOOK_TOKEN
DELHIVERY_BASE_URL
DELHIVERY_PICKUP_LOCATION
DELHIVERY_PICKUP_PINCODE
DELHIVERY_PICKUP_ADDRESS
DELHIVERY_PICKUP_CITY
DELHIVERY_PICKUP_STATE
DELHIVERY_PICKUP_PHONE
DELHIVERY_STORE_NAME
DELHIVERY_GST
RESEND_API_KEY
ORDERS_EMAIL
NEXT_PUBLIC_TURNSTILE_SITE_KEY
TURNSTILE_SECRET_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_GA_ID
```

---

## PART 5 — POST-DEPLOY CHECKLIST

- [ ] Supabase → Auth → Site URL set to production domain
- [ ] Supabase → Auth → Redirect URLs include production domain
- [ ] Supabase → Realtime enabled for `chat_messages` and `chat_sessions`
- [ ] Admin user promoted via SQL (`UPDATE profiles SET role='admin' WHERE id='...'`)
- [ ] Razorpay webhook URL updated to production
- [ ] Razorpay tested with test keys before going live
- [ ] Delhivery pickup address filled and verified
- [ ] Resend domain verified (DNS records applied)
- [ ] Test email: place a dummy order → confirm order email arrives
- [ ] Test payment: complete checkout with Razorpay test mode
- [ ] Google Analytics: verify data is flowing in (wait 24h after deploy)
- [ ] Cloudflare Turnstile: verify contact form bot protection works
- [ ] Google Search Console: submit sitemap (`https://CLIENT-DOMAIN.com/sitemap.xml`)
- [ ] Replace logo at `/public/lf-logo.png` with client's logo
- [ ] Replace favicon at `/app/favicon.ico`
- [ ] Update all social media links in Footer.tsx
- [ ] Update invoice prefix from `LF-` → client's prefix in `lib/invoice.ts`
- [ ] Rewrite `public/llms.txt` with client's brand/product info
- [ ] Test full order flow end-to-end on production

---

## PART 6 — INFO TO COLLECT FROM CLIENT

Before starting, collect the following from the new client:

| # | Information Needed | Used In |
|---|-------------------|---------|
| 1 | **Brand/Store name** | Header, Footer, emails, invoices, SEO |
| 2 | **Domain name** | `NEXT_PUBLIC_APP_URL`, Supabase redirect, Turnstile, Resend |
| 3 | **Support email** | Footer, contact page, email FROM address, Resend |
| 4 | **Orders alert email** | `ORDERS_EMAIL` env var — receives new order notifications |
| 5 | **Support phone number** | Footer, contact page, chat bot replies |
| 6 | **Founder/Owner name** | JSON-LD metadata, `llms.txt` |
| 7 | **Logo file** (PNG, transparent bg) | `/public/lf-logo.png` replacement |
| 8 | **Favicon** (ICO or PNG) | `/app/favicon.ico` replacement |
| 9 | **Business description** (2–3 sentences) | SEO metadata, `llms.txt` |
| 10 | **Product categories** | Seed data, homepage copy, keywords |
| 11 | **GST number** | `DELHIVERY_GST`, invoice |
| 12 | **Pickup/warehouse address** | Delhivery pickup config |
| 13 | **Pickup phone** | Delhivery pickup config |
| 14 | **Instagram URL** | Footer social links |
| 15 | **Facebook URL** | Footer social links |
| 16 | **Twitter/X URL** | Footer social links |
| 17 | **Razorpay account** (or access to create) | Payment gateway |
| 18 | **Delhivery account** (or access to create) | Shipping |
| 19 | **Free shipping threshold** (currently ₹499) | Footer copy, chat bot, FAQ, shipping policy |
| 20 | **Working hours for support** (currently Mon–Sat 10–7) | Contact page, chat bot |

---

*Generated: 2026-06-12*
