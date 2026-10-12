# BIAS FOLIO — Investor Psychology & Portfolio Diagnostic Tool

**BIAS FOLIO** is an educational behavioural finance web application designed for commerce and finance students, early-stage retail investors, and academic researchers. Modeled on foundational behavioural economics literature (Kahneman & Tversky, Odean & Barber, Scharfstein & Stein) and tailored for the Indian financial market (NSE, BSE, Mutual Funds, ETFs, Gold, and Government Securities), it diagnoses cognitive heuristics and connects psychological tendencies to actual portfolio allocation decisions.

---

## 1. Project Overview & Academic Purpose

Retail investors frequently underperform broad market benchmarks like the Nifty 50 or S&P BSE Sensex not due to lack of market data, but due to systematic cognitive biases, emotional reactions, and social herd behavior. 

BIAS FOLIO provides:
1. A **15-Question Behavioural Dilemma Assessment** measuring 5 core investor biases.
2. A **Results Dashboard & Visual Analytics** detailing scores and benchmark levels.
3. An **INR Portfolio Diagnostic** evaluating asset concentration, diversification, and stated rationale.
4. An **Educational Behaviour-Based Asset Allocation Model** illustrating broad asset distribution.
5. A server-side **Gemini AI Behavioural Coach** delivering cautious educational reflection guidance.
6. A **Google Sheets Integration** to save diagnostic results for college viva demonstrations.
7. A comprehensive, **print-ready Final Investor Behaviour Report**.

### Educational Non-Advisory Disclaimer
> **Important Academic Limitation:** BIAS FOLIO is developed strictly for educational, academic, and demonstration purposes. It does not provide personalized investment advice, financial planning, portfolio management, or tax counsel. The 15-question assessment is an illustrative pedagogical survey, not a clinically or scientifically validated psychiatric or psychological diagnosis. BIAS FOLIO does not recommend specific stocks, mutual funds, or securities, and does not predict future prices or market returns.

---

## 2. Core Features

### A. 15-Question Assessment & Mathematical Scoring
* **5 Core Biases Studied:**
  1. **Loss Aversion:** Reluctance to accept paper losses and premature sale of winning positions.
  2. **Herding Bias:** Susceptibility to social momentum, viral stock tips, and market panic.
  3. **Overconfidence Bias:** Overestimation of timing ability and personal analytical skill.
  4. **Confirmation Bias:** Filtering out negative data and seeking solely bullish validation.
  5. **Anchoring Bias:** Fixation on arbitrary initial purchase prices or 52-week highs.
* **Scoring Methodology:**
  * Exactly 3 questions assigned to each bias (15 questions total).
  * Each question contributes **0 to 3 points** based on the chosen option.
  * Maximum score per bias is **9 points**.
  * Bias percentage: `(score / 9) × 100` rounded to nearest integer (0% to 100%).
  * Overall score is calculated out of 45 points: `(totalScore / 45) × 100`.
  * Educational Classifications:
    * **0% – 33%:** Low Tendency
    * **34% – 66%:** Moderate Tendency
    * **67% – 100%:** High Tendency
* **Interactive Navigation & Strict Validation:**
  * Single-question progressive view with 4 distinct response options.
  * Live progress indicator (`X of 15 questions completed`).
  * Non-interactive tick indicators (✓) that activate strictly upon explicit option selection.
  * Previous / Next buttons with option review and change capabilities.
  * Strict validation barrier preventing report generation until all 15 questions are answered.

### B. Portfolio Diagnostic (INR)
* **Supported Broad Asset Classes:**
  * Equity
  * Mutual Funds
  * ETFs
  * Gold / Gold ETFs
  * Debt / Fixed Income
  * Real Estate
  * Cash / Emergency Reserve
  * Other
* **Automated Analytics:**
  * Total Portfolio Value in Indian Rupees (`₹ / INR`) with live/reference USD-INR benchmark.
  * Investment holding count and individual allocation percentages.
  * Detection of single-holding concentration (>40% dominant asset).
  * NLP keyword scanning on stated investor rationales for social herding, tips, and price anchoring.
  * Cross-correlation between high assessment bias scores and actual portfolio holdings.
  * Robust handling of empty states, single-asset portfolios, and zero amounts.

### C. Behaviour-Based Asset Allocation Framework
* Illustrates a general broad asset distribution across 3 educational profiles:
  * **Cautious Profile:** 25% Equity, 40% Debt, 15% Gold, 10% Real Estate, 10% Cash (Sum: 100%).
  * **Balanced Profile:** 40% Equity, 30% Debt, 10% Gold, 10% Real Estate, 10% Cash (Sum: 100%).
  * **Growth-Oriented Profile:** 60% Equity, 15% Debt, 10% Gold, 10% Real Estate, 5% Cash (Sum: 100%).
* Fully explains that actual asset allocation depends on age, goals, liquidity needs, income stability, time horizon, and loss-bearing capacity.

### D. Gemini AI Behavioural Coach
* Invoked via a secure server-side Express proxy (`POST /api/coach`).
* Inputs: 5 calibrated bias scores, classifications, portfolio metrics, concentration flags, and rationales.
* Outputs:
  1. Concise behavioural synthesis.
  2. Plain-language explanation of strongest possible bias.
  3. Analysis of how the bias may influence decisions in volatile Indian markets.
  4. Exactly three practical educational reflection suggestions.
* Enforces cautious indicative language ("may indicate", "could influence", "potential tendency").
* Strict guardrails: Zero stock tips, zero return promises, zero clinical claims.

### E. Google Sheets Integration
* Direct user-authorized export of diagnostic data to Google Sheets via Google OAuth.
* Records 9 essential columns:
  * Date & Time
  * Loss Aversion Score
  * Herding Bias Score
  * Overconfidence Bias Score
  * Confirmation Bias Score
  * Anchoring Bias Score
  * Highest Bias
  * Total Portfolio Value (₹)
  * Number of Investments
* Automatic sheet header generation when writing to an empty sheet.
* Support for creating a new spreadsheet in the user's Drive or appending to an existing Sheet URL.

### F. Final Academic Report & Print Export
* Formal header formatted for university/college viva presentations.
* Clean visual charts: SVG Bar Chart (0–100% scale) and Portfolio Allocation breakdowns.
* Native browser print styling (`window.print()`) optimized for PDF generation without UI controls.

---

## 3. Technology Stack

* **Frontend Framework:** React 19 (TypeScript)
* **Build Tool & Bundler:** Vite 8
* **Styling & Icons:** Tailwind CSS 4, Lucide React
* **Backend Runtime:** Node.js / Express 4 (with Vite middleware in development)
* **AI Engine:** Google GenAI SDK (`@google/genai`) using Gemini models
* **Cloud & Auth:** Firebase Authentication (Google OAuth with `https://www.googleapis.com/auth/spreadsheets` scope)

---

## 4. Setup and Installation

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm** or **bun**

### 1. Clone or Extract Repository
```bash
git clone <repository-url>
cd bias-folio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Configuration
Copy the template environment file:
```bash
cp .env.example .env
```

Open `.env` and configure your credentials:
```env
# GEMINI_API_KEY: Secret key from Google AI Studio (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# APP_URL: Base URL of your application (default http://localhost:3000)
APP_URL=http://localhost:3000
```
> **Security Notice:** Never commit `.env` or real API keys to version control. Keep `.env` listed in `.gitignore`.

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at: **http://localhost:3000**

### 5. Production Build
```bash
npm run build
npm start
```

---

## 5. Third-Party Integrations Setup

### A. Gemini AI Setup
1. Visit [Google AI Studio](https://aistudio.google.com/) and generate an API Key.
2. Place the key in your server's `.env` as `GEMINI_API_KEY`.
3. The server communicates with Gemini via `@google/genai` inside `server.ts`. No API keys are ever transmitted or exposed to the frontend browser.

### B. Google Sheets / Google Sign-In Setup
1. In the [Google Cloud Console](https://console.cloud.google.com/), configure an OAuth 2.0 Client ID.
2. Add authorized JavaScript origins: `http://localhost:3000` (and your production domain).
3. Enable the **Google Sheets API** and **Google Drive API** in your Google Cloud Project.
4. Configure Firebase Authentication to allow Google Sign-In with the OAuth scope `https://www.googleapis.com/auth/spreadsheets`.
5. When running locally or for project demonstration, clicking **Save My Results** will prompt you to authorize your Google Account to create or update your spreadsheet.

---

## 6. Testing & Quality Verification

### Available Commands
* **Typecheck & Lint:**
  ```bash
  npm run lint
  ```
  Runs `tsc --noEmit` to verify type safety across all TypeScript modules.
* **Production Compilation:**
  ```bash
  npm run build
  ```
  Executes Vite production build and checks for asset bundling errors.

### Manual Verification Test Scenarios
1. **Fresh App Load:** Open app; survey is unstarted (0/15). Access to Results and Coach is guarded.
2. **Incomplete Survey:** Answer 14 of 15 questions; the **Analyze My Profile** button remains disabled. Attempting direct navigation displays: *"Please complete all 15 questions to generate your personalized report."*
3. **Full 15-Question Survey:** Answer all 15 questions; the completion status updates to 15 of 15, enabling the submission button.
4. **Scoring Accuracy:** Verify that each bias displays 0 to 9 raw points and converts to `(score / 9) * 100` with Low/Moderate/High thresholds.
5. **Portfolio Diagnostic:** Add custom holdings in ₹; verify total sum, percentages, largest holding detection, and concentration observation alerts.
6. **Gemini AI Coach:** Trigger analysis; verify loading spinner, structured 4-section response, cautious phrasing, and failure error handling.
7. **Print Functionality:** Click **Print Results** or **Print Report**; inspect print preview to confirm clean, printer-friendly layout without navigation clutter.
8. **Survey Reset:** Click **Retake / Reset Survey**; confirm all 15 answers, calculated scores, and AI cache reset cleanly.

---

## 7. Known Limitations

1. **Educational Heuristic Survey:** The 15 question dilemmas represent common situations in behavioural finance, but are not a psychometric diagnosis.
2. **Dynamic FX Rates:** Exchange rates for USD/INR are retrieved via live public market feeds with an educational static fallback if offline.
3. **Google Sheets Popups:** Google Sign-In requires browser popups to be permitted in the browser settings.

---

## 8. License

This project is created for academic coursework and educational research in behavioural finance. Free to use and adapt for academic study.
