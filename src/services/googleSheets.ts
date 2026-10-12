export interface AssessmentSavePayload {
  dateTime?: string;
  lossAversionScore: number;
  herdingScore: number;
  overconfidenceScore: number;
  confirmationScore: number;
  anchoringScore: number;
  highestBias: string;
  totalPortfolioValue: string; // Formatted in ₹ (e.g. ₹2,50,000 or ₹0)
  investmentCount: number;
}

export interface SaveResultsResponse {
  success: boolean;
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetTitle: string;
  rowAppended: (string | number)[];
  createdNewSpreadsheet?: boolean;
}

/**
 * Standard column headers required for BIAS FOLIO
 */
export const BIAS_FOLIO_HEADERS = [
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

/**
 * Extracts a clean Google Spreadsheet ID from a user-supplied URL or raw ID
 */
export function extractSpreadsheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Match standard docs.google.com/spreadsheets/d/{SPREADSHEET_ID}
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Saves assessment results to Google Sheets via server proxy (or client direct fallback)
 */
export async function saveAssessmentToGoogleSheets(
  accessToken: string,
  payload: AssessmentSavePayload,
  spreadsheetInput?: string
): Promise<SaveResultsResponse> {
  const cleanSpreadsheetId = spreadsheetInput ? extractSpreadsheetId(spreadsheetInput) : '';

  const response = await fetch('/api/sheets/save-results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      spreadsheetId: cleanSpreadsheetId || undefined,
      payload
    })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to save assessment results to Google Sheets.');
  }

  return data;
}
