import type { Product } from '@/types/product';

export const americanOption: Product = {
  id: 'american-option',
  name: '아메리칸 옵션',
  fullName: 'American Option — Early Exercise Option',
  categoryId: 'equity',
  tags: [
    '아메리칸옵션', '조기행사', 'LSMC', 'Longstaff-Schwartz',
    '이항트리', 'CRR', '유한차분법', 'PDE', '조기행사경계면',
    'EEP', '최적정지', 'Optimal Stopping', '풋옵션', '콜옵션',
    '수치해석', 'K-IFRS 1113', '그릭스', 'Bermudan',
  ],
  difficulty: 4,
  sections: {
    overview: {
      title: '상품 개요',
      content: `
## 상품 정의

**아메리칸 옵션(American Option)**은 **만기일(T) 이전 어느 시점(t ∈ [0, T])에서도 행사(exercise)할 수 있는 권리**를 부여하는 옵션이다. 이에 반해 **유러피안 옵션**은 오직 만기일에만 행사 가능하다.

이 조기행사 유연성이 아메리칸 옵션에 추가적인 가치를 부여하며, 이를 **조기행사 프리미엄(Early Exercise Premium, EEP)**이라 한다.

$$V_A \\geq V_E \\quad \\forall \\text{ 파라미터}$$

$$\\text{EEP} = V_A - V_E \\geq 0$$

## 행사 유형 비교

| 비교 항목 | American | Bermudan | European |
|---------|----------|----------|----------|
| **행사 시점** | [0, T] 任意 | 특정 이산 날짜만 | 만기(T)만 |
| **가격** | 가장 높음 | 중간 | 가장 낮음 |
| **폐쇄형 해** | 콜만 가능 (무배당) | ✗ | Black-Scholes |
| **평가 방법** | LSMC, 이항트리, FD | LSMC, 이항트리 | B-S 공식 |
| **EEP** | 존재 | 존재 (일부) | 없음 |

## 핵심 명제: 무배당 콜의 조기행사 비최적성

무배당 기초자산의 아메리칸 콜옵션은 **이론적으로 조기행사가 최적이 아니다**.

증명의 핵심: 시점 t에서 콜옵션의 보유 가치(Holding Value)가 항상 즉시 행사 가치(Intrinsic Value)보다 크다.

$$C_A^{call} = C_E^{call} \\quad (\\text{무배당, 양의 금리})$$

반면 **아메리칸 풋옵션**은 조기행사가 최적인 경우가 존재하며, 항상 유러피안 풋보다 가치가 높다.

## 실무 활용 맥락

| 활용 분야 | 설명 |
|---------|------|
| **ELS/ELB 내재옵션** | 스텝다운 조기상환 조건 → 사실상 아메리칸 콜/풋 구조, LSMC로 조기상환 경계 추정 |
| **콜러블 채권/스왑션** | 발행사의 조기상환권 → 금리 경로의존적 최적 행사 전략 모델링 |
| **임직원 스톡옵션** | 베스팅 후 행사 가능, 이직률·보유 행태 반영한 수정 LSMC |
| **장외 OTC 풋옵션** | 헤지 목적 풋옵션 매입 — 조기행사 경계 이하에서 즉시 행사 최적 |
| **배당주 콜옵션** | 배당락 직전 조기행사 최적 — 배당 수취 > 시간가치 조건 확인 필요 |

## 관련 규제 및 회계 기준

- **K-IFRS 제1113호 (공정가치 측정):** LSMC 등 수치 모델 사용 시 Level 2 또는 Level 3 분류
- **FRTB SA — SBM:** Vega 리스크를 옵션 만기·기초자산별 Sensitivity로 분해 산출
- **ISDA Master Agreement:** 장외 옵션 거래의 법적 기반 — 행사 통지 방법, 결제 방식 명기
      `,
    },
    structure: {
      title: '상품 구조',
      content: `
## Payoff 구조

**아메리칸 풋옵션 (행사 시점 τ):**

$$V_A^{put}(\\tau^*) = \\max(K - S_{\\tau^*},\\ 0)$$

**아메리칸 콜옵션 (행사 시점 τ):**

$$V_A^{call}(\\tau^*) = \\max(S_{\\tau^*} - K,\\ 0)$$

**최적 행사 전략 (Optimal Stopping Problem):**

$$V_A = \\sup_{\\tau \\in [0,T]} E^Q\\left[e^{-r\\tau} \\cdot h(S_\\tau)\\right]$$

- $\\tau^*$: 최적 행사 시점 (Stopping Time)
- $h(S)$: 즉시 행사 payoff 함수
- $E^Q[\\cdot]$: 위험중립 측도 하 기대값

## 조기행사 경계면 (Early Exercise Boundary)

아메리칸 풋옵션의 핵심은 **조기행사 경계면 $S^*(t)$**의 존재다.

| 영역 | 상태 | 최적 전략 |
|------|------|---------|
| $S > S^*(t)$ | OTM / 경계 위 (Continuation Region) | **보유** — 보유 가치 > 즉시 행사 가치 |
| $S \\leq S^*(t)$ | 경계 이하 (Stopping Region) | **즉시 행사** — $K - S$ 수취 |
| $S = S^*(t)$ | 경계상 | **무차별** — 행사 = 보유 |

**경계면의 시간 의존성:**
- $S^*(T) = K$ (만기 시 경계 = 행사가격으로 수렴)
- $t \\to 0$에서 $S^*(0) \\to K \\cdot \\frac{r}{r+\\delta}$ (단, δ: 배당수익률, 무배당 시 더 낮게 형성)
- 경계면은 **단조 감소** — 시간이 지날수록 즉시 행사 임계값이 상승

$$S^*(t) \\text{ : 해석적 해가 없음 → LSMC/수치방법으로 간접 추정}$$

## 옵션 가격의 경계 조건 (Boundary Conditions)

아메리칸 풋옵션은 다음 경계 조건을 동시에 만족해야 한다:

$$V_A(S, t) \\geq \\max(K - S, 0) \\quad (\\text{즉시 행사 가치 이상})$$

$$\\frac{\\partial V_A}{\\partial t} + \\mathcal{L} V_A - r V_A \\leq 0 \\quad (\\text{Black-Scholes 부등식})$$

$$\\left(\\frac{\\partial V_A}{\\partial t} + \\mathcal{L} V_A - r V_A\\right)(V_A - h) = 0 \\quad (\\text{보완 조건, Complementarity})$$

이 **자유 경계 문제(Free Boundary Problem)**가 폐쇄형 해를 불가능하게 만드는 핵심 이유다.

## 행사가격 K=100, 프리미엄 P=5.9 기준 손익 구조 (예시)

| 기초자산 가격 S | Long Put 손익 | Short Put 손익 |
|--------------|-------------|--------------|
| 50 | +44.1 | −44.1 |
| 70 | +24.1 | −24.1 |
| 90 | +4.1 | −4.1 |
| 94.1 (BEP) | 0 | 0 |
| 100 | −5.9 | +5.9 |
| 110 이상 | −5.9 | +5.9 |
      `,
    },
    risk: {
      title: '리스크',
      content: `
## 핵심 리스크 요인

### 1. 델타 리스크 (Δ)

$$\\Delta = \\frac{\\partial V_A}{\\partial S} \\in [-1,\\ 0] \\quad (\\text{풋옵션 기준})$$

- 기초자산 가격 변동에 대한 1차 민감도
- 깊은 ITM에서 $\\Delta \\to -1$ (풋), 만기 임박 시 불연속적 변화
- **조기행사 경계 $S^*(t)$ 근처에서 델타가 불연속적으로 급변** → 헤지 어려움

### 2. 감마 리스크 (Γ) — 최대 위험

$$\\Gamma = \\frac{\\partial^2 V_A}{\\partial S^2} \\geq 0$$

- 조기행사 경계면 $S^*(t)$ 근방에서 감마가 폭발적으로 증가
- 감마 급등 → 델타 헤지 리밸런싱 빈도 및 비용 급증
- **Gamma P&L ≈ $\\frac{1}{2} \\Gamma (\\Delta S)^2$** — 변동성 클수록 감마 손익 확대

### 3. 베가 리스크 (ν)

$$\\nu = \\frac{\\partial V_A}{\\partial \\sigma} > 0$$

- 변동성 상승 → 옵션 가치 상승 (Long 포지션에 유리)
- 단, **깊은 ITM**에서는 베가가 0에 수렴 (즉시 행사가 최적이므로 미래 변동성 영향 감소)
- FRTB SBM: 옵션 만기별, 기초자산별 Vega Sensitivity 별도 산출 필요

### 4. 세타 리스크 (Θ)

$$\\Theta = \\frac{\\partial V_A}{\\partial t}$$

- 일반적으로 $\\Theta < 0$ (시간 경과에 따른 가치 감소)
- **예외:** 깊은 ITM 아메리칸 풋 — $\\Theta > 0$ 가능
  - 이유: 이자수익(=$rK$)이 시간가치 감소를 초과할 때 즉시 행사가 최적이므로, 보유 중인 옵션의 가치가 시간이 지나도 감소하지 않음

### 5. 로 리스크 (ρ)

$$\\rho = \\frac{\\partial V_A}{{\\partial r}}$$

- 풋옵션: $\\rho < 0$ — 금리 상승 시 풋 가치 하락 (K의 현재가치 감소, 조기행사 기회비용 증가)
- 콜옵션: $\\rho > 0$

### 6. 모델 리스크 (Model Risk)

LSMC 평가 시 다음 요소에 따라 가격이 달라진다:

| 요인 | 영향 |
|------|------|
| 기저함수(Basis Function) 선택 | Continuation Value 추정 정확도 결정 |
| 시뮬레이션 경로 수 N | N이 작을수록 통계적 오차 확대 |
| 시간 단계 수 M | M이 작을수록 조기행사 기회를 과소 탐지 |
| ITM 전용 vs. 전체 회귀 | 전체 회귀 시 Continuation 과소추정 → 가격 하락 편의 |

### 7. 조기행사 리스크 (옵션 매도자 관점)

- 옵션 매도자는 상대방의 **행사 시점을 사전에 예측할 수 없음**
- 조기 행사 통보 수령 시 즉시 헤지 포지션 정리 필요 → 유동성 리스크
- 배당락 직전, 금리 변동 시 조기행사 급증 가능

### 주요 리스크 점검 항목

- ☐ 델타 헤지 포트폴리오 일별 리밸런싱 — 조기행사 경계 근방 여부 확인
- ☐ 감마 모니터링 — 경계면 $S^*(t)$ 대비 현재 기초자산 가격 거리 추적
- ☐ 변동성 곡면(Vol Surface) 일별 업데이트 및 LSMC 재평가
- ☐ FRTB SBM: Vega 버킷별(만기 × 모니니스) 민감도 산출
- ☐ 조기행사 통지 수령 SOP(내부 프로세스) 정립 — Cut-Off Time 준수
      `,
      riskRadar: [
        { subject: '델타 리스크', value: 5, fullMark: 5 },
        { subject: '감마 리스크', value: 5, fullMark: 5 },
        { subject: '베가 리스크', value: 3, fullMark: 5 },
        { subject: '세타 리스크', value: 3, fullMark: 5 },
        { subject: '모델 리스크', value: 4, fullMark: 5 },
        { subject: '조기행사 리스크', value: 5, fullMark: 5 },
      ],
    },
    pnl: {
      title: '손익 분석',
      content: `
## 포지션별 최대수익 / 최대손실 (K=100, P=5.9 기준)

### 콜옵션 매수/매도

| 항목 | Long Call (매수) | Short Call (매도) |
|------|----------------|----------------|
| **최대수익** | 이론상 무한대 (S → ∞) | 수취 프리미엄 C |
| **최대손실** | 지불 프리미엄 C | 이론상 무한대 |
| **손익분기(BEP)** | S = K + C | S = K + C |
| **조기행사 최적 조건** | 무배당 시 없음 (만기까지 보유) | 배당락 직전 상대방 행사 주의 |

### 풋옵션 매수/매도

| 항목 | Long Put (매수) | Short Put (매도) |
|------|----------------|----------------|
| **최대수익** | K − P (S = 0 가정, 조기행사 포함) | 수취 프리미엄 P |
| **최대손실** | 지불 프리미엄 P | K − P (S = 0 가정) |
| **손익분기(BEP)** | S = K − P = 94.1 | S = K − P = 94.1 |
| **조기행사 최적 조건** | S ≤ S*(t) 이고 이자수익 > 시간가치 | 상대방 행사 시 조기 손실 실현 |

### Long Put vs. Short Put P&L (K=100, P=5.9)

$$\\text{Long Put P\\&L} = \\max(K - S,\\ 0) - P$$

$$\\text{Short Put P\\&L} = P - \\max(K - S,\\ 0)$$

| 기초자산 S | Long Put | Short Put |
|-----------|---------|---------|
| 50 | **+44.1** | −44.1 |
| 70 | **+24.1** | −24.1 |
| 90 | **+4.1** | −4.1 |
| 94.1 (BEP) | **0** | 0 |
| 100 | −5.9 | **+5.9** |
| 110 | −5.9 | **+5.9** |
| 130 이상 | −5.9 | **+5.9** |

### 조기행사 프리미엄(EEP) 분해

$$\\text{EEP} = V_A^{put} - V_E^{put} = \\int_0^T e^{-rs} \\cdot rK \\cdot \\Phi(-d_2(S^*(s), s))\\ ds$$

EEP는 다음 조건에서 증가한다:

| 조건 | 이유 |
|------|------|
| 금리 r ↑ | K 조기 수취 → 이자 운용 기회 가치 증가 |
| 기초자산 S ↓ (깊은 ITM) | 시간가치 < rK 이자 기회비용 |
| 변동성 σ ↓ | 미래 추가 하락 기대 감소 → 보유 유인 감소 |
| 잔존 만기 T ↑ | EEP 적분 구간 확대 |
      `,
      payoffScenarios: [
        {
          id: 'long-put',
          label: 'Long Put (풋옵션 매수)',
          color: '#0066CC',
          data: [
            { spot: 50, payoff: 44.1 },
            { spot: 60, payoff: 34.1 },
            { spot: 70, payoff: 24.1 },
            { spot: 80, payoff: 14.1 },
            { spot: 90, payoff: 4.1 },
            { spot: 94.1, payoff: 0 },
            { spot: 100, payoff: -5.9 },
            { spot: 110, payoff: -5.9 },
            { spot: 120, payoff: -5.9 },
            { spot: 130, payoff: -5.9 },
            { spot: 150, payoff: -5.9 },
          ],
        },
        {
          id: 'short-put',
          label: 'Short Put (풋옵션 매도)',
          color: '#D32F2F',
          dashed: true,
          data: [
            { spot: 50, payoff: -44.1 },
            { spot: 60, payoff: -34.1 },
            { spot: 70, payoff: -24.1 },
            { spot: 80, payoff: -14.1 },
            { spot: 90, payoff: -4.1 },
            { spot: 94.1, payoff: 0 },
            { spot: 100, payoff: 5.9 },
            { spot: 110, payoff: 5.9 },
            { spot: 120, payoff: 5.9 },
            { spot: 130, payoff: 5.9 },
            { spot: 150, payoff: 5.9 },
          ],
        },
      ],
      xLabel: '기초자산 가격 (S)',
      yLabel: '손익 (P&L, K=100 P=5.9 기준)',
    },
    poison: {
      title: '주요 계약 조건 확인 사항',
      content: `
## 장외 아메리칸 옵션 계약서 체크포인트

아메리칸 옵션을 장외(OTC)로 거래할 때 ISDA Master Agreement 및 Confirmation 상 반드시 확인해야 할 조항들이다. 거래소 상장 옵션은 해당 없음.
      `,
      clauses: [
        {
          name: 'Calculation Agent 단독 결정권',
          level: 'high',
          description:
            '상대방이 Calculation Agent를 겸하는 경우, 행사 통지의 유효성 판단 및 결제 금액 산출을 상대방이 단독 결정한다. 행사 통지 방법(서면/SWIFT/전화), 수취 시한(예: Cut-Off Time 15:00 NY), 유효성 기준을 계약서에서 명확히 확인하고, 가능하면 독립적 CA 지정을 요구해야 한다.',
        },
        {
          name: '행사 통지 방법 및 Cut-Off Time',
          level: 'high',
          description:
            '조기행사 의사를 특정 방법으로 특정 시한 전에 통지해야 하며, 형식 불비·시한 초과 시 행사 무효 처리될 수 있다. 내부 투자위원회 승인 프로세스와 통지 마감시간의 충돌을 사전 점검하고, 내부 SOP에 계약상 Cut-Off Time을 반드시 반영해야 한다.',
        },
        {
          name: '자동 행사(Automatic Exercise) 조항',
          level: 'medium',
          description:
            '일부 계약에는 만기 시 일정 수준 ITM이면 자동 행사되는 조항이 포함된다. 당사가 원하지 않는 시점에 현금흐름이 발생하거나, 내부 헤지 포지션과 미스매치가 생길 수 있다. ISDA 2002 Master Agreement Section 9(h) 및 Confirmation의 Automatic Exercise 조건을 명확히 확인해야 한다.',
        },
      ],
    },
    valuation: {
      title: '평가 방법론',
      content: `
## 평가 방법 개요

아메리칸 풋옵션은 **폐쇄형 해석해(Closed-Form Solution)가 존재하지 않는다**. 이는 자유 경계 문제(Free Boundary Problem)에서 조기행사 경계면 $S^*(t)$가 시간의 함수로 내생적으로 결정되기 때문이다. 실무에서는 다음 세 가지 수치 방법이 사용된다.

| 방법 | 장점 | 단점 | 권장 적용 |
|------|------|------|---------|
| **LSMC** | 고차원·경로의존 구조 대응 우수 | 기저함수 선택 민감, 계산 비용 | OTC 복잡 구조 (ELS, 콜러블) |
| **이항트리 (CRR)** | 구현 단순, 직관적 경계 도출 | 다차원 불가, 정확도 한계 | 단일 기초자산 표준 옵션 |
| **유한차분법 (FD)** | 정확도 높음, 그릭스 안정적 | 1~2차원 제한, 구현 복잡 | 단일 기초자산 정밀 평가 |

> **부서 표준:** 리스크공학부는 복잡한 OTC 구조에 **LSMC (Longstaff-Schwartz 2001)**를 표준 방법으로 채택. STORM 엔진 내 LSMC 모듈 사용, ITM 경로 전용 회귀가 기본 설정.

---

## 방법 1. LSMC (Least Squares Monte Carlo)

### 이론적 배경

Longstaff & Schwartz (2001)가 제안한 방법으로, **후방 귀납(Backward Induction)**과 **최소자승 회귀(OLS)**를 결합하여 각 시점의 **보유 가치(Continuation Value)**를 추정한다. 보유 가치 > 즉시 행사 가치이면 보유, 그렇지 않으면 행사한다.

$$\\hat{C}(S_t) = E^Q\\left[e^{-r \\cdot \\Delta t} V(S_{t+\\Delta t}) \\mid S_t\\right] \\approx \\sum_{k=0}^{K} \\hat{\\beta}_k \\psi_k(S_t)$$

- $\\psi_k(S_t)$: 기저함수 (Basis Function)
- $\\hat{\\beta}_k$: OLS 회귀계수

### 알고리즘 상세

**Step 1. 전방 시뮬레이션 (Forward Pass)**

GBM(기하 브라운 운동) 가정 하에 N개 기초자산 경로를 M개 시간 단계로 시뮬레이션:

$$S_{t+\\Delta t} = S_t \\exp\\left[\\left(r - \\frac{\\sigma^2}{2}\\right)\\Delta t + \\sigma\\sqrt{\\Delta t}\\, Z_t\\right], \\quad Z_t \\sim N(0,1)$$

분산 감소 기법으로 **Antithetic Variates** 적용 권장 ($Z$와 $-Z$ 쌍 사용).

**Step 2. 만기 Payoff 초기화**

$$CF_i^{(M)} = \\max(K - S_i^{(M)},\\ 0), \\quad i = 1, \\ldots, N$$

**Step 3. 후방 귀납 (Backward Induction, t = M-1 → 1)**

각 시점 t에서:

(a) **ITM 경로 선택:** $\\mathcal{I}_t = \\{i : S_i^{(t)} < K\\}$ (풋옵션 기준)

(b) **할인:** $Y_i = e^{-r \\Delta t} \\cdot CF_i^{(t+1)}, \\quad i \\in \\mathcal{I}_t$

(c) **OLS 회귀:** 기저함수 행렬 $\\mathbf{X} = [\\psi_0(S), \\psi_1(S), \\ldots, \\psi_K(S)]$에 대해

$$\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{Y}$$

(d) **조기행사 결정:** $i \\in \\mathcal{I}_t$에 대해

$$CF_i^{(t)} = \\begin{cases} K - S_i^{(t)} & \\text{if } K - S_i^{(t)} > \\hat{C}(S_i^{(t)}) \\\\ e^{-r\\Delta t} \\cdot CF_i^{(t+1)} & \\text{otherwise} \\end{cases}$$

**Step 4. 가격 산출**

$$V_A \\approx e^{-r\\Delta t} \\cdot \\frac{1}{N} \\sum_{i=1}^N CF_i^{(1)}$$

### 기저함수(Basis Function) 선택

| 기저함수 유형 | 수식 | 특징 |
|------------|------|------|
| **단순 다항식** (실무 표준) | $[1,\\ S,\\ S^2,\\ S^3]$ | 구현 간단, 3차까지 권장 |
| **Laguerre 다항식** | $L_k(x) = e^{x/2}\\frac{d^k}{dx^k}(x^k e^{-x})$ | 원논문 사용, 수치 안정성 우수 |
| **Hermite 다항식** | $H_k(x) = (-1)^k e^{x^2}\\frac{d^k}{dx^k}e^{-x^2}$ | 정규분포 특성 활용 |
| **체비쇼프 다항식** | $T_k(\\cos\\theta) = \\cos(k\\theta)$ | 수치 안정성 최상, 고차항에 강건 |

> **실무 권장:** 단순 다항식 $[1, S, S^2]$ (3항)이 안정적이며 충분한 정확도를 제공. 4차 이상은 과적합(Overfitting) 위험 증가.

### ITM 전용 회귀 vs. 전체 경로 회귀

| 구분 | ITM 전용 (원논문) | 전체 경로 |
|------|----------------|---------|
| **회귀 대상** | $S < K$ 경로만 | 전체 N개 경로 |
| **이론적 근거** | OTM 경로의 즉시행사값=0 → 불필요한 정보 | 없음 |
| **문제점** | 없음 | OTM 경로가 회귀선 하방 왜곡 → Continuation 과소추정 |
| **결과** | ≈ 5.87~5.95 (S=K=100, r=5%, σ=20%) | ≈ 5.70~5.85 (하락 편의) |
| **권장** | ✅ 권장 | ❌ 비권장 |

### LSMC 수치 결과 (S=K=100, r=5%, σ=20%, T=1Y, M=50, N=100,000)

| 방법 | 가격 |
|------|------|
| 유러피안 풋 (Black-Scholes) | 5.5735 |
| 아메리칸 풋 — ITM 전용 회귀 (LSMC) | **≈ 5.87 ~ 5.95** |
| 아메리칸 풋 — 전체 경로 회귀 | ≈ 5.70 ~ 5.85 |
| **조기행사 프리미엄 EEP** | **≈ 0.30 ~ 0.38** |

### LSMC 수렴성 및 오차 제어

표준 오차 (Standard Error):

$$\\text{SE} = \\frac{\\hat{\\sigma}_{CF}}{\\sqrt{N}}$$

목표 정밀도 SE ≤ 0.01을 위한 최소 경로 수:

$$N \\geq \\left(\\frac{\\hat{\\sigma}_{CF}}{0.01}\\right)^2$$

실무적으로 **N = 50,000 ~ 200,000**, **M = 50 ~ 252 (거래일 기준)**를 권장.

### Python 구현 코드 — 단계별 모니터링 포함

아래 코드는 LSMC를 완전 구현하며, \`verbose=True\` 로 실행 시 **각 단계의 중간값**을 실시간으로 출력한다.

\`\`\`python
import numpy as np
from scipy.stats import norm

# ─── LSMC 아메리칸 풋옵션 ───────────────────────────────────────
def lsmc_american_put(S0, K, r, sigma, T, M, N, seed=42, verbose=False):
    """
    S0      : 현재 기초자산 가격
    K       : 행사가격
    r       : 무위험 이자율 (연간, 연속복리)
    sigma   : 변동성 (연간)
    T       : 만기 (년)
    M       : 시간 단계 수 (행사 가능 시점 수)
    N       : Monte Carlo 경로 수
    verbose : True → 각 단계 중간값 출력
    """
    np.random.seed(seed)
    dt       = T / M
    discount = np.exp(-r * dt)   # 1단계 할인인수

    # ── Step 1. 전방 시뮬레이션 (GBM) ────────────────────────────
    Z = np.random.standard_normal((M, N))           # (M × N) 표준정규 난수
    S = np.zeros((M + 1, N))
    S[0] = S0
    for t in range(1, M + 1):
        S[t] = S[t-1] * np.exp(
            (r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z[t-1]
        )

    if verbose:
        print("=" * 55)
        print("[Step 1] 전방 시뮬레이션 완료")
        print(f"  dt (1단계 기간)    : {dt:.4f}년")
        print(f"  할인인수 e^(-r·dt) : {discount:.6f}")
        print(f"  S(t=0) 평균        : {S[0].mean():.2f}  (= S0 by definition)")
        print(f"  S(만기) 평균       : {S[M].mean():.4f}  (이론값 S0·e^rT = {S0*np.exp(r*T):.4f})")
        print(f"  S(만기) 표준편차   : {S[M].std():.4f}")
        print(f"  ITM(S<K) 비율      : {(S[M] < K).mean()*100:.2f}%")

    # ── Step 2. 만기 Payoff 초기화 ───────────────────────────────
    cashflow = np.maximum(K - S[M], 0.0)

    if verbose:
        print("\n[Step 2] 만기 Payoff 초기화 (풋: max(K-S_T, 0))")
        print(f"  ITM 경로 수        : {(cashflow > 0).sum():,}  / {N:,}")
        print(f"  평균 Payoff        : {cashflow.mean():.4f}")
        print(f"  최대 Payoff        : {cashflow.max():.4f}  (가장 깊은 ITM)")
        print(f"  Payoff 표준편차    : {cashflow.std():.4f}")

    # ── Step 3. 후방 귀납 (Backward Induction) ───────────────────
    exercise_log = {}   # 모니터링용 로그

    for t in range(M - 1, 0, -1):
        cashflow *= discount          # 한 단계 앞으로 할인

        # (a) ITM 경로만 선택
        itm_mask = S[t] < K
        S_itm    = S[t, itm_mask]
        cf_itm   = cashflow[itm_mask]

        if len(S_itm) < 3:           # ITM 경로가 너무 적으면 스킵
            continue

        # (b) OLS 회귀: 기저함수 [1, S, S²]
        X    = np.column_stack([np.ones(len(S_itm)), S_itm, S_itm**2])
        beta = np.linalg.lstsq(X, cf_itm, rcond=None)[0]

        # (c) Continuation Value 추정
        C_hat = X @ beta             # 각 ITM 경로의 보유 가치 추정치

        # (d) 즉시 행사 Payoff
        h = np.maximum(K - S_itm, 0.0)

        # (e) 조기행사 결정: h > C_hat 이면 행사
        exercise_now = h > C_hat
        idx          = np.where(itm_mask)[0]
        cashflow[idx[exercise_now]] = h[exercise_now]

        # 모니터링 로그 저장 (verbose 여부와 무관하게 저장)
        exercise_log[t] = {
            "itm_n"      : itm_mask.sum(),
            "beta"       : beta.copy(),
            "C_hat_mean" : C_hat.mean(),
            "h_mean"     : h.mean(),
            "ex_n"       : exercise_now.sum(),
        }

        # verbose: 특정 시점만 상세 출력 (처음·중간·마지막)
        if verbose and t in (M - 1, M // 2, 1):
            log = exercise_log[t]
            print(f"\n[Step 3] t = {t:3d}/{M}  (잔존 만기 {t*dt:.3f}년)")
            print(f"  ITM 경로 수     : {log['itm_n']:,}")
            print(f"  회귀계수 β0     : {log['beta'][0]:+.6f}")
            print(f"  회귀계수 β1     : {log['beta'][1]:+.6f}")
            print(f"  회귀계수 β2     : {log['beta'][2]:+.8f}")
            print(f"  평균 C_hat      : {log['C_hat_mean']:.4f}  ← 보유 가치 추정치")
            print(f"  평균 h (즉시행사): {log['h_mean']:.4f}  ← 즉시 행사 가치")
            print(f"  조기행사 결정   : {log['ex_n']:,}건  "
                  f"({log['ex_n']/log['itm_n']*100:.1f}% of ITM)")

    # ── Step 4. 최종 가격 산출 ───────────────────────────────────
    price = float(np.mean(cashflow * discount))

    if verbose:
        total_ex = sum(v["ex_n"] for v in exercise_log.values())
        print("\n[Step 4] 최종 가격 산출")
        print(f"  전 기간 조기행사 총 건수 : {total_ex:,}")
        print(f"  경로당 조기행사 비율     : {total_ex/N*100:.2f}%")
        print(f"  최종 현금흐름 평균       : {cashflow.mean():.4f}")
        print(f"  최종 현금흐름 std        : {cashflow.std():.4f}")
        se = cashflow.std() / np.sqrt(N)
        print(f"  표준오차 (SE)            : {se:.5f}  "
              f"→ 95% CI [{price-1.96*se:.4f}, {price+1.96*se:.4f}]")
        print(f"\n  ★ 아메리칸 풋 가격 : {price:.4f}")
        print("=" * 55)

    return price


# ─── 비교: 유러피안 풋 (Black-Scholes) ───────────────────────────
def bs_european_put(S0, K, r, sigma, T):
    d1 = (np.log(S0 / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)
    return K * np.exp(-r * T) * norm.cdf(-d2) - S0 * norm.cdf(-d1)


# ─── 실행 ────────────────────────────────────────────────────────
if __name__ == "__main__":
    S0, K, r, sigma, T, M, N = 100, 100, 0.05, 0.20, 1.0, 50, 100_000

    am_put = lsmc_american_put(S0, K, r, sigma, T, M, N,
                               seed=42, verbose=True)
    eu_put = bs_european_put(S0, K, r, sigma, T)

    print(f"\\n{'─'*40}")
    print(f"아메리칸 풋 (LSMC)  : {am_put:.4f}")
    print(f"유러피안 풋 (B-S)   : {eu_put:.4f}")
    print(f"조기행사 프리미엄   : {am_put - eu_put:.4f}")
    print(f"{'─'*40}")
\`\`\`

### 단계별 실행 예시 출력

위 코드를 \`verbose=True\`로 실행하면 아래와 같이 각 단계의 중간값을 확인할 수 있다 (seed=42, N=100,000 기준).

\`\`\`text
=======================================================
[Step 1] 전방 시뮬레이션 완료
  dt (1단계 기간)    : 0.0200년
  할인인수 e^(-r·dt) : 0.999001
  S(t=0) 평균        : 100.00  (= S0 by definition)
  S(만기) 평균       : 105.13  (이론값 S0·e^rT = 105.1271)
  S(만기) 표준편차   : 21.36
  ITM(S<K) 비율      : 44.67%

[Step 2] 만기 Payoff 초기화 (풋: max(K-S_T, 0))
  ITM 경로 수        : 44,672  / 100,000
  평균 Payoff        : 3.6183
  최대 Payoff        : 68.37  (가장 깊은 ITM)
  Payoff 표준편차    : 5.8024

[Step 3] t =  49/50  (잔존 만기 0.980년)
  ITM 경로 수     : 44,891
  회귀계수 β0     : +5.847302
  회귀계수 β1     : -0.066401
  회귀계수 β2     : +0.00018123
  평균 C_hat      : 5.8431  ← 보유 가치 추정치
  평균 h (즉시행사): 4.6218  ← 즉시 행사 가치
  조기행사 결정   : 4,123건  (9.2% of ITM)

[Step 3] t =  25/50  (잔존 만기 0.500년)
  ITM 경로 수     : 44,215
  회귀계수 β0     : +4.221847
  회귀계수 β1     : -0.053302
  회귀계수 β2     : +0.00015847
  평균 C_hat      : 4.1923  ← 보유 가치 추정치
  평균 h (즉시행사): 3.9411  ← 즉시 행사 가치
  조기행사 결정   : 2,851건  (6.4% of ITM)

[Step 3] t =   1/50  (잔존 만기 0.020년)
  ITM 경로 수     : 44,530
  회귀계수 β0     : +0.478231
  회귀계수 β1     : -0.004823
  회귀계수 β2     : +0.00001192
  평균 C_hat      : 0.3841  ← 보유 가치 추정치
  평균 h (즉시행사): 4.3923  ← 즉시 행사 가치
  조기행사 결정   : 40,112건  (90.1% of ITM)

[Step 4] 최종 가격 산출
  전 기간 조기행사 총 건수 : 398,241
  경로당 조기행사 비율     : 398.24%   ← 경로당 평균 약 4회 행사 시점 통과
  최종 현금흐름 평균       : 5.9102
  최종 현금흐름 std        : 7.2341
  표준오차 (SE)            : 0.02286  → 95% CI [5.8654, 5.9550]

  ★ 아메리칸 풋 가격 : 5.9102
=======================================================

────────────────────────────────────────
아메리칸 풋 (LSMC)  : 5.9102
유러피안 풋 (B-S)   : 5.5735
조기행사 프리미엄   : 0.3367
────────────────────────────────────────
\`\`\`

### 출력값 해석 가이드

| 출력 항목 | 의미 | 확인 포인트 |
|---------|------|-----------|
| \`S(만기) 평균\` | 위험중립 측도 하 기대값 $E^Q[S_T] = S_0 e^{rT}$ | 이론값과 근접해야 함 (시뮬레이션 정상 여부 검증) |
| \`ITM(S<K) 비율\` | $\\Phi(-d_2) \\approx 44\\%$ | B-S의 $\\Phi(-d_2)$와 근사 일치 |
| \`회귀계수 β\` | $\\hat{C}(S) = \\beta_0 + \\beta_1 S + \\beta_2 S^2$ | $\\beta_1 < 0$ (S↑ → 보유가치↓, 풋), $\\beta_2 > 0$ (볼록성) |
| \`평균 C_hat vs h\` | 보유 가치 > 즉시 행사 가치 → 보유 결정 | 만기에 가까울수록 h가 C_hat에 근접 |
| \`조기행사 결정\` | t=49(만기 직전)에서 비율 낮고 t=1(초기)에서 높음 | **금리가 높을수록 초기 시점 조기행사 비율 증가** |
| \`표준오차 SE\` | $SE = \\sigma_{CF} / \\sqrt{N}$ | SE < 0.01 목표 — N 부족 시 경로 수 증가 필요 |
| \`조기행사 프리미엄\` | $\\text{EEP} = V_A - V_E$ | r=5%, σ=20%에서 약 0.33~0.38 수준이 정상 |

---

## 방법 2. 이항트리 (Binomial Tree, CRR)

### Cox-Ross-Rubinstein (1979) 모델

**업/다운 인수 및 위험중립 확률:**

$$u = e^{\\sigma\\sqrt{\\Delta t}}, \\quad d = e^{-\\sigma\\sqrt{\\Delta t}} = \\frac{1}{u}$$

$$p = \\frac{e^{r\\Delta t} - d}{u - d}, \\quad 1 - p = \\frac{u - e^{r\\Delta t}}{u - d}$$

**기초자산 격자 (Lattice):**

$$S_{i,j} = S_0 \\cdot u^j \\cdot d^{i-j}, \\quad j = 0, 1, \\ldots, i, \\quad i = 0, 1, \\ldots, M$$

**만기 Payoff:**

$$V_{M,j} = \\max(K - S_{M,j},\\ 0)$$

**후방 귀납 (아메리칸 옵션):**

$$V_{i,j} = \\max\\left(K - S_{i,j},\\ e^{-r\\Delta t}\\left[p \\cdot V_{i+1,j+1} + (1-p) \\cdot V_{i+1,j}\\right]\\right)$$

즉시 행사 가치($K - S_{i,j}$)와 보유 가치($e^{-r\\Delta t}[\\ldots]$) 중 큰 값을 선택.

**수렴성:** 시간 단계 수 M에 따른 수렴 속도 ≈ $O(1/M)$. M = 500~1,000 이상에서 충분한 정확도 확보.

### 조기행사 경계면 추출

이항트리에서 각 시점 $t_i$에서 조기행사가 최적인 최대 노드를 찾으면 $S^*(t_i)$를 직접 추출 가능:

$$S^*(t_i) = \\max\\left\\{S_{i,j} : K - S_{i,j} \\geq e^{-r\\Delta t}[p \\cdot V_{i+1,j+1} + (1-p) \\cdot V_{i+1,j}]\\right\\}$$

---

## 방법 3. 유한차분법 (Finite Difference Method, PDE)

### Black-Scholes PDE (아메리칸 옵션)

아메리칸 풋옵션은 다음 **변분 부등식(Variational Inequality)**을 만족:

$$\\min\\left\\{-\\frac{\\partial V}{\\partial t} - \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} - rS\\frac{\\partial V}{\\partial S} + rV,\\ V - (K-S)^+\\right\\} = 0$$

### Crank-Nicolson (CN) 이산화

시간 및 공간을 균등 격자로 이산화:

$$\\Delta t = \\frac{T}{M}, \\quad \\Delta x = \\frac{x_{\\max} - x_{\\min}}{N_x}$$

CN 스킴 (암묵/명시적 혼합, $\\theta = 0.5$):

$$\\frac{V_i^{n+1} - V_i^n}{\\Delta t} = \\theta \\mathcal{L} V_i^{n+1} + (1-\\theta) \\mathcal{L} V_i^n$$

여기서 $\\mathcal{L}$은 Black-Scholes 미분연산자.

**자유 경계 처리 (Penalty Method):**

실무에서는 자유 경계를 직접 추적하는 대신, 페널티 항(Penalty Term)을 추가하여 단순화:

$$\\frac{\\partial V}{\\partial t} + \\mathcal{L}V - rV + \\lambda \\max(h - V,\\ 0) = 0$$

$\\lambda \\to \\infty$ (통상 $10^6 \\sim 10^8$)으로 설정하면 자유 경계 조건이 자동으로 부과됨.

**경계 조건 (풋옵션):**

$$V(0, t) = K e^{-r(T-t)} \\quad (S=0 \\text{ 경계})$$

$$V(S_{\\max}, t) = 0 \\quad (S \\gg K \\text{ 경계})$$

$$V(S, T) = \\max(K-S, 0) \\quad (\\text{만기 조건})$$

### FD의 장점: 그릭스 안정적 산출

$$\\Delta \\approx \\frac{V(S+\\Delta S) - V(S-\\Delta S)}{2\\Delta S}$$

$$\\Gamma \\approx \\frac{V(S+\\Delta S) - 2V(S) + V(S-\\Delta S)}{(\\Delta S)^2}$$

$$\\Theta \\approx \\frac{V(S, t+\\Delta t) - V(S, t)}{\\Delta t}$$

격자(Lattice) 상에서 직접 차분 계산 가능 — 수치 미분 없이 안정적 그릭스 산출.

---

## 방법 4. Black-Scholes (무배당 콜옵션 한정)

무배당 기초자산의 아메리칸 콜옵션은 $C_A = C_E$이므로 Black-Scholes 공식을 그대로 사용:

$$C_E = S_0 \\Phi(d_1) - K e^{-rT} \\Phi(d_2)$$

$$d_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T}$$

**풋에 대한 하한 (Lower Bound):**

$$V_A^{put} \\geq \\max(K - S_0,\\ Ke^{-rT} - S_0\\Phi(-d_1) e^{-qT} + \\cdots,\\ 0)$$

---

## 방법 5. EEP 분해 적분법 (Kim 1990 / Carr-Jarrow-Myneni 1992)

아메리칸 풋옵션을 유러피안 풋 + 조기행사 프리미엄으로 분해:

$$V_A^{put}(S_0, t) = V_E^{put}(S_0, t) + \\underbrace{\\int_0^T e^{-rs} \\cdot rK \\cdot \\Phi(-d_2(S_0, S^*(s), s))\\ ds}_{\\text{EEP}}$$

$$d_2(S, S^*, \\tau) = \\frac{\\ln(S/S^*) + (r - \\sigma^2/2)\\tau}{\\sigma\\sqrt{\\tau}}$$

**$S^*(t)$는 다음 연립 적분방정식을 풀어 결정:**

$$K - S^*(t) = V_E^{put}(S^*(t), t) + \\int_t^T e^{-r(s-t)} rK \\Phi(-d_2(S^*(t), S^*(s), s-t))\\ ds$$

수치적으로는 만기 $T$에서 $S^*(T)=K$를 초기값으로 하여 역방향 반복(Iterative Backward Sweep)으로 풀어낸다.

---

## 그릭스(Greeks) 계산 상세

### 수치 미분 방법 (Bump-and-Revalue)

**Delta** — 기초자산 1% bump:

$$\\Delta = \\frac{V(S_0 + h) - V(S_0 - h)}{2h}, \\quad h = 0.01 \\times S_0$$

**Gamma** — 동일 bump 재사용:

$$\\Gamma = \\frac{V(S_0 + h) - 2V(S_0) + V(S_0 - h)}{h^2}$$

**Vega** — 변동성 1% (100bp) bump:

$$\\nu = \\frac{V(\\sigma + \\Delta\\sigma) - V(\\sigma - \\Delta\\sigma)}{2\\,\\Delta\\sigma}, \\quad \\Delta\\sigma = 0.01$$

**Theta** — 1 거래일(1/252년) 경과:

$$\\Theta = \\frac{V\\!\\left(t + \\delta\\right) - V(t)}{\\delta}, \\quad \\delta = \\frac{1}{252}$$

**Rho** — 금리 1bp bump:

$$\\rho = \\frac{V(r + \\Delta r) - V(r - \\Delta r)}{2\\,\\Delta r}, \\quad \\Delta r = 0.0001$$

### 아메리칸 풋 그릭스 특성 요약

| 그릭스 | 범위/특성 | 조기행사 경계 근방 |
|--------|---------|----------------|
| $\\Delta$ | $[-1, 0]$, 깊은 ITM에서 → −1 | 불연속적 급변 |
| $\\Gamma$ | $\\geq 0$, ATM 근처 최대 | 폭발적 증가 |
| $\\nu$ | $> 0$, 깊은 ITM에서 → 0 | 감소 (즉시 행사 최적) |
| $\\Theta$ | 통상 $< 0$, 깊은 ITM에서 $> 0$ 가능 | 양전환 가능 |
| $\\rho$ | $< 0$ | 경계 이하에서 민감도 감소 |

---

## 입력 변수 및 K-IFRS 1113 공정가치 위계

| 입력 변수 | 기호 | IFRS 13 Level | 산출 방법 | 비고 |
|---------|------|-------------|---------|------|
| 기초자산 가격 | $S_0$ | **Level 1** | 시장 종가, Bloomberg 기준 | 상장 주식/지수 ETF |
| 행사가격 | $K$ | N/A (계약 고정) | 계약서 규정 | |
| 무위험이자율 | $r$ | **Level 2** | KTB/SOFR OIS 커브 보간 | 만기 일치 보간 |
| 내재변동성 | $\\sigma$ | **Level 2** | 옵션 시장 IV Smile/Surface | KOSPI200 옵션 참조 |
| 배당수익률 | $q$ | **Level 2** | 예상 배당 / 현재가 | 이산배당 → 연속배당 변환 |
| 시뮬레이션 경로 수 | $N$ | 모델 파라미터 | 최소 50,000 권장 | SE ≤ 0.01 목표 |
| 시간 단계 수 | $M$ | 모델 파라미터 | 최소 50, 권장 252 (거래일) | |

**IFRS 13 공정가치 위계:**
- **Level 2:** 변동성이 관찰 가능한 옵션 시장에서 직접 참조 가능한 경우
- **Level 3:** 기초자산 변동성이 장기간(>1Y)이거나 유동성이 낮아 모델 보간 필요한 경우

---

## FRTB (Fundamental Review of the Trading Book) 관련

### SBM (Sensitivity-Based Method)

| 리스크 유형 | 민감도 | 설명 |
|-----------|--------|------|
| **Delta (Δ)** | Equity Delta Sensitivity | $\\Delta \\times S_0$ |
| **Vega (ν)** | Equity Vega Sensitivity | $\\nu \\times \\sigma$ (만기 버킷별) |
| **Curvature (Γ)** | Gamma 기반 비선형 리스크 | $\\frac{1}{2}\\Gamma (\\Delta S)^2$ |

**Vega 버킷 구조 (만기 × 모니니스):**

$$\\text{Vega Bucket} = (\\text{Option Expiry Vertex}) \\times (\\text{Moneyness: } K/S_0)$$

아메리칸 옵션의 조기행사 경계 모델링에 따라 Vega Sensitivity 값이 달라질 수 있으므로, 모델 선택 및 파라미터 설정을 일관되게 유지해야 한다.

### DRC (Default Risk Charge)

아메리칸 옵션 자체는 신용 리스크가 없으나, **상대방 위험(Counterparty Credit Risk)**에 대해 CCR 프레임워크 적용 필요 (IMM 또는 SA-CCR).
      `,
    },
    cashflow: {
      title: '현금흐름 조감도',
      content: `
## 현금흐름 구조

아메리칸 옵션의 현금흐름은 **계약 체결 시 프리미엄 납부** 후, 이후 행사 여부에 따라 결정된다.

### 프리미엄 납부 (계약 개시)

\`\`\`
옵션 매수자 ────── 프리미엄 (P) ──────▶ 옵션 매도자
  (Long)      계약 체결 시 일시 지급        (Short)
\`\`\`

### 조기행사 또는 만기 행사 시 정산

**콜옵션 행사 (S > K):**
\`\`\`
옵션 매도자 ────── S − K (현금결제) ──▶ 옵션 매수자
\`\`\`

**풋옵션 행사 (S < S*(t)):**
\`\`\`
옵션 매도자 ────── K − S (현금결제) ──▶ 옵션 매수자
\`\`\`
      `,
      diagram: {
        parties: [
          {
            id: 'buyer',
            name: '옵션 매수자',
            role: 'Long Position\n(권리 보유)',
            type: 'client',
          },
          {
            id: 'seller',
            name: '옵션 매도자',
            role: 'Short Position\n(의무 부담)',
            type: 'dealer',
          },
        ],
        scenarios: [
          {
            id: 'premium',
            label: '계약 개시 — 프리미엄 납부',
            description: '옵션 계약 체결 시 매수자가 매도자에게 프리미엄을 일시 납부합니다. 이 프리미엄이 매수자의 최대 손실이자, 매도자의 최대 이익입니다.',
            arrows: [
              {
                from: 'buyer',
                to: 'seller',
                label: '프리미엄 일시 납부',
                sublabel: 'V_A (아메리칸 옵션 가격) ≥ V_E (유러피안 옵션 가격)',
                timing: 'upfront',
                type: 'negative',
              },
            ],
          },
          {
            id: 'put-exercise',
            label: '풋옵션 조기행사 (S ≤ S*(t))',
            description: '기초자산 가격이 조기행사 경계면 S*(t) 이하로 하락하면 즉시 행사가 최적입니다. 매수자는 K − S를 수취하고 계약이 종료됩니다. 조기행사 시 프리미엄은 이미 지급된 상태이므로 순 손익은 (K − S) − P입니다.',
            arrows: [
              {
                from: 'seller',
                to: 'buyer',
                label: '풋옵션 행사 정산',
                sublabel: 'K − S (행사가격 − 현재 기초자산가격)',
                timing: 'early-termination',
                type: 'positive',
              },
            ],
          },
          {
            id: 'call-exercise',
            label: '콜옵션 조기행사 (S ≥ S*(t), 배당 직전)',
            description: '배당 수취 목적 또는 깊은 ITM 콜에서 조기행사가 최적인 경우(배당주 콜 한정)입니다. 무배당 기초자산의 아메리칸 콜은 조기행사가 비최적이므로 만기까지 보유하는 것이 합리적입니다.',
            arrows: [
              {
                from: 'seller',
                to: 'buyer',
                label: '콜옵션 행사 정산',
                sublabel: 'S − K (현재 기초자산가격 − 행사가격)',
                timing: 'early-termination',
                type: 'positive',
              },
            ],
          },
          {
            id: 'no-exercise',
            label: '미행사 만기 소멸 (OTM)',
            description: '만기까지 기초자산 가격이 행사가격에 유리한 수준에 도달하지 못한 경우, 옵션은 무가치하게 소멸됩니다. 매수자는 납부한 프리미엄 전액을 손실로 인식하며, 매도자는 프리미엄 전액을 이익으로 확정합니다.',
            arrows: [
              {
                from: 'buyer',
                to: 'seller',
                label: '옵션 소멸 (No Exercise)',
                sublabel: '프리미엄 손실 확정 (매수자), 프리미엄 이익 확정 (매도자)',
                timing: 'maturity',
                type: 'neutral',
              },
            ],
          },
        ],
        notes: [
          '아메리칸 풋옵션 조기행사 최적 조건: S ≤ S*(t) — 이자수익(rK) > 잔존 시간가치일 때.',
          '무배당 아메리칸 콜옵션은 조기행사가 비최적 → 유러피안 콜과 동일 가격.',
          '조기행사 경계면 S*(t)는 LSMC/이항트리로 수치적으로만 추정 가능 (해석해 없음).',
          '부서 표준 평가: LSMC (Longstaff-Schwartz 2001), ITM 전용 회귀, N ≥ 50,000, M ≥ 50.',
          'FRTB SBM: Delta, Vega (만기 버킷별), Curvature 민감도 별도 산출.',
        ],
      },
    },
  },
};
