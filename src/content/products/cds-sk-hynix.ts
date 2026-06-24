import type { Product } from '@/types/product';

export const cdsSkHynix: Product = {
  id: 'cds-sk-hynix',
  name: 'CDS (SK하이닉스)',
  fullName: 'Credit Default Swap — SK Hynix Inc. (Single-Name)',
  categoryId: 'credit',
  tags: [
    'CDS', '신용디폴트스왑', 'SK하이닉스', '보호매도', 'ISDA 2014',
    '크레딧이벤트', '경매결제', 'Citibank', '단일명 CDS', '신용파생상품',
    'Protection Seller', 'Floating Rate Payer', '부도', '파산', '채무재조정',
    'Auction Settlement', 'Physical Settlement', 'USY8085FBD16',
  ],
  difficulty: 3,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

**신용디폴트스왑(Credit Default Swap, CDS)**은 **참조 기업(Reference Entity)**에 신용이벤트(Credit Event)가 발생할 경우, **보호 매도자(Protection Seller)**가 **보호 매입자(Protection Buyer)**에게 손실을 보전해 주는 신용 파생상품입니다.

보호 매입자는 그 대가로 계약 기간 동안 **정기적으로 고정 프리미엄(Fixed Rate)**을 지급합니다.

$$\\text{고정 프리미엄} = \\text{명목원금} \\times \\text{CDS 스프레드} \\times \\frac{\\text{days}}{360}$$

$$\\text{보호 지급액 (Credit Event 발생 시)} = \\text{명목원금} \\times (1 - \\text{회수율})$$

## 이번 거래 개요

> **거래 당사자**
> - **보호 매도자 (신한투자증권, "Seller"):** 신용이벤트 발생 시 손실 보전 의무 부담
> - **보호 매입자 (Citibank Korea Inc., "Buyer"):** 정기 프리미엄 지급, 신용이벤트 발생 시 보전금 수취

| 항목 | 내용 |
|------|------|
| **거래일** | 2026년 5월 18일 |
| **개시일** | 2026년 5월 18일 |
| **만기일** | 2027년 6월 20일 (약 13개월) |
| **참조 기업** | SK Hynix Inc. and any Successor |
| **명목원금** | USD 25,000,000 |
| **CDS 스프레드** | 0.30% per annum |
| **주기** | 분기 (6/20, 9/20, 12/20, 3/20 시작: 2026년 6월 20일) |
| **결제 방식** | 경매 결제(Auction Settlement), 대체: 현물 결제 |
| **준거법** | 뉴욕주법 |

## 참조 채무 (Reference Obligation)

| 항목 | 내용 |
|------|------|
| **채무자** | SK Hynix Inc. |
| **ISIN** | USY8085FBD16 |
| **만기** | 2031년 1월 19일 |
| **쿠폰** | 2.375% |
| **선순위 수준** | Senior Level (선순위 채무) |
| **표준 참조 채무** | Applicable |
| **포괄 보증** | Applicable |

## 신한의 포지션: 보호 매도자(Protection Seller)

신한투자증권은 이번 거래에서 **Floating Rate Payer = Protection Seller** 역할로, SK하이닉스에 대한 신용 보험을 판매한 형태입니다.

- **수취:** 0.30% × USD 25M = **연 USD 75,000** (분기 약 USD 18,750)
- **지급 의무 (Credit Event 발생 시):** USD 25M × (100% − 회수율) → 최대 **USD 25,000,000**

> **프리미엄 수입 vs. 잠재 손실의 비대칭성:** 총 프리미엄 수입(~USD 83K)이 최대 손실(USD 25M)의 **0.33%**에 불과. SK하이닉스 신용 위험을 사실상 전량 인수하는 구조.

## 관련 계약 및 규제

- **2014 ISDA Credit Derivatives Definitions:** 크레딧이벤트, 의무 정의, 결제 절차의 기준
- **ISDA Master Agreement + CSA:** 거래 법적 기반 및 담보 조건
- **FRTB CSR Non-Securitisation:** 단일명 CDS 신용 스프레드 민감도 (CS01, JTD)
- **K-IFRS 제1109호:** 신용 파생상품 공정가치 측정 (Level 2)
- **금융감독원 파생상품 거래 보고:** 장외파생상품 거래정보 저장소 보고 의무
      `,
    },
    structure: {
      title: '상품 구조',
      content: `
## 전체 구조 개요

\`\`\`
[정상 상황 — 크레딧이벤트 없음]
Citibank (Buyer) ─── 0.30% × $25M × (days/360) (분기) ───▶ 신한 (Seller)

[크레딧이벤트 발생 시]
신한 (Seller) ─────── $25M × (1 − 회수율) ───────────────▶ Citibank (Buyer)
\`\`\`

## 1. 당사자 및 역할

| 역할 | 당사자 | 의무 |
|------|--------|------|
| **Fixed Rate Payer (Buyer)** | Citibank Korea Inc. | 분기 CDS 프리미엄 지급, Calculation Agent |
| **Floating Rate Payer (Seller)** | 신한투자증권 (Counterparty) | 크레딧이벤트 발생 시 보호 지급 |

## 2. 고정 레그 — 신한이 수취하는 현금흐름

| 항목 | 내용 |
|------|------|
| **CDS 스프레드** | 0.30% per annum |
| **명목원금** | USD 25,000,000 |
| **일수 산정** | Act/360, Adjusted |
| **지급 주기** | 분기 (매년 3/20, 6/20, 9/20, 12/20) |
| **첫 지급일** | 2026년 6월 20일 |
| **마지막 지급일** | 2027년 6월 20일 |

**분기 프리미엄 수취액 (약 91일 기준):**

$$\\text{분기 수취액} \\approx \\$25,000,000 \\times 0.30\\% \\times \\frac{91}{360} \\approx \\text{USD } 18,958$$

**전체 계약 기간 총 프리미엄 (약 13개월, 5회 지급):**

| 지급일 | 기간 | 일수 | 지급액 (예상) |
|--------|------|------|-------------|
| 2026-06-20 | 2026-05-18 ~ 2026-06-20 | 33일 | USD 6,875 |
| 2026-09-20 | 2026-06-20 ~ 2026-09-20 | 92일 | USD 19,167 |
| 2026-12-20 | 2026-09-20 ~ 2026-12-20 | 91일 | USD 18,958 |
| 2027-03-20 | 2026-12-20 ~ 2027-03-20 | 90일 | USD 18,750 |
| 2027-06-20 | 2027-03-20 ~ 2027-06-20 | 92일 | USD 19,167 |
| **합계** | | **398일** | **USD 82,917** |

## 3. 변동 레그 — 크레딧이벤트 발생 시 신한의 지급 의무

### 크레딧이벤트(Credit Event) 정의

이 거래에 적용되는 크레딧이벤트는 다음 **세 가지**:

| 크레딧이벤트 | 정의 | 적용 조건 |
|------------|------|---------|
| **파산(Bankruptcy)** | SK하이닉스의 파산 신청, 지급불능 선언 등 | 즉시 적용 |
| **지급불이행(Failure to Pay)** | 채무 원리금 지급 불이행 (Grace Period 경과 후) | Requirement Amount 이상 채무 |
| **채무재조정(Restructuring)** | 채무 조건 불리하게 변경 (Mod-R 또는 Old-R) | Bond or Loan 적용 |

### 참조 의무 (Reference Obligation)

크레딧이벤트 판정 기준 채무:

- **채무 종류:** Bond or Loan
- **특성:** Not Subordinated, Not Sovereign Lender, Not Domestic Currency, Not Domestic Law, Not Domestic Issuance

### 보호 지급액 산출

**경매 결제(Auction Settlement) 방식:**

$$\\text{보호 지급액} = \\text{명목원금} \\times (\\text{Reference Price} - \\text{Final Price})$$

$$= \\$25,000,000 \\times (100\\% - \\text{경매 낙찰가})$$

- **Reference Price:** 100%
- **Final Price:** 신용 경매(ISDA/CDDC 주관)에서 결정된 부도 채권의 최종 가격
- **회수율 40% 가정 시:** $25M × (100% − 40%) = **USD 15,000,000**
- **회수율 0% 가정 시:** $25M × 100% = **USD 25,000,000** (최대)

**대체 결제: 현물 결제(Physical Settlement)**

경매 결제가 불가한 경우, 신한이 인도 가능 채무(Deliverable Obligation)를 Citibank로부터 액면가($25M)에 매입하는 방식으로 결제.

인도 가능 채무 특성: Bond or Loan, Not Subordinated, Specified Currency, Not Sovereign Lender, Not Domestic Law, Not Domestic Issuance, Assignable Loan, Transferable, Maximum Maturity 30년, Not Bearer

## 4. 거래 종료 조건

| 조건 | 설명 |
|------|------|
| **정상 만기** | 2027년 6월 20일 (크레딧이벤트 없는 경우) |
| **크레딧이벤트 발생 시** | 경매 결제일(최초 Settlement Date)이 만기일로 단축 |

> **주의:** 크레딧이벤트 발생 이후에는 미지급 프리미엄(Accrued Premium)도 정산되며, 신한은 보호 지급액을 납부해야 합니다.
      `,
    },
    risk: {
      title: '리스크',
      content: `
## 핵심 리스크 요인

### 1. 신용이벤트 리스크 (Credit Event Risk) — 최대 리스크

신한이 부담하는 **가장 핵심적인 리스크**. SK하이닉스에 파산·지급불이행·채무재조정 중 하나가 발생하면, 신한은 최대 **USD 25,000,000**을 즉시 지급해야 합니다.

$$\\text{최대 손실} = \\$25,000,000 \\times (1 - \\text{회수율}) \\leq \\$25,000,000$$

- 한국 시장에서 대형 기업의 실제 부도 이력은 낮으나, 반도체 업황 급락·과부채 등 테일 리스크는 상존
- 회수율(Recovery Rate)은 일반적으로 **40% 가정**이나, 실제 경매 결제 시 0~100% 범위로 결정

### 2. 신용스프레드 MTM 리스크 (Mark-to-Market Risk)

크레딧이벤트가 발생하지 않더라도, **SK하이닉스 CDS 스프레드 상승**은 신한 포지션의 시가(MTM) 손실을 초래합니다.

$$\\Delta \\text{MTM} \\approx -\\Delta S \\times \\text{RPV01} \\times N$$

- **CS01 (CDS 1bp 민감도):** 스프레드 1bp 상승 → 약 USD 2,431 MTM 손실 (RPV01 ≈ 0.973)
- 계약 시 스프레드 30bps → 만약 시장 스프레드가 100bps로 확대되면: MTM ≈ −70bps × 0.973 × $25M ÷ 10,000 ≈ **−USD 170,275**
- 반도체 경기 침체, 지정학적 리스크, 한국 신용 시장 전반 악화 시 스프레드 급확대 가능

### 3. 단일 기업 집중 리스크 (Concentration Risk)

전체 명목원금(USD 25M)이 **SK하이닉스 단일 기업**에 집중됩니다.

- 반도체 사이클 리스크: 업황 악화 시 SK하이닉스 재무구조 악화 가능
- AI/HBM 수요 불확실성, 미중 반도체 규제 리스크
- 기업 특유의 테일 리스크(회계 이슈, 경영 리스크 등)가 배제 불가

### 4. Restructuring 크레딧이벤트 리스크

채무재조정(Restructuring)이 크레딧이벤트로 포함되어 있어, **파산 전단계의 채무 조건 변경**만으로도 보호 지급 의무가 발생할 수 있습니다.

- 자발적 채무조정(채권단 협의), 법원 인가 회생계획 등이 해당될 수 있음
- 채무재조정의 신용이벤트 해당 여부는 **ISDA/CDDC(Credit Derivatives Determinations Committee)**가 결정

### 5. 담보 관련 리스크 (Collateral/Margin Risk)

- 신한(Seller)이 CSA에 따라 Citibank(Secured Party)에 Initial Margin을 적립해야 함
- MTM 악화(스프레드 확대) 시 추가 담보(Variation Margin) 납부 의무 발생
- 유동성 위기 시 담보 납부를 위한 자금 조달 압박 가능

### 6. 결제 불확실성 (Settlement Risk)

- 경매 결제(Auction Settlement) 시 Final Price는 ISDA 경매 결과에 따라 결정 → 예측 불가
- 경매 결제가 실패하거나 지연될 경우 현물 결제(Physical Settlement)로 전환 → 인도 가능 채무 조달 부담
- 채권 시장 유동성 부족 시 현물 결제가 어려울 수 있음

### 주요 리스크 점검 항목

- ☐ SK하이닉스 신용등급 및 CDS 스프레드 일별 모니터링
- ☐ CS01 기준 CDS 스프레드 민감도 산출 (잔존 만기 반영)
- ☐ CDDC의 크레딧이벤트 결정 공지 및 경매 일정 모니터링
- ☐ CSA 하 담보 수준(Posted Collateral) 적정성 일별 점검
- ☐ FRTB JTD (Jump-to-Default) 위험액 산출: 명목원금 × (1 − LGD)
- ☐ 반도체 업황, SK하이닉스 재무지표(부채비율, 이자보상배율) 정기 점검
      `,
      riskRadar: [
        { subject: '신용이벤트', value: 5, fullMark: 5 },
        { subject: '집중 리스크', value: 5, fullMark: 5 },
        { subject: '스프레드MTM', value: 3, fullMark: 5 },
        { subject: '담보/마진', value: 3, fullMark: 5 },
        { subject: '결제 리스크', value: 2, fullMark: 5 },
        { subject: '유동성', value: 2, fullMark: 5 },
      ],
    },
    pnl: {
      title: '손익 분석',
      content: `
## 신한(Protection Seller) 기준 손익 구조

### 기본 손익 공식

$$\\text{최종 손익} = \\underbrace{\\text{수취 프리미엄 합계}}_{\\text{+USD 82,917 (만기까지 수취 시)}} - \\underbrace{\\text{보호 지급액}}_{\\text{크레딧이벤트 시만 발생}}$$

$$\\text{보호 지급액} = \\$25,000,000 \\times (1 - R), \\quad R = \\text{회수율}$$

### 시나리오별 손익 (회수율 기준)

크레딧이벤트가 계약 만기의 절반 시점(약 6개월 경과, 프리미엄 약 USD 44,042 수취 후)에 발생하는 경우:

| 회수율 | 보호 지급액 | 수취 프리미엄 | 순 손익 | 명목원금 대비 |
|--------|----------|------------|--------|------------|
| **0%** | −USD 25,000,000 | +USD 44,042 | **−USD 24,955,958** | **−99.8%** |
| **20%** | −USD 20,000,000 | +USD 44,042 | **−USD 19,955,958** | **−79.8%** |
| **40%** | −USD 15,000,000 | +USD 44,042 | **−USD 14,955,958** | **−59.8%** |
| **60%** | −USD 10,000,000 | +USD 44,042 | **−USD 9,955,958** | **−39.8%** |
| **80%** | −USD 5,000,000 | +USD 44,042 | **−USD 4,955,958** | **−19.8%** |
| **100%** | USD 0 | +USD 44,042 | **+USD 44,042** | **+0.2%** |
| **크레딧이벤트 없음** | USD 0 | +USD 82,917 | **+USD 82,917** | **+0.3%** |

### 프리미엄 수익과 최대 손실의 비대칭성

$$\\text{수익 최대 (크레딧이벤트 없음)} = +\\text{USD } 82,917 \\approx +0.33\\%$$

$$\\text{손실 최대 (회수율 0\\%)} = -\\text{USD } 25,000,000 = -100\\%$$

$$\\text{손익 비대칭 배율} = \\frac{25,000,000}{82,917} \\approx 301\\text{배}$$

> 프리미엄 수입 1달러를 벌기 위해 최대 301달러의 손실 위험을 부담합니다. 이는 CDS Protection Seller 포지션의 본질적 특성입니다.

### 손익분기 회수율

$$R^* = 1 - \\frac{\\text{수취 프리미엄}}{\\text{명목원금}} = 1 - \\frac{44,042}{25,000,000} \\approx 99.82\\%$$

> 크레딧이벤트 발생 시 회수율이 **99.82% 미만이면 손실**이 발생합니다. 현실적으로 모든 크레딧이벤트 시나리오에서 신한은 손실을 봅니다.

### 분기별 누적 프리미엄 수취 현황

| 지급일 | 당회 수취액 | 누적 수취액 |
|--------|----------|----------|
| 2026-06-20 | USD 6,875 | USD 6,875 |
| 2026-09-20 | USD 19,167 | USD 26,042 |
| 2026-12-20 | USD 18,958 | USD 45,000 |
| 2027-03-20 | USD 18,750 | USD 63,750 |
| 2027-06-20 | USD 19,167 | **USD 82,917** |
      `,
      payoffScenarios: [
        {
          id: 'credit-event',
          label: '크레딧이벤트 발생 (6개월 시점)',
          color: '#D32F2F',
          data: [
            { spot: 0, payoff: -100 },
            { spot: 20, payoff: -80 },
            { spot: 40, payoff: -60 },
            { spot: 60, payoff: -40 },
            { spot: 80, payoff: -20 },
            { spot: 100, payoff: 0 },
          ],
        },
        {
          id: 'no-credit-event',
          label: '크레딧이벤트 없음 (만기까지 보유)',
          color: '#2E7D32',
          dashed: true,
          data: [
            { spot: 0, payoff: 0.33 },
            { spot: 20, payoff: 0.33 },
            { spot: 40, payoff: 0.33 },
            { spot: 60, payoff: 0.33 },
            { spot: 80, payoff: 0.33 },
            { spot: 100, payoff: 0.33 },
          ],
        },
      ],
      xLabel: 'SK하이닉스 채권 회수율 (%)',
      yLabel: '신한 손익 (명목원금 대비 %)',
    },
    poison: {
      title: '독소조항',
      content: `
## 독소조항 분석 개요

CDS Protection Seller(신한)의 포지션은 구조 자체에서 **비대칭 리스크**를 내포하며, 계약 조건 중 신한에게 불리하게 작용할 수 있는 조항들을 점검합니다.
      `,
      clauses: [
        {
          name: '보호 매도자 Initial Margin 부담 — 비대칭 담보 구조',
          level: 'high',
          description:
            'CSA에 따라 신한(Seller, Pledgor)이 Citibank(Buyer, Secured Party)에게 Eligible Credit Support를 적립해야 합니다. 보호를 받는 측(Citibank)이 아닌 보호를 제공하는 측(신한)이 담보를 제공하는 비대칭 구조입니다. 실질적으로 신한은 CDS 프리미엄을 받으면서도 별도의 담보 비용(담보 자산의 기회비용)을 부담합니다. MTM이 신한에게 불리해질수록(스프레드 확대 시) Variation Margin 추가 납부 의무도 발생합니다.',
        },
        {
          name: '채무재조정(Restructuring) 크레딧이벤트 포함',
          level: 'high',
          description:
            'Bankruptcy, Failure to Pay 외에 Restructuring이 크레딧이벤트로 명시되어 있습니다. 이는 SK하이닉스가 실제 부도에 이르지 않아도, 채권단과의 채무조정(금리 인하, 만기 연장, 원금 감면 등)만으로 보호 지급 의무가 촉발될 수 있음을 의미합니다. Restructuring은 Bankruptcy나 Failure to Pay보다 발생 가능성이 높고 판정 기준이 복잡하여 분쟁 소지가 있습니다.',
        },
        {
          name: '경매 결제 Final Price 불확실성',
          level: 'medium',
          description:
            '크레딧이벤트 발생 시 보호 지급액은 ISDA/CDDC가 주관하는 경매의 Final Price에 의해 결정됩니다. 경매 참여자(딜러)들의 호가에 따라 Final Price가 결정되며, 신한은 이 과정에 실질적 영향력이 없습니다. 시장 유동성이 낮거나 경매 참여가 부족한 경우, Final Price가 실제 채권 가치와 괴리될 수 있습니다. 경매 실패 시 현물 결제(Physical Settlement)로 전환되어 인도 가능 채무 조달 부담이 발생합니다.',
        },
        {
          name: '현물 결제(Physical Settlement) 대체 조항',
          level: 'medium',
          description:
            '경매 결제가 불가한 경우 Physical Settlement로 전환됩니다. 신한은 인도 가능 채무(Deliverable Obligation)를 액면가($25M)에 매입하고, 해당 채권을 보유하게 됩니다. 신용 위기 상황에서 인도 가능 채권의 시장 유동성이 급격히 낮아지면 채권 조달에 어려움이 발생할 수 있으며, 채권을 보유하게 됨으로써 추가적인 신용 리스크 및 유동성 리스크에 노출됩니다.',
        },
        {
          name: '단기 계약 vs. 장기 참조 채무의 미스매치',
          level: 'low',
          description:
            'CDS 계약 만기는 2027년 6월 20일(약 13개월)이지만, 참조 채무(Reference Obligation)의 만기는 2031년 1월 19일(약 4.5년 후)입니다. 계약 만기 이후 발생하는 SK하이닉스 신용이벤트에 대해서는 보호를 제공하지 않지만, 신한이 참조 채무를 별도로 보유하고 있다면 해당 기간의 신용 위험은 헤지되지 않습니다. 참조 채무 보유 여부와 CDS 계약 기간의 매칭 여부를 점검해야 합니다.',
        },
      ],
    },
    valuation: {
      title: '평가 방법론',
      content: `
## CDS 평가 모델

CDS의 공정가치는 **프리미엄 레그(Premium Leg)**와 **보호 레그(Protection Leg)**의 현재가치 차이로 계산됩니다.

$$V_{\\text{CDS}} = V_{\\text{Protection Leg}} - V_{\\text{Premium Leg}}$$

(신한 = Protection Seller 기준: $V_{\\text{CDS, Seller}} = V_{\\text{Premium Leg}} - V_{\\text{Protection Leg}}$)

---

## 1. 프리미엄 레그 평가

$$V_{\\text{Premium}} = S \\times N \\times \\sum_{i=1}^{n} \\alpha_i \\times D(0, t_i) \\times Q(0, t_i)$$

- $S$: CDS 스프레드 = 0.30% p.a.
- $N$: 명목원금 = USD 25,000,000
- $\\alpha_i$: 기간 인수(Act/360 기준)
- $D(0, t_i)$: 무위험 할인인수 (USD SOFR 기반 OIS 커브)
- $Q(0, t_i)$: 참조 기업(SK하이닉스) 생존확률(Survival Probability)

---

## 2. 보호 레그 평가

$$V_{\\text{Protection}} = (1 - R) \\times N \\times \\int_0^T D(0, t) \\cdot (-dQ(0, t))$$

$$\\approx (1 - R) \\times N \\times \\sum_{i=1}^{n} D(0, t_i) \\times [Q(0, t_{i-1}) - Q(0, t_i)]$$

- $R$: 회수율(Recovery Rate) — 표준 가정: **40%**
- $-dQ(0,t)$: 미소 구간 부도 확률 (Hazard Rate $\\lambda$에서 유도)

---

## 3. 생존확률 및 해저드 레이트(Hazard Rate) 부트스트래핑

시장 CDS 스프레드 $S$에서 해저드 레이트를 역산:

$$Q(0, t) \\approx e^{-\\lambda t}, \\quad \\lambda \\approx \\frac{S}{1 - R}$$

**계약 체결 시점 내재 부도 확률 (0.30%, R=40% 가정):**

$$\\lambda = \\frac{0.30\\%}{1 - 40\\%} = 0.50\\% \\text{ per year}$$

$$Q(0, 1\\text{yr}) = e^{-0.005 \\times 1} \\approx 99.5\\%$$

> 시장이 SK하이닉스의 **1년 부도 확률을 약 0.5%**로 평가하고 있음을 의미합니다.

---

## 4. RPV01 (Risky Annuity Factor)

$$\\text{RPV01} = \\sum_{i=1}^{n} \\alpha_i \\times D(0, t_i) \\times Q(0, t_i)$$

약 13개월 계약에서 RPV01 ≈ **0.972** (1bp당 USD 2,431 민감도)

$$\\text{CS01} = N \\times \\text{RPV01} \\times 1\\text{bp} = \\$25M \\times 0.972 \\times 0.0001 = \\text{USD } 2,431$$

---

## 5. 입력 변수 및 IFRS 13 Level

| 입력 변수 | 시장 관찰 가능성 | IFRS 13 Level |
|---------|--------------|--------------|
| USD SOFR OIS 할인 커브 | Observable | **Level 1** |
| SK하이닉스 CDS 스프레드 (Bloomberg/Markit) | Observable | **Level 2** |
| 회수율 (Recovery Rate) 가정 | 시장 관례(40%) | **Level 2** |
| 생존확률 커브 (부트스트래핑 결과) | 모델 산출 | **Level 2** |

**IFRS 13 공정가치 위계: Level 2** (SK하이닉스 CDS 스프레드는 Bloomberg/Markit에서 관찰 가능)

---

## 6. FRTB 민감도 산출

### CSR (Credit Spread Risk) Non-Securitisation

| 구분 | 내용 |
|------|------|
| **버킷** | SK하이닉스 단일명, Senior, Korea, Tech-Hardware |
| **CS01** | 스프레드 1bp 상승 → **USD −2,431** MTM 변화 |
| **만기 버텍스** | 1Y (계약 만기 기준 버텍스에 배분) |

### JTD (Jump-to-Default) Risk

$$\\text{JTD Gross Loss} = N \\times (1 - R) = \\$25M \\times 60\\% = \\text{USD } 15,000,000$$

> R=40% 가정 기준. 최악(R=0%)의 경우 USD 25M까지 확대.

---

## 7. CVA (신용가치조정)

신한이 Citibank에 대한 크레딧 익스포저 보유:

$$\\text{CVA} \\approx \\text{양의 MTM에 대한 Citibank 부도 확률 × LGD}$$

단, 본 거래에서 신한(Seller)의 MTM은 통상 음수(Citibank가 +MTM 보유)이므로 **DVA(Debit Value Adjustment)**가 적용될 수 있습니다.
      `,
    },
    cashflow: {
      title: '현금흐름 조감도',
      content: `
## 현금흐름 구조 설명

이 CDS의 현금흐름은 **두 가지 시나리오**에 따라 완전히 다른 양상을 보입니다.

- **시나리오 1 — 크레딧이벤트 없음:** Citibank가 신한에게 분기마다 고정 프리미엄을 지급하고 만기에 종료
- **시나리오 2 — 크레딧이벤트 발생:** 신한이 Citibank에게 명목원금 × (1 − 회수율)을 일시 지급하고 계약 조기 종료

### 정기 프리미엄 현금흐름 (정상 상황)

\`\`\`
Citibank ─── 0.30% × $25M × (days/360) ───▶ 신한
              (분기 ≈ USD 18,958)
\`\`\`

### 크레딧이벤트 발생 시 정산 흐름

\`\`\`
신한 ─── $25M × (1 − Final Price%) ───▶ Citibank
         (회수율 40% 시 = USD 15,000,000)
\`\`\`
      `,
      diagram: {
        parties: [
          {
            id: 'shinhan',
            name: '신한투자증권',
            role: 'Floating Rate Payer\n(Protection Seller)',
            type: 'client',
          },
          {
            id: 'citibank',
            name: 'Citibank Korea Inc.',
            role: 'Fixed Rate Payer\n(Protection Buyer / Calculation Agent)',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'normal',
            label: '정상 상황 — 크레딧이벤트 없음',
            description: 'SK하이닉스에 크레딧이벤트가 발생하지 않는 경우입니다. Citibank가 신한에게 매 분기(6/20, 9/20, 12/20, 3/20) 고정 프리미엄을 지급합니다. 신한은 총 5회에 걸쳐 약 USD 82,917을 수취하고 계약은 2027년 6월 20일 만기 종료됩니다.',
            arrows: [
              {
                from: 'citibank',
                to: 'shinhan',
                label: '고정 프리미엄 분기 지급',
                sublabel: '0.30% × USD 25M × (days/360) ≈ USD 18,958/분기',
                timing: 'periodic',
                type: 'positive',
              },
            ],
          },
          {
            id: 'credit-event',
            label: '크레딧이벤트 발생 — 경매 결제',
            description: 'SK하이닉스에 크레딧이벤트(파산/지급불이행/채무재조정)가 발생한 경우입니다. ISDA/CDDC 주관 경매에서 Final Price가 결정(예: 회수율 40% → Final Price 40%)되면, 신한은 USD 15,000,000을 Citibank에 지급합니다. 크레딧이벤트 발생 시 경과 프리미엄(Accrued Premium)도 함께 정산됩니다. 계약은 최초 Settlement Date에 조기 종료됩니다.',
            arrows: [
              {
                from: 'citibank',
                to: 'shinhan',
                label: '경과 프리미엄 정산 (Accrued)',
                sublabel: '크레딧이벤트일까지의 미지급 프리미엄',
                timing: 'early-termination',
                type: 'positive',
              },
              {
                from: 'shinhan',
                to: 'citibank',
                label: '보호 지급 (Protection Payment)',
                sublabel: 'USD 25M × (100% − Final Price%) ※ 회수율 40% 시 USD 15,000,000',
                timing: 'early-termination',
                type: 'negative',
              },
            ],
          },
          {
            id: 'physical-settlement',
            label: '대체 결제 — 현물 결제 (경매 실패 시)',
            description: '경매 결제가 불가한 경우 현물 결제(Physical Settlement)로 전환됩니다. Citibank는 인도 가능 채무(Deliverable Obligation, SK하이닉스 채권)를 신한에게 인도하고, 신한은 명목원금(USD 25M)을 전액 지급합니다. 신한은 부도 채권을 보유하게 되어 추가 신용·유동성 리스크에 노출됩니다.',
            arrows: [
              {
                from: 'citibank',
                to: 'shinhan',
                label: '인도 가능 채무 인도',
                sublabel: 'SK하이닉스 채권 (시장가치 < 액면가)',
                timing: 'early-termination',
                type: 'neutral',
              },
              {
                from: 'shinhan',
                to: 'citibank',
                label: '채권 액면가 납부',
                sublabel: 'USD 25,000,000 (전액)',
                timing: 'early-termination',
                type: 'negative',
              },
            ],
          },
        ],
        notes: [
          '신한 = Floating Rate Payer = Protection Seller: 크레딧이벤트 발생 시 최대 USD 25,000,000 지급 의무.',
          '크레딧이벤트: Bankruptcy, Failure to Pay, Restructuring (2014 ISDA Credit Derivatives Definitions 기준).',
          '경매 결제 우선 적용, 경매 실패 시 현물 결제(Physical Settlement) 대체 적용.',
          'Calculation Agent: Citibank Korea Inc. (런던, Business Day: London/New York/Seoul).',
          'Initial Margin: 신한(Pledgor)이 Citibank(Secured Party)에 담보 적립 — CSA 조건 적용.',
          '준거법: 뉴욕주법 (New York Law).',
        ],
      },
    },
  },
};
