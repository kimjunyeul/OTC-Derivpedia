# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**장외파생상품 백과사전** — OTC Derivatives Encyclopedia for the Risk Engineering Department.
An interactive internal reference site covering 20+ OTC derivative product types with structured content per product.

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build (also runs type check)
npm run lint     # ESLint
```

## Architecture

**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · react-markdown + KaTeX · Recharts · Fuse.js

### Adding a new product

1. Create `src/content/products/<id>.ts` following the `Product` type in `src/types/product.ts`
2. Import and add it to the `ALL_PRODUCTS` array in `src/content/products/index.ts`
3. The product automatically appears in the sidebar and gets a route at `/products/<id>`

### Content authoring

- Each product has 6 sections: `overview`, `structure`, `risk`, `pnl`, `poison`, `valuation`
- Section `content` fields are Markdown strings rendered via `react-markdown`
- LaTeX math: use `$...$` (inline) and `$$...$$` (block) — rendered by KaTeX
- Code blocks inside TypeScript template literals need escaped backticks: `\`\`\``
- `risk.riskRadar`: array of `{ subject, value (0–5), fullMark: 5 }` → rendered as Recharts RadarChart
- `pnl.payoffData`: array of `{ spot, payoff }` → rendered as Recharts LineChart
- `poison.clauses`: array of `{ name, level: 'high'|'medium'|'low', description }` → color-coded cards

### Key files

| File | Purpose |
|------|---------|
| `src/types/product.ts` | All TypeScript types + category constants |
| `src/content/products/index.ts` | Product registry (`ALL_PRODUCTS`, `PRODUCT_MAP`) |
| `src/components/Sidebar.tsx` | Client component — category accordion + Fuse.js search |
| `src/components/ProductPage.tsx` | Client component — tab state, poison clauses, chart wiring |
| `src/components/MarkdownSection.tsx` | Client component — react-markdown with remark-math + rehype-katex |
| `src/components/charts/PayoffChart.tsx` | Recharts LineChart for payoff diagrams |
| `src/components/charts/RiskRadar.tsx` | Recharts RadarChart for risk profiles |
| `src/app/layout.tsx` | Root layout — header + sidebar + main |
| `src/app/products/[slug]/page.tsx` | Dynamic product route (SSG) |

### Design tokens (Tailwind v4 `@theme`)

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#003087` | Shinhan deep navy — headings, active tab, sidebar |
| `secondary` | `#0066CC` | Links, interactive elements |
| `accent` | `#FF6B00` | Warning, active dots on charts |
| `danger` | `#D32F2F` | High-risk clauses, max loss |
| `success` | `#2E7D32` | Low-risk clauses, max gain |
| `bg` | `#F8F9FC` | Page background |

### URL structure

- `/` → redirects to first product
- `/products/<id>` → product page (default tab: overview)
- `/products/<id>#risk` → product page with risk tab active (hash-based deep link)
