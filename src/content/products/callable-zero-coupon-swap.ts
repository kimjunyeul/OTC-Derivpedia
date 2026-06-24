import type { Product } from '@/types/product';

export const callableZeroCouponSwap: Product = {
  id: 'callable-zero-coupon-swap',
  name: '콜러블 제로쿠폰 스왑',
  fullName: 'Callable KRW Zero Coupon Swap (30Y)',
  categoryId: 'interest-rate',
  tags: [
    '제로쿠폰', '콜러블', 'Callable', '금리스왑', 'KRW',
    '3M CMT', '선형증가', '단리', '장기ALM', '30년',
    '조기종료권', '업프론트', 'ISDA 2021', '민평',
  ],
  difficulty: 4,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

**콜러블 제로쿠폰 스왑(Callable Zero Coupon Swap)**은 다음 세 개의 레그(Leg)를 결합한 장기 금리 파생상품입니다:

1. **제로쿠폰 레그 (Fixed Amounts I):** 만기에 단리(선형) 방식으로 적립된 이자를 일괄 지급
2. **고정금리 레그 (Fixed Amounts II):** 초기 2년간 고정금리를 분기마다 지급
3. **변동금리 레그 (Floating Amounts):** 2년 이후 만기까지 KRW 3M CMT를 분기마다 지급

여기에 **Party A(제로쿠폰 지급자)의 연 1회 조기종료 권리(Callable Option)**가 내재되어 있습니다.

> **예시 거래 (Shinhan Securities ↔ Kyobo Securities, 2024-05-08 체결):**
> Party A: 신한투자증권 | Party B: 교보증권
> Effective Date: 2024-05-14 | Termination Date: 2054-05-14 (30년)
> 명목원금: KRW 1,000억 | 업프론트: KRW 8억 (Party A → Party B)
> 제로쿠폰 선형금리: **6.40% p.a.** (단리, 30/360) | 최종 지급액: **KRW 1,920억**
> 고정금리 (2년): 3.286% (ACT/365) | 변동금리 (28년): KRW 3M CMT + 20bps (ACT/365)
> 콜 행사일: 매년 5월 14일 (2026~2053년, 총 28회 기회)

## 선형(단리) 이자 적립 방식

이 상품의 제로쿠폰 레그는 복리가 아닌 **단리(선형, Linear)** 방식으로 이자를 계산합니다.

$$\\text{제로쿠폰 종료금액} = N \\times r_{\\text{linear}} \\times T$$

- $N = 1{,}000\\text{억 (명목원금)}$
- $r_{\\text{linear}} = 6.40\\%$ (연 선형금리)
- $T$: 경과 연수 (최대 30년)

**비교:**

| 방식 | 30년 후 이자 | 산출 기준 |
|------|------------|---------|
| **선형(단리, 본 상품)** | 1,000억 × 6.40% × 30 = **1,920억** | 원금에 단순 곱셈 |
| 복리 (참고용) | 1,000억 × [(1.064)³⁰ − 1] ≈ 5,290억 | 이자에도 이자 |

선형 방식을 쓰면 복리보다 **훨씬 낮은** 종료금액이 됩니다. 이는 고정 레그 지급자(Party A)에게 유리하고, 제로쿠폰 수취자(Party B)에게 불리한 구조입니다.

## 경제적 구조 직관

\`\`\`
                  ┌─────────────────────────────────────────────┐
                  │   업프론트: KRW 8억 (콜 옵션 프리미엄)       │
Party A ─────────────────────────────────────────────▶ Party B
(신한투자증권)    │                                             │ (교보증권)

[고정 2년, 분기]  ◀──── 3.286% × 1,000억 × DCF ───────────────┤
[변동 28년, 분기] ◀──── (CMT3M + 20bps) × 1,000억 × DCF ──────┤
[만기/콜 시]      ────── 제로쿠폰 종료금액 (최대 1,920억) ──────▶
                  └─────────────────────────────────────────────┘
\`\`\`

- Party A는 변동금리(CMT3M)를 수취하면서, 만기에 선형으로 적립된 이자를 일괄 지급
- Party B는 변동금리를 지급하고, 만기에 1,920억을 수취 — **초장기 제로쿠폰 채권을 합성적으로 매수**하는 효과
- Party A는 콜 권리(8억 프리미엄 지급)로 금리 하락 시 조기종료 가능

## 거래 목적

| 목적 | 해당 당사자 | 내용 |
|------|-----------|------|
| **초장기 ALM** | Party B (교보증권) | 30년 만기 제로쿠폰 수취 → 보험사/연금의 장기 부채(보험금 등) 듀레이션 매칭 |
| **변동금리 수익 제고** | Party A (신한증권) | CMT3M 수취 + 선형 금리 지급 스프레드 추구 |
| **콜옵션 활용** | Party A | 금리 하락 시 선형 종료금액(더 낮은 금액)으로 조기 청산, 의무 경감 |

## 관련 계약 및 규제

- **ISDA Master Agreement (2021 Interest Rate Derivatives Definitions):** 거래 법적 기본 계약
- **NDST Standard Terms Supplement:** Non-Deliverable Swap 거래 기준 조건
- **KOFIA 민평 4사:** KRW 3M CMT 금리 산출 기준 기관
- **K-IFRS 제1109호:** 콜 옵션 내재 스왑 — OCI 또는 당기손익 처리
- **FRTB (BCBS 457):** GIRR 민감도 (30년 장기 버텍스, Swaption Vega) 산출 필요
      `,
    },
    structure: {
      title: '상품 구조',
      content: `
## 전체 3-Leg 구조 개요

| Leg | 지급자 | 내용 | 기간 | 주기 |
|-----|-------|------|------|------|
| **Fixed Amounts I (ZCB)** | Party A | 선형 단리 6.40% 이자 일괄 지급 | 30년 (만기/콜 시) | 일시불 |
| **Fixed Amounts II** | Party B | 고정금리 3.286% × 1,000억 × DCF | 2년 (2024.08~2026.05) | 분기 |
| **Floating Amounts** | Party B | (CMT3M + 20bps) × 1,000억 × DCF | 28년 (2026.05~2054.05) | 분기 |

---

## Leg 1: 제로쿠폰 레그 (Fixed Amounts I)

### 구조
- **지급자:** Party A (신한투자증권)
- **지급 방식:** 기간 중 이자 없음(Zero Coupon), 만기 또는 조기종료 시 일괄 지급
- **선형금리:** 6.40% per annum (30/360, unadjusted)
- **최종 지급액 (만기 30년):** KRW **1,920억** (= 1,000억 × 6.40% × 30)

### 업프론트 지급
Party A는 거래 개시일(2024-05-14)에 **KRW 8억**을 Party B에게 지급합니다.
이 금액은 Party A가 보유하는 콜 옵션(조기종료권)의 **프리미엄**에 해당합니다.

### 제로쿠폰 적립 구조

$$\\text{년도 } N \\text{의 종료금액} = 6.40\\% \\times 1{,}000\\text{억} \\times N = 64\\text{억} \\times N$$

연도별 종료금액은 매년 64억씩 선형(균등)으로 증가합니다.

---

## Leg 2: 고정금리 레그 (Fixed Amounts II) — 초기 2년

### 구조
- **지급자:** Party B (교보증권)
- **명목원금:** KRW 1,000억
- **고정금리:** 3.286% per annum (ACT/365, adjusted)
- **지급 주기:** 분기 (2월 14일, 5월 14일, 8월 14일, 11월 14일)
- **기간:** 2024년 8월 14일 ~ 2026년 5월 14일 (총 8회)

### 분기 지급액 (예시)
$$\\text{분기 고정금리 지급액} = 1{,}000\\text{억} \\times 3.286\\% \\times \\frac{90}{365} \\approx 8.1\\text{억}$$

총 2년간 고정금리 지급액 ≈ **65.7억** (8회 합산)

**초기 2년 고정금리 설계 이유:**
현재 시장금리(CMT3M) 수준에서 고정금리 3.286%를 확정하여 Party B에게 초기 2년간 안정적인 지급 부담을 제공. 이후 변동금리(CMT3M)로 전환.

---

## Leg 3: 변동금리 레그 (Floating Amounts) — 2년 이후 28년

### 구조
- **지급자:** Party B (교보증권)
- **명목원금:** KRW 1,000억
- **변동금리:** KRW 3M CMT + **20bps** spread
- **지급 주기:** 분기 (2월 14일, 5월 14일, 8월 14일, 11월 14일)
- **기간:** 2026년 5월 14일 ~ 2054년 5월 14일 (28년, 최대 112회)

### KRW 3M CMT 정의

KRW 3M CMT(3개월 상수만기 국채금리)는 매 리셋일 직전 영업일 기준, KOFIA가 고시하는 **민평 4사(국채평가기관 4개사)의 3개월 국채 YTM 평균값**으로, Bloomberg CHECK Expert+ 3430 페이지에서 오후 6시에 확정됩니다.

### 분기 변동금리 지급액 공식

$$\\text{분기 변동금리 지급액} = 1{,}000\\text{억} \\times (\\text{CMT3M} + 0.20\\%) \\times \\frac{\\text{days}}{365}$$

| CMT3M 수준 | 분기 지급액 (예시, 91일 기준) | 연간 예상 지급액 |
|-----------|--------------------------|--------------|
| 2.0% | 5.5억 | 22.0억 |
| 3.0% | 8.0억 | 32.0억 |
| 3.286% (현 고정금리 수준) | 8.7억 | 34.9억 |
| 4.0% | 10.5억 | 42.0억 |
| 5.0% | 13.0억 | 52.0억 |
| 6.4% (제로쿠폰 선형금리) | 16.6억 | 66.4억 |

---

## 조기종료 옵션 (Optional Early Termination)

### 행사 조건

Party A는 매년 **5월 14일** (2026년 ~ 2053년, 총 28회)에 18 영업일 전 서면 통보를 통해 거래 전체를 조기종료할 수 있습니다.

### 조기종료 금액 (Schedule A — 선형 증가)

$$\\text{조기종료 금액} = 6.40\\% \\times 1{,}000\\text{억} \\times N = 64\\text{억} \\times N \\text{ (N = 행사 시점의 경과 연수)}$$

| 행사연도 | 경과 연수 | 조기종료 금액 | 비고 |
|---------|---------|------------|------|
| 2026-05-14 | 2년 | 128억 | 최초 행사 가능일 |
| 2027-05-14 | 3년 | 192억 | |
| 2030-05-14 | 6년 | 384억 | |
| 2034-05-14 | 10년 | 640억 | |
| 2044-05-14 | 20년 | 1,280억 | |
| 2053-05-14 | 29년 | 1,856억 | 최후 행사 가능일 |
| 2054-05-14 | 30년 | 1,920억 | 만기 최종 지급 |

### Party A가 콜을 행사하는 시점

Party A(신한)가 콜을 행사하면 현재 경과 N년 × 64억만 지급하고 남은 의무를 소멸시킬 수 있습니다. 금리 하락 시 미래 1,920억 의무의 현재가치(PV)가 상승하므로 조기종료로 손실을 제한합니다.

$$\\text{콜 행사 유인} \\Leftrightarrow \\text{PV}_{\\text{market}}(\\text{남은 ZCB 의무}) > \\text{현재 선형 종료금액}$$

즉, **장기 금리가 하락할수록** PV가 올라가므로 Party A의 콜 행사 유인이 커집니다.
      `,
    },
    risk: {
      title: '리스크',
      content: `
## Party A (신한, 콜 보유자) 관점 리스크

### 핵심 리스크: 금리 하락 시 대규모 ZCB 부채 부담

Party A는 최대 1,920억의 제로쿠폰 부채를 보유합니다. 장기 금리가 하락하면 이 부채의 현재가치(PV)가 급격히 상승합니다.

$$\\text{ZCB PV} \\approx \\frac{1{,}920\\text{억}}{(1 + r)^{30}}$$

| 장기 금리 (r) | ZCB PV | 변화 |
|------------|--------|------|
| 5% → 4% | 469억 → 640억 | +171억 증가 |
| 4% → 3% | 640억 → 791억 | +151억 증가 |

콜 행사를 통해 이 리스크를 관리할 수 있으나, 콜 행사 시 종료금액도 선형으로 증가합니다.

### 스프레드 리스크

Party A의 수익은 수취하는 CMT3M과 지급하는 선형 6.40% 간의 스프레드에서 발생합니다. CMT3M이 낮아지면 Party A의 수취액이 줄고 수익성이 악화됩니다.

---

## Party B (교보, 제로쿠폰 수취자) 관점 리스크

### 핵심 리스크 1: CMT3M 상승 — 변동금리 지급 부담 증가

Party B는 28년간 CMT3M에 연동된 변동금리를 지급합니다. CMT3M이 상승하면 총 지급 부담이 커져 1,920억 수취의 실질적 이익이 줄어듭니다.

$$\\text{Party B 순 이익 (만기)} = 1{,}920\\text{억} - 65.7\\text{억(고정)} - \\text{CMT3M} \\times 1{,}000\\text{억} \\times 28$$

**손익분기 CMT3M:**
$$\\text{CMT3M}_{\\text{BE}} = \\frac{1{,}920 - 65.7}{1{,}000 \\times 28} \\approx 6.62\\%$$

CMT3M 평균이 6.62% 이상이 되면 Party B에게 손실이 발생합니다.

### 핵심 리스크 2: 조기종료(콜) 위험

Party A가 콜을 행사하면 Party B는 예상보다 훨씬 적은 종료금액을 수취합니다.

예) 2년 후 콜 행사 시:
- Party B 수취: 128억 (= 64억 × 2년)
- Party B 지급(2년 고정): 65.7억
- 순 수취: 62.3억 (2년간, 명목원금 1,000억 대비 6.23%)

→ 만기 30년까지 보유하여 1,920억 전액을 받는 대신 조기 청산됩니다.

### 핵심 리스크 3: 30년 장기 유동성 리스크

30년 만기의 장외 파생상품으로, 중도 해지 시 상당한 비용이 발생합니다. 특히 금리 급변 시 MTM이 크게 달라져 해지 비용 예측이 어렵습니다.

---

## FRTB 리스크 분류

| 리스크 요인 | FRTB 분류 | 산출 방법 |
|-----------|---------|---------|
| KRW 금리 기간구조 (GIRR) | GIRR Delta | 30Y 버텍스 +1bp |
| GIRR Curvature | GIRR Curvature | 전체 곡선 이동 |
| CMT3M 금리 변동 | GIRR Delta (3M 버텍스) | 3M 버텍스 +1bp |
| 콜 옵션 (Swaption Vega) | Vega | IV 변동, 만기별 버킷 |

### 리스크 점검 항목

- ☐ 30년 KRW GIRR DV01 산출 및 헤지 전략 수립
- ☐ CMT3M 스프레드 모니터링 (최초 2년 고정 → 이후 변동 전환 시 영향)
- ☐ Party A 콜 행사 시나리오별 MTM 및 종료금액 시뮬레이션
- ☐ 콜 옵션 Vega: 장기 금리 변동성 변화 시 옵션 가치 재산출
- ☐ CVA: Party B (교보증권) 신용스프레드 모니터링
      `,
      riskRadar: [
        { subject: '금리 방향성', value: 5, fullMark: 5 },
        { subject: '콜 옵션 리스크', value: 4, fullMark: 5 },
        { subject: '초장기 유동성', value: 4, fullMark: 5 },
        { subject: '스프레드 리스크', value: 3, fullMark: 5 },
        { subject: '모델 리스크', value: 4, fullMark: 5 },
        { subject: '거래상대방 리스크', value: 3, fullMark: 5 },
      ],
    },
    pnl: {
      title: '손익 분석',
      content: `
## Party B (교보, 제로쿠폰 수취자) 관점 손익 분석

### 만기 보유 시 누적 순 현금흐름 (미할인 기준)

$$\\text{Party B 순 수익} = 1{,}920\\text{억} - 65.7\\text{억(고정)} - \\overline{\\text{CMT3M}} \\times 1{,}000\\text{억} \\times 28$$

여기서 $\\overline{\\text{CMT3M}}$은 28년간 CMT3M 평균입니다.

| CMT3M 평균 | 변동금리 총 지급 | 순 수익 | 명목원금 대비 |
|-----------|--------------|--------|------------|
| 0% | 0억 | 1,854억 | +185.4% |
| 2% | 560억 | 1,294억 | +129.4% |
| 3.286% (현 고정) | 920억 | 934억 | +93.4% |
| 5% | 1,400억 | 454억 | +45.4% |
| **6.62% (손익분기)** | **1,854억** | **~0** | **0%** |
| 7% | 1,960억 | -106억 | -10.6% |
| 8% | 2,240억 | -386억 | -38.6% |

### 조기종료 시나리오 (2026년 — 2년 후 Party A 콜 행사)

| CMT3M 평균 | 변동금리 총 지급 (2년) | ZCB 수취 | 순 수익 | 명목원금 대비 |
|-----------|-------------------|---------|--------|------------|
| 0% | 0억 | 128억 | 62.3억 | +6.2% |
| 3% | 60억 | 128억 | 2.3억 | +0.2% |
| 5% | 100억 | 128억 | -37.7억 | -3.8% |

> 조기종료 시 Party B가 받는 금액은 훨씬 적어집니다. 특히 2년 후 콜 행사 시 1,920억 대신 128억만 수취하여, Party B 입장에서는 **조기종료가 불리**합니다.

### 콜 행사 여부와 Party A의 의사결정

Party A는 콜 행사 시 지급하는 '선형 종료금액'과 '시장에서의 ZCB 공정가치(PV)' 중 작은 것을 선택합니다:

$$\\text{콜 행사 시 이익} = \\max\\left(0,\\ V_{\\text{ZCB,market}} - \\text{선형 종료금액}\\right)$$

금리가 크게 하락할수록 $V_{\\text{ZCB,market}}$이 높아지므로 콜 행사가 유리해집니다.
      `,
      payoffScenarios: [
        {
          id: 'to-maturity',
          label: '만기 보유 시 Party B 누적 순 수익 (30년)',
          color: '#0066CC',
          data: [
            { spot: 0, payoff: 185.4 },
            { spot: 1, payoff: 157.4 },
            { spot: 2, payoff: 129.4 },
            { spot: 3, payoff: 101.4 },
            { spot: 4, payoff: 73.4 },
            { spot: 5, payoff: 45.4 },
            { spot: 6, payoff: 17.4 },
            { spot: 6.6, payoff: 0.3 },
            { spot: 7, payoff: -10.6 },
            { spot: 8, payoff: -38.6 },
          ],
        },
        {
          id: 'called-2y',
          label: '2년 후 Party A 콜 행사 시 Party B 수익',
          color: '#FF6B00',
          dashed: true,
          data: [
            { spot: 0, payoff: 6.2 },
            { spot: 1, payoff: 4.5 },
            { spot: 2, payoff: 2.8 },
            { spot: 3, payoff: 0.2 },
            { spot: 4, payoff: -2.5 },
            { spot: 5, payoff: -3.8 },
            { spot: 6, payoff: -5.0 },
            { spot: 7, payoff: -6.5 },
            { spot: 8, payoff: -7.8 },
          ],
        },
      ],
      xLabel: 'CMT3M 평균 금리 (%)',
      yLabel: 'Party B 누적 순 수익 (명목원금 1,000억 대비 %)',
    },
    poison: {
      title: '독소조항',
      content: `
## 독소조항 분석 개요

Callable Zero Coupon Swap은 Party A(콜 보유자)와 Party B(제로쿠폰 수취자) 간의 구조적 비대칭이 극명합니다. Party B 입장에서 특히 주의해야 할 조항들이 많습니다.
      `,
      clauses: [
        {
          name: 'Party A 단독 콜 행사권 — 비대칭 조기종료',
          level: 'high',
          description:
            'Party A(신한)만 연간 조기종료권(콜)을 가집니다. Party A는 금리가 하락하여 ZCB 부채의 현재가치가 선형 종료금액보다 클 때 콜을 행사하여 손실을 제한합니다. Party B는 이에 대응할 수단이 없으며, 가장 불리한 시점(예: 금리 하락으로 재투자 환경이 나쁠 때)에 거래가 강제 종료될 수 있습니다. Party B가 기대하던 장기 ZCB 수익(1,920억)을 얻지 못하게 됩니다.',
        },
        {
          name: 'Calculation Agent = Party A — 이해충돌',
          level: 'high',
          description:
            'Party A(신한투자증권)가 Calculation Agent로 단독 지정되어 있어 CMT3M 금리 산출 불가 시 대체 금리를 "good faith, commercially reasonable manner"로 산출합니다. Party A가 콜 행사 여부 및 종료금액 산출에서 이해관계를 가진다는 점에서 독립적 검증이 필요합니다.',
        },
        {
          name: '선형(단리) 종료금액의 복리 대비 불리함',
          level: 'medium',
          description:
            '조기종료 금액이 단리(선형)로 계산되어, 복리 기준으로 기대되는 금액보다 낮습니다. 예: 10년 후 콜 행사 시 선형 종료금액 = 640억이지만, 복리 기준 이자 = 1,000億 × [(1.064)^10 − 1] ≈ 868억입니다. 즉 Party B는 조기종료 시 약 228억의 "이자"를 받지 못하게 됩니다. 이 단리-복리 괴리가 클수록 Party B에게 불리합니다.',
        },
        {
          name: '2년 이후 변동금리 전환 — 장기 CMT3M 리스크 무한 노출',
          level: 'medium',
          description:
            '초기 2년간은 고정금리(3.286%)를 지급하지만, 2026년 이후 만기(2054년)까지 28년간 KRW 3M CMT에 완전히 노출됩니다. 단기 금리가 장기간 높게 유지될 경우(예: 일본 금리 정상화처럼) Party B의 변동금리 총 지급액이 1,920억을 초과하여 순 손실이 발생할 수 있습니다. 28년이라는 초장기 변동금리 리스크는 헤지하기 매우 어렵습니다.',
        },
        {
          name: '30년 초장기 유동성 — 중도 청산 비용',
          level: 'medium',
          description:
            '30년 만기의 장외 파생계약으로 거래 청산 시장이 없습니다. 중도에 포지션을 청산하려면 상대방(Party A)과의 협의 또는 역방향 거래를 통해야 하며, 이 과정에서 bid-ask spread와 금리 변동으로 인한 MTM 손실이 발생할 수 있습니다. 특히 금리가 크게 변한 경우 MTM 손실이 수백억 원에 달할 수 있습니다.',
        },
      ],
    },
    valuation: {
      title: '평가 방법론',
      content: `
## 평가 모델 개요

Callable Zero Coupon Swap의 공정가치는 세 레그의 합산에서 내재 콜 옵션 가치를 조정합니다:

$$V_{\\text{Callable ZCS}} = V_{\\text{ZCB}} + V_{\\text{Fixed II}} + V_{\\text{Float}} - V_{\\text{Call Option}}$$

---

## 1. 제로쿠폰 레그 평가 (Fixed Amounts I)

단리 방식이므로 만기에 단일 현금흐름의 현재가치:

$$V_{\\text{ZCB}} = \\frac{\\text{FTA}}{(1 + r_{\\text{30Y}})^{30}} = \\frac{1{,}920\\text{억}}{(1 + r_{\\text{30Y}})^{30}}$$

단, 조기종료 가능성이 있으므로 기댓값(Expected Value) 접근이 필요합니다.

---

## 2. 고정금리 레그 평가 (Fixed Amounts II, 2년)

표준 고정금리 레그 DCF:

$$V_{\\text{Fixed II}} = \\sum_{i=1}^{8} 1{,}000\\text{억} \\times 3.286\\% \\times \\frac{d_i}{365} \\times D(0, t_i)$$

$D(0, t_i)$: KRW OIS 또는 국채 수익률 기반 할인인수

---

## 3. 변동금리 레그 평가 (Floating Amounts, 28년)

KRW 3M CMT + 20bps 스프레드:

$$V_{\\text{Float}} = \\sum_{j=1}^{112} 1{,}000\\text{억} \\times (\\text{CMT3M}_j + 0.20\\%) \\times \\frac{d_j}{365} \\times D(0, t_j)$$

리셋 날짜별 선도금리(Forward Rate)로 미래 CMT3M을 추정합니다.

---

## 4. 콜 옵션 평가 (Swaption)

Party A가 보유한 콜 옵션 = **Bermudan Swaption** (연 1회 행사 가능, 28회 기회)

Bermudan Swaption은 아래 모델로 평가합니다:

### Hull-White 1-Factor 모델 (LGM)

$$dr_t = [\\theta(t) - a \\cdot r_t] \\, dt + \\sigma \\, dW_t$$

- $a$: 평균회귀 속도 (mean reversion), 통상 1~5%
- $\\sigma$: 금리 변동성 (KRW 장기 Swaption IV 시장에서 캘리브레이션)
- $\\theta(t)$: 현재 수익률 곡선에 맞추는 파라미터

Bermudan Swaption 가치는 트리(Trinomial Tree) 또는 PDE 방식으로 산출하며, 각 콜 시점에서 "계속 보유 vs. 행사" 최적 결정을 역방향(Backward Induction)으로 계산합니다.

---

## 5. 입력변수 및 IFRS 13 Level

| 입력변수 | 시장 관찰 가능성 | IFRS 13 Level |
|---------|--------------|--------------|
| KRW 금리 스왑 곡선 (2~30Y) | Observable | **Level 2** |
| KRW 3M CMT 선도금리 | Observable | **Level 2** |
| KRW 장기 Swaption IV (30Y) | 부분 Observable | **Level 2~3** |
| CMT3M vs. OIS 베이시스 | Observable | **Level 2** |
| Bermudan 콜 옵션 가치 (Hull-White) | 모델 의존 | **Level 2~3** |
| CVA (교보증권 신용스프레드) | Observable (회사채 시장) | **Level 2** |

**IFRS 13 위계:** 전체 거래 → **Level 2~3** (장기 Swaption IV 관찰 어려움)

---

## 6. 업프론트 금액 검증

Party A가 지급한 8억이 적절한 콜 옵션 프리미엄인지 확인:

$$V_{\\text{Call,Bermudan}} \\overset{?}{=} 8\\text{억}$$

8억 / 1,000억 = 0.8% 수준의 Bermudan Swaption 프리미엄. 금리 변동성(σ)과 잔존 만기(28년) 대비 합리적 범위인지 시장 Swaption Matrix 대비 검증이 필요합니다.

---

## 7. DV01 및 주요 리스크 지표

| 지표 | 대략적 크기 | 설명 |
|------|----------|------|
| **GIRR DV01 (30Y ZCB)** | 약 50~55억/1bp | 1,920억 × 30년 ZCB의 금리 민감도 |
| **GIRR DV01 (3M CMT)** | 약 0.7억/1bp | 분기 변동 레그 단기 민감도 |
| **Swaption Vega** | 약 2~5억/1% IV | 30Y 금리 변동성 변화 민감도 |
| **CMT-OIS 스프레드 CS01** | 약 0.7억/1bp | 민평 스프레드 변화 민감도 |
      `,
    },
    cashflow: {
      title: '현금흐름 조감도',
      content: `
## 현금흐름 타임라인

\`\`\`
2024-05-14 (Effective Date)
│  Party A → Party B: 8억 (Upfront, 콜 옵션 프리미엄)
│
│ [2024.08 ~ 2026.05: Fixed 2Y, 분기 8회]
├─ Party B → Party A: 3.286% × 1,000억 × DCF ≈ 8.1억/분기 (×8회)
│
│ [2026.05 ~ 2054.05: Floating 28Y, 분기 ~112회]
├─ Party B → Party A: (CMT3M+20bps) × 1,000억 × DCF (매분기, 금리 변동)
│
│ [2026.05 ~ 2053.05: 콜 행사 가능 기간, 연 1회 × 28년]
├─ (Party A 콜 행사 시) Party A → Party B: N×64억 + Party B → A: 당회 변동금리
│
2054-05-14 (Termination Date, 콜 미행사 시)
   Party A → Party B: 1,920억 (Final Termination Amount)
   Party B → Party A: 당회 변동금리 (마지막 분기)
\`\`\`
      `,
      diagram: {
        parties: [
          {
            id: 'party-a',
            name: '신한투자증권 (Party A)',
            role: '제로쿠폰 지급자\n콜 옵션 보유',
            type: 'dealer',
          },
          {
            id: 'party-b',
            name: '교보증권 (Party B)',
            role: '제로쿠폰 수취자\n변동금리 지급',
            type: 'client',
          },
        ],
        scenarios: [
          {
            id: 'upfront',
            label: '거래 개시일 — 업프론트 지급',
            description: '2024년 5월 14일, Party A(신한)가 콜 옵션 프리미엄으로 8억원을 Party B(교보)에게 지급합니다. 이 금액은 Party A가 향후 28회의 조기종료 권리를 확보하는 대가입니다.',
            arrows: [
              {
                from: 'party-a',
                to: 'party-b',
                label: '콜 옵션 프리미엄 (업프론트)',
                sublabel: 'KRW 8억 (2024-05-14 일시 지급)',
                timing: 'upfront',
                type: 'negative',
              },
            ],
          },
          {
            id: 'fixed-2y',
            label: '초기 2년 — 고정금리 지급 (2024~2026)',
            description: '2024년 8월 14일부터 2026년 5월 14일까지 총 8회, Party B가 Party A에게 3.286% 고정금리를 분기마다 지급합니다. Party A의 입장에서는 안정적인 고정금리 수취 기간입니다.',
            arrows: [
              {
                from: 'party-b',
                to: 'party-a',
                label: '고정금리 분기 지급',
                sublabel: '3.286% × 1,000억 × (days/365) ≈ 8.1억/분기 (8회)',
                timing: 'periodic',
                type: 'positive',
              },
            ],
          },
          {
            id: 'floating-28y',
            label: '이후 28년 — 변동금리 지급 (2026~2054)',
            description: '2026년 5월 이후 만기까지 Party B가 KRW 3M CMT + 20bps를 분기마다 Party A에게 지급합니다. CMT3M 금리 수준에 따라 지급액이 달라지며, 이것이 Party B의 핵심 리스크입니다.',
            arrows: [
              {
                from: 'party-b',
                to: 'party-a',
                label: '변동금리 분기 지급',
                sublabel: '(KRW 3M CMT + 20bps) × 1,000억 × (days/365) — 분기마다 재설정',
                timing: 'periodic',
                type: 'neutral',
              },
            ],
          },
          {
            id: 'call-exercise',
            label: 'Party A 콜 행사 (예: 10년 후, 2034년)',
            description: 'Party A가 2034년 5월 14일(10년 후)에 콜을 행사하면, Party A는 선형 종료금액 640억(= 64억 × 10년)을 Party B에게 지급합니다. 이후 거래는 완전히 종료됩니다. Party B 입장에서는 1,920억을 기대했으나 640억만 수취하는 불리한 결과입니다.',
            arrows: [
              {
                from: 'party-a',
                to: 'party-b',
                label: '조기종료 금액 지급 (10년 콜 행사 예시)',
                sublabel: '64억 × 10년 = 640억 (선형 단리 계산)',
                timing: 'early-termination',
                type: 'positive',
              },
              {
                from: 'party-b',
                to: 'party-a',
                label: '마지막 변동금리 지급',
                sublabel: '당회 CMT3M × 1,000억 × DCF (최종 분기분)',
                timing: 'early-termination',
                type: 'neutral',
              },
            ],
          },
          {
            id: 'maturity',
            label: '만기 상환 (2054년 5월, 콜 미행사 시)',
            description: 'Party A가 30년간 콜을 행사하지 않으면 2054년 5월 14일에 최종 종료금액 1,920억을 Party B에게 지급합니다. Party B 입장에서 가장 유리한 시나리오이며, 30년간 받을 CMT3M을 모두 지급한 대가로 1,920억을 수취합니다.',
            arrows: [
              {
                from: 'party-a',
                to: 'party-b',
                label: '최종 종료금액 일시 지급',
                sublabel: 'KRW 1,920억 = 1,000억 × 6.40% × 30년 (선형 단리)',
                timing: 'maturity',
                type: 'positive',
              },
            ],
          },
        ],
        notes: [
          '선형(단리) 이자율 6.40%는 복리가 아닙니다. 30년 복리 기준이라면 ~6,290억이 되어야 하나, 단리로 1,920억만 지급합니다.',
          '조기종료 금액은 매년 64억씩 균등 증가 (Schedule A): 2026년=128억, 2027년=192억, ... , 2054년(만기)=1,920억.',
          '콜 행사 통보: 행사 예정일 18 영업일 이전 오전 11시(서울 시간) 서면 통보 필요.',
          'KRW 3M CMT 리셋: 각 변동금리 계산 기간 시작일 1 영업일 전 KOFIA 민평 4사 평균값.',
          'Calculation Agent: Party A(신한투자증권). Business Days: New York, Seoul, Singapore.',
        ],
      },
    },
  },
};
