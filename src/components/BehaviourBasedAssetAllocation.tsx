import React, { useState } from 'react';
import {
  PieChart as PieChartIcon,
  ShieldCheck,
  Scale,
  TrendingUp,
  AlertCircle,
  Clock,
  Wallet,
  Users,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { AssessmentResultsData } from '../data/assessmentQuestions';

export type BehaviouralProfile = 'Cautious' | 'Balanced' | 'Growth-oriented';

export interface BroadAssetClass {
  name: string;
  categoryKey: 'equity' | 'debt' | 'gold' | 'realEstate' | 'cash';
  percentage: number;
  color: string;
  bgColor: string;
  simpleRole: string;
  simpleExplanation: string;
  indianInstruments: string;
  limitations: string;
}

export interface ProfileAllocationConfig {
  profile: BehaviouralProfile;
  headline: string;
  badgeLabel: string;
  badgeClass: string;
  explanation: string;
  allocations: BroadAssetClass[];
}

/**
 * Illustrative broad asset allocations tailored for Indian retail investors.
 * Broad categories: Equity, Debt / Fixed Income, Gold, Real Estate, Cash / Emergency Reserve.
 * Each profile totals EXACTLY 100%.
 */
export const BEHAVIOUR_ALLOCATIONS: Record<BehaviouralProfile, ProfileAllocationConfig> = {
  Cautious: {
    profile: 'Cautious',
    headline: 'Capital Safety & Volatility Cushion',
    badgeLabel: 'Cautious Profile',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    explanation:
      'Your assessment suggests that you prefer protecting capital from sharp market pullbacks over chasing high returns. This illustrative cautious allocation prioritizes fixed income (40%) and traditional buffers like gold, real estate, and emergency cash (35%), while allocating a conservative 25% to equity so savings can still outpace inflation over the long run.',
    allocations: [
      {
        name: 'Equity',
        categoryKey: 'equity',
        percentage: 25,
        color: '#2563eb', // blue-600
        bgColor: 'bg-blue-600',
        simpleRole: 'Long-term compounding above inflation',
        simpleExplanation: 'Grows capital gradually over multi-year cycles by participating in Indian economic and corporate growth.',
        indianInstruments: 'Nifty 50 Index Mutual Funds, Sensex ETFs, broad market SIPs',
        limitations: 'Subject to short-term market corrections on NSE/BSE and cyclical business drawdowns.'
      },
      {
        name: 'Debt / Fixed Income',
        categoryKey: 'debt',
        percentage: 40,
        color: '#059669', // emerald-600
        bgColor: 'bg-emerald-600',
        simpleRole: 'Stability, regular income, and capital defense',
        simpleExplanation: 'Provides predictable interest returns and acts as a stabilizing anchor to smooth out equity volatility.',
        indianInstruments: 'Bank Fixed Deposits (FDs), Public Provident Fund (PPF), Government Securities (G-Secs), Corporate Debt Funds',
        limitations: 'Post-tax interest returns may struggle to significantly beat high retail inflation over decades.'
      },
      {
        name: 'Gold',
        categoryKey: 'gold',
        percentage: 15,
        color: '#d97706', // amber-600
        bgColor: 'bg-amber-600',
        simpleRole: 'Crisis safety net and currency hedge',
        simpleExplanation: 'Acts as a traditional store of value and purchasing power defense during currency depreciation or market turmoil.',
        indianInstruments: 'Sovereign Gold Bonds (SGBs), Gold ETFs, Digital Gold, Hallmarked Bullion',
        limitations: 'Generates no regular dividend or interest yield; price fluctuates with global precious metal trends.'
      },
      {
        name: 'Real Estate',
        categoryKey: 'realEstate',
        percentage: 10,
        color: '#7c3aed', // violet-600
        bgColor: 'bg-violet-600',
        simpleRole: 'Physical tangible asset diversification',
        simpleExplanation: 'Invests in physical property or land that moves independently of daily stock market headlines.',
        indianInstruments: 'Residential property, commercial land, Real Estate Investment Trusts (REITs)',
        limitations: 'High initial capital requirement, indivisible, and very low liquidity (takes months to sell).'
      },
      {
        name: 'Cash / Emergency Reserve',
        categoryKey: 'cash',
        percentage: 10,
        color: '#0284c7', // sky-600
        bgColor: 'bg-sky-600',
        simpleRole: 'Immediate liquidity for personal emergencies',
        simpleExplanation: 'Readily accessible money in your bank account so you never have to liquidate long-term investments in a panic.',
        indianInstruments: 'Savings Bank Account, Instant-access Liquid Funds, Auto-sweep FDs (3–6 months of living expenses)',
        limitations: 'Earns the lowest nominal return, slowly losing purchasing power to inflation over time.'
      }
    ]
  },

  Balanced: {
    profile: 'Balanced',
    headline: 'Equalized Growth & Capital Defense',
    badgeLabel: 'Balanced Profile',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    explanation:
      'Your assessment indicates a balanced perspective: comfortable with standard market ups and downs while valuing a dependable defensive cushion. This allocation provides 40% equity for steady wealth building, supported by 30% debt and 30% across gold, real estate, and emergency reserves to moderate volatility.',
    allocations: [
      {
        name: 'Equity',
        categoryKey: 'equity',
        percentage: 40,
        color: '#2563eb', // blue-600
        bgColor: 'bg-blue-600',
        simpleRole: 'Primary capital compounding engine',
        simpleExplanation: 'Participates in broader corporate profits and economic expansion to grow wealth faster than savings deposits.',
        indianInstruments: 'Nifty 50 and Nifty Next 50 Index Funds, Flexi-cap Mutual Funds, Large-cap ETFs',
        limitations: 'Unpredictable short-term movements; requires an investment horizon of at least 5 years.'
      },
      {
        name: 'Debt / Fixed Income',
        categoryKey: 'debt',
        percentage: 30,
        color: '#059669', // emerald-600
        bgColor: 'bg-emerald-600',
        simpleRole: 'Portfolio ballast and steady yields',
        simpleExplanation: 'Maintains capital stability and provides predictable interest to balance equity swings.',
        indianInstruments: 'High-rated Corporate FDs, Short-term Debt Funds, National Savings Certificates (NSC), G-Secs',
        limitations: 'Fixed income gains are taxed according to slab rates and offer minimal real capital appreciation.'
      },
      {
        name: 'Gold',
        categoryKey: 'gold',
        percentage: 10,
        color: '#d97706', // amber-600
        bgColor: 'bg-amber-600',
        simpleRole: 'Hedge against rupee depreciation and inflation',
        simpleExplanation: 'Provides domestic purchasing power stability and cultural financial resilience.',
        indianInstruments: 'Sovereign Gold Bonds (SGBs), Gold Mutual Funds, Gold ETFs',
        limitations: 'Does not create economic output or ongoing cash income.'
      },
      {
        name: 'Real Estate',
        categoryKey: 'realEstate',
        percentage: 10,
        color: '#7c3aed', // violet-600
        bgColor: 'bg-violet-600',
        simpleRole: 'Tangible real property component',
        simpleExplanation: 'Long-term exposure to tangible physical assets and potential rental cash flow.',
        indianInstruments: 'REITs listed on NSE/BSE, residential/commercial physical holdings',
        limitations: 'High transaction friction (stamp duty, registration fees, maintenance costs).'
      },
      {
        name: 'Cash / Emergency Reserve',
        categoryKey: 'cash',
        percentage: 10,
        color: '#0284c7', // sky-600
        bgColor: 'bg-sky-600',
        simpleRole: 'Emergency buffer (3–6 months of expenses)',
        simpleExplanation: 'Safe, instantly available funds for health, family, or employment contingencies.',
        indianInstruments: 'Bank Savings Accounts, Overnight Funds, Liquid Mutual Funds',
        limitations: 'Cash holdings lose value in real terms as consumer prices rise.'
      }
    ]
  },

  'Growth-oriented': {
    profile: 'Growth-oriented',
    headline: 'High Long-Term Wealth Compounding',
    badgeLabel: 'Growth-Oriented Profile',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    explanation:
      'Your assessment indicates a high comfort level with equity volatility and market fluctuations to maximize long-term wealth creation. This growth allocation commits 60% to equity, while retaining 40% across debt, gold, real estate, and emergency reserves to preserve baseline security.',
    allocations: [
      {
        name: 'Equity',
        categoryKey: 'equity',
        percentage: 60,
        color: '#2563eb', // blue-600
        bgColor: 'bg-blue-600',
        simpleRole: 'Core compounding and capital expansion',
        simpleExplanation: 'Maximizes long-term returns by participating strongly in Indian corporate growth and market expansion.',
        indianInstruments: 'Broad Market Index Funds (Nifty 50, BSE Sensex), Mid-cap Mutual Funds, Equity ETFs',
        limitations: 'Experiences severe short-term swings (15–30% drops during market corrections) requiring high emotional discipline.'
      },
      {
        name: 'Debt / Fixed Income',
        categoryKey: 'debt',
        percentage: 15,
        color: '#059669', // emerald-600
        bgColor: 'bg-emerald-600',
        simpleRole: 'Defensive reserve and rebalancing source',
        simpleExplanation: 'Preserves a liquid defensive buffer that can be rebalanced into equity during steep market downturns.',
        indianInstruments: 'Short Duration Debt Funds, Bank FDs, Sovereign Treasury Bills',
        limitations: 'Yield is conservative compared to equity during economic expansions.'
      },
      {
        name: 'Gold',
        categoryKey: 'gold',
        percentage: 10,
        color: '#d97706', // amber-600
        bgColor: 'bg-amber-600',
        simpleRole: 'Inflation and currency defense',
        simpleExplanation: 'Maintains purchasing power during currency depreciation or macroeconomic instability.',
        indianInstruments: 'Gold ETFs, Sovereign Gold Bonds, Paper Gold',
        limitations: 'Can remain flat for multi-year periods when equity markets are booming.'
      },
      {
        name: 'Real Estate',
        categoryKey: 'realEstate',
        percentage: 10,
        color: '#7c3aed', // violet-600
        bgColor: 'bg-violet-600',
        simpleRole: 'Physical asset diversification',
        simpleExplanation: 'Provides long-term physical property exposure and potential inflation protection.',
        indianInstruments: 'REITs (Embassy, Mindspace, Brookfield), physical residential property',
        limitations: 'Low liquidity, high transaction expenses, and property market cyclicality.'
      },
      {
        name: 'Cash / Emergency Reserve',
        categoryKey: 'cash',
        percentage: 5,
        color: '#0284c7', // sky-600
        bgColor: 'bg-sky-600',
        simpleRole: 'Immediate liquidity buffer',
        simpleExplanation: 'Maintains 3 months of emergency expenses so you are never forced to sell investments at the wrong time.',
        indianInstruments: 'Instant access savings accounts, high-liquidity bank funds',
        limitations: 'Must be actively monitored to prevent holding excess unproductive cash.'
      }
    ]
  }
};

/**
 * Classifies an assessment result into one of the 3 broad illustrative profiles.
 */
export function classifyBehaviouralProfile(scores?: AssessmentResultsData | null): BehaviouralProfile {
  if (!scores) return 'Balanced';

  const lossAversionScore = scores.biasScores['Loss Aversion']?.scorePercentage ?? 50;
  const herdingScore = scores.biasScores['Herding Bias']?.scorePercentage ?? 50;
  const overconfidenceScore = scores.biasScores['Overconfidence Bias']?.scorePercentage ?? 50;

  if (lossAversionScore >= 67 || (lossAversionScore >= 50 && overconfidenceScore <= 33)) {
    return 'Cautious';
  }

  if (overconfidenceScore >= 67 && lossAversionScore <= 45 && herdingScore <= 55) {
    return 'Growth-oriented';
  }

  return 'Balanced';
}

interface BehaviourBasedAssetAllocationProps {
  scores?: AssessmentResultsData | null;
  className?: string;
  showComparisonTabs?: boolean;
}

export const BehaviourBasedAssetAllocation: React.FC<BehaviourBasedAssetAllocationProps> = ({
  scores,
  className = '',
  showComparisonTabs = true
}) => {
  const assessedProfile = classifyBehaviouralProfile(scores);
  const [activeProfile, setActiveProfile] = useState<BehaviouralProfile>(assessedProfile);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const profileConfig = BEHAVIOUR_ALLOCATIONS[activeProfile];

  // Verify that the percentages always total exactly 100%
  const totalPercentage = profileConfig.allocations.reduce((sum, item) => sum + item.percentage, 0);

  // Helper to generate SVG pie chart slice paths
  const renderPieChartSlices = () => {
    let cumulativePercent = 0;
    const cx = 110;
    const cy = 110;
    const r = 85;

    return profileConfig.allocations.map((alloc) => {
      const startPercent = cumulativePercent;
      const endPercent = cumulativePercent + alloc.percentage;
      cumulativePercent = endPercent;

      // Calculate slice start and end coordinates
      const startAngle = startPercent * 2 * Math.PI - Math.PI / 2;
      const endAngle = endPercent * 2 * Math.PI - Math.PI / 2;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const largeArcFlag = alloc.percentage > 50 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isHovered = hoveredSlice === alloc.name;

      return (
        <path
          key={alloc.categoryKey}
          d={pathData}
          fill={alloc.color}
          stroke="#ffffff"
          strokeWidth="2.5"
          className="transition-all duration-200 cursor-pointer"
          opacity={hoveredSlice && !isHovered ? 0.6 : 1}
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: isHovered ? 'scale(1.04)' : 'scale(1)'
          }}
          onMouseEnter={() => setHoveredSlice(alloc.name)}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <title>{`${alloc.name}: ${alloc.percentage}%`}</title>
        </path>
      );
    });
  };

  return (
    <section className={`bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-6 ${className}`}>
      
      {/* SECTION HEADER */}
      <div className="p-6 sm:p-7 border-b border-slate-200 space-y-3 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <PieChartIcon className="w-4 h-4 text-slate-700" />
            <span>BIAS FOLIO Framework</span>
            <span aria-hidden="true">·</span>
            <span>Behaviour-Based Asset Allocation</span>
          </div>

          {/* Mandatory Clear Educational Disclaimer Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Educational illustration — not financial advice</span>
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display tracking-tight">
            Behaviour-Based Asset Allocation Model
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Illustrative distribution across broad asset categories based on your behavioural assessment profile. All allocations total exactly 100%.
          </p>
        </div>

        {/* PROFILE COMPARISON TABS */}
        {showComparisonTabs && (
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Select Profile:</span>
            {(['Cautious', 'Balanced', 'Growth-oriented'] as BehaviouralProfile[]).map((p) => {
              const isSelected = activeProfile === p;
              const isAssessed = assessedProfile === p;

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActiveProfile(p)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{p} Profile</span>
                  {isAssessed && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      Assessed
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* MAIN ALLOCATION BODY */}
      <div className="p-6 sm:p-7 pt-0 space-y-6">
        
        {/* CRITICAL DISTINCTION CALLOUT: BEHAVIOURAL TENDENCIES VS FINANCIAL RISK CAPACITY */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1.5">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-blue-900 font-display">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Crucial Distinction: Behavioural Tendency vs. Financial Risk Capacity</span>
          </div>
          <p className="leading-relaxed text-blue-900">
            A person's behavioural questionnaire scores do <strong>NOT</strong> automatically determine their true financial risk capacity. While behavioural scores reveal how you emotionally react to market corrections or trending tips, your actual financial risk capacity depends objectively on real-world factors: your personal financial goals, monthly income stability, age, investment time horizon, liquidity needs, emergency savings buffer, and capacity to withstand financial loss.
          </p>
        </div>

        {/* PROFILE INTRO CARD */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${profileConfig.badgeClass}`}>
                {profileConfig.badgeLabel}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {profileConfig.headline}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Mathematical Verification:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Sum: {totalPercentage}%
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {profileConfig.explanation}
          </p>
        </div>

        {/* CHARTS CONTAINER: PIE + PROPORTIONAL BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white p-5 rounded-xl border border-slate-200">
          
          {/* SVG Pie Chart */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3">
            <div className="relative w-[220px] h-[220px]">
              <svg viewBox="0 0 220 220" className="w-full h-full transform -rotate-90">
                {renderPieChartSlices()}
                <circle cx="110" cy="110" r="45" fill="#ffffff" />
              </svg>
              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-display">
                  100%
                </span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400">
              Hover over or inspect each segment for category allocation
            </span>
          </div>

          {/* Allocation Breakdown Table */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Asset Category Split (Total: 100%)
            </div>

            <div className="space-y-2">
              {profileConfig.allocations.map((alloc) => (
                <div
                  key={alloc.categoryKey}
                  onMouseEnter={() => setHoveredSlice(alloc.name)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 text-xs ${
                    hoveredSlice === alloc.name
                      ? 'border-slate-400 bg-slate-50'
                      : 'border-slate-100 bg-white hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-md shrink-0"
                      style={{ backgroundColor: alloc.color }}
                    />
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block truncate">
                        {alloc.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {alloc.simpleRole}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                      {alloc.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Horizontal Bar Visualizer */}
            <div className="pt-2 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Proportional Visualizer</span>
                <span className="text-emerald-700 font-bold">100% Total Sum</span>
              </div>

              <div className="w-full h-7 rounded-lg overflow-hidden flex bg-slate-100 p-0.5 gap-0.5 shadow-2xs border border-slate-200">
                {profileConfig.allocations.map((alloc) => (
                  <div
                    key={alloc.categoryKey}
                    style={{ width: `${alloc.percentage}%` }}
                    className={`${alloc.bgColor} h-full transition-all duration-300 flex items-center justify-center text-white text-[11px] font-bold overflow-hidden cursor-default`}
                    title={`${alloc.name}: ${alloc.percentage}%`}
                  >
                    {alloc.percentage >= 10 ? `${alloc.percentage}%` : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED EDUCATIONAL ASSET CARDS: ROLES & LIMITATIONS */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Role &amp; Inherent Limitations of Each Broad Asset Class
            </h3>
            <span className="text-[11px] text-slate-500">
              Broad asset categories only · No individual stocks or funds recommended
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {profileConfig.allocations.map((alloc) => (
              <div
                key={alloc.categoryKey}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: alloc.color }}
                      />
                      <span className="font-bold text-slate-900 text-sm font-display">
                        {alloc.name}
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                      {alloc.percentage}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Primary Role:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {alloc.simpleExplanation}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Common Indian Instruments:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-mono text-[11px]">
                      {alloc.indianInstruments}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-[11px] text-amber-900 space-y-0.5">
                    <span className="font-bold block uppercase tracking-wider text-amber-950 text-[10px]">
                      Inherent Limitations:
                    </span>
                    <p className="leading-relaxed">
                      {alloc.limitations}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Broad Asset Category</span>
                  <span>Non-Specific</span>
                </div>
              </div>
            ))}

            {/* Exact 100% Verification Badge */}
            <div className="p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 flex flex-col justify-center items-center text-center space-y-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div className="text-sm font-bold text-emerald-950 font-display">
                Exact Total: 100%
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                The 5 broad categories always total exactly 100% across all illustrative profiles.
              </p>
            </div>
          </div>
        </div>

        {/* WHY REAL ALLOCATION DEPENDS ON PERSONAL FACTORS */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
            <Users className="w-4 h-4 text-slate-600 shrink-0" />
            <span>Personal Circumstances: What Actually Determines Asset Allocation</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            This illustrative allocation is based solely on behavioural questionnaire tendencies. Real-world financial planning requires evaluating practical financial variables:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                <span>Age &amp; Investment Horizon</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                A college student investing for 20+ years can comfortably tolerate market dips, whereas funds needed for tuition next year require complete fixed income safety.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-600" />
                <span>Income Stability &amp; Emergency Fund</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Having 3 to 6 months of household expenses in safe bank savings or liquid funds prevents premature liquidation of long-term equities during life emergencies.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-600" />
                <span>Loss-Bearing Ability &amp; Liabilities</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Outstanding EMIs, education loans, and family commitments govern true risk capacity regardless of how confident one's psychological mindset may feel.
              </p>
            </div>
          </div>
        </div>

        {/* MANDATORY DISCLAIMER BOX */}
        <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
          <div className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Educational Non-Advisory Disclaimer</span>
          </div>

          <p className="font-bold text-sm text-amber-950">
            “BIAS FOLIO is an educational behavioural-finance project. Its results and asset allocations are illustrative and are not personalised financial advice or a professional psychological diagnosis. Investment decisions require consideration of individual financial circumstances and risks.”
          </p>

          <ul className="list-disc pl-5 space-y-1 text-amber-900/90 text-[11px] pt-1">
            <li>
              <strong>No Individual Recommendations:</strong> BIAS FOLIO does NOT recommend any specific stock, mutual fund, ETF, company, property, or security.
            </li>
            <li>
              <strong>No Return Predictions:</strong> BIAS FOLIO does NOT predict market returns, future prices, interest rates, or real estate values.
            </li>
            <li>
              <strong>No Buy/Sell/Hold Instructions:</strong> This educational tool does NOT instruct users to buy, sell, or hold any financial instrument.
            </li>
            <li>
              <strong>Consult SEBI-Registered Professionals:</strong> Consult a SEBI-registered investment adviser (RIA) or certified financial planner before deploying capital.
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};
