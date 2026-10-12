import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Brain,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  FileSpreadsheet,
  Home,
  RotateCcw,
  Flame,
  Briefcase
} from 'lucide-react';
import { AssessmentResultsData } from '../data/assessmentQuestions';
import { PortfolioInvestment, analyzePortfolio } from '../data/portfolio';
import { GeminiCoachResponse } from '../services/geminiCoach';
import { formatINR } from '../utils/currency';
import { WorkflowStepper, WorkflowStep } from './WorkflowStepper';
import { SaveToSheetsModal } from './SaveToSheetsModal';

interface GeminiCoachViewProps {
  biasScores: AssessmentResultsData;
  investments: PortfolioInvestment[];
  aiAnalysis: GeminiCoachResponse | null;
  loading: boolean;
  error: string | null;
  onRetryAnalysis: () => void;
  onGenerateReport: () => void;
  onBackToPortfolio: () => void;
  onHome: () => void;
  onNavigateStep: (step: WorkflowStep) => void;
}

export const GeminiCoachView: React.FC<GeminiCoachViewProps> = ({
  biasScores,
  investments,
  aiAnalysis,
  loading,
  error,
  onRetryAnalysis,
  onGenerateReport,
  onBackToPortfolio,
  onHome,
  onNavigateStep
}) => {
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  const summary = analyzePortfolio(investments, biasScores);
  const sortedBiases = [...biasScores.biasList].sort((a, b) => b.scorePercentage - a.scorePercentage);
  const highestBias = sortedBiases[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Workflow Stepper Navigation */}
      <WorkflowStepper
        currentStep="coach"
        onNavigateStep={onNavigateStep}
        hasAssessment={true}
        hasPortfolio={investments.length > 0}
        hasCoachAnalysis={!!aiAnalysis}
      />

      {/* Header Bar */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-12 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-display">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gemini Behavioural Coach</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Save My Results</span>
            </button>
            <button
              type="button"
              onClick={onHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
        {/* Academic Context Notice */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>B.Com Project Functionality 04 · AI Coaching</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
              Gemini AI Behavioural Coach
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Synthesizing your 5 calculated bias assessment scores with your Indian portfolio holdings and stated rationales.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
            {aiAnalysis && !loading && (
              <button
                type="button"
                onClick={onGenerateReport}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 active:scale-95 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                <span>Generate Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Input Data Summary Cards (Zero re-entry required!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dominant Bias Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>Assessment Profile</span>
              <span className="text-slate-900 font-bold tabular-nums">
                {highestBias.scorePercentage}% ({highestBias.classification})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 font-display truncate">
                  {highestBias.category}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  Dominant behavioural tendency
                </p>
              </div>
            </div>
          </div>

          {/* Portfolio Summary Card */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
              <span>Portfolio Diagnostic</span>
              <span className="text-slate-900 font-bold tabular-nums">
                {formatINR(summary.totalAmount)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                <Briefcase className="w-4 h-4 text-slate-700" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 font-display truncate">
                  {summary.investmentCount > 0
                    ? `${summary.investmentCount} Holdings (${summary.largestInvestment ? summary.largestInvestment.name : 'entered'})`
                    : 'Portfolio Diagnostic Review'}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {summary.largestInvestment
                    ? `Top holding: ${summary.largestInvestment.percentage}% concentration`
                    : 'Evaluated against Indian capital market principles'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                AI Behavioural Coach is Analyzing Your Profile...
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Securely evaluating your 5 bias assessment scores, portfolio concentration, and investment rationales.
              </p>
            </div>
            <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="w-1/2 h-full bg-slate-900 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-xl border border-rose-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-3 text-rose-900">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-display">
                  Unable to Complete AI Coach Analysis
                </h4>
                <p className="text-xs text-rose-700 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onRetryAnalysis}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Analysis</span>
              </button>
              <button
                type="button"
                onClick={onGenerateReport}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <span>Skip to Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* AI Educational Response */}
        {aiAnalysis && !loading && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Brain className="w-4 h-4 text-slate-700" />
                <span>Educational Behavioral Reflection</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Cautious Non-Diagnostic Assessment
              </span>
            </div>

            {/* 1. Short Behavioural Summary */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <Brain className="w-4 h-4 text-slate-700" />
                <span>1. Short Behavioural Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {aiAnalysis.behaviouralSummary}
              </p>
            </div>

            {/* 2. Strongest Possible Bias */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>2. Strongest Possible Bias</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {aiAnalysis.strongestPossibleBias || aiAnalysis.strongestTendencyExplanation}
              </p>
            </div>

            {/* 3. How This Bias May Influence Investment Decisions */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-700" />
                <span>3. How This Bias May Influence Investment Decisions</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {aiAnalysis.influenceOnDecisions}
              </p>
            </div>

            {/* 4. Three Educational Reflection Suggestions */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-slate-700" />
                <span>4. Three Educational Reflection Suggestions</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiAnalysis.educationalSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-400 font-display tabular-nums block">
                        Reflection Suggestion 0{idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {suggestion}
                      </p>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium pt-2 border-t border-slate-100 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Disciplined Practice</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strict Non-Advisory Guardrails Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Educational Guardrails:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                This AI-generated analysis is an educational exercise designed to foster self-reflection. It does not provide stock recommendations, price forecasts, psychological diagnoses, or personalized financial advice.
              </p>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION BAR: SAVE MY RESULTS & GENERATE REPORT */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </button>

            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Save My Results</span>
            </button>
          </div>

          <div className="w-full sm:w-auto">
            <button
              type="button"
              onClick={onGenerateReport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <span>Generate Report</span>
              <ArrowRight className="w-4 h-4" />
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
