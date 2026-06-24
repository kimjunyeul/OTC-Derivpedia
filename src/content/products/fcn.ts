import type { Product } from '@/types/product';

export const fcn: Product = {
  id: 'fcn',
  name: 'FCN / VMS',
  fullName: 'Fixed Coupon Note / Variable Maturity Swap',
  categoryId: 'equity',
  tags: [
    '주식', 'Worst-Of', '낙아웃', 'Knock-out', '고정쿠폰', 'FCN', 'VMS',
    '바스켓', 'AutoCall', '상관관계', '몬테카를로', 'Level 3',
  ],
  difficulty: 4,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

**Fixed Coupon Note (FCN)** 또는 **Variable Maturity Swap (VMS)**는 투자자가 복수 기초자산(Basket)의 Worst-Of 하락 리스크를 매도하는 대가로 **고정 쿠폰(Fixed Coupon)**을 수취하는 구조화 파생상품입니다.

"Variable Maturity"라는 명칭은, 미리 정한 관찰일(Observation/Valuation Date)에 **Knock-out 조건**이 충족되면 만기가 조기 확정(Early Termination)되고, 그렇지 않으면 최장 만기까지 지속되는 **가변 만기 특성**에서 유래합니다.

노트(Note) 형태로 발행될 수도 있고, 위 Term Sheet처럼 **OTC 스왑(Variable Maturity Swap)** 형태로 체결될 수도 있습니다. 경제적 실질은 동일합니다.

> **예시 거래 (UBS, 2026-05-08):**
> Equity Amount Payer: Shinhan Securities Co., Ltd
> Floating Amount Payer: UBS AG London Branch
> Notional: USD 5,000,000 / Basket: AMD, NVIDIA, TSLA
> 쿠폰(Equity Amount Leg): Notional × **6.30%** (Effective Date에 일시 지급)

## 거래 목적

| 목적 | 설명 |
|------|------|
| **수익 추구 (Yield Enhancement)** | 고금리 환경에서도 높은 쿠폰(6~15%)을 수취하는 투자 수단 |
| **조건부 주식 매수 전략** | 배리어 이하로 떨어지면 주식을 할인가에 인수 (사실상 Put Short) |
| **델타 헤지 수단** | 딜러 입장에서 개별 주식 포지션의 델타·상관관계 리스크 헤지 |

## 거래 당사자 구조

\`\`\`
  Equity Amount Payer          Floating Amount Payer
  (신한증권 / 매수 기관)  ──쿠폰 6.30%→   (UBS AG London Branch)

                        ←──관찰일 정산──
                        ←──원금 정산(만기 또는 조기 종료)──
\`\`\`

- **Equity Amount Payer (신한증권):** 쿠폰(프리미엄)을 지급하고 Worst-Of 하락 리스크를 부담
- **Floating Amount Payer (UBS):** 쿠폰을 수취하고, 관찰일마다 Knock-out 여부 판단 후 정산
- **Calculation Agent:** 통상 딜러(UBS)가 단독 지정 — 독소조항 항목 참조

## 관련 계약 및 규제

- **ISDA 2002 Master Agreement + Equity Definitions (2002):** 주식 파생상품 기본 계약
- **CSA (Credit Support Annex):** 변동 증거금(VM) 수수 — 단, 장기물은 IM도 적용
- **K-IFRS 제1109호:** 임베디드 파생상품 분리 회계 여부 검토
- **FRTB (BCBS 457):** 주식 리스크(EQ) SA — Delta, Vega, Curvature 산출 대상
- **자본시장법 제5조 / 제166조의2:** 장외파생상품 거래 상대방 적격성, 보고 의무
      `,
    },
    structure: {
      title: '상품 구조',
      content: `
## Leg 구조 (Variable Maturity Swap 기준)

| Leg | 지급자 | 내용 | 시점 |
|-----|-------|------|------|
| **Equity Amount Leg** | Equity Amount Payer (신한증권) | Notional × 쿠폰율 (6.30%) | Effective Date (일시 지급) |
| **Floating Amount Leg** | Floating Amount Payer (UBS) | 관찰일 Knock-out 발생 시 원금 100% 또는 만기 Worst-Of 정산 | 각 정산일 |

> **Note:** 일부 FCN 구조에서는 쿠폰을 분기/반기로 분할 지급하거나, 스왑 원금을 Effective Date에 교환하기도 합니다. 위 Term Sheet는 **쿠폰을 Effective Date에 일시 지급**하는 방식입니다.

## 주요 계약 파라미터 (Term Sheet 매핑)

| Term Sheet 항목 | 설명 | 예시 (UBS 거래) |
|---------------|------|----------------|
| **Notional Amount** | 명목원금 | USD 5,000,000 |
| **Trade Date** | 거래 체결일 | 8 May 2026 |
| **Effective Date** | 거래 효력 발생일 (쿠폰 지급일) | 22 May 2026 |
| **Termination Date** | 최장 만기 또는 Knock-out 종료일 | Variable — Knock-out 이벤트에 따라 결정 |
| **Basket** | 기초자산 바스켓 | AMD, NVIDIA, TSLA (Worst-Of) |
| **Initial Price ($S_0$)** | 기초자산별 최초 기준가격 | Trade Date 종가 |
| **Strike ($X_n$)** | 원금 손실 기준가 | $S_0 \\times K\\%$ (예: $S_0 \\times 80\\%$) |
| **Callable Price ($C_n$)** | Knock-out(조기 종료) 기준가 | $S_0 \\times 100\\%$ |
| **Coupon (Equity Amount)** | 쿠폰율 | Notional × **6.30%** |
| **Valuation Dates** | Knock-out 관찰일 | 각 Return Period End Date |
| **Closing Price** | 기초자산 종가 산정 방식 | 거래소 공식 종가 (Calculation Agent 재량 보완) |

## 기초자산 바스켓 (Worst-Of)

| 주식 | RIC Code | BBG Code |
|------|---------|---------|
| AMD (Advanced Micro Devices) | AMD.OQ | AMD UW |
| NVIDIA Corporation | NVDA.OQ | NVDA UW |
| Tesla, Inc. | TSLA.OQ | TSLA UW |

**Worst-Of 정의:**

$$WO_T = \\min_{i \\in \\{AMD,\\ NVDA,\\ TSLA\\}} \\frac{S_{i,T}}{S_{i,0}}$$

## 현금흐름 시나리오

### 시나리오 1: Knock-out 조기 종료 (최선 시나리오)

\`\`\`
Effective Date:  Shinhan → UBS: USD 315,000 (= $5M × 6.30%)
관찰일(예: 3개월 후):
  AMD, NVDA, TSLA 모두 S₀ × 100% 이상 → Knock-out 발동
  UBS → Shinhan: USD 5,000,000 (원금 100% 조기 상환)
\`\`\`

### 시나리오 2: 만기 보유 — 원금 보존 (Worst-Of ≥ Strike)

\`\`\`
Effective Date:  Shinhan → UBS: USD 315,000 (쿠폰 지급)
모든 관찰일:    Knock-out 미발생
만기(Termination Date):
  WO_T ≥ 80% (= Strike) → UBS → Shinhan: USD 5,000,000 (원금 100%)
\`\`\`

### 시나리오 3: 만기 보유 — 원금 손실 (Worst-Of < Strike)

\`\`\`
Effective Date:  Shinhan → UBS: USD 315,000 (쿠폰 지급)
모든 관찰일:    Knock-out 미발생
만기(Termination Date):
  WO_T = 50% (예: TSLA가 S₀ 대비 50%로 폭락)
  UBS → Shinhan: USD 5,000,000 × (50% / 80%) = USD 3,125,000
  → 원금 손실 USD 1,875,000 (37.5%)
\`\`\`

## ISDA Equity Definitions 주요 조항 (Section 6.6)

Valuation Dates 정의에 "Section 6.6 of the Equity Definitions which shall apply mutatis mutandis"가 명시되어, **Market Disruption Event** 발생 시 대체 Valuation Date 산정 규정이 적용됩니다.
      `,
    },
    risk: {
      title: '리스크',
      content: `
## 시장 리스크

### 1. Delta (기초자산 방향성 리스크)

FCN 매수자는 Worst-Of 기초자산 전체에 대해 **하방(숏) 델타 익스포저**를 보유합니다.

$$\\Delta_{WO} = \\frac{\\partial V}{\\partial S_k}, \\quad k = \\arg\\min_{i} \\frac{S_{i,T}}{S_{i,0}}$$

- 관찰 시점에 가장 부진한 주식(Worst Performer)에 델타가 집중
- AMD, NVDA, TSLA 중 어느 하나라도 급락하면 해당 종목의 델타가 지배적이 됨

### 2. Vega (변동성 리스크)

$$\\text{Vega} = \\frac{\\partial V}{\\partial \\sigma_i}$$

- Short Worst-Of Put 포지션 → **Short Vega** (변동성 상승 시 손실)
- AMD, NVDA, TSLA는 모두 고변동성 기술주 → 개별 Vega 및 Cross-Vega 모두 유의미

### 3. 상관관계 리스크 (Correlation Risk) ⚠️ 핵심 리스크

**Worst-Of 구조의 가장 중요한 리스크 요인:**

$$\\text{Price}_{WO} = f(\\sigma_1, \\sigma_2, \\sigma_3, \\rho_{12}, \\rho_{13}, \\rho_{23})$$

| 상관관계 변화 | FCN 매수자 영향 |
|-------------|--------------|
| 상관관계 ↑ (동조화 강화) | Worst-Of 스트라이크 확률 감소 → 유리 |
| 상관관계 ↓ (비동조화) | Worst-Of 스트라이크 확률 증가 → 불리 |

- AMD-NVDA-TSLA 간 상관관계는 시장 레짐(정상/위기)에 따라 급변 가능
- 위기 시 상관관계 붕괴(Correlation Breakdown) → 최악의 Worst-Of 시나리오

### 4. Gamma / Convexity

- 스트라이크 근방에서 높은 음(-)의 Gamma
- Knock-out 배리어 근방: 경로 의존적 Gamma — Calculation Agent 재량 영향 구간

## 신용 리스크

- **CCR (Counterparty Credit Risk):** UBS AG의 신용 리스크 (현재 투자등급이나 시장 스트레스 상황 모니터링 필요)
- **CVA 산출 필요:** 스왑 형태이므로 K-IFRS 제1113호 및 FRTB CVA 규제 적용

## 유동성 리스크

- **청산 유동성:** 기초자산(AMD, NVDA, TSLA)은 유동성 풍부하나, **스왑 계약 자체**의 중도 해지는 Market Quote 또는 Agreement Value 방식으로 결정되며 **딜러 스프레드 비용** 상당

## 모델 리스크

- **Worst-Of 상관관계 모델:** 가우시안 코풀라, Student-t 코풀라 등 — 꼬리(tail) 상관관계 과소평가 가능
- **Local/Stochastic Volatility:** 개별 변동성 표면 모델이 Worst-Of 구조에서 일관성 없을 수 있음 (상관관계-변동성 조합의 복잡성)

## 운영 리스크

- Knock-out 판단 시 Calculation Agent(UBS)의 종가 확인 및 이벤트 통지 절차
- Additional Disruption Events (거래소 폐장, 주식 분할/합병) 발생 시 계약 처리 복잡성
      `,
      riskRadar: [
        { subject: '주가 민감도(Delta)', value: 5, fullMark: 5 },
        { subject: '변동성 민감도(Vega)', value: 4, fullMark: 5 },
        { subject: '상관관계 리스크', value: 5, fullMark: 5 },
        { subject: '신용 리스크', value: 3, fullMark: 5 },
        { subject: '유동성 리스크', value: 4, fullMark: 5 },
        { subject: '모델 리스크', value: 4, fullMark: 5 },
      ],
    },
    pnl: {
      title: '손익 분석',
      content: `
## Equity Amount Payer (신한증권) 관점 손익 구조

**가정:**
- Notional: USD 100 (정규화)
- 쿠폰: 6.30% (Effective Date에 지급, 비용)
- Strike($X_n$): $S_0 \\times 80\\%$
- Callable Price($C_n$): $S_0 \\times 100\\%$
- 만기 보유 (Knock-out 미발생) 가정

### 만기 손익 공식

$$
\\text{Payoff} = \\begin{cases}
+6.30 & \\text{if } WO_T \\geq 80\\% \\\\
\\left(\\dfrac{WO_T}{80\\%} - 1\\right) \\times 100 + 6.30 & \\text{if } WO_T < 80\\%
\\end{cases}
$$

- **원금 보존 구간** ($WO_T \\geq 80\\%$): 원금 100% 회수 + 쿠폰 6.30% 수취
- **원금 손실 구간** ($WO_T < 80\\%$): Worst-Of 수준이 Strike 미만으로 하락 시 원금 비례 손실 + 쿠폰 수취

### 시나리오 테이블 (Notional 100 기준)

| Worst-Of 수준 | 원금 회수 | 쿠폰 수취 | 순 손익 |
|-------------|---------|---------|--------|
| 120% | **100.00** | 6.30 | **+6.30** |
| 100% | **100.00** | 6.30 | **+6.30** |
| 80% | **100.00** | 6.30 | **+6.30** ← Break-even (원금 기준) |
| 70% | 87.50 | 6.30 | **−6.20** |
| 60% | 75.00 | 6.30 | **−18.70** |
| 50% | 62.50 | 6.30 | **−31.20** |
| 40% | 50.00 | 6.30 | **−43.70** |
| 20% | 25.00 | 6.30 | **−68.70** |
| 0% | 0.00 | 6.30 | **−93.70** |

## 최대 손익 요약

| 구분 | 금액 | 조건 |
|------|------|------|
| **최대 이익** | +6.30% (고정) | Worst-Of ≥ 80% — 수익은 쿠폰으로 제한(Capped) |
| **Break-even** | Worst-Of = 80% (Strike) | 쿠폰으로 손실 상쇄 가능한 최저 수준 |
| **최대 손실** | 최대 −93.70% | Worst-Of → 0% (기초자산 전액 손실) |
| **조기 종료 시** | +6.30% (빠른 회수) | Knock-out 발동 → 자본 회전 이점 |

> **구조적 비대칭:** 수익은 쿠폰(6.30%)으로 고정·제한되나, 손실은 원금 전액까지 열려 있습니다. Worst-Of 구조로 인해 단일 종목 투자보다 하방 리스크가 더 큽니다.

## 스트레스 테스트 (2022년 시나리오 참조)

| 시나리오 | AMD | NVDA | TSLA | Worst-Of | 원금 회수율 | 순 손익 |
|---------|-----|------|------|---------|-----------|--------|
| 기술주 강세 (+30%) | +30% | +30% | +30% | 130% | 100% | +6.30% |
| 기준 시나리오 | +10% | +5% | −5% | 95% | 100% | +6.30% |
| 기술주 조정 (−30%) | −20% | −15% | **−30%** | 70% | 87.5% | −6.20% |
| TSLA 급락 (2022년 유사) | −5% | +10% | **−65%** | 35% | 43.75% | −49.95% |
| 글로벌 위기 | −50% | −55% | **−70%** | 30% | 37.5% | −56.20% |
      `,
      payoffScenarios: [
        {
          id: 'maturity',
          label: '만기 보유 (Knock-out 미발생)',
          color: '#003087',
          dashed: false,
          data: [
            { spot: 0,   payoff: -93.7 },
            { spot: 10,  payoff: -81.2 },
            { spot: 20,  payoff: -68.7 },
            { spot: 30,  payoff: -56.2 },
            { spot: 40,  payoff: -43.7 },
            { spot: 50,  payoff: -31.2 },
            { spot: 60,  payoff: -18.7 },
            { spot: 70,  payoff:  -6.2 },
            { spot: 80,  payoff:   6.3 },
            { spot: 90,  payoff:   6.3 },
            { spot: 100, payoff:   6.3 },
            { spot: 110, payoff:   6.3 },
            { spot: 120, payoff:   6.3 },
            { spot: 130, payoff:   6.3 },
          ],
        },
        {
          id: 'knockout',
          label: 'Knock-out 조기종료 시 (+6.30% 확정)',
          color: '#FF6B00',
          dashed: true,
          data: [
            { spot: 0,   payoff: 6.3 },
            { spot: 10,  payoff: 6.3 },
            { spot: 20,  payoff: 6.3 },
            { spot: 30,  payoff: 6.3 },
            { spot: 40,  payoff: 6.3 },
            { spot: 50,  payoff: 6.3 },
            { spot: 60,  payoff: 6.3 },
            { spot: 70,  payoff: 6.3 },
            { spot: 80,  payoff: 6.3 },
            { spot: 90,  payoff: 6.3 },
            { spot: 100, payoff: 6.3 },
            { spot: 110, payoff: 6.3 },
            { spot: 120, payoff: 6.3 },
            { spot: 130, payoff: 6.3 },
          ],
        },
      ],
      xLabel: 'Worst-Of 바스켓 수준 (% of S₀)',
      yLabel: '순 손익 (Notional 100 기준)',
    },
    poison: {
      title: '독소조항',
      content: `
## 독소조항 분석 개요

FCN/VMS는 복잡한 Worst-Of 구조와 가변 만기 특성으로 인해, 표준 IRS 대비 **훨씬 광범위한 독소조항**이 내재되어 있습니다. Calculation Agent 재량권 범위가 광범위하며, 아래 항목들을 Term Sheet 수취 시 반드시 점검해야 합니다.
      `,
      clauses: [
        {
          name: 'Calculation Agent 단독 지정 (UBS)',
          level: 'high',
          description:
            'UBS AG London Branch가 Calculation Agent로 단독 지정되어, Knock-out 이벤트 발생 여부 확정, Market Disruption 발생 시 대체 종가 산정, 배당 조정, 기초자산 변경 등 거래의 핵심 판단을 UBS가 독점합니다. "good faith estimation of the Calculation Agent acting in a commercially reasonable manner"라는 표준 문구가 있으나, 실질적으로 매수자(신한증권)의 이의 제기 수단은 제한적입니다.',
        },
        {
          name: 'Knock-out 이벤트 종료 조건의 불확실성',
          level: 'high',
          description:
            'Termination Date가 "the final Cash Settlement Payment Date, subject to the Consequences of Knock-out Event"로 정의되어 정확한 만기일을 사전에 알 수 없습니다. 이는 유동성 계획 및 헤지 전략 수립을 어렵게 하며, ALM 포지션 관리 상 불확실성 요인입니다. 조기 종료 여부가 UBS의 관찰 결과에 달려 있어 투명성 확보가 필요합니다.',
        },
        {
          name: 'Additional Disruption Events (기초자산 변경)',
          level: 'high',
          description:
            'AMD, NVIDIA, TSLA 중 하나라도 기업 합병, 국유화, 상장폐지, 거래 정지, 분할 등이 발생하면 Calculation Agent가 기초자산 대체(Substitution) 또는 계약 조기 종료를 결정할 수 있습니다. 대체 기초자산 선정 기준이 불명확하거나 딜러에게 유리한 종목으로 교체될 리스크가 있습니다.',
        },
        {
          name: 'Market Disruption / Trading Disruption',
          level: 'medium',
          description:
            'ISDA Equity Definitions Section 6.6에 따라 Market Disruption Event 발생 시 최대 8거래일까지 Valuation Date가 연장될 수 있으며, 그 이후에는 Calculation Agent 재량으로 종가를 산정합니다. NYSE/NASDAQ 서킷 브레이커, 거래량 급감 등이 해당하며, 유사 시 Knock-out 관찰이 불리한 방향으로 처리될 수 있습니다.',
        },
        {
          name: 'Closing Price 산정 재량 (Good Faith Estimation)',
          level: 'medium',
          description:
            '"if such price is not published for whatever reason, the value of a Share as of the actual closing time … in the good faith estimation of the Calculation Agent acting in a commercially reasonable manner"로 명시되어, 공식 종가가 없을 경우 UBS가 독자적으로 가격을 산정합니다. Knock-out 경계 근방(배리어 ±1~2%)에서 이 조항이 결과를 바꿀 수 있습니다.',
        },
        {
          name: '쿠폰 일시 지급 구조 (Day 1 Payment)',
          level: 'low',
          description:
            '쿠폰(6.30%)을 Effective Date에 일시 지급하는 구조는 매수자(신한증권)가 거래 첫날부터 수수료를 지급하게 되어, 계약 파기 또는 조기 종료 시 쿠폰 환급이 불가합니다. 쿠폰이 분기/반기 분할 지급 방식보다 불리한 측면이 있습니다.',
        },
      ],
    },
    valuation: {
      title: '평가 방법론',
      content: `
## 6-가) 평가 모델

**핵심 모델:** Worst-Of 배리어 옵션 — **몬테카를로 시뮬레이션 (Monte Carlo Simulation)**

FCN/VMS는 **다중 기초자산(Multi-Asset)**, **경로 의존성(Path-Dependency, Knock-out 관찰)**, **상관관계**가 결합된 복합 구조이므로 Closed-Form 해석해는 존재하지 않습니다.

### 모델 선택 근거

| 모델 | 적용 여부 | 근거 |
|------|---------|------|
| Black-Scholes (단일자산) | ❌ 부적합 | 다중 자산, 경로 의존성 처리 불가 |
| **Local Volatility (Dupire)** | ✅ 기본 | 개별 변동성 표면 보정, 산업 표준 |
| **Stochastic Volatility (Heston)** | ✅ 보완 | 변동성 미소(Volatility Smile) 재현 |
| **Stochastic Local Volatility (SLV)** | ✅ 권장 | Local Vol + Heston 결합, 시장 Price 정합성 우수 |
| Gaussian Copula | ⚠️ 주의 | 상관관계 모델링 단순하나 꼬리(tail) 과소평가 |
| Student-t Copula | ✅ 대안 | 극단적 공동 하락(Joint Tail) 재현에 우수 |

---

## 6-나) 입력변수 (Input Parameters)

| 입력변수 | 관찰 가능성 | IFRS 13 Level | 내부 시스템 |
|---------|-----------|--------------|-----------|
| AMD, NVDA, TSLA 현재가 | Observable (실시간) | **Level 1** | STORM: EQ_PRICE |
| 개별 변동성 표면 (Implied Vol Surface) | Observable (옵션 호가) | **Level 2** | STORM: EQ_IVOL_SURFACE |
| 배당수익률 (Dividend Yield) | Observable (배당 이력) | **Level 2** | STORM: EQ_DIV |
| USD OIS/Repo 금리 곡선 | Observable | **Level 2** | STORM: USD_OIS_CURVE |
| **주식 간 상관계수 ($\\rho_{ij}$)** | **부분 관찰** | **⚠️ Level 2~3** | 내부 추정 (히스토리컬 + 코풀라 교정) |
| Counterparty CDS (UBS) | Observable | **Level 2** | Goldnet: CTPTY_CDS |
| CVA/DVA 조정 | 부분 Observable | **Level 2~3** | 공정가치위원회 포털 |

> **IFRS 13 공정가치 위계:** 상관관계 파라미터의 시장 관찰 불가능성으로 인해 통상 **Level 3** 분류

---

## 6-다) 평가 방법론

### 몬테카를로 시뮬레이션 구조

**1단계: 다중 자산 주가 경로 생성**

각 기초자산 $i$ ($i$ = AMD, NVDA, TSLA)의 위험중립 측도 하 주가 과정:

$$dS_i(t) = (r - q_i) S_i(t)\\,dt + \\sigma_i(S_i, t)\\,S_i(t)\\,dW_i(t)$$

- $r$: USD 무위험금리 (OIS Curve)
- $q_i$: 종목별 배당수익률
- $\\sigma_i(S_i, t)$: Local Volatility (Dupire 공식으로 보정)
- $dW_i(t)$: 상관관계 $\\rho_{ij}$를 갖는 브라운 운동

**상관 구조 (Cholesky Decomposition):**

$$\\mathbf{W}(t) = L \\cdot \\mathbf{Z}(t), \\quad L L^\\top = \\boldsymbol{\\Sigma}$$

$$\\boldsymbol{\\Sigma} = \\begin{pmatrix} 1 & \\rho_{12} & \\rho_{13} \\\\ \\rho_{12} & 1 & \\rho_{23} \\\\ \\rho_{13} & \\rho_{23} & 1 \\end{pmatrix}$$

**2단계: Worst-Of 및 Knock-out 판정**

각 시뮬레이션 경로에서:

$$WO_t = \\min\\left(\\frac{S_{AMD,t}}{S_{AMD,0}},\\ \\frac{S_{NVDA,t}}{S_{NVDA,0}},\\ \\frac{S_{TSLA,t}}{S_{TSLA,0}}\\right)$$

- 관찰일 $t_k$마다: $\\min_i(S_{i,t_k} / C_{i,n}) \\geq 1$ 이면 Knock-out (조기 종료)
- 만기까지 Knock-out 미발생: $WO_T \\geq X_n/S_0$이면 100%, 미만이면 $WO_T/(X_n/S_0) \\times 100\\%$

**3단계: 현재가치 산출**

$$V_0 = e^{-rT} \\cdot \\mathbb{E}^Q[\\text{Payoff}(\\tau)] - \\text{CVA}$$

- $\\tau$: 실제 종료 시점 (Knock-out 조기 종료 or 만기)
- 시뮬레이션 경로 수: 통상 100,000 ~ 1,000,000회 (분산 감소 기법 적용)

### Greeks 산출 (FRTB SA 기준)

| Greek | 산출 방법 | FRTB 버킷 |
|-------|---------|----------|
| **EQ Delta** | 기초자산 가격 +1% Bump-and-Reprice | EQ Risk Class — Large Cap (AMD, NVDA, TSLA) |
| **EQ Vega** | 변동성 표면 +1vp Shift | EQ Vega Bucket (만기별) |
| **EQ Curvature** | 전체 가격 +/− 이동 | EQ Curvature |
| **GIRR Delta** | USD OIS 금리 +1bp | GIRR USD Bucket |
| **Correlation Sensitivity** | FRTB SA 비표준 — 내부 모델 활용 | (SA 공식 미정의, IMA에서만 처리) |

### CVA/DVA 적용

$$V_{\\text{adj}} = V_{\\text{Risk-Free}} - \\text{CVA}_{UBS} + \\text{DVA}_{Shinhan}$$

- UBS 신용등급 및 CDS 스프레드로 CVA 산출
- 스왑 형태이므로 양방향 CCR 노출: 양방향 CVA 모두 산출 필요

### 검증 방법 (IPV)

- **독립가격검증(IPV):** 딜러 제공 Mark와 내부 MC 재평가 비교 (T+1 기준)
- **공정가치위원회:** Level 3 분류 확인, 상관관계 파라미터 주기적 재검토
- **Sensitivity Benchmarking:** FRTB SA 민감도 vs. 내부 FO 민감도 비교 — 특히 상관관계 Vega 일치 여부 점검
      `,
    },
    cashflow: {
      title: '현금흐름 조감도',
      content: `
## FCN / VMS 현금흐름 구조

FCN(Fixed Coupon Note) / VMS(Variable Maturity Swap)는 크게 **2단계** 현금흐름으로 구성됩니다.

| 단계 | 시점 | 방향 | 내용 |
|------|------|------|------|
| **1단계** | Effective Date | 신한증권 → UBS | 쿠폰 일시 선지급 (Notional × 6.30%) |
| **2단계** | Knock-out 또는 만기 | UBS → 신한증권 | 원금 전액 또는 Worst-Of 비례 반환 |

### 가변 만기(Variable Maturity) 특성

만기는 관찰일(Valuation Date)마다 결정됩니다:

$$\\text{종료 조건: } \\min_{i} \\frac{S_{i,t_k}}{C_{i,n}} \\geq 1 \\Rightarrow \\text{Knock-out 발동 → 조기 종료}$$

모든 관찰일을 통과하면 최장 만기(Termination Date)에 $WO_T$ 대비 Strike(80%)로 최종 정산합니다.

### 시나리오별 손익 요약

| 시나리오 | 쿠폰 수취 | 원금 회수 | 순 손익 |
|---------|---------|---------|--------|
| **Knock-out 조기종료** | +6.30% | 100% | **+6.30%** |
| **만기 — WO ≥ 80%** | +6.30% | 100% | **+6.30%** |
| **만기 — WO = 60%** | +6.30% | 75.0% | **−18.70%** |
| **만기 — WO = 40%** | +6.30% | 50.0% | **−43.70%** |
| **만기 — WO = 0%** | +6.30% | 0% | **−93.70%** |
      `,
      diagram: {
        parties: [
          {
            id: 'eap',
            name: '신한증권',
            role: 'Equity Amount Payer (매수 기관)',
            type: 'client',
          },
          {
            id: 'fap',
            name: 'UBS AG\nLondon',
            role: 'Floating Amount Payer (딜러)',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'effective',
            label: '① 계약 체결 (Effective Date)',
            description: '쿠폰은 Effective Date에 일시 선지급됩니다. 이후 계약이 어떻게 종료되더라도 환급되지 않습니다 (독소조항 참조).',
            arrows: [
              {
                from: 'eap',
                to: 'fap',
                label: '쿠폰 일시 선지급',
                sublabel: 'USD 315,000 (= Notional $5M × 6.30%)',
                timing: 'upfront',
                type: 'negative',
              },
            ],
          },
          {
            id: 'knockout',
            label: '② Knock-out 조기종료',
            description: '관찰일에 AMD, NVDA, TSLA 전종목이 S₀ × 100% 이상이면 Knock-out 발동. UBS가 원금 100%를 즉시 반환 — 가장 유리한 시나리오입니다.',
            arrows: [
              {
                from: 'fap',
                to: 'eap',
                label: '원금 100% 조기 반환',
                sublabel: 'USD 5,000,000 — Knock-out 발동일 정산',
                timing: 'early-termination',
                type: 'positive',
              },
            ],
          },
          {
            id: 'maturity-ok',
            label: '③ 만기 — 원금 보존 (WO ≥ 80%)',
            description: '모든 관찰일에 Knock-out 미발생, 만기 시 Worst-Of ≥ Strike(80%). 원금 전액 회수 — 쿠폰 6.30% 획득.',
            arrows: [
              {
                from: 'fap',
                to: 'eap',
                label: '원금 100% 만기 반환',
                sublabel: 'USD 5,000,000 — WO_T ≥ 80%',
                timing: 'maturity',
                type: 'positive',
              },
            ],
          },
          {
            id: 'maturity-loss',
            label: '④ 만기 — 원금 손실 (WO < 80%)',
            description: '모든 관찰일에 Knock-out 미발생, 만기 시 Worst-Of < Strike(80%). WO 비율에 비례하여 원금 손실 발생. 예: WO = 50% → 회수액 = $5M × (50%/80%) = $3,125,000 (손실 $1,875,000)',
            arrows: [
              {
                from: 'fap',
                to: 'eap',
                label: '비례 원금 반환 (손실 발생)',
                sublabel: 'Notional × (WO_T / Strike) — 예: WO=50% → $3,125,000',
                timing: 'maturity',
                type: 'negative',
              },
            ],
          },
        ],
        notes: [
          '쿠폰(USD 315,000)은 Effective Date에 이미 지급 완료 — 모든 시나리오에서 기결제 상태입니다.',
          'Calculation Agent: UBS AG London Branch (단독) — Knock-out 판정 및 종가 산정 재량권 보유',
          'Market Disruption 발생 시 최대 8영업일 Valuation Date 연장 후 UBS 재량 산정',
          'Strike(Callable Price): S₀ × 100% / 원금보존 기준(Strike): S₀ × 80%',
        ],
      },
    },
  },
};
