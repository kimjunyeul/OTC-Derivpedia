'use client';

import { useState, useCallback } from 'react';

// ── 수치 유틸 ──────────────────────────────────────────────────

function normCDF(x: number): number {
  const A = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429];
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const t = 1 / (1 + p * Math.abs(x));
  const poly = ((((A[4] * t + A[3]) * t + A[2]) * t + A[1]) * t + A[0]) * t;
  return 0.5 * (1 + sign * (1 - poly * Math.exp(-x * x)));
}

function bsEuropeanPut(S: number, K: number, r: number, sigma: number, T: number): number {
  if (T <= 0 || sigma <= 0 || S <= 0) return Math.max(K - S, 0);
  const sqT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqT);
  const d2 = d1 - sigma * sqT;
  return K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);
}

function solve3x3(A: number[][], b: number[]): [number, number, number] {
  const aug = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < 3; c++) {
    let mx = c;
    for (let r = c + 1; r < 3; r++) {
      if (Math.abs(aug[r][c]) > Math.abs(aug[mx][c])) mx = r;
    }
    [aug[c], aug[mx]] = [aug[mx], aug[c]];
    if (Math.abs(aug[c][c]) < 1e-10) continue;
    for (let r = 0; r < 3; r++) {
      if (r === c) continue;
      const f = aug[r][c] / aug[c][c];
      for (let k = c; k <= 3; k++) aug[r][k] -= f * aug[c][k];
    }
  }
  return [
    Math.abs(aug[0][0]) < 1e-10 ? 0 : aug[0][3] / aug[0][0],
    Math.abs(aug[1][1]) < 1e-10 ? 0 : aug[1][3] / aug[1][1],
    Math.abs(aug[2][2]) < 1e-10 ? 0 : aug[2][3] / aug[2][2],
  ];
}

function ols3(X: number[], Y: number[]): [number, number, number] {
  let s1 = 0, s2 = 0, s3 = 0, s4 = 0, y0 = 0, y1 = 0, y2 = 0;
  const n = X.length;
  for (let j = 0; j < n; j++) {
    const s = X[j], y = Y[j], ss = s * s;
    s1 += s; s2 += ss; s3 += ss * s; s4 += ss * ss;
    y0 += y; y1 += s * y; y2 += ss * y;
  }
  return solve3x3(
    [[n, s1, s2], [s1, s2, s3], [s2, s3, s4]],
    [y0, y1, y2],
  );
}

// ── LSMC 핵심 로직 ────────────────────────────────────────────

interface LSMCResult { price: number; se: number }

function runLSMC(
  S0: number, K: number, r: number, sigma: number,
  T: number, N: number, M: number,
): LSMCResult {
  const dt = T / M;
  const drift = (r - 0.5 * sigma * sigma) * dt;
  const vol = sigma * Math.sqrt(dt);
  const D = Math.exp(-r * dt);

  // 반분산 감소(Antithetic Variates)를 위해 N을 짝수로 맞춤
  const nEven = N % 2 === 0 ? N : N + 1;
  const half = nEven >> 1;
  const stride = M + 1;

  // 경로 행렬: S[i*stride + t]
  const S = new Float64Array(nEven * stride);
  for (let i = 0; i < nEven; i++) S[i * stride] = S0;

  for (let i = 0; i < half; i++) {
    for (let t = 1; t <= M; t++) {
      let u1: number;
      do { u1 = Math.random(); } while (u1 <= 0);
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * Math.random());
      const j1 = i * stride + t;
      const j2 = (i + half) * stride + t;
      S[j1] = S[j1 - 1] * Math.exp(drift + vol * z);
      S[j2] = S[j2 - 1] * Math.exp(drift - vol * z);
    }
  }

  // 만기 페이오프를 t=0 현재가치로 초기화
  const fullD = Math.pow(D, M);
  const pv = new Float64Array(nEven);
  for (let i = 0; i < nEven; i++) {
    pv[i] = Math.max(K - S[i * stride + M], 0) * fullD;
  }

  // 후방 귀납 (t = M-1 → 1)
  // pv[i]는 항상 t=0 기준 현재가치로 유지됨
  //
  // [핵심] S 그대로 회귀하면 Vandermonde 행렬 조건수가 1e7 이상이 되어
  //        계수가 크게 틀리고 "보유가치 과소추정 → 잘못된 조기행사 → PV 파괴"
  //        → American < European 현상 발생. S/K 로 정규화해 조건수를 개선.
  const itmI: number[] = [];
  const Xn: number[] = []; // 정규화된 s/K ∈ (0,1)
  const Y: number[] = [];

  for (let t = M - 1; t >= 1; t--) {
    const dtz = Math.pow(D, t); // exp(-r·t·dt)
    itmI.length = 0; Xn.length = 0; Y.length = 0;

    for (let i = 0; i < nEven; i++) {
      const s = S[i * stride + t];
      if (K > s) { itmI.push(i); Xn.push(s / K); Y.push(pv[i]); }
    }
    if (itmI.length < 5) continue;

    const [b0, b1, b2] = ols3(Xn, Y);
    for (let j = 0; j < itmI.length; j++) {
      const i = itmI[j];
      const xn = Xn[j];               // s/K
      const s  = xn * K;              // 원래 S
      // 보유가치: 음수가 나오면 0으로 클램프 (옵션은 항상 0 이상)
      const cont = Math.max(0, b0 + b1 * xn + b2 * xn * xn);
      const exer = (K - s) * dtz;     // 즉시행사 PV@t=0
      if (exer > cont) pv[i] = exer;
    }
  }

  // 가격 및 표준오차
  let sum = 0, sum2 = 0;
  for (let i = 0; i < nEven; i++) { sum += pv[i]; sum2 += pv[i] * pv[i]; }
  const price = sum / nEven;
  const variance = Math.max(0, sum2 / nEven - price * price);
  return { price, se: Math.sqrt(variance / nEven) };
}

// ── UI 컴포넌트 ───────────────────────────────────────────────

interface Inputs {
  S0: number; K: number; r: number; sigma: number;
  T: number; N: number; M: number;
}

interface CalcResult {
  americanPut: number; europeanPut: number; eep: number;
  se: number; ci95Low: number; ci95High: number; elapsed: number;
}

const DEFAULTS: Inputs = { S0: 100, K: 100, r: 5, sigma: 20, T: 1, N: 20000, M: 50 };

const FIELDS: {
  key: keyof Inputs; label: string; unit: string;
  min: number; max: number; step: number; desc: string;
}[] = [
  { key: 'S0',    label: '현재 주가 S₀',      unit: '',    min: 1,    max: 10000,  step: 1,     desc: '기초자산 현재 가격' },
  { key: 'K',     label: '행사가 K',           unit: '',    min: 1,    max: 10000,  step: 1,     desc: '옵션 행사 가격' },
  { key: 'r',     label: '무위험금리 r',        unit: '%',   min: 0,    max: 30,     step: 0.1,   desc: '연속복리 기준' },
  { key: 'sigma', label: '변동성 σ',            unit: '%',   min: 1,    max: 200,    step: 0.5,   desc: '연율화 내재변동성' },
  { key: 'T',     label: '잔존만기 T',          unit: '년',  min: 0.01, max: 10,     step: 0.01,  desc: '만기까지 남은 기간' },
  { key: 'M',     label: '이산화 단계 M',       unit: '개',  min: 10,   max: 500,    step: 1,     desc: '시간축 분할 수 (50 권장)' },
  { key: 'N',     label: '시뮬레이션 경로 N',   unit: '개',  min: 1000, max: 200000, step: 1000,  desc: '클수록 정확↑ · 느려짐↓' },
];

export default function AmericanOptionCalculator() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((key: keyof Inputs, raw: string) => {
    const n = parseFloat(raw);
    if (!isNaN(n)) setInputs(prev => ({ ...prev, [key]: n }));
  }, []);

  const handleRun = useCallback(() => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      try {
        const { S0, K, r, sigma, T, N, M } = inputs;
        const rD = r / 100, sigD = sigma / 100;
        const t0 = performance.now();
        const { price, se } = runLSMC(S0, K, rD, sigD, T, Math.round(N), Math.round(M));
        const elapsed = performance.now() - t0;
        const europeanPut = bsEuropeanPut(S0, K, rD, sigD, T);
        setResult({
          americanPut: price, europeanPut,
          eep: Math.max(0, price - europeanPut),
          se, ci95Low: price - 1.96 * se, ci95High: price + 1.96 * se,
          elapsed,
        });
      } finally {
        setLoading(false);
      }
    }, 10);
  }, [inputs]);

  const moneyness = inputs.S0 / inputs.K;

  return (
    <div className="space-y-6">
      {/* 설명 배너 */}
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-700">
        <strong>LSMC (Longstaff-Schwartz)</strong> 알고리즘을 브라우저에서 직접 실행합니다.
        기저함수 <code className="bg-blue-100 px-1 rounded">1, S, S²</code> 로 OLS 회귀 후 후방 귀납법으로 조기행사 경계를 추정합니다.
        N = 20,000경로 기준 ≈ 0.5~1초 소요. (Python 예시: N = 100,000)
      </div>

      {/* 파라미터 입력 */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
        <h3 className="text-sm font-semibold text-primary mb-4">파라미터 입력</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
          {FIELDS.map(({ key, label, unit, min, max, step, desc }) => (
            <div key={key} className={key === 'N' ? 'sm:col-span-3' : ''}>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                {label}
                {unit && <span className="ml-1 text-slate-400 font-normal">({unit})</span>}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={inputs[key]}
                  onChange={e => handleChange(key, e.target.value)}
                  min={min} max={max} step={step}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5
                    text-sm text-slate-800 font-mono
                    focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                {key === 'N' && (
                  <input
                    type="range"
                    value={inputs.N}
                    onChange={e => handleChange('N', e.target.value)}
                    min={1000} max={100000} step={1000}
                    className="w-40 accent-primary"
                  />
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleRun}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg
              hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '계산 중 …' : 'LSMC 실행'}
          </button>
          <button
            onClick={() => { setInputs(DEFAULTS); setResult(null); }}
            disabled={loading}
            className="px-4 py-2 border border-slate-200 text-slate-600 text-sm rounded-lg
              hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            초기값으로 리셋
          </button>
          {loading && (
            <span className="text-xs text-slate-400 animate-pulse">
              N = {Math.round(inputs.N).toLocaleString()}개 경로 시뮬레이션 중 …
            </span>
          )}
        </div>
      </div>

      {/* 결과 패널 */}
      {result && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <ResultCard
              label="아메리칸 풋 가격"
              value={result.americanPut.toFixed(4)}
              sub={`95% CI  [${result.ci95Low.toFixed(3)}, ${result.ci95High.toFixed(3)}]`}
              highlight
            />
            <ResultCard
              label="유러피안 풋 (B-S 해석해)"
              value={result.europeanPut.toFixed(4)}
              sub="블랙-숄즈 정확해"
            />
            <ResultCard
              label="조기행사 프리미엄 (EEP)"
              value={result.eep.toFixed(4)}
              sub="American − European"
              accent={result.eep > 0}
            />
            <ResultCard
              label="표준오차 (SE)"
              value={result.se.toFixed(5)}
              sub={`N = ${Math.round(inputs.N).toLocaleString()} 경로 기준`}
            />
            <ResultCard
              label="95% 신뢰구간 반폭"
              value={`± ${(1.96 * result.se).toFixed(4)}`}
              sub="1.96 × SE"
            />
            <ResultCard
              label="계산 소요 시간"
              value={`${result.elapsed.toFixed(0)} ms`}
              sub="브라우저 단일 스레드"
            />
          </div>

          {/* 상황 요약 */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <strong>Moneyness</strong>{' '}
              S/K = {moneyness.toFixed(3)}{' '}
              {moneyness < 0.98 ? '— ITM (Deep)' : moneyness > 1.02 ? '— OTM' : '— ATM'}
            </span>
            <span><strong>σ</strong> = {inputs.sigma}%</span>
            <span><strong>r</strong> = {inputs.r}%</span>
            <span><strong>T</strong> = {inputs.T}년</span>
            <span><strong>M</strong> = {Math.round(inputs.M)} 단계</span>
            <span><strong>N</strong> = {Math.round(inputs.N).toLocaleString()} 경로</span>
          </div>

          {/* 해석 가이드 */}
          <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-900 space-y-1">
            <p className="font-semibold text-amber-800">결과 해석 가이드</p>
            <p>• EEP &gt; 0 이면 조기행사 가치가 있음. r이 높거나 S가 K보다 낮을수록 EEP 증가.</p>
            <p>• SE &lt; 0.01이 목표. N을 4배 늘리면 SE가 절반(√N 비례)으로 줄어듦.</p>
            <p>• CI 폭이 0.03 이상이면 N을 늘려 재계산하세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  label, value, sub, highlight, accent,
}: {
  label: string; value: string; sub?: string; highlight?: boolean; accent?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border ${
      highlight
        ? 'bg-primary/5 border-primary/20'
        : accent
        ? 'bg-success/5 border-success/20'
        : 'bg-white border-slate-200'
    }`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono ${
        highlight ? 'text-primary' : accent ? 'text-success' : 'text-slate-800'
      }`}>
        {value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}
