import type { Product } from '@/types/product';

export const shareBasketSwap: Product = {
  id: 'share-basket-swap',
  name: '주식 바스켓 스왑',
  fullName: '주식 바스켓 토탈리턴 스왑 (Share Basket TRS)',
  categoryId: 'equity',
  tags: [
    'TRS', '토탈리턴스왑', '주식바스켓', '삼성전자', 'SK하이닉스', 'SK스퀘어',
    'KOSPI200', 'SOFR', '바스켓수정', '합성롱포지션', '배당재투자', 'USD결제',
  ],
  difficulty: 4,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

주식 바스켓 토탈리턴 스왑(Share Basket TRS)은 **복수 주식으로 구성된 커스텀 바스켓의 총수익(Total Return)과 변동금리를 교환하는 장외 파생 계약**입니다.

- **Equity Amount Payer(딜러, JPMorgan):** 바스켓의 가격 변동 손익(자본이득/손실)을 상대방에게 지급. 배당은 Basket Divisor 조정으로 바스켓 가격에 자동 반영(Total Return).
- **Floating Amount Payer(카운터파티):** SOFR + 스프레드(40bp)를 딜러에게 지급. 합성 포지션의 조달 비용에 해당.
- 카운터파티 입장에서는 **실제 주식을 보유하지 않고 합성(Synthetic)으로 롱 포지션**을 취하는 효과.

---

## 실제 거래 개요 (J.P.Morgan Confirmation 기준)

| 항목 | 내용 |
|------|------|
| **거래 상대방** | JPMorgan Chase Bank, N.A. (London Branch) |
| **Equity Amount Payer** | JPMorgan |
| **Floating Amount Payer** | 카운터파티 |
| **거래일(Trade Date)** | 2026년 6월 8일 |
| **효력발생일(Effective Date)** | 2026년 6월 10일 |
| **기초자산** | 한국 주식 3종 커스텀 바스켓 (Bloomberg: JPKRUS5) |
| **바스켓 수(Number of Baskets)** | 2,500,000 |
| **최초 바스켓 가격(Initial Price)** | USD 183.5443 |
| **Equity Notional Amount** | USD 458,860,750 (= 2,500,000 × 183.5443) |
| **수익 유형(Type of Return)** | Total Return (자본이득 + 배당 재투자) |
| **변동금리** | USD-SOFR + 40bp (Actual/360, Averaging with 2-day Lookback) |
| **평가일(Valuation Dates)** | 2026년 7월 8일, 2026년 10월 8일 |
| **결제 통화** | USD (현금 결제) |

---

## 바스켓 구성 (Appendix I)

| 종목명 | Bloomberg Ticker | 거래소 | 보유 수량 |
|--------|-----------------|--------|---------|
| 삼성전자 (Samsung Electronics) | 005930 KP Equity | KRX | 392,960.83주 |
| SK하이닉스 (SK hynix) | 000660 KP Equity | KRX | 56,478.18주 |
| SK스퀘어 (SK Square) | 402340 KP Equity | KRX | 46,891.12주 |

- **Basket Divisor (초기값):** 986,636.5 (배당·바스켓 수정 이벤트 시 조정)
- **적격 지수(Eligible Indices):** KOSPI 200 Index, KOSPI2 Index (바스켓 수정 시 신규 편입 기준)
- **환율(FX Rate):** KRW/USD (Bloomberg: KOBRUSD Index, 런던 오후 4시 기준)

---

## 손익 핵심 요약

$$\\text{카운터파티 순손익} = \\underbrace{N_{\\text{baskets}} \\times (P_{\\text{Final}} - P_{\\text{Initial}})}_\\text{Equity Amount 수취} - \\underbrace{(\\text{SOFR} + 40\\text{bp}) \\times \\text{ENA} \\times \\frac{D}{360}}_\\text{Floating Amount 지급}$$

**손익분기점:** 바스켓 수익률 $= (\\text{SOFR} + 40\\text{bp}) \\times \\dfrac{D}{360}$

예: SOFR 5.30% 기준, 분기(91일) 손익분기 = 약 **+1.44%**
      `,
    },

    structure: {
      title: '상품 구조',
      content: `
## 1. Equity Leg — JPMorgan이 지급

### 1-1. 바스켓 Gross Price 산출

$$P_{\\text{Gross},t} = \\frac{\\sum_{i=1}^{n} R_{i}(t) \\times N_i}{\\text{BD}_t}$$

| 변수 | 정의 |
|------|------|
| $R_i(t)$ | 주식 $i$의 당일 종가 (KRW → USD 환산) |
| $N_i$ | 주식 $i$의 Number of Shares |
| $\\text{BD}_t$ | Basket Divisor (초기 986,636.5; 이후 이벤트로 변동) |

**KRW → USD 환산:**
$$R_{i,\\text{USD}} = \\frac{\\text{주가}_{i,\\text{KRW}}}{\\text{KOBRUSD}_t}$$

환율은 Bloomberg KOBRUSD Index로 런던 오후 4시 기준 제공.

---

### 1-2. Final Price (과세 조정)

$$P_{\\text{Final},t} = P_{\\text{Gross},t} - \\text{Taxation}_t$$

- Taxation = 한국 등 비(非)NA 지역 주식에 대한 원천징수세·제세공과금
- NA Region(캐나다·미국) 주식에는 Taxation 적용 없음

---

### 1-3. Equity Amount (각 결제일 정산)

$$\\text{Equity Amount} = N_{\\text{baskets}} \\times (P_{\\text{Final},t} - P_{\\text{Initial}})$$

- **양수이면** JPMorgan → 카운터파티 지급
- **음수이면** 카운터파티 → JPMorgan 지급

---

## 2. Floating Leg — 카운터파티가 지급

$$\\text{Floating Amount} = \\text{ENA} \\times (\\overline{r}_{\\text{SOFR}} + 40\\text{bp}) \\times \\frac{D}{360}$$

| 항목 | 내용 |
|------|------|
| **Floating Rate Option** | USD-SOFR |
| **Averaging** | Averaging with Lookback |
| **Lookback** | 2 Applicable Business Days |
| **Spread** | +40bp per annum |
| **Day Count** | Actual/360 |
| **Reset Dates** | 각 Calculation Period 마지막 날 |
| **Currency Business Days** | 뉴욕 + 서울 |

---

## 3. Equity Notional Reset

**Equity Notional Reset: Applicable** — 각 결제일 이후 ENA가 그 시점 바스켓 가치로 재설정:

$$\\text{ENA}_{t+1} = N_{\\text{baskets}} \\times P_{\\text{Final},t}$$

- 바스켓 상승 시 → 다음 기간 Floating Amount 기준 증가 (조달 비용 증가)
- 바스켓 하락 시 → 다음 기간 Floating Amount 기준 감소
- 과도한 신용 노출(Credit Exposure) 누적 방지 역할

---

## 4. 배당 재투자 (Total Return 구조)

배당을 현금으로 지급하는 대신 **Basket Divisor를 조정**하여 바스켓 가격에 자동 반영:

$$\\text{BD}_{t^+} = \\text{BD}_{t^-} \\times \\frac{P_{\\text{Gross, Inc\\ Div}}}{P_{\\text{Gross, Pre\\ Div}}}$$

| 변수 | 정의 |
|------|------|
| $P_{\\text{Gross, Inc\\ Div}}$ | Ex-date 직전 Exchange Business Day의 Gross Price (배당 포함) |
| $P_{\\text{Gross, Pre\\ Div}}$ | 동일 날짜의 Gross Price (해당 배당 차감 후) |

Basket Divisor가 줄어들수록 → 동일 주가 합계로 더 높은 Gross Price 산출 → **배당 재투자 효과 달성**

---

## 5. 바스켓 수정 (Basket Modification)

어느 일방도 Basket Modification Notice를 발송하여 구성을 변경할 수 있음:

$$\\text{BD}_{\\text{Post}} = \\text{BD}_{\\text{Pre}} \\times \\frac{\\sum_{i=1}^{n} R_i^{(\\text{New})} \\times N_i^{(\\text{New})}}{\\sum_{j=1}^{m} R_j^{(\\text{Pre})} \\times N_j^{(\\text{Pre)}}}$$

**편입 가능 요건:**
- 신규 종목: KOSPI200 또는 KOSPI2 지수 구성 종목
- 수량 변동 ≤ 해당 주식 ADTV(90거래일 평균) 100%
- 개별 종목 비중 ≤ 바스켓 Notional Amount의 5%
- 수정 전 해당 종목 시총 대비 ≤ 1%

**통지 기한:**
- 수신 다음 Exchange Business Day 종료 시까지 수락/거절 통지
- **미통지 시 자동 수락(Deemed Accepted) 처리**

---

## 6. 결제 일정

| 날짜 | 이벤트 |
|------|--------|
| 2026-06-10 | 효력발생일 (Effective Date) |
| 2026-07-08 | 1차 평가일 (Valuation Date 1) |
| 2026-07-10 | 1차 현금 결제일 (T+2 Currency Business Days) |
| 2026-10-08 | 2차 평가일 / 최종 평가일 (Final Valuation Date) |
| 2026-10-12 | 최종 현금 결제일 (T+2 Currency Business Days) |

> Optional Early Termination 행사 시: Notice Date 이후 다음 Valuation Date가 Early Termination Date로 확정
      `,
    },

    risk: {
      title: '리스크 분석',
      content: `
## 리스크 유형별 분석

### 1. 주가 변동 리스크 ★★★★★

카운터파티는 바스켓 3종목(삼성전자·SK하이닉스·SK스퀘어)의 가격 변동에 **1:1 선형 노출**:

- 바스켓 1% 상승 → 약 USD 4,588,608 수취
- 바스켓 1% 하락 → 약 USD 4,588,608 지급
- 레버리지는 없으나, **하락 시 주가 손실 + SOFR 금리 이중 지급으로 손실 가속**

**섹터 집중 위험 — 한국 반도체·IT 3종목:**
삼성전자(반도체·스마트폰), SK하이닉스(DRAM·HBM), SK스퀘어(지주/투자)는 동일 섹터 리스크를 공유. 반도체 업황 하강, 미·중 기술 패권 갈등, 주요 고객사 수요 감소 등 공통 테마에 동시 노출.

---

### 2. FX 리스크 (KRW/USD) ★★★★☆

기초 주식은 KRW 표시이나 결제는 USD:

$$R_{i,\\text{USD}} = \\frac{\\text{주가}_{\\text{KRW}}}{\\text{KOBRUSD}_t} \\Rightarrow \\text{KRW 약세 시 Equity Amount 감소}$$

- KRW 약세(달러 강세): 동일 KRW 주가도 USD 환산액 하락 → Equity Amount 감소
- 환율은 런던 오후 4시 기준 → 서울 장 마감 후 별도로 결정되므로 intraday 환율 위험 상존
- 한국 주식이 상승해도 KRW 급락이 수익을 상쇄할 수 있음

---

### 3. 카운터파티 신용 리스크 ★★★☆☆

- 양방향 신용 노출: 주가 상승 시 카운터파티는 JPMorgan에 대한 신용 익스포저 발생
- ISDA Master Agreement + CSA 담보 계약으로 담보 교환 (Variation Margin)
- **JPMorgan이 Calculation Agent 겸임** → 이해충돌 내재 (상세는 독소조항 참조)

---

### 4. 유동성 리스크 ★★★☆☆

- 장외 거래: 포지션 청산은 반대거래 또는 Optional Early Termination(OET)으로만 가능
- OET 행사 시 Early Termination Payment를 JPMorgan이 산출 → 불리한 가격 위험
- 구성 종목이 KRX 상장주 → Hedging Disruption 발생 시 JPMorgan이 계약 조정·종결 가능
- USD 약 4.6억 규모 → 현물 헤지 해소 시 시장 충격(market impact) 발생 가능

---

### 5. 금리 리스크 ★★☆☆☆

- Floating Leg: SOFR + 40bp → SOFR 상승 시 분기 금리 지급 부담 증가
- Equity Notional Reset으로 매 결제일마다 Notional 재산정 → 금리 노출 급증 제한
- 그러나 주가 상승 → ENA 증가 → 더 많은 SOFR 이자 지급 필요 (수익 일부 잠식)

---

### 6. 배당 리스크 ★★☆☆☆

- Dividend Recovery 조항: Dividend Mismatch/Omission Event 발생 시 JPMorgan이 소급 조정
- 한국 배당소득에 대한 원천징수세 → Final Price 차감 → Equity Amount 감소
- 배당 누락·삭감 시 Basket Divisor가 기대보다 덜 하락 → 재투자 효과 축소
      `,
      riskRadar: [
        { subject: '주가변동리스크', value: 5, fullMark: 5 },
        { subject: 'FX리스크',      value: 4, fullMark: 5 },
        { subject: '신용리스크',     value: 3, fullMark: 5 },
        { subject: '유동성리스크',   value: 3, fullMark: 5 },
        { subject: '금리리스크',     value: 2, fullMark: 5 },
        { subject: '배당리스크',     value: 2, fullMark: 5 },
      ],
    },

    pnl: {
      title: '손익 분석',
      content: `
## 손익 구조

주식 바스켓 TRS는 **선형(Linear) 페이오프** 구조입니다. 카운터파티 순손익:

$$\\text{Net P\\&L} = \\underbrace{N \\times (P_{\\text{Final}} - P_{\\text{Initial}})}_\\text{Equity Amount} - \\underbrace{\\text{ENA} \\times (\\text{SOFR}+40\\text{bp}) \\times \\frac{D}{360}}_\\text{Floating Amount}$$

---

## 분기별 시나리오 분석

**가정:** SOFR 5.30%, 기간 91일 → Floating Amount 비율 ≈ 1.44%, Floating Amount ≈ USD 6.6M

| 바스켓 수익률 | Equity Amount | Floating Amount | 순손익 |
|------------|-------------|----------------|--------|
| **+20%** | +USD 91,772,150 | −USD 6,610,000 | **+USD 85,162,150** |
| **+10%** | +USD 45,886,075 | −USD 6,610,000 | **+USD 39,276,075** |
| **+1.44% (손익분기)** | +USD 6,607,595 | −USD 6,610,000 | **≈ 0** |
| **0%** | USD 0 | −USD 6,610,000 | **−USD 6,610,000** |
| **−10%** | −USD 45,886,075 | −USD 6,610,000 | **−USD 52,496,075** |
| **−20%** | −USD 91,772,150 | −USD 6,610,000 | **−USD 98,382,150** |

> ENA = USD 458,860,750, Floating Amount = 458,860,750 × 5.70% × 91/360 ≈ USD 6,610,000

---

## 손익분기점

$$\\text{Break-Even 수익률} = (\\text{SOFR} + 40\\text{bp}) \\times \\frac{D}{360}$$

| 기간 | 손익분기점 (SOFR 5.30% 기준) |
|------|--------------------------|
| 28일 (1차 기간) | ≈ +0.44% |
| 91일 (1분기) | ≈ +1.44% |
| 연간 | = 5.70% p.a. |

→ 바스켓이 연 5.70% 이상 상승해야 보유 비용을 회수
      `,
      xLabel: '바스켓 수익률 (%)',
      yLabel: '카운터파티 순손익 (% of Notional)',
      payoffScenarios: [
        {
          id: 'counterparty-pnl',
          label: '카운터파티 순손익 (SOFR+40bp 1.44% 차감, 91일)',
          color: '#003087',
          dashed: false,
          data: [
            { spot: -40,   payoff: -41.44 },
            { spot: -30,   payoff: -31.44 },
            { spot: -20,   payoff: -21.44 },
            { spot: -10,   payoff: -11.44 },
            { spot: 0,     payoff: -1.44  },
            { spot: 1.44,  payoff: 0      },
            { spot: 10,    payoff: 8.56   },
            { spot: 20,    payoff: 18.56  },
            { spot: 30,    payoff: 28.56  },
            { spot: 40,    payoff: 38.56  },
          ],
        },
        {
          id: 'jpmorgan-pnl',
          label: 'JPMorgan 순손익 (Equity Payer, 대칭 반전)',
          color: '#CC0000',
          dashed: true,
          data: [
            { spot: -40,   payoff: 41.44 },
            { spot: -30,   payoff: 31.44 },
            { spot: -20,   payoff: 21.44 },
            { spot: -10,   payoff: 11.44 },
            { spot: 0,     payoff: 1.44  },
            { spot: 1.44,  payoff: 0     },
            { spot: 10,    payoff: -8.56  },
            { spot: 20,    payoff: -18.56 },
            { spot: 30,    payoff: -28.56 },
            { spot: 40,    payoff: -38.56 },
          ],
        },
      ],
    },

    poison: {
      title: '독소조항 분석',
      content: `
## Share Basket TRS의 주요 위험 조항

TRS는 딜러(JPMorgan)가 Calculation Agent를 겸하고 복수의 일방 종결·조정권을 보유하므로, 카운터파티는 구조적으로 비대칭적 위치에 있습니다.
      `,
      clauses: [
        {
          name: 'Calculation Agent = JPMorgan — 완전한 이해충돌 구조',
          level: 'high',
          description:
            '바스켓 Gross Price 산정, Basket Divisor 조정, Taxation 공제, 배당 재투자 반영, 조기종결 금액 산출까지 JPMorgan이 단독으로 결정. 카운터파티는 독립 검증 수단이 없으며, 세금 공제율 결정·배당 기준 확인·환율 적용 등 재량 영역에서 JPMorgan의 판단이 절대적. ISDA 정의상 "commercially reasonable manner" 의무를 지지만, 실질적 불복 수단은 계약 내 분쟁 해결 절차뿐.',
        },
        {
          name: '바스켓 수정 미응답 → 자동 수락 (Deemed Acceptance)',
          level: 'high',
          description:
            'JPMorgan이 Basket Modification Notice를 발송하면 카운터파티는 다음 Exchange Business Day 종료 시까지 수락 또는 거절 통지 필요. 기한 내 미통지 시 "자동 수락(deemed accepted)"으로 간주되어 바스켓 구성이 강제 변경됨. 반대로 카운터파티가 수정 요청 시 JPMorgan은 1 Exchange Business Day 내 거절 가능. 일방이 포지션 관리 목적으로 바스켓 구성을 조정하면서 상대방에게는 사실상 반응 시간이 하루밖에 없다는 심각한 비대칭.',
        },
        {
          name: '헤지 불능 시 일방 종결권 (Hedging Disruption / Loss of Stock Borrow)',
          level: 'high',
          description:
            'JPMorgan이 한국 주식에 대한 헤지 포지션을 구축·유지·해소할 수 없게 되면(Hedging Disruption), 공매도 차입이 불가능해지거나(Loss of Stock Borrow), 차입 비용이 급등하면(Increased Cost of Stock Borrow), JPMorgan이 일방적으로 계약을 조기종결하거나 조건을 조정할 수 있음. 시장 혼란(KRX 거래 중단, 외국인 투자 제한 등) 시 카운터파티 입장에서 가장 불리한 시점에 강제 청산 위험.',
        },
        {
          name: 'Taxation 공제 — 한국 원천세로 Equity Amount 감소',
          level: 'medium',
          description:
            'Final Price = Gross Price - Taxation. 한국 주식의 경우 배당소득세, 증권거래세 등 현지 세금이 Gross Price에서 차감되어 Equity Amount를 직접 줄임. 세율 결정 및 적용 대상 판단은 Calculation Agent(JPMorgan) 재량. Change in Law(세법 변경) 발생 시 JPMorgan이 추가 조정 또는 계약 종결 가능.',
        },
        {
          name: 'Dividend Recovery — 소급 배당 조정 및 7년 잔존 의무',
          level: 'medium',
          description:
            '배당금이 실제 지급액과 불일치하는 Dividend Mismatch Event 또는 배당 미지급(Dividend Omission Event) 발생 시, 이미 결제 완료된 이후에도 JPMorgan이 소급하여 Basket Divisor를 재조정하고 차액을 청구 가능. 계약 종결일로부터 7년까지 해당 조항이 효력을 유지 — 거래 종료 후에도 재정산 의무가 잔존.',
        },
        {
          name: 'Local Taxes (한국 포함 아시아 Closed Market) — 추가 과세 전가',
          level: 'medium',
          description:
            '"Asian Closed Market"(일본·홍콩·뉴질랜드·싱가포르·호주 제외한 아시아, 즉 한국 포함)에서 Hedging Party(JPMorgan)에게 부과되는 현지 세금이 미확정 상태로 결제가 이루어질 경우, 이후 확정 시 카운터파티에게 소급 전가 가능. 반대로 초과 납부된 세금은 카운터파티로부터 회수 가능. 세금 규모를 사전에 정확히 예측하기 어려워 정산 시점에 예상치 못한 추가 지급 의무 발생 위험.',
        },
      ],
    },

    valuation: {
      title: '평가 방법론',
      content: `
## 1. 바스켓 Gross Price 산출

$$P_{\\text{Gross},t} = \\frac{\\sum_{i=1}^{n} R_{i,t} \\times N_i}{\\text{BD}_t}$$

**초기 바스켓 구성 (Trade Date 기준):**

| 종목 | 수량($N_i$) | Bloomberg Ticker |
|------|-----------|-----------------|
| 삼성전자 | 392,960.83 | 005930 KP Equity |
| SK하이닉스 | 56,478.18 | 000660 KP Equity |
| SK스퀘어 | 46,891.12 | 402340 KP Equity |

Initial Price = USD 183.5443 → $\\text{BD}_0 = 986,636.5$ 을 적용한 값

---

## 2. Basket Divisor 조정 — 배당 재투자

Ex-Dividend Date마다:

$$\\text{BD}_{t^+} = \\text{BD}_{t^-} \\times \\frac{P_{\\text{Gross, Inc\\ Div}}}{P_{\\text{Gross, Pre\\ Div}}}$$

**산출 예시 (삼성전자 배당 DPS 1,000원 가정):**

$$P_{\\text{Inc\\ Div}} = 70{,}000\\text{원} \\div \\text{KOBRUSD}$$
$$P_{\\text{Pre\\ Div}} = (70{,}000 - 1{,}000)\\text{원} \\div \\text{KOBRUSD}$$
$$\\text{BD}_{t^+} = 986{,}636.5 \\times \\frac{70{,}000}{69{,}000} \\approx 986{,}636.5 \\times 1.01449 \\approx 1{,}000{,}942$$

→ Basket Divisor 증가 → 바스켓 가격이 배당 반영 후에도 동일 수준 유지(재투자 효과)

---

## 3. Basket Divisor 조정 — 바스켓 수정

Notification Receipt Date의 Relevant Price 기준:

$$\\text{BD}_{\\text{Post}} = \\text{BD}_{\\text{Pre}} \\times \\frac{\\sum_{i=1}^{n} R_i^{(\\text{New})} \\times N_i^{(\\text{New})}}{\\sum_{j=1}^{m} R_j^{(\\text{Pre})} \\times N_j^{(\\text{Pre})}}$$

수정 전후 바스켓 Gross Price가 동일하게 유지되도록 Divisor를 조정하여 연속성 보장.

---

## 4. Equity Amount 산출

$$\\text{Equity Amount} = N_{\\text{baskets}} \\times (P_{\\text{Final},t} - P_{\\text{Initial}})$$

$$P_{\\text{Final},t} = P_{\\text{Gross},t} - \\text{Taxation}_t$$

- $N_{\\text{baskets}} = 2{,}500{,}000$
- $P_{\\text{Initial}} = \\text{USD}\\ 183.5443$ (Trade Date 기준, 바스켓 수정 시 재설정 없음)
- Equity Amount 양수 → JPMorgan 지급, 음수 → 카운터파티 지급

---

## 5. Floating Amount 산출

$$\\text{Floating Amount} = \\text{ENA} \\times \\overline{r}_{\\text{SOFR+40bp}} \\times \\frac{D}{360}$$

- $\\text{ENA}$: 해당 기간 초의 Equity Notional Amount (Reset 적용)
- $\\overline{r}$: Calculation Period 내 SOFR (2영업일 Lookback Averaging) + 40bp 평균
- $D$: 해당 기간 실제 일수 (Actual/360)

---

## 6. 공정가치(MtM) 평가

TRS의 시가(Mark-to-Market)는 두 레그의 현재가치 차이:

$$\\text{MtM}_{\\text{TRS}} \\approx N_{\\text{baskets}} \\times (P_{\\text{Gross},t} - P_{\\text{Initial}}) - \\text{PV}(\\text{Floating Leg})$$

**Floating Leg 현재가치 (단순화):**

$$\\text{PV}(\\text{Float}) = \\text{ENA} \\times \\int_t^T \\bigl(r_{\\text{fwd}}(s) + 40\\text{bp}\\bigr) \\cdot e^{-r(s)(s-t)}\\, ds$$

- USD SOFR OIS 커브로 Forward Rate 산출 후 할인
- 주식 델타: $\\Delta = N_{\\text{baskets}} / \\text{BD}_t$ per share (각 종목별)
- FX 델타: 각 주식의 USD 환산 가치에 대한 KRW/USD 환노출
- Equity Notional Reset 존재로 Floating Leg PV는 항상 소액 (Reset 시점에 Par에 수렴)
      `,
    },

    cashflow: {
      title: '현금흐름 조감도',
      content: `
## Share Basket TRS 현금흐름 구조

TRS는 **교환(Swap) 구조**로, 거래 개시 시 원금 교환 없이 각 결제일마다 Equity Amount와 Floating Amount를 차감 정산합니다. 현금 흐름 방향은 주가 등락에 따라 매 결제마다 달라집니다.
      `,
      diagram: {
        parties: [
          {
            id: 'counterparty',
            name: '카운터파티',
            role: '주식 바스켓 총수익 수취 (Equity 롱)\nSOFR+40bp 금리 지급 (합성 조달 비용)\n실물 주식 미보유 — 합성 롱 포지션',
            type: 'client',
          },
          {
            id: 'jpmorgan',
            name: 'JPMorgan\n(Calculation Agent)',
            role: 'Equity Amount 지급 (바스켓 총수익)\nSOFR+40bp 수취 (헤지 비용 회수)\n현물 주식 델타 헤지 운용',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'initiation',
            label: '① 거래 개시 (Effective Date: 2026-06-10)',
            description:
              '원금(Premium) 교환 없이 거래 시작 — 담보(Variation Margin)만 CSA에 따라 교환. JPMorgan은 삼성전자·SK하이닉스·SK스퀘어 현물 주식을 시장에서 매입하여 델타 헤지 포지션 구축. 카운터파티는 합성(Synthetic)으로 동일 포지션을 보유하는 효과. Equity Notional Amount = USD 458,860,750.',
            arrows: [],
          },
          {
            id: 'settlement-up',
            label: '② 분기 결제 — 바스켓 상승 시 (Valuation Date T+2)',
            description:
              '바스켓 Final Price > Initial Price인 경우 Equity Amount 양수 → JPMorgan이 카운터파티에게 지급. 카운터파티는 동시에 SOFR+40bp Floating Amount 지급. 두 금액은 동일 결제일에 차감 정산(netting). 바스켓 상승폭이 SOFR+40bp(약 1.44%/분기) 초과 시 카운터파티 순수취.',
            arrows: [
              {
                from: 'jpmorgan',
                to: 'counterparty',
                label: 'Equity Amount (양수)',
                sublabel: '= 2,500,000 × (Final Price − 183.5443) [바스켓 상승분]',
                timing: 'periodic',
                type: 'positive',
              },
              {
                from: 'counterparty',
                to: 'jpmorgan',
                label: 'Floating Amount',
                sublabel: '= ENA × (SOFR+40bp) × D/360 ≈ USD 6.6M (91일 기준)',
                timing: 'periodic',
                type: 'negative',
              },
            ],
          },
          {
            id: 'settlement-down',
            label: '③ 분기 결제 — 바스켓 하락 시 (Valuation Date T+2)',
            description:
              '바스켓 Final Price < Initial Price인 경우 Equity Amount 음수 → 카운터파티가 주가 하락분을 JPMorgan에게 지급해야 함. 추가로 Floating Amount(SOFR+40bp)도 지급해야 하므로 이중 지급 발생. 예: 바스켓 -10% + 1.44% 금리 = 분기 총 -11.44% 손실 (약 USD 52.5M).',
            arrows: [
              {
                from: 'counterparty',
                to: 'jpmorgan',
                label: 'Equity Amount (음수, 절댓값 지급)',
                sublabel: '= 2,500,000 × |Final Price − 183.5443| [바스켓 하락분]',
                timing: 'periodic',
                type: 'negative',
              },
              {
                from: 'counterparty',
                to: 'jpmorgan',
                label: 'Floating Amount',
                sublabel: '= ENA × (SOFR+40bp) × D/360',
                timing: 'periodic',
                type: 'negative',
              },
            ],
          },
          {
            id: 'early-termination',
            label: '④ Optional Early Termination (조기종결)',
            description:
              '어느 일방도 Notice Date에 Early Termination Notice를 발송 가능. Early Termination Date = 다음 Valuation Date. JPMorgan이 Early Termination Payment Amount를 산출하여 지급/수취. 대규모 포지션(USD 4.6억)이므로 현물 헤지 해소 시 시장 충격이 발생할 수 있으며, 실제 청산 가격이 이론가(MtM) 대비 불리할 수 있음.',
            arrows: [
              {
                from: 'jpmorgan',
                to: 'counterparty',
                label: 'Early Termination Payment',
                sublabel: 'JPMorgan 산출 (In-the-money인 경우 순수취, 반대면 순지급)',
                timing: 'early-termination',
                type: 'neutral',
              },
            ],
          },
        ],
        notes: [
          '거래 개시 시 원금 교환 없음 — Variation Margin(담보)만 CSA에 따라 매일 교환.',
          'Equity Notional Reset: 매 결제일 후 ENA가 당시 바스켓 가치(= 2,500,000 × Final Price)로 재설정.',
          '배당은 별도 지급 없음 — Basket Divisor 조정으로 바스켓 가격에 자동 반영 (Total Return 구조).',
          'FX 노출: 주식은 KRW 표시이나 결제는 USD — 환율은 런던 오후 4시 KOBRUSD(Bloomberg) 기준.',
          '결제일: 각 Valuation Date 후 2 Currency Business Days (뉴욕 + 서울 공동 영업일 기준).',
        ],
      },
    },
  },
};
