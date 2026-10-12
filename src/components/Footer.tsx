import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg font-display">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
              BIAS FOLIO
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An educational behavioural-finance diagnostic framework designed to help college students and individual investors understand psychological biases affecting asset management and portfolio decisions.
            </p>
            <div className="text-xs text-slate-400">
              Department of Commerce &middot; Academic Capstone Project
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Quick Navigation
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#overview" className="hover:text-white transition-colors">
                  Overview &amp; Purpose
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Diagnostic Methodology
                </a>
              </li>
              <li>
                <a href="#biases" className="hover:text-white transition-colors">
                  Biases Covered
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-white transition-colors">
                  Educational Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Academic Note */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              Behavioural Finance Concepts
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on empirical research by Amos Tversky, Daniel Kahneman, Richard Thaler, and Terrance Odean. Developed for non-commercial student learning and diagnostic reflection.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} BIAS FOLIO. Academic Educational Project.
          </p>
          <p className="text-slate-400">
            For educational demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
};
