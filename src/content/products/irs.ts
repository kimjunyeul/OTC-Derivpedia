import type { Product } from '@/types/product';

export const irs: Product = {
  id: 'irs',
  name: 'IRS',
  fullName: 'Interest Rate Swap',
  categoryId: 'interest-rate',
  tags: ['금리', '헤지', 'ISDA', '스왑', 'Plain Vanilla', 'DV01', 'SOFR', 'CD금리'],
  difficulty: 2,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

Interest Rate Swap(IRS)은 두 거래 당사자가 동일한 **명목원금(Notional Principal)**에 대해 **고정금리(Fixed Rate)**와 **변동금리(Floating Rate)**를 합의된 기간 동안 주기적으로 교환하는 장외파생계약입니다.

명목원금은 실제로 교환되지 않으며, 이자 계산의 기준으로만 사용됩니다. 가장 일반적인 형태는 **Plain Vanilla IRS**로, ISDA 표준 문서에 따라 거래됩니다.

## 거래 목적

| 목적 | 활용 사례 |
|------|---------|
| **헤지 (Hedge)** | 변동금리 차입자가 금리 상승 리스크를 고정금리 지급으로 전환 |
| **투기 (Speculation)** | 금리 방향성 뷰에 따른 포지션 구축 |
| **자산-부채 관리 (ALM)** | 은행의 ALM 포트폴리오 듀레이션 조정 |
| **차익거래** | 채권/스왑 스프레드 차익 포착 |

## 거래 당사자 구조

\`\`\`
  Fixed Rate Payer          Fixed Rate Receiver
  (변동금리 수취측)    ←고정금리→   (변동금리 지급측)
                      ←변동금리←
\`\`\`

- **Fixed Rate Payer:** 고정금리를 지급하고 변동금리를 수취. 금리 상승 시 이익.
- **Fixed Rate Receiver:** 고정금리를 수취하고 변동금리를 지급. 금리 하락 시 이익.
- **Calculation Agent:** 변동금리 산출, 결제금액 계산 역할 (통상 딜러 은행이 담당).

## 관련 계약 및 규제

- **ISDA Master Agreement (2002):** 거래의 법적 기본 계약
- **CSA (Credit Support Annex):** 담보(Margin) 수수 조건 명시
- **K-IFRS 제1109호:** 헤지회계 요건 — 현금흐름 헤지(Cash Flow Hedge) 적용 가능
- **자본시장법 제5조:** 장외파생상품 거래 규제 대상
- **FRTB (BCBS 457):** 시장리스크 자본규제 — GIRR(금리 리스크) SA 민감도 산출 필요
      `,
    },
    structure: {
      title: '상품 구조',
      content: `
## Leg 구조

| Leg | 지급자 | 지급 공식 | 주기 |
|-----|-------|---------|-----|
| **Fixed Leg** | Fixed Rate Payer | $N \\times K \\times \\alpha_i$ | 반기 또는 연간 |
| **Floating Leg** | Floating Rate Payer | $N \\times r_i \\times \\alpha_i$ | 분기 또는 반기 |

- $N$: 명목원금 (Notional Principal)
- $K$: 합의된 고정금리 (Swap Rate, par rate)
- $r_i$: $i$번째 결제일의 변동금리 (e.g., 3M CD, SOFR)
- $\\alpha_i$: 이자 계산 기간 (Day Count Fraction)

## 주요 계약 파라미터 (Term Sheet 매핑)

| Term Sheet 항목 | 설명 | 예시 |
|---------------|------|------|
| **Notional** | 명목원금 | KRW 100억 |
| **Tenor** | 계약 만기 | 3Y, 5Y, 10Y |
| **Fixed Rate (Swap Rate)** | 고정금리 | 3.50% p.a. |
| **Floating Rate Index** | 변동금리 지표 | 3M CD, SOFR, KOFR |
| **Reset Frequency** | 변동금리 재설정 주기 | 3개월 |
| **Payment Frequency (Fixed)** | 고정 레그 결제 주기 | 반기 |
| **Payment Frequency (Float)** | 변동 레그 결제 주기 | 분기 |
| **Day Count (Fixed)** | 이자 계산 관례 | Actual/365 (KRW), 30/360 (USD) |
| **Day Count (Float)** | 이자 계산 관례 | Actual/365 (KRW), Actual/360 (USD) |
| **Business Day Convention** | 결제일 조정 | Modified Following |
| **Effective Date** | 거래 시작일 | T+2 |
| **Termination Date** | 만기일 | T+2 + Tenor |

## 현금흐름 예시

**조건:** Notional KRW 100억, 5Y IRS, 고정금리 3.5%, 변동금리 3M CD, 분기 결제

\`\`\`
[분기마다]
Fixed Rate Payer가 지급:  100억 × 3.5% × (91/365) ≈ 87.3백만원
Floating Rate Payer가 지급: 100억 × CDt × (91/365) [매 분기 재설정]

차액 결제(Netting):
  CDt > 3.5%이면 → Fixed Rate Payer가 차액 수취
  CDt < 3.5%이면 → Fixed Rate Payer가 차액 지급
\`\`\`

## LIBOR → SOFR/KOFR 전환

2023년 6월 LIBOR 공식 종료에 따라:
- USD IRS: LIBOR → **SOFR** (Secured Overnight Financing Rate)
- KRW IRS: CD금리 유지 또는 **KOFR** (Korea Overnight Financing Repo Rate) 전환 논의 중
- ISDA 2020 IBOR Fallback Protocol 적용 여부 확인 필수
      `,
    },
    risk: {
      title: '리스크',
      content: `
## 시장 리스크

### 핵심 지표: DV01 (Dollar Value of 1 Basis Point)

금리 1bp(0.01%) 변동 시 포지션 가치 변화량:

$$\\text{DV01} \\approx -\\frac{\\partial V}{\\partial r} \\times 0.0001 \\approx N \\times T \\times 0.0001 \\times \\text{Annuity Factor}$$

**IRS 특성:** Plain Vanilla IRS는 **선형 상품**이므로 Convexity(볼록성)는 작습니다.

### Greeks 요약

| Greek | 크기 | 설명 |
|-------|------|------|
| **DV01 (Rho)** | ●●●●● 매우 큼 | 핵심 리스크 — 금리 기간구조 전체 구간 |
| **Gamma** | ○○○○○ 무시 | 선형 상품, 볼록성 거의 없음 |
| **Vega** | ○○○○○ 없음 | Plain Vanilla — 옵션성 전무 |
| **Theta** | ●●○○○ 보통 | 시간 경과에 따른 변동금리 리셋 효과 |

### FRTB SA 민감도 (GIRR)

FRTB 기준 GIRR Delta 민감도는 다음 만기 버텍스별로 산출:

| 버텍스 | 0.25Y | 0.5Y | 1Y | 2Y | 3Y | 5Y | 10Y | 15Y | 20Y | 30Y |
|--------|-------|------|----|----|----|----|-----|-----|-----|-----|
| 충격 (+1bp) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### 신용 리스크 (Counterparty Credit Risk)

CVA (Credit Value Adjustment):

$$\\text{CVA} \\approx (1 - R) \\int_0^T \\lambda(t) \\cdot e^{-\\int_0^t \\lambda(s)ds} \\cdot \\text{EPE}(t) \\cdot B(0, t) \\, dt$$

- $\\lambda(t)$: 거래 상대방 부도강도 (Hazard Rate)
- $R$: 회수율 (Recovery Rate, 통상 40%)
- $\\text{EPE}(t)$: 기대양의노출 (Expected Positive Exposure)
- $B(0, t)$: 무위험 할인인수

### 주요 리스크 점검 사항

- ☐ **금리 방향성 리스크:** DV01 × 금리 이동 시나리오로 P&L 충격 추정
- ☐ **CVA 반영:** 거래 상대방 신용등급 기반 CVA 산출 및 계상
- ☐ **기준금리 전환:** LIBOR → SOFR 전환 완료 여부 및 Fallback 조항 점검
- ☐ **FRTB 자본:** GIRR Delta, Curvature 리스크 산출 체계 구축
- ☐ **담보(CSA):** IM(Initial Margin), VM(Variation Margin) 수수 조건 확인
      `,
      riskRadar: [
        { subject: '금리 민감도', value: 5, fullMark: 5 },
        { subject: '변동성 민감도', value: 1, fullMark: 5 },
        { subject: '신용 리스크', value: 3, fullMark: 5 },
        { subject: '유동성 리스크', value: 2, fullMark: 5 },
        { subject: '모델 리스크', value: 1, fullMark: 5 },
        { subject: '운영 리스크', value: 2, fullMark: 5 },
      ],
    },
    pnl: {
      title: '손익 분석',
      content: `
## Fixed Rate Receiver 기준 손익 구조

**조건:** Notional 100, 고정금리 $K = 3.5\\%$, 변동금리 (3M CD)

연간 단순 손익:

$$P\\&L = N \\times (K - r_{\\text{floating}}) \\times \\alpha$$

| 만기 변동금리 | 연간 손익 | 구분 |
|------------|---------|------|
| 0.0% | **+3.50** | 최대 이익 (이론적) |
| 1.0% | +2.50 | 이익 |
| 2.0% | +1.50 | 이익 |
| 3.0% | +0.50 | 이익 |
| **3.5%** | **0** | **손익분기점 (Break-even)** |
| 4.0% | -0.50 | 손실 |
| 5.0% | -1.50 | 손실 |
| 6.0% | -2.50 | 손실 |

## 최대 손익 요약

| 구분 | 내용 |
|------|------|
| **최대 이익** | 이론적으로 무제한 (변동금리 → 0%에 가까울수록 이익 극대화) |
| **최대 손실** | 이론적으로 무제한 (변동금리 무한 상승 시) |
| **Break-even** | 변동금리 = 체결 고정금리 (3.5%) |
| **P&L 구조** | 선형 (Linear) — 금리 1bp 변동 시 DV01만큼 변화 |

> **Note:** 실제 IRS PV는 단순 만기 손익이 아닌, 잔존 모든 현금흐름을 할인한 현재가치(PV)로 표시됩니다.
      `,
      payoffData: [
        { spot: 0.0, payoff: 3.5 },
        { spot: 0.5, payoff: 3.0 },
        { spot: 1.0, payoff: 2.5 },
        { spot: 1.5, payoff: 2.0 },
        { spot: 2.0, payoff: 1.5 },
        { spot: 2.5, payoff: 1.0 },
        { spot: 3.0, payoff: 0.5 },
        { spot: 3.5, payoff: 0.0 },
        { spot: 4.0, payoff: -0.5 },
        { spot: 4.5, payoff: -1.0 },
        { spot: 5.0, payoff: -1.5 },
        { spot: 5.5, payoff: -2.0 },
        { spot: 6.0, payoff: -2.5 },
      ],
      xLabel: '변동금리 (%)',
      yLabel: '손익 (Notional 100 기준)',
    },
    poison: {
      title: '독소조항',
      content: `
## 독소조항 분석 개요

IRS는 비교적 표준화된 구조이나, 비표준 계약 또는 이면 합의 조항에 주의가 필요합니다. 특히 장기물(10Y+) 또는 비유동 통화 IRS의 경우 조항별 위험도가 높아질 수 있습니다.
      `,
      clauses: [
        {
          name: 'Calculation Agent 단독 지정',
          level: 'high',
          description:
            '딜러 은행을 Calculation Agent로 단독 지정하는 경우, 변동금리 산출 및 결제금액 계산에서 이해충돌이 발생할 수 있습니다. 특히 Market Disruption 사건 발생 시 딜러의 재량으로 대체 금리를 산정하게 되어 불리한 조건이 적용될 수 있습니다.',
        },
        {
          name: 'Early Termination 비대칭 해지권',
          level: 'high',
          description:
            '딜러 은행에만 조기종료권(Optional Early Termination)이 부여되는 경우, 금리 하락기(Fixed Receiver에게 유리한 시점)에 딜러가 일방적으로 계약을 종료할 수 있어 헤지 효과 소멸 리스크가 있습니다.',
        },
        {
          name: 'Market Disruption / Rate Fallback',
          level: 'medium',
          description:
            '기준금리 산출 불가(Market Disruption) 시 대체금리 산정 방식이 불명확하거나 딜러 재량에 맡겨진 경우, 예상치 못한 결제금액이 발생할 수 있습니다. ISDA 2020 IBOR Fallback Protocol 적용 여부를 반드시 확인해야 합니다.',
        },
        {
          name: 'Closeout Netting 적용 제한',
          level: 'medium',
          description:
            'ISDA Master Agreement의 Closeout Netting 조항이 해당 관할권에서 집행력을 갖지 못하는 경우, 부도 시 상계 처리가 불가능해져 익스포저가 총계 기준으로 산정될 수 있습니다.',
        },
        {
          name: '표준 이자 계산 관례 (Day Count)',
          level: 'low',
          description:
            'Actual/365, Actual/360, 30/360 등 이자 계산 관례는 계약서에 명시되므로 시장 표준과의 편차만 주의하면 됩니다. KRW IRS는 통상 Actual/365를 사용합니다.',
        },
      ],
    },
    valuation: {
      title: '평가 방법론',
      content: `
## 6-가) 평가 모델

**모델:** 할인현금흐름법 (Discounted Cash Flow, DCF)

IRS는 **선형 이자율 파생상품**으로, 확률미분방정식 기반 복잡 모델 없이 **금리 기간구조(Yield Curve)**만으로 공정가치 산출이 가능합니다.

$$V_{\\text{IRS}} = V_{\\text{Fixed Leg}} - V_{\\text{Floating Leg}}$$

---

## 6-나) 입력변수 (Input Parameters)

| 입력변수 | 시장 관찰 가능성 | IFRS 13 Level | 내부 시스템 |
|---------|--------------|--------------|-----------|
| 원화 금리 스왑 곡선 (KRW OIS/IRS) | Observable | **Level 2** | STORM: KRW_SWAP_CURVE |
| 단기 CD금리 / SOFR | Observable | **Level 2** | STORM: CD_3M, SOFR_INDEX |
| 거래 상대방 신용스프레드 | Observable (대형 금융기관) | **Level 2** | Goldnet: CTPTY_CDS_SPREAD |
| CVA/DVA 조정 | 부분 Observable | **Level 2~3** | 공정가치위원회 포털 |

**IFRS 13 공정가치 위계:** Plain Vanilla IRS → 통상 **Level 2** (시장에서 관찰 가능한 입력변수만 사용)

---

## 6-다) 평가 방법론

### 고정 레그 현재가치

$$V_{\\text{Fixed}} = N \\times K \\times \\sum_{i=1}^{n} \\alpha_i \\times D(0, t_i)$$

### 변동 레그 현재가치

OIS 할인 프레임워크(Dual-Curve) 적용:

$$V_{\\text{Float}} = N \\times \\left[ D^{\\text{disc}}(0, t_0) - D^{\\text{disc}}(0, t_n) + \\sum_{i=1}^{n} s_i \\times \\alpha_i \\times D^{\\text{disc}}(0, t_i) \\right]$$

- $D^{\\text{disc}}(0, t_i)$: OIS 기반 할인인수 (Discount Factor)
- $s_i$: 스프레드 (e.g., SOFR vs. OIS 스프레드)

### Greeks 산출 (FRTB SA 기준)

| Greek | 산출 방법 | 충격 크기 |
|-------|---------|---------|
| **GIRR Delta** | Bump-and-reprice (만기 버텍스별) | +1bp per vertex |
| **GIRR Curvature** | Up/Down 전체 곡선 평행 이동 | ±전체 이동 |
| **CSR Delta (CVA 헤지)** | 신용스프레드 버텍스별 +1bp | +1bp |

### 검증 방법 (IPV)

- **독립가격검증(IPV):** 트레이더 평가와 독립적인 시장 데이터로 재평가 (일일)
- **공정가치위원회:** 분기별 Level 분류 및 조정 승인
- **Back-testing:** VaR 모델 사후검증 (일일 P&L vs. VaR 비교)

### CVA/DVA/FVA 적용

$$V_{\\text{adj}} = V_{\\text{Risk-Free}} - \\text{CVA} + \\text{DVA} - \\text{FVA}$$

- **CVA:** 거래 상대방 부도 위험 조정 (자산 측면)
- **DVA:** 자기 자신의 부도 위험 조정 (부채 측면)
- **FVA:** 담보 조달 비용 조정 (CSA 미체결 거래)
      `,
    },
    cashflow: {
      title: '현금흐름 조감도',
      content: `
## IRS 현금흐름 구조

Plain Vanilla IRS는 **명목원금 교환 없이** 고정금리와 변동금리의 **이자 차액만 결제**합니다.

### 결제 메커니즘

| 시점 | 내용 | 결제 방향 |
|------|------|---------|
| **Effective Date** | 거래 개시 (현금 교환 없음) | — |
| **각 Payment Date** | 고정금리 vs. 변동금리 이자 차액 결제 | Net Settlement |
| **Termination Date** | 최종 차액 결제 (명목원금 미교환) | Net Settlement |

### 차액 결제 공식

$$\\text{순 결제액} = N \\times (CDt - K) \\times \\alpha$$

- $CDt > K$ 이면 → Fixed Rate Receiver가 Fixed Payer에게 지급
- $CDt < K$ 이면 → Fixed Rate Payer가 Fixed Rate Receiver에게 지급

### 헤지 관점 (고객 = Fixed Rate Payer)

변동금리 차입자(고객)가 IRS로 금리 상승 리스크를 고정하는 경우:
- 고객은 IRS에서 고정금리를 지급 + 대출에서 변동금리를 지급
- IRS에서 변동금리를 수취 → **실질 차입 비용 = 고정금리(K)로 확정**
      `,
      diagram: {
        parties: [
          {
            id: 'fixed-payer',
            name: '고객 (기업)',
            role: 'Fixed Rate Payer\n변동금리 수취',
            type: 'client',
          },
          {
            id: 'fixed-receiver',
            name: '딜러 은행',
            role: 'Fixed Rate Receiver\n변동금리 지급',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'gross',
            label: '총액 결제 개념도',
            description: '실제로는 두 레그의 차액(Net)을 한 번에 결제합니다. 위 다이어그램은 개념 이해를 위한 총액 기준 표시입니다.',
            arrows: [
              {
                from: 'fixed-payer',
                to: 'fixed-receiver',
                label: '고정금리 쿠폰 지급',
                sublabel: 'K × N × α (예: 3.50% × 100억 × 0.25)',
                timing: 'periodic',
                type: 'neutral',
              },
              {
                from: 'fixed-receiver',
                to: 'fixed-payer',
                label: '변동금리 쿠폰 수취',
                sublabel: 'CDt × N × α (매 분기 재설정)',
                timing: 'periodic',
                type: 'neutral',
              },
            ],
          },
          {
            id: 'rate-up',
            label: '금리 상승 시 (CDt > K)',
            description: '변동금리(CDt = 4.5%)가 고정금리(K = 3.5%)를 초과 → 딜러 은행이 고객에게 차액을 지급합니다. Fixed Rate Payer(고객)에게 유리한 시나리오입니다.',
            arrows: [
              {
                from: 'fixed-receiver',
                to: 'fixed-payer',
                label: '차액 순지급',
                sublabel: '(CDt − K) × N × α = (4.5% − 3.5%) × 100억 × 0.25 ≈ 2,500만원',
                timing: 'periodic',
                type: 'positive',
              },
            ],
          },
          {
            id: 'rate-down',
            label: '금리 하락 시 (CDt < K)',
            description: '변동금리(CDt = 2.5%)가 고정금리(K = 3.5%) 미만 → 고객이 딜러 은행에 차액을 지급합니다. Fixed Rate Payer(고객)에게 불리한 시나리오입니다.',
            arrows: [
              {
                from: 'fixed-payer',
                to: 'fixed-receiver',
                label: '차액 순지급',
                sublabel: '(K − CDt) × N × α = (3.5% − 2.5%) × 100억 × 0.25 ≈ 2,500만원',
                timing: 'periodic',
                type: 'negative',
              },
            ],
          },
          {
            id: 'at-par',
            label: '금리 = 고정금리 (Break-even)',
            description: '변동금리(CDt)가 고정금리(K = 3.5%)와 동일하면 차액이 0이 되어 어느 쪽도 지급하지 않습니다.',
            arrows: [],
          },
        ],
        notes: [
          '명목원금(Notional)은 이자 계산 기준이며 실제로는 교환되지 않습니다.',
          'Day Count: Fixed Leg = Actual/365, Floating Leg = Actual/365 (KRW 기준)',
          'Business Day Convention: Modified Following — 결제일이 영업일이 아니면 다음 영업일로 조정',
          'Calculation Agent(통상 딜러 은행)가 변동금리 재설정 및 결제금액을 산출합니다.',
        ],
      },
    },
  },
};
