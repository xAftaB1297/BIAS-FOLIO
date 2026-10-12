import React, { useState } from 'react';
import {
  FileText,
  Printer,
  FileSpreadsheet,
  Home,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Brain,
  Lightbulb,
  CheckCircle,
  Briefcase,
  AlertTriangle,
  Scale,
  Users,
  Zap,
  Search,
  Anchor,
  Flame,
  TrendingUp,
  Info
} from 'lucide-react';
import {
  AssessmentResultsData,
  BiasCategory,
  BiasClassification,
  BIAS_METADATA
} from '../data/assessmentQuestions';
import { PortfolioInvestment, analyzePortfolio } from '../data/portfolio';
import { GeminiCoachResponse } from '../services/geminiCoach';
import { formatINR } from '../utils/currency';
import { BiasBarChart } from './BiasBarChart';
import { PortfolioAllocationChart } from './PortfolioAllocationChart';
import { WorkflowStepper, WorkflowStep } from './WorkflowStepper';
import { SaveToSheetsModal } from './SaveToSheetsModal';
import { BehaviourBasedAssetAllocation } from './BehaviourBasedAssetAllocation';

interface FinalReportViewProps {
  biasScores: AssessmentResultsData;
  investments: PortfolioInvestment[];
  aiAnalysis: GeminiCoachResponse | null;
  onRetakeAssessment: () => void;
  onBackToCoach: () => void;
  onHome: () => void;
  onNavigateStep: (step: WorkflowStep) => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  biasScores,
  investments,
  aiAnalysis,
  onRetakeAssessment,
  onBackToCoach,
  onHome,
  onNavigateStep
}) => {
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  const summary = analyzePortfolio(investments, biasScores);
  const sortedBiases = [...biasScores.biasList].sort((a, b) => b.scorePercentage - a.scorePercentage);
  const highestBias = sortedBiases[0];

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
        return Search;
      case 'Anchoring Bias':
        return Anchor;
    }
  };

  const getClassificationBadge = (classification: BiasClassification) => {
    switch (classification) {
      case 'High':
        return {
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
          label: 'High Tendency'
        };
      case 'Moderate':
        return {
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'Moderate Tendency'
        };
      case 'Low':
      default:
        return {
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Low Tendency'
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Workflow Stepper Navigation */}
      <WorkflowStepper
        currentStep="report"
        onNavigateStep={onNavigateStep}
        hasAssessment={true}
        hasPortfolio={investments.length > 0}
        hasCoachAnalysis={!!aiAnalysis}
      />

      {/* Top Header Bar */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-12 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onBackToCoach}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to AI Coach</span>
              <span className="inline sm:hidden">Coach</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-display truncate">
              <FileText className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span className="truncate">Final Investor Behaviour Report</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Report</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Save My Results</span>
            </button>

            <button
              type="button"
              onClick={onHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Report Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        
        {/* FORMAL REPORT HEADER (Visible on screen and during print) */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Department of Commerce · Student Behavioural Finance Project
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
                BIAS FOLIO — Final Investor Behaviour Report
              </h1>
              <p className="text-xs text-slate-600 max-w-2xl">
                Comprehensive empirical synthesis combining 5 cognitive bias scores, actual Indian portfolio allocations, portfolio observations, and Gemini AI educational reflection.
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5 shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-0 border-slate-200">
              <p>Generated: <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('en-IN')} {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span></p>
              <p>Primary Index: <span className="font-semibold text-slate-800">NSE / BSE Benchmark</span></p>
              <p>Currency: <span className="font-semibold text-slate-800">Indian Rupee (₹ / INR)</span></p>
            </div>
          </div>
        </div>

        {/* 1. HIGHEST BEHAVIOURAL TENDENCY SUMMARY CARD */}
        <section className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 space-y-4 shadow-sm border border-slate-800">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Highest Calculated Behavioural Tendency</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Calculated Score:</span>
              <span className="text-base font-bold text-white tabular-nums">
                {highestBias.scorePercentage}%
              </span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-[11px] font-semibold text-amber-300 border border-white/10">
                {highestBias.classification} Tendency
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              {highestBias.category}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {highestBias.metadata.whatItMeansSummary}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <span>Academic Origin: {highestBias.metadata.academicOrigin}</span>
            <span className="italic">Overall Profile Average: {biasScores.overallPercentage}%</span>
          </div>
        </section>

        {/* 2. FIVE BIAS SCORES & CLASSIFICATIONS */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                1. Five Behavioural Bias Scores &amp; Classifications
              </h2>
              <p className="text-xs text-slate-500">
                Calculated from the 15-question investor behaviour assessment (educational profile)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Low (0–33%)</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate (34–66%)</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-600"></span> High (67–100%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {biasScores.biasList.map((bias) => {
              const Icon = getBiasIcon(bias.category);
              const badge = getClassificationBadge(bias.classification);

              return (
                <div
                  key={bias.category}
                  className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.badgeClass}`}>
                        {bias.classification}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-900 font-display truncate">
                        {bias.category}
                      </h3>
                      <div className="text-xl font-extrabold text-slate-900 tabular-nums mt-1">
                        {bias.scorePercentage}%
                      </div>
                      <span className="text-[11px] text-slate-400 block tabular-nums">
                        {bias.userScore} of {bias.maxScore} points
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        bias.classification === 'High'
                          ? 'bg-rose-600'
                          : bias.classification === 'Moderate'
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${bias.scorePercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. VISUAL CHARTS SECTION (BAR CHART + PORTFOLIO ALLOCATION CHART) */}
        <section className="space-y-6">
          <div className="pb-2 border-b border-slate-200">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              2. Visual Analytical Charts
            </h2>
            <p className="text-xs text-slate-500">
              Clear graphical representations of your 5 bias scores and actual portfolio allocations
            </p>
          </div>

          {/* Chart 1: Five Behavioural Biases Bar Chart (0-100% Y-axis) */}
          <BiasBarChart scores={biasScores} />

          {/* Chart 2: Portfolio Allocation Chart */}
          <PortfolioAllocationChart
            investments={investments}
            onOpenPortfolio={onBackToCoach}
          />
        </section>

        {/* 4. PORTFOLIO SUMMARY & ASSET ALLOCATION */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                3. Portfolio Diagnostic Summary
              </h2>
              <p className="text-xs text-slate-500">
                Asset holdings, capital distribution, and stated investment rationales
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold">Total Capital:</span>
              <span className="text-base font-extrabold text-slate-900 tabular-nums">
                {formatINR(summary.totalAmount)}
              </span>
            </div>
          </div>

          {investments.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                      <th className="py-2.5 px-3 font-semibold">Holding Name</th>
                      <th className="py-2.5 px-3 font-semibold">Category</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Amount (₹)</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Allocation (%)</th>
                      <th className="py-2.5 px-3 font-semibold">Stated Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {summary.allocations.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900 font-display">
                          {inv.name}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
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

              {/* Asset Category Distribution */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-700">Category Split:</span>
                {Object.entries(summary.typeAllocation)
                  .filter(([_, d]) => d.amount > 0)
                  .map(([type, d]) => (
                    <span
                      key={type}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium"
                    >
                      {type}: <strong>{d.percentage}%</strong> ({formatINR(d.amount)})
                    </span>
                  ))}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-500 italic">
              No portfolio holdings entered yet. Results evaluated against general Indian market behavioral principles.
            </div>
          )}
        </section>

        {/* 5. PORTFOLIO OBSERVATIONS */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                4. Portfolio Diagnostic Observations
              </h2>
              <p className="text-xs text-slate-500">
                Heuristic patterns and risk concentration flags identified in portfolio structure
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
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
                  className={`p-3.5 rounded-lg border text-xs space-y-1 ${
                    isAlert
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : isWarning
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {isAlert && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                    {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    {!isAlert && !isWarning && <Lightbulb className="w-3.5 h-3.5 text-slate-700 shrink-0" />}
                    <span>{obs.title}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed pl-5">
                    {obs.message}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. BEHAVIOUR-BASED ASSET ALLOCATION (BROAD ASSET CLASSES ONLY) */}
        <section>
          <BehaviourBasedAssetAllocation scores={biasScores} />
        </section>

        {/* 6. GEMINI EDUCATIONAL SUMMARY & THREE SUGGESTIONS */}
        {aiAnalysis ? (
          <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <Brain className="w-4 h-4 text-slate-700" />
                  <span>6. Gemini Educational Summary &amp; Suggestions</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                  AI Behavioural Coach Reflection
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Powered by Gemini
              </span>
            </div>

            {/* Behavioural Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display block">
                Behavioural Profile Synthesis:
              </span>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {aiAnalysis.behaviouralSummary}
              </p>
            </div>

            {/* Strongest Bias & Influence on Investment Decisions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Strongest Possible Bias:</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {aiAnalysis.strongestPossibleBias || aiAnalysis.strongestTendencyExplanation}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
                  <span>Influence on Market Decisions:</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {aiAnalysis.influenceOnDecisions}
                </p>
              </div>
            </div>

            {/* 7. Three Educational Reflection Suggestions */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-slate-700" />
                <span>Three Educational Reflection Suggestions:</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {aiAnalysis.educationalSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-400 font-display tabular-nums block">
                        Suggestion 0{idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {suggestion}
                      </p>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Disciplined Practice</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-xl border border-slate-200 p-6 text-center space-y-2">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Gemini Behavioural Coach Reflection Not Generated
            </h3>
            <p className="text-xs text-slate-500">
              Return to the AI Coach step to generate your personalized educational reflection.
            </p>
          </section>
        )}

        {/* 8. MANDATORY DISCLAIMER */}
        <section className="p-5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
            <h4 className="font-bold uppercase tracking-wider text-amber-950 font-display">
              Educational Non-Advisory Disclaimer
            </h4>
            <p className="font-semibold text-xs sm:text-sm text-amber-950">
              “BIAS FOLIO is an educational behavioural-finance project. Its results and asset allocations are illustrative and are not personalised financial advice or a professional psychological diagnosis. Investment decisions require consideration of individual financial circumstances and risks.”
            </p>
            <p className="text-[11px] text-amber-800/90 font-medium">
              Because this assessment contains 15 questions, the result is an educational indication, not a scientifically validated psychological assessment.
            </p>
            <p className="text-[11px] text-amber-800/90">
              BIAS FOLIO does NOT recommend specific Indian stocks, mutual funds, or securities, does NOT tell users to buy, sell, or hold, does NOT predict Sensex/Nifty price movements or returns, and does NOT claim clinical psychological authority.
            </p>
          </div>
        </section>

        {/* BOTTOM ACTION TOOLBAR */}
        <div className="no-print bg-white rounded-xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onRetakeAssessment}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Assessment</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Save My Results</span>
            </button>

            <button
              type="button"
              onClick={onHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Home className="w-4 h-4" />
              <span>Finish &amp; Home</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        BIAS FOLIO · Indian Investor Psychology &amp; Portfolio Diagnostic Tool · Educational B.Com Project
      </footer>

      {/* Save to Google Sheets Modal */}
      {showSaveModal && (
        <SaveToSheetsModal
          scores={biasScores}
          investments={investments}
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
};
