# PRD: 장외파생상품 백과사전 (OTC Derivatives Encyclopedia)

**문서 버전:** v1.2  
**최초 작성일:** 2026-06-15  
**최종 수정일:** 2026-06-17  
**작성 부서:** 리스크공학부  
**문서 유형:** Product Requirements Document

---

## 1. 프로젝트 개요 (Project Overview)

### 1.1 배경 및 목적

리스크공학부는 다양한 장외파생상품(OTC Derivatives)의 딜 리뷰, 공정가치 평가, FRTB 민감도 산출, Term Sheet 분석 등의 업무를 수행한다. 현재 상품 유형별 평가방법론, 리스크 특성, 독소조항 등에 대한 지식이 개인 역량에 분산되어 있어 팀 차원의 지식 공유와 신규 인력 온보딩에 비효율이 발생하고 있다.

본 프로젝트는 장외파생상품의 주요 유형 20종 이상을 망라하는 **Next.js 기반 인터랙티브 백과사전**을 바이브코딩(Vibe Coding) 방식으로 구축하여, 실무 참조 문서이자 내부 지식 데이터베이스로 활용하는 것을 목적으로 한다.

### 1.2 핵심 사용자 (Primary Users)

| 사용자 그룹 | 주요 니즈 |
|------------|----------|
| 리스크공학부 심사역 | Term Sheet 수취 시 신속한 상품 구조 파악 및 평가방법론 참조 |
| 부서장 / CRO | 상품별 리스크 특성 및 독소조항 요약 보고 참조 |
| 신규 입행자 / 경력직 | 상품 유형별 기초-심화 학습 자료 |
| 금융회계부 | 공정가치 평가방법론 근거 문서 참조 |
| 파생운용 트레이더 | 평가모델 및 입력변수 기준 확인 |

### 1.3 주요 성과 지표 (Success Metrics)

- 상품 유형 커버리지: 최소 20종 (확장 가능한 구조)
- 상품별 섹션 완성도: **7개** 필수 항목 100% 작성
- 내부 검토 완료 후 CRO 보고 자료 재활용률
- 신규 Term Sheet 수취 시 참조 소요 시간 단축

---

## 2. 상품 유형 목록 (Product Scope)

초기 구축 대상 20종은 아래와 같이 분류하며, 추후 추가 가능한 확장형 구조로 설계한다.

### 카테고리 A: 금리 파생상품 (Interest Rate Derivatives)
1. **IRS** – Interest Rate Swap (금리스왑) ✅ 완료
2. **CCS** – Cross Currency Swap (통화스왑)
3. **Swaption** – 금리스왑션
4. **Cap / Floor** – 금리 상한/하한 옵션
5. **CMS Swap** – Constant Maturity Swap

### 카테고리 B: 신용 파생상품 (Credit Derivatives)
6. **CDS** – Credit Default Swap (신용부도스왑)
7. **CLN** – Credit Linked Note
8. **TRS** – Total Return Swap (총수익스왑)
9. **CVA Hedge** – CVA 헤지 파생상품 구조

### 카테고리 C: 주식 파생상품 (Equity Derivatives)
10. **ELS** – Equity Linked Securities (주가연계증권)
11. **ELB / DLB** – Equity/Derivative Linked Bond
12. **FCN / VMS** – Fixed Coupon Note / Variable Maturity Swap ✅ 완료
13. **Share Basket TRS** – 주식바스켓 총수익스왑
14. **Variance Swap** – 분산스왑
15. **Skew Swap** – 스큐스왑

### 카테고리 D: 외환 파생상품 (FX Derivatives)
16. **FX Forward** – 선물환
17. **FX Option** – 통화옵션
18. **Target Redemption Forward (TARF)** – 목표상환선물환
19. **Knock-in / Knock-out Option** – 배리어 옵션

### 카테고리 E: 상품/기타 파생상품 (Commodity & Other)
20. **EUA Swap** – 탄소배출권 연계 스왑
21. *(확장 가능 슬롯)*

---

## 3. 콘텐츠 구조 (Content Architecture)

### 3.1 상품별 필수 기재 섹션 (7개 탭)

각 상품 페이지는 다음 **7개 섹션**으로 구성된다. (`cashflow` 섹션은 상품이 해당 데이터를 보유한 경우에만 탭이 표시된다.)

```
[상품 개요] [상품 구조] [리스크] [손익 분석] [현금흐름 조감도] [독소조항] [평가 방법론]
```

#### 섹션 1: 상품 개요 (Product Overview)
- 상품 정의 및 거래 목적 (헤지 / 투기 / 차익거래)
- 거래 당사자 구조 (매도자 / 매수자 / Calculation Agent)
- 시장에서의 일반적 활용 사례
- 관련 ISDA 마스터 계약 유형 (2002 ISDA, CSA 등)
- 국내 규제 연관성 (자본시장법, K-IFRS 등)

#### 섹션 2: 상품 구조 (Product Structure)
- Leg 구조 설명 (Fixed/Floating/Contingent 등)
- 만기/조기상환/롤오버 조건
- 주요 계약 파라미터 (Notional, Tenor, Strike, Barrier 등)
- 표준 Term Sheet 항목 매핑
- 현금흐름 시나리오 텍스트 (Knock-out, 만기 보존, 만기 손실 등)

#### 섹션 3: 리스크 (Risk Considerations)
- **시각화:** 리스크 레이더 차트 (Delta/Vega/신용/유동성/모델/운영 리스크 0–5 점수)
- **시장리스크:** Delta, Gamma, Vega, Rho, Theta
- **신용리스크:** Counterparty Credit Risk (CCR), CVA
- **유동성리스크:** 조기청산 시 시장 충격
- **모델리스크:** 가정 위반 시나리오, 파라미터 불확실성
- **운영리스크:** Calculation Agent 재량권, 결제 복잡성
- **법적리스크:** 관할권, 독소조항 관련

#### 섹션 4: 손익 분석 (P&L Analysis)
- **시각화:** 페이오프 다이어그램 — 기초자산 수준별 만기/조기상환 시 수익 그래프
  - 단일 시나리오: 단일 선 그래프
  - 복수 시나리오: 시나리오별 색상 구분 + 범례 (예: 만기 보유 vs. Knock-out 조기종료)
- **최대수익 (Maximum Gain):** 시나리오별 상한 및 계산식
- **최대손실 (Maximum Loss):** 시나리오별 하한 및 계산식
- 손익 분기점 (Break-even) 분석
- 시나리오 테이블 (Stress Test 결과 예시)

#### 섹션 5: 현금흐름 조감도 (Cash Flow Diagram) ← **신규 추가**
- **시각화:** 거래 당사자 간 현금흐름 인터랙티브 다이어그램
  - 당사자 카드(거래상대방 명칭 + 역할)와 방향성 화살표(◀ / ▶)
  - 시나리오 탭 전환: 계약 개시 / 정기 결제 / Knock-out 조기종료 / 만기 등
  - 화살표 색상 코딩: 긍정(녹색) / 부정(적색) / 중립(회색)
  - 타이밍 배지: 계약 개시 / 정기 결제 / 만기 / 조기종료
- 결제 메커니즘 설명 (총액 vs. 차액 결제 등)
- 주요 계약 조건 주석 (Notes)

#### 섹션 6: 독소조항 (Poison Pill Clauses)
- **시각화:** 조항별 위험도 카드 (고위험 / 중위험 / 저위험 색상 코딩)
- **Calculation Agent 조항:** 일방 지정 시 이해충돌 리스크
- **Early Termination 조항:** 비대칭 해지권 구조
- **Market Disruption / Fallback 조항:** 기준금리 단종 대응 (LIBOR → SOFR 등)
- **Sole and Absolute Discretion 조항:** 재량권 남용 리스크
- **Look-Through / Substitution 조항**
- **Additional Termination Events (ATE)**

#### 섹션 7: 평가 방법론 (Valuation Methodology)
- **6-가) 평가모델 (Pricing Model)**
  - 사용 모델명 (Black-Scholes, Hull-White, Heston, LMM, Local Vol, SLV 등)
  - 모델 선택 근거 및 시장 표준 여부
  - 대안 모델 비교 (Model Benchmark)
  
- **6-나) 입력변수 (Input Parameters)**
  - 필수 입력변수 목록 (기초자산가격, 변동성, 금리, 배당 등)
  - 시장 데이터 소스 및 관찰 가능 여부 (Observable vs. Unobservable)
  - IFRS 13 Fair Value Hierarchy (Level 1 / 2 / 3) 분류
  - 내부 시스템 연계 (STORM / Goldnet 필드 매핑)
  
- **6-다) 평가방법론 (Valuation Approach)**
  - 수치 해석 방법 (Closed-form / Monte Carlo / PDE / Tree)
  - Greeks 산출 방법 (Bump-and-reprice / Analytic)
  - FRTB SA 민감도 산출 적용 방식
  - CVA/DVA/FVA 적용 여부 및 방법
  - 검증 방법 (IPV, Fair Value Committee 프로세스)

---

## 4. UI/UX 설계 요구사항 (UI/UX Requirements)

### 4.1 전체 레이아웃 구조

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: 장외파생상품 백과사전 | Shinhan Risk Engineering    │
├──────────────┬──────────────────────────────────────────────┤
│              │  [상품명] ── [카테고리 배지] ── [복잡도 별점]  │
│  LEFT SIDEBAR│                                              │
│  (네비게이션) │  ┌──┬──┬──┬──┬────────┬──┬──┐              │
│              │  │개│구│리│손│현금흐름│독│평│ ← 7개 탭     │
│  카테고리 A  │  └──┴──┴──┴──┴────────┴──┴──┘              │
│  ├ IRS ✅   │                                              │
│  ├ CCS       │  [섹션 콘텐츠 영역]                           │
│  ├ Swaption  │  - 시각화 컴포넌트 (레이더/페이오프/현금흐름)  │
│  카테고리 C  │  - 마크다운 렌더링 (수식/표/코드블록 포함)     │
│  ├ FCN/VMS ✅│                                              │
│  ...         │                                              │
│  [Fuse.js 검색]│                                            │
└──────────────┴──────────────────────────────────────────────┘
```

### 4.2 시각화 컴포넌트 설계

#### 4.2.1 페이오프 다이어그램 (Payoff Diagram)

- **라이브러리:** Recharts (LineChart)
- **단일 시나리오:** 단일 선 (색상: `#003087`)
- **복수 시나리오 (신규):** 다중 선 + 범례
  - 시나리오 1 (예: 만기 보유): 실선, `#003087`
  - 시나리오 2 (예: 조기상환): 파선(`strokeDasharray`), `#FF6B00`
- **공통:** x=0 기준선(점선), 툴팁(hover 시 좌표값), x/y축 레이블
- **x축:** 기초자산 수준 (% of 초기가격, 또는 변동금리 %)
- **y축:** 순손익 (Notional 100 기준)

#### 4.2.2 현금흐름 조감도 (Cash Flow Diagram) ← **신규**

- **구현:** 순수 React + Tailwind CSS (라이브러리 불필요)
- **레이아웃:** 당사자 카드(좌우) + 화살표 행(중앙)
- **시나리오 탭:** 내부 탭 스위처로 시나리오 전환
- **화살표 구성:** 
  - 방향성: `◀` (수취) / `▶` (지급) 유니코드 + pill 레이블
  - 타이밍 배지: 계약 개시(주황) / 정기 결제(파랑) / 만기(녹색) / 조기종료(보라)
  - 유형 색상: 긍정(녹색 pill) / 부정(적색 pill) / 중립(흰색 pill)
- **당사자 카드 색상:** 고객(primary 네이비) / 딜러(슬레이트) / CCP(앰버)
- **데이터 구조:** `CashFlowData` 타입 (parties[], scenarios[], notes[])

#### 4.2.3 리스크 레이더 (Risk Radar)

- **라이브러리:** Recharts (RadarChart)
- **축:** 금리/변동성/신용/유동성/모델/운영 리스크 (0–5)
- **색상:** 채우기 `#0066CC` 25% 불투명도, 선 `#0066CC`

### 4.3 네비게이션 방식

- **사이드바 목차 (Left Sidebar Navigation)**
  - 카테고리별 접기/펼치기 (Accordion)
  - 현재 선택 상품 하이라이트
  - Fuse.js 검색 (상품명 / 태그 / 카테고리 퍼지 매칭)
  - 모바일 대응: 햄버거 메뉴로 접힘

- **상품 내 섹션 탭 (Inner Tab Navigation)**
  - 최대 7개 탭 — `cashflow` 섹션 미작성 상품은 탭 미표시
  - URL 앵커 연동 (`#overview`, `#cashflow` 등)
  - 가로 스크롤 지원 (탭 오버플로우 시)

### 4.4 비주얼 디자인 토큰 (Tailwind v4 @theme)

| 토큰 | 값 | 용도 |
|------|-----|------|
| `primary` | `#003087` | 신한 딥 네이비 — 헤딩, 활성 탭, 사이드바 |
| `secondary` | `#0066CC` | 링크, 인터랙티브 요소 |
| `accent` | `#FF6B00` | 경고, 조기종료 화살표 |
| `danger` | `#D32F2F` | 고위험 독소조항, 최대 손실 |
| `success` | `#2E7D32` | 저위험 독소조항, 최대 수익 |
| `bg` | `#F8F9FC` | 페이지 배경 |

### 4.5 반응형 대응

| 브레이크포인트 | 레이아웃 |
|--------------|---------|
| Desktop (≥1280px) | 사이드바 + 메인 2열 고정 |
| Tablet (768-1279px) | 사이드바 오버레이 |
| Mobile (<768px) | 풀스크린 단일 컬럼, 탭 가로 스크롤 |

---

## 5. 기술 요구사항 (Technical Requirements)

### 5.1 기술 스택 (현재 구현 기준)

| 영역 | 기술 선택 | 버전 |
|------|----------|------|
| 프레임워크 | Next.js App Router | 16.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS v4 (`@theme`) | 4.x |
| 수식 렌더링 | remark-math + rehype-katex | — |
| 마크다운 | react-markdown | — |
| 차트 | Recharts (LineChart, RadarChart) | — |
| 검색 | Fuse.js | — |
| 빌드/배포 | Next.js Static Export (`npm run build`) | — |

### 5.2 프로젝트 파일 구조

```
src/
├── app/
│   ├── layout.tsx              ← 루트 레이아웃 (헤더 + 사이드바 + 메인)
│   ├── page.tsx                ← 홈 (첫 번째 상품으로 리디렉트)
│   └── products/[slug]/
│       └── page.tsx            ← 동적 상품 라우트 (SSG)
├── components/
│   ├── Sidebar.tsx             ← 카테고리 아코디언 + Fuse.js 검색
│   ├── ProductPage.tsx         ← 탭 상태 관리, 시각화 컴포넌트 연결
│   ├── MarkdownSection.tsx     ← react-markdown + KaTeX 렌더러
│   └── charts/
│       ├── PayoffChart.tsx     ← Recharts LineChart (단일/복수 시나리오)
│       ├── RiskRadar.tsx       ← Recharts RadarChart
│       └── CashFlowDiagram.tsx ← 현금흐름 조감도 (순수 React + Tailwind)
├── content/
│   └── products/
│       ├── index.ts            ← ALL_PRODUCTS 레지스트리
│       ├── irs.ts              ← IRS 상품 데이터 (완료)
│       ├── fcn.ts              ← FCN/VMS 상품 데이터 (완료)
│       └── ...                 ← 추가 상품
└── types/
    └── product.ts              ← 전체 TypeScript 타입 정의
```

### 5.3 데이터 모델 (TypeScript 타입 기준)

```typescript
// 상품 타입 (product.ts)
interface Product {
  id: string;
  name: string;
  fullName: string;
  categoryId: CategoryId;
  tags: string[];
  difficulty: number; // 1–5
  sections: {
    overview: ProductSection;
    structure: ProductSection;
    risk: ProductSection & { riskRadar?: RiskRadarItem[] };
    pnl: ProductSection & {
      payoffScenarios?: PayoffScenario[]; // 복수 시나리오 지원
      payoffData?: PayoffPoint[];          // 단일 시나리오 (하위 호환)
      xLabel?: string;
      yLabel?: string;
    };
    poison: ProductSection & { clauses: PoisonClause[] };
    valuation: ProductSection;
    cashflow?: ProductSection & { diagram?: CashFlowData }; // 선택적
  };
}

// 현금흐름 조감도 데이터 타입
interface CashFlowData {
  parties: CashFlowParty[];    // 거래 당사자 (최소 2명)
  scenarios: CashFlowScenario[]; // 전환 가능한 시나리오 목록
  notes?: string[];            // 하단 주석
}

interface CashFlowParty {
  id: string;
  name: string;
  role: string;
  type?: 'client' | 'dealer' | 'ccp' | 'other';
}

interface CashFlowArrow {
  from: string;       // party id
  to: string;         // party id
  label: string;      // 현금흐름 명칭
  sublabel?: string;  // 금액/수식 표시
  timing: 'upfront' | 'periodic' | 'maturity' | 'early-termination';
  type?: 'positive' | 'negative' | 'neutral'; // 색상 코딩
}

// 복수 시나리오 페이오프 타입
interface PayoffScenario {
  id: string;
  label: string;        // 범례 레이블
  data: PayoffPoint[];  // { spot, payoff }[]
  color?: string;       // 선 색상
  dashed?: boolean;     // 파선 여부
}
```

### 5.4 새 상품 추가 절차

1. `src/content/products/<id>.ts` 파일 생성 — `Product` 타입 준수
2. `src/content/products/index.ts`의 `ALL_PRODUCTS` 배열에 import 후 추가
3. 상품 자동으로 사이드바 및 `/products/<id>` 라우트에 등록
4. `cashflow` 섹션 포함 시 "현금흐름 조감도" 탭 자동 표시

### 5.5 성능 요구사항

- 초기 로딩: 3초 이내 (LCP)
- 상품 간 전환: 200ms 이내 (CSR 라우팅)
- 검색 응답: 100ms 이내 (Fuse.js 클라이언트 사이드)
- 차트 로딩: Next.js `dynamic` + `ssr: false`로 지연 로드

---

## 6. 기능 요구사항 (Functional Requirements)

### 6.1 필수 기능 (Must Have)

| 기능 | 설명 | 상태 |
|------|------|------|
| 상품 목록 사이드바 | 카테고리별 접기/펼치기 네비게이션 | ✅ 구현 |
| 7-섹션 탭 | 상품별 최대 7개 섹션 탭 전환 | ✅ 구현 |
| 콘텐츠 렌더링 | 텍스트, 표, 수식(KaTeX), 코드블록 | ✅ 구현 |
| 페이오프 다이어그램 | 기초자산 수준별 손익 시각화 (단일/복수 시나리오) | ✅ 구현 |
| 현금흐름 조감도 | 거래 당사자 간 현금흐름 인터랙티브 다이어그램 | ✅ 구현 |
| 리스크 레이더 | 리스크 항목별 방사형 차트 | ✅ 구현 |
| 독소조항 위험도 | 조항별 색상 코딩 카드 | ✅ 구현 |
| Fuse.js 검색 | 상품명/태그 퍼지 검색 | ✅ 구현 |
| URL 딥링크 | `#cashflow`, `#pnl` 등 앵커 연동 | ✅ 구현 |

### 6.2 권장 기능 (Should Have)

| 기능 | 설명 | 상태 |
|------|------|------|
| 인쇄 최적화 | Print CSS (보고서 출력용) | 미구현 |
| 복잡도 뱃지 | 상품별 난이도 별점 표시 | ✅ 구현 |
| 반응형 레이아웃 | 모바일/태블릿 대응 | ✅ 구현 |
| 다중 페이오프 시나리오 | 만기 vs. 조기상환 동시 비교 그래프 | ✅ 구현 |

### 6.3 선택 기능 (Nice to Have)

| 기능 | 설명 | 상태 |
|------|------|------|
| PDF 내보내기 | 상품 페이지 PDF 저장 | 미구현 |
| 상품 비교 | 2개 상품 나란히 비교 | 미구현 |
| 즐겨찾기 | 자주 보는 상품 북마크 | 미구현 |
| 다크 모드 | 색상 테마 전환 | 미구현 |
| AI 요약 | Claude API 연동 Term Sheet 분석 | 미구현 |

---

## 7. 콘텐츠 작성 가이드라인 (Content Guidelines)

### 7.1 작성 기준

- **독자 수준:** 리스크 관리 실무자 (초급~중급), 금융공학 기초 지식 보유 전제
- **언어:** 한국어 기본, 금융 전문용어는 영문 병기 (예: 변동성 표면 (Volatility Surface))
- **수식 표기:** KaTeX 문법 사용, 기호 정의 포함
- **예시:** 실제 거래 구조 기반 수치 예시 포함 (가상 데이터)

### 7.2 현금흐름 조감도 작성 기준

- `cashflow.diagram.parties`: 최소 2명 (고객 + 딜러), 3자(CCP 포함) 시 가운데 추가
- `cashflow.diagram.scenarios`: 최소 2개 — 대표 시나리오 + 불리 시나리오
  - 금리 상품: 금리 상승 시 / 금리 하락 시 / 총액 개념도
  - 주식 상품: 계약 개시 / Knock-out / 만기 원금보존 / 만기 손실
  - 외환 상품: 행사 전 / 행사 시
- `timing` 사용 기준:
  - `upfront`: 계약 효력 발생일(Effective Date)의 일시 지급
  - `periodic`: 분기/반기/연간 정기 결제
  - `maturity`: 만기일(Termination Date) 정산
  - `early-termination`: Knock-out, Optional Call 등 조기종료 정산

### 7.3 페이오프 다이어그램 작성 기준

- 단일 시나리오: `payoffData` 배열 사용 (기존 방식)
- 복수 시나리오: `payoffScenarios` 배열 사용 (신규)
  - `id`: 고유 식별자 (recharts `dataKey`로 사용)
  - `color`: 선 색상 hex (`#003087`, `#FF6B00`, `#2E7D32`, ...)
  - `dashed: true`: 보조 시나리오에 파선 적용
- x축 단위: 기초자산 수준 `%` (기본), 또는 금리 `%`
- y축 단위: Notional 100 기준 순손익

### 7.4 독소조항 위험도 기준

| 등급 | 색상 | 기준 |
|------|------|------|
| 고위험 | `#D32F2F` | 일방적 재량권 / 비대칭 해지권 / 중대한 가치 영향 가능 |
| 중위험 | `#F57C00` | 협상 여지 있으나 모니터링 필요 |
| 저위험 | `#2E7D32` | 시장 표준 조항, 실질적 리스크 미미 |

### 7.5 평가방법론 작성 기준

- IFRS 13 공정가치 위계 (Level 1/2/3) 명시 필수
- 내부 시스템 (STORM / Goldnet) 필드명 병기
- 국제 표준 (ISDA SIMM, FRTB SA) 연계 여부 명시
- 대안 모델 및 실무 선택 근거 기술

---

## 8. 개발 단계 (Development Phases)

### Phase 1: 프레임워크 구축 ✅ 완료
- [x] Next.js App Router + TypeScript 프로젝트 셋업
- [x] 7-섹션 탭 UI (상품 개요/구조/리스크/손익/현금흐름/독소조항/평가)
- [x] Recharts 페이오프 다이어그램 (단일/복수 시나리오)
- [x] Recharts 리스크 레이더 차트
- [x] **현금흐름 조감도 컴포넌트** (당사자 카드 + 방향성 화살표 + 시나리오 탭)
- [x] 독소조항 위험도 카드
- [x] react-markdown + KaTeX 수식 렌더링
- [x] Fuse.js 사이드바 검색
- [x] IRS, FCN/VMS 2종 완전 작성 (7섹션 포함)

### Phase 2: 핵심 상품 구축 (진행 예정)
- [ ] 금리 파생상품 추가 4종 (CCS, Swaption, Cap/Floor, CMS)
- [ ] 주식 파생상품 추가 3종 (ELS, Share Basket TRS, Variance Swap)
- [ ] 신용 파생상품 2종 (CDS, CLN)

### Phase 3: 전체 상품 및 고도화
- [ ] 외환/상품 파생상품 6종 (FX Forward, FX Option, TARF, KO Option, EUA Swap 등)
- [ ] 인쇄 최적화 (Print CSS)
- [ ] PDF 내보내기 기능

### Phase 4: 검토 및 배포
- [ ] 내부 리뷰 (부서원 피드백 반영)
- [ ] CRO 시연
- [ ] 사내 공유 서버 배포 (Next.js Static Export)

---

## 9. 제약 사항 및 리스크 (Constraints & Risks)

| 항목 | 내용 | 대응방안 |
|------|------|---------|
| 콘텐츠 정확성 | 평가방법론 오류 시 실무 혼선 | 부서장 최종 검토 / 작성자 명시 |
| 기밀성 | 실거래 조건 포함 금지 | 모든 수치는 가상 데이터 사용 |
| 유지보수 | 시장 변화 시 내용 업데이트 | 버전 관리 (개정이력 관리) |
| 기술 의존성 | Recharts/KaTeX 버전 호환 | package-lock.json 고정 |
| 범위 확장 | 상품 유형 지속 추가 | 모듈형 데이터 구조 (`cashflow?` 선택적 섹션) |

---

## 10. 부록 (Appendix)

### 10.1 참고 문서

- ISDA Master Agreement (2002)
- ISDA 2002 Equity Derivatives Definitions
- K-IFRS 제1113호 (공정가치 측정)
- Basel III / FRTB BCBS 457
- 자본시장과 금융투자업에 관한 법률
- 내부 평가방법론 정책서 (리스크공학부)

### 10.2 관련 내부 시스템

| 시스템 | 용도 |
|--------|------|
| STORM | OTC 파생상품 평가 엔진 |
| Goldnet | 거래 장부 / 포지션 관리 |
| 공정가치위원회 포털 | 레벨 분류 및 승인 이력 |

### 10.3 개정 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|---------|--------|
| v1.0 | 2026-06-15 | 최초 작성 | 리스크공학부 |
| v1.1 | 2026-06-17 | 기술스택 Next.js로 업데이트, 실제 구현 기준 반영 | 리스크공학부 |
| v1.2 | 2026-06-17 | 현금흐름 조감도 섹션(7번째 탭) 추가, 복수 시나리오 페이오프 다이어그램 추가, 섹션 6개→7개 변경, 데이터 타입 명세 업데이트 | 리스크공학부 |

---

*본 PRD는 리스크공학부 내부 개발 계획 문서이며, 외부 공개 전 CRO 승인이 필요합니다.*
