import React from 'react';
import { Scale, Users, Anchor, Zap, SearchCheck, ArrowRight } from 'lucide-react';

interface BiasesSectionProps {
  onStartAssessment?: () => void;
}

export const BiasesSection: React.FC<BiasesSectionProps> = ({
  onStartAssessment
}) => {
  const biases = [
    {
      name: "Loss Aversion Bias",
      origin: "Kahneman & Tversky (Prospect Theory, 1979)",
      icon: Scale,
      summary: "The psychological pain of losing ₹10,000 on Dalal Street is approximately twice as intense as the joy of gaining ₹10,000.",
      impact: "Investors hold losing investments too long hoping to break even, while selling winners prematurely to lock in quick gains.",
      reflection: "Do you find it difficult to accept a loss even when market fundamentals have completely deteriorated?"
    },
    {
      name: "Overconfidence Bias",
      origin: "Odean & Barber (2000)",
      icon: Zap,
      summary: "Believing one possesses superior analytical ability, timing capability, or control over uncertain market outcomes.",
      impact: "Excessive trading frequency, under-diversification, and taking on disproportionate risks without sufficient margin of safety.",
      reflection: "When a trade succeeds, do you attribute it to personal genius, but blame bad market luck when it fails?"
    },
    {
      name: "Herd Mentality (Bandwagon)",
      origin: "Scharfstein & Stein (1990)",
      icon: Users,
      summary: "Following the consensus actions of a crowd or social media discussions rather than conducting independent due diligence.",
      impact: "Buying stocks at peak valuations during euphoric rallies or panic-selling quality companies during temporary corrections.",
      reflection: "Have you ever bought an asset primarily because peers or social media discussions were enthusiastic?"
    },
    {
      name: "Confirmation Bias",
      origin: "Peter Wason (1960) / Behavioral Finance",
      icon: SearchCheck,
      summary: "Actively seeking information that affirms prior investment theses while filtering out or discounting contradictory evidence.",
      impact: "Ignoring deteriorating earnings reports, overlooking warning signs, and becoming blind to structural downside risks.",
      reflection: "When researching a stock you own, do you focus only on bullish reports and disregard the bear cases?"
    },
    {
      name: "Anchoring Bias",
      origin: "Tversky & Kahneman (1974)",
      icon: Anchor,
      summary: "Fixating on a specific arbitrary reference point—often your original purchase price or an all-time high—when deciding to hold or sell.",
      impact: "Refusing to sell a declining stock until it returns to your buy price, regardless of deteriorating business value.",
      reflection: "Are you still anchoring your valuation of a stock to the price at which you originally purchased it?"
    }
  ];

  return (
    <section id="biases" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Core Behavioral Finance Syllabus</span>
            <span aria-hidden="true">·</span>
            <span>5 Primary Tendencies</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 font-display tracking-tight text-balance">
            Biases Studied in BIAS FOLIO
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            These foundational psychological tendencies explain why retail investors frequently underperform broad market benchmarks.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biases.map((bias) => {
            const Icon = bias.icon;
            return (
              <div
                key={bias.name}
                className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        {bias.name}
                      </h3>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {bias.origin}
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {bias.summary}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Portfolio Symptom
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {bias.impact}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl">
                  <p className="text-xs text-slate-600 italic">
                    <span className="font-semibold text-slate-700 not-italic">Self-Reflection: </span>
                    "{bias.reflection}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ready for Project Demonstration Section under Biases Studied */}
        {onStartAssessment && (
          <div className="mt-12 p-6 sm:p-8 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Evaluation &amp; Viva Ready
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                Ready for the Project Demonstration?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Experience the 15-question behavioural finance assessment designed to uncover cognitive heuristics, portfolio risk tendencies, and Gemini AI coaching.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartAssessment}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 active:scale-95 rounded-lg transition-all shadow-sm cursor-pointer shrink-0"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
