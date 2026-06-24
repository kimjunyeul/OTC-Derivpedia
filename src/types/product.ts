export type RiskLevel = 'high' | 'medium' | 'low';
export type CategoryId = 'interest-rate' | 'credit' | 'equity' | 'fx' | 'commodity' | 'other';
export type CashFlowTiming = 'upfront' | 'periodic' | 'maturity' | 'early-termination';
export type CashFlowType = 'positive' | 'negative' | 'neutral';

export const CATEGORY_NAMES: Record<CategoryId, string> = {
  'interest-rate': '금리 파생상품',
  credit: '신용 파생상품',
  equity: '주식/지수 파생상품',
  fx: '외환(FX) 파생상품',
  commodity: '상품(Commodity) 파생상품',
  other: '기타 파생상품',
};

export const CATEGORY_ORDER: CategoryId[] = [
  'interest-rate',
  'credit',
  'equity',
  'fx',
  'commodity',
  'other',
];

export interface PoisonClause {
  name: string;
  level: RiskLevel;
  description: string;
}

export interface PayoffPoint {
  spot: number;
  payoff: number;
}

export interface PayoffScenario {
  id: string;
  label: string;
  data: PayoffPoint[];
  color?: string;
  dashed?: boolean;
}

export interface RiskRadarItem {
  subject: string;
  value: number;
  fullMark: 5;
}

export interface CashFlowParty {
  id: string;
  name: string;
  role: string;
  type?: 'client' | 'dealer' | 'ccp' | 'other';
}

export interface CashFlowArrow {
  from: string;
  to: string;
  label: string;
  sublabel?: string;
  timing: CashFlowTiming;
  type?: CashFlowType;
}

export interface CashFlowScenario {
  id: string;
  label: string;
  description?: string;
  arrows: CashFlowArrow[];
}

export interface CashFlowData {
  parties: CashFlowParty[];
  scenarios: CashFlowScenario[];
  notes?: string[];
}

export interface ProductSection {
  title: string;
  content: string;
}

export interface Product {
  id: string;
  name: string;
  fullName: string;
  categoryId: CategoryId;
  tags: string[];
  difficulty: number; // 1–5
  sections: {
    overview: ProductSection;
    structure: ProductSection;
    risk: ProductSection & { riskRadar?: RiskRadarItem[] };
    pnl: ProductSection & {
      payoffScenarios?: PayoffScenario[];
      payoffData?: PayoffPoint[];
      xLabel?: string;
      yLabel?: string;
    };
    poison: ProductSection & { clauses: PoisonClause[] };
    valuation: ProductSection;
    cashflow?: ProductSection & { diagram?: CashFlowData };
  };
}
