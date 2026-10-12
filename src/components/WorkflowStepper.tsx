import React from 'react';
import {
  Check,
  ChevronRight,
  ClipboardList,
  BarChart3,
  Briefcase,
  Sparkles,
  FileText
} from 'lucide-react';

export type WorkflowStep = 'assessment' | 'results' | 'portfolio' | 'coach' | 'report';

interface WorkflowStepperProps {
  currentStep: WorkflowStep;
  onNavigateStep?: (step: WorkflowStep) => void;
  hasAssessment: boolean;
  hasPortfolio: boolean;
  hasCoachAnalysis: boolean;
}

interface StepItem {
  id: WorkflowStep;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { id: 'assessment', label: '1. Assessment', shortLabel: 'Assessment', icon: ClipboardList },
  { id: 'results', label: '2. Results & Charts', shortLabel: 'Results', icon: BarChart3 },
  { id: 'portfolio', label: '3. Portfolio Diagnostic', shortLabel: 'Portfolio', icon: Briefcase },
  { id: 'coach', label: '4. Gemini Coach', shortLabel: 'AI Coach', icon: Sparkles },
  { id: 'report', label: '5. Final Report', shortLabel: 'Report', icon: FileText }
];

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStep,
  onNavigateStep,
  hasAssessment,
  hasPortfolio,
  hasCoachAnalysis
}) => {
  const getStepIndex = (step: WorkflowStep) => STEPS.findIndex((s) => s.id === step);
  const currentIndex = getStepIndex(currentStep);

  const isStepAccessible = (step: WorkflowStep) => {
    if (step === 'assessment') return true;
    if (step === 'results') return hasAssessment;
    if (step === 'portfolio') return true;
    if (step === 'coach') return hasAssessment;
    if (step === 'report') return hasAssessment;
    return false;
  };

  const isStepCompleted = (stepId: WorkflowStep): boolean => {
    switch (stepId) {
      case 'assessment':
        return hasAssessment;
      case 'results':
        return hasAssessment;
      case 'portfolio':
        return hasPortfolio;
      case 'coach':
        return hasCoachAnalysis;
      case 'report':
        return false;
    }
  };

  return (
    <nav
      aria-label="Workflow progress"
      className="no-print w-full bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 shadow-xs sticky top-0 z-30"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
        {STEPS.map((step, idx) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = isStepCompleted(step.id);
          const accessible = isStepAccessible(step.id);
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                disabled={!accessible || !onNavigateStep}
                onClick={() => onNavigateStep && accessible && onNavigateStep(step.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isCompleted
                    ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                    : accessible
                    ? 'text-slate-500 hover:bg-slate-50 cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed opacity-60'
                }`}
                title={step.label}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    isCurrent
                      ? 'bg-white text-slate-900'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                </span>

                <span className="hidden md:inline">{step.label}</span>
                <span className="inline md:hidden">{step.shortLabel}</span>
              </button>

              {idx < STEPS.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
