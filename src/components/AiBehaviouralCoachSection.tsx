import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  ShieldAlert,
  RotateCcw,
  TrendingUp,
  Brain
} from 'lucide-react';
import {
  GeminiCoachRequest,
  GeminiCoachResponse,
  fetchAiCoachAnalysis
} from '../services/geminiCoach';
import { AssessmentResultsData } from '../data/assessmentQuestions';
import { PortfolioInvestment, PortfolioSummary } from '../data/portfolio';

interface AiBehaviouralCoachSectionProps {
  biasScores: AssessmentResultsData | null;
  summary: PortfolioSummary;
  investments: PortfolioInvestment[];
}

export const AiBehaviouralCoachSection: React.FC<AiBehaviouralCoachSectionProps> = ({
  biasScores,
  summary,
  investments
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<GeminiCoachResponse | null>(null);

  const highestBias = biasScores
    ? [...biasScores.biasList].sort((a, b) => b.scorePercentage - a.scorePercentage)[0]
    : null;

  const handleGenerateCoachAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      // Assemble structured payload
      const biasScoresPayload: Record<
        string,
        { score: number; percentage: number; classification: string }
      > = {};

      if (biasScores) {
        biasScores.biasList.forEach((b) => {
          biasScoresPayload[b.category] = {
            score: b.userScore,
            percentage: b.scorePercentage,
            classification: b.classification
          };
        });
      }

      const requestPayload: GeminiCoachRequest = {
        biasScores: biasScoresPayload,
        strongestBias: highestBias
          ? {
              category: highestBias.category,
              percentage: highestBias.scorePercentage,
              classification: highestBias.classification
            }
          : null,
        observations: summary.observations.map((obs) => `${obs.title}: ${obs.message}`),
        concentrationInfo: {
          totalAmount: summary.totalAmount,
          investmentCount: summary.investmentCount,
          largestAsset: summary.largestInvestment?.name || 'None',
          largestPercentage: summary.largestInvestment?.percentage || 0
        },
        investmentReasons: investments.map((inv) => ({
          name: inv.name,
          type: inv.type,
          amount: inv.amount,
          reason: inv.reason || 'None provided'
        }))
      };

      const response = await fetchAiCoachAnalysis(requestPayload);
      setAnalysis(response);
    } catch (err: any) {
      console.error('AI Coach generation error:', err);
      setError(
        err?.message ||
          'Failed to connect to the AI Behavioural Coach. Please verify your Gemini API configuration and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-slate-300" />
            <span>B.Com Project Functionality 04 · AI Coaching</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Gemini AI Behavioural Coach
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Educational synthesis powered by Gemini, evaluating your 5 bias assessment scores, portfolio concentration, and stated investment rationales.
          </p>
        </div>

        <div className="shrink-0">
          {!analysis && !loading && (
            <button
              type="button"
              onClick={handleGenerateCoachAnalysis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Generate Coach Analysis</span>
            </button>
          )}

          {analysis && !loading && (
            <button
              type="button"
              onClick={handleGenerateCoachAnalysis}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Initial Prompt State (before generating) */}
        {!analysis && !loading && !error && (
          <div className="py-10 px-4 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Brain className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-display">
                Ready for AI Behavioural Reflection
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Click below to generate personalized behavioural coaching connecting your bias tendencies to your portfolio holdings.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateCoachAnalysis}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Behavioural Coach Analysis</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-12 px-4 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 font-display">
                AI Coach is Analyzing Your Behavioral Profile...
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Synthesizing your 5 cognitive bias scores, evaluating portfolio concentration, and framing educational suggestions.
              </p>
            </div>
            <div className="w-48 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
              <div className="w-1/2 h-full bg-slate-900 rounded-full animate-indeterminate" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <h4 className="text-xs sm:text-sm font-bold font-display text-rose-900">
                  AI Behavioural Coach Request Failed
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {error}
                </p>
                {error.includes('GEMINI_API_KEY') && (
                  <div className="p-3 bg-white/80 rounded border border-rose-100 text-[11px] text-rose-900 mt-2 space-y-1">
                    <span className="font-bold block">Configuration Notice:</span>
                    <p>
                      To enable the AI Behavioural Coach, configure the <code>GEMINI_API_KEY</code> environment variable in your project's Secrets panel.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleGenerateCoachAnalysis}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-white border border-rose-200 hover:bg-rose-100/50 rounded-md transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Successfully Generated Analysis */}
        {analysis && !loading && (
          <div className="space-y-6">
            <div className="text-xs text-slate-500 font-medium">
              Educational Behavioral Reflection · Cautious Indicative Assessment
            </div>

            {/* 1. Short Behavioural Summary */}
            <div className="p-5 sm:p-6 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <Brain className="w-4 h-4 text-slate-600" />
                <span>1. Short Behavioural Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {analysis.behaviouralSummary}
              </p>
            </div>

            {/* 2. Strongest Possible Bias */}
            <div className="p-5 sm:p-6 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-600" />
                <span>2. Strongest Possible Bias</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {analysis.strongestPossibleBias || analysis.strongestTendencyExplanation}
              </p>
            </div>

            {/* 3. How This Bias May Influence Investment Decisions */}
            <div className="p-5 sm:p-6 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-slate-600" />
                <span>3. How This Bias May Influence Investment Decisions</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {analysis.influenceOnDecisions}
              </p>
            </div>

            {/* 4. Three Educational Reflection Suggestions */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-slate-600" />
                <span>4. Three Educational Reflection Suggestions</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.educationalSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-white space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 font-display tabular-nums block">
                        Suggestion 0{idx + 1}
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

            {/* Mandatory AI Non-Advisory Notice */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>AI Behavioural Coach Guardrails:</span>
              </div>
              <p className="leading-relaxed">
                This AI-generated analysis is an educational exercise designed to foster self-reflection. It does not provide stock recommendations, price forecasts, psychological diagnoses, or personalized financial advice.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
