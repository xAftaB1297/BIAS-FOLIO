import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  HelpCircle,
  Home,
  Scale,
  Users,
  Zap,
  SearchCheck,
  Anchor,
  BookOpen,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import {
  ASSESSMENT_QUESTIONS,
  AssessmentQuestion,
  BiasCategory
} from '../data/assessmentQuestions';

interface AssessmentViewProps {
  onComplete: (answers: Record<number, number>) => void;
  onExit: () => void;
  initialAnswers?: Record<number, number>;
}

const REQUIRED_QUESTION_IDS = ASSESSMENT_QUESTIONS.map((q) => q.id);

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  onComplete,
  onExit,
  initialAnswers = {}
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(initialAnswers);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const currentQuestion: AssessmentQuestion = ASSESSMENT_QUESTIONS[currentIndex];

  // Helper to strictly validate if an answer is explicitly selected
  const isValidAnswer = (val: unknown): boolean =>
    typeof val === 'number' && Number.isInteger(val) && val >= 0 && val <= 3;

  // Single source of truth for completion count
  const validCompletedCount = REQUIRED_QUESTION_IDS.filter((id) =>
    isValidAnswer(answers[id])
  ).length;
  const allQuestionsCompleted = validCompletedCount === totalQuestions;

  const currentOptionSelected = isValidAnswer(answers[currentQuestion.id]);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Keyboard navigation support for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '1' || e.key.toLowerCase() === 'a') {
        selectOption(0);
      } else if (e.key === '2' || e.key.toLowerCase() === 'b') {
        selectOption(1);
      } else if (e.key === '3' || e.key.toLowerCase() === 'c') {
        selectOption(2);
      } else if (e.key === '4' || e.key.toLowerCase() === 'd') {
        selectOption(3);
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < totalQuestions - 1) {
          handleNextQuestion();
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrevQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, answers]);

  const selectOption = (optionIndex: number) => {
    setValidationError(null);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleResetSurvey = () => {
    setAnswers({});
    setValidationError(null);
    setCurrentIndex(0);
  };

  const handleNextQuestion = () => {
    if (!currentOptionSelected) {
      setValidationError('Please select one of the four choices before continuing.');
      return;
    }
    setValidationError(null);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setValidationError(null);
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final submission and validation handler for "Analyze My Profile"
  const handleAnalyzeProfile = () => {
    // 1. Check that every required question has a valid, explicitly selected answer
    const unansweredQuestion = ASSESSMENT_QUESTIONS.find(
      (q) => !isValidAnswer(answers[q.id])
    );

    if (unansweredQuestion) {
      setValidationError('Please complete all 15 questions to generate your personalized report.');
      const targetIndex = ASSESSMENT_QUESTIONS.findIndex(
        (q) => q.id === unansweredQuestion.id
      );
      if (targetIndex !== -1) {
        setCurrentIndex(targetIndex);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Validate all 15 IDs are present and valid
    const allValid = REQUIRED_QUESTION_IDS.every((id) =>
      isValidAnswer(answers[id])
    );

    if (!allValid) {
      setValidationError('Please complete all 15 questions to generate your personalized report.');
      return;
    }

    // 3. Submit verified answers to generate analysis and report
    setValidationError(null);
    onComplete(answers);
  };

  const progressPercent = Math.round((validCompletedCount / totalQuestions) * 100);

  const getBiasIcon = (bias: BiasCategory) => {
    switch (bias) {
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

  const BiasIcon = getBiasIcon(currentQuestion.biasCategory);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            <span className="font-bold text-slate-900 font-display text-base tracking-tight">
              BIAS FOLIO
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
              / 15-Question Investor Behaviour Assessment
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Progress Indicator */}
            <div className="text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg tabular-nums">
              {validCompletedCount} of {totalQuestions} questions completed
            </div>

            {/* Reset Survey Action */}
            <button
              type="button"
              onClick={handleResetSurvey}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset all questions to unanswered state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Reset Survey</span>
            </button>

            {/* Exit to Home */}
            <button
              type="button"
              onClick={() => setExitConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Return to homepage"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Minimal Linear progress bar driven strictly by valid completed answers */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-slate-900 h-1 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Question Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-6">
          
          {/* Educational Notice Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Educational Assessment · Illustrative exercise, not a clinical psychological diagnosis</span>
            </span>
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:inline">15 Scenarios</span>
          </div>

          {/* Question Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-bold text-slate-900 font-display">
                Question {String(currentIndex + 1).padStart(2, '0')} of {totalQuestions}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="font-medium text-slate-500 tabular-nums">
                {validCompletedCount} of {totalQuestions} questions completed ({progressPercent}%)
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-medium text-slate-600">
              <BiasIcon className="w-3.5 h-3.5 text-slate-700" />
              <span>Investigating: {currentQuestion.biasCategory}</span>
            </div>
          </div>

          {/* Validation Alert Banner if triggered */}
          {validationError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{validationError}</span>
            </div>
          )}

          {/* Scenario Text */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display leading-snug">
              {currentQuestion.scenario}
            </h2>
            <p className="text-xs text-slate-500">
              Select the option that most naturally reflects how you would respond in this situation:
            </p>
          </div>

          {/* Options (A, B, C, D) */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => selectOption(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 text-slate-900 font-medium ring-1 ring-slate-900/10'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  {/* Option letter indicator */}
                  <span
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {option.label}
                  </span>

                  {/* Option text */}
                  <div className="flex-1 text-sm sm:text-base leading-relaxed pt-0.5">
                    {option.text}
                  </div>

                  {/* Radio check indicator */}
                  <div className="mt-1 shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Unanswered state helper */}
          {!currentOptionSelected && (
            <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Please select an option to mark Question {currentIndex + 1} as answered.</span>
            </div>
          )}

          {/* Question Navigator with strict Tick-Mark verification */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3">
              <span className="font-semibold text-slate-700">Question Navigator:</span>
              <span className="text-slate-500">
                Tick mark (✓) appears only when a question has an explicitly selected answer.
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-1.5">
              {ASSESSMENT_QUESTIONS.map((q, idx) => {
                const hasValidAnswer = isValidAnswer(answers[q.id]);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setValidationError(null);
                      setCurrentIndex(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : hasValidAnswer
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                    title={`Question ${idx + 1}: ${hasValidAnswer ? 'Answered' : 'Unanswered'}`}
                  >
                    <span>Q{idx + 1}</span>
                    {hasValidAnswer ? (
                      <Check className={`w-3 h-3 stroke-[2.5] ${isCurrent ? 'text-emerald-300' : 'text-emerald-600'}`} />
                    ) : (
                      <span className={`text-[10px] ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>•</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Incomplete survey warning when attempting analysis */}
          {!allQuestionsCompleted && isLastQuestion && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Please complete all 15 questions to generate your personalized report ({validCompletedCount} of {totalQuestions} answered).
              </span>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Previous Question Button */}
            <button
              type="button"
              onClick={handlePrevQuestion}
              disabled={currentIndex === 0}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                currentIndex === 0
                  ? 'border-slate-200 text-slate-300 bg-slate-50 cursor-not-allowed'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-3 justify-end">
              {/* Next Question Button (if not on last question) */}
              {!isLastQuestion && (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={!currentOptionSelected}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    !currentOptionSelected
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95 cursor-pointer shadow-xs'
                  }`}
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Master Required Button: "Analyze My Profile" */}
              <button
                type="button"
                onClick={handleAnalyzeProfile}
                disabled={!allQuestionsCompleted}
                className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                  !allQuestionsCompleted
                    ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-75'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 cursor-pointer shadow-sm ring-2 ring-emerald-600/20'
                }`}
                title={
                  allQuestionsCompleted
                    ? 'Analyze your 15 behavioural responses'
                    : 'Please complete all 15 questions to generate your personalized report.'
                }
              >
                <span>Analyze My Profile</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Academic Note Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
          BIAS FOLIO Academic Project · Educational investor psychology assessment across 15 scenario questions. Not a clinical psychological diagnosis.
        </div>
      </main>

      {/* Exit Confirmation Dialog */}
      {exitConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">
              Exit Assessment?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered {validCompletedCount} of {totalQuestions} questions. Your answers will be preserved during this browser session until reset.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExitConfirmOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={() => {
                  setExitConfirmOpen(false);
                  onExit();
                }}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Exit to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
