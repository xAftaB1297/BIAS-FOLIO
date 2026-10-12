import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { BiasesSection } from './components/BiasesSection';
import { IndianInvestorBasics } from './components/IndianInvestorBasics';
import { Disclaimer } from './components/Disclaimer';
import { Footer } from './components/Footer';
import { AssessmentView } from './components/AssessmentView';
import { AssessmentResultsView } from './components/AssessmentResultsView';
import { PortfolioDiagnosticView } from './components/PortfolioDiagnosticView';
import { GeminiCoachView } from './components/GeminiCoachView';
import { FinalReportView } from './components/FinalReportView';
import { WorkflowStep } from './components/WorkflowStepper';
import { calculateBiasResults, AssessmentResultsData } from './data/assessmentQuestions';
import { PortfolioInvestment, SAMPLE_INVESTMENTS, analyzePortfolio } from './data/portfolio';
import {
  GeminiCoachRequest,
  GeminiCoachResponse,
  fetchAiCoachAnalysis
} from './services/geminiCoach';

export type ViewMode = 'home' | 'assessment' | 'results' | 'portfolio' | 'coach' | 'report';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<AssessmentResultsData | null>(null);
  const [investments, setInvestments] = useState<PortfolioInvestment[]>(SAMPLE_INVESTMENTS);

  // Gemini AI Behavioural Coach state
  const [aiAnalysis, setAiAnalysis] = useState<GeminiCoachResponse | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Start Assessment from Home
  const handleStartAssessment = () => {
    setCurrentView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger Gemini AI Coach with verified survey scores
  const triggerAiCoachAnalysis = async (
    targetScores: AssessmentResultsData,
    targetInvestments: PortfolioInvestment[]
  ) => {
    // Strict guardrail: Never call Gemini API when survey is incomplete
    if (!targetScores) {
      console.warn('AI analysis blocked: Survey is incomplete.');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const summary = analyzePortfolio(targetInvestments, targetScores);
      const sorted = [...targetScores.biasList].sort((a, b) => b.scorePercentage - a.scorePercentage);
      const highest = sorted[0] || null;

      const biasScoresPayload: Record<string, { score: number; percentage: number; classification: string }> = {};
      targetScores.biasList.forEach((b) => {
        biasScoresPayload[b.category] = {
          score: b.userScore,
          percentage: b.scorePercentage,
          classification: b.classification
        };
      });

      const requestPayload: GeminiCoachRequest = {
        biasScores: biasScoresPayload,
        strongestBias: highest
          ? {
              category: highest.category,
              percentage: highest.scorePercentage,
              classification: highest.classification
            }
          : null,
        observations: summary.observations.map((obs) => `${obs.title}: ${obs.message}`),
        concentrationInfo: {
          totalAmount: summary.totalAmount,
          investmentCount: summary.investmentCount,
          largestAsset: summary.largestInvestment?.name || 'None',
          largestPercentage: summary.largestInvestment?.percentage || 0
        },
        investmentReasons: targetInvestments.map((inv) => ({
          name: inv.name,
          type: inv.type,
          amount: inv.amount,
          reason: inv.reason || 'None provided'
        }))
      };

      const response = await fetchAiCoachAnalysis(requestPayload);
      setAiAnalysis(response);
    } catch (err: any) {
      console.error('Gemini AI Coach Error:', err);
      setAiError(
        err?.message ||
          'Failed to connect to the Gemini AI Behavioural Coach. Please verify your GEMINI_API_KEY configuration.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Submit 15-Question Survey and Transition to Results
  const handleCompleteAssessment = (completedAnswers: Record<number, number>) => {
    const REQUIRED_QUESTION_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const isCompleteAndValid = REQUIRED_QUESTION_IDS.every(
      (id) =>
        typeof completedAnswers[id] === 'number' &&
        [0, 1, 2, 3].includes(completedAnswers[id])
    );

    if (!isCompleteAndValid) {
      console.warn('Incomplete survey submission blocked.');
      setCurrentView('assessment');
      return;
    }

    setAnswers(completedAnswers);

    // Calculate 5 bias scores derived strictly from all 15 valid answers
    const calculatedScores = calculateBiasResults(completedAnswers);
    setScores(calculatedScores);

    // Transition to step 2: Results & Charts
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset survey completely: clears answers, scores, and AI cache
  const handleRetakeAssessment = () => {
    setAnswers({});
    setScores(null);
    setAiAnalysis(null);
    setAiError(null);
    setCurrentView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to Home
  const handleGoHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Workflow Stepper step navigation handler
  const handleNavigateStep = (step: WorkflowStep) => {
    if (step === 'assessment') {
      setCurrentView('assessment');
    } else if (step === 'results') {
      if (scores) setCurrentView('results');
    } else if (step === 'portfolio') {
      setCurrentView('portfolio');
    } else if (step === 'coach') {
      if (scores) {
        setCurrentView('coach');
        if (!aiAnalysis && !aiLoading) {
          triggerAiCoachAnalysis(scores, investments);
        }
      }
    } else if (step === 'report') {
      if (scores) setCurrentView('report');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // VIEW ROUTING
  // =========================================================================

  // Step 1: Assessment View
  if (currentView === 'assessment') {
    return (
      <AssessmentView
        onComplete={handleCompleteAssessment}
        onExit={handleGoHome}
        initialAnswers={answers}
      />
    );
  }

  // Step 2: Assessment Results View (Guarded: impossible without scores)
  if (currentView === 'results' && scores) {
    return (
      <AssessmentResultsView
        scores={scores}
        answers={answers}
        investments={investments}
        onRetake={handleRetakeAssessment}
        onHome={handleGoHome}
        onContinueToPortfolio={() => {
          setCurrentView('portfolio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onConsultAiCoach={() => {
          setCurrentView('coach');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          triggerAiCoachAnalysis(scores, investments);
        }}
        onNavigateStep={handleNavigateStep}
      />
    );
  }

  // Step 3: Portfolio Diagnostic View
  if (currentView === 'portfolio') {
    return (
      <PortfolioDiagnosticView
        biasScores={scores}
        investments={investments}
        onUpdateInvestments={(updated) => setInvestments(updated)}
        onAnalyseBehaviour={() => {
          if (scores) {
            setCurrentView('coach');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            triggerAiCoachAnalysis(scores, investments);
          } else {
            setCurrentView('assessment');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onHome={handleGoHome}
        onBackToResults={() => {
          if (scores) {
            setCurrentView('results');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            handleGoHome();
          }
        }}
        onNavigateStep={handleNavigateStep}
      />
    );
  }

  // Step 4: Gemini Coach View (Guarded: impossible without scores)
  if (currentView === 'coach' && scores) {
    return (
      <GeminiCoachView
        biasScores={scores}
        investments={investments}
        aiAnalysis={aiAnalysis}
        loading={aiLoading}
        error={aiError}
        onRetryAnalysis={() => triggerAiCoachAnalysis(scores, investments)}
        onGenerateReport={() => {
          setCurrentView('report');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToPortfolio={() => {
          setCurrentView('portfolio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onHome={handleGoHome}
        onNavigateStep={handleNavigateStep}
      />
    );
  }

  // Step 5: Final Report View (Guarded: impossible without scores)
  if (currentView === 'report' && scores) {
    return (
      <FinalReportView
        biasScores={scores}
        investments={investments}
        aiAnalysis={aiAnalysis}
        onRetakeAssessment={handleRetakeAssessment}
        onBackToCoach={() => {
          setCurrentView('coach');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onHome={handleGoHome}
        onNavigateStep={handleNavigateStep}
      />
    );
  }

  // Default: Home Landing Page
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onStartAssessment={handleStartAssessment} />

      <main className="flex-1">
        <Hero onStartAssessment={handleStartAssessment} />
        <HowItWorks onStartAssessment={handleStartAssessment} />
        <BiasesSection onStartAssessment={handleStartAssessment} />
        <IndianInvestorBasics />
        <Disclaimer />
      </main>

      <Footer />
    </div>
  );
}
