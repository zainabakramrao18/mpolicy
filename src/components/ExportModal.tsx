import React from 'react';
import { ArrowDownRight, Check, Copy, Download, FileText, Printer, X } from 'lucide-react';
import { FiscalMetricYear, PolicyRateDecision, RateCorridor } from '../types/economy';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  corridor: RateCorridor;
  latestDecision: PolicyRateDecision;
  currentCPI: number;
  latestFiscal: FiscalMetricYear;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  corridor,
  latestDecision,
  currentCPI,
  latestFiscal,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const realRate = Number((corridor.policyRate - currentCPI).toFixed(1));

  const executiveBriefText = `========================================================================
STATE BANK OF PAKISTAN & MINISTRY OF FINANCE
EXECUTIVE POLICY & MACROECONOMIC BRIEFING
Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
========================================================================

1. MONETARY POLICY STANCE & KEY RATES
------------------------------------------------------------------------
- SBP Target Policy Rate: ${corridor.policyRate.toFixed(2)}%
- SBP Reverse Repo (Ceiling): ${corridor.reverseRepoCeiling.toFixed(2)}%
- SBP Repo Facility (Floor): ${corridor.repoFloor.toFixed(2)}%
- 6-Month KIBOR: ${corridor.kibor6M.toFixed(2)}%
- 3-Month MTB Cut-off: ${corridor.mtb3M.toFixed(2)}%
- Headline CPI Inflation: ${currentCPI.toFixed(1)}% YoY
- Real Ex-Post Policy Rate: +${realRate}% (Comfortably Positive)

2. LATEST MPC DECISION & OFFICIAL REASONING
------------------------------------------------------------------------
- Meeting Date: ${latestDecision.meetingDate}
- Rate Adjustment: ${latestDecision.changeBps > 0 ? `+${latestDecision.changeBps}` : latestDecision.changeBps} bps (from ${latestDecision.previousRate.toFixed(2)}% to ${latestDecision.newRate.toFixed(2)}%)
- MPC Consensus: ${latestDecision.mpcConsensus}
- Primary Justification:
  "${latestDecision.primaryReason}"
- Key Drivers:
  * Inflation Outlook: ${latestDecision.keyDrivers.inflationOutlook}
  * Real Rates: ${latestDecision.keyDrivers.realInterestRates}
  * External Account: ${latestDecision.keyDrivers.externalAccount}
  * Fiscal Discipline: ${latestDecision.keyDrivers.fiscalDiscipline}

3. FISCAL BALANCE & DOMESTIC MARK-UP BURDEN (${latestFiscal.fiscalYear})
------------------------------------------------------------------------
- FBR Tax Collection Target: PKR ${latestFiscal.fbrTarget_PKR_Trillion} Trillion
- FBR Realized Tax Revenue: PKR ${latestFiscal.fbrActual_PKR_Trillion} Trillion (${latestFiscal.fbrTaxToGDP_Pct}% of GDP)
- Federal Mark-up Expenditure: PKR ${latestFiscal.debtServicingMarkup_PKR_Trillion} Trillion
- Mark-up Share of Net Revenue: ${latestFiscal.markupShareOfRevenue_Pct}%
- Primary Fiscal Balance: +${latestFiscal.primaryBalancePctGDP}% of GDP (IMF Compliant)
- Overall Fiscal Deficit: ${latestFiscal.fiscalDeficitPctGDP}% of GDP
- PSDP Development Allocation: PKR ${latestFiscal.psdpAllocation_PKR_Trillion} Trillion

4. SBP-FISCAL POLICY COORDINATION COVENANTS
------------------------------------------------------------------------
- Zero direct central bank borrowing (SBP Act 2022 enforced)
- Sovereign domestic mark-up relief: ~PKR 465B annual savings per 100 bps cut
- Market-determined flexible exchange rate regime preserved
- Foreign Exchange Reserves: Over $12.4 Billion (2.8 months import cover)
========================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(executiveBriefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([executiveBriefText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `SBP_Executive_Macro_Briefing_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm no-print">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Executive Policy & Macroeconomic Briefing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Box */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950/70 whitespace-pre-wrap leading-relaxed select-text">
          {executiveBriefText}
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-900">
          <span className="text-[11px] text-slate-400">
            Export formatted for institutional distribution
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-emerald-400 hover:bg-emerald-300 font-semibold rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download .TXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
