import type { Product } from '@/types/product';

export const cashSettledBondForward: Product = {
  id: 'cash-settled-bond-forward',
  name: 'Bond Forward (CS)',
  fullName: 'Cash Settled Bond Forward Sale and Purchase Transaction',
  categoryId: 'interest-rate',
  tags: [
    '채권선도', '현금결제', '금리', '독일국채', '분트', 'ISDA', 'DV01',
    '선도거래', '신용사건', 'CACIB', 'Early Unwind', '레포 대안',
  ],
  difficulty: 3,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

**Cash Settled Bond Forward(현금결제 채권선도)**는 사전에 합의한 **선도 가격(Forward Price)**으로 특정 채권을 미래 시점에 매매하되, 실물 채권의 인도 없이 **시장가격과 선도가격의 차액만 현금으로 수수**하는 장외파생상품입니다.

물리적 채권 전달(Physical Delivery)이 발생하지 않으므로 담보부 레포(Repo)와 경제적 실질은 유사하지만, 현금결제 선도계약의 형태로 체결됩니다. 신용사건(Credit Event) 조항을 내재하여 준거채권 발행사의 디폴트 시 조기청산이 가능한 **금리-신용 하이브리드** 구조입니다.

> **실제 거래 사례 (CACIB ↔ 신한증권, 2026-03-11):**
> - 준거채권: 독일연방국채 DE0001102556 (0% 쿠폰, 2028/11/15 만기)
> - 명목금액: EUR 200,000,000 (2억 유로)
> - 선도가격: 100.06 (clean price)
> - 만기일: 2028년 11월 15일
> - Bond Seller: 신한증권 / Bond Buyer: CACIB

## 거래 목적

| 목적 | 설명 |
|------|------|
| **채권 포지션 헤지** | 채권 보유자가 선도매도를 통해 가격 하락 리스크를 고정 |
| **레포 대안** | 실물 인도 없이 현금 결제로 자금 조달·운용 효과 |
| **금리 방향성 투자** | 채권 가격(금리) 방향성에 베팅하는 선형 포지션 |
| **규제 자본 최적화** | 물리적 채권 보유 대비 리스크 자본 효율화 |

## 거래 당사자 구조

\`\`\`
  신한증권 (Bond Seller)         CACIB (Bond Buyer)
  단기 채권 선도매도         ──선도가격 100.06 합의──

  만기(2028/11/15)에:
  시장가격 < 100.06   ──── CACIB가 차액 지급 ──→  신한증권 수취
  시장가격 > 100.06   ←─── 신한증권이 차액 지급 ─  CACIB 수취
\`\`\`

- **Bond Seller (신한증권):** 선도매도 포지션 — 채권 가격 **하락** 시 이익 (Short Forward)
- **Bond Buyer (CACIB):** 선도매수 포지션 — 채권 가격 **상승** 시 이익 (Long Forward)
- **Calculation Agent:** CACIB — 시장가격 산정, 조기청산금액 결정 담당

## 관련 계약 및 규제

- **ISDA 2021 Swap Definitions + 2014 Credit Derivatives Definitions:** 준거 정의집 (두 정의집 간 충돌 시 Credit Derivatives Definitions 우선)
- **ISDA Master Agreement (2005, CACIB-신한증권 간):** 기본 계약 + Schedule + CSA
- **FRTB (BCBS 457):** GIRR(채권 DV01) + CSR(신용스프레드) 리스크 산출 대상
- **K-IFRS 제1109호:** 파생상품 공정가치 평가 — 헤지회계(Fair Value Hedge) 적용 검토
- **EU EMIR / 자본시장법:** 장외파생상품 거래 보고 의무
      `,
    },

    structure: {
      title: '상품 구조',
      content: `
## 핵심 결제 메커니즘

만기일(Bond Purchase Date)에 Calculation Agent(CACIB)가 시장가격(Market Price)을 확정한 후:

$$\\text{Cash Settlement Amount} = \\text{Nominal} \\times (\\text{Bond Purchase Price} - \\text{Market Price})$$

| 결과 | 방향 | 의미 |
|------|------|------|
| **양수** (Forward Price > Market Price) | CACIB → 신한증권 | 채권 가격 하락 → Bond Seller 이익 |
| **음수** (Forward Price < Market Price) | 신한증권 → CACIB | 채권 가격 상승 → Bond Buyer 이익 |

> **예시:** 2028/11/15 독일국채 시장가 = 99.50% → Cash Settlement = EUR 200M × (100.06% − 99.50%) = **EUR 1,120,000** → CACIB가 신한증권에 지급

## 주요 계약 파라미터

| 항목 | 내용 |
|------|------|
| **Trade Date** | 2026년 3월 11일 |
| **Bond Purchase Date (만기)** | 2028년 11월 15일 |
| **Bond Seller** | 신한증권 주식회사 |
| **Bond Buyer** | Crédit Agricole CIB (CACIB) |
| **준거 채권** | 독일연방국채 DE0001102556 (0% 쿠폰, 2028/11/15 만기) |
| **명목금액** | EUR 200,000,000 |
| **선도가격 (Bond Purchase Price)** | 100.06 (clean price) |
| **Dirty Price** | 100.06 (0% 쿠폰으로 Accrued Interest = 0) |
| **결제통화** | EUR |
| **Business Days** | TARGET (계산), TARGET + Paris + London + Seoul (지급) |
| **Business Day Convention** | Following |
| **Calculation Agent** | CACIB |

## 가격 산정 프로세스 (Price Determination Waterfall)

1. **Primary:** CACIB가 Price Determination Date(만기 2영업일 전) 09:00 Paris 시간에 Firm Bid/Offer 제시
2. **Fallback 1 (분쟁 시):** 신한증권이 Reference Market-Makers(3개 이상 독립 딜러)에서 호가 수집 → 15:00 Cut-Off Time까지
3. **Fallback 2 (부분 호가):** Extended Price Determination Date(최대 2영업일 연장) → 가중평균 적용
4. **최종 (미결정 시):** CACIB가 상업적으로 합리적인 방식으로 선의(Good Faith) 산정

## 조기청산 (Early Unwind) 구조

$$\\text{Early Unwind CSA} = \\text{Nominal} \\times (\\text{Discounted Purchase Price} - \\text{Market Price} - \\text{Accrued Interest})$$

**Discounted Purchase Price** = ①PV(선도가격, @Repo Rate) + ②PV(미경과 채권이자) + ③미지급 경과이자

**Early Unwind Event (7개 조항):**

| 이벤트 | 내용 |
|--------|------|
| Credit Event Determination Date | 독일(Reference Entity) 신용사건 발생 — CDS 정의 준용 |
| Succession Date | 준거기관 합병·분리 등 Succession 확정 |
| Tender Offer | 채권 공개매수 발표 |
| Conversion Event | 채권 전환·합병·재편 |
| Change of Law | 법령 변경으로 거래 유지 불법·비용 급증 |
| Early Redemption Event | 채권 조기상환 |
| Redenomination Event | EUR 표시 중단 선언 |
      `,
    },

    risk: {
      title: '리스크',
      content: `
## 1. 금리 리스크 (DV01) ★★★★☆

채권선도의 핵심 리스크는 **기준금리 변동에 따른 채권 가격 변화**입니다.

$$\\text{DV01} \\approx \\text{Nominal} \\times \\text{Modified Duration} \\times 0.0001$$

DE0001102556 (0% 쿠폰, 만기 2028/11/15, 잔존 약 2.7년 기준):

| 금리 변화 | 채권가격 변화 | Bond Seller P&L |
|---------|------------|----------------|
| +100bp | 약 −2.7% | **+EUR 5.4M 이익** (Short Forward 이익) |
| +50bp | 약 −1.35% | +EUR 2.7M 이익 |
| 0bp | 0% | ±0 |
| −50bp | 약 +1.35% | −EUR 2.7M 손실 |
| −100bp | 약 +2.7% | **−EUR 5.4M 손실** |

### FRTB GIRR Delta 민감도

만기 버텍스: 2Y, 3Y에 집중. EUR 커브 +1bp 충격 × DV01 × Nominal로 산출.

---

## 2. 신용 리스크 (Sovereign + CCR) ★★★★☆

이 거래의 독특한 특징은 **독일 소버린 신용위험이 내재**되어 있다는 점입니다.

### 소버린 신용 리스크
- Early Unwind Event 중 **Credit Event Determination Date** 조항: 독일 연방(Reference Entity) 디폴트·모라토리엄 발생 시 조기청산
- 준거 CDS: 2014 ISDA Credit Derivatives Definitions, Transaction Type = **Standard Western European Sovereign**
- 독일 CDS 스프레드 확대 시 채권가격 하락 + 조기청산 가능성 동시 상승

### 거래 상대방 신용 리스크 (CCR)
- 현금결제 방식이므로 실물 채권 미보유 상태에서 시장가 대비 차액 수수
- CSA(Credit Support Annex) 기반 담보 교환으로 일일 MtM 정산 → CVA 노출 존재
- CACIB(AA 등급 딜러) vs. 신한증권(AA 등급) — 쌍방향 CVA/DVA 적용

---

## 3. 유동성 리스크 ★★★☆☆

- **가격 산정 불능 리스크:** Primary Waterfall 실패 시 Fallback 프로세스 → 결제 지연(최대 2영업일 추가)
- **Partial Quotation 리스크:** EUR 200M 대규모 명목금액으로 단일 호가 수집이 어려울 수 있음
- **Undetermined Amount:** 최종 가격 미결정 시 CACIB의 선의(Good Faith) 산정 — 검증 불가

---

## 4. 법적·운영 리스크 ★★★☆☆

- **Redenomination Event:** EUR 표시 중단(Eurozone 이탈) 시 거래 구조 무력화
- **Change of Law:** 세법·규제 변경으로 헤지 포지션 유지 비용 급증 시 CACIB 조기청산 권리
- **Calculation Agent 겸직:** CACIB가 Calculation Agent이므로 가격 분쟁 시 이해충돌
      `,
      riskRadar: [
        { subject: '금리 민감도', value: 4, fullMark: 5 },
        { subject: '변동성 민감도', value: 1, fullMark: 5 },
        { subject: '신용 리스크', value: 4, fullMark: 5 },
        { subject: '유동성 리스크', value: 3, fullMark: 5 },
        { subject: '모델 리스크', value: 2, fullMark: 5 },
        { subject: '운영 리스크', value: 3, fullMark: 5 },
      ],
    },

    pnl: {
      title: '손익 분석',
      content: `
## 포지션별 P&L 구조 (Nominal EUR 100 기준)

$$P\\&L_{\\text{Bond Seller}} = \\text{Nominal} \\times (\\text{Bond Purchase Price} - \\text{Market Price at Settlement})$$
$$= \\text{EUR 200M} \\times (100.06\\% - P_{\\text{market}})$$

| 만기 시장가격 | Bond Seller (신한증권) | Bond Buyer (CACIB) | 시나리오 해석 |
|------------|---------------------|-------------------|-------------|
| 96.00% | **+4.06%** | −4.06% | 금리 급등, Seller 이익 |
| 98.00% | +2.06% | −2.06% | 금리 상승 |
| 100.06% | **0** | 0 | **손익분기 (Break-even)** |
| 101.00% | −0.94% | +0.94% | 금리 소폭 하락 |
| 103.00% | −2.94% | **+2.94%** | 금리 하락, Buyer 이익 |

> 준거채권(DE0001102556)은 **0% 쿠폰**으로 만기(2028/11/15)에 가격이 100.00%로 수렴.
> 따라서 만기에 가까울수록 시장가격 ≈ 100%, Bond Seller는 약 +0.06% (EUR 120,000) 수취 예상.

## 최대 손익

| 구분 | 내용 |
|------|------|
| **Bond Seller 최대 이익** | 채권가격 → 0% 시 이론적 최대 (Bond Seller = Short Forward) |
| **Bond Seller 최대 손실** | 채권가격 무한 상승 시 이론적 무제한 |
| **Bond Buyer 최대 이익** | 채권가격 무한 상승 시 이론적 무제한 |
| **Break-even** | 만기 시장가격 = 선도가격 **100.06%** |
| **P&L 구조** | 선형 (Linear) — 비선형 요소(옵션) 없음 |
      `,
      xLabel: '만기 채권 시장가격 (%)',
      yLabel: 'P&L (Nominal 100 기준, %)',
      payoffScenarios: [
        {
          id: 'bond-seller',
          label: 'Bond Seller (신한증권) — Short Forward',
          color: '#003087',
          dashed: false,
          data: [
            { spot: 93,     payoff: 7.06 },
            { spot: 95,     payoff: 5.06 },
            { spot: 97,     payoff: 3.06 },
            { spot: 99,     payoff: 1.06 },
            { spot: 100.06, payoff: 0 },
            { spot: 101,    payoff: -0.94 },
            { spot: 103,    payoff: -2.94 },
            { spot: 105,    payoff: -4.94 },
            { spot: 107,    payoff: -6.94 },
          ],
        },
        {
          id: 'bond-buyer',
          label: 'Bond Buyer (CACIB) — Long Forward',
          color: '#D32F2F',
          dashed: true,
          data: [
            { spot: 93,     payoff: -7.06 },
            { spot: 95,     payoff: -5.06 },
            { spot: 97,     payoff: -3.06 },
            { spot: 99,     payoff: -1.06 },
            { spot: 100.06, payoff: 0 },
            { spot: 101,    payoff: 0.94 },
            { spot: 103,    payoff: 2.94 },
            { spot: 105,    payoff: 4.94 },
            { spot: 107,    payoff: 6.94 },
          ],
        },
      ],
    },

    poison: {
      title: '독소조항 분석',
      content: `
## Cash Settled Bond Forward의 핵심 위험 조항

현금결제 채권선도는 **Calculation Agent가 가격 결정권을 독점**하고, **Early Unwind 조항이 광범위하게 적용**되어 거래 상대방(신한증권) 입장에서 불이익 조항이 다수 존재합니다.
      `,
      clauses: [
        {
          name: 'Calculation Agent CACIB 단독 지정',
          level: 'high',
          description:
            'CACIB가 Calculation Agent를 겸직합니다. 만기 Market Price 산정(Firm Bid/Offer 제시), Early Unwind 시 Discounted Purchase Price 계산, 가격 미결정 시 "Good Faith" 산정 등 핵심 가격 결정권이 모두 CACIB에 귀속됩니다. 분쟁 발생 시 독립 검증 수단이 없으며, CACIB의 자체 호가가 1차 Market Price로 인정됩니다.',
        },
        {
          name: 'Early Unwind Event 광범위 적용 (7개 조항)',
          level: 'high',
          description:
            'Tender Offer, Change of Law, Early Redemption Event, Redenomination Event 등 채권선도로서 직접 관련 없어 보이는 이벤트도 조기청산 트리거로 설정되어 있습니다. 특히 Change of Law는 CACIB 또는 신한증권이 "세금 비용 급증 또는 불법"으로 판단하는 경우 어느 쪽이든 조기청산을 선언할 수 있어, 시장에 유리한 포지션을 보유 중일 때도 강제 종료될 수 있습니다.',
        },
        {
          name: '신용사건 내재 (Sovereign CDS 연동)',
          level: 'high',
          description:
            '거래 내에 "Theoretical Credit Derivative Transaction" 개념을 내재하여 독일 연방(Reference Entity)의 신용사건(Credit Event) 발생 시 조기청산이 작동합니다. Standard Western European Sovereign 기준으로 Failure to Pay, Repudiation/Moratorium이 신용사건에 해당하며, 이 경우 채권 가격이 폭락한 상태에서 조기청산이 이루어집니다. 소버린 CDS 포지션을 의도하지 않은 채 보유하게 되는 셈입니다.',
        },
        {
          name: '가격 결정 지연 및 Partial Quotation 리스크',
          level: 'medium',
          description:
            'EUR 200M이라는 대규모 명목금액으로 인해 단일 시장 호가 수집이 어려울 수 있습니다. 부분 호가(Partial Quotation)만 수집된 경우 Extended Price Determination Date(최대 2영업일 연장)와 가중평균 절차가 작동하며, 이 과정에서 Overnight Repo Rate 기반 추가 이자가 발생할 수 있습니다. 최종적으로 미결정 시 CACIB의 선의 산정으로 귀결됩니다.',
        },
        {
          name: '준거채권 관련 Asset Package 조항',
          level: 'medium',
          description:
            '채권에 Early Unwind Event가 발생하여 보유자가 원 채권 대신 다른 증권·현금·권리(Asset Package)를 수취하게 되는 경우, "Bond"의 정의가 해당 Asset Package를 포함하도록 자동 확장됩니다. 이 경우 결제 기준이 되는 자산이 사전에 알 수 없는 형태로 변경될 수 있어 가치 산정이 복잡해집니다.',
        },
        {
          name: '영어 준거법 (English Law)',
          level: 'low',
          description:
            '거래의 준거법이 영국법으로, 모든 통지·분쟁 절차가 영어로만 이루어집니다. ISDA 정의집(Credit Derivatives Definitions, Swap Definitions) 간 충돌 시 Credit Derivatives Definitions가 우선 적용됩니다. 국내 법원 관할 불가, 영국법 해석에 따른 분쟁 처리 비용 및 불확실성이 존재합니다.',
        },
      ],
    },

    valuation: {
      title: '평가 방법론',
      content: `
## 상품 분해 (Decomposition)

Cash Settled Bond Forward ≈ **Long/Short Bond Position (PV 기준)** + **Early Unwind Option (Credit Trigger)**

$$V_{\\text{BF}} = \\underbrace{\\text{Nominal} \\times D(0,T) \\times (F_0 - F_{\\text{market}})}_\\text{채권선도 가치} - \\underbrace{V_{\\text{Early Unwind Option}}}_\\text{조기청산 옵션}$$

---

## 1. 채권선도 공정가치

채권선도의 현재가치(Bond Seller 기준):

$$V_{\\text{BF}} = \\text{Nominal} \\times D(0,T) \\times (F_{\\text{agreed}} - F_{\\text{market}})$$

여기서 시장 선도가격:

$$F_{\\text{market}} = (P_0 - AI_0) \\times \\frac{1}{D^{\\text{repo}}(0,T)} + PV(\\text{Coupons skipped})$$

- $P_0$: 현재 채권 Dirty Price
- $AI_0$: 현재 경과이자 (0% 쿠폰이므로 = 0)
- $D^{\\text{repo}}(0,T)$: Repo Rate 기반 할인인수

**DE0001102556 (0% 쿠폰) 단순화:**

$$F_{\\text{market}} = P_{\\text{spot}} \\times e^{r_{\\text{repo}} \\times T}$$

---

## 2. GIRR Delta 민감도 (FRTB 기준)

| 구분 | 산출 방법 |
|------|---------|
| **EUR GIRR Delta** | 2Y, 3Y 버텍스 각 +1bp 충격 → 채권가 변화 × Nominal |
| **Modified Duration** | 0% 쿠폰 채권 ≈ 잔존만기(T) / (1 + YTM) |
| **DV01 추정** | EUR 200M × (2.7년 / 1.023) × 0.0001 ≈ **EUR 52,787/bp** |

---

## 3. 신용스프레드 민감도

내재된 Sovereign CDS 요소로 인해:

$$\\text{CSR Delta} = \\frac{\\partial V_{\\text{Early Unwind}}} {\\partial s_{\\text{Germany CDS}}}$$

독일 CDS 스프레드 +1bp 변화 시 Early Unwind 옵션 가치 변화 → 별도 CSR(Non-Sec) 민감도 산출 필요.

---

## 4. 입력변수 및 IFRS 13 레벨

| 입력변수 | 관찰 가능성 | IFRS 13 Level |
|---------|-----------|--------------|
| EUR 국채 수익률 곡선 (Bloomberg) | Observable | **Level 2** |
| EUR Repo Rate (GC Pooling) | Observable | **Level 2** |
| 독일국채 현물가격 | Observable | **Level 2** |
| 독일 소버린 CDS 스프레드 | Observable | **Level 2** |
| Early Unwind Option 가치 | Non-observable (모형 의존) | **Level 3** |

> **IFRS 13 판정:** 조기청산 옵션 요소 제외 시 **Level 2**, 포함 시 **Level 2~3**.
> 실무적으로는 Early Unwind Option 가치가 미미한 경우 Level 2로 분류하는 경우가 많음.

---

## 5. 검증 방법

- **IPV:** Bloomberg/Refinitiv 독립 독일국채 시세로 선도가격 재산출 → 거래 MtM과 비교
- **Repo Rate 검증:** 유로시스템 GC Pooling Rate, ECB O/N Rate 기준으로 Carry 계산 확인
- **Early Unwind Option:** 간이 신용 모델(Hazard Rate × EPE) 또는 독일 CDS 기반 Monte Carlo
- **Scenario Testing:** EUR 금리 ±100bp, 독일 CDS ±50bp 충격 시나리오 P&L 확인
      `,
    },

    cashflow: {
      title: '현금흐름 조감도',
      content: `
## Cash Settled Bond Forward 현금흐름

채권 실물 교환 없이, **만기 시장가격과 합의 선도가격의 차액**만 현금 수수합니다.

### 결제 타임라인

| 시점 | 이벤트 | 결제 내용 |
|------|--------|---------|
| Trade Date (2026/03/11) | 계약 체결 | 현금흐름 없음 (프리미엄 미교환) |
| 중간 기간 | MtM 변화 | CSA 기반 일일 Variation Margin 교환 |
| Price Determination Date (2028/11/13) | 시장가격 확정 | CACIB Firm Bid 제시 → 상호 확인 |
| Bond Purchase Date (2028/11/15) | 최종 현금결제 | 차액 일방 지급 후 거래 종료 |

### 조기청산 시 현금흐름

Early Unwind Event 발생 → Early Unwind Determination Date (2영업일 전) → Early Unwind Date에 Early Unwind CSA 수수 후 거래 종료.
      `,
      diagram: {
        parties: [
          {
            id: 'shinhan',
            name: '신한증권\n(Bond Seller)',
            role: 'Short Forward\n채권가격 하락 시 이익',
            type: 'client',
          },
          {
            id: 'cacib',
            name: 'CACIB\n(Bond Buyer)',
            role: 'Long Forward\n채권가격 상승 시 이익',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'trade-date',
            label: 'Trade Date — 계약 체결',
            description: '2026/03/11 계약 체결. 현금 교환 없음. 선도가격 100.06을 합의하고 2028/11/15 현금결제 약정.',
            arrows: [],
          },
          {
            id: 'rate-rise',
            label: '금리 상승 시나리오 (채권가격 하락 → Bond Seller 이익)',
            description: '만기(2028/11/15) 독일국채 시장가격이 99.00%로 하락한 경우. Cash Settlement = EUR 200M × (100.06% − 99.00%) = EUR 2,120,000. CACIB가 신한증권에 지급.',
            arrows: [
              {
                from: 'cacib',
                to: 'shinhan',
                label: 'Cash Settlement 지급 (Bond Buyer → Seller)',
                sublabel: 'EUR 200M × (100.06% − 99.00%) = EUR 2,120,000',
                timing: 'maturity',
                type: 'positive',
              },
            ],
          },
          {
            id: 'rate-fall',
            label: '금리 하락 시나리오 (채권가격 상승 → Bond Buyer 이익)',
            description: '만기(2028/11/15) 독일국채 시장가격이 101.50%로 상승한 경우. Cash Settlement = EUR 200M × (100.06% − 101.50%) = −EUR 2,880,000. 신한증권이 CACIB에 지급.',
            arrows: [
              {
                from: 'shinhan',
                to: 'cacib',
                label: 'Cash Settlement 지급 (Bond Seller → Buyer)',
                sublabel: 'EUR 200M × (101.50% − 100.06%) = EUR 2,880,000',
                timing: 'maturity',
                type: 'negative',
              },
            ],
          },
          {
            id: 'early-unwind',
            label: '조기청산 (Early Unwind Event 발생)',
            description: 'Credit Event, Tender Offer 등 Early Unwind Event 발생 시. Early Unwind CSA = Nominal × (Discounted Purchase Price − Market Price − AI). Discounted Purchase Price는 Repo Rate로 선도가격을 현재 시점까지 할인한 값.',
            arrows: [
              {
                from: 'cacib',
                to: 'shinhan',
                label: 'Early Unwind CSA 수수 (방향은 산정 결과에 따라 결정)',
                sublabel: 'EUR 200M × (Disc. Purchase Price − Market Price − AI)',
                timing: 'early-termination',
                type: 'neutral',
              },
            ],
          },
        ],
        notes: [
          'Market Price는 Clean Price 기준. 단, 0% 쿠폰 채권이므로 Dirty Price = Clean Price (Accrued Interest = 0).',
          'Price Determination Date = Bond Purchase Date 또는 Early Unwind Date로부터 2 영업일 전.',
          'Business Days: TARGET (Calculation), TARGET + Paris + London + Seoul (Payment).',
          'CACIB가 Calculation Agent 겸직 — Market Price 산정 및 Early Unwind 금액 결정.',
          'CSA(Credit Support Annex) 기반 일일 Variation Margin 교환으로 MtM 익스포저 관리.',
        ],
      },
    },
  },
};
