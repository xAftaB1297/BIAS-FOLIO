import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Currency Standard: Denominated purely in Indian Rupees (₹) with standard Indian numbering (₹5,000, ₹1,00,000, ₹10,00,000)

// Column headings for Google Sheets
const SHEET_HEADERS = [
  'Date & Time',
  'Loss Aversion Score',
  'Herding Bias Score',
  'Overconfidence Bias Score',
  'Confirmation Bias Score',
  'Anchoring Bias Score',
  'Highest Bias',
  'Total Portfolio Value (₹)',
  'Number of Investments'
];

// Helper to extract spreadsheet ID from URL or return raw ID
function parseSpreadsheetId(input?: string): string | null {
  if (!input) return null;
  const match = input.trim().match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return input.trim() || null;
}

// API route to test payload formatting for college project validation
app.post('/api/sheets/test-payload', (req, res) => {
  const { payload } = req.body;
  if (!payload) {
    return res.status(400).json({ error: 'Missing payload in request body' });
  }

  const now = new Date();
  const dateTimeStr = payload.dateTime || `${now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} ${now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

  const formattedRow = [
    dateTimeStr,
    Number(payload.lossAversionScore ?? 0),
    Number(payload.herdingScore ?? 0),
    Number(payload.overconfidenceScore ?? 0),
    Number(payload.confirmationScore ?? 0),
    Number(payload.anchoringScore ?? 0),
    String(payload.highestBias ?? 'Unknown'),
    String(payload.totalPortfolioValue ?? '₹0'),
    Number(payload.investmentCount ?? 0)
  ];

  return res.json({
    success: true,
    headers: SHEET_HEADERS,
    sampleRow: formattedRow
  });
});

// Secure API route to save BIAS FOLIO results to Google Sheets
app.post('/api/sheets/save-results', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authorization Bearer token required. Please sign in with Google first.'
      });
    }

    const accessToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    const { spreadsheetId: inputSpreadsheetId, payload } = req.body;

    if (!payload) {
      return res.status(400).json({
        error: 'Missing assessment payload data to save.'
      });
    }

    let spreadsheetId = parseSpreadsheetId(inputSpreadsheetId);
    let sheetTitle = 'Assessment Results';
    let isNewSpreadsheet = false;

    // 1. If no spreadsheet ID provided, automatically create a new dedicated spreadsheet in the user's Google Drive
    if (!spreadsheetId) {
      const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: `BIAS FOLIO — Investor Assessment Results (${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })})`
          },
          sheets: [
            {
              properties: {
                title: 'Assessment Results'
              }
            }
          ]
        })
      });

      if (!createResponse.ok) {
        const errData = await createResponse.json().catch(() => ({}));
        return res.status(createResponse.status).json({
          error: errData?.error?.message || 'Failed to create new Google Spreadsheet. Ensure spreadsheet permissions were granted.'
        });
      }

      const createData = await createResponse.json();
      spreadsheetId = createData.spreadsheetId;
      sheetTitle = createData.sheets?.[0]?.properties?.title || 'Assessment Results';
      isNewSpreadsheet = true;
    } else {
      // Fetch metadata of existing spreadsheet to find actual first sheet name
      const metaResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (!metaResponse.ok) {
        const errData = await metaResponse.json().catch(() => ({}));
        return res.status(metaResponse.status).json({
          error: errData?.error?.message || 'Failed to access the specified Google Spreadsheet. Check permissions and ID.'
        });
      }

      const metaData = await metaResponse.json();
      sheetTitle = metaData.sheets?.[0]?.properties?.title || 'Sheet1';
    }

    // 2. Check if sheet is empty or lacks headers
    const checkHeadersResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:I1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    let needsHeaders = true;
    if (checkHeadersResponse.ok) {
      const headerData = await checkHeadersResponse.json();
      if (headerData.values && headerData.values.length > 0 && headerData.values[0].length >= 5) {
        needsHeaders = false;
      }
    }

    // 3. Write column headers if sheet is empty
    if (needsHeaders) {
      const putHeadersResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A1:I1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            range: `${sheetTitle}!A1:I1`,
            majorDimension: 'ROWS',
            values: [SHEET_HEADERS]
          })
        }
      );

      if (!putHeadersResponse.ok) {
        console.warn('Could not write header row, will attempt append directly');
      }
    }

    // 4. Prepare row values
    const now = new Date();
    const dateTimeStr =
      payload.dateTime ||
      `${now.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })} ${now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}`;

    const rowValues = [
      dateTimeStr,
      Number(payload.lossAversionScore ?? 0),
      Number(payload.herdingScore ?? 0),
      Number(payload.overconfidenceScore ?? 0),
      Number(payload.confirmationScore ?? 0),
      Number(payload.anchoringScore ?? 0),
      String(payload.highestBias ?? 'None'),
      String(payload.totalPortfolioValue ?? '₹0'),
      Number(payload.investmentCount ?? 0)
    ];

    // 5. Append the row to the sheet
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:I:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: `${sheetTitle}!A:I`,
          majorDimension: 'ROWS',
          values: [rowValues]
        })
      }
    );

    if (!appendResponse.ok) {
      const errData = await appendResponse.json().catch(() => ({}));
      return res.status(appendResponse.status).json({
        error: errData?.error?.message || 'Failed to append assessment results row to Google Sheets.'
      });
    }

    const appendData = await appendResponse.json();

    return res.json({
      success: true,
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      sheetTitle,
      createdNewSpreadsheet: isNewSpreadsheet,
      rowAppended: rowValues,
      updatedRange: appendData.updates?.updatedRange || `${sheetTitle}!A2:I2`
    });
  } catch (error: any) {
    console.error('Save to Google Sheets Error:', error);
    return res.status(500).json({
      error: error?.message || 'Unexpected server error while saving to Google Sheets.'
    });
  }
});

// API route for Gemini AI Behavioural Coach (tailored to Indian Financial Market)
app.post('/api/coach', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is not configured. Please ensure GEMINI_API_KEY is configured in your environment or Secrets panel.'
      });
    }

    const {
      biasScores,
      strongestBias,
      observations,
      concentrationInfo,
      investmentReasons
    } = req.body;

    const REQUIRED_BIASES = [
      'Loss Aversion',
      'Herding Bias',
      'Overconfidence Bias',
      'Confirmation Bias',
      'Anchoring Bias'
    ];

    if (!biasScores || typeof biasScores !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Please complete all 15 questions to generate your personalized report.'
      });
    }

    const missingBiases = REQUIRED_BIASES.filter((bias) => !biasScores[bias]);
    if (missingBiases.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Please complete all 15 questions to generate your personalized report.'
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `You are the educational AI Behavioural Coach for "BIAS FOLIO", an investor psychology and portfolio diagnostic tool specifically designed for individual retail investors and commerce students in India.

INDIAN FINANCIAL CONTEXT:
1. Explain behavioural concepts using familiar Indian situations:
   - Investing in Indian equities listed on NSE and BSE, tracking benchmark indices like Nifty 50 and S&P BSE Sensex.
   - Long-term wealth creation via Mutual Funds and monthly Systematic Investment Plans (SIPs).
   - Exchange-Traded Funds (ETFs) such as Nifty 50 ETFs and Gold ETFs.
   - Safe havens and cultural anchors: Bank Fixed Deposits (FDs), Government Securities (G-Secs), Sovereign Gold Bonds (SGBs) and physical/digital Gold.
   - Social dynamics: Acting on tips from family, classmates, WhatsApp groups, or Telegram channels during market rallies.
   - Keeping excess funds in low-yield savings accounts or cash out of fear of market dips.
2. Use clear, accessible, jargon-free English suitable for beginners.
3. Use Indian Rupee (₹) amounts in any illustrative scenarios (e.g., ₹5,000, ₹50,000, ₹1,00,000, ₹10,00,000). Never mention foreign currencies like USD.

MANDATORY CAUTIOUS LANGUAGE:
You MUST consistently use cautious, indicative language such as "may", "could", "suggests a possible tendency", "potential predisposition", and "possible behavioural tendency". Never present any observation as an absolute psychological trait or clinical fact.

STRICT NON-ADVISORY GUARDRAILS (MANDATORY & ENFORCED):
1. Do NOT recommend individual stocks, mutual funds, ETFs, properties, or specific financial securities.
2. Do NOT provide buy, sell, or hold instructions.
3. Do NOT predict Sensex/Nifty price targets, returns, or future market moves.
4. Do NOT provide personalized financial advice, tax planning, or wealth management.
5. Do NOT claim clinical authority or treat this as a psychological diagnosis.
6. The AI should only explain behavioural biases and provide general educational reflection suggestions for more disciplined decision-making.`;

    const prompt = `Please review this Indian investor's diagnostic profile:

1. Five Behavioural Bias Scores (out of 100) & Classifications:
${JSON.stringify(biasScores || {}, null, 2)}

2. Strongest Possible Bias:
${JSON.stringify(strongestBias || {}, null, 2)}

3. Portfolio Diagnostic Observations:
${JSON.stringify(observations || [], null, 2)}

4. Portfolio Concentration & Stated Rationales:
- Total Capital: ₹${concentrationInfo?.totalAmount || 0}
- Holding Count: ${concentrationInfo?.investmentCount || 0}
- Largest Asset: ${concentrationInfo?.largestAsset || 'None'}
- Largest Allocation Percentage: ${concentrationInfo?.largestPercentage || 0}%
- Stated Rationales: ${JSON.stringify(investmentReasons || [], null, 2)}

Provide an educational response in simple English containing EXACTLY these four sections using cautious phrasing ("may", "could", "possible behavioural tendency", with ₹ examples where relevant):
1. Short behavioural summary: 2-3 sentences synthesizing their profile in the context of the Indian market.
2. Strongest possible bias: Plain-language explanation of their strongest tendency and how it manifests in retail investing.
3. How this bias may influence investment decisions: How this tendency may influence investment choices during Indian market fluctuations (e.g., Sensex/Nifty corrections, sector bull runs, social WhatsApp tips, or mutual fund SIP panic).
4. Three educational reflection suggestions: Exactly three practical educational reflection suggestions for disciplined investing (e.g. maintaining an investment rationale diary, pre-setting asset allocation limits, observing a 48-hour cooling-off period on informal tips). No stock or fund recommendations.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              behaviouralSummary: {
                type: Type.STRING,
                description: 'Short behavioural summary synthesizing their profile using cautious phrasing like "may", "could", "possible behavioural tendency".'
              },
              strongestPossibleBias: {
                type: Type.STRING,
                description: 'Plain-language explanation of their strongest possible bias using cautious language.'
              },
              influenceOnDecisions: {
                type: Type.STRING,
                description: 'How this bias may influence investment decisions in market swings using cautious language.'
              },
              educationalSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                },
                description: 'Exactly three educational reflection suggestions for disciplined decision-making.'
              }
            },
            required: [
              'behaviouralSummary',
              'strongestPossibleBias',
              'influenceOnDecisions',
              'educationalSuggestions'
            ]
          }
        }
      });
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-3.8-flash encountered issue, attempting fallback to gemini-3.1-flash-lite:', primaryErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              behaviouralSummary: {
                type: Type.STRING,
                description: 'Short behavioural summary synthesizing their profile using cautious phrasing like "may", "could", "possible behavioural tendency".'
              },
              strongestPossibleBias: {
                type: Type.STRING,
                description: 'Plain-language explanation of their strongest possible bias using cautious language.'
              },
              influenceOnDecisions: {
                type: Type.STRING,
                description: 'How this bias may influence investment decisions in market swings using cautious language.'
              },
              educationalSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                },
                description: 'Exactly three educational reflection suggestions for disciplined decision-making.'
              }
            },
            required: [
              'behaviouralSummary',
              'strongestPossibleBias',
              'influenceOnDecisions',
              'educationalSuggestions'
            ]
          }
        }
      });
    }

    const parsedData = JSON.parse(response.text || '{}');
    // Ensure both strongestPossibleBias and backwards-compatible alias are present
    if (parsedData.strongestPossibleBias && !parsedData.strongestTendencyExplanation) {
      parsedData.strongestTendencyExplanation = parsedData.strongestPossibleBias;
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Gemini AI Behavioural Coach Error:', error);
    let cleanMessage = error?.message || 'Failed to generate AI Behavioural Coach analysis. Please try again.';
    try {
      const parsedJson = JSON.parse(cleanMessage);
      if (parsedJson?.error?.message) {
        cleanMessage = parsedJson.error.message;
      }
    } catch {
      // not JSON
    }
    return res.status(500).json({
      error: cleanMessage
    });
  }
});

// Start Express + Vite
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
