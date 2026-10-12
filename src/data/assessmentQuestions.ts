export type BiasCategory = 
  | 'Loss Aversion'
  | 'Herding Bias'
  | 'Overconfidence Bias'
  | 'Confirmation Bias'
  | 'Anchoring Bias';

export type BiasClassification = 'Low' | 'Moderate' | 'High';

export interface AnswerOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  biasScore: number; // 0 to 3 points contributing to assigned bias
  feedbackBrief: string;
}

export interface AssessmentQuestion {
  id: number;
  biasCategory: BiasCategory;
  scenario: string;
  contextNote?: string;
  options: AnswerOption[];
}

export interface BiasMeta {
  name: BiasCategory;
  academicOrigin: string;
  definition: string;
  marketImpact: string;
  debiasingTip: string;
  plainLanguageExplanation: string;
  whatItMeansSummary: string;
}

export const BIAS_METADATA: Record<BiasCategory, BiasMeta> = {
  'Loss Aversion': {
    name: 'Loss Aversion',
    academicOrigin: 'Amos Tversky & Daniel Kahneman (Prospect Theory, 1979)',
    definition: 'The psychological pain of a monetary loss is felt approximately twice as intensely as the pleasure of an equivalent financial gain.',
    marketImpact: 'Leads investors to stubbornly hold loss-making investments to avoid booking paper losses, while prematurely selling winning positions.',
    debiasingTip: 'Pre-commit to stop-loss levels or review portfolio holdings through the lens of future potential rather than past money spent.',
    plainLanguageExplanation: 'You feel the sting of losing money much more intensely than the joy of making an equal profit, making it painful to accept losses.',
    whatItMeansSummary: 'Loss Aversion is your primary behavioural tendency. When investments fall, you may hesitate to exit in the hope of breaking even, or sell profitable assets prematurely to lock in small gains.'
  },
  'Herding Bias': {
    name: 'Herding Bias',
    academicOrigin: 'David Scharfstein & Jeremy Stein (1990)',
    definition: 'The behavioural instinct to imitate the investment decisions of the broader crowd, social circles, or viral market trends.',
    marketImpact: 'Drives speculative retail bubbles near market peaks and triggers panic selling during routine market corrections.',
    debiasingTip: 'Enforce a cooling-off period and verify fundamentals before acting on viral stock tips, social media buzz, or peer hype.',
    plainLanguageExplanation: 'You tend to follow crowd sentiment, trending assets, or peer recommendations rather than conducting independent research.',
    whatItMeansSummary: 'Herding Bias is your primary behavioural tendency. You are strongly influenced by what friends, family, or trending crowds are buying, making you susceptible to FOMO during rallies.'
  },
  'Overconfidence Bias': {
    name: 'Overconfidence Bias',
    academicOrigin: 'Terrance Odean & Brad Barber (2000)',
    definition: 'Overestimating one’s personal financial knowledge, timing abilities, or predictive accuracy in volatile capital markets.',
    marketImpact: 'Causes excessive trading, high transaction costs, and under-diversification in speculative assets.',
    debiasingTip: 'Benchmark your personal returns against broad market indices and keep an honest record of all past decisions.',
    plainLanguageExplanation: 'You have high faith in your ability to predict price moves and outsmart the broader market.',
    whatItMeansSummary: 'Overconfidence Bias is your primary behavioural tendency. You tend to believe your own judgment and timing are superior to standard diversified benchmarks, leading to concentrated bets.'
  },
  'Confirmation Bias': {
    name: 'Confirmation Bias',
    academicOrigin: 'Peter Wason (1960) / Behavioral Finance Research',
    definition: 'Actively seeking out information that confirms existing investment choices while disregarding critical research or warning signs.',
    marketImpact: 'Blinds investors to deteriorating fundamentals, debt burdens, or governance red flags in favored companies or assets.',
    debiasingTip: 'Actively seek out counter-arguments and skeptical viewpoints before adding to an existing position.',
    plainLanguageExplanation: 'You naturally look for and remember optimistic news about your choices while ignoring cautious or skeptical viewpoints.',
    whatItMeansSummary: 'Confirmation Bias is your primary behavioural tendency. After choosing an investment, you focus primarily on positive news and dismiss warning signs or differing opinions.'
  },
  'Anchoring Bias': {
    name: 'Anchoring Bias',
    academicOrigin: 'Amos Tversky & Daniel Kahneman (1974)',
    definition: 'Fixating on an arbitrary initial reference point—such as historical purchase price or a past peak—when making decisions.',
    marketImpact: 'Holding impaired assets indefinitely because the current market price is below an arbitrary purchase or peak price.',
    debiasingTip: 'Value investments based strictly on present cash flows and future outlook rather than historical price charts.',
    plainLanguageExplanation: 'You anchor your expectations to a specific number, such as the exact price you bought at or a past high.',
    whatItMeansSummary: 'Anchoring Bias is your primary behavioural tendency. You evaluate investments based on past price figures (such as your initial buy price) rather than current economic realities.'
  }
};

/**
 * 15-Question BIAS FOLIO Assessment
 * Exactly 3 questions per bias across the 5 core behavioural biases:
 * 1. Loss Aversion: Q1, Q2, Q3 (0-3 pts each, max 9)
 * 2. Herding Bias: Q4, Q5, Q6 (0-3 pts each, max 9)
 * 3. Overconfidence Bias: Q7, Q8, Q9 (0-3 pts each, max 9)
 * 4. Confirmation Bias: Q10, Q11, Q12 (0-3 pts each, max 9)
 * 5. Anchoring Bias: Q13, Q14, Q15 (0-3 pts each, max 9)
 *
 * Designed using simple everyday language for people without a financial background.
 * Educational exercise for illustrative purposes, NOT a scientifically validated psychological diagnosis.
 */
export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // -------------------------------------------------------------------------
  // 1. Loss Aversion (Questions 1, 2, 3)
  // -------------------------------------------------------------------------
  {
    id: 1,
    biasCategory: 'Loss Aversion',
    scenario: 'If an investment drops in value by 15% shortly after you buy it, what would you most likely do?',
    contextNote: 'Reflects reaction to experiencing an unrealized financial loss.',
    options: [
      {
        label: 'A',
        text: 'Hold on stubbornly hoping it breaks even, even if company news is discouraging',
        biasScore: 3,
        feedbackBrief: 'High reluctance to realize a loss; clinging to the hope of getting back to zero.'
      },
      {
        label: 'B',
        text: 'Sell immediately in panic to stop the emotional stress of watching it drop',
        biasScore: 2,
        feedbackBrief: 'Elevated loss anxiety; acting quickly to terminate painful negative feelings.'
      },
      {
        label: 'C',
        text: 'Ask a trusted friend or mentor what they think before taking any step',
        biasScore: 1,
        feedbackBrief: 'Seeking emotional reassurance when confronted with portfolio losses.'
      },
      {
        label: 'D',
        text: 'Objectively re-examine the company’s business fundamentals before making a rational choice',
        biasScore: 0,
        feedbackBrief: 'Calm, fact-driven mindset focused on long-term prospects rather than paper losses.'
      }
    ]
  },
  {
    id: 2,
    biasCategory: 'Loss Aversion',
    scenario: 'How would you compare the emotional pain of losing ₹5,000 to the pleasure of gaining ₹5,000?',
    contextNote: 'Measures psychological asymmetry between financial gains and losses.',
    options: [
      {
        label: 'A',
        text: 'Losing ₹5,000 feels far more painful than the joy of making the same amount',
        biasScore: 3,
        feedbackBrief: 'Classic loss aversion: the emotional sting of loss heavily outweighs equal gains.'
      },
      {
        label: 'B',
        text: 'Losing ₹5,000 stings somewhat more than gaining ₹5,000 feels good',
        biasScore: 2,
        feedbackBrief: 'Moderate loss sensitivity with a noticeable preference for capital defense.'
      },
      {
        label: 'C',
        text: 'Both feel roughly equal in emotional weight',
        biasScore: 1,
        feedbackBrief: 'Balanced emotional response between positive and negative financial outcomes.'
      },
      {
        label: 'D',
        text: 'I view both gains and losses neutrally as normal parts of long-term investing',
        biasScore: 0,
        feedbackBrief: 'Objective mindset that accepts market volatility without emotional asymmetry.'
      }
    ]
  },
  {
    id: 3,
    biasCategory: 'Loss Aversion',
    scenario: 'When an investment you bought has gained 10% within a few weeks, how do you typically act?',
    contextNote: 'Examines disposition effect: the tendency to sell winners too quickly.',
    options: [
      {
        label: 'A',
        text: 'Sell immediately to lock in the profit before there is any risk of losing it',
        biasScore: 3,
        feedbackBrief: 'Strong disposition effect: anxious to bank profits to avoid future regret.'
      },
      {
        label: 'B',
        text: 'Sell a partial portion quickly to protect at least some gain',
        biasScore: 2,
        feedbackBrief: 'Moderate urge to lock in profits early to mitigate potential downside.'
      },
      {
        label: 'C',
        text: 'Keep holding but feel nervous watching daily price swings',
        biasScore: 1,
        feedbackBrief: 'Enduring market volatility while experiencing mild underlying loss anxiety.'
      },
      {
        label: 'D',
        text: 'Hold comfortably according to my original financial plan and asset allocation goals',
        biasScore: 0,
        feedbackBrief: 'Disciplined approach driven by structured goals rather than short-term fear.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 2. Herding Bias (Questions 4, 5, 6)
  // -------------------------------------------------------------------------
  {
    id: 4,
    biasCategory: 'Herding Bias',
    scenario: 'If colleagues, relatives, or social media groups are excitedly buying a trending stock or crypto asset, what are you most likely to do?',
    contextNote: 'Measures susceptibility to peer momentum and fear of missing out (FOMO).',
    options: [
      {
        label: 'A',
        text: 'Buy into it quickly because everyone else seems to be making money',
        biasScore: 3,
        feedbackBrief: 'High herd instinct and FOMO; drawn into investments by crowd enthusiasm.'
      },
      {
        label: 'B',
        text: 'Feel strongly tempted and consider buying a small amount to join in',
        biasScore: 2,
        feedbackBrief: 'Moderate social pull; interested in participating when a trend becomes popular.'
      },
      {
        label: 'C',
        text: 'Notice the excitement but only invest if my own independent research supports it',
        biasScore: 1,
        feedbackBrief: 'Healthy skepticism that prioritizes personal due diligence over hype.'
      },
      {
        label: 'D',
        text: 'Ignore the crowd noise completely and stick strictly to my existing plan',
        biasScore: 0,
        feedbackBrief: 'Independent decision-maker insulated from speculative crowd momentum.'
      }
    ]
  },
  {
    id: 5,
    biasCategory: 'Herding Bias',
    scenario: 'During a sudden market crash where alarming news headlines urge people to exit, how do you react?',
    contextNote: 'Assesses herd behavior under panic conditions and mass sell-offs.',
    options: [
      {
        label: 'A',
        text: 'Rush to sell my holdings immediately because everyone else is getting out',
        biasScore: 3,
        feedbackBrief: 'Strong herd panic: mirroring the crowd’s flight reaction during market drops.'
      },
      {
        label: 'B',
        text: 'Feel anxious and strongly tempted to sell because widespread panic feels convincing',
        biasScore: 2,
        feedbackBrief: 'Vulnerable to contagious market anxiety during sharp corrections.'
      },
      {
        label: 'C',
        text: 'Wait for the panic to subside before taking a calm look at the facts',
        biasScore: 1,
        feedbackBrief: 'Practices a cooling-off period to prevent panic-driven imitation.'
      },
      {
        label: 'D',
        text: 'Remain steady or view market declines as normal corrections and periodic buying opportunities',
        biasScore: 0,
        feedbackBrief: 'Contrarian resilience; comfortable staying disciplined when crowds panic.'
      }
    ]
  },
  {
    id: 6,
    biasCategory: 'Herding Bias',
    scenario: 'When deciding where to put your savings, whose voice carries the greatest weight?',
    contextNote: 'Identifies the primary authority source guiding your investment choices.',
    options: [
      {
        label: 'A',
        text: 'What the crowd, popular forums, or trending discussions are actively praising',
        biasScore: 3,
        feedbackBrief: 'Heavy reliance on popular consensus and crowd validation.'
      },
      {
        label: 'B',
        text: 'Tips and casual recommendations from close friends, colleagues, or family circles',
        biasScore: 2,
        feedbackBrief: 'Influenced by immediate social circle recommendations over formal research.'
      },
      {
        label: 'C',
        text: 'Verified financial disclosures, audited accounts, and regulated analyst reports',
        biasScore: 0,
        feedbackBrief: 'Grounds decisions on documented economic realities and credible data.'
      },
      {
        label: 'D',
        text: 'My own thoughtful analysis combined with consultation from qualified professionals',
        biasScore: 0,
        feedbackBrief: 'Self-directed discipline balanced with professional domain expertise.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 3. Overconfidence Bias (Questions 7, 8, 9)
  // -------------------------------------------------------------------------
  {
    id: 7,
    biasCategory: 'Overconfidence Bias',
    scenario: 'How would you rate your personal ability to anticipate short-term stock market price movements compared to other retail investors?',
    contextNote: 'Measures self-assessment of market timing capability.',
    options: [
      {
        label: 'A',
        text: 'Well above average—I believe I have an intuitive feel for market tops and bottoms',
        biasScore: 3,
        feedbackBrief: 'Marked overconfidence in personal market timing and predictive intuition.'
      },
      {
        label: 'B',
        text: 'Somewhat above average—with good effort, I believe I can consistently beat index returns',
        biasScore: 2,
        feedbackBrief: 'Moderate overestimation of personal ability to outsmart complex financial markets.'
      },
      {
        label: 'C',
        text: 'About average—short-term market movements are largely unpredictable',
        biasScore: 1,
        feedbackBrief: 'Realistic appraisal acknowledging the random nature of short-term prices.'
      },
      {
        label: 'D',
        text: 'Humble—I recognize that even experienced fund managers find market timing extremely difficult',
        biasScore: 0,
        feedbackBrief: 'Intellectual humility that favors systematic diversification over predictive bets.'
      }
    ]
  },
  {
    id: 8,
    biasCategory: 'Overconfidence Bias',
    scenario: 'When an investment you selected gains significantly in price, what do you primarily credit for the success?',
    contextNote: 'Assesses self-attribution bias (crediting skill for gains, luck for losses).',
    options: [
      {
        label: 'A',
        text: 'Entirely my own superior research, intelligence, and sharp market insight',
        biasScore: 3,
        feedbackBrief: 'High self-attribution bias: attributing favorable market outcomes purely to personal skill.'
      },
      {
        label: 'B',
        text: 'Mostly my personal choices, with perhaps a small helping hand from market timing',
        biasScore: 2,
        feedbackBrief: 'Leaning toward taking outsized personal credit for broad market rallies.'
      },
      {
        label: 'C',
        text: 'A balanced combination of my preparation and favorable market conditions',
        biasScore: 1,
        feedbackBrief: 'Grounded understanding of how individual effort intersects with market tailwinds.'
      },
      {
        label: 'D',
        text: 'Broad macroeconomic trends and general market momentum played a dominant role',
        biasScore: 0,
        feedbackBrief: 'Objective appreciation of systemic market forces versus personal control.'
      }
    ]
  },
  {
    id: 9,
    biasCategory: 'Overconfidence Bias',
    scenario: 'How comfortable would you feel putting more than 50% of your total savings into a single high-conviction investment idea?',
    contextNote: 'Measures willingness to take concentrated positions due to high conviction.',
    options: [
      {
        label: 'A',
        text: 'Very comfortable—diversification is only for people who don’t know what they are doing',
        biasScore: 3,
        feedbackBrief: 'Extreme overconfidence leading to dangerous single-asset portfolio concentration.'
      },
      {
        label: 'B',
        text: 'Somewhat comfortable—if I research an opportunity thoroughly, I prefer a heavy bet',
        biasScore: 2,
        feedbackBrief: 'High conviction prompting under-diversification and vulnerability to single shocks.'
      },
      {
        label: 'C',
        text: 'Uncomfortable—I prefer spreading my capital across at least 5 to 10 solid assets',
        biasScore: 1,
        feedbackBrief: 'Sensible appreciation of portfolio risk and diversification benefits.'
      },
      {
        label: 'D',
        text: 'Completely uncomfortable—broad asset allocation across equities, debt, and gold is essential',
        biasScore: 0,
        feedbackBrief: 'Prudent risk management that prioritizes capital preservation through diversification.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 4. Confirmation Bias (Questions 10, 11, 12)
  // -------------------------------------------------------------------------
  {
    id: 10,
    biasCategory: 'Confirmation Bias',
    scenario: 'After you invest in a company or fund, what kind of articles, videos, and commentary do you spend time reading?',
    contextNote: 'Examines tendency to seek confirming versus contradictory information.',
    options: [
      {
        label: 'A',
        text: 'Exclusively positive analysis and bullish posts that validate why I made a great choice',
        biasScore: 3,
        feedbackBrief: 'Strong confirmation seeking: filtering out critical views to preserve conviction.'
      },
      {
        label: 'B',
        text: 'Mostly optimistic commentary, usually skipping pessimistic or cautious reports',
        biasScore: 2,
        feedbackBrief: 'Moderate tendency to favor reassuring opinions over challenging assessments.'
      },
      {
        label: 'C',
        text: 'Both sides, though reading negative opinions feels somewhat irritating or uncomfortable',
        biasScore: 1,
        feedbackBrief: 'Open to differing views despite natural human preference for validation.'
      },
      {
        label: 'D',
        text: 'Both positive and negative viewpoints equally to actively understand downside risks',
        biasScore: 0,
        feedbackBrief: 'Intellectually balanced mindset that actively tests hypotheses against counterarguments.'
      }
    ]
  },
  {
    id: 11,
    biasCategory: 'Confirmation Bias',
    scenario: 'If an independent financial analyst points out serious accounting or competitive risks in an asset you own, how do you typically react?',
    contextNote: 'Tests willingness to update beliefs when confronted with contrary evidence.',
    options: [
      {
        label: 'A',
        text: 'Dismiss their analysis immediately—they probably have an agenda or don’t understand the company',
        biasScore: 3,
        feedbackBrief: 'Defensive dismissal of contradictory facts; protecting pre-existing conviction.'
      },
      {
        label: 'B',
        text: 'Search the internet specifically for counterarguments to prove the critic wrong',
        biasScore: 2,
        feedbackBrief: 'Active confirmation searching: seeking rebuttal rather than objective evaluation.'
      },
      {
        label: 'C',
        text: 'Feel unsettled but take a moment to see if their points have reasonable merit',
        biasScore: 1,
        feedbackBrief: 'Willingness to pause and assess disconfirming signals with cautious openness.'
      },
      {
        label: 'D',
        text: 'Objectively investigate the warning signs and be ready to reduce my position if they are true',
        biasScore: 0,
        feedbackBrief: 'Flexible, truth-seeking investor ready to revise opinions when new facts emerge.'
      }
    ]
  },
  {
    id: 12,
    biasCategory: 'Confirmation Bias',
    scenario: 'When researching a new investment idea you feel enthusiastic about, what is your primary focus?',
    contextNote: 'Evaluates diligence asymmetry during pre-investment research.',
    options: [
      {
        label: 'A',
        text: 'Searching for success stories, huge price targets, and evidence proving it will double',
        biasScore: 3,
        feedbackBrief: 'One-sided optimism: searching only for evidence that confirms initial enthusiasm.'
      },
      {
        label: 'B',
        text: 'Highlighting upside potential while quickly glancing over the risk disclosure section',
        biasScore: 2,
        feedbackBrief: 'Disproportionate attention paid to upside scenarios relative to risk disclosures.'
      },
      {
        label: 'C',
        text: 'Reading an equal balance of advantages and disadvantages before reaching a verdict',
        biasScore: 1,
        feedbackBrief: 'Methodical balance between evaluating upside potential and recognizing limitations.'
      },
      {
        label: 'D',
        text: 'Actively searching for reasons NOT to invest (debt levels, governance flaws, valuation traps)',
        biasScore: 0,
        feedbackBrief: 'Pre-mortem discipline: stress-testing investment ideas by seeking potential failure modes.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 5. Anchoring Bias (Questions 13, 14, 15)
  // -------------------------------------------------------------------------
  {
    id: 13,
    biasCategory: 'Anchoring Bias',
    scenario: 'You bought a stock at ₹1,000, and its price has dropped to ₹750 because company profits fell. What is your primary thought?',
    contextNote: 'Measures psychological anchoring to initial purchase price.',
    options: [
      {
        label: 'A',
        text: 'I will refuse to sell until the price recovers back to my exact ₹1,000 purchase price',
        biasScore: 3,
        feedbackBrief: 'Heavy anchoring to purchase cost: treating your personal buy price as a cosmic benchmark.'
      },
      {
        label: 'B',
        text: 'Since it was once ₹1,000, it must be a great bargain today at ₹750 regardless of lower profits',
        biasScore: 2,
        feedbackBrief: 'Anchoring to past valuation highs without factoring in altered business fundamentals.'
      },
      {
        label: 'C',
        text: 'I will check whether ₹750 accurately reflects the company’s lower earnings potential',
        biasScore: 0,
        feedbackBrief: 'Fundamental orientation: pricing the asset based on current reality rather than past prices.'
      },
      {
        label: 'D',
        text: 'I will decide based on future capital growth potential across other opportunities, ignoring past cost',
        biasScore: 0,
        feedbackBrief: 'Forward-looking mindset that treats sunk capital objectively without anchor fixation.'
      }
    ]
  },
  {
    id: 14,
    biasCategory: 'Anchoring Bias',
    scenario: 'When deciding whether a stock is “cheap” or “expensive”, how much does its 52-week high price influence you?',
    contextNote: 'Assesses reference point anchoring to historical chart highs.',
    options: [
      {
        label: 'A',
        text: 'Enormously—if a stock traded at ₹500 and is now ₹250, I view it as being on a 50% discount sale',
        biasScore: 3,
        feedbackBrief: 'Deep anchor to historical price peaks: assuming past highs define intrinsic value.'
      },
      {
        label: 'B',
        text: 'Considerably—I frequently use past peaks as my primary target for where the price should return',
        biasScore: 2,
        feedbackBrief: 'Using arbitrary historical chart points as expected recovery benchmarks.'
      },
      {
        label: 'C',
        text: 'Somewhat—I notice the 52-week high, but I know troubled companies often keep falling',
        biasScore: 1,
        feedbackBrief: 'Aware of reference points without allowing them to dictate final valuation conclusions.'
      },
      {
        label: 'D',
        text: 'Very little—I evaluate current valuation ratios (such as P/E and cash flows) rather than past peak charts',
        biasScore: 0,
        feedbackBrief: 'Valuation discipline: anchoring to underlying business value rather than past trading ticks.'
      }
    ]
  },
  {
    id: 15,
    biasCategory: 'Anchoring Bias',
    scenario: 'A market commentator announces an ambitious price target of ₹2,500 on an asset you track. How does that target number affect you?',
    contextNote: 'Examines vulnerability to external numerical anchors.',
    options: [
      {
        label: 'A',
        text: 'That ₹2,500 number immediately becomes my fixed benchmark for evaluating all future moves',
        biasScore: 3,
        feedbackBrief: 'Complete fixation on arbitrary external price targets set by commentators.'
      },
      {
        label: 'B',
        text: 'It noticeably raises my expectations, even if I don’t know what assumptions they used',
        biasScore: 2,
        feedbackBrief: 'Subconsciously anchored by prominent public forecasts.'
      },
      {
        label: 'C',
        text: 'I keep the figure in mind as merely one person’s speculative viewpoint among many',
        biasScore: 1,
        feedbackBrief: 'Treats numerical forecasts with healthy skepticism.'
      },
      {
        label: 'D',
        text: 'I disregard the headline number and evaluate whether the underlying methodology makes economic sense',
        biasScore: 0,
        feedbackBrief: 'Analytical resilience: immune to unsubstantiated numerical suggestions.'
      }
    ]
  }
];

export interface BiasScoreResult {
  category: BiasCategory;
  userScore: number; // 0 to 9 points (composite points from 3 assigned questions)
  maxScore: number;  // Exactly 9 points
  scorePercentage: number; // (userScore / 9) * 100 rounded to integer (0 to 100)
  classification: BiasClassification; // 0-33 = Low, 34-66 = Moderate, 67-100 = High
  metadata: BiasMeta;
}

export interface AssessmentResultsData {
  biasScores: Record<BiasCategory, BiasScoreResult>;
  biasList: BiasScoreResult[];
  overallUserScore: number; // sum out of 45 (9 points * 5 biases)
  overallPercentage: number; // average percentage out of 100
  calculatedAt: string;
}

/**
 * Educational classification thresholds:
 * 0–33% = Low
 * 34–66% = Moderate
 * 67–100% = High
 */
export function classifyScorePercentage(scorePercentage: number): BiasClassification {
  if (scorePercentage <= 33) return 'Low';
  if (scorePercentage <= 66) return 'Moderate';
  return 'High';
}

/**
 * Calculates behavioral tendency scores from the 15-question assessment.
 * Exactly 3 questions assigned to each of the 5 biases:
 * - Loss Aversion: Questions 1, 2, 3 (each 0-3 pts) -> max 9 pts
 * - Herding Bias: Questions 4, 5, 6 (each 0-3 pts) -> max 9 pts
 * - Overconfidence Bias: Questions 7, 8, 9 (each 0-3 pts) -> max 9 pts
 * - Confirmation Bias: Questions 10, 11, 12 (each 0-3 pts) -> max 9 pts
 * - Anchoring Bias: Questions 13, 14, 15 (each 0-3 pts) -> max 9 pts
 *
 * Each bias has maxScore = 9, yielding percentage = Math.round((userScore / 9) * 100)
 * and educational classification: Low (0-33%), Moderate (34-66%), High (67-100%).
 * Total raw score is out of 45, yielding overall percentage = Math.round((total / 45) * 100).
 *
 * NOTE: The questionnaire is an educational exercise designed to illustrate behavioral finance concepts
 * and is not a scientifically validated psychological diagnosis.
 */
export function calculateAssessmentScores(answers: Record<number, number>): AssessmentResultsData {
  const biasRawScores: Record<BiasCategory, number> = {
    'Loss Aversion': 0,
    'Herding Bias': 0,
    'Overconfidence Bias': 0,
    'Confirmation Bias': 0,
    'Anchoring Bias': 0
  };

  // Map each of the 15 questions directly to its assigned bias using question options
  ASSESSMENT_QUESTIONS.forEach((q) => {
    const selectedOptionIdx = answers[q.id];
    if (typeof selectedOptionIdx === 'number' && selectedOptionIdx >= 0 && selectedOptionIdx < q.options.length) {
      const option = q.options[selectedOptionIdx];
      const points = option ? option.biasScore : 0;
      biasRawScores[q.biasCategory] += points;
    }
  });

  const biasScoresRecord: Record<BiasCategory, BiasScoreResult> = {} as any;
  const biasList: BiasScoreResult[] = [];
  let totalUserScore = 0;

  const categories: BiasCategory[] = [
    'Loss Aversion',
    'Herding Bias',
    'Overconfidence Bias',
    'Confirmation Bias',
    'Anchoring Bias'
  ];

  categories.forEach((cat) => {
    // Each bias is evaluated across 3 questions (max 9 points)
    const userScore = Math.min(9, Math.max(0, biasRawScores[cat]));
    totalUserScore += userScore;

    // score percentage = (user score / 9) * 100 rounded to integer
    const scorePercentage = Math.min(100, Math.max(0, Math.round((userScore / 9) * 100)));

    // Classify as Low (0-33%), Moderate (34-66%), High (67-100%)
    const classification = classifyScorePercentage(scorePercentage);

    const result: BiasScoreResult = {
      category: cat,
      userScore,
      maxScore: 9,
      scorePercentage,
      classification,
      metadata: BIAS_METADATA[cat]
    };

    biasScoresRecord[cat] = result;
    biasList.push(result);
  });

  // Overall average percentage out of 100 (from max possible 45 points across the 5 biases)
  const overallPercentage = Math.min(100, Math.max(0, Math.round((totalUserScore / 45) * 100)));

  return {
    biasScores: biasScoresRecord,
    biasList,
    overallUserScore: totalUserScore,
    overallPercentage,
    calculatedAt: new Date().toISOString()
  };
}

// Alias for backwards compatibility
export const calculateBiasResults = calculateAssessmentScores;

// Preset sample responses for fast demonstration across all 15 questions
export const SAMPLE_STUDENT_ANSWERS: Record<number, number> = {
  1: 1, // Loss Aversion (Panic sell) -> 2
  2: 0, // Loss Aversion (Loss far more painful) -> 3
  3: 1, // Loss Aversion (Partial sell quickly) -> 2
  4: 0, // Herding Bias (Buy quickly with crowd) -> 3
  5: 1, // Herding Bias (Feel anxious and tempted) -> 2
  6: 1, // Herding Bias (Friends/family tips) -> 2
  7: 1, // Overconfidence (Somewhat above average) -> 2
  8: 0, // Overconfidence (My superior research) -> 3
  9: 1, // Overconfidence (Prefer heavy bet) -> 2
  10: 1, // Confirmation Bias (Mostly optimistic) -> 2
  11: 0, // Confirmation Bias (Dismiss analyst) -> 3
  12: 1, // Confirmation Bias (Highlight upside) -> 2
  13: 0, // Anchoring Bias (Refuse to sell until ₹1,000) -> 3
  14: 1, // Anchoring Bias (Past peak as target) -> 2
  15: 0  // Anchoring Bias (Target price as fixed benchmark) -> 3
};
