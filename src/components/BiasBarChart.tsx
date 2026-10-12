import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Flame,
  Info
} from 'lucide-react';
import {
  AssessmentResultsData,
  BiasCategory,
  BIAS_METADATA
} from '../data/assessmentQuestions';

interface BiasBarChartProps {
  scores: AssessmentResultsData;
}

const REQUIRED_BIASES: BiasCategory[] = [
  'Loss Aversion',
  'Herding Bias',
  'Overconfidence Bias',
  'Confirmation Bias',
  'Anchoring Bias'
];

export const BiasBarChart: React.FC<BiasBarChartProps> = ({ scores }) => {
  const [activeBias, setActiveBias] = useState<BiasCategory | null>(null);

  // Extract the exact 5 biases in the required order
  const chartData = REQUIRED_BIASES.map((category) => {
    const found = scores.biasList.find((b) => b.category === category);
    const scorePercentage = found ? found.scorePercentage : scores.biasScores[category]?.scorePercentage ?? 0;
    const classification = found ? found.classification : scores.biasScores[category]?.classification ?? 'Low';
    const userScore = found ? found.userScore : scores.biasScores[category]?.userScore ?? 0;
    const maxScore = found ? found.maxScore : scores.biasScores[category]?.maxScore ?? 9;

    return {
      category,
      scorePercentage: Math.min(100, Math.max(0, scorePercentage)),
      classification,
      userScore,
      maxScore,
      meta: BIAS_METADATA[category]
    };
  });

  const getBarColor = (classification: string, isHovered: boolean) => {
    switch (classification) {
      case 'High':
        return isHovered ? 'bg-rose-700' : 'bg-rose-600';
      case 'Moderate':
        return isHovered ? 'bg-amber-600' : 'bg-amber-500';
      case 'Low':
      default:
        return isHovered ? 'bg-emerald-700' : 'bg-emerald-600';
    }
  };

  const getFillHex = (classification: string) => {
    switch (classification) {
      case 'High':
        return '#e11d48'; // rose-600
      case 'Moderate':
        return '#f59e0b'; // amber-500
      case 'Low':
      default:
        return '#059669'; // emerald-600
    }
  };

  const getBadgeClass = (classification: string) => {
    switch (classification) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Low':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  // Dimensions for SVG chart
  const svgWidth = 640;
  const svgHeight = 280;
  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartAreaWidth = svgWidth - paddingLeft - paddingRight;
  const chartAreaHeight = svgHeight - paddingTop - paddingBottom;

  // Y-axis grid levels (0, 25, 50, 75, 100)
  const yTicks = [100, 75, 50, 25, 0];

  const barWidth = 44;
  const slotWidth = chartAreaWidth / chartData.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-7 space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <BarChart3 className="w-4 h-4 text-slate-700" />
            <span>5 Behavioural Biases Visual Score Chart</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900">
            Behavioural Bias Scores (0–100%)
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Comparative bar visualization of your calculated percentage scores across all five behavioural dimensions.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg shrink-0">
          <span className="font-semibold text-slate-700 text-[11px] uppercase tracking-wider">
            Classification:
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600"></span>
            <span>Low (0–33%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
            <span>Mod (34–66%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-600"></span>
            <span>High (67–100%)</span>
          </span>
        </div>
      </div>

      {/* SVG Bar Chart (Desktop & Tablet) */}
      <div className="relative w-full overflow-x-auto pb-2">
        <div className="min-w-[540px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto select-none"
            aria-label="Bar chart showing percentage scores for all five behavioural biases"
          >
            {/* Background threshold bands */}
            {/* High Band: 67% to 100% */}
            <rect
              x={paddingLeft}
              y={paddingTop}
              width={chartAreaWidth}
              height={chartAreaHeight * 0.33}
              fill="#fff1f2"
              fillOpacity="0.4"
            />
            {/* Moderate Band: 34% to 66% */}
            <rect
              x={paddingLeft}
              y={paddingTop + chartAreaHeight * 0.33}
              width={chartAreaWidth}
              height={chartAreaHeight * 0.33}
              fill="#fffbeb"
              fillOpacity="0.4"
            />
            {/* Low Band: 0% to 33% */}
            <rect
              x={paddingLeft}
              y={paddingTop + chartAreaHeight * 0.66}
              width={chartAreaWidth}
              height={chartAreaHeight * 0.34}
              fill="#f0fdf4"
              fillOpacity="0.4"
            />

            {/* Y-Axis Grid Lines & Tick Labels (0–100%) */}
            {yTicks.map((tick) => {
              const y = paddingTop + chartAreaHeight * (1 - tick / 100);
              return (
                <g key={`y-tick-${tick}`}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={paddingLeft + chartAreaWidth}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray={tick === 0 || tick === 100 ? undefined : '4 4'}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fontWeight="500"
                    fill="#64748b"
                    className="tabular-nums"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* Threshold guide lines: 33% and 66% */}
            <line
              x1={paddingLeft}
              y1={paddingTop + chartAreaHeight * (1 - 33 / 100)}
              x2={paddingLeft + chartAreaWidth}
              y2={paddingTop + chartAreaHeight * (1 - 33 / 100)}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <line
              x1={paddingLeft}
              y1={paddingTop + chartAreaHeight * (1 - 66 / 100)}
              x2={paddingLeft + chartAreaWidth}
              y2={paddingTop + chartAreaHeight * (1 - 66 / 100)}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Bars for the 5 Biases */}
            {chartData.map((item, index) => {
              const xCenter = paddingLeft + index * slotWidth + slotWidth / 2;
              const x = xCenter - barWidth / 2;
              const barHeight = Math.max(4, (item.scorePercentage / 100) * chartAreaHeight);
              const y = paddingTop + chartAreaHeight - barHeight;
              const isHovered = activeBias === item.category;
              const fill = getFillHex(item.classification);

              return (
                <g
                  key={item.category}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setActiveBias(item.category)}
                  onMouseLeave={() => setActiveBias(null)}
                  onClick={() => setActiveBias(activeBias === item.category ? null : item.category)}
                >
                  {/* Invisible hit box for comfortable hovering */}
                  <rect
                    x={x - 8}
                    y={paddingTop}
                    width={barWidth + 16}
                    height={chartAreaHeight + paddingBottom}
                    fill="transparent"
                  />

                  {/* Vertical bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill={fill}
                    fillOpacity={isHovered ? 1 : 0.9}
                    filter={isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))' : undefined}
                    stroke={isHovered ? '#0f172a' : undefined}
                    strokeWidth={isHovered ? 2 : 0}
                    className="transition-all duration-200"
                  />

                  {/* Percentage label on top of bar */}
                  <text
                    x={xCenter}
                    y={Math.max(16, y - 8)}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="700"
                    fill="#0f172a"
                    className="tabular-nums"
                  >
                    {item.scorePercentage}%
                  </text>

                  {/* X-axis label (Category Name) */}
                  <text
                    x={xCenter}
                    y={paddingTop + chartAreaHeight + 20}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isHovered ? '700' : '600'}
                    fill={isHovered ? '#0f172a' : '#334155'}
                  >
                    {item.category.replace(' Bias', '')}
                  </text>
                  <text
                    x={xCenter}
                    y={paddingTop + chartAreaHeight + 34}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="500"
                    fill="#64748b"
                  >
                    {item.category.includes('Bias') ? 'Bias' : ''}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Interactive Detail Card for the Hovered or Selected Bias */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs transition-all">
        {activeBias ? (
          (() => {
            const activeItem = chartData.find((b) => b.category === activeBias)!;
            return (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{activeItem.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getBadgeClass(activeItem.classification)}`}>
                      {activeItem.classification} Bias ({activeItem.scorePercentage}%)
                    </span>
                  </div>
                  <span className="text-slate-500 tabular-nums font-medium">
                    Calculated Raw: {activeItem.userScore} / {activeItem.maxScore} pts
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {activeItem.meta.definition}
                </p>
                <div className="pt-1 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Academic Origin: {activeItem.meta.academicOrigin}</span>
                  <span className="italic">Hover over another bar to compare</span>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="flex items-center justify-between text-slate-600">
            <span className="inline-flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Hover over or tap any bar above to inspect detailed psychological definitions, academic citations, and raw score breakdown.</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Y-Axis Scale: 0–100%</span>
          </div>
        )}
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
        {chartData.map((b) => (
          <div
            key={`stat-${b.category}`}
            className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-center space-y-0.5"
          >
            <div className="text-[10px] text-slate-500 uppercase tracking-wider truncate font-medium">
              {b.category}
            </div>
            <div className="text-base font-extrabold text-slate-900 tabular-nums">
              {b.scorePercentage}%
            </div>
            <div className="text-[10px] font-semibold">
              <span
                className={`inline-block px-1.5 py-0.2 rounded text-[10px] ${
                  b.classification === 'High'
                    ? 'text-rose-700 bg-rose-50'
                    : b.classification === 'Moderate'
                    ? 'text-amber-700 bg-amber-50'
                    : 'text-emerald-700 bg-emerald-50'
                }`}
              >
                {b.classification}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
