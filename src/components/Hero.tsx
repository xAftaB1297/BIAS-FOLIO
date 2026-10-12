import React from 'react';
import { BookOpen, Brain, CheckCircle2 } from 'lucide-react';
import heroImg from '../assets/images/hero_bias_folio_1790174891546.jpg';

interface HeroProps {
  onStartAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = () => {
  return (
    <section id="overview" className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
              <span>B.Com Academic Project</span>
              <span aria-hidden="true">·</span>
              <span>Behavioural Finance Diagnostic</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.1] text-balance">
                BIAS FOLIO
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-slate-700 tracking-tight">
                Understand Your Investment Psychology
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Discover how cognitive biases, mental shortcuts, and emotions systematically influence your financial decisions across Indian equities, mutual funds, and gold. Complete a 15-question scenario survey to unlock your personalized behavioral diagnosis and AI-guided asset allocation.
            </p>

            {/* Learn More CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>How It Works &amp; Methodology</span>
              </a>
            </div>

            {/* Clean Value Indicators */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No sign-up required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>15 Scenarios · ~5 mins</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gemini AI Synthesis</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Frame */}
          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              {/* Image asset with fallback */}
              <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                <img
                  src={heroImg}
                  alt="Financial notebook and behavioral investment analysis study"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Fallback styling in background */}
                <div className="absolute inset-0 bg-slate-900 p-6 flex flex-col justify-between -z-10 text-white">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Brain className="w-5 h-5" />
                    <span className="text-xs font-semibold">Behavioural Finance Lab</span>
                  </div>
                  <div>
                    <p className="text-base font-bold">Heuristics &amp; Biases in Capital Markets</p>
                    <p className="text-xs text-slate-400 mt-0.5">Prospect Theory · Heuristic Decision Making</p>
                  </div>
                </div>
              </div>

              {/* Editorial Caption Box below image */}
              <div className="p-4 sm:p-5 bg-white border-t border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Behavioural Finance Framework</span>
                  <span>Academic Model</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Traditional finance assumes purely rational investors. Behavioural finance reveals how emotional instincts—like panic during market corrections or FOMO during rallies—skew portfolio decisions.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
