import { AssessmentResultsData } from './assessmentQuestions';
import { formatINR } from '../utils/currency';

/**
 * Broad asset categories supported by BIAS FOLIO as required by the specification:
 * - Equity
 * - Mutual Funds
 * - ETFs
 * - Gold / Gold ETFs
 * - Debt / Fixed Income
 * - Real Estate
 * - Cash / Emergency Reserve
 * - Other
 */
export type StandardInvestmentType =
  | 'Equity'
  | 'Mutual Funds'
  | 'ETFs'
  | 'Gold / Gold ETFs'
  | 'Debt / Fixed Income'
  | 'Real Estate'
  | 'Cash / Emergency Reserve'
  | 'Other';

// Union allowing legacy type strings for seamless backwards compatibility
export type InvestmentType =
  | StandardInvestmentType
  | 'Indian Equity'
  | 'Mutual Fund'
  | 'ETF'
  | 'Gold / Gold ETF'
  | 'Government Securities';

export interface PortfolioInvestment {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  reason: string;
}

export interface PortfolioObservation {
  id: string;
  title: string;
  type: 'concentration' | 'herding' | 'diversification' | 'bias-correlation' | 'general';
  severity: 'info' | 'warning' | 'alert';
  message: string;
  contextInvestment?: string;
}

export interface PortfolioSummary {
  totalAmount: number;
  investmentCount: number;
  largestInvestment: {
    name: string;
    type: InvestmentType;
    amount: number;
    percentage: number;
  } | null;
  typeAllocation: Record<StandardInvestmentType, { amount: number; percentage: number }>;
  allocations: Array<{
    id: string;
    name: string;
    type: InvestmentType;
    amount: number;
    percentage: number;
    reason: string;
  }>;
  observations: PortfolioObservation[];
}

export const INVESTMENT_TYPES: StandardInvestmentType[] = [
  'Equity',
  'Mutual Funds',
  'ETFs',
  'Gold / Gold ETFs',
  'Debt / Fixed Income',
  'Real Estate',
  'Cash / Emergency Reserve',
  'Other'
];

/**
 * Normalizes legacy investment type strings into current standard categories
 */
export function normalizeInvestmentType(type: InvestmentType): StandardInvestmentType {
  switch (type) {
    case 'Indian Equity':
      return 'Equity';
    case 'Mutual Fund':
      return 'Mutual Funds';
    case 'ETF':
      return 'ETFs';
    case 'Government Securities':
      return 'Debt / Fixed Income';
    case 'Equity':
    case 'Mutual Funds':
    case 'ETFs':
    case 'Gold / Gold ETFs':
    case 'Debt / Fixed Income':
    case 'Real Estate':
    case 'Cash / Emergency Reserve':
    case 'Other':
      return type;
    default:
      return 'Other';
  }
}

// Sample default investments reflecting typical student and retail investor allocations
export const SAMPLE_INVESTMENTS: PortfolioInvestment[] = [
  {
    id: 'inv-1',
    name: 'Nifty 50 Index Fund',
    type: 'Mutual Funds',
    amount: 100000,
    reason: 'Core long-term monthly SIP tracking top 50 Indian companies'
  },
  {
    id: 'inv-2',
    name: 'ABC Ltd. (Indian Equity)',
    type: 'Equity',
    amount: 50000,
    reason: 'Friend recommended on WhatsApp after strong momentum on NSE'
  },
  {
    id: 'inv-3',
    name: 'Nippon India Gold BeES',
    type: 'Gold / Gold ETFs',
    amount: 30000,
    reason: 'Traditional hedge against inflation and rupee depreciation'
  },
  {
    id: 'inv-4',
    name: '7.18% GS 2033 (Govt Bond)',
    type: 'Debt / Fixed Income',
    amount: 20000,
    reason: 'Sovereign safety and fixed income diversification'
  }
];

// Keywords indicating potential herding behavior in investment rationale
const HERD_KEYWORDS = [
  'friend',
  'friends',
  'everyone',
  'everybody',
  'trending',
  'social media',
  'reddit',
  'twitter',
  'x.com',
  'instagram',
  'youtube',
  'influencer',
  'finfluencer',
  'telegram',
  'whatsapp',
  'colleague',
  'classmate',
  'peer',
  'hype',
  'fomo',
  'popular',
  'tip',
  'recommendation',
  'viral'
];

// Keywords indicating potential anchoring / loss aversion
const ANCHOR_LOSS_KEYWORDS = [
  'bought at',
  'break even',
  'breakeven',
  'recover',
  'loss',
  'all time high',
  '52-week high',
  'cheap compared to',
  'was higher',
  'used to be',
  'waiting until'
];

export function analyzePortfolio(
  investments: PortfolioInvestment[],
  biasScores?: AssessmentResultsData | null
): PortfolioSummary {
  // Validate and sanitize amounts: protect against NaN, negative, or undefined values
  const validInvestments = (investments || []).filter(
    (inv) => inv && typeof inv.name === 'string'
  );

  const totalAmount = validInvestments.reduce((sum, inv) => {
    const val = Number(inv.amount);
    return sum + (!isNaN(val) && val > 0 ? val : 0);
  }, 0);

  const investmentCount = validInvestments.length;

  const typeAllocation: Record<StandardInvestmentType, { amount: number; percentage: number }> = {
    Equity: { amount: 0, percentage: 0 },
    'Mutual Funds': { amount: 0, percentage: 0 },
    ETFs: { amount: 0, percentage: 0 },
    'Gold / Gold ETFs': { amount: 0, percentage: 0 },
    'Debt / Fixed Income': { amount: 0, percentage: 0 },
    'Real Estate': { amount: 0, percentage: 0 },
    'Cash / Emergency Reserve': { amount: 0, percentage: 0 },
    Other: { amount: 0, percentage: 0 }
  };

  validInvestments.forEach((inv) => {
    const rawAmt = Number(inv.amount);
    const amt = !isNaN(rawAmt) && rawAmt > 0 ? rawAmt : 0;
    const standardType = normalizeInvestmentType(inv.type);
    if (typeAllocation[standardType]) {
      typeAllocation[standardType].amount += amt;
    } else {
      typeAllocation['Other'].amount += amt;
    }
  });

  const allocations = validInvestments.map((inv) => {
    const rawAmt = Number(inv.amount);
    const amt = !isNaN(rawAmt) && rawAmt > 0 ? rawAmt : 0;
    const percentage = totalAmount > 0 ? Math.round((amt / totalAmount) * 100) : 0;
    return {
      id: inv.id,
      name: inv.name.trim() || 'Unnamed Investment',
      type: inv.type,
      amount: amt,
      percentage,
      reason: inv.reason || ''
    };
  });

  // Calculate standard type percentages
  Object.keys(typeAllocation).forEach((key) => {
    const t = key as StandardInvestmentType;
    typeAllocation[t].percentage =
      totalAmount > 0 ? Math.round((typeAllocation[t].amount / totalAmount) * 100) : 0;
  });

  // Identify largest investment safely
  let largestInvestment: PortfolioSummary['largestInvestment'] = null;
  if (allocations.length > 0 && totalAmount > 0) {
    const sorted = [...allocations].sort((a, b) => b.amount - a.amount);
    if (sorted[0] && sorted[0].amount > 0) {
      largestInvestment = {
        name: sorted[0].name,
        type: sorted[0].type,
        amount: sorted[0].amount,
        percentage: sorted[0].percentage
      };
    }
  }

  // Generate Educational Observations
  const observations: PortfolioObservation[] = [];

  if (investmentCount === 0 || totalAmount === 0) {
    return {
      totalAmount: 0,
      investmentCount: 0,
      largestInvestment: null,
      typeAllocation,
      allocations: [],
      observations: []
    };
  }

  // 1. Diversification / Number of holdings observation
  if (investmentCount === 1) {
    observations.push({
      id: 'obs-single-holding',
      title: 'Single-Holding Concentration Risk',
      type: 'concentration',
      severity: 'alert',
      message:
        'You have entered only 1 asset holding (100% allocation). In modern portfolio theory, holding a single stock or asset exposes the investor to maximum unsystematic (company-specific) risk, lacking the protection of diversified broad market indices.'
    });
  } else if (investmentCount <= 2) {
    observations.push({
      id: 'obs-limited-diversification',
      title: 'Limited Diversification Risk',
      type: 'diversification',
      severity: 'warning',
      message:
        'With only 2 entered holdings, this portfolio exhibits narrow diversification. Financial studies show spreading capital across uncorrelated asset classes (e.g., Equity, Debt, and Gold) significantly reduces drawdown volatility.'
    });
  }

  // 2. Largest investment concentration observation
  if (largestInvestment && largestInvestment.percentage >= 40 && investmentCount > 1) {
    observations.push({
      id: 'obs-dominant-holding',
      title: 'High Allocation Concentration',
      type: 'concentration',
      severity: largestInvestment.percentage >= 60 ? 'alert' : 'warning',
      message: `Your largest single asset (${largestInvestment.name}) represents ${largestInvestment.percentage}% (${formatINR(largestInvestment.amount)}) of your total capital. Heavy concentration means portfolio returns will be largely dictated by this single instrument rather than broad economic growth.`,
      contextInvestment: largestInvestment.name
    });
  }

  // 3. Herding Indicators in reasons
  allocations.forEach((inv) => {
    const lowerReason = inv.reason.toLowerCase();
    const matchedHerdWord = HERD_KEYWORDS.find((word) => lowerReason.includes(word));

    if (matchedHerdWord) {
      observations.push({
        id: `obs-herding-${inv.id}`,
        title: 'Social Herding Indicator Detected',
        type: 'herding',
        severity: 'warning',
        message: `The stated reason for "${inv.name}" cites peer influence, social media, or trending momentum ("${inv.reason}"). In retail investing, people frequently experience Herding Bias near sector peaks following viral tips rather than independent fundamental analysis.`,
        contextInvestment: inv.name
      });
    }

    const matchedAnchorWord = ANCHOR_LOSS_KEYWORDS.find((word) => lowerReason.includes(word));
    if (matchedAnchorWord) {
      observations.push({
        id: `obs-anchor-${inv.id}`,
        title: 'Price Anchoring / Loss Avoidance Signal',
        type: 'bias-correlation',
        severity: 'info',
        message: `The stated reason for "${inv.name}" mentions past cost levels or waiting to break even ("${inv.reason}"). This pattern reflects psychological anchoring to past purchase prices rather than forward-looking valuation.`,
        contextInvestment: inv.name
      });
    }
  });

  // 4. Bias Cross-Correlation (if user completed the behavioral assessment)
  if (biasScores) {
    const overconfidence = biasScores.biasScores['Overconfidence Bias'];
    const herding = biasScores.biasScores['Herding Bias'];

    if (
      overconfidence &&
      overconfidence.classification === 'High' &&
      largestInvestment &&
      largestInvestment.percentage >= 40
    ) {
      observations.push({
        id: 'obs-cross-overconfidence',
        title: 'Assessment Cross-Insight: Overconfidence & Concentration',
        type: 'bias-correlation',
        severity: 'warning',
        message: `Your assessment identified High Overconfidence Bias (${overconfidence.scorePercentage}%), and your portfolio reveals significant concentration in "${largestInvestment.name}" (${largestInvestment.percentage}%). Behavioural finance research indicates that overconfident investors frequently concentrate capital into few assets believing their intuition will outperform diversified market benchmarks.`
      });
    }

    if (herding && herding.classification === 'High') {
      const hasHerdingReason = allocations.some((inv) =>
        HERD_KEYWORDS.some((word) => inv.reason.toLowerCase().includes(word))
      );
      if (hasHerdingReason) {
        observations.push({
          id: 'obs-cross-herding',
          title: 'Assessment Cross-Insight: Confirmed Herding Propensity',
          type: 'bias-correlation',
          severity: 'alert',
          message: `Your assessment flagged High Herding Bias (${herding.scorePercentage}%), which is directly evidenced in your stated rationales mentioning social groups, tips, or trending buzz.`
        });
      }
    }
  }

  // 5. Positive balance observation if well diversified across asset classes
  if (
    investmentCount >= 3 &&
    largestInvestment &&
    largestInvestment.percentage < 45 &&
    observations.filter((o) => o.severity === 'alert').length === 0
  ) {
    observations.push({
      id: 'obs-balanced-allocation',
      title: 'Prudent Asset Spread',
      type: 'general',
      severity: 'info',
      message:
        'Your entered portfolio avoids single-asset dominance, with your largest holding prudently kept below 45% of total capital across broad asset categories.'
    });
  }

  return {
    totalAmount,
    investmentCount,
    largestInvestment,
    typeAllocation,
    allocations,
    observations
  };
}
