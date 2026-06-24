'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { RiskRadarItem } from '@/types/product';

interface Props {
  data: RiskRadarItem[];
}

export default function RiskRadar({ data }: Props) {
  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: '#475569' }}
          />
          <Tooltip
            formatter={(value) => [`${value} / 5`, '리스크 수준']}
            contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6 }}
          />
          <Radar
            name="리스크"
            dataKey="value"
            stroke="#0066CC"
            fill="#0066CC"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
