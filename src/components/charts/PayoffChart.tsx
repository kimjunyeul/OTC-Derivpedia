'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
  Legend,
} from 'recharts';
import type { PayoffPoint, PayoffScenario } from '@/types/product';

const DEFAULT_COLORS = ['#003087', '#FF6B00', '#2E7D32', '#9C27B0'];

interface Props {
  data?: PayoffPoint[];
  scenarios?: PayoffScenario[];
  xLabel?: string;
  yLabel?: string;
}

export default function PayoffChart({ data, scenarios, xLabel = 'Spot', yLabel = 'P&L' }: Props) {
  const isMulti = scenarios && scenarios.length > 0;

  if (isMulti) {
    // Build merged dataset: all unique x values, one column per scenario
    const allSpots = [...new Set(scenarios.flatMap((s) => s.data.map((p) => p.spot)))].sort(
      (a, b) => a - b,
    );
    const merged = allSpots.map((spot) => {
      const entry: Record<string, number | null> = { spot };
      for (const s of scenarios) {
        const pt = s.data.find((p) => p.spot === spot);
        entry[s.id] = pt ? pt.payoff : null;
      }
      return entry;
    });

    return (
      <div className="w-full h-80 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="spot" tickFormatter={(v) => `${v}%`} stroke="#64748b" tick={{ fontSize: 12 }}>
              <Label value={xLabel} position="insideBottom" offset={-15} style={{ fontSize: 12, fill: '#64748b' }} />
            </XAxis>
            <YAxis stroke="#64748b" tick={{ fontSize: 12 }}>
              <Label value={yLabel} angle={-90} position="insideLeft" offset={10} style={{ fontSize: 12, fill: '#64748b' }} />
            </YAxis>
            <Tooltip
              formatter={(value, name) => {
                const s = scenarios.find((sc) => sc.id === name);
                return [Number(value).toFixed(2), s?.label ?? String(name)];
              }}
              labelFormatter={(label) => `${xLabel}: ${label}%`}
              contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6 }}
            />
            <Legend
              formatter={(value) => scenarios.find((s) => s.id === value)?.label ?? value}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
            {scenarios.map((s, i) => (
              <Line
                key={s.id}
                type="linear"
                dataKey={s.id}
                stroke={s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                strokeWidth={2.5}
                strokeDasharray={s.dashed ? '6 3' : undefined}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Single-scenario fallback (backward compatible)
  const chartData = data ?? [];
  return (
    <div className="w-full h-72 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="spot" tickFormatter={(v) => `${v}%`} stroke="#64748b" tick={{ fontSize: 12 }}>
            <Label value={xLabel} position="insideBottom" offset={-15} style={{ fontSize: 12, fill: '#64748b' }} />
          </XAxis>
          <YAxis stroke="#64748b" tick={{ fontSize: 12 }}>
            <Label value={yLabel} angle={-90} position="insideLeft" offset={10} style={{ fontSize: 12, fill: '#64748b' }} />
          </YAxis>
          <Tooltip
            formatter={(value) => [Number(value).toFixed(2), 'P&L']}
            labelFormatter={(label) => `${xLabel}: ${label}%`}
            contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6 }}
          />
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
          <Line
            type="linear"
            dataKey="payoff"
            stroke="#003087"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, fill: '#FF6B00' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
