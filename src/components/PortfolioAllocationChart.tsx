import React, { useState } from 'react';
import {
  PieChart,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import {
  PortfolioInvestment,
  InvestmentType,
  analyzePortfolio
} from '../data/portfolio';
import { formatINR } from '../utils/currency';

interface PortfolioAllocationChartProps {
  investments: PortfolioInvestment[];
  onOpenPortfolio?: () => void;
}

const CATEGORY_COLORS: Record<InvestmentType, { bg: string; text: string; bar: string; hex: string }> = {
  Equity: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    bar: 'bg-blue-600',
    hex: '#2563eb'
  },
  'Indian Equity': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    bar: 'bg-blue-600',
    hex: '#2563eb'
  },
  'Mutual Funds': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    bar: 'bg-emerald-600',
    hex: '#059669'
  },
  'Mutual Fund': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    bar: 'bg-emerald-600',
    hex: '#059669'
  },
  ETFs: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    bar: 'bg-indigo-600',
    hex: '#4f46e5'
  },
  ETF: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    bar: 'bg-indigo-600',
    hex: '#4f46e5'
  },
  'Gold / Gold ETFs': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    hex: '#f59e0b'
  },
  'Gold / Gold ETF': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    hex: '#f59e0b'
  },
  'Debt / Fixed Income': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    bar: 'bg-purple-600',
    hex: '#9333ea'
  },
  'Government Securities': {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    bar: 'bg-purple-600',
    hex: '#9333ea'
  },
  'Real Estate': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    bar: 'bg-rose-600',
    hex: '#e11d48'
  },
  'Cash / Emergency Reserve': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    bar: 'bg-sky-600',
    hex: '#0284c7'
  },
  Other: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    bar: 'bg-slate-600',
    hex: '#475569'
  }
};

const INVESTMENT_PALETTE = [
  '#2563eb', // blue-600
  '#059669', // emerald-600
  '#7c3aed', // violet-600
  '#d97706', // amber-600
  '#db2777', // pink-600
  '#0891b2', // cyan-600
  '#4f46e5', // indigo-600
  '#ea580c', // orange-600
  '#64748b'  // slate-500
];

export const PortfolioAllocationChart: React.FC<PortfolioAllocationChartProps> = ({
  investments,
  onOpenPortfolio
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // If user has not added any investments yet
  if (!investments || investments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Briefcase className="w-4 h-4 text-slate-700" />
              <span>Portfolio Allocation Chart</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900">
              Actual Portfolio Allocation
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-medium">
            0 Assets
          </span>
        </div>

        <div className="py-8 px-4 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <PieChart className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900 font-display">
            No Portfolio Investments Entered Yet
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            BIAS FOLIO visualizes only your actual portfolio entries and does not generate mock or sample user data. Add your investments to view your real allocation percentages across assets and categories.
          </p>
          {onOpenPortfolio && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenPortfolio}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <span>Add Holdings in Portfolio Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Calculate allocation metrics using existing calculate function
  const summary = analyzePortfolio(investments);
  const totalAmount = summary.totalAmount;

  // Active categories with non-zero allocation
  const activeCategories = Object.entries(summary.typeAllocation)
    .filter(([_, data]) => data.amount > 0)
    .map(([type, data]) => ({
      type: type as InvestmentType,
      amount: data.amount,
      percentage: data.percentage
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <PieChart className="w-4 h-4 text-slate-700" />
            <span>Actual Portfolio Allocation Chart</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900">
            Portfolio Allocation Breakdown
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Calculated percentage distribution across your {summary.investmentCount} portfolio {summary.investmentCount === 1 ? 'asset' : 'assets'} and asset categories.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">
              Total Capital
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              {formatINR(totalAmount)}
            </span>
          </div>
          {onOpenPortfolio && (
            <button
              type="button"
              onClick={onOpenPortfolio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Multi-Segment Proportional Distribution Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Overall Allocation Proportion (100%)</span>
          <span className="text-slate-400">{summary.investmentCount} Holdings</span>
        </div>

        <div className="w-full h-5 rounded-lg overflow-hidden flex bg-slate-100 border border-slate-200/80 shadow-xs">
          {summary.allocations.map((inv, idx) => {
            const color = INVESTMENT_PALETTE[idx % INVESTMENT_PALETTE.length];
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={inv.id}
                className="h-full relative transition-all duration-200 cursor-pointer"
                style={{
                  width: `${inv.percentage}%`,
                  backgroundColor: color,
                  opacity: hoveredIndex !== null && !isHovered ? 0.45 : 1
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                title={`${inv.name}: ${inv.percentage}% (${formatINR(inv.amount)})`}
              />
            );
          })}
        </div>

        {/* Hover detail indicator if user hovers on bar */}
        {hoveredIndex !== null && summary.allocations[hoveredIndex] && (
          <div className="p-2.5 rounded-lg bg-slate-900 text-white text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: INVESTMENT_PALETTE[hoveredIndex % INVESTMENT_PALETTE.length]
                }}
              />
              <span className="font-bold truncate">{summary.allocations[hoveredIndex].name}</span>
              <span className="text-slate-300 text-[11px] truncate">
                ({summary.allocations[hoveredIndex].type})
              </span>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <span className="text-slate-300 tabular-nums">
                {formatINR(summary.allocations[hoveredIndex].amount)}
              </span>
              <span className="font-extrabold text-amber-300 tabular-nums">
                {summary.allocations[hoveredIndex].percentage}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-side or stacked grid: Individual Assets vs Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Left (8 cols): Individual Investment Bar Chart */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-600">
            <span>Holdings &amp; Allocation Percentage</span>
            <span>Weight (%)</span>
          </div>

          <div className="space-y-3">
            {summary.allocations.map((inv, idx) => {
              const color = INVESTMENT_PALETTE[idx % INVESTMENT_PALETTE.length];
              const categoryTheme = CATEGORY_COLORS[inv.type] || CATEGORY_COLORS['Other'];
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={inv.id}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'border-slate-900 bg-slate-50/80 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {inv.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${categoryTheme.bg} ${categoryTheme.text}`}
                        >
                          {inv.type}
                        </span>
                        <span className="text-slate-500 tabular-nums">
                          {formatINR(inv.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-slate-900 tabular-nums">
                        {inv.percentage}%
                      </span>
                      {summary.largestInvestment?.name === inv.name && summary.allocations.length > 1 && (
                        <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                          Largest Holding
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Allocation Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${inv.percentage}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (5 cols): Category Allocation Distribution */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-600">
            <span>Asset Category Split</span>
            <span>Category %</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
            {activeCategories.map((cat) => {
              const theme = CATEGORY_COLORS[cat.type] || CATEGORY_COLORS['Other'];

              return (
                <div key={cat.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${theme.bar}`}></span>
                      {cat.type}
                    </span>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-slate-500 tabular-nums">{formatINR(cat.amount)}</span>
                      <span className="font-bold text-slate-900 tabular-nums">{cat.percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${theme.bar}`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Concentration Metric Card */}
          {summary.largestInvestment && (
            <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Portfolio Concentration
              </span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 truncate">
                  {summary.largestInvestment.name}
                </span>
                <span className="font-extrabold text-slate-900 tabular-nums">
                  {summary.largestInvestment.percentage}% of Capital
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {summary.largestInvestment.percentage >= 40
                  ? 'Heavy single-holding concentration (≥40%), which in behavioural finance often suggests high conviction or familiarity bias.'
                  : 'Well-distributed portfolio allocation without excessive single-asset concentration.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
