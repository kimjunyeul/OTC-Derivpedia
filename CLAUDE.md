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

## Deployment

**Live site:** https://otc-derivpedia.vercel.app
**GitHub:** https://github.com/kimjunyeul/OTC-Derivpedia
**Vercel project:** kimjunyeuls-projects/otc-derivpedia

### Auto-deploy setup

GitHub(`main` 브랜치) → Vercel 자동 배포 연동 완료.
`main`에 push되는 순간 Vercel이 자동으로 빌드 후 프로덕션 배포.

### 배포 절차 (사용자가 "배포해줘"라고 하면 아래를 순서대로 실행)

```bash
# 1. 변경사항 스테이징
git add src/ CLAUDE.md   # 관련 파일만 명시적으로 추가 (node_modules, .next, PDF 제외)

# 2. 커밋
git commit -m "내용 요약"

# 3. push → Vercel 자동 배포 트리거
git push
```

push 후 약 1~2분이면 https://otc-derivpedia.vercel.app 에 반영됨.
배포 상태는 https://vercel.com/kimjunyeuls-projects/otc-derivpedia 에서 확인 가능.

### 주의사항

- PDF 파일, `node_modules/`, `.next/`, `*.tsbuildinfo`는 `.gitignore`로 제외되어 있으므로 `git add .` 사용 시에도 포함되지 않음
- `.vercel/project.json`도 gitignore 처리됨 (보안)
