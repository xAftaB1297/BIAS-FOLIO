import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  return (
    <section id="disclaimer" className="py-12 bg-amber-50/60 border-y border-amber-200/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-amber-200 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-amber-950 font-display flex items-center gap-2">
              Important Educational Disclaimer
            </h3>
            <p className="text-sm font-semibold text-amber-900 leading-relaxed">
              “BIAS FOLIO is an educational behavioural-finance project. Its results and asset allocations are illustrative and are not personalised financial advice or a professional psychological diagnosis. Investment decisions require consideration of individual financial circumstances and risks.”
            </p>
            <p className="text-xs text-amber-900/90 font-medium leading-relaxed">
              This assessment contains 15 scenario questions; the output provides an illustrative educational behavioural profile, not a scientifically validated clinical psychological diagnosis.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              This application was developed as an academic exercise for college students and individual investors studying behavioural finance principles across the Indian financial ecosystem (NSE, BSE, SEBI-regulated mutual funds, Gold, and Government Securities). All diagnostic assessments, psychological scores, and reflective outputs are intended solely for classroom discussion, academic evaluation, and personal intellectual curiosity. Users should consult SEBI-registered investment advisers (RIAs) for personal investment decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
