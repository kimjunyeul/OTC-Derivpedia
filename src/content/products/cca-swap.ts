import type { Product } from '@/types/product';

export const ccaSwap: Product = {
  id: 'cca-swap',
  name: 'CCA 탄소배출권 스왑',
  fullName: 'California Carbon Allowance Linked Swap (탄소배출권 연계 스왑)',
  categoryId: 'commodity',
  tags: [
    'CCA', '탄소배출권', '캘리포니아', 'ESG', 'cap-and-trade', '탄소시장',
    'CARB', 'RBC', '현물-선물 기저', '상품스왑', 'ICE', 'CME', 'ISDA',
  ],
  difficulty: 5,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

CCA(California Carbon Allowance) 스왑은 **캘리포니아 탄소배출권의 현물-선물 기저(Basis) 변화를 기초자산으로 하는 장외 상품 스왑**입니다.

캘리포니아 대기자원청(CARB)이 운영하는 cap-and-trade 프로그램(AB 32, California Health and Safety Code Division 25.5)에서 발행되는 CCA 한 단위는 **1 metric tonne CO₂ 배출권**을 의미합니다.

본 거래는 **합성 CCA 현물 수익률(Spot Return)**과 **CCA 12월 만기 선물 수익률(Forward Return)**의 차이인 **Spread Value**를 기초자산으로 하며, 고정금리와 교환하는 구조입니다.

## 실제 거래 개요 (RBC ↔ 신한투자증권)

| 항목 | 내용 |
|------|------|
| **딜러(Party A)** | Royal Bank of Canada, London Branch |
| **고객(Party B)** | 신한투자증권 (Shinhan Securities Co., Ltd.) |
| **명목금액** | USD 25,000,000 |
| **거래일** | 2026년 4월 21일 |
| **효력발생일** | 2026년 4월 22일 |
| **종료일** | 2026년 12월 30일 |
| **최종 가격결정일** | 2026년 12월 24일 |
| **법적 기반** | ISDA Master Agreement + 2005 ISDA Commodity Definitions + Environmental Allowance Annex |

## 거래 구조 요약

| 레그 | 지급자 | 금액 |
|------|--------|------|
| **고정 레그** | 신한투자증권 (Party B) | Notional × **3.6906%** (Day Count 1/1) |
| **변동 레그** | RBC (Party A) | Notional × **Spread Value** |

$$\\text{Spread Value} = \\text{Spot Return} - \\text{Forward Return}$$

- Spot Return = (CCA 합성현물 수익률)
- Forward Return = (CCA Dec2026 선물 수익률)

## CCA 시장 배경

| 항목 | 내용 |
|------|------|
| **운영기관** | California Air Resources Board (CARB) |
| **CCA Spot Initial** | USD 28.12 / metric tonne |
| **CCA Dec26 Futures Initial** | USD 29.20 / metric tonne |
| **초기 콘탱고(Contango)** | $1.08 → 약 +3.84% 기저 프리미엄 |
| **가격 소스** | IFE-ICE Futures US Energy |
| **고시 기관** | CME (Chicago Mercantile Exchange) |
| **Bloomberg 코드** | KBCZ26 Comdty (Dec 2026 기준) |

## 투자 경제적 의미

신한투자증권은 고정금리(3.6906%)를 지급하고 CCA **현물-선물 기저 수렴을 수취**합니다.
초기 콘탱고(~3.84%)가 만기까지 그대로 수렴하면 고정금리를 약 +0.15%p 초과하는 수익 가능.
단, 기저 역전·규제 변화·시장 교란 시 손실 발생.
      `,
    },

    structure: {
      title: '상품 구조',
      content: `
## 두 레그 구조

### Party B (신한투자증권) 지급 — 고정 레그

$$\\text{Party B 지급액} = \\text{명목금액} \\times 3.6906\\%$$

- Day Count: **1/1** (전체 기간에 대해 고정금리 일시 적용)
- Payment Date: 종료일(2026-12-30)

---

### Party A (RBC) 지급 — 변동 레그 (CCA 기저 수익)

$$\\text{Party A 지급액} = \\text{명목금액} \\times \\text{Spread Value}$$

- Spread Value > 0 → RBC → 신한 지급
- Spread Value < 0 → 신한 → RBC 지급 (|Spread Value| 절댓값)
- Payment Date: 종료일(2026-12-30)

---

## Spread Value 산출 구조

$$\\text{Spread Value} = \\text{Spot Return}_{Final} - \\text{Forward Return}_{Final}$$

### Spot Return (합성 CCA 현물 수익률)

$$\\text{Spot Return}(d) = \\frac{\\text{CCA Spot Final}(d) - \\text{CCA Spot Initial}}{\\text{CCA Spot Initial}}$$

- CCA Spot Initial = **USD 28.12** / tonne
- CCA Spot Final$(d)$ = CCA First Nearby Future$(d)$ − Slope$(d)$

### Forward Return (CCA Dec26 선물 수익률)

$$\\text{Forward Return} = \\frac{\\text{CCA Dec26 Futures Final} - \\text{CCA Dec26 Futures Initial}}{\\text{CCA Spot Initial}}$$

- CCA Dec26 Futures Initial = **USD 29.20** / tonne
- CCA Dec26 Futures Final = 최종 가격결정일(2026-12-24) CCA Dec2026 선물 결제가격

---

## 합성 현물(Synthetic Spot) 산출 — Slope 보간

CCA는 실물 현물 시장이 없으므로, 인근 두 선물 계약의 **선형 보간(Linear Interpolation)**으로 합성 현물 가격을 산출합니다.

$$\\text{CCA Spot Final}(d) = \\text{CCA 1st Nearby Future}(d) - \\text{Slope}(d)$$

$$\\text{Slope}(d) = \\frac{\\text{CCA 2nd Nearby} - \\text{CCA 1st Nearby}}{\\text{Days First Second Future}(d)} \\times \\text{Days First Actual Future}(d)$$

| 변수 | 정의 |
|------|------|
| CCA 1st Nearby Future | 해당일 기준 최근월 CCA 선물 가격 |
| CCA 2nd Nearby Future | 그 다음 만기 CCA 선물 가격 |
| Days First Second Future | 1st 만기일 → 2nd 만기일 사이 일수 |
| Days First Actual Future | 해당일 → 1st 만기일 사이 일수 |

→ 이는 캘린더 스프레드에서 **시간 비례 부분을 차감**하여 가상 현물 가격 산출

---

## CCA 선물 참조 계약 목록 (Bloomberg)

| 계약 | Bloomberg 코드 | 만기일 |
|------|--------------|--------|
| CCA Apr 2026 | KBCJ26 Comdty | 2026-04-27 |
| CCA May 2026 | KBCK26 Comdty | 2026-05-26 |
| CCA Jun 2026 | KBCM26 Comdty | 2026-06-25 |
| CCA Jul 2026 | KBCN26 Comdty | 2026-07-28 |
| CCA Aug 2026 | KBCQ26 Comdty | 2026-08-26 |
| CCA Sep 2026 | KBCU26 Comdty | 2026-09-25 |
| CCA Oct 2026 | KBCV26 Comdty | 2026-10-27 |
| CCA Nov 2026 | KBCX26 Comdty | 2026-11-24 |
| CCA **Dec 2026** | **KBCZ26 Comdty** | **2026-12-24** |

---

## 만기 수렴 메커니즘

최종 가격결정일(2026-12-24)은 CCA Dec2026 선물 최종 결제일입니다.
이 시점에서 1st Nearby Future = CCA Dec2026 → Slope ≈ 0 → **합성 현물 ≈ Dec26 선물**

따라서 만기 시:
$$\\text{Spread Value}_{\\text{만기}} \\approx \\frac{\\$29.20 - \\$28.12}{\\$28.12} \\approx 3.84\\%$$

→ 자연수렴 기대 Spread Value(~3.84%) > 고정금리(3.6906%) → 신한 기대 순이익 **~+0.15%**

---

## 조기청산 (Optional Early Termination, OET)

**행사 주체:** 신한투자증권(Party B)만 행사 가능

$$\\text{OET Party B 지급} = \\text{OET 명목금액} \\times 5.2723\\% \\times \\frac{\\text{Act}}{360}$$

$$\\text{OET Party A 지급} = \\text{OET 명목금액} \\times (\\text{Spot Return}_{OET} - \\text{Forward Return}_{OET} - \\text{Unwinding Costs})$$

- OET Fixed Rate: **5.2723%** (일반 고정금리 3.6906%보다 높음 → 조기청산 패널티)
- Unwinding Costs: 헤지 해소 비용·bid-offer·조달금리 변화 등 RBC 단독 산정
      `,
    },

    risk: {
      title: '리스크 분석',
      content: `
## 리스크 유형별 분석

### 1. 규제·정책 리스크 ★★★★★

CCA의 가장 고유한 리스크. CARB(캘리포니아 대기자원청)의 정책 결정에 의해 가격이 완전히 좌우됩니다.

- **Abandonment of Scheme:** 캘리포니아 cap-and-trade 프로그램 자체 폐지 또는 90일 이상 중단 → California Carbon Market Exceptional Event 발동
- **Regulatory Disruption Event:** CARB이 CCA 거래 조건을 중대하게 변경(컴플라이언스 기한, 허용량 이전 제한, 참가 범위 등) 시 Early Termination 발동
- 미국 행정부 교체, California 주법 개정, 연방-주 규제 충돌 등 정치적 리스크 내재

---

### 2. 탄소 가격 리스크 ★★★★☆

CCA 가격 자체의 변동성이 높습니다.

- CCA 가격은 규제 수요(기업 컴플라이언스)와 투기 수요가 혼재
- 경기 둔화 시 산업 배출량 감소 → CCA 수요 감소 → 가격 하락
- 에너지 전환(재생에너지 확대) → 장기 CCA 수요 감소 압력
- ICE/CME 결제가격이 가격 기준 → 선물 시장 유동성에 의존

---

### 3. 현물-선물 기저 리스크(Basis Risk) ★★★★☆

본 거래의 핵심 기저 위험입니다.

$$\\text{기저리스크} = \\text{Spot Return} - \\text{Forward Return} \\neq \\text{기대 기저(3.84\\%)}$$

- 만기 전 합성 현물과 Dec26 선물이 크게 乖離 가능
- 콘탱고 확대(spot 할인 심화) 시 Spread Value 하락 → 신한 손실
- 시장 구조 변화(Backwardation 전환) 시 Spread Value 급등 → 신한 이익
- OET 시점의 기저가 만기 수렴 기대와 다를 수 있음

---

### 4. 유동성 리스크 ★★★★☆

CCA는 일반 상품 대비 매우 틈새(niche) 시장입니다.

- 거래 참가자 한정(주로 캘리포니아 규제 대상 기업 + 기관 투자자)
- 시장 교란 시 "Limitation on Allowance Transfers" 발동 → OTC 거래 불가
- OET 행사 시 RBC가 헤지 해소 비용(Unwinding Costs)을 신한에 전가

---

### 5. 환율 리스크 ★★★☆☆

- 명목금액 USD 25M → 원화 환산 기준 약 350억원 수준
- CCA는 USD 표시 → 원달러 환율 변동이 KRW 기준 손익에 영향
- 단, 계약 자체는 USD로만 결제되어 FX 헤지 필요 여부 별도 검토

---

### 6. 상대방 신용 리스크 ★★☆☆☆

- RBC(Royal Bank of Canada): Moody's Aa2 등급
- ISDA Master Agreement + CSA 담보 체계로 익스포저 제한
- 단, Calculation Agent = RBC → 이해충돌 가능성
      `,
      riskRadar: [
        { subject: '규제정책리스크', value: 5, fullMark: 5 },
        { subject: '탄소가격리스크', value: 4, fullMark: 5 },
        { subject: '기저(Basis)리스크', value: 4, fullMark: 5 },
        { subject: '유동성리스크',  value: 4, fullMark: 5 },
        { subject: '환율리스크',    value: 3, fullMark: 5 },
        { subject: '신용리스크',    value: 2, fullMark: 5 },
      ],
    },

    pnl: {
      title: '손익 분석',
      content: `
## 손익 구조

신한투자증권의 순 손익:

$$\\text{P\\&L} = \\text{명목금액} \\times (\\text{Spread Value} - 3.6906\\%)$$

**자연 수렴 시나리오 (기대값):**
- 만기 Spread Value ≈ 3.84% (초기 콘탱고 수렴)
- 기대 P&L ≈ USD 25M × 0.15% ≈ **USD 37,500**

## 주요 시나리오

| 시나리오 | Spread Value | 고정금리 | 순 P&L | 절대금액 |
|---------|-------------|---------|--------|---------|
| 콘탱고 심화 (-10%) | -10.0% | -3.69% | **-13.69%** | -USD 3.42M |
| 기저 변동 없음 | 0.0% | -3.69% | **-3.69%** | -USD 0.92M |
| 자연 수렴 (기대) | +3.84% | -3.69% | **+0.15%** | +USD 37.5K |
| 기저 개선 (+5%) | +5.0% | -3.69% | **+1.31%** | +USD 0.33M |
| 기저 급확대 (+15%) | +15.0% | -3.69% | **+11.31%** | +USD 2.83M |

## 조기청산 시 손익

OET 행사 시 고정금리가 5.2723% × Act/360으로 변경:
- OET 4개월차 (약 120일): 5.2723% × 120/360 = 1.76% → 신한 부담 감소
- OET 8개월차 (약 240일): 5.2723% × 240/360 = 3.51% → 만기 유지와 유사
- 단, **Unwinding Costs**(RBC 단독 산정)가 추가 차감되므로 OET는 불리
      `,
      xLabel: 'Spread Value = 현물-선물 기저수익 (%)',
      yLabel: '순 P&L (% of 명목금액)',
      payoffScenarios: [
        {
          id: 'maturity',
          label: '만기 보유 (2026-12-24, 고정 3.6906%)',
          color: '#003087',
          dashed: false,
          data: [
            { spot: -10, payoff: -13.69 },
            { spot: -5,  payoff: -8.69  },
            { spot: 0,   payoff: -3.69  },
            { spot: 3.69, payoff: 0     },
            { spot: 5,   payoff: 1.31   },
            { spot: 10,  payoff: 6.31   },
            { spot: 15,  payoff: 11.31  },
          ],
        },
        {
          id: 'oet-6m',
          label: 'OET 조기청산 (6개월, 5.2723%×180/360 = 2.64%, Unwinding 제외)',
          color: '#FF6B00',
          dashed: true,
          data: [
            { spot: -10, payoff: -12.64 },
            { spot: -5,  payoff: -7.64  },
            { spot: 0,   payoff: -2.64  },
            { spot: 2.64, payoff: 0     },
            { spot: 5,   payoff: 2.36   },
            { spot: 10,  payoff: 7.36   },
            { spot: 15,  payoff: 12.36  },
          ],
        },
        {
          id: 'natural-convergence',
          label: '자연 수렴 기대치 (Spread Value ≈ +3.84%)',
          color: '#2E7D32',
          dashed: true,
          data: [
            { spot: 3.84, payoff: -15 },
            { spot: 3.84, payoff: 15  },
          ],
        },
      ],
    },

    poison: {
      title: '독소조항 분석',
      content: `
## CCA 스왑의 핵심 위험 조항

CCA 스왑은 RBC(Party A)가 **일방적 조기종결 권리를 광범위하게 보유**하며,
모든 종결 결정에서 신한투자증권(Party B)이 **Sole Affected Party**로 지정됩니다.
      `,
      clauses: [
        {
          name: 'California Carbon Market Exceptional Event — 탄소시장 소멸 시 일방 종결',
          level: 'high',
          description:
            '캘리포니아 cap-and-trade 프로그램이 CARB 또는 캘리포니아 州의 공식 입장으로 중단·폐지되거나 90일 이상 정지되는 경우 RBC가 즉시 거래 종결 가능. 또한 CARB이 컴플라이언스 기한, 허용량 이전 제한 등 규제를 중대하게 변경하거나 CCA 이전이 5 영업일 이상 불가능한 경우에도 발동. 이 모든 상황에서 신한투자증권이 Sole Affected Party.',
        },
        {
          name: 'Calculating Agent = RBC (Sole) — 모든 계산 RBC 단독',
          level: 'high',
          description:
            'RBC가 유일한 Calculation Agent로서 합성 현물 가격(Slope 보간), Spread Value 산출, OET Unwinding Costs 결정, 시장 교란 판단을 모두 단독 수행. 신한투자증권이 독립적으로 검증할 수단 없음. 특히 Slope 보간에 사용하는 "인근 선물 가격"을 RBC가 자체 기준으로 결정.',
        },
        {
          name: 'Increased Cost of Hedging Event — 헤징 비용 상승 시 RBC 종결권',
          level: 'high',
          description:
            'RBC가 CCA 관련 헤지 포지션을 유지·구축하는 데 거래일 이후 중대한 비용 증가(세금·수수료·자본비용 등)가 발생하거나 발생할 합리적 가능성이 있다고 판단하는 경우 조기종결 또는 Spread 조정 가능. "합리적 판단" 기준을 RBC 자신이 재량으로 적용.',
        },
        {
          name: 'Hedging Disruption Event — 헤지 불가 시 종결권',
          level: 'high',
          description:
            'RBC 또는 그 계열사가 합리적 노력에도 불구하고 이 거래와 관련한 헤지 포지션을 구축·유지·해소할 수 없게 되거나, 헤지 수익을 본국 송금할 수 없게 된 경우 RBC가 조기종결 가능. CCA 시장 규제 강화·ICE 거래 제한 등이 발동 사유가 될 수 있음.',
        },
        {
          name: 'Change in Law — 광의의 법령 변경 조항',
          level: 'high',
          description:
            '거래일 이후 관련 법령·규정 변경 또는 법원·규제당국의 해석 변경으로 RBC가 헤지 포지션을 보유하는 것이 위법 또는 중대한 비용 증가를 초래한다고 판단하는 경우 종결 가능. 세법 변경(세율 인상, 탄소세 부과 등), 미국-캘리포니아 환경 규제 변화 포함. RBC의 "sole and absolute discretion"으로 판단.',
        },
        {
          name: 'OET Unwinding Costs — 조기청산 시 신한이 비용 전액 부담',
          level: 'medium',
          description:
            '신한투자증권이 OET를 행사하는 경우, Unwinding Costs(bid-offer 비용, 조달금리 변화, 헤지 해소 비용 등)를 신한이 전액 부담. RBC가 Unwinding Costs를 단독으로 결정하여 OET Party A Amount에서 차감. 실제 OET Net 수령액은 공시된 기저수익보다 상당히 낮을 수 있음.',
        },
        {
          name: 'OET 고정금리 패널티 — 5.2723% > 일반 3.6906%',
          level: 'medium',
          description:
            '조기청산(OET) 시 신한이 지급하는 고정금리가 5.2723% × Act/360으로, 일반 고정금리(3.6906%)보다 높게 설정. 조기청산을 경제적으로 불리하게 만드는 구조. 단, 잔여기간이 짧아 총 지급액 기준으로는 만기 유지보다 적을 수 있어 단순 비교 불가.',
        },
      ],
    },

    valuation: {
      title: '평가 방법론',
      content: `
## 1. 합성 현물 가격(CCA Spot Final) 산출

날짜 $d$에서의 합성 CCA 현물 가격:

$$\\text{CCA Spot Final}(d) = F_1(d) - \\text{Slope}(d)$$

여기서 Slope는 인근 선물 2개의 선형 보간:

$$\\text{Slope}(d) = \\frac{F_2(d) - F_1(d)}{D_{12}(d)} \\times D_{1d}(d)$$

| 변수 | 정의 |
|------|------|
| $F_1(d)$ | 날짜 $d$ 기준 1st Nearby Future 결제가격 |
| $F_2(d)$ | 날짜 $d$ 기준 2nd Nearby Future 결제가격 |
| $D_{12}(d)$ | 1st 만기일 → 2nd 만기일 사이 달력일수 |
| $D_{1d}(d)$ | 날짜 $d$ → 1st 만기일 사이 달력일수 |

**직관:** 선물 가격의 시간가치 부분을 선형 차감하여 가상 현물 가격 도출

---

## 2. Spot Return 산출

$$\\text{Spot Return}(d) = \\frac{\\text{CCA Spot Final}(d) - 28.12}{28.12}$$

---

## 3. Forward Return 산출 (최종 가격결정일 기준)

$$\\text{Forward Return} = \\frac{\\text{CCA Dec26 Futures Final} - 29.20}{28.12}$$

- CCA Dec26 Futures Final: 2026-12-24 CME 공시 CCA Dec 2026 선물 결제가격
- 분모가 28.12(현물 초기가)임에 유의 — Spot Return과 일관성 유지

---

## 4. Spread Value (최종 정산 기준)

$$\\text{Spread Value} = \\text{Spot Return}_{Final} - \\text{Forward Return}$$

$$= \\frac{F_1(T) - \\text{Slope}(T) - 28.12}{28.12} - \\frac{F_{Dec26}(T) - 29.20}{28.12}$$

**만기(T = 2026-12-24)에서의 수렴:**
$T$는 Dec26 선물 최종 결제일이므로 $F_1(T) \\approx F_{Dec26}(T)$, $\\text{Slope}(T) \\approx 0$

$$\\text{Spread Value}_{T} \\approx \\frac{29.20 - 28.12}{28.12} \\approx 3.84\\%$$

---

## 5. 최종 결제 금액

$$\\text{Party A 지급액} = USD 25M \\times \\text{Spread Value}$$

$$\\text{Party B 지급액} = USD 25M \\times 3.6906\\%$$

Net(신한 수취): $USD 25M \\times (\\text{Spread Value} - 3.6906\\%)$

---

## 6. OET 결제 금액

$$\\text{OET Party B Amount} = N_{OET} \\times 5.2723\\% \\times \\frac{\\text{Act}}{360}$$

$$\\text{OET Party A Amount} = N_{OET} \\times (\\text{Spot Return}_{OET} - \\text{Forward Return}_{OET} - \\text{Unwinding Costs})$$

- $N_{OET}$: 조기청산 명목금액 (부분 청산 가능, 단 전체를 0 이하로 줄일 수 없음)
- "Act": 효력발생일(2026-04-22) → OET 종결일까지 달력일수
- Unwinding Costs: RBC가 결정하는 헤지 해소 비용 (bid-offer, 조달금리 변화 등)

---

## 7. 시장 교란 시 처리

- Maximum Days of Disruption: **2일** — 2일 이상 가격 산출 불가 시 CA(RBC)가 가격 결정
- Disruption Fallback: ISDA 2005 Commodity Definitions §7.5(d)(i) 적용
- "No Fault Termination" 대신 **"Calculation Agent Determination"** 적용
      `,
    },

    cashflow: {
      title: '현금흐름 조감도',
      content: `
## CCA 스왑 현금흐름 구조

CCA 스왑은 **계약 체결 시 초기 현금 교환 없이(Zero Upfront)** 시작됩니다.
모든 결제는 종료일(2026-12-30) 단 1회 발생하거나, OET 시에는 OET 결제일에 조기 발생합니다.
RBC는 CCA 선물 포지션을 통해 내부적으로 헤지합니다.
      `,
      diagram: {
        parties: [
          {
            id: 'shinhan',
            name: '신한투자증권 (Party B)',
            role: 'Fixed Rate Payer (3.6906%)\nCCA 기저수익 수취자\nOET 행사 권리 보유',
            type: 'client',
          },
          {
            id: 'rbc',
            name: 'RBC Capital Markets (Party A)',
            role: 'CCA 기저수익 지급자\nCalculation Agent (Sole)\nEarly Termination 결정권자',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'inception',
            label: '① 거래 체결 (Effective Date: 2026-04-22)',
            description:
              '초기 현금 교환 없음. RBC는 CCA 선물 포지션(KBCZ26 등)을 구축하여 내부 헤지. 신한투자증권은 ISDA CSA에 따른 변동증거금(VM)만 필요 시 수수. 고정금리(3.6906%)와 CCA 기저수익은 만기일에 일괄 정산.',
            arrows: [
              {
                from: 'shinhan',
                to: 'rbc',
                label: 'ISDA CSA 담보 (해당 시)',
                sublabel: '변동증거금(VM), 초기증거금(IM)',
                timing: 'upfront',
                type: 'neutral',
              },
            ],
          },
          {
            id: 'maturity-gain',
            label: '② 만기 결제 — 기저 수렴 시 (Spread Value > 3.6906%)',
            description:
              '최종 가격결정일(2026-12-24) CCA Dec26 선물 결제가격 확정 후, Spread Value 산출. 신한이 고정금리 3.6906%를 지급하고, RBC가 Spread Value를 지급. Spread Value > 고정금리이면 차액을 RBC → 신한 방향으로 순액 지급. 결제일 = 종료일(2026-12-30).',
            arrows: [
              {
                from: 'rbc',
                to: 'shinhan',
                label: '순 수취 (Spread Value − 3.6906%)',
                sublabel: '예: Spread Value=3.84% → 순 수취 +0.15% × USD 25M = +USD 37,500',
                timing: 'maturity',
                type: 'positive',
              },
            ],
          },
          {
            id: 'maturity-loss',
            label: '③ 만기 결제 — 기저 발산 시 (Spread Value < 3.6906%)',
            description:
              '콘탱고 확대 또는 CCA 급락으로 Spread Value가 고정금리 미만인 경우. 신한이 고정금리 - Spread Value 차액을 추가 부담. 기저가 음수(Backwardation으로 전환)이면 손실 심화. Spread Value = -10%이면 신한 순 손실 = 13.69% × USD 25M = USD 3.42M.',
            arrows: [
              {
                from: 'shinhan',
                to: 'rbc',
                label: '순 지급 (3.6906% − Spread Value)',
                sublabel: '예: Spread Value=-5% → 신한 순 지급 8.69% × USD 25M = USD 2.17M',
                timing: 'maturity',
                type: 'negative',
              },
            ],
          },
          {
            id: 'oet',
            label: '④ OET 조기청산 (신한 행사, 만기 전 언제든)',
            description:
              '신한투자증권이 이메일 통지로 OET 행사 가능. OET 가격결정일 T+2 결제. 신한은 OET 고정금리(5.2723% × Act/360)를 지급, RBC는 당시 Spot Return - Forward Return - Unwinding Costs를 지급. Unwinding Costs(헤지 해소 비용)는 RBC 단독 산정으로 신한에게 불투명.',
            arrows: [
              {
                from: 'shinhan',
                to: 'rbc',
                label: 'OET 고정금리 지급',
                sublabel: 'USD 25M × 5.2723% × Act/360',
                timing: 'early-termination',
                type: 'negative',
              },
              {
                from: 'rbc',
                to: 'shinhan',
                label: 'CCA 기저수익 지급 (Unwinding Costs 차감 후)',
                sublabel: 'USD 25M × (Spot Return OET − Forward Return OET − Unwinding Costs)',
                timing: 'early-termination',
                type: 'positive',
              },
            ],
          },
          {
            id: 'forced-termination',
            label: '⑤ Early Termination Event (RBC 일방 종결)',
            description:
              'California Carbon Market Exceptional Event, Hedging Disruption, Increased Cost of Hedging, Change in Law 발생 시 RBC가 단독으로 조기종결 결정. 이 경우 신한이 Sole Affected Party, 거래가 Sole Affected Transaction으로 처리됨. 종결금액은 ISDA §6(e) Close-out Amount 방식으로 RBC가 산정. 신한은 시장 상황이 불리한 시점에 강제 청산될 수 있음.',
            arrows: [
              {
                from: 'rbc',
                to: 'shinhan',
                label: 'Close-out Amount (유리 시)',
                sublabel: 'ISDA §6(e), RBC 단독 산정',
                timing: 'early-termination',
                type: 'positive',
              },
              {
                from: 'shinhan',
                to: 'rbc',
                label: 'Close-out Amount (불리 시)',
                sublabel: '탄소시장 붕괴·규제변화 시 최대 손실 발생 가능',
                timing: 'early-termination',
                type: 'negative',
              },
            ],
          },
        ],
        notes: [
          '결제통화: USD. Day Count 1/1(고정레그), Act/360(OET 고정레그).',
          '가격 소스: IFE-ICE Futures US Energy; CME가 각 Pricing Date에 공시하는 CCA 선물 결제가격.',
          'Calculation Agent = RBC(Sole) — 합성현물 Slope 보간, 시장 교란 판단, Unwinding Costs 산정을 모두 RBC가 수행.',
          'California Carbon Market Exceptional Event 발동 시 신한이 Sole Affected Party로 지정되어 모든 비용을 부담.',
          '명목금액(USD 25M)은 실제로 교환되지 않으며, 순액 결제(Cash Settlement)만 발생.',
        ],
      },
    },
  },
};
