import React, { useState } from 'react';
import { X, ArrowRight, RotateCcw, CheckCircle, Brain, Sparkles, Scale, Zap, Users, Anchor } from 'lucide-react';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  bias: string;
  category: 'Loss Aversion' | 'Overconfidence' | 'Herd Mentality' | 'Anchoring';
  scenario: string;
  options: {
    text: string;
    biasScore: number; // 1 = low bias, 3 = moderate bias, 5 = high bias
    explanation: string;
  }[];
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    bias: "Loss Aversion",
    category: "Loss Aversion",
    scenario: "You purchased shares of Company A at $100. Due to structural market changes, the share price has dropped to $65 and analysts forecast further headwinds. What is your reaction?",
    options: [
      {
        text: "I refuse to sell until the stock returns to at least $100 so I don't book a loss.",
        biasScore: 5,
        explanation: "Indicates high loss aversion; holding an impaired asset primarily to avoid the psychological pain of realizing a loss."
      },
      {
        text: "I feel stressed and wait a month to see if there is any minor rebound.",
        biasScore: 3,
        explanation: "Moderate hesitation driven by loss aversion reluctance."
      },
      {
        text: "I re-evaluate the fundamentals objectively and reallocate capital if better opportunities exist.",
        biasScore: 1,
        explanation: "Rational utility maximization disregarding sunk costs."
      }
    ]
  },
  {
    id: 2,
    bias: "Overconfidence",
    category: "Overconfidence",
    scenario: "Over the last 6 months, two tech stocks you picked rose by 40%. How do you explain this performance to yourself?",
    options: [
      {
        text: "I have a superior eye for market trends and I am ready to increase my trading frequency.",
        biasScore: 5,
        explanation: "Classic attribution bias and overconfidence in predictive ability over market randomness."
      },
      {
        text: "A mix of my research and favorable macro bull market tailwinds.",
        biasScore: 3,
        explanation: "Balanced acknowledgment of personal input and external luck."
      },
      {
        text: "The broader market index gained 35%; most of the gain was market beta rather than unique skill.",
        biasScore: 1,
        explanation: "Objective benchmarking against index returns."
      }
    ]
  },
  {
    id: 3,
    bias: "Herd Mentality",
    category: "Herd Mentality",
    scenario: "A new green-energy stock is trending everywhere on student forums and social media. You haven't read its annual report yet. What do you do?",
    options: [
      {
        text: "Buy a small allocation immediately so I don't suffer FOMO (fear of missing out).",
        biasScore: 5,
        explanation: "Herd mentality and bandwagon effect driven by social consensus rather than fundamental analysis."
      },
      {
        text: "Add it to a watchlist and look for what reputable analysts are saying about it.",
        biasScore: 3,
        explanation: "Influenced by crowd attention, but pausing before capital deployment."
      },
      {
        text: "Ignore the buzz; stick strictly to my pre-defined investment criteria and asset allocation.",
        biasScore: 1,
        explanation: "Disciplined systematic decision-making insulated from noise."
      }
    ]
  },
  {
    id: 4,
    bias: "Anchoring Bias",
    category: "Anchoring",
    scenario: "A stock hit an all-time high of $200 before falling to $120. A friend says: 'It’s at a massive discount compared to $200!' What is your evaluation?",
    options: [
      {
        text: "I agree—it was once worth $200, so $120 represents clear value.",
        biasScore: 5,
        explanation: "Anchoring on the historical peak price as a reference point for current intrinsic value."
      },
      {
        text: "It catches my interest, but I wonder if the $200 was an overvalued bubble.",
        biasScore: 3,
        explanation: "Partially anchored by the previous high, yet skeptical."
      },
      {
        text: "The past price of $200 is irrelevant; only future expected cash flows determine its current fair value.",
        biasScore: 1,
        explanation: "Forward-looking valuation unanchored by historical price peaks."
      }
    ]
  }
];

export const AssessmentModal: React.FC<AssessmentModalProps> = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState<'intro' | 'questions' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!isOpen) return null;

  const currentQ = sampleQuestions[currentQuestionIndex];
  const selectedOptionIndex = answers[currentQ.id];

  const handleSelectOption = (idx: number) => {
    setAnswers({
      ...answers,
      [currentQ.id]: idx
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStage('results');
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setStage('intro');
  };

  // Calculate results
  const calculateAnalysis = () => {
    let totalScore = 0;
    const categoryScores: Record<string, { score: number; label: string; text: string; explanation: string }> = {};

    sampleQuestions.forEach((q) => {
      const selectedIndex = answers[q.id];
      const option = selectedIndex !== undefined ? q.options[selectedIndex] : q.options[0];
      totalScore += option.biasScore;
      categoryScores[q.category] = {
        score: option.biasScore,
        label: option.biasScore >= 4 ? 'Elevated Tendency' : option.biasScore === 3 ? 'Moderate Awareness' : 'High Rational Discipline',
        text: option.text,
        explanation: option.explanation
      };
    });

    const averageScore = (totalScore / sampleQuestions.length).toFixed(1);
    return { averageScore, categoryScores, totalScore };
  };

  const results = stage === 'results' ? calculateAnalysis() : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="font-bold text-slate-900 font-display">BIAS FOLIO Diagnostic</span>
            <span className="text-xs text-slate-500 hidden sm:inline">· Academic Module</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* STAGE 1: INTRO */}
          {stage === 'intro' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  Assessment Introduction
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">
                  Welcome to Your Behavioural Diagnostic
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This diagnostic module is designed for students and investors to assess four foundational behavioral traps: <strong>Loss Aversion</strong>, <strong>Overconfidence</strong>, <strong>Herd Mentality</strong>, and <strong>Anchoring</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Diagnostic Guidelines:
                </div>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Answer honestly based on your actual gut reaction, not what seems "theoretically right".</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>Takes about 2–3 minutes to complete (4 realistic market scenarios).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>All data is processed strictly in your local browser; no login required.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <strong>Educational Notice:</strong> BIAS FOLIO is for academic reflection only and does not provide financial or psychological advice.
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStage('questions')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <span>Begin Diagnostic</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: QUESTION STEPPER */}
          {stage === 'questions' && (
            <div className="space-y-6">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-indigo-600 font-display">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span>of {sampleQuestions.length}</span>
                </div>
                <div className="font-medium text-slate-700">
                  Target Bias: <span className="text-indigo-600 font-semibold">{currentQ.bias}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-slate-900 font-display leading-snug">
                  {currentQ.scenario}
                </h4>
                <p className="text-xs text-slate-500">
                  Choose the option that most closely reflects how you would respond in reality:
                </p>
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOptionIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1 leading-relaxed">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                    currentQuestionIndex === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer'
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={selectedOptionIndex === undefined}
                  className={`inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg transition-all ${
                    selectedOptionIndex === undefined
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm cursor-pointer'
                  }`}
                >
                  <span>
                    {currentQuestionIndex === sampleQuestions.length - 1
                      ? 'Complete & View Diagnostic'
                      : 'Next Question'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: RESULTS SUMMARY */}
          {stage === 'results' && results && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Diagnostic Completed
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-display">
                    Your Investor Psychology Summary
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Academic profile derived from your 4 scenario responses.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Bias Exposure</div>
                  <div className="text-2xl font-extrabold text-indigo-600 font-display tabular-nums">
                    {results.averageScore} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                  </div>
                </div>
              </div>

              {/* Dimension breakdowns */}
              <div className="space-y-3">
                {Object.entries(results.categoryScores).map(([category, data]) => {
                  const getIcon = () => {
                    switch (category) {
                      case 'Loss Aversion': return Scale;
                      case 'Overconfidence': return Zap;
                      case 'Herd Mentality': return Users;
                      case 'Anchoring': return Anchor;
                      default: return Brain;
                    }
                  };
                  const CatIcon = getIcon();

                  return (
                    <div
                      key={category}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CatIcon className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-sm text-slate-900 font-display">
                            {category}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            data.score >= 4
                              ? 'bg-amber-100 text-amber-900'
                              : data.score === 3
                              ? 'bg-indigo-100 text-indigo-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {data.label} ({data.score}/5)
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {data.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Educational Reflection Guidance */}
              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Next Step for B.Com Discussion:</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Reflect on how market rules like stop-loss orders, asset rebalancing schedules, and journaled investment theses can systematically counter these emotional heuristics in real portfolios.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Diagnostic</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  Close Diagnostic
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
