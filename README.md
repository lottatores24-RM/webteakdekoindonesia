# CV. Teak & Deko Indonesia — Website

Bilingual (English / Bahasa Indonesia) B2B website for **CV. Teak & Deko Indonesia**, a natural furniture and
decoration manufacturer in Bantul, Yogyakarta. Buyers browse the catalog and contact the company by
WhatsApp or the inquiry form. There is no shopping cart or online payment.

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · next-intl · MDX product content ·
  React Hook Form + Zod + Server Action (Resend) · lucide-react
- **Fonts:** Playfair Display (headings) + DM Sans (body), self-hosted via `next/font`
- **Rendering:** every page is statically generated (SSG): 79 HTML pages across both locales
- **Content source:** the official company profile PDF. All photos were extracted from it.

## Getting started

Requires Node.js 18.17 or newer (tested with Node 22).

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000 → redirects to /en
```

| Script               | What it does                                                          |
| -------------------- | --------------------------------------------------------------------- |
| `npm run dev`        | Development server                                                    |
| `npm run build`      | Generates image blur placeholders, then a production build            |
| `npm start`          | Serves the production build                                           |
| `npm run lint`       | ESLint (next/core-web-vitals)                                         |
| `npm run typecheck`  | TypeScript, no emit                                                   |
| `npm run check:i18n` | Checks that `messages/id.json` has exactly the same keys as `en.json` |
| `npm run blur`       | Regenerates `lib/image-meta.json` after adding or replacing photos    |
| `npm run format`     | Prettier                                                              |

## Environment variables

| Variable                  | Purpose                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`    | Production URL, e.g. `https://www.teakdekoindonesia.com`. Used for canonical, hreflang, sitemap, OG. |
| `RESEND_API_KEY`          | API key from [resend.com](https://resend.com). Without it the form shows a "please email us" notice. |
| `INQUIRY_FROM_EMAIL`      | Sender, must be on a domain verified in Resend, e.g. `Teak & Deko <website@yourdomain.com>`          |
| `INQUIRY_TO_EMAIL`        | Recipient(s), comma separated. Defaults to `teakdekoindo@gmail.com`                                  |
| `NEXT_PUBLIC_GTM_ID`      | Google Tag Manager container, e.g. `GTM-XXXXXXX` (optional)                                          |
| `NEXT_PUBLIC_GA_ID`       | Google Analytics 4 measurement ID, e.g. `G-XXXXXXXXXX` (optional)                                    |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Facebook / Meta Pixel ID (optional)                                                                  |

Each analytics script loads only when its ID is set. Form submissions send `generate_lead` /
`catalog_request` and WhatsApp clicks send `whatsapp_click` to the dataLayer, GA4 and the pixel
(`Lead` / `Contact`).

## Deploying to Vercel

1. Push this repository to GitHub and import it at [vercel.com/new](https://vercel.com/new). The framework
   preset is detected automatically.
2. Add the environment variables above under **Project → Settings → Environment Variables**.
3. Deploy. Then add the client's domain under **Settings → Domains** and set the DNS records Vercel shows
   (an `A` record for the apex domain and a `CNAME` for `www`).
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy so canonical URLs and the sitemap use it.
5. Submit `https://<domain>/sitemap.xml` in Google Search Console.

## Project structure

```
app/
  [locale]/                 Every page lives under /en or /id
    page.tsx                Homepage
    about/  collections/  collections/[slug]/  products/[slug]/
    how-to-order/  export-info/  gallery/  faq/  contact/  request-catalog/
    layout.tsx              <html>, fonts, header/footer, WhatsApp button, Organization JSON-LD
    template.tsx            Subtle fade between routes
  actions/inquiry.ts        Server action that emails inquiries through Resend
  sitemap.ts  robots.ts  icon.png  apple-icon.png
components/
  layout/                   Header, Footer, WhatsAppButton, LanguageSwitcher, ThemeToggle, Analytics
  ui/                       Button, Badge, Breadcrumb, ProductCard, FilterTabs, SectionHeader, SmartImage…
  sections/                 Hero, TrustStrip, ProductGrid, Timeline, StepCard, FAQAccordion,
                            InquiryForm, ImageGallery, ProductGallery, CtaBand, CategoryCard
content/products/*.mdx      One file per product (both languages in the same file)
lib/                        i18n routing, site facts, product loader, SEO helpers, gallery list
messages/en.json, id.json   Every visible string, including alt text and meta tags
public/images/              Photos from the company profile, by category
scripts/                    Blur placeholder generator, i18n key checker
```

## Editing content

### Company facts and placeholders

Contact details, address and opening hours are in `lib/site.ts`. Values still missing are marked
`[LIKE THIS]` and are easy to search for:

| Placeholder         | Where                                                                 |
| ------------------- | --------------------------------------------------------------------- |
| `[ITEM CODE]`       | `code:` in each `content/products/*.mdx`                              |
| `[SIZE]`            | `dimensions:` in each `content/products/*.mdx`                        |
| `[MOQ]`             | `messages/*.json` → `exportInfo.terms`, `faq.items.moq`, `howToOrder` |
| `[PORT]`            | `messages/*.json` → `exportInfo.terms.port`, `faq.items.shipping`     |
| `[PAYMENT TERMS]`   | `messages/*.json` → `exportInfo.terms.payment`, FAQ                   |
| `[CERTIFICATES]`    | `messages/*.json` → `exportInfo.terms.certificates`, FAQ              |
| `[INCOTERMS]`       | `messages/*.json` → `exportInfo.terms.incoterms`                      |
| `[PRODUCTION TIME]` | `messages/*.json` → `exportInfo.terms.leadTime`, FAQ                  |
| `[OPERATING HOURS]` | `lib/site.ts` → `operatingHours`                                      |

Run `grep -rn "\[" messages content lib/site.ts` to list everything still to fill in.

### Adding a product

1. Put the photo(s) in `public/images/products/tables/` or `public/images/products/decoration/`.
2. Copy any file in `content/products/` to `content/products/<slug>.mdx` (the file name must equal `slug`).
3. Edit the frontmatter:

   ```yaml
   slug: teak-root-coffee-table
   category: tables-and-stools # or: decoration
   type: coffee-table # coffee-table, side-table, console, bench, stool, mirror, lantern,
   # candle-holder, bowl, vase, tray, sculpture, pedestal
   materials: [teak-root] # teak-root, recycled-teak, teak-branch, trembesi
   images:
     - /images/products/tables/teak-root-coffee-table.jpg # first image is the cover; add more for a gallery
   cutout: false # true if the photo has a plain white background
   bestSeller: false
   order: 30 # position in listings
   code: '[ITEM CODE]'
   dimensions: '[SIZE]'
   name:
     en: '…'
     id: '…'
   summary:
     en: 'One sentence.'
     id: 'Satu kalimat.'
   ```

4. Write the description below the frontmatter inside `<En>…</En>` and `<Id>…</Id>` blocks.
5. Run `npm run blur` (or just build). The product gets its own page, sitemap entry, filter tab
   and structured data automatically.

### Text and translations

All interface text lives in `messages/en.json` and `messages/id.json`. Keep the keys identical in both files.
`npm run check:i18n` reports any differences. FAQ questions are read from `faq.items`, so adding an item
there (with a `group` of `products`, `ordering`, `shipping` or `company`) adds it to the page and to the
FAQ schema.

## Features

- `/` redirects to `/en`. Every URL has a locale prefix, and the EN | ID switcher keeps the visitor on
  the same page.
- Floating WhatsApp button with a pre-filled message. Each product has its own WhatsApp link
  ("Hi, I'm interested in [product]…").
- Inquiry form (name, company, country, email, phone, message) with validation, spam honeypot and
  Resend delivery. On product pages it is pre-filled with the product name. `/contact?type=catalog`
  pre-selects an e-catalog request.
- Catalog filters: groups on `/collections` (All, Tables & Stools, Mirrors, Lanterns & Lighting,
  Bowls & Vases, Sculpture); type and material on each collection page.
- Masonry gallery with category filter and a lightbox (keyboard, swipe, zoom).
- SEO: unique localized titles and descriptions, canonical URLs, hreflang (`en`, `id`, `x-default`),
  Open Graph and Twitter cards, `sitemap.xml` with alternates, `robots.txt`, and JSON-LD for
  Organization, Product, FAQPage and BreadcrumbList.
- Accessibility: one H1 per page, alt text in the page language, skip link, 44px touch targets,
  focus styles, `prefers-reduced-motion` support, and contrast-checked colours (including a lighter
  terracotta for text in dark mode).
- Light and dark mode (follows the system setting, can be toggled in the header).
- Scroll-reveal animations that never hide content when JavaScript is off.

## Not included yet

- **Google reviews embed:** needs the company's Google Business Profile or Place ID. Add a widget to
  the homepage once the profile exists.
- **E-catalog PDF:** the e-catalog request is sent to the team by email. To offer an instant download,
  put the PDF in `public/` and link it from the success message in `components/sections/InquiryForm.tsx`.
- **Social media links:** none were provided in the company profile.
