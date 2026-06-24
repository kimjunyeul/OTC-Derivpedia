'use client';

import { useEffect, useState } from 'react';
import type { Product, RiskLevel } from '@/types/product';
import { CATEGORY_NAMES } from '@/types/product';
import MarkdownSection from './MarkdownSection';
import dynamic from 'next/dynamic';

const PayoffChart = dynamic(() => import('./charts/PayoffChart'), { ssr: false });
const RiskRadar = dynamic(() => import('./charts/RiskRadar'), { ssr: false });
const CashFlowDiagram = dynamic(() => import('./charts/CashFlowDiagram'), { ssr: false });
const AmericanOptionCalculator = dynamic(
  () => import('./calculators/AmericanOptionCalculator'),
  { ssr: false },
);

type SectionId = 'overview' | 'structure' | 'risk' | 'pnl' | 'cashflow' | 'poison' | 'valuation' | 'calculator';

const CALCULATOR_PRODUCTS = new Set(['american-option']);

const BASE_TABS: { id: SectionId; label: string }[] = [
  { id: 'overview',   label: '상품 개요' },
  { id: 'structure',  label: '상품 구조' },
  { id: 'risk',       label: '리스크' },
  { id: 'pnl',        label: '손익 분석' },
  { id: 'cashflow',   label: '현금흐름 조감도' },
  { id: 'poison',     label: '독소조항' },
  { id: 'valuation',  label: '평가 방법론' },
  { id: 'calculator', label: '계산기 🧮' },
];

const RISK_CONFIG: Record<RiskLevel, { label: string; className: string; dot: string }> = {
  high:   { label: '고위험', className: 'bg-red-50 border-red-200 text-red-800',     dot: 'bg-red-500' },
  medium: { label: '중위험', className: 'bg-amber-50 border-amber-200 text-amber-800', dot: 'bg-amber-500' },
  low:    { label: '저위험', className: 'bg-green-50 border-green-200 text-green-700', dot: 'bg-green-500' },
};

const DIFFICULTY_LABELS = ['', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★'];

interface Props {
  product: Product;
}

export default function ProductPage({ product }: Props) {
  const tabs = BASE_TABS.filter(
    (t) =>
      (t.id !== 'cashflow' || !!product.sections.cashflow) &&
      (t.id !== 'calculator' || CALCULATOR_PRODUCTS.has(product.id)),
  );

  const [activeTab, setActiveTab] = useState<SectionId>('overview');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as SectionId;
    if (tabs.some((t) => t.id === hash)) setActiveTab(hash);
  }, []);

  const handleTab = (id: SectionId) => {
    setActiveTab(id);
    history.replaceState(null, '', `#${id}`);
  };

  const pnl = product.sections.pnl;
  const cashflow = product.sections.cashflow;

  // The content shown in the markdown area differs by tab
  const activeSection =
    activeTab === 'calculator' || (activeTab === 'cashflow' && !cashflow)
      ? null
      : activeTab === 'cashflow' && cashflow
      ? cashflow
      : product.sections[activeTab as Exclude<SectionId, 'cashflow' | 'calculator'>];

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 mb-4">
        <span>{CATEGORY_NAMES[product.categoryId]}</span>
        <span className="mx-1.5">›</span>
        <span className="text-slate-600 font-medium">{product.name}</span>
      </nav>

      {/* Product header */}
      <div className="flex items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-primary">{product.name}</h1>
            <span className="text-sm font-normal text-slate-500">{product.fullName}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              {CATEGORY_NAMES[product.categoryId]}
            </span>
            <span className="text-xs text-amber-500 font-medium" title="복잡도">
              {DIFFICULTY_LABELS[product.difficulty]}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {product.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`
                flex-shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Section content */}
      <div>
        {/* Risk tab: radar chart above markdown */}
        {activeTab === 'risk' && product.sections.risk.riskRadar && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-600 mb-1">리스크 프로파일 (0–5)</h3>
            <RiskRadar data={product.sections.risk.riskRadar} />
          </div>
        )}

        {/* PnL tab: payoff chart(s) above markdown */}
        {activeTab === 'pnl' && (pnl.payoffScenarios || pnl.payoffData) && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-600 mb-1">
              페이오프 다이어그램
              {pnl.payoffScenarios && pnl.payoffScenarios.length > 1 && (
                <span className="ml-2 text-xs font-normal text-slate-400">
                  (시나리오별 비교)
                </span>
              )}
            </h3>
            <PayoffChart
              data={pnl.payoffData}
              scenarios={pnl.payoffScenarios}
              xLabel={pnl.xLabel}
              yLabel={pnl.yLabel}
            />
          </div>
        )}

        {/* Cash flow tab: diagram above markdown */}
        {activeTab === 'cashflow' && cashflow && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-3">
              거래 당사자 현금흐름 조감도
            </h3>
            {cashflow.diagram ? (
              <CashFlowDiagram data={cashflow.diagram} />
            ) : (
              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-500 text-center">
                현금흐름 다이어그램 준비 중
              </div>
            )}
          </div>
        )}

        {/* Poison tab: clauses above markdown */}
        {activeTab === 'poison' && (
          <div className="mb-6 space-y-3">
            {product.sections.poison.clauses.map((clause) => {
              const cfg = RISK_CONFIG[clause.level];
              return (
                <div key={clause.name} className={`p-4 rounded-lg border ${cfg.className}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <span className="font-semibold text-sm">{clause.name}</span>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed pl-4">{clause.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Calculator tab */}
        {activeTab === 'calculator' && CALCULATOR_PRODUCTS.has(product.id) && (
          <AmericanOptionCalculator />
        )}

        {/* Markdown content */}
        {activeSection && <MarkdownSection content={activeSection.content} />}
      </div>
    </div>
  );
}
