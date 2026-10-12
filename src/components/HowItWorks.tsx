import React from 'react';
import { HelpCircle, BarChart3, Briefcase, Sparkles } from 'lucide-react';

interface HowItWorksProps {
  onStartAssessment?: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = () => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Behavioral Assessment',
      description:
        'Answer 15 scenario-based questions modeled on Dalal Street decision dilemmas and behavioral economics literature.',
      icon: HelpCircle,
      detail: '15 questions · ~5 minutes · No finance jargon',
    },
    {
      step: 'Step 2',
      title: 'Bias Scoring & Visualizations',
      description:
        'Computes your tendency across 5 biases (Loss Aversion, Herding, Overconfidence, Confirmation, and Anchoring).',
      icon: BarChart3,
      detail: 'Quantified 0–100% metrics & tendency levels',
    },
    {
      step: 'Step 3',
      title: 'Portfolio Diagnostic (INR)',
      description:
        'Analyze your real or sample portfolio across Indian equities, mutual funds, ETFs, and gold to reveal concentration risks.',
      icon: Briefcase,
      detail: 'Detects behavioral blind spots in actual holdings',
    },
    {
      step: 'Step 4',
      title: 'Gemini AI Coach & Final Report',
      description:
        'Receive personalized behavioral reflections, actionable decision guardrails, and exportable reports with Google Sheets integration.',
      icon: Sparkles,
      detail: 'Actionable guardrails & academic citations',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Academic Methodology</span>
            <span aria-hidden="true">·</span>
            <span>Behavioural Diagnostics</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-slate-900 font-display tracking-tight text-balance">
            How BIAS FOLIO Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            A research-backed framework connecting investor psychological biases directly to real portfolio allocation decisions.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="flex flex-col justify-between p-6 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase font-mono">
                      {st.step}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {st.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {st.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 text-xs font-medium text-slate-500">
                  {st.detail}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
