import React, { useState } from 'react';
import {
  BookOpen,
  TrendingUp,
  Shield,
  Layers,
  Flame,
  ArrowRightLeft,
  PiggyBank,
  Building2,
  CheckCircle2,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  keyTakeaway: string;
  explanation: string;
  indianContext: string;
  regulatorySource: string;
}

const TOPICS: Topic[] = [
  {
    id: 'risk-return',
    title: '1. Risk and Return',
    shortDesc: 'Higher expected returns always involve higher uncertainty and volatility.',
    icon: TrendingUp,
    keyTakeaway: 'There is no such thing as guaranteed high return with zero risk.',
    explanation:
      'In financial markets, expected return is compensation for bearing risk. Low-risk instruments (such as bank deposits or government securities) offer predictable returns but limited growth. High-growth assets (such as Indian equities) offer superior long-term compounding potential but experience regular price fluctuations and periodic capital drawdowns.',
    indianContext:
      'A retail investor in India earning 6.5%–7.0% on a Bank Fixed Deposit enjoys high safety, whereas allocating capital to Nifty 50 equities can deliver higher long-term compounding above inflation, but entails enduring short-term market corrections of 10%–25% along the way.',
    regulatorySource: 'SEBI Investor Awareness & RBI Financial Education Framework'
  },
  {
    id: 'diversification',
    title: '2. Diversification',
    shortDesc: 'Spreading investments across uncorrelated asset classes to reduce shocks.',
    icon: Layers,
    keyTakeaway: 'A single asset or company failure must never jeopardize your life savings.',
    explanation:
      'Diversification is the practice of allocating capital across diverse asset classes—such as Equities, Debt, Gold, and Cash Reserves—so that a downturn in one asset does not severely impair your overall portfolio. Different asset classes react differently to market cycles, smoothing out overall returns.',
    indianContext:
      'When equities on the NSE/BSE experience sharp corrections during global economic shocks, domestic Gold and Fixed Income/Debt holdings frequently remain steady or gain value, protecting overall household net worth.',
    regulatorySource: 'SEBI Guidelines on Mutual Fund Portfolio Asset Allocation'
  },
  {
    id: 'inflation',
    title: '3. Inflation & Purchasing Power',
    shortDesc: 'The steady erosion of what your money can buy over time.',
    icon: Flame,
    keyTakeaway: 'Leaving money in low-yield cash guarantees a hidden loss of purchasing power.',
    explanation:
      'Inflation measures the rate at which average prices for goods and services rise over time. If your savings grow at a rate lower than the inflation rate, your real wealth is shrinking, even if the nominal rupee balance in your bank account looks unchanged.',
    indianContext:
      'The Reserve Bank of India (RBI) targets a retail Consumer Price Index (CPI) inflation band around 4%–6%. If inflation averages 5.5% and a savings bank account yields 3.0%, your real purchasing power declines by approximately 2.5% each year.',
    regulatorySource: 'Reserve Bank of India (RBI) Monetary Policy & Inflation Framework'
  },
  {
    id: 'liquidity',
    title: '4. Liquidity',
    shortDesc: 'How quickly and safely an investment can be converted into spendable ₹.',
    icon: ArrowRightLeft,
    keyTakeaway: 'Never invest money you might need next month into illiquid assets.',
    explanation:
      'Liquidity refers to how easily an asset can be converted into cash without a substantial discount in its value. Maintaining adequate liquidity protects you from having to sell long-term assets at a loss during emergency situations.',
    indianContext:
      'In India, liquidity varies across instruments: Bank Savings Accounts and Liquid Mutual Funds offer instant access; listed equities on NSE/BSE settle in T+1 business days; Fixed Deposits may impose a premature penalty; while physical Real Estate can take months or years to liquidate.',
    regulatorySource: 'SEBI & AMFI Liquidity and Settlement Norms (T+1 Rolling Settlement)'
  },
  {
    id: 'saving-vs-investing',
    title: '5. Saving versus Investing',
    shortDesc: 'Preserving capital for emergencies vs. putting money to work for compounding.',
    icon: PiggyBank,
    keyTakeaway: 'Save for your safety net; invest for your future goals.',
    explanation:
      'Saving involves parking funds in safe, liquid accounts to protect principal for short-term needs and unexpected emergencies. Investing involves deploying capital into productive economic assets (equities, mutual funds, gold) to build wealth over 5, 10, or 20 years.',
    indianContext:
      'Financial planners in India recommend first building an Emergency Fund of 3 to 6 months of household expenses in a bank savings account or liquid fund, before committing surplus funds to monthly Systematic Investment Plans (SIPs) in mutual funds.',
    regulatorySource: 'AMFI (Association of Mutual Funds in India) Investor Guidance'
  },
  {
    id: 'exchanges-indices',
    title: '6. Purpose of NSE/BSE and Nifty 50/Sensex',
    shortDesc: 'Transparent trading platforms and benchmark barometers of the Indian economy.',
    icon: Building2,
    keyTakeaway: 'Indices provide objective yardsticks to measure investment performance.',
    explanation:
      'Stock exchanges (NSE and BSE) are regulated electronic platforms facilitating transparent buying and selling of securities. Market indices (Nifty 50 and Sensex) are curated baskets of leading companies that act as barometers measuring overall economic sentiment and market performance.',
    indianContext:
      'The National Stock Exchange (NSE) hosts the flagship Nifty 50 index (50 diversified blue-chips), while the Bombay Stock Exchange (BSE) hosts the historic 30-stock S&P BSE Sensex. Rather than trying to pick individual winning stocks, many retail investors use passive Nifty 50 index funds for cost-effective broad diversification.',
    regulatorySource: 'NSE India & BSE India Official Investor Awareness Portals'
  }
];

export const IndianInvestorBasics: React.FC = () => {
  const [expandedTopic, setExpandedTopic] = useState<string>('risk-return');

  return (
    <section id="investor-basics" className="py-16 md:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Block */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <BookOpen className="w-4 h-4 text-slate-700" />
            <span>Financial Literacy Module</span>
            <span aria-hidden="true">·</span>
            <span>Indian Financial Ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight text-balance">
            Indian Investor Basics
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Essential financial concepts explained in simple English for students and individual investors navigating Indian capital markets.
          </p>

          {/* Official Sources & Date Verification Label */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
              <Info className="w-3.5 h-3.5 text-slate-600" />
              <span>Reference: SEBI, RBI, AMFI &amp; NSE/BSE Frameworks</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
              <span>Updated: October 2026</span>
            </span>
            <span className="text-[11px] text-slate-400 italic">
              * General educational concepts compiled for student reference; not an official regulatory endorsement.
            </span>
          </div>
        </div>

        {/* Interactive Topic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Topic Selector List */}
          <div className="lg:col-span-5 space-y-2">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              const isSelected = expandedTopic === topic.id;

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setExpandedTopic(topic.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-white/10 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-sm block font-display truncate">
                        {topic.title}
                      </span>
                      <span
                        className={`text-xs block truncate ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {topic.shortDesc}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold shrink-0 ${
                      isSelected ? 'text-indigo-300' : 'text-slate-400'
                    }`}
                  >
                    {isSelected ? 'Viewing' : 'Read'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Topic Deep-Dive Card */}
          <div className="lg:col-span-7">
            {(() => {
              const current = TOPICS.find((t) => t.id === expandedTopic) || TOPICS[0];
              const Icon = current.icon;

              return (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                        Core Financial Concept
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                        {current.title}
                      </h3>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-slate-800 shrink-0">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                  </div>

                  {/* Golden Rule / Key Takeaway */}
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 font-display">
                      Golden Principle
                    </div>
                    <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                      "{current.keyTakeaway}"
                    </p>
                  </div>

                  {/* Core Explanation */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
                      Financial Foundation:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {current.explanation}
                    </p>
                  </div>

                  {/* Realistic Indian Market Example */}
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 font-display">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Realistic Indian Retail Scenario:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {current.indianContext}
                    </p>
                  </div>

                  {/* Official Reference Attribution */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span>Educational Source: {current.regulatorySource}</span>
                    <span className="italic">Standard B.Com &amp; retail syllabus</span>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>

      </div>
    </section>
  );
};
