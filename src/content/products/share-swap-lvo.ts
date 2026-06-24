import type { Product } from '@/types/product';

export const shareSwapLvo: Product = {
  id: 'share-swap-lvo',
  name: '주식 스왑 (LvO)',
  fullName: 'Listed vs OTC 주식 스왑 (Share Swap — LvO)',
  categoryId: 'equity',
  tags: [
    'LvO', 'Listed vs OTC', '주식스왑', '삼성전자', '선물결제가격',
    'KRX선물', '합성숏', '공매도대체', 'Price Return', '신한투자증권',
  ],
  difficulty: 3,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## LvO란 무엇인가?

**LvO(Listed vs OTC)**는 **장내(Listed) 파생상품의 공식결제가격(Official Settlement Price)을 참조하여 정산하는 장외(OTC) 스왑**입니다.

일반적인 OTC 주식 스왑이 현물 주가를 참조하는 것과 달리, LvO는 KRX(한국거래소)에 상장된 **선물 또는 옵션 계약의 최종결제가격**을 Final Price로 사용합니다. 이 결제가격 연계가 "Listed vs OTC"라는 이름의 근거입니다.

### LvO 활용 목적

| 목적 | 내용 |
|------|------|
| **합성 숏 포지션** | KRX 현물 공매도 규제를 우회하여 OTC 스왑으로 동일한 숏 익스포저 확보 |
| **포지션 전환** | 장내 선물 포지션을 OTC로 전환(장내 포지션과 상쇄) — 시장 충격 없이 익스포저 이전 |
| **자본 효율** | OTC 포지션은 ISDA/CSA 네팅(netting) 적용으로 다른 OTC 포지션과 상계 가능 |
| **헤지 전달** | 복잡한 구조화 상품 헤지를 딜러(JPMorgan)로 전가 |

---

## 실제 거래 개요 (J.P.Morgan Draft Confirmation 기준)

| 항목 | 내용 |
|------|------|
| **거래 상대방** | JPMorgan Chase Bank, N.A. (London Branch) |
| **카운터파티** | 신한투자증권 (Shinhan Securities) |
| **거래일 / 효력발생일** | 2026년 5월 12일 |
| **기초자산** | 삼성전자 (Samsung Electronics Co Ltd, Bloomberg: 005930 KS Equity) |
| **거래소** | 한국거래소 (Korea Stock Exchange / KRX) |
| **Exchange-traded Contract** | 삼성전자 선물 (2026년 6월물, 선물 없을 시 옵션) |
| **Number of Contracts** | 94,470 계약 |
| **Multiplier** | 10 (계약당 주식 10주) |
| **Initial Price** | KRW 284,944 |
| **Equity Notional Amount** | KRW 269,186,596,800 (= 284,944 × 94,470 × 10) |
| **Equity Amount Payer** | 카운터파티(신한투자증권) → **숏 포지션** |
| **Fixed Amount Payer** | JPMorgan (Fixed Rate: 0bp) |
| **수익 유형(Type of Return)** | Price Return (배당 미반영) |
| **Equity Notional Reset** | Not Applicable |
| **결제** | Cash, USD (USDKRW 환율 적용) |

---

## 일반 주식 스왑과의 핵심 차이

| 항목 | 일반 OTC 주식 스왑 | LvO 주식 스왑 |
|------|------------------|------------|
| **Final Price 기준** | 주식 현물 종가 | 선물/옵션 **공식결제가격** |
| **만기 결정** | 당사자 합의 | 선물 계약 만기에 연동 |
| **배당 처리** | Total Return or Price Return | Price Return 전용 (선물가격에 반영) |
| **공매도 대체** | 제한적 | 핵심 활용 목적 |
| **Early Termination 가격** | MtM 산출 | FPV HBD Price (헤지 청산 가격) |

---

## 손익 핵심 요약

$$\\text{Equity Amount} = (P_{\\text{Final}} - P_{\\text{Initial}}) \\times N_{\\text{contracts}} \\times \\text{Multiplier}$$

$$= (P_{\\text{Final}} - 284{,}944) \\times 94{,}470 \\times 10$$

- **양수 시:** 카운터파티(신한) → JPMorgan 지급 (**숏 포지션 손실**)
- **음수 시:** JPMorgan → 카운터파티 지급 (**숏 포지션 이익**)
- **Fixed Amount(JPMorgan 지급):** 0bp → 0원 (금리 교환 없음)
      `,
    },

    structure: {
      title: '상품 구조',
      content: `
## 1. LvO 구조의 핵심 — 선물 공식결제가격 참조

### Official Settlement Price (공식결제가격)

$$P_{\\text{Final}} = \\text{Contract Exchange(KRX)가 공표하는 Exchange-traded Contract의 공식결제가격}$$

- 선물 만기일에 KRX 또는 청산소가 발표하는 최종 결제 가격
- 세금·수수료·기타 공제액 순(Net) 기준
- **현물 주가(Spot Price)가 아님** — 선물 만기 시 선물가격과 현물가격은 수렴하나 당일 시장 조건에 따라 미세하게 다를 수 있음

### Non-Commencement / Discontinuance 조항

선물 계약이 거래되지 않거나 중단된 경우:
- Valuation Date 당일 종가(Exchange 종료 시 주당 공식 종가)를 Official Settlement Price로 간주
- F&O Disrupted Day 발생 시 Section 6.6의 규정 적용

---

## 2. Equity Amount (주식 레그)

$$\\text{Equity Amount} = (P_{\\text{Final}} - P_{\\text{Initial}}) \\times N_{\\text{contracts}} \\times \\text{Multiplier}$$

**실제 거래 파라미터:**

| 항목 | 값 |
|------|---|
| Initial Price | KRW 284,944 |
| Number of Contracts | 94,470 계약 |
| Multiplier | 10 |
| Equity Notional Amount | KRW 269,186,596,800 |

**Equity Amount Payer: 카운터파티(신한투자증권)**

- Equity Amount > 0 → 신한이 JPMorgan에게 지급 (선물 상승 = 숏 손실)
- Equity Amount < 0 → JPMorgan이 신한에게 지급 (선물 하락 = 숏 이익)

---

## 3. Fixed Amount (고정 레그)

$$\\text{Fixed Amount} = \\text{Equity Notional Amount} \\times \\text{Fixed Rate} = \\text{KRW}\\ 269{,}186{,}596{,}800 \\times 0\\text{bp} = 0$$

**Fixed Amount Payer: JPMorgan**

- Fixed Rate: **0bps** → JPMorgan의 현금 지급 없음
- Payment Date: Termination Date (선물 만기일 기준 결제일)
- 별도의 금리 교환 없이 순수 주가 변동 익스포저만 교환

> Fixed Rate 0bp의 의미: 일반적인 주식 스왑은 SOFR 등 금리를 주고받지만, LvO는 선물가격을 Final Price로 사용하므로 금리(자금조달 비용)가 이미 선물가격에 내재되어 있음(선물 이론가 = 현물 + 금리 - 배당). 별도 금리 교환 불필요.

---

## 4. Type of Return: Price Return (배당 미반영)

- Total Return이 아닌 **Price Return**: 배당이 별도로 지급·수취되지 않음
- 이유: 선물가격 = 현물가격 + 금리 − 배당 (비용이월 공식). 배당은 이미 선물 이론가에 반영되어 있으므로 OTC 스왑에서 별도 처리 불필요

---

## 5. Early Termination — FPV 가격 적용

조기종결 시(Early Termination Date = final Valuation Date로 간주):

$$P_{\\text{Final}} = \\text{FPV HBD Price}$$

**FPV HBD Price:** Hypothetical Broker Dealer가 FPV Final Execution Period(최종 Valuation Date부터 헤지 완전 해소 시점까지) 동안 Applicable Hedge Position을 실제로 청산·종결할 때 받게 될 가격 (세금·수수료 차감 후, JPMorgan이 산출)

→ 시장 충격이 반영된 **실제 청산 가격**이므로 이론가 대비 불리할 수 있음

---

## 6. 결제 구조

| 항목 | 내용 |
|------|------|
| 결제 통화 | USD |
| Settlement FX Rate | Valuation Date 다음 1 Currency Business Day의 USDKRW |
| FX Rate 기준 | Reuters Screen KFTC18 Page (서울 오후 2:30 기준) |
| Cash Settlement Payment Date | Valuation Date 후 3 Currency Business Days (서울+뉴욕) |
| Independent Amount | Equity Notional Amount의 [X]% (Trade Date 후 2 Currency Business Days 이내 JPMorgan에 납부) |

**USD 결제 환산:**

$$\\text{Settlement Amount (USD)} = \\text{Equity Amount (KRW)} \\div \\text{USDKRW}_{\\text{T+1}}$$
      `,
    },

    risk: {
      title: '리스크 분석',
      content: `
## 리스크 유형별 분석

### 1. 삼성전자 선물 가격 리스크 ★★★★★

카운터파티(신한)는 삼성전자 KRX 선물 가격에 **1:1 선형 반비례 노출(숏 포지션)**:

$$\\Delta \\text{P\\&L} = -(\\Delta P_{\\text{선물}}) \\times 94{,}470 \\times 10 = -\\Delta P_{\\text{선물}} \\times 944{,}700 \\text{ (KRW)}$$

- 선물 가격 1% 상승 → 약 KRW 26.9억 손실
- 선물 가격 1% 하락 → 약 KRW 26.9억 이익
- **레버리지 없음**, 그러나 손실 무제한 이론상 가능 (주가 무한 상승 시)

---

### 2. FX 리스크 (KRW/USD) ★★★★☆

Equity Amount는 KRW로 산출되나 USD로 결제:

$$\\text{USD 수취/지급} = \\text{Equity Amount (KRW)} \\div \\text{USDKRW}_{\\text{T+1}}$$

- KRW 강세(달러 약세): 동일 KRW 이익이 더 많은 USD로 환산
- KRW 약세(달러 강세): 동일 KRW 이익이 적은 USD로 환산
- 결제 FX Rate는 Valuation Date 다음날 결정 → overnight 환율 변동 노출

---

### 3. 공매도 제한 리스크 (KRX 과열종목) ★★★☆☆

Hedging Disruption 조항에 **"삼성전자 주식의 과열공매도종목 지정(overheated short-selling stock designation by Korea Exchange)"** 명시:

- KRX가 삼성전자를 공매도 과열종목으로 지정 시 → JPMorgan의 헤지(합성 차입 포함) 불가
- Hedging Disruption 발생 → JPMorgan이 계약 조정 또는 조기종결 가능
- 조기종결 시 FPV HBD Price 기준으로 정산 → 불리한 가격 위험

---

### 4. FPV 가격 산출 리스크 ★★★☆☆

조기종결 또는 최종 Valuation Date에 FPV HBD Price 사용:

- **FPV Final Execution Period**: JPMorgan이 헤지를 마지막으로 청산하는 기간 (하루 이상 가능)
- 대규모 포지션(약 94,470계약)의 청산은 시장 충격(market impact) 발생
- JPMorgan이 Calculation Agent로서 FPV 가격 결정 → 이해충돌 내재
- 이론가 대비 불리한 가격으로 정산될 수 있음

---

### 5. 선물 계약 비개시/중단 리스크 ★★☆☆☆

Exchange-traded Contract(삼성전자 6월물 선물/옵션)가:
- **거래 시작 안 함(Non-Commencement)** 또는
- **도중 중단(Discontinuance)**

→ Final Price = 해당 Valuation Date의 Exchange 종가(현물가격)로 대체
→ 선물·현물 괴리 발생 시 예상치 못한 손익 변동

---

### 6. 신용 리스크 ★★☆☆☆

- OTC 거래 → 청산소(CCP) 없는 양자 계약
- Independent Amount(초기 증거금)를 카운터파티가 JPMorgan에 예탁 → JPMorgan 부도 시 회수 위험
- 반대로 JPMorgan 입장에서도 카운터파티(신한) 부도 리스크 관리를 위해 Independent Amount 수취
      `,
      riskRadar: [
        { subject: '주가(선물)리스크', value: 5, fullMark: 5 },
        { subject: 'FX리스크',       value: 4, fullMark: 5 },
        { subject: '공매도제한리스크', value: 3, fullMark: 5 },
        { subject: 'FPV가격리스크',   value: 3, fullMark: 5 },
        { subject: '선물만기리스크',   value: 2, fullMark: 5 },
        { subject: '신용리스크',      value: 2, fullMark: 5 },
      ],
    },

    pnl: {
      title: '손익 분석',
      content: `
## 카운터파티(신한증권) 손익 구조

LvO는 **선형(Linear) 숏 페이오프** 구조입니다. Fixed Rate = 0bp이므로 금리 교환 없이 순수한 주가 변동만 반영:

$$\\text{Net P\\&L (카운터파티)} = -(P_{\\text{Final}} - P_{\\text{Initial}}) \\times N_{\\text{contracts}} \\times \\text{Multiplier}$$

$$= -(P_{\\text{Final}} - 284{,}944) \\times 944{,}700$$

---

## 시나리오 분석

| 삼성전자 선물 수익률 | Final Price (KRW) | Equity Amount | 카운터파티 손익 |
|-------------------|------------------|--------------|--------------|
| **+30%** | 370,427 | +KRW 80.7억 | **−KRW 80.7억** |
| **+20%** | 341,933 | +KRW 53.8억 | **−KRW 53.8억** |
| **+10%** | 313,438 | +KRW 26.9억 | **−KRW 26.9억** |
| **0% (손익분기)** | 284,944 | 0 | **0** |
| **−10%** | 256,450 | −KRW 26.9억 | **+KRW 26.9억** |
| **−20%** | 227,955 | −KRW 53.8억 | **+KRW 53.8억** |
| **−30%** | 199,461 | −KRW 80.7억 | **+KRW 80.7억** |

> Equity Amount 절댓값 = |Final Price − 284,944| × 944,700

---

## 손익분기점

$$P_{\\text{Final}} = P_{\\text{Initial}} = \\text{KRW}\\ 284{,}944$$

Fixed Rate = 0bp이므로 금리 비용 없음 → 손익분기 = 초기 선물가격 그 자체

---

## LvO vs 직접 선물 숏의 비교

| 항목 | KRX 선물 직접 숏 | LvO OTC 스왑 |
|------|----------------|------------|
| 증거금 | KRX 개시증거금 (선물 정해진 요율) | Independent Amount (합의) |
| 공매도 규제 | 과열종목 지정 시 직접 제한 | OTC 스왑으로 우회 가능 (단, 헤지 불능 시 종결) |
| 결제 통화 | KRW | USD (FX 전환) |
| 만기 유연성 | 계약 만기 고정 | 동일하게 선물 만기에 연동, 단 Early Termination 옵션 있음 |
| 정산 가격 | 동일 Official Settlement Price | 동일 Official Settlement Price |
| ISDA 네팅 | 불가 | 가능 (다른 OTC 포지션과 상계) |
      `,
      xLabel: '삼성전자 선물 수익률 (%)',
      yLabel: '카운터파티 순손익 (% of Notional)',
      payoffScenarios: [
        {
          id: 'counterparty-short',
          label: '카운터파티 (숏 포지션, Equity Amount Payer)',
          color: '#003087',
          dashed: false,
          data: [
            { spot: -40, payoff: 40 },
            { spot: -30, payoff: 30 },
            { spot: -20, payoff: 20 },
            { spot: -10, payoff: 10 },
            { spot: 0,   payoff: 0  },
            { spot: 10,  payoff: -10 },
            { spot: 20,  payoff: -20 },
            { spot: 30,  payoff: -30 },
            { spot: 40,  payoff: -40 },
          ],
        },
        {
          id: 'jpmorgan-long',
          label: 'JPMorgan (롱 포지션, Fixed Amount Payer)',
          color: '#CC0000',
          dashed: true,
          data: [
            { spot: -40, payoff: -40 },
            { spot: -30, payoff: -30 },
            { spot: -20, payoff: -20 },
            { spot: -10, payoff: -10 },
            { spot: 0,   payoff: 0   },
            { spot: 10,  payoff: 10  },
            { spot: 20,  payoff: 20  },
            { spot: 30,  payoff: 30  },
            { spot: 40,  payoff: 40  },
          ],
        },
      ],
    },

    poison: {
      title: '독소조항 분석',
      content: `
## LvO 주식 스왑의 주요 위험 조항

LvO는 구조 자체가 단순(선형 숏)하지만, 선물 연동 구조와 JPMorgan의 일방적 권한에서 비롯된 독소조항이 다수 내재되어 있습니다.
      `,
      clauses: [
        {
          name: 'Calculation Agent = JPMorgan — FPV 가격 결정 독점',
          level: 'high',
          description:
            'Official Settlement Price 확인, FPV HBD Price 산출, Adjustment 결정 모두 JPMorgan이 단독 수행. 특히 조기종결 시 적용되는 FPV HBD Price는 "Hypothetical Broker Dealer가 헤지를 실제로 청산할 때 받을 가격"으로 정의되는데, 이 청산 활동 자체를 JPMorgan이 통제하고 가격도 JPMorgan이 결정함. 카운터파티는 이 가격에 독립적으로 이의를 제기할 수단이 없음.',
        },
        {
          name: 'FPV Final Execution Period — 시장 충격 비용 전가',
          level: 'high',
          description:
            '조기종결 시 Final Price = FPV HBD Price. 이 가격은 JPMorgan이 94,470계약(약 KRW 2,692억 규모)을 실제로 청산하는 기간 동안의 체결가격 기준으로 결정됨. 대규모 포지션 청산에 따른 시장 충격(market impact), 슬리피지, 수수료·세금 모두 차감. 카운터파티 입장에서는 이 기간이 길어질수록, 시장이 불안정할수록 불리한 가격에 정산될 가능성 증가. 이론가(MtM) 대비 큰 괴리 가능.',
        },
        {
          name: '공매도 과열종목 지정 → 즉시 종결 가능 (Hedging Disruption)',
          level: 'high',
          description:
            '한국거래소가 삼성전자를 "공매도 과열종목(overheated short-selling stock)"으로 지정하면 JPMorgan의 합성 헤지(차입 포함)가 불가능해짐 → Hedging Disruption 발생 → JPMorgan이 일방적으로 계약 조정 또는 조기종결 가능. 정확히 시장 변동성이 극대화되는 시점(공매도 규제가 발동되는 급락기)에 카운터파티의 숏 포지션이 강제 종결될 수 있는 역설적 구조.',
        },
        {
          name: 'Independent Amount — 거래 개시 시 증거금 선납',
          level: 'medium',
          description:
            'Counterparty는 Trade Date 후 2 Currency Business Days 이내에 Equity Notional Amount(KRW 2,692억)의 [X]%를 Independent Amount로 JPMorgan에게 선납. 이 금액은 JPMorgan 장부에서 카운터파티의 신용 노출을 담보하며, JPMorgan 도산 시 회수에 불확실성 발생 (ISDA CSA 규정에 따른 환수권, 단 파산 절차 지연 위험). 비율은 계약상 미기재([X])로 실제 거래 시 협상 대상.',
        },
        {
          name: 'Exchange-traded Contract 조항 변경 → Calculation Agent 임의 조정',
          level: 'medium',
          description:
            'KRX가 선물 계약 조건(만기, Multiplier, 결제 방식 등)을 변경하면 JPMorgan이 Initial Price 등 거래 조건을 일방적으로 조정 가능. 특히 KRX가 삼성전자 선물 Multiplier를 10에서 다른 숫자로 변경하거나 결제 방식을 바꿀 경우, 조정 내용을 JPMorgan이 결정하며 카운터파티는 수용 여부를 선택할 수 없음.',
        },
        {
          name: 'No Rights to Shares — 주식 관련 권리 전면 배제',
          level: 'medium',
          description:
            '카운터파티는 이 거래로 인해 삼성전자 주식에 대한 어떠한 법적·형평법적 권리도 취득하지 않음. 의결권, 배당수령권, 주주로서의 기타 권리 전혀 없음. JPMorgan이 헤지 목적으로 주식을 보유하더라도 카운터파티에게 통보·협의 의무 없음. 계약은 순수한 금전 지급 의무만 창출.',
        },
      ],
    },

    valuation: {
      title: '평가 방법론',
      content: `
## 1. Final Price — Official Settlement Price

$$P_{\\text{Final}} = \\text{KRX (또는 청산소)가 공표하는 삼성전자 선물/옵션 최종결제가격}$$

- 세금·수수료·기타 공제액 차감 후 순(Net) 금액
- Applicable Hedge Positions 기준의 공제를 Calculation Agent(JPMorgan)가 판단
- **Futures Price Valuation**: 2002 ISDA Equity Definitions Section 6.8 준용 (단 "Index/an Index" → "Share/a Share"로 대체)

**선물 이론가 (참고):**

$$F_{t,T} = S_t \\times e^{(r - q)(T-t)}$$

- $S_t$: 현물 주가, $r$: 무위험 금리, $q$: 배당 수익률, $T-t$: 잔존 만기

→ LvO는 이 선물 이론가가 아닌 **실제 KRX 공표 공식결제가격**을 사용

---

## 2. Equity Amount 산출

$$\\text{Equity Amount} = (P_{\\text{Final}} - P_{\\text{Initial}}) \\times 94{,}470 \\times 10$$

$$= (P_{\\text{Final}} - 284{,}944) \\times 944{,}700 \\quad [\\text{KRW}]$$

---

## 3. USD 결제 환산

$$\\text{Settlement Amount (USD)} = \\frac{\\text{Equity Amount (KRW)}}{\\text{USDKRW}_{\\text{FX}}}$$

- $\\text{USDKRW}_{\\text{FX}}$: Valuation Date 다음 1 Currency Business Day의 Reuters KFTC18 환율
- 서울 오후 2:30 기준 고시 환율
- 양 당사자 합의 시 대체 환율 사용 가능

---

## 4. FPV HBD Price (조기종결 시 Final Price)

$$P_{\\text{FPV}} = \\text{Hypothetical Broker Dealer의 헤지 청산 평균 체결가}$$

**FPV Final Execution Period 정의:**
- 시작: final Valuation Date (Early Termination Date)
- 종료: Hypothetical Broker Dealer가 Applicable Hedge Positions 마지막 거래를 체결하는 Exchange Business Day

**산출 방식:**
- JPMorgan이 VWAP(거래량 가중 평균가) 또는 실제 체결 기록 기반으로 산출
- 세금·수수료·제반 비용 차감 후 순(Net) 가격
- 대규모 포지션 청산에 따른 시장 충격 포함

---

## 5. Mark-to-Market (MtM) 평가

거래 중간 시점의 공정가치:

$$\\text{MtM}_{t} = (F_{t,T} - P_{\\text{Initial}}) \\times 944{,}700 \\div \\text{USDKRW}_t$$

- $F_{t,T}$: 평가 시점의 삼성전자 $T$월물 선물 시장가격
- JPMorgan 관점 Long MtM, Shinhan 관점 Short MtM (부호 반전)
- Daily P&L = (F_t − F_{t-1}) × 944,700 ÷ USDKRW_t (선물 델타 기준)

---

## 6. F&O Market Disruption 판정

다음 이벤트 발생 시 F&O Market Disruption Event로 판정:

| 이벤트 | 정의 |
|--------|------|
| Trading Disruption | 삼성전자 선물/옵션 거래 중단 |
| Exchange Disruption | 관련 거래소의 결제·청산 중단 |
| Early Closure | Valuation Time 전 거래소 조기 폐장 |

Valuation Time 전 1시간 내 위 사건이 발생하면 Disrupted Day로 처리 → 다음 비-교란 영업일로 Valuation Date 연기
      `,
    },

    cashflow: {
      title: '현금흐름 조감도',
      content: `
## LvO 주식 스왑 현금흐름 구조

LvO는 **단일 결제** 구조입니다. 중간 현금흐름 없이 선물 만기일(Termination Date)에 한 번 Equity Amount만 정산합니다. Fixed Amount = 0이므로 순수하게 삼성전자 선물 가격 변동분만 교환.
      `,
      diagram: {
        parties: [
          {
            id: 'shinhan',
            name: '신한투자증권\n(카운터파티)',
            role: '삼성전자 선물 숏 포지션 (OTC)\nEquity Amount Payer\nIndependent Amount 납부 (초기 증거금)',
            type: 'client',
          },
          {
            id: 'jpmorgan',
            name: 'JPMorgan\n(Calculation Agent)',
            role: '삼성전자 선물 롱 포지션 (OTC)\nFixed Amount Payer (0bp)\n현물/선물 델타 헤지 운용',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'initiation',
            label: '① 거래 개시 (Effective Date: 2026-05-12)',
            description:
              '원금 교환 없음. 카운터파티(신한)가 Independent Amount([X]% of KRW 2,692억)를 JPMorgan에게 Trade Date 후 2 Currency Business Days 이내 납부. 이는 신용 담보 성격. JPMorgan은 삼성전자 현물 또는 6월물 선물 매입으로 롱 헤지 포지션 구축. Exchange-traded Contract = 삼성전자 2026년 6월물 선물(005930 KS Equity, KRX).',
            arrows: [
              {
                from: 'shinhan',
                to: 'jpmorgan',
                label: 'Independent Amount',
                sublabel: 'Equity Notional의 [X]% (초기 증거금, Trade Date+2일)',
                timing: 'upfront',
                type: 'negative',
              },
            ],
          },
          {
            id: 'settlement-up',
            label: '② 만기 결제 — 선물 상승 시 (Termination Date)',
            description:
              '선물 Official Settlement Price > Initial Price(284,944원): Equity Amount 양수 → 카운터파티(신한)가 JPMorgan에게 지급. 숏 포지션 손실. Equity Amount = (P_Final - 284,944) × 944,700 KRW → USD 환산 후 3 Currency Business Days 이내 결제.',
            arrows: [
              {
                from: 'shinhan',
                to: 'jpmorgan',
                label: 'Equity Amount (양수)',
                sublabel: '= (Final Price − 284,944) × 944,700 KRW → USD',
                timing: 'maturity',
                type: 'negative',
              },
            ],
          },
          {
            id: 'settlement-down',
            label: '③ 만기 결제 — 선물 하락 시 (Termination Date)',
            description:
              '선물 Official Settlement Price < Initial Price(284,944원): Equity Amount 음수 → JPMorgan이 카운터파티(신한)에게 절댓값 지급. 숏 포지션 이익. Fixed Amount = 0이므로 별도 지급 없음. 동일하게 USD로 환산 후 3 Currency Business Days 이내 결제.',
            arrows: [
              {
                from: 'jpmorgan',
                to: 'shinhan',
                label: '|Equity Amount| (음수의 절댓값)',
                sublabel: '= (284,944 − Final Price) × 944,700 KRW → USD',
                timing: 'maturity',
                type: 'positive',
              },
            ],
          },
          {
            id: 'early-termination',
            label: '④ Optional Early Termination (조기종결, 합의 시)',
            description:
              '조기종결은 양 당사자 상호 동의(mutual consent)가 필요함 — 일방 단독 행사 불가. 조기종결 시 Early Termination Date = final Valuation Date로 간주. Final Price = FPV HBD Price(Hypothetical Broker Dealer가 해당 기간 동안 헤지를 실제 청산하는 가격). JPMorgan이 FPV 가격 산출 → 시장 충격 반영으로 이론가 대비 불리할 수 있음.',
            arrows: [
              {
                from: 'jpmorgan',
                to: 'shinhan',
                label: 'Early Termination Payment',
                sublabel: 'FPV HBD Price 기준 산출 (시장 충격 포함)',
                timing: 'early-termination',
                type: 'neutral',
              },
            ],
          },
        ],
        notes: [
          '거래 개시 원금 교환 없음 — Independent Amount만 카운터파티가 JPMorgan에 선납.',
          'Fixed Amount = 0 (0bp) → 금리 교환 없음. 선물 이론가에 금리·배당이 내재되어 있기 때문.',
          'Type of Return = Price Return → 배당 별도 정산 없음.',
          '결제 통화: USD. Equity Amount(KRW)를 Valuation Date T+1일의 Reuters KFTC18 USDKRW로 환산.',
          '공식결제가격(Official Settlement Price): KRX 또는 청산소가 선물 만기 시 공표하는 최종결제가격 기준.',
          '조기종결: 양 당사자 합의 필요 (단, Hedging Disruption 등 Additional Disruption Event 발생 시 JPMorgan 일방 종결 가능).',
        ],
      },
    },
  },
};
