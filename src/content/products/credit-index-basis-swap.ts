import type { Product } from '@/types/product';

export const creditIndexBasisSwap: Product = {
  id: 'credit-index-basis-swap',
  name: '크레딧 인덱스 베이시스 스왑',
  fullName: 'Dynamic Credit Index Basis Swap (Skew Swap)',
  categoryId: 'credit',
  tags: [
    '스큐 스왑', 'CDS', 'iTraxx', 'CDX', '크레딧 베이시스',
    '단일종목 CDS', '인덱스 CDS', '레버리지', 'ISDA 2014', 'Nomura',
    'Dynamic', 'Credit Sub-Index', 'Skew', '신용스프레드',
  ],
  difficulty: 5,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

**크레딧 인덱스 베이시스 스왑(Credit Index Basis Swap)**은 **신용 인덱스(CDS Index)의 스프레드**와 **인덱스 구성종목 단일명 CDS(Single-Name CDS)의 가중 평균 스프레드** 사이의 차이(이를 **"스큐(Skew)"** 또는 **"베이시스(Basis)"**라 부름)를 매매하는 장외파생상품입니다.

시장에서 **"스큐 스왑(Skew Swap)"**으로도 널리 알려져 있으며, iTraxx Europe, CDX.NA.IG 등 주요 크레딧 인덱스를 대상으로 거래됩니다.

$$\\text{Skew} = S_{\\text{Index}} - S_{\\text{Intrinsic}}$$

$$S_{\\text{Intrinsic}} = \\sum_{k=1}^{n} w_k \\times S_k$$

- $S_{\\text{Index}}$: 크레딧 인덱스 CDS 스프레드 (시장 호가)
- $S_k$: 구성종목 $k$의 단일명 CDS 스프레드
- $w_k$: 인덱스 내 구성종목 $k$의 가중치

> **예시 거래 (Nomura Singapore Limited, 2026-05-15 체결):**
> Fixed Rate Payer(딜러): Nomura Singapore Limited | Fixed Rate: 0.35% p.a., 분기 지급
> Floating Rate Payer(투자자): 신한투자증권 | 명목원금: USD 60,000,000
> 만기: 2026-06-20 ~ 2033-12-20 (약 7.5년)
> 레버리지 인수: 최대 35배 (iTraxx Europe 기준)

## 스큐(Skew)란 무엇인가?

크레딧 인덱스 스프레드는 인덱스 구성종목의 단일명 CDS를 단순히 합산한 "내재가치(Intrinsic Value)"와 항상 일치하지 않습니다.

| 시장 상황 | 스큐 방향 | 이유 |
|---------|---------|------|
| **정상 시장** | 음수 (−) | 인덱스 유동성 프리미엄, 분산 효과 → 인덱스가 내재가치보다 낮게 거래 |
| **신용 스트레스** | 양수 (+) | 인덱스로 빠른 헤지 수요 급증 → 인덱스가 내재가치보다 높게 거래 |
| **특정 종목 이벤트** | 단일명 급등 | 해당 종목 스프레드 급등 시 내재가치 > 인덱스 |

일반적으로 스큐는 **−5bps ~ −20bps** 수준(인덱스가 내재가치보다 낮음)에서 형성되며, 글로벌 신용 위기 시에는 **+30~50bps**까지 확대될 수 있습니다.

## 거래 목적

| 목적 | 상세 설명 |
|------|---------|
| **스큐 수익 추구** | 인덱스와 단일명 간의 가격 비효율성을 레버리지를 통해 수익화 |
| **크레딧 델타 헤지** | 인덱스 CDS 포지션과 단일명 CDS 포지션 간의 델타 불일치 관리 |
| **포트폴리오 크레딧 리스크 관리** | 인덱스 vs. 단일명 익스포저 재조정 |
| **수익률 제고** | 고정 프리미엄 수취 + 스큐 포지션 운용 수익 |

## 관련 계약 및 규제

- **ISDA Master Agreement (2002):** 거래 법적 기본 계약
- **2014 ISDA Credit Derivatives Definitions:** 크레딧 파생상품 정의 표준 (iTraxx Untranched Standard Terms Supplement 포함)
- **FRTB (BCBS 457):** CSR (Credit Spread Risk) 민감도 — 인덱스별, 단일명별, 만기별 버텍스 산출
- **K-IFRS 제1109호:** 크레딧 파생상품 공정가치 측정 (Level 3 해당 가능)
- **EMIR/Dodd-Frank:** 거래 보고 의무 (DTCC SDR 등록)
      `,
    },
    structure: {
      title: '상품 구조',
      content: `
## 전체 구조 개요

이 거래는 **두 개의 레그(Leg)**와 **동적으로 운용되는 가상 신용 포지션(Credit Sub-Index Basis Swap Transactions)**으로 구성됩니다.

\`\`\`
[고정 레그]
Nomura(Party A) ─────── 0.35% p.a. (분기) ──────────▶ 신한(Party B)

[변동 레그]
신한(Party B) ──────── 크레딧 스큐 P&L (순 결제) ──────▶ Nomura(Party A)

[가상 포지션 (Nomura 단독 재량으로 구성)]
├── Credit Derivatives Sub-Index Swap Transaction (인덱스 CDS 포지션)
└── Component Single Name Transactions (구성종목 단일명 CDS 포지션, 반대 방향)
\`\`\`

## 1. 고정 레그 (Fixed Leg)

| 항목 | 내용 |
|------|------|
| **지급자** | Nomura Singapore Limited (Party A) |
| **고정금리** | 0.35% per annum |
| **명목원금** | USD 60,000,000 |
| **이자 계산 방법** | Act/360, Adjusted |
| **결제 주기** | 분기 (3/20, 6/20, 9/20, 12/20) |
| **최초 결제일** | 2026년 9월 20일 |
| **분기 지급액 (예시)** | USD 60M × 0.35% × (91/360) ≈ USD 52,792 |

## 2. 변동 레그 (Floating Leg) — 상세 구조

### 2-가) 변동 레그의 본질

변동 레그는 **가상의 크레딧 인덱스 베이시스 포지션**에서 발생하는 **스큐 P&L**입니다. 실제 인덱스 CDS나 단일명 CDS 거래를 체결하는 것이 아니라, 가상의(Hypothetical) 포지션에서 발생하는 손익을 계산 에이전트(Nomura)가 산출하여 결제합니다.

> **핵심:** 가상 포지션이므로 신용 이벤트(부도)가 발생해도 Auction Settlement나 Cash Settlement는 없습니다. 오직 **MTM(시가평가) 변화와 누적 스프레드 수수료(Carry)만 현금흐름으로 결제**됩니다.

### 2-나) Credit Sub-Index Basis Swap Transaction의 구성 요소

각 Credit Sub-Index Basis Swap Transaction은 항상 다음 두 요소로 구성됩니다:

**(a) Credit Derivatives Sub-Index Swap Transaction (인덱스 CDS 포지션)**
- 특정 신용 인덱스(예: iTraxx Europe 5Y)에 대한 가상의 Long 또는 Short 포지션

**(b) Component Single Name Transactions (단일명 CDS 포지션)**
- 인덱스 구성종목 각각에 대한 가상의 CDS 포지션 (인덱스 포지션과 **반대 방향**)
- 단일명 CDS 명목원금 = 인덱스 명목원금 × 해당 종목의 인덱스 내 가중치

### 2-다) 포지션 유형별 신한(Floating Rate Payer)의 현금흐름

#### ▶ Long Position (인덱스 롱 포지션)

인덱스가 Long Position으로 등록된 경우:

| 포지션 구성 | 신한의 역할 | 현금흐름 방향 |
|-----------|-----------|-------------|
| 인덱스 CDS | **매도 보호 (Protection Seller)** = Floating Rate Payer | 인덱스 고정 스프레드 **수취** |
| 구성종목 단일명 CDS | **매입 보호 (Protection Buyer)** = Fixed Rate Payer | 단일명 고정 스프레드 **지급** |

**분기별 순 현금흐름 (Long Position):**

$$\\text{분기 순 수취} = N_{\\text{original}} \\times \\left(S_{\\text{Index}} - \\sum_k w_k \\cdot S_k\\right) \\times \\frac{\\text{days}}{360} = N_{\\text{original}} \\times \\text{Skew} \\times \\alpha$$

- Skew > 0 (인덱스가 내재가치보다 넓음): 신한이 **순 수취** → 분기 고정금리 외 추가 수익 발생
- Skew < 0 (인덱스가 내재가치보다 좁음, 정상 시장): 신한이 **순 지급** → 고정금리 수입 잠식

#### ▶ Short Position (인덱스 숏 포지션)

| 포지션 구성 | 신한의 역할 | 현금흐름 방향 |
|-----------|-----------|-------------|
| 인덱스 CDS | **매입 보호 (Protection Buyer)** = Fixed Rate Payer | 인덱스 고정 스프레드 **지급** |
| 구성종목 단일명 CDS | **매도 보호 (Protection Seller)** = Floating Rate Payer | 단일명 고정 스프레드 **수취** |

**분기별 순 현금흐름 (Short Position):**

$$\\text{분기 순 수취} = N_{\\text{original}} \\times \\left(\\sum_k w_k \\cdot S_k - S_{\\text{Index}}\\right) \\times \\alpha = N_{\\text{original}} \\times (-\\text{Skew}) \\times \\alpha$$

- Skew < 0 (정상 시장): 신한이 **순 수취** → 고정금리 외 추가 수익
- Skew > 0 (신용 스트레스): 신한이 **순 지급** → 고정금리 수입 잠식

### 2-라) 레버리지 구조 (Leverage Factor)

가상 포지션의 명목원금은 "스케일드 명목원금(Scaled Notional)"을 기준으로 관리됩니다:

$$\\text{Scaled Notional} = \\frac{\\text{Original Notional (실제 CDS 명목원금)}}{\\text{Sub-Index Leverage Factor}}$$

**Maximum Investment Condition (최대 투자 한도):**

$$\\sum_i \\frac{N_{\\text{original},i}}{L_i} \\leq \\$60M \\quad (\\text{Notional Amount})$$

즉, "스케일드 명목원금의 합계"가 $60M을 초과하지 않으면 됩니다.

**적격 신용 인덱스 및 레버리지 인수:**

| 인덱스 | 레버리지 인수 | 최대 실제 CDS 명목원금 |
|--------|------------|-------------------|
| **iTraxx® Europe** | **35** | **USD 2.1B** |
| iTraxx® Europe Crossover | 25 | USD 1.5B |
| Markit CDX.NA.IG | 35 | USD 2.1B |
| Markit CDX.NA.IG.FIN | 35 | USD 2.1B |
| Markit CDX.NA.HY | 25 | USD 1.5B |
| iTraxx® Europe Senior Financials | 35 | USD 2.1B |
| iTraxx® Europe Non-Financials | 35 | USD 2.1B |
| iTraxx® Europe Subordinated Financials | 30 | USD 1.8B |
| Markit iTraxx Australia | 25 | USD 1.5B |
| Markit CDX.EM | 25 | USD 1.5B |
| iTraxx® Asia ex-Japan IG | 35 | USD 2.1B |
| iTraxx® Japan | 25 | USD 1.5B |

> **레버리지 효과:** iTraxx Europe 1개 포지션에 전체 한도 집중 시, 실제 가상 CDS 명목원금은 $60M × 35 = **USD 2.1B**. 스큐 **1bp(0.01%) 변동** → 분기 P&L 변화 = $2.1B × 0.01% × 0.25 = **USD 52,500** (= 고정금리 분기 수입 전액과 동일). 즉, 스큐 1bp 움직임이 전체 고정금리 수입을 없애거나 두 배로 만들 수 있는 극도로 민감한 구조.

### 2-마) Nomura의 동적 포지션 관리 권한

Nomura(Party A)는 거래 기간 중 **언제든지** 아래 3가지 행위를 **단독 재량**으로 수행할 수 있습니다:

| 행위 | 내용 |
|------|------|
| **Entry (진입)** | 새로운 Credit Sub-Index Basis Swap Transaction 추가 |
| **Exit (청산)** | 기존 Transaction을 전체 또는 부분 청산 |
| **Substitution (교체)** | 기존 Transaction을 종료하고 새 Transaction으로 대체 |

포지션 변경 시 Calculation Agent(Nomura)는 신한에게 **Reference Registry Amendment Notice**를 발송합니다.

## 3. 신한(Floating Rate Payer)의 분기별 순 현금흐름 종합

$$\\text{신한의 분기 순 현금흐름} = \\underbrace{0.35\\% \\times \\$60M \\times \\alpha}_{\\text{고정금리 수취}} + \\underbrace{\\sum_i N_{\\text{orig},i} \\times \\text{Skew}_i \\times \\alpha}_{\\text{스큐 P\\&L (부호에 따라 수취/지급)}}$$

**단위 스큐 1bp 변화의 분기 P&L 영향 (iTraxx Europe 전액 투자 기준):**

| 스큐 수준 | 스큐 P&L/분기 | 고정금리 수취 | 순 현금흐름 |
|---------|------------|------------|----------|
| +5bps | +$262,500 | +$52,500 | **+$315,000** |
| +1bp | +$52,500 | +$52,500 | **+$105,000** |
| 0bps | $0 | +$52,500 | **+$52,500** |
| −1bp | −$52,500 | +$52,500 | **$0 (손익분기)** |
| −5bps | −$262,500 | +$52,500 | **−$210,000** |
| −10bps | −$525,000 | +$52,500 | **−$472,500** |

> 스큐 −1bp만으로 분기 전체 고정금리 수입이 상쇄됩니다. 정상 시장에서 스큐가 −10bps 수준이면, 연간 손실이 USD 약 1.89M에 달합니다.

## 4. Party A Optional Early Termination at Zero MTM

Nomura는 2026년 9월 20일부터 분기마다 **제로 시가(Zero Mark-to-Market)** 기준으로 거래를 조기종료할 수 있는 옵션을 보유합니다 (2033년 9월 20일까지). 이는 신한에게 특히 불리한 독소조항입니다 (→ 독소조항 섹션 참조).
      `,
    },
    risk: {
      title: '리스크',
      content: `
## 핵심 리스크 요인

### 1. 신용 스프레드 리스크 (Credit Spread Risk)

인덱스 CDS 스프레드와 단일명 CDS 스프레드 전반의 변동이 모두 포지션 가치에 영향을 줍니다.

- **인덱스 스프레드 확대:** 신용 시장 전반 악화 신호 → Long Position 가치 변화
- **단일명 스프레드 분산 확대:** 인덱스 내 이질성 증가 → 내재가치 vs. 인덱스 차이 변동
- **FRTB CSR 민감도:** 인덱스별 + 단일명별 + 만기 버텍스별 Delta 산출 필요

$$\\text{CS01} = N_{\\text{original}} \\times \\text{Skew Change per 1bp} \\times \\text{DV01}_{\\text{CDS}}$$

### 2. 스큐/베이시스 리스크 (Skew/Basis Risk)

이 상품의 **핵심이자 최대 리스크**. 스큐의 방향성과 크기 자체가 변동 레그 전체를 결정합니다.

- **스큐 확대 리스크 (Long 포지션 보유 시):** 인덱스가 단일명보다 빠르게 축소 → 손실
- **스큐 축소 리스크 (Short 포지션 보유 시):** 인덱스가 단일명보다 빠르게 확대 → 손실
- **비선형 변동:** 신용 이벤트, 지수 구성 변경, 대규모 헤지 수요 시 스큐가 급격히 비선형으로 움직임

### 3. 레버리지 리스크 (Leverage Risk)

레버리지 인수 최대 35배로 인해 스큐의 소폭 변동이 대규모 P&L 변화를 초래합니다.

$$\\text{스큐 1bp 변화} \\approx \\text{분기 고정금리 수입 전액}$$

신용 위기 시 스큐가 수십 bps 이상 급변하면 단기간에 Notional Amount($60M) 상당 손실이 발생할 수 있습니다.

### 4. 유동성 리스크 (Liquidity Risk)

- 인덱스 CDS는 유동성이 높으나, 구성종목 단일명 CDS 중 일부는 유동성이 낮을 수 있음
- 조기종료 시 단일명 CDS 시장의 유동성 부족으로 청산 비용이 크게 발생할 수 있음
- 이 거래는 **가상 포지션**이나, 딜러(Nomura)의 실제 헤지 비용이 평가에 반영됨

### 5. 거래상대방 재량 리스크 (Party A Discretion Risk)

Nomura가 포지션 선택·변경·종료·조기상환을 모두 단독으로 결정합니다. 신한은 포지션 구성에 대한 **사전 동의권도 거부권도 없습니다.**

- 신한에게 불리한 포지션(예: 스트레스 시장에서 Short 포지션)으로 교체될 수 있음
- 신한이 이익인 시점에 Nomura가 Zero MTM 조기종료 옵션을 행사하지 않더라도, 포지션을 불리하게 교체할 수 있음

### 6. 모델 리스크 (Model Risk)

- 내재가치($S_{\\text{Intrinsic}}$) 계산은 구성종목 스프레드 데이터와 가중치에 의존 → 종목별 스프레드 데이터 품질 중요
- 일부 단일명 CDS의 관찰 가능한 시장 데이터 부재 → 모델 보간 필요
- Calculation Agent(Nomura)가 단독으로 산출 → 검증 어려움

### 주요 리스크 점검 항목

- ☐ 분기마다 인덱스 스큐 수준 모니터링 (iTraxx, CDX 시장 데이터)
- ☐ 레버리지 감안 스큐 민감도($\\text{CS01}$) 일별 산출
- ☐ Nomura의 포지션 변경 내역(Reference Registry) 수시 점검
- ☐ Zero MTM 조기종료 옵션 행사 가능성 시나리오 분석
- ☐ FRTB CSR 민감도 (인덱스 레벨 + 단일명 레벨) 산출 체계 구축
      `,
      riskRadar: [
        { subject: '신용스프레드', value: 5, fullMark: 5 },
        { subject: '스큐 변동성', value: 5, fullMark: 5 },
        { subject: '레버리지', value: 5, fullMark: 5 },
        { subject: '유동성', value: 4, fullMark: 5 },
        { subject: '모델리스크', value: 4, fullMark: 5 },
        { subject: '재량 리스크', value: 5, fullMark: 5 },
      ],
    },
    pnl: {
      title: '손익 분석',
      content: `
## 신한(Floating Rate Payer) 기준 손익 구조

### 분기 순 P&L 공식

$$\\text{순 P\\&L} = \\underbrace{0.35\\% \\times \\$60M \\times \\alpha}_{\\text{고정금리 수취 (항상 +)}} + \\underbrace{N_{\\text{orig}} \\times \\text{Skew} \\times \\alpha}_{\\text{스큐 P\\&L (부호 가변)}}$$

### 손익 시나리오 분석 (iTraxx Europe, Leverage 35×, 전액 투자 기준)

정규화 기준: **고정금리 분기 수익 = 1단위** (≈ USD 52,500)

| 스큐 수준 | Long Index P&L | Short Index P&L | 비고 |
|---------|-------------|-------------|------|
| +10bps | **+11** | −9 | 극단적 신용 스트레스 (인덱스 급등) |
| +5bps | **+6** | −4 | 경미한 신용 스트레스 |
| +1bp | **+2** | 0 | Short 포지션 손익분기 |
| 0bps | **+1** | +1 | 스큐 없음, 고정금리만 수취 |
| −1bp | 0 | **+2** | Long 포지션 손익분기 |
| −5bps | −4 | **+6** | 정상 시장 (Short 유리) |
| −10bps | −9 | **+11** | 정상 시장 심화 |
| −20bps | −19 | **+21** | 극단적 정상 시장 |

### 최대 손익 요약

| 구분 | Long Index 포지션 | Short Index 포지션 |
|------|----------------|----------------|
| **최대 이익** | 이론적 무제한 (스큐 양수 무한 확대) | 이론적 무제한 (스큐 음수 무한 확대) |
| **최대 손실** | −$60M (Notional Amount 한도) | −$60M (Notional Amount 한도) |
| **손익분기 스큐** | −1bp | +1bp |
| **리스크 특성** | 신용 스트레스 시 수익 (역발상) | 정상 시장 시 수익 (캐리 추구) |

### 스큐 1bp 민감도

$$\\text{Skew CS01} = N_{\\text{orig}} \\times 0.01\\% \\times \\alpha = \\$2.1B \\times 0.0001 \\times 0.25 = \\$52,500/\\text{분기}$$

스큐 CS01은 고정금리 분기 수입과 동일합니다. 이는 **레버리지 35배 구조의 극도의 민감성**을 보여줍니다.
      `,
      payoffScenarios: [
        {
          id: 'long-index',
          label: 'Long Index 포지션 (인덱스 보호매도)',
          color: '#0066CC',
          data: [
            { spot: -20, payoff: -19 },
            { spot: -15, payoff: -14 },
            { spot: -10, payoff: -9 },
            { spot: -5, payoff: -4 },
            { spot: -1, payoff: 0 },
            { spot: 0, payoff: 1 },
            { spot: 1, payoff: 2 },
            { spot: 5, payoff: 6 },
            { spot: 10, payoff: 11 },
            { spot: 15, payoff: 16 },
            { spot: 20, payoff: 21 },
          ],
        },
        {
          id: 'short-index',
          label: 'Short Index 포지션 (인덱스 보호매입)',
          color: '#FF6B00',
          dashed: true,
          data: [
            { spot: -20, payoff: 21 },
            { spot: -15, payoff: 16 },
            { spot: -10, payoff: 11 },
            { spot: -5, payoff: 6 },
            { spot: -1, payoff: 2 },
            { spot: 0, payoff: 1 },
            { spot: 1, payoff: 0 },
            { spot: 5, payoff: -4 },
            { spot: 10, payoff: -9 },
            { spot: 15, payoff: -14 },
            { spot: 20, payoff: -19 },
          ],
        },
      ],
      xLabel: '크레딧 스큐 (bps)',
      yLabel: '순 P&L (고정수익 1단위 기준)',
    },
    poison: {
      title: '독소조항',
      content: `
## 독소조항 분석 개요

Dynamic Credit Index Basis Swap은 여러 겹의 구조적 비대칭성이 존재하여, **투자자(Floating Rate Payer)에게 특히 불리한 독소조항**이 많습니다. 딜러(Party A)가 포지션 결정부터 조기종료까지 모든 권한을 보유하는 반면, 투자자는 수동적 위험 부담 역할에 한정됩니다.
      `,
      clauses: [
        {
          name: 'Party A 단독 재량 — 포지션 전권 장악',
          level: 'high',
          description:
            'Nomura(Party A)는 어떤 인덱스에, 어떤 방향으로(Long/Short), 어떤 크기로 포지션을 진입·청산·교체할지를 **완전한 단독 재량(Sole Discretion)**으로 결정합니다. 신한은 포지션 구성에 대한 사전 동의권·거부권·통지 요청권이 없습니다. Nomura의 상업적 이해관계, 내부 정책, 헤지 수요에 따라 신한에게 불리한 포지션이 선택될 수 있으며, 이를 신한은 사후에야 통보받습니다.',
        },
        {
          name: 'Zero MTM 조기종료 옵션 — 비대칭 손실 구조',
          level: 'high',
          description:
            'Nomura는 2026년 9월 20일부터 분기마다 전체 거래를 "제로 시가(Zero Mark-to-Market)" 기준으로 조기종료할 수 있는 옵션을 보유합니다(2033년 9월 20일까지). 이는 신한의 포지션 시가가 음수(손실)인 경우 Nomura가 아무런 보상 없이 거래를 종료할 수 있음을 의미합니다. 즉, 신한에게 손실이 쌓인 시점에 Nomura가 이 옵션을 행사하면 신한은 손실을 그대로 안게 됩니다. 반대로 신한에게 이익이 발생한 경우, Nomura는 이 옵션을 행사하지 않으므로 신한은 추가 이익을 기대하기 어렵습니다.',
        },
        {
          name: 'Calculation Agent = Party A (이해충돌)',
          level: 'high',
          description:
            'Nomura Singapore Limited가 Calculation Agent로 단독 지정되어 있습니다. Nomura는 가상 포지션의 MTM, 단일명 CDS 스프레드, 스큐 산출, 결제금액 계산을 모두 직접 수행합니다. 이는 구조적 이해충돌로, 특히 시장이 불투명하거나 유동성이 낮은 상황에서 신한에게 불리한 방향으로 산출될 가능성이 있습니다. 독립적인 검증 수단이 사실상 제한됩니다.',
        },
        {
          name: '신용이벤트 미결제 (가상 포지션의 한계)',
          level: 'medium',
          description:
            '가상 포지션이므로 구성종목에 실제 신용이벤트(부도)가 발생해도 Auction Settlement나 Cash Settlement는 없습니다. 실제 CDS였다면 받을 수 있는 보호 지급(Protection Payment)이 없고, 오직 MTM 변화만 현금흐름으로 반영됩니다. 이는 신용 이벤트 발생 시 포지션의 급격한 가치 변화에 노출되면서도 실제 헤지 효과는 받지 못함을 의미합니다.',
        },
        {
          name: '레버리지 35배 — 극소 스큐 변동의 대규모 손익',
          level: 'medium',
          description:
            '적용 레버리지 인수 최대 35배로 인해 신용 스큐 1bp(0.01%) 변동이 분기 고정금리 수입 전액에 해당하는 P&L 변동을 초래합니다. 정상 시장에서 스큐 −10bps 수준이라면 연간 손실이 약 USD 1.89M에 달할 수 있습니다. 투자자는 레버리지 위험 규모를 명목원금($60M)이 아닌 실제 CDS 명목원금($2.1B 최대)으로 인식해야 합니다.',
        },
      ],
    },
    valuation: {
      title: '평가 방법론',
      content: `
## 평가 모델

Dynamic Credit Index Basis Swap의 공정가치는 두 레그의 합산으로 구성됩니다:

$$V_{\\text{Total}} = V_{\\text{Fixed Leg}} + V_{\\text{Floating Leg}}$$

---

## 고정 레그 평가 (Fixed Leg)

표준 할인현금흐름:

$$V_{\\text{Fixed}} = 0.35\\% \\times \\$60M \\times \\sum_{i=1}^{n} \\alpha_i \\times D(0, t_i)$$

- $D(0, t_i)$: 무위험 할인인수 (USD OIS 또는 SOFR 기반)
- $n$: 잔존 결제일 수 (분기 기준 최대 30회)

---

## 변동 레그 평가 (Floating Leg) — 핵심

변동 레그의 공정가치는 **각 Credit Sub-Index Basis Swap Transaction의 MTM 합산**입니다.

### 단계 1: 스큐(Skew) 산출

$$\\text{Skew}_{j}(t) = S_{\\text{Index},j}(t) - \\sum_{k \\in j} w_k \\cdot S_k(t)$$

- $S_{\\text{Index},j}(t)$: 인덱스 $j$의 시장 CDS 스프레드 (예: iTraxx Europe 5Y)
- $S_k(t)$: 구성종목 $k$의 단일명 CDS 스프레드
- $w_k$: 구성종목 $k$의 인덱스 내 가중치

### 단계 2: 각 포지션의 CDS 공정가치

CDS 공정가치 (Long Position on Index, 신한 = 매도 보호):

$$\\text{MTM}_{i} = N_{\\text{orig},i} \\times \\left(S_{\\text{Index},i}(0) - S_{\\text{Index},i}(t)\\right) \\times \\text{RPV01}_{i}$$

$$\\text{RPV01} = \\sum_{k=1}^{n} \\alpha_k \\times D(0, t_k) \\times \\text{SurvivalProb}(0, t_k)$$

- $\\text{RPV01}$: Risky Present Value of 1bp (신용 이벤트 고려한 리스키 연금 인수)
- $\\text{SurvivalProb}(0, t_k)$: 생존 확률 (CDS 스프레드 및 회수율에서 역산)

### 단계 3: 스큐 P&L을 반영한 변동 레그 가치

$$V_{\\text{Floating}} = \\sum_i \\text{MTM}_{\\text{index},i} - \\sum_i \\sum_k \\text{MTM}_{\\text{single-name},k,i}$$

$$= \\sum_i N_{\\text{orig},i} \\times (\\text{Skew}_{i}(0) - \\text{Skew}_{i}(t)) \\times \\text{RPV01}_i$$

---

## 입력 변수 및 IFRS 13 Level

| 입력변수 | 시장 관찰 가능성 | IFRS 13 Level |
|---------|--------------|--------------|
| iTraxx Europe / CDX.NA.IG 스프레드 (유동성 높음) | Observable | **Level 2** |
| 단일명 CDS 스프레드 (유동성 있는 종목) | Observable | **Level 2** |
| 단일명 CDS 스프레드 (유동성 낮은 종목) | 부분 Observable | **Level 3** |
| 스큐 (Basis) 자체 | Observable+모델 | **Level 2~3** |
| 동적 포지션 선택 효과 | 비관찰 | **Level 3** |
| 회수율 (Recovery Rate) 가정 | 표준 40% 가정 | **Level 2~3** |

**IFRS 13 공정가치 위계:** 전체 거래 → **Level 3** (Nomura의 동적 재량, 일부 단일명 유동성 부족)

---

## CVA/DVA 및 FVA

$$V_{\\text{adj}} = V_{\\text{Risk-Free}} - \\text{CVA} + \\text{DVA} - \\text{FVA}$$

- **CVA:** Nomura의 부도 위험 (상계를 고려하여 Net 익스포저 기준)
- **DVA:** 신한 자신의 부도 위험 (통상 적용 여부 내부 정책에 따름)
- **Note:** CSA Terms 상 Party A(Nomura)에 대한 익스포저 한도 = Notional Amount($60M)

---

## 검증 방법 (IPV)

- **일별 Skew 모니터링:** Markit, Bloomberg에서 인덱스 및 단일명 CDS 스프레드 수신
- **Reference Registry 검토:** Nomura로부터 수신한 포지션 명세와 내부 계산 비교
- **독립 스큐 산출:** 내부 시스템에서 자체 스큐 계산 → Nomura 산출치와 비교
- **FRTB CSR 버킷:** 인덱스 레벨(Non-Securitisation, Index bucket) + 단일명 레벨 분리 산출
      `,
    },
    cashflow: {
      title: '현금흐름 조감도',
      content: `
## 현금흐름 구조 설명

Dynamic Credit Index Basis Swap의 현금흐름은 **두 레이어**로 구성됩니다:

- **Layer 1 — 고정 레그:** Nomura → 신한, 분기마다 0.35% × $60M 고정 지급
- **Layer 2 — 변동 레그:** 가상 신용 포지션의 스큐 P&L (방향은 시장 상황에 따라 가변)

### 고정 레그 현금흐름 (항상 동일)

\`\`\`
Nomura ───── 0.35% × $60M × (days/360) ─────▶ 신한
            (분기 ≈ USD 52,500)
\`\`\`

### Long Index 포지션 — 스큐 양수 시 (Positive Skew, 예: +5bps)

인덱스가 단일명 내재가치보다 넓게 거래될 때 신한에게 유리:

\`\`\`
[가상 포지션]
신한(인덱스 보호매도) ← iTraxx 스프레드 × N ← Nomura(인덱스 보호매입)
신한(단일명 보호매입) → 단일명 스프레드 × N → Nomura(단일명 보호매도)

순 현금흐름: 신한이 (스큐 × N × α) = (5bps × 2.1B × 0.25) = +$262,500 수취
\`\`\`

총 신한 수취: $52,500(고정) + $262,500(스큐) = **+$315,000/분기**

### Long Index 포지션 — 스큐 음수 시 (Negative Skew, 예: −5bps, 정상 시장)

인덱스가 단일명 내재가치보다 좁게 거래될 때 신한에게 불리:

\`\`\`
[가상 포지션]
신한(인덱스 보호매도) → iTraxx 스프레드 < 단일명 합산 → 순 지급 발생
단일명 내재가치가 더 높으므로 신한이 순차액(−5bps × N × α) = −$262,500 지급
\`\`\`

총 신한 순 현금흐름: $52,500(고정) − $262,500(스큐) = **−$210,000/분기** (손실)

### Short Index 포지션 — 정상 시장 (Negative Skew, 예: −5bps)

인덱스가 내재가치보다 좁을 때 Short 포지션이 유리:

\`\`\`
[가상 포지션]
신한(인덱스 보호매입) → iTraxx 스프레드 × N 지급 → Nomura
신한(단일명 보호매도) ← 단일명 스프레드 × N 수취 ← Nomura

순 현금흐름: 단일명합산(더 큼) − 인덱스 = +5bps 순 수취 → +$262,500
\`\`\`

총 신한 수취: $52,500(고정) + $262,500(스큐) = **+$315,000/분기**
      `,
      diagram: {
        parties: [
          {
            id: 'shinhan',
            name: '신한투자증권',
            role: 'Floating Rate Payer\n(Party B)',
            type: 'client',
          },
          {
            id: 'nomura',
            name: 'Nomura Singapore',
            role: 'Fixed Rate Payer\nCalculation Agent (Party A)',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'fixed-leg',
            label: '고정 레그 (항상 동일)',
            description: 'Nomura가 신한에게 매 분기 고정금리를 지급합니다. 이 금액은 시장 상황과 무관하게 항상 동일합니다. 이 0.35%는 신한이 불확실한 스큐 리스크를 부담하는 대가(리스크 프리미엄)입니다.',
            arrows: [
              {
                from: 'nomura',
                to: 'shinhan',
                label: '고정금리 분기 지급',
                sublabel: '0.35% × USD 60M × (days/360) ≈ USD 52,500/분기',
                timing: 'periodic',
                type: 'positive',
              },
            ],
          },
          {
            id: 'long-positive-skew',
            label: 'Long Index + 스큐 양수 (+5bps)',
            description: 'Nomura가 Long Index 포지션(신한 = 인덱스 보호매도, 단일명 보호매입)을 설정하고, 시장 스큐가 +5bps일 때입니다. 인덱스가 단일명 내재가치보다 넓으므로 신한에게 유리. 스큐 P&L(+$262,500)이 고정금리($52,500)에 더해져 총 +$315,000 수취.',
            arrows: [
              {
                from: 'nomura',
                to: 'shinhan',
                label: '고정금리 수취',
                sublabel: 'USD 52,500/분기',
                timing: 'periodic',
                type: 'positive',
              },
              {
                from: 'nomura',
                to: 'shinhan',
                label: '스큐 P&L 순 수취',
                sublabel: '+5bps × $2.1B × 0.25 = +USD 262,500 (신한 유리)',
                timing: 'periodic',
                type: 'positive',
              },
            ],
          },
          {
            id: 'long-negative-skew',
            label: 'Long Index + 스큐 음수 (−5bps, 정상 시장)',
            description: 'Nomura가 Long Index 포지션을 설정하였으나, 정상 시장에서 스큐가 −5bps(인덱스가 내재가치보다 좁음)일 때입니다. 신한의 스큐 P&L은 −$262,500이 되어 고정금리 수입($52,500)을 초과하는 분기 손실 −$210,000이 발생합니다.',
            arrows: [
              {
                from: 'nomura',
                to: 'shinhan',
                label: '고정금리 수취',
                sublabel: 'USD 52,500/분기',
                timing: 'periodic',
                type: 'positive',
              },
              {
                from: 'shinhan',
                to: 'nomura',
                label: '스큐 P&L 순 지급',
                sublabel: '5bps × $2.1B × 0.25 = USD 262,500 (신한 불리)',
                timing: 'periodic',
                type: 'negative',
              },
            ],
          },
          {
            id: 'short-negative-skew',
            label: 'Short Index + 스큐 음수 (−5bps, 정상 시장)',
            description: 'Nomura가 Short Index 포지션(신한 = 인덱스 보호매입, 단일명 보호매도)을 설정하고 스큐가 −5bps일 때입니다. 단일명 합산이 인덱스보다 넓으므로 신한이 수취. 고정금리 + 스큐 P&L로 총 +$315,000 수취. 하지만 이 포지션은 신용 스트레스 시(스큐 양수 전환) 큰 손실 위험이 있습니다.',
            arrows: [
              {
                from: 'nomura',
                to: 'shinhan',
                label: '고정금리 수취',
                sublabel: 'USD 52,500/분기',
                timing: 'periodic',
                type: 'positive',
              },
              {
                from: 'nomura',
                to: 'shinhan',
                label: '스큐 P&L 순 수취',
                sublabel: '5bps × $2.1B × 0.25 = +USD 262,500 (신한 유리)',
                timing: 'periodic',
                type: 'positive',
              },
            ],
          },
          {
            id: 'zero-mtm-termination',
            label: 'Zero MTM 조기종료 (Nomura 행사)',
            description: 'Nomura가 Party A Optional Early Termination을 행사하는 경우입니다. 신한의 포지션 MTM이 마이너스(손실)일 때 행사 가능성이 높으며, 이 경우 신한은 잔존 손실을 그대로 안고 거래가 종료됩니다. 향후 고정금리 수입도 더 이상 발생하지 않습니다.',
            arrows: [
              {
                from: 'shinhan',
                to: 'nomura',
                label: 'MTM 손실 정산 지급',
                sublabel: '조기종료 시 신한의 마이너스 MTM 정산 (최대 Notional Amount 한도)',
                timing: 'early-termination',
                type: 'negative',
              },
            ],
          },
        ],
        notes: [
          '가상 포지션이므로 구성종목 신용이벤트 발생 시에도 Auction Settlement/Cash Settlement는 없으며, MTM 변화만 현금흐름에 반영됩니다.',
          '레버리지 인수 35배 적용 시 실제 가상 CDS 명목원금 최대 USD 2.1B — 스큐 1bp 변동 = 분기 $52,500 P&L 변화.',
          'Nomura(Party A)는 포지션 구성, 교체, 청산, 조기종료를 단독 재량으로 결정합니다.',
          'Business Days: London, New York, Seoul. Business Day Convention: Following.',
          'Calculation Agent: Nomura Singapore Limited — 모든 결제금액 및 MTM 산출 책임.',
        ],
      },
    },
  },
};
