import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  RotateCcw,
  Briefcase,
  ShieldAlert,
  Info,
  Flame,
  Lightbulb,
  AlertTriangle,
  Scale,
  Users,
  Zap,
  SearchCheck,
  Anchor,
  BookOpen,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { AssessmentResultsData, BiasCategory } from '../data/assessmentQuestions';
import { PortfolioInvestment, analyzePortfolio } from '../data/portfolio';
import { AiBehaviouralCoachSection } from './AiBehaviouralCoachSection';
import { formatINR } from '../utils/currency';
import { SaveToSheetsModal } from './SaveToSheetsModal';
import { BiasBarChart } from './BiasBarChart';
import { PortfolioAllocationChart } from './PortfolioAllocationChart';
import { BehaviourBasedAssetAllocation } from './BehaviourBasedAssetAllocation';

interface BehaviourAnalysisViewProps {
  biasScores: AssessmentResultsData | null;
  investments: PortfolioInvestment[];
  onBackToPortfolio: () => void;
  onRetakeAssessment: () => void;
  onHome: () => void;
}

export const BehaviourAnalysisView: React.FC<BehaviourAnalysisViewProps> = ({
  biasScores,
  investments,
  onBackToPortfolio,
  onRetakeAssessment,
  onHome
}) => {
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const summary = analyzePortfolio(investments, biasScores);

  const highestBias = biasScores
    ? [...biasScores.biasList].sort((a, b) => b.scorePercentage - a.scorePercentage)[0]
    : null;

  const handlePrint = () => {
    window.print();
  };

  const getBiasIcon = (category: BiasCategory) => {
    switch (category) {
      case 'Loss Aversion':
        return Scale;
      case 'Herding Bias':
        return Users;
      case 'Overconfidence Bias':
        return Zap;
      case 'Confirmation Bias':
        return SearchCheck;
      case 'Anchoring Bias':
        return Anchor;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header (hidden during print) */}
      <header className="no-print sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            <span className="font-bold text-slate-900 font-display text-base tracking-tight">
              BIAS FOLIO
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
              / Investor Behaviour Report (Indian Market)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {biasScores && (
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-2xs"
                title="Save Results to Google Sheets"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Save My Results</span>
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Print or Save Report as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save Report</span>
            </button>
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </button>
            <button
              type="button"
              onClick={onHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* PRINT ONLY FORMAL ACADEMIC REPORT HEADER */}
        <div className="print-only border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-900">
                BIAS FOLIO — Indian Investor Behaviour Report
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Department of Commerce · Indian Capital Markets &amp; Behavioural Finance Coursework
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              <p className="font-semibold text-slate-800">Currency: Indian Rupee (INR / ₹)</p>
            </div>
          </div>
        </div>

        {/* Banner: Educational Behavioral Assessment */}
        <div className="no-print p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 text-slate-600 shrink-0" />
            <span>
              <strong>Indian Market Synthesis:</strong> Connecting psychological bias assessments with your Indian portfolio allocation (in ₹).
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium shrink-0">
            Department of Commerce · Academic Project
          </div>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                B.Com Project Functionality 05 · Comprehensive Synthesis
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                Investor Behaviour Report
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Synthesized analysis connecting your calculated behavioural tendencies on Dalal Street with your entered portfolio allocation, concentration, and rationales.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-right shrink-0 w-full sm:w-auto">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                Portfolio Assets
              </span>
              <span className="text-xl font-bold text-slate-900 font-display tabular-nums">
                {summary.investmentCount} holdings
              </span>
              <span className="text-xs text-slate-500 block mt-0.5 tabular-nums">
                Total: {formatINR(summary.totalAmount)}
              </span>
            </div>
          </div>

          {/* TWO-COLUMN SYNTHESIS: BIAS PROFILE vs PORTFOLIO REALITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Box: Your Primary Behavioral Tendency */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-900 text-white space-y-3 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>Assessment Profile</span>
                {highestBias && (
                  <span className="bg-white/10 px-2 py-0.5 rounded text-white tabular-nums">
                    {highestBias.scorePercentage}% Score ({highestBias.classification})
                  </span>
                )}
              </div>

              {highestBias ? (
                <>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-slate-200">
                      <Flame className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-display text-white">
                        {highestBias.category}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Dominant cognitive tendency
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    {highestBias.metadata.whatItMeansSummary}
                  </p>
                </>
              ) : (
                <div className="py-4 text-xs text-slate-300">
                  You have not completed the 15-question Investor Behaviour Assessment yet. Your portfolio observations below are evaluated on general behavioural finance principles.
                </div>
              )}
            </div>

            {/* Right Box: Portfolio Allocation Structure */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600 font-semibold uppercase tracking-wider">
                <span>Portfolio Structure</span>
                <span className="text-slate-900 tabular-nums font-semibold">
                  {summary.largestInvestment ? `${summary.largestInvestment.percentage}% Top Holding` : '0%'}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900">
                    {summary.largestInvestment ? summary.largestInvestment.name : 'No Assets Entered'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dominant holding ({summary.largestInvestment?.type || 'N/A'})
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {summary.largestInvestment && summary.largestInvestment.percentage >= 40
                  ? `Your portfolio shows significant concentration in ${summary.largestInvestment.name} (${summary.largestInvestment.percentage}% of capital). In behavioural finance, concentrated positions in Indian equities often correlate with Overconfidence Bias or social herding.`
                  : summary.investmentCount > 0
                  ? 'Your portfolio exhibits moderate distribution across Indian holdings, keeping single-asset concentration under 45%.'
                  : 'Add your investments to inspect allocation concentration.'}
              </p>
            </div>

          </div>
        </div>

        {/* SECTION: 5 BEHAVIOURAL BIAS SCORES OVERVIEW */}
        {biasScores && (
          <BiasBarChart scores={biasScores} />
        )}

        {/* SECTION: PORTFOLIO ALLOCATION VISUAL CHART */}
        <PortfolioAllocationChart
          investments={investments}
          onOpenPortfolio={onBackToPortfolio}
        />

        {/* SECTION: BEHAVIOUR-BASED ASSET ALLOCATION */}
        <BehaviourBasedAssetAllocation scores={biasScores} />

        {biasScores && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                  Behavioural Bias Diagnostic Scores
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  15-question assessment calibrated across 5 capital market heuristics
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 tabular-nums">
                Overall: {biasScores.overallPercentage}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {biasScores.biasList.map((bias) => {
                const IconComponent = getBiasIcon(bias.category);
                let badgeClass = 'bg-slate-100 text-slate-700';
                if (bias.classification === 'High') {
                  badgeClass = 'bg-rose-100 text-rose-800 border border-rose-200';
                } else if (bias.classification === 'Moderate') {
                  badgeClass = 'bg-amber-100 text-amber-800 border border-amber-200';
                } else {
                  badgeClass = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
                }

                return (
                  <div
                    key={bias.category}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent className="w-4 h-4 text-slate-700" />
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${badgeClass}`}>
                        {bias.classification}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 font-display truncate">
                        {bias.category}
                      </h4>
                      <div className="text-lg font-extrabold text-slate-900 font-display tabular-nums mt-0.5">
                        {bias.scorePercentage}%
                      </div>
                      <span className="text-[10px] text-slate-400 block tabular-nums">
                        {bias.userScore} of 9 points
                      </span>
                    </div>
                    {/* Linear bar */}
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          bias.classification === 'High'
                            ? 'bg-rose-500'
                            : bias.classification === 'Moderate'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bias.scorePercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION: PORTFOLIO ALLOCATION TABLE (IN ₹ AND %) */}
        {investments.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                  Portfolio Allocation Breakdown (in ₹)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Holdings, capital weights, and investor rationale evaluated in Indian Rupees
                </p>
              </div>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                Total Capital: {formatINR(summary.totalAmount)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2.5 px-3 font-semibold">Investment Name</th>
                    <th className="py-2.5 px-3 font-semibold">Asset Category</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Amount (₹)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Allocation (%)</th>
                    <th className="py-2.5 px-3 font-semibold">Stated Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {summary.allocations.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-display">
                        {inv.name}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          {inv.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 text-right tabular-nums">
                        {formatINR(inv.amount)}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 text-right tabular-nums">
                        {inv.percentage}%
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 italic max-w-xs truncate">
                        {inv.reason || 'None specified'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Asset Class Distribution Pills */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Asset Class Weights:</span>
              {Object.entries(summary.typeAllocation)
                .filter(([_, data]) => data.amount > 0)
                .map(([type, data]) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-medium"
                  >
                    <span>{type}:</span>
                    <strong className="text-slate-900 tabular-nums">{data.percentage}%</strong>
                    <span className="text-slate-400 tabular-nums">({formatINR(data.amount)})</span>
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* SYNTHESIS OBSERVATIONS LIST */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                Behavioural &amp; Allocation Observations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Key patterns identified between your stated rationale and Indian market portfolio weights
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 tabular-nums">
              {summary.observations.length} Findings
            </span>
          </div>

          <div className="space-y-3">
            {summary.observations.map((obs) => {
              const isAlert = obs.severity === 'alert';
              const isWarning = obs.severity === 'warning';

              return (
                <div
                  key={obs.id}
                  className={`p-4 rounded-lg border text-xs space-y-1.5 ${
                    isAlert
                      ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                      : isWarning
                      ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    {isAlert && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                    {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    {!isAlert && !isWarning && <Lightbulb className="w-3.5 h-3.5 text-slate-700 shrink-0" />}
                    <span>{obs.title}</span>
                  </div>

                  <p className="text-slate-600 leading-relaxed">
                    {obs.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Educational Debriefing Questions */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-slate-700" />
              <span>Questions for Personal Academic Reflection (Indian Markets)</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside leading-relaxed">
              <li>
                <strong>On Single-Stock Concentration:</strong> If your largest holding ({summary.largestInvestment?.name || 'top asset'}) experienced a 20% correction on the NSE/BSE, how would it affect your overall portfolio and emotional readiness?
              </li>
              <li>
                <strong>On Social Herding:</strong> Did you initiate any positions because of momentum on social media, Telegram tips, or friend recommendations? How would you evaluate those businesses using formal annual reports or ROCE?
              </li>
              <li>
                <strong>On Price Anchoring:</strong> Are you currently holding onto any declining Indian share solely hoping it returns to your original buy price before exiting?
              </li>
            </ul>
          </div>
        </div>

        {/* GEMINI-POWERED AI BEHAVIOURAL COACH SECTION */}
        <AiBehaviouralCoachSection
          biasScores={biasScores}
          summary={summary}
          investments={investments}
        />

        {/* Mandatory Project Disclaimer (Exact Prompt Wording) */}
        <div className="p-4 sm:p-5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
            <h4 className="font-bold uppercase tracking-wider text-amber-950 font-display">
              Educational Non-Advisory Disclaimer
            </h4>
            <p className="font-medium">
              "BIAS FOLIO is an educational behavioural-finance project designed around the Indian financial market. It does not provide investment, trading, tax, or financial advice. The behavioural results are indicative and are not a professional psychological diagnosis."
            </p>
            <p className="text-[11px] text-amber-800/90">
              BIAS FOLIO does not predict stock prices, does not give buy/sell recommendations for Indian equities or mutual funds, and does not provide financial advice.
            </p>
          </div>
        </div>

        {/* Action Controls (hidden during print) */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {biasScores && (
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Save My Results</span>
              </button>
            )}
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Modify Portfolio</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-300"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Report</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onRetakeAssessment}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
            <button
              type="button"
              onClick={onHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="no-print py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        BIAS FOLIO · Indian Investor Psychology &amp; Portfolio Diagnostic Tool · Educational B.Com Project
      </footer>

      {/* Google Sheets Integration Modal */}
      {biasScores && (
        <SaveToSheetsModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          scores={biasScores}
          investments={investments}
        />
      )}
    </div>
  );
};
