import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Home,
  RotateCcw,
  Scale,
  Users,
  Zap,
  SearchCheck,
  Anchor,
  ShieldAlert,
  Info,
  Flame,
  Briefcase,
  BookOpen,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import {
  ASSESSMENT_QUESTIONS,
  AssessmentResultsData,
  BiasCategory,
  BiasScoreResult
} from '../data/assessmentQuestions';
import { PortfolioInvestment } from '../data/portfolio';
import { SaveToSheetsModal } from './SaveToSheetsModal';
import { BiasBarChart } from './BiasBarChart';
import { PortfolioAllocationChart } from './PortfolioAllocationChart';
import { WorkflowStepper, WorkflowStep } from './WorkflowStepper';
import { BehaviourBasedAssetAllocation } from './BehaviourBasedAssetAllocation';

interface AssessmentResultsViewProps {
  scores: AssessmentResultsData;
  answers: Record<number, number>;
  investments?: PortfolioInvestment[];
  onRetake: () => void;
  onHome: () => void;
  onContinueToPortfolio: () => void;
  onConsultAiCoach?: () => void;
  onNavigateStep?: (step: WorkflowStep) => void;
}

export const AssessmentResultsView: React.FC<AssessmentResultsViewProps> = ({
  scores,
  answers,
  investments = [],
  onRetake,
  onHome,
  onContinueToPortfolio,
  onConsultAiCoach,
  onNavigateStep
}) => {
  const [showQuestionReview, setShowQuestionReview] = useState(false);
  const [selectedBiasFilter, setSelectedBiasFilter] = useState<string>('all');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  // Identify Highest Behavioural Tendency (highest percentage score)
  const sortedBiases = [...scores.biasList].sort((a, b) => b.scorePercentage - a.scorePercentage);
  const highestBias: BiasScoreResult = sortedBiases[0];

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

  const getClassificationBadge = (classification: 'Low' | 'Moderate' | 'High') => {
    switch (classification) {
      case 'Low':
        return {
          label: 'Low',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          barClass: 'bg-emerald-600',
          rangeText: '0–33'
        };
      case 'Moderate':
        return {
          label: 'Moderate',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          barClass: 'bg-amber-500',
          rangeText: '34–66'
        };
      case 'High':
        return {
          label: 'High',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          barClass: 'bg-rose-600',
          rangeText: '67–100'
        };
    }
  };

  const HighestIcon = getBiasIcon(highestBias.category);
  const highestBadge = getClassificationBadge(highestBias.classification);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Workflow Stepper Navigation */}
      <WorkflowStepper
        currentStep="results"
        onNavigateStep={onNavigateStep}
        hasAssessment={true}
        hasPortfolio={investments.length > 0}
        hasCoachAnalysis={false}
      />

      {/* Top Header - Strict 3-zone contract (hidden during print) */}
      <header className="no-print sticky top-12 z-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            <span className="font-bold text-slate-900 font-display text-base tracking-tight">
              BIAS FOLIO
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
              / Results Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-2xs"
              title="Save Results to Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Save My Results</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Print or Save Results as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Results</span>
            </button>
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Retake</span>
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

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* PRINT ONLY FORMAL ACADEMIC REPORT HEADER */}
        <div className="print-only border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-900">
                BIAS FOLIO — Behavioural Assessment Results Dashboard
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Department of Commerce · Student Behavioural Finance Project
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p className="font-semibold text-slate-800">5-Bias Diagnostic Profile</p>
            </div>
          </div>
        </div>

        {/* Academic Notice Banner */}
        <div className="no-print p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 text-slate-600 shrink-0" />
            <span>
              <strong>Quick Educational Indication:</strong> This 15-question assessment provides a rapid behavioural indication, not a scientifically validated psychological assessment.
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Department of Commerce · Student Coursework
          </div>
        </div>

        {/* Dashboard Title & Overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              B.Com Project Functionality 02 · Diagnostic Summary
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Behavioural Bias Dashboard
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Assessment results across the five foundational investor biases. Each score reflects your responses to simulated capital market dilemmas.
            </p>
          </div>

          {/* HIGHEST BEHAVIOURAL TENDENCY CARD */}
          <div className="p-6 sm:p-7 rounded-xl bg-slate-900 text-white space-y-4 shadow-sm border border-slate-800">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Highest Behavioural Tendency</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Calculated Score:</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {highestBias.scorePercentage} / 100
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${highestBadge.badgeClass}`}>
                  {highestBadge.label} ({highestBadge.rangeText})
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-1">
              <div className="w-11 h-11 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-slate-200">
                <HighestIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {highestBias.category}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {highestBias.metadata.whatItMeansSummary}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span>Origin: {highestBias.metadata.academicOrigin}</span>
              <span className="italic">Self-reflection: Notice how this tendency influences your decision timing.</span>
            </div>
          </div>
        </div>

        {/* VISUAL ANALYTICS CHARTS SECTION */}
        <section className="space-y-6">
          {/* 1. Bar Chart: All Five Behavioural Biases (Y-Axis: 0-100%) */}
          <BiasBarChart scores={scores} />

          {/* 2. Portfolio Allocation Chart: Actual User Portfolio Data */}
          <PortfolioAllocationChart
            investments={investments || []}
            onOpenPortfolio={onContinueToPortfolio}
          />
        </section>

        {/* 5 BIASES SECTION: HORIZONTAL CHARTS & SCORES OUT OF 100 */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Behavioural Biases Breakdown
              </h2>
              <p className="text-xs text-slate-500">Individual scores and behavioral explanations</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Low (0–33)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate (34–66)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> High (67–100)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {scores.biasList.map((bias) => {
              const Icon = getBiasIcon(bias.category);
              const badge = getClassificationBadge(bias.classification);

              return (
                <div
                  key={bias.category}
                  className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-colors"
                >
                  {/* Top Bar: Title, Icon, Score / 100, Classification */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 font-display">
                          {bias.category}
                        </h3>
                        <div className="text-xs text-slate-400">
                          {bias.metadata.academicOrigin}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Score</span>
                        <span className="text-base font-extrabold text-slate-900 tabular-nums">
                          {bias.scorePercentage} <span className="text-xs font-normal text-slate-400">/ 100</span>
                        </span>
                      </div>

                      <span className={`text-xs font-semibold px-2.5 py-1 rounded border ${badge.badgeClass}`}>
                        {bias.classification}
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Progress Bar Chart */}
                  <div className="space-y-1.5 pt-1">
                    <div className="relative w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${badge.barClass}`}
                        style={{ width: `${bias.scorePercentage}%` }}
                      />
                    </div>
                    {/* Scale markers: 0, 33, 66, 100 */}
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium px-0.5 tabular-nums">
                      <span>0</span>
                      <span className="text-center">33 (Low)</span>
                      <span className="text-center">66 (Moderate)</span>
                      <span>100 (High)</span>
                    </div>
                  </div>

                  {/* Short Plain-Language Explanation */}
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <span className="font-semibold text-slate-700 block">
                      Plain-Language Explanation:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {bias.metadata.plainLanguageExplanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FEATURE: BEHAVIOUR-BASED ASSET ALLOCATION */}
        <BehaviourBasedAssetAllocation scores={scores} />

        {/* PRIMARY ACTION CTA: Continue to Portfolio Check */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-600" />
              <span>Next Step in Workflow</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Continue to Portfolio Diagnostic
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Examine how your calculated behavioral profile—especially your tendency toward <strong>{highestBias.category}</strong>—compares with your real or simulated investments.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            {onConsultAiCoach && (
              <button
                type="button"
                onClick={onConsultAiCoach}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-lg transition-all border border-slate-300 cursor-pointer"
              >
                <span>AI Behavioural Coach</span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </button>
            )}
            <button
              type="button"
              onClick={onContinueToPortfolio}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <span>Continue to Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible 15-Question Review */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowQuestionReview(!showQuestionReview)}
            className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                Question Responses Review ({ASSESSMENT_QUESTIONS.length} Questions)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect your chosen answers and scoring points across all {ASSESSMENT_QUESTIONS.length} questions
              </p>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              {showQuestionReview ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {showQuestionReview && (
            <div className="p-6 border-t border-slate-200 bg-slate-50/50 space-y-5">
              <div className="flex flex-wrap gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedBiasFilter('all')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    selectedBiasFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Questions ({ASSESSMENT_QUESTIONS.length})
                </button>
                {scores.biasList.map((b) => (
                  <button
                    key={b.category}
                    type="button"
                    onClick={() => setSelectedBiasFilter(b.category)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      selectedBiasFilter === b.category
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {b.category}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {ASSESSMENT_QUESTIONS.filter(
                  (q) => selectedBiasFilter === 'all' || q.biasCategory === selectedBiasFilter
                ).map((q) => {
                  const selectedIdx = answers[q.id];
                  const chosenOption = selectedIdx !== undefined ? q.options[selectedIdx] : null;

                  return (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 rounded-lg border border-slate-200 bg-white space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">
                          Scenario {q.id} · {q.biasCategory}
                        </span>
                        {chosenOption && (
                          <span className="text-slate-500 font-medium tabular-nums">
                            +{chosenOption.biasScore} / 3 points
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900">
                        {q.scenario}
                      </p>

                      {chosenOption && (
                        <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs space-y-1">
                          <div className="font-medium text-slate-700 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded bg-slate-900 text-white text-[10px] flex items-center justify-center font-bold">
                              {chosenOption.label}
                            </span>
                            <span>Selected: {chosenOption.text}</span>
                          </div>
                          <p className="text-slate-500 italic pl-5 pt-0.5">
                            Debrief: {chosenOption.feedbackBrief}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Academic Disclaimer Box */}
        <div className="p-4 sm:p-5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 font-display">
              Academic Disclaimer &amp; Scoring Threshold Notice
            </h3>
            <p className="text-xs font-medium text-amber-900 leading-relaxed">
              "BIAS FOLIO is an educational behavioural-finance project designed around the Indian financial market. It does not provide investment, trading, tax, or financial advice. The behavioural results are indicative and are not a professional psychological diagnosis."
            </p>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Because this assessment contains 7 simplified questions, the result is a quick educational indication, not a scientifically validated psychological assessment.
            </p>
          </div>
        </div>

        {/* Navigation Toolbar */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowSaveModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Save My Results</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-300"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Results</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onRetake}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </button>
            <button
              type="button"
              onClick={onContinueToPortfolio}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <span>Continue to Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </main>

      {/* Footer Note */}
      <footer className="no-print py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        BIAS FOLIO · Investor Psychology &amp; Portfolio Diagnostic Tool · Educational B.Com Project
      </footer>

      {/* Google Sheets Integration Modal */}
      <SaveToSheetsModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        scores={scores}
        investments={investments}
      />
    </div>
  );
};
