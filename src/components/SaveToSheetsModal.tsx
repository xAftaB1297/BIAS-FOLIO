import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Loader2,
  Table,
  Lock,
  ArrowRight,
  LogOut,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AssessmentResultsData, BiasCategory } from '../data/assessmentQuestions';
import { PortfolioInvestment } from '../data/portfolio';
import { formatINR } from '../utils/currency';
import {
  googleSignIn,
  getAccessToken,
  logoutGoogle,
  auth
} from '../services/firebaseAuth';
import {
  saveAssessmentToGoogleSheets,
  SaveResultsResponse,
  BIAS_FOLIO_HEADERS
} from '../services/googleSheets';
import { User } from 'firebase/auth';

interface SaveToSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: AssessmentResultsData;
  investments?: PortfolioInvestment[];
}

export const SaveToSheetsModal: React.FC<SaveToSheetsModalProps> = ({
  isOpen,
  onClose,
  scores,
  investments = []
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [tokenAvailable, setTokenAvailable] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<SaveResultsResponse | null>(null);

  // Spreadsheet options
  const [useCustomSheet, setUseCustomSheet] = useState<boolean>(false);
  const [customSheetUrl, setCustomSheetUrl] = useState<string>('');
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSaveSuccess(null);
      getAccessToken().then((tok) => {
        setTokenAvailable(Boolean(tok));
        setCurrentUser(auth.currentUser);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate fields for the row
  const getScore = (cat: BiasCategory) => scores.biasScores[cat]?.scorePercentage ?? 0;
  const sortedBiases = [...scores.biasList].sort((a, b) => b.scorePercentage - a.scorePercentage);
  const highestBiasName = sortedBiases[0]?.category || 'None';
  const totalPortfolioValueNum = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const formattedPortfolioValue = formatINR(totalPortfolioValueNum);
  const investmentCount = investments.length;

  const previewRow = {
    dateTime: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }),
    lossAversion: getScore('Loss Aversion'),
    herding: getScore('Herding Bias'),
    overconfidence: getScore('Overconfidence Bias'),
    confirmation: getScore('Confirmation Bias'),
    anchoring: getScore('Anchoring Bias'),
    highestBias: highestBiasName,
    portfolioValue: formattedPortfolioValue,
    investmentsCount: investmentCount
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMsg(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setTokenAvailable(true);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setErrorMsg(err?.message || 'Google Sign-In was cancelled or failed. Please allow popup access and try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setTokenAvailable(false);
  };

  const handleSaveResults = async () => {
    setErrorMsg(null);
    let token = await getAccessToken();

    // If no active in-memory token, trigger sign in first
    if (!token) {
      try {
        setIsAuthenticating(true);
        const authRes = await googleSignIn();
        if (authRes) {
          token = authRes.accessToken;
          setCurrentUser(authRes.user);
          setTokenAvailable(true);
        }
      } catch (err: any) {
        setIsAuthenticating(false);
        setErrorMsg('Authentication is required to save to Google Sheets.');
        return;
      } finally {
        setIsAuthenticating(false);
      }
    }

    if (!token) {
      setErrorMsg('Google access token is unavailable. Please authenticate first.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        dateTime: previewRow.dateTime,
        lossAversionScore: previewRow.lossAversion,
        herdingScore: previewRow.herding,
        overconfidenceScore: previewRow.overconfidence,
        confirmationScore: previewRow.confirmation,
        anchoringScore: previewRow.anchoring,
        highestBias: previewRow.highestBias,
        totalPortfolioValue: previewRow.portfolioValue,
        investmentCount: previewRow.investmentsCount
      };

      const result = await saveAssessmentToGoogleSheets(
        token,
        payload,
        useCustomSheet ? customSheetUrl : undefined
      );

      setSaveSuccess(result);
    } catch (err: any) {
      console.error('Failed to save assessment to Google Sheets:', err);
      // If token expired, clear state
      if (err?.message?.includes('401') || err?.message?.includes('token')) {
        setTokenAvailable(false);
      }
      setErrorMsg(err?.message || 'Failed to save results to Google Sheets. Please check your network and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display tracking-tight flex items-center gap-2">
                Save My Results to Google Sheets
              </h2>
              <p className="text-xs text-slate-500">
                Secure integration for logging B.Com investor assessment records
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* Success Banner */}
          {saveSuccess ? (
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-emerald-900 font-display">
                    Results Successfully Saved!
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    One complete row with your 5 bias scores, dominant tendency, and portfolio metrics has been recorded in Google Sheets.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-white rounded-lg border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span>Spreadsheet:</span>
                  <span className="font-semibold text-slate-900">{saveSuccess.sheetTitle}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span>Target Range:</span>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                    {saveSuccess.sheetTitle}!A:I
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href={saveSuccess.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <span>Open in Google Sheets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Error Notice */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Unable to Save</p>
                    <p className="leading-relaxed">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Data Row to be Saved Preview */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-slate-500" />
                    <span>Row Data to be Appended (9 Columns)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Automatic column headings created if sheet is empty
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  <div className="overflow-x-auto text-[11px]">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-100 text-slate-700 font-semibold">
                        <tr>
                          {BIAS_FOLIO_HEADERS.map((hdr) => (
                            <th key={hdr} className="px-3 py-2 text-left whitespace-nowrap">
                              {hdr}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-100 text-slate-800">
                        <tr>
                          <td className="px-3 py-2.5 whitespace-nowrap text-slate-500 font-mono">
                            {previewRow.dateTime}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap font-bold text-slate-900">
                            {previewRow.lossAversion}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap font-bold text-slate-900">
                            {previewRow.herding}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap font-bold text-slate-900">
                            {previewRow.overconfidence}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap font-bold text-slate-900">
                            {previewRow.confirmation}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap font-bold text-slate-900">
                            {previewRow.anchoring}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap font-bold text-indigo-700">
                            {previewRow.highestBias}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap font-semibold text-slate-900">
                            {previewRow.portfolioValue}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-slate-700 font-medium">
                            {previewRow.investmentsCount}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Destination Spreadsheet Options */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Target Google Sheet
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUseCustomSheet(false)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      !useCustomSheet
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
                      <span>Auto-Create / Default Sheet</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Creates a dedicated &ldquo;BIAS FOLIO — Assessment Results&rdquo; spreadsheet in your Google Drive automatically.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseCustomSheet(true)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      useCustomSheet
                        ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold text-xs text-slate-900">
                      Existing Spreadsheet URL or ID
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Append as a new row to an existing Google Sheet you already manage.
                    </p>
                  </button>
                </div>

                {useCustomSheet && (
                  <div className="pt-1 space-y-1.5 animate-in fade-in duration-150">
                    <input
                      type="text"
                      placeholder="Paste Google Sheet URL (https://docs.google.com/spreadsheets/d/...) or ID"
                      value={customSheetUrl}
                      onChange={(e) => setCustomSheetUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-900 placeholder:text-slate-400"
                    />
                    <p className="text-[11px] text-slate-500">
                      Ensure your signed-in Google account has edit permissions on the sheet.
                    </p>
                  </div>
                )}
              </div>

              {/* Google Account Connection Status */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                {currentUser && tokenAvailable ? (
                  <div className="flex items-center gap-3">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt=""
                        className="w-8 h-8 rounded-full border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900">
                        {currentUser.displayName || 'Google Account'}
                      </div>
                      <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Sign in with Google to authorize saving directly to your account.</span>
                  </div>
                )}

                {currentUser && tokenAvailable ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                    title="Sign out of Google"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Switch</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignIn}
                    disabled={isAuthenticating}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isAuthenticating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-600" />
                    ) : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                    )}
                    <span>Sign in with Google</span>
                  </button>
                )}
              </div>

              {/* Manual Setup & Troubleshooting Guide */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                <button
                  type="button"
                  onClick={() => setShowSetupGuide(!showSetupGuide)}
                  className="w-full px-4 py-2.5 flex items-center justify-between text-left font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Google Sheets Integration Setup &amp; Troubleshooting</span>
                  </span>
                  {showSetupGuide ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showSetupGuide && (
                  <div className="p-4 space-y-3 bg-white border-t border-slate-200 text-slate-600 leading-relaxed animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">1. How the Integration Works</div>
                      <p className="text-[11px]">
                        BIAS FOLIO uses client-side Google OAuth to request temporary authorization (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">spreadsheets</code> scope). Your token is held purely in-memory and is never stored in persistent storage or shared with third parties.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">2. Browser Popup Notice</div>
                      <p className="text-[11px]">
                        If clicking &ldquo;Sign in with Google&rdquo; does not open a window, check if your browser blocked popups. Allow popups for this site and click sign in again.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">3. Writing to Existing Sheets</div>
                      <p className="text-[11px]">
                        When using an existing Google Sheet, ensure your signed-in Google account has &ldquo;Editor&rdquo; access to the sheet. The server will automatically write header titles in row 1 if the sheet is empty, then append your assessment as a new row.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-slate-800">4. Offline / Project Demonstration Fallback</div>
                      <p className="text-[11px]">
                        If Google OAuth is unavailable in your testing environment, you can use the <strong>Print Report / Save as PDF</strong> feature on the Final Report page to export all 5 bias scores, charts, and diagnostic observations directly for your viva examination.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Modal Footer */}
        {!saveSuccess && (
          <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveResults}
              disabled={isSaving || isAuthenticating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-98 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Google Sheets...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Save My Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
