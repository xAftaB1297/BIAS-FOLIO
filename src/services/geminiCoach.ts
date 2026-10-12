export interface GeminiCoachRequest {
  biasScores: Record<string, { score: number; percentage: number; classification: string }>;
  strongestBias: { category: string; percentage: number; classification: string } | null;
  observations: string[];
  concentrationInfo: {
    totalAmount: number;
    investmentCount: number;
    largestAsset: string;
    largestPercentage: number;
  };
  investmentReasons: Array<{
    name: string;
    type: string;
    amount: number;
    reason: string;
  }>;
}

export interface GeminiCoachResponse {
  behaviouralSummary: string;
  strongestPossibleBias: string;
  strongestTendencyExplanation?: string;
  influenceOnDecisions: string;
  educationalSuggestions: string[];
}

export async function fetchAiCoachAnalysis(
  payload: GeminiCoachRequest
): Promise<GeminiCoachResponse> {
  const response = await fetch('/api/coach', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to receive analysis from AI Behavioural Coach.');
  }

  return data.data as GeminiCoachResponse;
}
