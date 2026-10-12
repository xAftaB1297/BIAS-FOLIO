import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Home,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import {
  InvestmentType,
  INVESTMENT_TYPES,
  PortfolioInvestment,
  SAMPLE_INVESTMENTS,
  analyzePortfolio
} from '../data/portfolio';
import { AssessmentResultsData } from '../data/assessmentQuestions';
import { formatINR } from '../utils/currency';
import { WorkflowStepper, WorkflowStep } from './WorkflowStepper';
import { SaveToSheetsModal } from './SaveToSheetsModal';

interface PortfolioDiagnosticViewProps {
  biasScores: AssessmentResultsData | null;
  investments: PortfolioInvestment[];
  onUpdateInvestments: (investments: PortfolioInvestment[]) => void;
  onAnalyseBehaviour: () => void;
  onHome: () => void;
  onBackToResults?: () => void;
  onNavigateStep?: (step: WorkflowStep) => void;
}

export const PortfolioDiagnosticView: React.FC<PortfolioDiagnosticViewProps> = ({
  biasScores,
  investments,
  onUpdateInvestments,
  onAnalyseBehaviour,
  onHome,
  onBackToResults,
  onNavigateStep
}) => {
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  // New investment form state
  const [name, setName] = useState('');
  const [type, setType] = useState<InvestmentType>('Equity');
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Analyze current portfolio
  const summary = analyzePortfolio(investments, biasScores);

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount.replace(/,/g, ''));

    if (!trimmedName) {
      setFormError('Please enter an investment name (e.g. ABC Ltd., Tata Motors, Nifty 50 Index Fund).');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Please enter a valid invested amount in ₹ greater than 0.');
      return;
    }

    const newInvestment: PortfolioInvestment = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      type,
      amount: parsedAmount,
      reason: reason.trim()
    };

    onUpdateInvestments([...investments, newInvestment]);

    // Reset inputs
    setName('');
    setType('Equity');
    setAmount('');
    setReason('');
  };

  const handleRemoveInvestment = (id: string) => {
    onUpdateInvestments(investments.filter((inv) => inv.id !== id));
  };

  const handleLoadSample = () => {
    onUpdateInvestments(SAMPLE_INVESTMENTS);
  };

  const handleClearAll = () => {
    onUpdateInvestments([]);
  };

  const getTypeColor = (invType: InvestmentType) => {
    switch (invType) {
      case 'Equity':
      case 'Indian Equity':
        return 'bg-blue-600 text-white';
      case 'Mutual Funds':
      case 'Mutual Fund':
        return 'bg-emerald-600 text-white';
      case 'ETFs':
      case 'ETF':
        return 'bg-indigo-600 text-white';
      case 'Gold / Gold ETFs':
      case 'Gold / Gold ETF':
        return 'bg-amber-500 text-white';
      case 'Debt / Fixed Income':
      case 'Government Securities':
        return 'bg-purple-600 text-white';
      case 'Real Estate':
        return 'bg-violet-600 text-white';
      case 'Cash / Emergency Reserve':
        return 'bg-sky-600 text-white';
      case 'Other':
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const getTypeBadgeClass = (invType: InvestmentType) => {
    switch (invType) {
      case 'Equity':
      case 'Indian Equity':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Mutual Funds':
      case 'Mutual Fund':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'ETFs':
      case 'ETF':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Gold / Gold ETFs':
      case 'Gold / Gold ETF':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Debt / Fixed Income':
      case 'Government Securities':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Real Estate':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'Cash / Emergency Reserve':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Other':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Workflow Stepper Navigation */}
      <WorkflowStepper
        currentStep="portfolio"
        onNavigateStep={onNavigateStep}
        hasAssessment={!!biasScores}
        hasPortfolio={investments.length > 0}
        hasCoachAnalysis={false}
      />

      {/* Top Header */}
      <header className="sticky top-12 z-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            <span className="font-bold text-slate-900 font-display text-base tracking-tight">
              BIAS FOLIO
            </span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
              / Portfolio Diagnostic (INR / ₹)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {biasScores && (
              <button
                type="button"
                onClick={() => setShowSaveModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                title="Save Results to Google Sheets"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Save My Results</span>
                <span className="inline sm:hidden">Save</span>
              </button>
            )}
            {onBackToResults && biasScores && (
              <button
                type="button"
                onClick={onBackToResults}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bias Results</span>
              </button>
            )}
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

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* Indian Rupee Currency & Portfolio Standards Banner */}
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 text-slate-600 shrink-0" />
            <span>
              <strong>Indian Rupee (₹) Denominated:</strong> All portfolio holdings are entered and analyzed in ₹ using standard Indian numbering (e.g. ₹5,000, ₹1,00,000, ₹10,00,000) across Indian equities, mutual funds, gold, and debt.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shrink-0 shadow-2xs">
            <span>NSE / BSE Asset Framework</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                B.Com Project Functionality 03 · Portfolio Allocation Analysis
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                Portfolio Diagnostic
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Add your Indian market investments to calculate allocation concentration, evaluate asset diversification across Indian equities, mutual funds, G-Secs, and gold, and identify behavioural patterns in your investment rationales.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Populate with 4 sample Indian investments for demonstration"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                <span>Load Sample (₹2,00,000)</span>
              </button>
              {investments.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* 4 CALCULATED PORTFOLIO METRICS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {/* Metric 1: Total Amount Entered */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                1. Total Capital
              </span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900 font-display tabular-nums">
                {formatINR(summary.totalAmount)}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Aggregate entered in ₹
              </span>
            </div>

            {/* Metric 2: Number of Investments */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                2. Holding Count
              </span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900 font-display tabular-nums">
                {summary.investmentCount}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {summary.investmentCount === 1 ? '1 holding' : `${summary.investmentCount} holdings`}
              </span>
            </div>

            {/* Metric 3: Largest Allocation Percentage */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                3. Largest Allocation
              </span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900 font-display tabular-nums">
                {summary.largestInvestment ? `${summary.largestInvestment.percentage}%` : '0%'}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
                {summary.largestInvestment ? summary.largestInvestment.name : 'None'}
              </span>
            </div>

            {/* Metric 4: Asset Classes Represented */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                4. Diversification Breadth
              </span>
              <div className="mt-1 text-2xl font-extrabold text-slate-900 font-display tabular-nums">
                {Object.values(summary.typeAllocation).filter((t) => t.amount > 0).length} / 6
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Indian asset classes
              </span>
            </div>
          </div>

          {/* Allocation Horizontal Stacked Bar */}
          {summary.totalAmount > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">Indian Asset Class Distribution:</span>
                <span className="text-slate-400 tabular-nums">Total: 100%</span>
              </div>

              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                {INVESTMENT_TYPES.map((t) => {
                  const pct = summary.typeAllocation[t].percentage;
                  if (pct <= 0) return null;
                  return (
                    <div
                      key={t}
                      className={`${getTypeColor(t)} h-full transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                      title={`${t}: ${pct}% (${formatINR(summary.typeAllocation[t].amount)})`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4 text-xs pt-1">
                {INVESTMENT_TYPES.map((t) => {
                  const alloc = summary.typeAllocation[t];
                  if (alloc.amount <= 0) return null;
                  return (
                    <div key={t} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${getTypeColor(t)}`} />
                      <span className="font-medium text-slate-700">{t}:</span>
                      <span className="text-slate-900 font-semibold tabular-nums">{alloc.percentage}%</span>
                      <span className="text-slate-400 text-[11px] tabular-nums">({formatINR(alloc.amount)})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* TWO-COLUMN WORKSPACE: ADD INVESTMENT FORM & HOLDINGS LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form to Add Investments */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 sticky top-20">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Add Indian Investment
                  </h3>
                  <p className="text-xs text-slate-400">Specify details and rationale</p>
                </div>
              </div>

              <form onSubmit={handleAddInvestment} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                    {formError}
                  </div>
                )}

                {/* 1. Investment Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    1. Investment Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ABC Ltd., Tata Motors, Nifty 50 Index Fund"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Listed equity, mutual fund scheme, G-Sec, or Gold ETF
                  </span>
                </div>

                {/* 2. Asset Type */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    2. Asset Classification *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as InvestmentType)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white cursor-pointer"
                  >
                    {INVESTMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Invested Amount in INR (₹) */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    3. Invested Amount (in ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white tabular-nums"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    e.g. ₹10,000, ₹50,000, ₹1,00,000, ₹10,00,000
                  </span>
                </div>

                {/* 4. Reason for Investment */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">
                    4. Why Did You Make This Investment?
                  </label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Long-term investment / Friend recommended after strong rally / Monthly SIP"
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white resize-none"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Diagnostic engine evaluates reasons for social herding or price anchoring.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Indian Portfolio</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Investment Table and Diagnostic Observations */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Holdings Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Your Portfolio Holdings ({investments.length})
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-900 tabular-nums">
                  Total: {formatINR(summary.totalAmount)}
                </span>
              </div>

              {investments.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-700">
                      No investments entered yet
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Add Indian stocks, mutual funds, gold, or government bonds using the form on the left, or click "Load Sample" to load a representative portfolio.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                    <span>Load 4 Sample Holdings</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {summary.allocations.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm font-display">
                              {inv.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getTypeBadgeClass(
                                inv.type
                              )}`}
                            >
                              {inv.type}
                            </span>
                          </div>

                          {inv.reason && (
                            <p className="text-xs text-slate-500 italic">
                              "{inv.reason}"
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                            {formatINR(inv.amount)}
                          </div>
                          <div className="text-[11px] text-slate-500 font-semibold tabular-nums">
                            {inv.percentage}% of portfolio
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveInvestment(inv.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Remove holding"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Mini bar showing percentage of total */}
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-900 h-full rounded-full transition-all"
                          style={{ width: `${inv.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AUTOMATED PORTFOLIO OBSERVATIONS */}
            {summary.observations.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Diagnostic Observations ({summary.observations.length})
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Automated Rules-Based Analysis</span>
                </div>

                <div className="space-y-3">
                  {summary.observations.map((obs) => {
                    let borderClass = 'border-slate-200 bg-slate-50 text-slate-800';
                    let badgeClass = 'bg-slate-200 text-slate-700';

                    if (obs.severity === 'alert') {
                      borderClass = 'border-rose-200 bg-rose-50 text-rose-950';
                      badgeClass = 'bg-rose-100 text-rose-800 border border-rose-200';
                    } else if (obs.severity === 'warning') {
                      borderClass = 'border-amber-200 bg-amber-50 text-amber-950';
                      badgeClass = 'bg-amber-100 text-amber-800 border border-amber-200';
                    } else if (obs.severity === 'info') {
                      borderClass = 'border-blue-200 bg-blue-50 text-blue-950';
                      badgeClass = 'bg-blue-100 text-blue-800 border border-blue-200';
                    }

                    return (
                      <div
                        key={obs.id}
                        className={`p-4 rounded-lg border ${borderClass} space-y-1.5`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold font-display">
                            {obs.title}
                          </span>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                            {obs.type}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">
                          {obs.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PRIMARY CTA: "Analyse My Behaviour" BUTTON */}
            <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-7 space-y-4 border border-slate-800">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Synthesized Analysis &amp; AI Coach
                </div>
                <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                  {biasScores
                    ? 'Connect Assessment Biases with Portfolio Decisions & AI Coach'
                    : 'Survey Completion Required for AI Behavioural Analysis'}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {biasScores
                    ? `Cross-analyze your ${summary.investmentCount} Indian portfolio holdings against your 5 calculated bias scores and receive Gemini AI Behavioural Coach guidance.`
                    : 'Please complete all 15 questions to generate your personalized report and unlock the AI Behavioural Coach.'}
                </p>
              </div>

              {!biasScores && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs">
                  Please complete all 15 questions to generate your personalized report.
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onAnalyseBehaviour}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer bg-white text-slate-900 hover:bg-slate-100 active:scale-95 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>
                    {biasScores
                      ? 'Analyse My Behaviour'
                      : 'Complete 15-Question Assessment First'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {investments.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">
                    * Tip: Entering holdings provides personalized behavioural coaching
                  </span>
                ) : (
                  <span className="text-xs text-slate-300">
                    {investments.length} {investments.length === 1 ? 'asset' : 'assets'} ready for AI behavioural analysis
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Mandatory Project Disclaimer */}
        <div className="p-4 sm:p-5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-900 leading-relaxed">
            <h4 className="font-bold uppercase tracking-wider text-amber-950 font-display">
              Strict Non-Advisory Guardrails
            </h4>
            <p className="font-medium">
              "BIAS FOLIO is an educational behavioural-finance project designed around the Indian financial market. It does not provide investment, trading, tax, or financial advice. The behavioural results are indicative and are not a professional psychological diagnosis."
            </p>
            <p className="text-[11px] text-amber-800/90">
              BIAS FOLIO does NOT recommend specific Indian stocks or mutual funds, does NOT tell users to buy or sell, does NOT predict Sensex/Nifty levels, and does NOT give financial advice.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        BIAS FOLIO · Indian Investor Psychology &amp; Portfolio Diagnostic Tool · Educational B.Com Project
      </footer>

      {/* Save to Google Sheets Modal */}
      {showSaveModal && biasScores && (
        <SaveToSheetsModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          scores={biasScores}
          investments={investments}
        />
      )}
    </div>
  );
};
