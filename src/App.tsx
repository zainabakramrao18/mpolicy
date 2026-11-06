/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActiveTab,
  Navigation,
} from './components/Navigation';
import { MonetaryPolicyView } from './components/MonetaryPolicy/MonetaryPolicyView';
import { FiscalPolicyView } from './components/FiscalPolicy/FiscalPolicyView';
import { InflationAnalyticsView } from './components/Inflation/InflationAnalyticsView';
import { HistoricalDataView } from './components/Historical/HistoricalDataView';
import { PolicySimulatorView } from './components/Simulator/PolicySimulatorView';
import { AnalyticalReportsView } from './components/Reports/AnalyticalReportsView';
import { ExportModal } from './components/ExportModal';

import {
  CPI_BASKET_CATEGORIES,
  CURRENT_RATE_CORRIDOR,
  FISCAL_ANNUAL_DATA,
  HISTORICAL_MACRO_SERIES,
  MONTHLY_INFLATION_SERIES,
  PRE_AUTHORED_REPORTS,
  SBP_MPC_DECISIONS,
} from './data/pakistanEconomicData';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('monetary');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const latestInflationPoint = MONTHLY_INFLATION_SERIES[MONTHLY_INFLATION_SERIES.length - 1];
  const currentCPI = latestInflationPoint ? latestInflationPoint.headlineCPI : 4.9;

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRate={CURRENT_RATE_CORRIDOR.policyRate}
        currentCPI={currentCPI}
        onQuickExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb & Section Subtitle */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800/40 no-print">
          <div className="flex items-center gap-1.5 font-mono">
            <span>SBP PolicyPulse</span>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400 capitalize">
              {activeTab === 'monetary' && 'Monetary Policy & SBP Corridor'}
              {activeTab === 'fiscal' && 'Ministry of Finance Fiscal Operations'}
              {activeTab === 'inflation' && 'PBS Consumer Price Index Analytics'}
              {activeTab === 'historical' && 'Macroeconomic Time-Series Data'}
              {activeTab === 'simulator' && 'Policy Action Simulator & Econometric Engine'}
              {activeTab === 'reports' && 'Institutional Research Briefings'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>Source: SBP, MoF & PBS</span>
            <span className="text-slate-700">·</span>
            <span className="text-slate-300">Updated: March 2026</span>
          </div>
        </div>

        {/* View Routing */}
        {activeTab === 'monetary' && (
          <MonetaryPolicyView
            corridor={CURRENT_RATE_CORRIDOR}
            decisions={SBP_MPC_DECISIONS}
            currentCPI={currentCPI}
          />
        )}

        {activeTab === 'fiscal' && (
          <FiscalPolicyView
            fiscalData={FISCAL_ANNUAL_DATA}
            currentPolicyRate={CURRENT_RATE_CORRIDOR.policyRate}
          />
        )}

        {activeTab === 'inflation' && (
          <InflationAnalyticsView
            inflationData={MONTHLY_INFLATION_SERIES}
            basketCategories={CPI_BASKET_CATEGORIES}
          />
        )}

        {activeTab === 'historical' && (
          <HistoricalDataView macroSeries={HISTORICAL_MACRO_SERIES} />
        )}

        {activeTab === 'simulator' && (
          <PolicySimulatorView
            currentRate={CURRENT_RATE_CORRIDOR.policyRate}
            currentCPI={currentCPI}
            currentReservesUSD_B={12.4}
            currentGDP_PKR_T={124.2}
          />
        )}

        {activeTab === 'reports' && (
          <AnalyticalReportsView reports={PRE_AUTHORED_REPORTS} />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/70 py-6 px-4 lg:px-8 text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-200">SBP PolicyPulse</span>
            <span>·</span>
            <span>State Bank of Pakistan & Federal Ministry of Finance Observatory</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Baseline PBS Base Year: 2015-16</span>
            <span>·</span>
            <span>Monetary Policy Framework 2022-2026</span>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        corridor={CURRENT_RATE_CORRIDOR}
        latestDecision={SBP_MPC_DECISIONS[0]}
        currentCPI={currentCPI}
        latestFiscal={FISCAL_ANNUAL_DATA[2]}
      />
    </div>
  );
}
