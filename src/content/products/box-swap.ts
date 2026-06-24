import type { Product } from '@/types/product';

export const boxSwap: Product = {
  id: 'box-swap',
  name: '박스 스왑',
  fullName: 'Share Basket Total Return Swap (Box Swap)',
  categoryId: 'equity',
  tags: [
    '주식바스켓', 'TRS', '토탈리턴스왑', '박스스왑', 'SOFR', '배당재투자',
    'JPMorgan', '한국주식', '합성롱', 'ISDA', '바스켓수정', '현금결제',
  ],
  difficulty: 4,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

박스 스왑(Box Swap)은 **주식 바스켓에 대한 토탈리턴스왑(TRS, Total Return Swap)**입니다.
딜러(JPMorgan)가 실물로 바스켓 주식을 보유하고, 고객은 그 경제적 성과 전체(가격 변동 + 배당)를 합성으로 취득하는 구조입니다.

"박스"라는 명칭은 바스켓 구조 전체를 하나의 박스로 포장해 스왑으로 이전한다는 개념에서 유래합니다.

## 실제 거래 개요 (계약서 기준)

| 항목 | 내용 |
|------|------|
| **딜러** | JPMorgan Chase Bank, N.A. (London Branch) |
| **법적 기반** | ISDA Master Agreement + 2002 ISDA Equity Derivatives Definitions |
| **바스켓 티커** | JPKRUS5 (Bloomberg HP 페이지) |
| **바스켓 수** | 2,815,006개 |
| **바스켓 초기가격** | USD 160.0809 |
| **바스켓 제수** | 992,099.6035 |
| **주식 명목** | USD 450,628,693.99 (~약 6,250억원) |
| **거래일** | 2026년 4월 7일 |
| **효력발생일** | 2026년 4월 9일 |
| **평가일** | 2026년 5월 7일, 2026년 8월 7일 |
| **결제통화** | USD (현금결제) |

## 손익 구조 요약

$$\\text{고객 P\\&L} = \\underbrace{N_B \\times (P_{final} - P_{initial})}_{\\text{주가 변동분}} + \\underbrace{\\text{배당 재투자 효과}}_{\\text{배당 수익}} - \\underbrace{N_{eq} \\times r_{SOFR+40} \\times \\frac{t}{360}}_{\\text{조달 비용}}$$

## 활용 목적

| 목적 | 설명 |
|------|------|
| **합성 롱 포지션** | 주식 직접 매입 없이 주가 상승 수익 획득 |
| **레버리지** | 조달 비용만 부담하고 전체 주가 변동에 노출 |
| **세제·규제 효율** | 직접 보유 대비 세금 또는 보고 의무 최소화 |
| **바스켓 커스터마이징** | 바스켓 수정 조항 활용 → 포트폴리오 동적 조정 |
| **Short Squeeze 회피** | 주식 차입 없이 합성 포지션 구축 |
      `,
    },

    structure: {
      title: '상품 구조',
      content: `
## 두 개의 레그 구조

박스 스왑은 **주식 레그(Equity Leg)**와 **조달 레그(Funding Leg)**로 구성됩니다.

### 주식 레그 (JPMorgan → 고객 방향)

**지급자:** JPMorgan (Equity Amount Payer)

$$\\text{Equity Amount} = N_B \\times (P_{final} - P_{initial})$$

- $N_B$ = 바스켓 수 (2,815,006)
- $P_{final}$ = 평가일 Gross Price (세금 조정 후)
- $P_{initial}$ = USD 160.0809
- 양수이면 JPMorgan이 고객에게 지급, 음수이면 고객이 JPMorgan에 지급

**Return Type: Total Return** — 가격 변동과 배당 효과 모두 포함

---

### 조달 레그 (고객 → JPMorgan 방향)

**지급자:** 고객 (Counterparty, Floating Amount Payer)

$$\\text{Floating Amount} = N_{eq} \\times (r_{SOFR,avg} + 40\\text{bps}) \\times \\frac{\\text{days}}{360}$$

| 항목 | 내용 |
|------|------|
| **기준금리** | USD-SOFR |
| **평균 방식** | Averaging with Lookback (2 영업일 후행) |
| **가산금리** | +40bps p.a. |
| **Day Count** | Actual/360 |
| **리셋일** | 각 계산기간 마지막 영업일 |
| **통화 영업일** | 뉴욕, 서울 |

---

## 바스켓 제수(Basket Divisor) 메커니즘

$$\\text{Gross Price} = \\frac{\\sum_{i=1}^{n} \\text{Relevant Price}_i \\times \\text{Number of Shares}_i}{\\text{Basket Divisor}}$$

- Basket Divisor = 992,099.6035 (기준일)
- 배당 발생 시 제수를 자동 조정 → 배당을 가격에 재투자하는 효과

**배당 재투자 조정 공식:**

$$\\text{BD}_{post} = \\text{BD}_{pre} \\times \\frac{\\text{GP}_{pre,div}}{\\text{GP}_{inc,div}}$$

- $\\text{GP}_{pre,div}$: 배당락 효과 반영 후 Gross Price (즉, 배당만큼 하락한 가격)
- $\\text{GP}_{inc,div}$: 배당 무조정 Gross Price

→ 제수가 줄어들면서 이후 Gross Price 계산 시 분자 가치 보존 효과 발생

---

## 바스켓 수정(Basket Modification) 조항

어느 일방이 Basket Modification Notice를 통해 다음을 요청 가능:
- **신규 편입 (New Share):** 새 종목을 바스켓에 추가
- **종목 제거 (Removed Share):** 기존 종목 제거
- **수량 변경:** 각 종목 편입 수량 증감
- **명목 변경:** 전체 Equity Notional Amount 증감

→ 상대방 동의 없이도 통지만으로 변경 가능. **고객 측에 불리한 방향 변경 위험.**

---

## 결제 구조

- **결제 방법:** Cash Settlement (현금 결제, 실물 주식 수수 없음)
- **결제통화:** USD
- **결제일:** 각 평가일 후 2 영업일 (뉴욕·서울 기준)
- **조기청산:** Optional Early Termination — 어느 일방도 Notice Date에 행사 가능

| 평가일 | 결제일 (예정) | 기간 |
|--------|-------------|------|
| 2026-05-07 | 2026-05-11 | 약 1개월 |
| 2026-08-07 | 2026-08-11 | 약 4개월 (만기) |
      `,
    },

    risk: {
      title: '리스크 분석',
      content: `
## 리스크 유형별 분석

### 1. 주가 리스크 (Equity Price Risk) ★★★★★

바스켓 구성 종목의 가격 변동이 P&L에 **1:1로 완전 반영**됩니다.
- 레버리지 상품이 아니나, 명목금액 전체가 주가 변동에 노출
- 한국 주식 바스켓 특성상 섹터 집중도, 수급 변동 민감

$$\\text{주가 1\\% 변동 시 P\\&L} \\approx USD 4,506,287 \\ (\\approx 62.4억원)$$

---

### 2. 환율 리스크 (FX Risk) ★★★★☆

- 바스켓 구성 종목: **한국 원화(KRW) 상장주식**
- 결제통화: **USD**
- Relevant Price는 FX Rate로 USD 환산
- 원달러 환율 변동 시 Gross Price가 변동 → USD P&L에 직접 영향

**FX Rate 결정:** 매 영업일 오후 4시(런던) Bloomberg 고시율 기준. 미고시 시 CA(JPMorgan)가 재량 결정.

---

### 3. 조달 금리 리스크 (Funding / SOFR Risk) ★★★☆☆

- Counterparty는 SOFR + 40bps의 변동 조달 비용 부담
- SOFR 상승 시 조달 비용 증가 → 순손익 감소

현재 SOFR ~4.3% 가정 시:
- 4개월 조달 비용 ≈ (4.3% + 0.4%) × 120/360 × USD 450M ≈ **USD 6.3M**

---

### 4. 유동성 리스크 (Liquidity Risk) ★★★☆☆

- 바스켓 특정 종목의 거래량 급감 시 JPMorgan 헤지 어려움
- Loss of Stock Borrow / Increased Cost of Stock Borrow 발동 → 조기청산 가능

---

### 5. 신용 리스크 (Counterparty Risk) ★★☆☆☆

- JPMorgan: AA 등급 (Moody's Aa2)
- ISDA CSA에 따른 담보 수수로 노출액 제한
- 무담보 익스포저는 MtM 변동에 따라 변화

---

### 6. 운영 리스크 (Operational Risk) ★★☆☆☆

- 바스켓 제수 조정 오류 위험
- 배당락 일정 처리 오류 위험
- CA = JPMorgan → 검증 불가능한 계산 결과
      `,
      riskRadar: [
        { subject: '주가리스크', value: 5, fullMark: 5 },
        { subject: '환율리스크', value: 4, fullMark: 5 },
        { subject: '유동성리스크', value: 3, fullMark: 5 },
        { subject: '조달금리리스크', value: 3, fullMark: 5 },
        { subject: '신용리스크', value: 2, fullMark: 5 },
        { subject: '운영리스크', value: 2, fullMark: 5 },
      ],
    },

    pnl: {
      title: '손익 분석',
      content: `
## 손익 계산 구조

만기(4개월) 기준 고객 관점 P&L:

$$\\text{P\\&L (\\%)} = \\underbrace{R_{basket}}_{\\text{바스켓 수익률}} - \\underbrace{(r_{SOFR} + 0.40\\%) \\times \\frac{120}{360}}_{\\text{조달 비용 (약 1.57\\%)}}$$

현재 SOFR ≈ 4.30% 가정 시, 4개월 조달 비용 = 4.70% × 120/360 ≈ **1.57%**

## 주요 시나리오

| 시나리오 | 바스켓 수익률 | 조달 비용 | 순 P&L | 절대금액 |
|---------|-------------|---------|--------|---------|
| 강세 (+20%) | +20.0% | -1.57% | **+18.43%** | +USD 83.0M |
| 소폭 상승 (+5%) | +5.0% | -1.57% | **+3.43%** | +USD 15.5M |
| 손익분기 | +1.57% | -1.57% | **0%** | 0 |
| 소폭 하락 (-5%) | -5.0% | -1.57% | **-6.57%** | -USD 29.6M |
| 약세 (-20%) | -20.0% | -1.57% | **-21.57%** | -USD 97.1M |

> 단, 배당 재투자는 Basket Divisor를 통해 Final Price에 이미 반영됩니다.

## 1개월차 중간 결제 (2026-05-07)

1개월 조달 비용 = 4.70% × 30/360 ≈ **0.39%**
→ 손익분기점: 바스켓 수익률 +0.39%
      `,
      xLabel: '바스켓 수익률 (%)',
      yLabel: 'P&L (% of Notional)',
      payoffScenarios: [
        {
          id: 'maturity-4m',
          label: '만기 보유 (4개월, 조달 1.57%)',
          color: '#003087',
          dashed: false,
          data: [
            { spot: -30, payoff: -31.57 },
            { spot: -20, payoff: -21.57 },
            { spot: -10, payoff: -11.57 },
            { spot: -5,  payoff: -6.57  },
            { spot: 0,   payoff: -1.57  },
            { spot: 1.57, payoff: 0     },
            { spot: 5,   payoff: 3.43   },
            { spot: 10,  payoff: 8.43   },
            { spot: 20,  payoff: 18.43  },
            { spot: 30,  payoff: 28.43  },
          ],
        },
        {
          id: 'interim-1m',
          label: '1개월 중간청산 (조달 0.39%)',
          color: '#0066CC',
          dashed: true,
          data: [
            { spot: -30, payoff: -30.39 },
            { spot: -20, payoff: -20.39 },
            { spot: -10, payoff: -10.39 },
            { spot: -5,  payoff: -5.39  },
            { spot: 0,   payoff: -0.39  },
            { spot: 0.39, payoff: 0     },
            { spot: 5,   payoff: 4.61   },
            { spot: 10,  payoff: 9.61   },
            { spot: 20,  payoff: 19.61  },
            { spot: 30,  payoff: 29.61  },
          ],
        },
        {
          id: 'breakeven',
          label: '손익분기선 (0%)',
          color: '#999999',
          dashed: true,
          data: [
            { spot: -30, payoff: 0 },
            { spot: 30,  payoff: 0 },
          ],
        },
      ],
    },

    poison: {
      title: '독소조항 분석',
      content: `
## 박스 스왑의 핵심 독소조항

박스 스왑은 딜러(JPMorgan)가 다수의 일방적 권리를 보유하며, 고객은 시장 불리 상황에서 이미 손실 중인 포지션을 강제 청산당할 수 있습니다.
      `,
      clauses: [
        {
          name: 'Hedging Disruption — 헤징 불능 시 조기청산권',
          level: 'high',
          description:
            'JPMorgan이 합리적 노력에도 불구하고 주식 바스켓 헤지 포지션(실물 매입·차입 포함)을 구축·유지·청산할 수 없거나, 헤지로부터 매출금을 자유롭게 실현·본국 송금할 수 없는 경우 즉시 계약 종료 가능. 정의가 광의로 규정되어 통화 리스크까지 포함. JPMorgan이 헤지 불능 여부를 Determining Party로서 단독 판단.',
        },
        {
          name: 'Loss of Stock Borrow — 주식 차입 불가 시 조기청산권',
          level: 'high',
          description:
            '바스켓 구성 종목에 대해 JPMorgan이 주식 차입을 유지할 수 없게 되는 경우 계약 종료 가능. 한국 주식 시장의 공매도 규제 강화, 수급 변화 시 발동 위험. 고객 입장에서 바스켓 상승 기간 중에도 강제 청산될 수 있음.',
        },
        {
          name: 'Increased Cost of Stock Borrow — 차입 비용 상승 시 조기청산권',
          level: 'high',
          description:
            'Stock Borrow 비용이 특정 기준 초과 시 JPMorgan이 조기청산 또는 비용 전가 선택 가능. 규제 환경 변화, 특정 종목 쏠림 현상 등으로 차입 수수료 급등 시 발동. 고객이 예측·통제 불가.',
        },
        {
          name: 'Determining Party = JPMorgan — 이중 역할 이해충돌',
          level: 'high',
          description:
            'JPMorgan이 Determining Party로서 Hedging Disruption, Change in Law, Increased Cost of Hedging 등 모든 중단 사유 발동 여부를 단독 결정. 고객은 JPMorgan의 판단에 이의 제기 수단이 실질적으로 없음. CA도 JPMorgan이므로 정산금액 계산까지 JPMorgan 일방 지배.',
        },
        {
          name: 'Basket Modification — 일방적 바스켓 구성 변경',
          level: 'high',
          description:
            '어느 일방이 Basket Modification Notice만으로 종목 추가·제거·수량 변경·명목 증감 가능. 상대방 동의 요건 없음. JPMorgan이 헤징에 불리한 종목을 제거하거나 고객 의도와 다른 종목으로 교체 요청 가능. 바스켓 특성 변경으로 투자 전략 훼손 위험.',
        },
        {
          name: 'Change in Law — 광의의 법령 변경 조항',
          level: 'medium',
          description:
            '거래일 이후 법령·규정 변경 또는 해석 변경으로 헤지 포지션 보유가 위법·비용 증가·실질적 불이익이 되는 경우 계약 종료 가능. 세법 변경(세율 인상, 과세 항목 확대 포함)도 해당. 한국 주식 관련 외환·자본시장 규제 변동 위험에 특히 민감.',
        },
        {
          name: 'Increased Cost of Hedging — 헤징 비용 상승 시 조기청산권',
          level: 'medium',
          description:
            '헤지 포지션 유지 비용이 거래일 기준 대비 실질적으로 증가할 경우(세금·관세·부과금 포함) 조기청산 또는 비용 전가 선택 가능. 글로벌 금융 규제 강화(FRTB, UMR 등) 시 자본 비용 증가로 발동 가능.',
        },
        {
          name: 'Applicable Hedge Positions — 헤지포지션 광의 해석',
          level: 'medium',
          description:
            '"Applicable Hedge Positions"의 정의가 광의로 규정되어, 이 거래와 관련해 Hypothetical Broker Dealer가 합리적으로 취할 모든 포지션 포함. JPMorgan이 자신의 헤지 필요성을 광범위하게 해석해 고객에게 비용·종료를 귀속시킬 수 있음.',
        },
      ],
    },

    valuation: {
      title: '평가 방법론',
      content: `
## 1. Gross Price (바스켓 가격) 산출

$$\\text{Gross Price}_t = \\frac{\\sum_{i=1}^{n} \\text{Relevant Price}_{i,t} \\times \\text{Number of Shares}_i}{\\text{Basket Divisor}_t}$$

- $\\text{Relevant Price}_{i,t}$: 각 주식의 당일 공식 종가 (KRW → USD FX 환산)
- FX Rate: Bloomberg 오후 4시(런던) 고시율 (미고시 시 CA 재량 결정)
- $\\text{Basket Divisor}_t$: 배당 이벤트마다 자동 조정

---

## 2. Final Price (최종 가격)

$$\\text{Final Price} = \\text{Gross Price}_{\\text{평가일}} - \\text{Taxation}$$

**Taxation** = 바스켓 종목의 거래소가 미국·캐나다 외 소재인 종목에 대해, 헤지 포지션에 적용될 세금·수수료·기타 공제금. CA(JPMorgan)가 결정.

---

## 3. Equity Amount 산출

$$\\text{Equity Amount} = N_B \\times (P_{final} - P_{initial})$$

- $N_B = 2,815,006$ (바스켓 수, 고정)
- $P_{initial} = \\text{USD } 160.0809$

| Equity Amount | 현금흐름 방향 |
|--------------|-------------|
| > 0 (바스켓 상승) | JPMorgan → 고객 지급 |
| < 0 (바스켓 하락) | 고객 → JPMorgan 지급 |

---

## 4. Floating Amount 산출

$$\\text{Floating Amount} = N_{eq} \\times (r_{SOFR,avg} + 40\\text{bps}) \\times \\frac{t}{360}$$

**SOFR 평균 계산 (Averaging with Lookback):**

$$r_{SOFR,avg} = \\frac{\\sum_{k=1}^{t} r_{SOFR,k-2} \\times d_k}{\\sum_{k=1}^{t} d_k}$$

- 2영업일 후행 관찰: 결제일로부터 2일 전 SOFR 적용
- Simple average (복리 아님)

---

## 5. 배당 재투자 — Basket Divisor 조정

Ex Date마다 Basket Divisor 하향 조정:

$$\\text{BD}_{post} = \\text{BD}_{pre} \\times \\frac{\\text{GP}_{pre,div}}{\\text{GP}_{inc,div}}$$

- $\\text{GP}_{pre,div}$: 배당 반영 후(배당락) Gross Price
- $\\text{GP}_{inc,div}$: 배당 미반영 Gross Price

→ 제수 감소 → 이후 Gross Price 상승 효과 → 배당을 가격에 재투자한 것과 동일

---

## 6. 조기청산 금액

$$\\text{Early Termination Payment} = \\text{Equity Amount}_{ETD} - \\text{Floating Amount}_{ETD}$$

- 평가일이 Early Termination Date로 가속
- CA(JPMorgan)가 금액 및 지급일 결정
- 불리한 시장 상황(주가 하락 + SOFR 상승) 시 고객 이중 손실 가능

---

## 7. MtM 평가

일중 평가:

$$\\text{MtM}_{t} = N_B \\times (\\text{Gross Price}_t - P_{initial}) - \\text{Accrued Floating}_{0 \\to t}$$

담보(IM/VM) 산출은 ISDA SIMM 또는 계약 CSA 규정에 따름.
      `,
    },

    cashflow: {
      title: '현금흐름 조감도',
      content: `
## 박스 스왑 현금흐름 구조

박스 스왑은 **계약 체결 시 초기 현금 교환 없이(언펀디드)** 시작됩니다.
JPMorgan은 내부적으로 바스켓 주식을 실물 매입해 헤지하며, 고객은 합성 익스포저만 보유합니다.

각 평가일마다 Equity Amount와 Floating Amount를 **차감 상계하여 순액 결제**합니다.
      `,
      diagram: {
        parties: [
          {
            id: 'client',
            name: '고객 (카운터파티)',
            role: 'Floating Amount Payer\nSOFR+40bps 지급\n합성 바스켓 롱 포지션 보유',
            type: 'client',
          },
          {
            id: 'jpmorgan',
            name: 'JPMorgan Chase Bank',
            role: 'Equity Amount Payer\n실물 바스켓 헤지 보유\nCA + Determining Party',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'inception',
            label: '① 계약 체결 (Effective Date: 2026-04-09)',
            description:
              '계약 체결 시 초기 현금 교환 없음(Zero Upfront). JPMorgan은 자체적으로 바스켓 주식을 매입하여 헤지 포지션 구축. 고객은 ISDA CSA에 따른 Initial Margin만 납입.',
            arrows: [
              {
                from: 'client',
                to: 'jpmorgan',
                label: 'Initial Margin (CSA)',
                sublabel: '담보 납입 (CSA 규정에 따라)',
                timing: 'upfront',
                type: 'negative',
              },
            ],
          },
          {
            id: 'settlement-gain',
            label: '② 정기결제 — 바스켓 상승 시 (Net Gain)',
            description:
              '평가일 기준 바스켓 수익률이 조달 비용(SOFR+40bps)을 초과하는 경우. JPMorgan이 순액(Equity Amount - Floating Amount)을 고객에게 지급. 결제일은 평가일 T+2 영업일.',
            arrows: [
              {
                from: 'jpmorgan',
                to: 'client',
                label: 'Net Settlement (순 지급)',
                sublabel: 'Equity Amount − Floating Amount > 0',
                timing: 'periodic',
                type: 'positive',
              },
            ],
          },
          {
            id: 'settlement-loss',
            label: '③ 정기결제 — 바스켓 하락 시 (Net Loss)',
            description:
              '바스켓이 하락하거나 조달 비용을 하회하는 경우. 고객이 |Equity Amount| + Floating Amount를 JPMorgan에 지급. 주가 하락 시 조달 비용까지 이중 손실 발생.',
            arrows: [
              {
                from: 'client',
                to: 'jpmorgan',
                label: 'Net Settlement (순 지급)',
                sublabel: '|Equity Amount| + Floating Amount',
                timing: 'periodic',
                type: 'negative',
              },
            ],
          },
          {
            id: 'early-termination',
            label: '④ 조기청산 (Optional Early Termination)',
            description:
              '어느 일방이 Notice Date에 조기청산 통지 가능. Early Termination Date = 첫 번째 평가일로 가속. CA(JPMorgan)가 Early Termination Payment Amount 산출. 바스켓 하락 + 조기청산 독소조항 발동 시 최대 손실.',
            arrows: [
              {
                from: 'jpmorgan',
                to: 'client',
                label: 'Early Termination Payment',
                sublabel: '(바스켓 상승 시)',
                timing: 'early-termination',
                type: 'positive',
              },
              {
                from: 'client',
                to: 'jpmorgan',
                label: 'Early Termination Payment',
                sublabel: '(바스켓 하락 시 — 독소조항 발동)',
                timing: 'early-termination',
                type: 'negative',
              },
            ],
          },
          {
            id: 'maturity',
            label: '⑤ 최종 만기 (2026-08-07 → 결제 2026-08-11)',
            description:
              '최종 평가일(2026-08-07) 기준 Gross Price 확정. T+2인 2026-08-11에 최종 결제. 배당 재투자 효과가 Final Price에 모두 반영된 상태. Equity Amount와 Floating Amount의 차액을 순액으로 결제하여 계약 종료.',
            arrows: [
              {
                from: 'jpmorgan',
                to: 'client',
                label: '최종 순액 결제',
                sublabel: '바스켓 총수익 − 4개월 조달 비용',
                timing: 'maturity',
                type: 'positive',
              },
            ],
          },
        ],
        notes: [
          '배당금은 별도 현금 지급 없이 Basket Divisor 자동 조정을 통해 Final Price에 재투자 반영됨.',
          '명목원금(USD 450,628,693.99)은 실제로 교환되지 않으며, Floating Amount 계산 기준으로만 사용.',
          'Equity Notional Reset: Applicable — 각 평가 후 명목금액이 당시 시장가로 리셋되어 다음 기간 조달 비용 기준이 변경됨.',
          'JPMorgan이 CA 및 Determining Party를 겸임하므로, 독소조항 발동 시 고객 측 이의 제기가 실질적으로 제한됨.',
          'CSA에 따른 변동증거금(VM)은 일간 MtM 변화에 따라 매일 수수될 수 있음.',
        ],
      },
    },
  },
};
