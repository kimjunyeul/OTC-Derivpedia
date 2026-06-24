'use client';

import { useState } from 'react';
import type { CashFlowData, CashFlowArrow, CashFlowParty, CashFlowTiming, CashFlowType } from '@/types/product';

const TIMING_CONFIG: Record<CashFlowTiming, { label: string; className: string }> = {
  upfront:            { label: '계약 개시',  className: 'bg-orange-50 text-orange-700 border-orange-200' },
  periodic:           { label: '정기 결제',  className: 'bg-blue-50 text-blue-700 border-blue-200' },
  maturity:           { label: '만기',        className: 'bg-green-50 text-green-700 border-green-200' },
  'early-termination':{ label: '조기종료',   className: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const ARROW_TYPE_CONFIG: Record<CashFlowType, { pill: string; head: string }> = {
  positive: { pill: 'bg-green-50 border-green-400 text-green-800',  head: 'text-green-500' },
  negative: { pill: 'bg-red-50 border-red-400 text-red-800',        head: 'text-red-500' },
  neutral:  { pill: 'bg-white border-slate-300 text-slate-700',     head: 'text-slate-400' },
};

const PARTY_CONFIG: Record<string, { border: string; bg: string; header: string; text: string }> = {
  client:  { border: 'border-primary',    bg: 'bg-blue-50',   header: 'bg-primary',    text: 'text-white' },
  dealer:  { border: 'border-slate-400',  bg: 'bg-slate-50',  header: 'bg-slate-600',  text: 'text-white' },
  ccp:     { border: 'border-amber-400',  bg: 'bg-amber-50',  header: 'bg-amber-500',  text: 'text-white' },
  other:   { border: 'border-slate-300',  bg: 'bg-slate-50',  header: 'bg-slate-500',  text: 'text-white' },
};

function PartyCard({ party }: { party: CashFlowParty }) {
  const cfg = PARTY_CONFIG[party.type ?? 'other'];
  return (
    <div className={`w-32 flex-shrink-0 rounded-xl border-2 ${cfg.border} ${cfg.bg} overflow-hidden shadow-sm`}>
      <div className={`${cfg.header} px-3 py-2`}>
        <div className={`text-xs font-bold leading-tight ${cfg.text}`}>{party.name}</div>
      </div>
      <div className="px-3 py-2">
        <p className="text-xs text-slate-600 leading-snug">{party.role}</p>
      </div>
    </div>
  );
}

function ArrowRow({ arrow, partyIds }: { arrow: CashFlowArrow; partyIds: string[] }) {
  const fromIdx = partyIds.indexOf(arrow.from);
  const toIdx = partyIds.indexOf(arrow.to);
  const goesRight = fromIdx < toIdx;
  const timing = TIMING_CONFIG[arrow.timing];
  const typeCfg = ARROW_TYPE_CONFIG[arrow.type ?? 'neutral'];

  return (
    <div className="flex items-center gap-2 py-1">
      {/* Left arrowhead */}
      <span className={`text-base flex-shrink-0 leading-none ${goesRight ? 'opacity-0' : typeCfg.head}`}>
        ◀
      </span>

      {/* Label pill */}
      <div className={`flex-1 rounded-full border px-3 py-1.5 text-center shadow-sm ${typeCfg.pill}`}>
        <div className="text-xs font-semibold leading-tight">{arrow.label}</div>
        {arrow.sublabel && (
          <div className="text-xs text-slate-500 mt-0.5 leading-tight">{arrow.sublabel}</div>
        )}
      </div>

      {/* Right arrowhead */}
      <span className={`text-base flex-shrink-0 leading-none ${!goesRight ? 'opacity-0' : typeCfg.head}`}>
        ▶
      </span>

      {/* Timing badge */}
      <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${timing.className}`}>
        {timing.label}
      </span>
    </div>
  );
}

interface Props {
  data: CashFlowData;
}

export default function CashFlowDiagram({ data }: Props) {
  const [activeId, setActiveId] = useState(data.scenarios[0].id);
  const scenario = data.scenarios.find((s) => s.id === activeId) ?? data.scenarios[0];
  const partyIds = data.parties.map((p) => p.id);

  const leftParty = data.parties[0];
  const rightParty = data.parties[data.parties.length - 1];

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Scenario tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50">
        {data.scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`
              flex-shrink-0 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors
              ${activeId === s.id
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60'}
            `}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Diagram area */}
      <div className="p-5">
        {/* Parties + Arrows */}
        <div className="flex items-center gap-3">
          <PartyCard party={leftParty} />

          {/* Arrow column */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            {scenario.arrows.length === 0 ? (
              <div className="text-center text-xs text-slate-400 py-4">
                이 시나리오에서는 현금흐름 없음
              </div>
            ) : (
              scenario.arrows.map((arrow, i) => (
                <ArrowRow key={i} arrow={arrow} partyIds={partyIds} />
              ))
            )}
          </div>

          <PartyCard party={rightParty} />
        </div>

        {/* Scenario description */}
        {scenario.description && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800 leading-relaxed">
            <span className="font-semibold">ℹ️ </span>{scenario.description}
          </div>
        )}
      </div>

      {/* Notes */}
      {data.notes && data.notes.length > 0 && (
        <div className="px-5 pb-4 border-t border-slate-100 pt-3">
          <ul className="space-y-1">
            {data.notes.map((note, i) => (
              <li key={i} className="flex gap-1.5 text-xs text-slate-500">
                <span className="flex-shrink-0">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
