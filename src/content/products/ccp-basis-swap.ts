import type { Product } from '@/types/product';

export const ccpBasisSwap: Product = {
  id: 'ccp-basis-swap',
  name: 'CCP 베이시스 스왑',
  fullName: 'Clearing Basis Swap (JPY TONA JSCC-LCH)',
  categoryId: 'interest-rate',
  tags: [
    'JPY', 'TONA', 'OIS', 'JSCC', 'LCH', '청산소', '베이시스',
    '레버리지', '청산기반', '2021 ISDA', 'Goldman Sachs', '30년',
  ],
  difficulty: 5,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

**CCP 베이시스 스왑(Clearing Basis Swap)**은 동일한 금리 스왑을 두 개의 서로 다른 중앙청산소(CCP — Central Counterparty)에서 청산할 때 발생하는 **평가 차이(CCP Basis)**를 매매하는 장외파생계약입니다.

본 거래는 **Goldman Sachs International(GSI)과 신한증권** 간에 체결된 **JPY TONA OIS Clearing Basis Swap**으로, JSCC(Japan Securities Clearing House)와 LCH(London Clearing House) 간의 JPY TONA OIS 할인 스프레드를 명목 레버리지를 활용하여 연간 고정금액으로 수취하는 구조입니다.

> **예시 거래 (Goldman Sachs International, 2026-05-22 체결):**
> Calculation Agent: Goldman Sachs International (GSI)
> Fixed Amount Payer: GSI | Fixed Amount Receiver: Shinhan Securities Co., Ltd
> 명목원금: JPY 2,000,000,000 | 레버리지 명목: JPY 50,000,000,000 (×25)
> 연간 순 지급액: 3,000,000 JPY (= 500억 × 0.006% / 고정)
> 만기: 2026-05-26 ~ 2056-05-26 (30년)

## CCP Basis 개념

동일한 JPY TONA OIS 스왑을 JSCC와 LCH에서 각각 청산하면, 두 CCP가 사용하는 **할인 곡선(Discount Curve)**이 미묘하게 달라 공정가치에 차이가 발생합니다.

$$\\text{CCP Basis} = \\text{JSCC 할인인수 기반 공정가치} - \\text{LCH 할인인수 기반 공정가치}$$

이 차이는 통상 **수 bps** 수준이며, 가상 스왑(Hypothetical Swap) 구조와 **명목원금 25배 레버리지**를 통해 실물 명목원금 기준 의미 있는 현금흐름으로 전환됩니다.

## 거래 목적

| 목적 | 설명 |
|------|------|
| **베이시스 수익 추구** | JSCC-LCH 스프레드(0.6bps)를 25배 레버리지로 연간 3백만 JPY 수취 |
| **복수 청산소 포트폴리오 헤지** | LCH 청산 JPY OIS 포지션을 JSCC 기준 평가와 조정 |
| **청산소 차익거래** | CCP 간 할인 곡선 차이를 활용한 구조화 거래 |

## 거래 당사자 구조

\`\`\`
  Goldman Sachs International      Shinhan Securities Co., Ltd
  (Fixed Amount Payer / CA)  ──연간 3M JPY 순지급──▶  (Fixed Amount Receiver)

  가상 스왑 A (JSCC 기준): GSI가 3.416% 고정 지급, Counterparty가 TONA OIS 지급
  가상 스왑 B (LCH 기준): Counterparty가 3.410% 고정 지급, GSI가 TONA OIS 지급
  실제 결제: 두 가상 스왑의 순(Net) 고정금액 → GSI → Shinhan
\`\`\`

- **Fixed Amount Payer (GSI):** 매년 순 고정금액을 신한증권에 지급. Calculation Agent 단독 지정.
- **Fixed Amount Receiver (신한증권):** 연간 3M JPY 고정 수취. 가상 스왑 B의 고정금리(3.410%) 지급.
- **Calculation Agent (GSI):** 순 고정금액 산출, MtM 평가, 조기종료 여부 결정 — 전권 보유.

## 관련 계약 및 규제

- **2021 ISDA Interest Rate Derivatives Definitions:** 본 확인서가 채택한 표준 정의 (2006 구 버전에서 업데이트)
- **ISDA Master Agreement + Schedule:** GSI-Shinhan 간 기본 계약 (날짜 미기재 — 공란)
- **CFTC Regulation Part 45:** 스왑 데이터 레포지터리(DTCC SDR) 보고 의무 (미국법 적용)
- **K-IFRS 제1109호:** 헤지 회계 적용 여부 검토 (CCP 베이시스는 헤지회계 지정 어려움)
- **FRTB (BCBS 457):** GIRR 민감도 산출 필요 (JPY OIS 버텍스별 + 베이시스 리스크)
      `,
    },
    structure: {
      title: '상품 구조',
      content: `
## 구조 핵심: 이중 가상 스왑(Dual Hypothetical Swap) 메커니즘

본 거래는 실제로 두 개의 "가상(Hypothetical)" 스왑을 설정하고, 그 순(Net) 고정금액을 실제 현금흐름으로 결제하는 방식입니다. 가상 스왑의 변동 레그는 실제 결제가 아닌 **MtM 계산 기준**으로만 사용됩니다.

## 일반 조건 (General Terms)

| 항목 | 내용 |
|------|------|
| **거래 체결일** | 2026년 5월 22일 |
| **효력 발생일** | 2026년 5월 26일 |
| **만기일** | 2056년 5월 26일 (30년 / Modified Following BDC 적용) |
| **실제 명목원금** | JPY 2,000,000,000 (20억 엔) |
| **가상 명목원금** | JPY 50,000,000,000 (500억 엔 = 실제 × 25) |
| **Fixed Amount Payer** | GSI (Goldman Sachs International) |
| **Fixed Amount Receiver** | Counterparty (신한증권) |
| **결제 주기** | 연 1회 (매년 5월 26일 이후 2영업일) |
| **영업일 기준** | 도쿄(Tokyo) 및 서울(Seoul) |
| **Calculation Agent** | GSI (단독) |

## 가상 스왑 A — JSCC 기준

| 항목 | 내용 |
|------|------|
| **명목원금** | JPY 50,000,000,000 (= 실제 명목원금 × 25) |
| **고정금리 지급자** | GSI |
| **고정금리** | **3.416% p.a.** (Act/365 Fixed) |
| **변동금리 지급자** | Counterparty (신한증권) |
| **변동금리 지표** | **JPY-TONA-OIS Compound** |
| **변동금리 리셋** | 매 계산기간 마지막 영업일 |
| **MtM 평가 기준** | JSCC (Japan Securities Clearing House Corporation) 할인/기준 곡선 |

## 가상 스왑 B — LCH 기준

| 항목 | 내용 |
|------|------|
| **명목원금** | JPY 50,000,000,000 (= 실제 명목원금 × 25) |
| **고정금리 지급자** | Counterparty (신한증권) |
| **고정금리** | **3.410% p.a.** (Act/365 Fixed) |
| **변동금리 지급자** | GSI |
| **변동금리 지표** | **JPY-TONA-OIS Compound** |
| **변동금리 리셋** | 매 계산기간 마지막 영업일 |
| **MtM 평가 기준** | LCH (London Clearing House) 할인/기준 곡선 |

## 순 고정금액 계산

$$\\text{순 고정금액} = \\underbrace{\\text{Hyp. Swap A 고정금액}}_{\\text{GSI 지급}} - \\underbrace{\\text{Hyp. Swap B 고정금액}}_{\\text{신한 지급}}$$

$$= 500억 \\times 3.416\\% - 500억 \\times 3.410\\% = 500억 \\times 0.006\\% = \\mathbf{3{,}000{,}000\\text{ JPY/년}}$$

**GSI → 신한증권: 매년 3,000,000 JPY (고정, 확정)**

## 25배 레버리지 메커니즘

$$\\text{실제 명목 기준 연간 이자율} = \\frac{3{,}000{,}000}{2{,}000{,}000{,}000} = 0.15\\% = 15\\text{bps}$$

| 계층 | 명목원금 | 스프레드 | 연간 수입 |
|------|---------|---------|---------|
| 가상 스왑 기준 | 500억 JPY | 0.6bps | 3백만 JPY |
| 실제 명목 기준 | 20억 JPY | **15bps** | 3백만 JPY |

작은 CCP 베이시스(0.6bps)를 **25배 명목 레버리지**로 증폭하여 실제 명목원금 기준 의미 있는 15bps 캐리로 전환합니다.

## 현금흐름 예시

### 정기 결제 (매년 5월 28일 기준)

\`\`\`
[매년 결제일]
 GSI가 신한증권에 지급:
   Hyp. Swap A 고정금액: 50,000,000,000 × 3.416% × (365/365) = 1,708,000,000 JPY
 신한증권이 GSI에 지급:
   Hyp. Swap B 고정금액: 50,000,000,000 × 3.410% × (365/365) = 1,705,000,000 JPY

 순 결제 (GSI → 신한증권): 1,708,000,000 − 1,705,000,000 = 3,000,000 JPY
\`\`\`

### 30년 총 현금흐름 (할인 전)

$$\\text{총 수취액} = 3{,}000{,}000 \\times 30 = 90{,}000{,}000 \\text{ JPY (무할인)}$$

## MtM 평가 조항

거래 MtM는 **ISDA Master Agreement 6(e)조 방법론에 더하여**, Calculation Agent(GSI)가 아래 기준으로 산정:
- **Hyp. Swap A:** JSCC가 적용할 할인·기준 곡선 (GSI의 합리적 판단)
- **Hyp. Swap B:** LCH가 적용할 할인·기준 곡선 (GSI의 합리적 판단)
- MtM = PV(Hyp. Swap A, JSCC 곡선) - PV(Hyp. Swap B, LCH 곡선)

> **중요:** MtM 평가에 사용되는 두 곡선 모두 GSI가 **단독**으로 결정하며, 신한증권은 별도 검증 수단이 제한적입니다.

## 신용지원 조항 (Credit Support Provisions)

| 항목 | 내용 |
|------|------|
| **Independent Amount** | 명목원금의 2.50% = **50,000,000 JPY (5천만 엔)** |
| **역할** | 비청산 거래의 초기증거금(Initial Margin) 역할 |
| **주의** | 최대 손실(Close-out Amount)은 명목원금의 100%까지 가능 |
      `,
    },
    risk: {
      title: '리스크',
      content: `
## 핵심 리스크 요약

CCP 베이시스 스왑은 **표준 IRS와 완전히 다른 리스크 프로파일**을 갖습니다. 금리 방향성보다 **CCP 간 기준 곡선 차이(Clearing Basis)**가 핵심 리스크입니다.

## 1. 청산 베이시스 리스크 (Clearing Basis Risk) ⚠️ 핵심 리스크

$$\\text{JSCC-LCH 베이시스} = r_{\\text{JSCC}} - r_{\\text{LCH}} \\approx 0.6\\text{bps (계약 체결 시)}$$

연간 현금흐름(3M JPY)은 계약상 **고정**되어 있으므로, 베이시스 변화는 직접적인 현금흐름 충격이 아닌 **MtM 가치 변동**으로 나타납니다.

| 베이시스 변화 시나리오 | 신한증권 MtM 영향 |
|---------------------|---------------|
| JSCC-LCH 베이시스 **축소** (0.6bps → 0bps) | MtM **상승** (계약상 고정금액이 시장 대비 유리해짐) |
| JSCC-LCH 베이시스 **확대** (0.6bps → 1.2bps) | MtM **하락** (계약상 고정금액이 시장 대비 불리해짐) |
| JSCC-LCH 베이시스 **역전** (음수) | MtM 대폭 상승 + GSI Hedging Disruption 발동 가능성 ↑ |

**25배 레버리지 효과:**
$$\\text{베이시스 1bp 변화 시 MtM 영향} \\approx 500억 \\times 0.01\\% \\times \\text{잔존 Annuity Factor}$$

예: 잔존 20년, Annuity ≈ 17 → 1bp 변화 = **850M JPY (실제 명목 대비 42.5%)** MtM 변동

## 2. 금리 방향성 리스크 (Interest Rate Risk)

- 가상 스왑 A(GSI 고정 지급 3.416%)와 가상 스왑 B(신한 고정 지급 3.410%)는 **거의 동일한 DV01** 보유
- 두 스왑의 DV01이 **대부분 상쇄(Offset)**되나, 0.006%p 차이로 잔여 Net DV01 존재
- 그러나 두 스왑 MtM이 **서로 다른 곡선(JSCC vs. LCH)**으로 평가되므로 비선형 리스크 잔존

$$\\text{Net DV01} \\approx 0 \\text{ (방향성 리스크 경미, 베이시스 리스크가 지배적)}$$

## 3. 조기종료 리스크 (Early Termination Risk) ⚠️

**GSI가 단독으로 조기종료를 결정**할 수 있는 구조:

- **Hedging Disruption 정의:** GSI 또는 그 계열사가 상업적으로 합리적인 노력에도 불구하고 헤지 포지션(Hyp. Swap A와 B에 상응하는 JSCC·LCH 청산 포지션)을 유지·구축·조정·해소하지 못하는 경우
- **조기종료 통지:** GSI가 서면 통지(이메일 포함) — 통지 후 2영업일이 조기종료일
- **Termination Amount 산정:** GSI (Calculation Agent) 단독 산정, ISDA 6(e)조 기준
- **Sole Affected Party:** Counterparty(신한증권)만이 영향받는 당사자로 지정 → 조기종료 비용을 신한증권이 전적으로 부담

> **리스크:** 금리 또는 베이시스가 신한증권에 유리한 방향으로 움직여 GSI 헤지 비용이 증가하면, GSI가 Hedging Disruption을 발동하여 계약을 종료할 인센티브가 발생합니다.

## 4. 모델 리스크 (Model Risk)

- JSCC와 LCH의 할인 곡선은 **GSI의 합리적 판단(reasonable determination)**으로 구성 → 외부 검증 어려움
- JPY TONA OIS Compound 복리 계산 방식 차이 (Fixing Day 기준: "One Tokyo Business Day following day i")
- 두 CCP의 곡선 구성 방법론이 변경될 경우 MtM이 급변할 수 있음

## 5. 유동성 리스크 (Liquidity Risk)

- CCP 베이시스 스왑은 **극도로 비표준화**된 틈새 상품 — 2차 시장 거래 사실상 불가능
- 조기 청산 시 GSI(딜러)의 Market Quotation에 전적으로 의존
- 잔존 명목원금의 최대 **100%**까지 Close-out Amount가 발생할 수 있음 (거래 확인서 4항)

## 6. 신용 리스크 (Credit Risk)

- **거래 상대방:** Goldman Sachs International (투자등급이나 스트레스 상황 모니터링 필요)
- **CVA:** 30년 장기 거래이므로 EPE(기대양의노출)가 상당할 수 있음
- **Independent Amount (IM):** 5천만 JPY 사전 예치 → 신한증권 입장에서는 유동성 부담

## FRTB SA 민감도 산출 요약

| 리스크 분류 | 지표 | 비고 |
|------------|------|------|
| **GIRR Delta** | JPY TONA OIS 버텍스별 +1bp | Net DV01 소규모이나 30Y 버텍스 집중 |
| **GIRR 베이시스 리스크** | JSCC-LCH 곡선 간 스프레드 충격 | FRTB 공식 처리 방안 불명확 — 내부 모델 필요 |
| **CVA Delta** | GSI CDS 스프레드 +1bp | 장기 거래로 CVA 노출 상당 |
      `,
      riskRadar: [
        { subject: '금리 방향성 리스크', value: 2, fullMark: 5 },
        { subject: '베이시스 리스크', value: 5, fullMark: 5 },
        { subject: '신용 리스크',       value: 3, fullMark: 5 },
        { subject: '유동성 리스크',     value: 5, fullMark: 5 },
        { subject: '모델 리스크',       value: 4, fullMark: 5 },
        { subject: '운영·조기종료 리스크', value: 5, fullMark: 5 },
      ],
    },
    pnl: {
      title: '손익 분석',
      content: `
## Fixed Amount Receiver (신한증권) 관점 손익 구조

### 연간 확정 현금흐름

| 항목 | 금액 | 계산 근거 |
|------|------|---------|
| **연간 수취액** | **JPY 3,000,000** | 500억 × (3.416% − 3.410%) × 1년 |
| **실제 명목 기준 연 수익률** | **15bps (0.15%)** | 3백만 ÷ 20억 |
| **30년 총 수취액(무할인)** | JPY 90,000,000 | 3백만 × 30년 |
| **30년 총 수취액(할인, JPY 1.5%)** | JPY ≈ 65,000,000 | 연금 현재가치 |

> **Note:** 연간 현금흐름(3M JPY)은 계약상 **고정 확정**이며, 시장 변화와 무관합니다.
> 아래 그래프는 **MtM 포지션 가치 변화**를 베이시스 스프레드 함수로 표시한 것입니다 (현금흐름이 아님).

### MtM 민감도 — JSCC-LCH 베이시스 변화 대비

**조건:** 계약 베이시스 = 0.6bps, 가상 스왑 명목 = 500억 JPY, 잔존 연금인수 ≈ 15 (JPY 1.5% 가정)

$$\\text{MtM 변화} \\approx -(\\text{현재 베이시스} - 0.6\\text{bps}) \\times 500억 \\times \\text{연금인수}$$

$$\\text{실제 명목 대비 \\%} = \\frac{\\text{MtM 변화}}{20억}$$

| 현재 JSCC-LCH 베이시스 | MtM P&L | 해석 |
|----------------------|---------|------|
| 0.0bps | **+22.5%** | 베이시스 소멸 → 계약이 유리해짐 |
| 0.3bps | +11.3% | 베이시스 축소 |
| **0.6bps** | **0%** | **계약 체결 수준 (Break-even)** |
| 0.9bps | −11.3% | 베이시스 확대 |
| 1.2bps | −22.5% | 베이시스 2배 확대 |
| 1.5bps | −33.8% | — |
| 2.0bps | −52.5% | 극단적 베이시스 확대 |

### 최대 손익 요약

| 구분 | 내용 |
|------|------|
| **최대 이익 (연간)** | 고정 3,000,000 JPY/년 (확정) |
| **MtM 최대 이익** | 베이시스 → 0 또는 음수 시 이론적 무제한 |
| **MtM 최대 손실** | 베이시스 급확대 시 실제 명목 100%까지 가능 (거래 확인서 명시) |
| **Break-even 베이시스** | 0.6bps (계약 체결 시점 수준) |
| **조기종료 리스크** | GSI Hedging Disruption 발동 시 유리한 MtM에도 강제 종료 가능 |

### 레버리지 민감도 경고

CCP 베이시스 스왑은 **25배 명목 레버리지**로 인해 아주 작은 베이시스 변화도 실제 명목원금 대비 대규모 MtM 변동을 유발합니다.

$$\\text{베이시스 1bp 변화} \\Rightarrow \\text{MtM 영향} \\approx 37.5\\%\\text{~45\\% of 실제 명목원금}$$
      `,
      payoffData: [
        { spot: 0.0, payoff:  22.5 },
        { spot: 0.1, payoff:  18.8 },
        { spot: 0.2, payoff:  15.0 },
        { spot: 0.3, payoff:  11.3 },
        { spot: 0.4, payoff:   7.5 },
        { spot: 0.5, payoff:   3.8 },
        { spot: 0.6, payoff:   0.0 },
        { spot: 0.7, payoff:  -3.8 },
        { spot: 0.8, payoff:  -7.5 },
        { spot: 0.9, payoff: -11.3 },
        { spot: 1.0, payoff: -15.0 },
        { spot: 1.2, payoff: -22.5 },
        { spot: 1.5, payoff: -33.8 },
        { spot: 2.0, payoff: -52.5 },
      ],
      xLabel: 'JSCC-LCH 현재 베이시스 (bps)',
      yLabel: 'MtM P&L (실제 명목 2B JPY 대비 %)',
    },
    poison: {
      title: '독소조항',
      content: `
## 독소조항 분석 개요

CCP 베이시스 스왑은 일반 IRS 대비 **GSI에게 극도로 유리한 계약 구조**를 가지고 있습니다. 특히 조기종료 조항, Calculation Agent 단독 지정, 그리고 Sole Affected Party 지정은 신한증권에게 심각한 비대칭적 불이익을 초래할 수 있습니다.
      `,
      clauses: [
        {
          name: 'Hedging Disruption — GSI 단독 조기종료권',
          level: 'high',
          description:
            'GSI 또는 그 계열사가 JSCC·LCH 청산 헤지 포지션을 "상업적으로 합리적인 노력"에도 불구하고 유지·조정하지 못한다고 GSI가 판단하면, 즉각적인 서면 통지만으로 2영업일 후 조기종료가 가능합니다. "Hedging Disruption" 여부를 GSI 자신이 결정하므로, 이는 사실상 GSI의 일방적 해지권(Optional Termination)에 준하는 조항입니다. 베이시스 환경이 GSI에 불리하게 변하면 이 조항을 발동할 인센티브가 발생합니다.',
        },
        {
          name: 'Counterparty = Sole Affected Party (조기종료 비용 전가)',
          level: 'high',
          description:
            '조기종료 발동 시 신한증권이 "유일한 영향받은 당사자(Sole Affected Party)"로 지정됩니다. ISDA Master Agreement 6(e)조 방법론에 따라 Termination Amount를 GSI(Calculation Agent)가 산정하며, 모든 조기청산 관련 비용(스프레드, 시장 충격, 재구성 비용 포함)을 신한증권이 부담합니다. MtM이 신한 측에 유리한 시점에 GSI가 조기종료를 발동해도 신한증권은 대응 수단이 없습니다.',
        },
        {
          name: 'Calculation Agent 단독 지정 (GSI) — 이중 역할',
          level: 'high',
          description:
            'GSI가 Fixed Amount Payer이면서 동시에 Calculation Agent입니다. 이 이중 역할로 인해 (i) 순 고정금액 계산, (ii) JSCC·LCH 할인 곡선 결정, (iii) MtM 산정, (iv) Hedging Disruption 판정, (v) Termination Amount 산정을 모두 GSI가 독점합니다. "commercially reasonable manner"라는 표준 문구가 있으나, 신한증권의 이의 제기 수단은 법적 소송에 한정됩니다.',
        },
        {
          name: '명목원금 100% 손실 가능성 명시',
          level: 'high',
          description:
            '거래 확인서 4항은 "the maximum amount due from Counterparty in respect of this Transaction and any collateral, Loss, Market Quotation or Close-out Amount will be equal to 100% of the Notional Amount under the General Terms"라고 명시합니다. 조기종료 시 신한증권의 최대 손실 한도가 실제 명목원금 전액(20억 JPY = 약 180억원)에 달할 수 있음을 계약에서 공식적으로 인정한 것입니다.',
        },
        {
          name: 'Independent Amount 2.50% (일방적 IM 부담)',
          level: 'medium',
          description:
            '신한증권은 명목원금의 2.50% = 5천만 JPY(약 4.5억원)를 Independent Amount로 사전 예치해야 합니다. 이는 비청산 장외 거래의 초기증거금(IM) 역할을 하며, 거래 기간 내내 유동성 비용으로 작용합니다. GSI로부터의 대칭적 IM 요구 조항은 없습니다.',
        },
        {
          name: '가상 스왑 할인 곡선의 GSI 재량 결정',
          level: 'medium',
          description:
            'MtM 평가의 핵심인 JSCC 및 LCH 할인 곡선을 GSI가 "합리적 판단(reasonable determination)"으로 독자 결정합니다. 두 CCP가 실제로 사용하는 곡선과 GSI의 추정 곡선 간에 차이가 발생할 경우, MtM 및 Termination Amount 계산이 신한증권에 불리하게 산정될 수 있습니다. 특히 시장 혼란기에는 재량권 범위가 더욱 넓어집니다.',
        },
        {
          name: 'Hedge Positions 범위의 광의 해석',
          level: 'medium',
          description:
            '"Hedge Positions"는 "Hypothetical Swap A 및 B와 실질적으로 동일한 조건으로 LCH 및 JSCC에서 청산되는 것으로 간주되는 포지션"을 포함하여 매우 광범위하게 정의됩니다. GSI가 내부적으로 이를 넓게 해석하면 Hedging Disruption을 더 용이하게 발동할 수 있습니다.',
        },
      ],
    },
    valuation: {
      title: '평가 방법론',
      content: `
## 6-가) 평가 모델

**핵심 모델:** 이중 곡선 할인 현금흐름법 (Dual-Curve DCF) + CCP 베이시스 조정

CCP 베이시스 스왑의 공정가치는 **두 개의 서로 다른 청산소 할인 곡선**을 사용하여 각 가상 스왑의 현재가치를 산출하고, 그 차이를 취하는 방식으로 계산됩니다.

$$V_{\\text{CCP Basis}} = V_{\\text{Hyp. Swap A}}^{\\text{JSCC}} - V_{\\text{Hyp. Swap B}}^{\\text{LCH}}$$

$$V_{\\text{Hyp. Swap A}}^{\\text{JSCC}} = \\left[ N_A \\times K_A \\times \\sum_{i=1}^{n} \\alpha_i D^{\\text{JSCC}}(0, t_i) \\right] - \\left[ N_A \\times \\left(D^{\\text{JSCC}}(0,t_0) - D^{\\text{JSCC}}(0, t_n)\\right) \\right]$$

여기서:
- $N_A = 500\\text{억 JPY}$ (가상 명목원금)
- $K_A = 3.416\\%$ (Hyp. Swap A 고정금리)
- $D^{\\text{JSCC}}(0,t)$: JSCC OIS 할인인수

---

## 6-나) 입력변수 (Input Parameters)

| 입력변수 | 관찰 가능성 | IFRS 13 Level | 비고 |
|---------|-----------|--------------|------|
| JPY TONA OIS 금리 기간구조 | Observable (시장 호가) | **Level 2** | JSCC·LCH 상장 스왑 호가 기반 |
| **JSCC OIS 할인 곡선** | **부분 Observable** | **⚠️ Level 2~3** | JSCC 내부 방법론 의존 — GSI 재량 |
| **LCH OIS 할인 곡선** | **부분 Observable** | **⚠️ Level 2~3** | LCH 내부 방법론 의존 — GSI 재량 |
| JSCC-LCH 베이시스 스프레드 | 부분 Observable (거래 데이터) | **Level 3** | 시장 데이터 희소, 주로 GSI 내부 추정 |
| GSI Counterparty CDS 스프레드 | Observable | **Level 2** | CVA 산출용 |
| CVA/DVA 조정 | 부분 Observable | **Level 2~3** | 30Y 장기 → EPE 상당 |

> **IFRS 13 공정가치 위계:** CCP 베이시스 곡선의 비관찰성으로 인해 통상 **Level 3** 분류 가능성 높음 → 공정가치위원회 별도 심의 필요

---

## 6-다) 평가 방법론

### 가상 스왑 현재가치 산출

**고정 레그 (Hyp. Swap A 기준):**

$$V_{\\text{Fixed}}^{\\text{JSCC}} = 500억 \\times 3.416\\% \\times \\sum_{i=1}^{30} \\frac{1}{(1+r_{\\text{JSCC},i})^i}$$

**변동 레그 (Hyp. Swap A 기준, OIS Compound 방식):**

$$V_{\\text{Float}}^{\\text{JSCC}} = 500억 \\times \\left[ D^{\\text{JSCC}}(0,t_0) - D^{\\text{JSCC}}(0,t_{30}) \\right]$$

이를 Hyp. Swap B에도 동일하게 적용(단, LCH 곡선 사용, 고정금리 3.410%)하여 최종 순 공정가치를 산출합니다.

### TONA OIS Compound 복리 계산

JPY-TONA-OIS Compound는 계산기간 내 TONA 익일물 금리를 일 단위로 복리 계산합니다:

$$r_{\\text{OIS, Compound}} = \\left( \\prod_{i=1}^{N} \\left(1 + \\frac{TONA_i}{365}\\right) \\right) - 1$$

- Fixing Day: "One Tokyo Business Day following the day i" (익일 고시)
- Day Count: Actual/365 (Fixed)

### CCP 베이시스 민감도 (DV01 분석)

| 민감도 | 계산 방법 | 크기 (추정, 30Y 잔존) |
|--------|---------|-------------------|
| **JSCC-LCH 베이시스 DV01** | 베이시스 +1bp → MtM 재산출 | 약 750~1,000M JPY/bp |
| **JPY OIS 금리 DV01** | 전체 곡선 +1bp → MtM 재산출 | ≈ 0 (Hyp. Swap A·B 상쇄) |
| **JSCC 전용 DV01** | JSCC 곡선만 +1bp | 약 750~1,000M JPY/bp |
| **LCH 전용 DV01** | LCH 곡선만 +1bp | 약 -750~-1,000M JPY/bp |

### CVA 산출

$$\\text{CVA} \\approx (1 - R_{\\text{GSI}}) \\int_0^{30} \\lambda_{\\text{GSI}}(t) \\cdot e^{-\\int_0^t \\lambda(s)ds} \\cdot \\text{EPE}(t) \\cdot D(0,t)\\, dt$$

- 30년 장기 거래 → EPE(기대양의노출) 상당 수준
- GSI 신용등급 기반 Hazard Rate 적용

### 검증 방법 (IPV)

- **독립가격검증(IPV):** CCP 베이시스 시장 데이터(거래 데이터 및 브로커 호가) vs. GSI 제공 MtM 비교
- **공정가치위원회:** JSCC·LCH 할인 곡선 Level 분류 및 베이시스 파라미터 정기 재검토 (분기)
- **CCP 직접 조회:** JSCC 및 LCH에 공시 MtM 요청 가능 여부 확인 (실무상 어려움)
      `,
    },
    cashflow: {
      title: '현금흐름 조감도',
      content: `
## CCP 베이시스 스왑 현금흐름 구조

CCP 베이시스 스왑의 실제 현금흐름은 단순합니다: **GSI가 신한증권에 연간 3백만 JPY를 30년간 지급**합니다. 복잡성은 그 금액을 결정하는 **이중 가상 스왑 메커니즘**과 **MtM 평가 방식**에 있습니다.

### 현금흐름 타임라인

| 단계 | 시점 | 방향 | 내용 |
|------|------|------|------|
| **계약 체결** | 2026-05-22 | — | 명목원금 교환 없음 |
| **독립금액(IM) 납입** | 2026-05-26 (Effective Date) | 신한 → GSI | 50,000,000 JPY (명목의 2.5%) |
| **정기 결제** | 매년 5월 28일 (2027~2056) | GSI → 신한 | 3,000,000 JPY (30년간 고정) |
| **만기 / 조기종료** | 2056-05-28 또는 조기종료일 | 정산 방향 가변 | Termination Amount (GSI 산정) |

### 순 결제 계산 구조

\`\`\`
매년 결제일 (T+2 after May 26):

 [가상 스왑 A — JSCC 기준]
   GSI 가상 고정 지급: 50,000,000,000 × 3.416% = 1,708,000,000 JPY

 [가상 스왑 B — LCH 기준]
   신한 가상 고정 지급: 50,000,000,000 × 3.410% = 1,705,000,000 JPY

 [실제 현금 결제]
   GSI → 신한증권: 1,708,000,000 − 1,705,000,000 = 3,000,000 JPY
\`\`\`

### 조기종료 시 Termination Amount

$$\\text{Termination Amount} = V_{\\text{Hyp. Swap A}}^{\\text{JSCC, 잔존}} - V_{\\text{Hyp. Swap B}}^{\\text{LCH, 잔존}}$$

- 양수 → GSI가 신한에 지급 (신한 유리 시점에 조기종료 → 하지만 GSI가 발동 가능)
- 음수 → 신한이 GSI에 지급 (신한에 불리한 시점 → GSI 발동 불필요)
      `,
      diagram: {
        parties: [
          {
            id: 'shinhan',
            name: '신한증권',
            role: 'Fixed Amount Receiver (Counterparty)',
            type: 'client',
          },
          {
            id: 'gsi',
            name: 'Goldman Sachs\nIntl. (GSI)',
            role: 'Fixed Amount Payer / Calculation Agent',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'effective',
            label: '① 계약 효력 발생 (Effective Date)',
            description: '명목원금 교환은 없으나, 신한증권이 Independent Amount(IM) 5천만 JPY를 GSI에 예치합니다. 이 금액은 계약 전 기간 동안 유동성 비용으로 작용합니다.',
            arrows: [
              {
                from: 'shinhan',
                to: 'gsi',
                label: 'Independent Amount (IM) 납입',
                sublabel: 'JPY 50,000,000 (명목원금의 2.50%)',
                timing: 'upfront',
                type: 'negative',
              },
            ],
          },
          {
            id: 'periodic',
            label: '② 정기 결제 (매년 5월 28일)',
            description: '가상 스왑 A(JSCC, GSI 3.416%)와 가상 스왑 B(LCH, 신한 3.410%)의 순 고정금액으로, 매년 GSI가 신한증권에 3백만 JPY를 30년간 지급합니다. 연간 현금흐름은 계약상 확정(고정)입니다.',
            arrows: [
              {
                from: 'gsi',
                to: 'shinhan',
                label: '순 고정금액 지급 (Net Fixed Amount)',
                sublabel: 'JPY 3,000,000/년 = 500억 × (3.416% − 3.410%)',
                timing: 'periodic',
                type: 'positive',
              },
            ],
          },
          {
            id: 'early-term',
            label: '③ 조기종료 (Hedging Disruption)',
            description: 'GSI가 Hedging Disruption을 판정하면 2영업일 내 조기종료됩니다. Termination Amount는 GSI가 산정하며 신한증권이 유일한 Affected Party입니다. 시장 상황에 따라 신한증권이 정산금을 지급해야 할 수 있습니다.',
            arrows: [
              {
                from: 'gsi',
                to: 'shinhan',
                label: 'Termination Amount (양수인 경우)',
                sublabel: '잔존 기간 가상 스왑 A 순 PV — GSI 단독 산정',
                timing: 'early-termination',
                type: 'positive',
              },
            ],
          },
          {
            id: 'early-term-loss',
            label: '④ 조기종료 — 신한 손실 시나리오',
            description: 'JSCC-LCH 베이시스가 확대(신한에 불리)된 시점 또는 전반적 금리 상승 시, Termination Amount가 음수가 되어 신한증권이 GSI에 정산금을 지급해야 합니다. 최대 손실은 실제 명목원금 2B JPY의 100%까지 가능합니다(거래 확인서 4항).',
            arrows: [
              {
                from: 'shinhan',
                to: 'gsi',
                label: 'Termination Amount (음수인 경우)',
                sublabel: '신한증권 손실 정산 — 최대 JPY 2,000,000,000까지 가능',
                timing: 'early-termination',
                type: 'negative',
              },
            ],
          },
          {
            id: 'maturity',
            label: '⑤ 만기 (2056년 5월 28일)',
            description: '30년간 조기종료 없이 만기에 도달한 경우 최종 결제가 이루어집니다. 명목원금 교환은 없으며, 최종 연간 정기 지급(3백만 JPY)으로 계약이 종료됩니다.',
            arrows: [
              {
                from: 'gsi',
                to: 'shinhan',
                label: '최종 정기 결제 (30회차)',
                sublabel: 'JPY 3,000,000 — 명목원금 교환 없이 계약 종료',
                timing: 'maturity',
                type: 'positive',
              },
            ],
          },
        ],
        notes: [
          '명목원금(JPY 2,000,000,000)은 이자 계산 기준이며 실제로는 교환되지 않습니다.',
          '가상 스왑의 변동금리(TONA OIS Compound)는 MtM 계산 기준으로만 사용되며, 실제 현금 결제는 순 고정금액(3M JPY)만 이루어집니다.',
          'Calculation Agent: Goldman Sachs International (단독) — 모든 금액 산정 및 조기종료 판정 권한 보유',
          'Business Days: Tokyo(도쿄) 및 Seoul(서울) 모두 휴일인 경우 Modified Following 적용',
          'Fixing Day: "One Tokyo Business Day following the day i" — TONA 고시 지연 반영',
          'CFTC Part 45 보고: DTCC Data Repository (U.S.) LLC에 보고 의무 (미국 규제 적용)',
        ],
      },
    },
  },
};
