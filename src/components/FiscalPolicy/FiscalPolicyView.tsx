import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calculator,
  Coins,
  DollarSign,
  FileSpreadsheet,
  Info,
  Landmark,
  Scale,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { FiscalMetricYear } from '../../types/economy';
import { InteractiveBarChart } from '../Charts/InteractiveBarChart';

interface FiscalPolicyViewProps {
  fiscalData: FiscalMetricYear[];
  currentPolicyRate: number;
}

export const FiscalPolicyView: React.FC<FiscalPolicyViewProps> = ({
  fiscalData,
  currentPolicyRate,
}) => {
  const [selectedYear, setSelectedYear] = useState<FiscalMetricYear>(fiscalData[2]); // FY25
  const [hypotheticalRateCutBps, setHypotheticalRateCutBps] = useState<number>(100);

  // Calculate annual savings for federal govt domestic debt servicing:
  // Domestic floating debt approx PKR 45-50 Trillion.
  // Each 100 bps cut yields approx PKR 450-480 Billion in annualized interest savings.
  const estimatedAnnualDebtSavings_PKR_B = Math.round(
    (hypotheticalRateCutBps / 100) * 465
  );

  const deficitBarItems = fiscalData.map(f => ({
    id: f.fiscalYear,
    label: f.fiscalYear,
    value: f.fiscalDeficitPctGDP,
    subtext: `Primary: ${f.primaryBalancePctGDP > 0 ? `+${f.primaryBalancePctGDP}%` : `${f.primaryBalancePctGDP}%`} of GDP · ${f.imfProgramStatus}`,
    color: f.fiscalDeficitPctGDP < -6.5 ? '#ef4444' : f.fiscalDeficitPctGDP < -5.5 ? '#f59e0b' : '#10b981',
  }));

  return (
    <div className="space-y-6">
      {/* Fiscal Overview Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Ministry of Finance & SBP Economic Coordination</span>
              <span>·</span>
              <span className="font-mono text-emerald-400">IMF EFF Governance</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Pakistan Fiscal Operations & Debt Servicing Observatory
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Monitors the interplay between SBP key interest rates, domestic sovereign debt markup costs,
              FBR tax mobilization, and the constitutional ban on central bank deficit monetization.
            </p>
          </div>

          {/* Quick Year Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono">
            {fiscalData.map(f => (
              <button
                key={f.fiscalYear}
                onClick={() => setSelectedYear(f)}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  selectedYear.fiscalYear === f.fiscalYear
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.fiscalYear}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Year Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">FBR Tax Collection</div>
            <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
              PKR {selectedYear.fbrActual_PKR_Trillion} T
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-between font-mono">
              <span>Target: {selectedYear.fbrTarget_PKR_Trillion}T</span>
              <span className="text-emerald-400 font-semibold">{selectedYear.fbrTaxToGDP_Pct}% of GDP</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Debt Mark-up Expenditure</div>
            <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
              PKR {selectedYear.debtServicingMarkup_PKR_Trillion} T
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              Consumes <span className="text-amber-400 font-semibold">{selectedYear.markupShareOfRevenue_Pct}%</span> of net revenue
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Primary Fiscal Balance</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {selectedYear.primaryBalancePctGDP > 0 ? `+${selectedYear.primaryBalancePctGDP}` : selectedYear.primaryBalancePctGDP}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              IMF Benchmark: Required Surplus &gt; +1.0%
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Fiscal Deficit (% GDP)</div>
            <div className="text-2xl font-bold font-mono text-slate-200 tabular-nums">
              {selectedYear.fiscalDeficitPctGDP}%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              PSDP: PKR {selectedYear.psdpAllocation_PKR_Trillion} T
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Mark-up Savings Engine & Interplay Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SBP Rate Cut Impact on Federal Debt Servicing (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Monetary-to-Fiscal Markup Dividend Engine
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Domestic Debt: PKR 49.8T
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Because ~75% of Pakistan's domestic debt comprises floating-rate Market Treasury Bills (MTBs)
              and floating PIBs, every basis point change by the SBP transmits directly into government mark-up costs.
            </p>

            {/* Interactive Slider */}
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Simulated Policy Rate Cut:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                  -{hypotheticalRateCutBps} bps ({(hypotheticalRateCutBps / 100).toFixed(2)}%)
                </span>
              </div>

              <input
                type="range"
                min={25}
                max={400}
                step={25}
                value={hypotheticalRateCutBps}
                onChange={e => setHypotheticalRateCutBps(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-25 bps</span>
                <span>-100 bps (Standard)</span>
                <span>-200 bps (Aggressive)</span>
                <span>-400 bps (Cumulative)</span>
              </div>
            </div>

            {/* Calculated Result Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/70 border border-emerald-500/30 rounded-lg p-3">
                <div className="text-slate-400 text-[11px] mb-0.5">Annual Budget Savings</div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  PKR {estimatedAnnualDebtSavings_PKR_B} B
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  ~{(estimatedAnnualDebtSavings_PKR_B / 1000).toFixed(2)} Trillion saved annually
                </div>
              </div>

              <div className="bg-slate-950/70 border border-cyan-500/30 rounded-lg p-3">
                <div className="text-slate-400 text-[11px] mb-0.5">Fiscal Space Created</div>
                <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                  +{((estimatedAnnualDebtSavings_PKR_B / 124200) * 100).toFixed(2)}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  as % of nominal GDP reduction
                </div>
              </div>
            </div>

            {/* Practical Equivalence */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-md p-3 text-xs space-y-1.5 text-slate-300">
              <div className="font-semibold text-slate-200 text-[11px] flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Fiscal Equivalence of this Rate Cut:
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Equivalent to <span className="text-slate-200 font-medium">{Math.round((estimatedAnnualDebtSavings_PKR_B / 1400) * 100)}%</span> of the entire Federal PSDP development budget.</li>
                <li>Reduces the share of tax revenue consumed by mark-up from <span className="text-rose-400 font-mono">70.8%</span> down to <span className="text-emerald-400 font-mono">{(70.8 - (estimatedAnnualDebtSavings_PKR_B / 12350) * 100).toFixed(1)}%</span>.</li>
                <li>Eliminates need for mini-budgets or supplementary revenue surcharges.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Historical Deficit & Primary Surplus Trajectory (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <InteractiveBarChart
            items={deficitBarItems}
            title="Fiscal Deficit as % of GDP (FY23 to FY26)"
            subtitle="Consolidation trajectory driven by FBR revenue mobilization and rate cuts"
            unit="%"
            maxValue={0}
            showZeroLine={true}
          />

          {/* SBP-Fiscal Policy Interplay Rules */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              SBP & Ministry of Finance Policy Coordination Rules
            </h4>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/60 border border-slate-800/70 rounded p-2.5">
                <span className="font-semibold text-slate-200 block mb-0.5">
                  1. Zero SBP Debt Monetization (SBP Act 2022)
                </span>
                <span className="text-slate-400">
                  The federal government is strictly prohibited from borrowing from SBP. The treasury
                  must finance its deficit purely via market auctions of T-Bills and PIBs to commercial banks.
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/70 rounded p-2.5">
                <span className="font-semibold text-slate-200 block mb-0.5">
                  2. Primary Surplus Target under IMF EFF
                </span>
                <span className="text-slate-400">
                  The primary balance (revenue minus all expenditure excluding interest mark-up) must remain
                  positive (+1.5% to +2.0% of GDP). This guarantees that new debt is not issued to pay old debt.
                </span>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/70 rounded p-2.5">
                <span className="font-semibold text-slate-200 block mb-0.5">
                  3. Treasury Single Account (TSA) Execution
                </span>
                <span className="text-slate-400">
                  Public sector entities' idle commercial deposits are consolidated into the SBP TSA,
                  reducing gross federal borrowing requirements and dampening interbank liquidity volatility.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Year Comparison Spreadsheet Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Comprehensive Fiscal Matrix (FY23 - FY26)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Values in PKR Trillions unless specified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-2.5 px-3 font-semibold">Fiscal Indicator</th>
                {fiscalData.map(f => (
                  <th key={f.fiscalYear} className="py-2.5 px-3 text-right font-semibold">
                    {f.fiscalYear}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 tabular-nums">
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans">Nominal GDP (PKR Trillion)</td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-slate-200">
                    {f.nominalGDP_PKR_Trillion.toFixed(1)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans">FBR Tax Collection Target</td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-slate-400">
                    {f.fbrTarget_PKR_Trillion.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans font-medium">FBR Actual Realized Collection</td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-emerald-400 font-bold">
                    {f.fbrActual_PKR_Trillion.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans">FBR Tax-to-GDP Ratio (%)</td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-slate-100">
                    {f.fbrTaxToGDP_Pct.toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans">Total Federal Outlay</td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-slate-300">
                    {f.totalFederalExpenditure_PKR_Trillion.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans font-medium text-rose-300">
                  Debt Servicing Mark-up Burden
                </td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-rose-400 font-bold">
                    {f.debtServicingMarkup_PKR_Trillion.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans">Mark-up as % of Net Federal Revenue</td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-amber-400">
                    {f.markupShareOfRevenue_Pct.toFixed(1)}%
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans">PSDP Development Allocation</td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-cyan-400">
                    {f.psdpAllocation_PKR_Trillion.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans font-medium">Primary Balance (% of GDP)</td>
                {fiscalData.map(f => (
                  <td
                    key={f.fiscalYear}
                    className={`py-2 px-3 text-right font-bold ${
                      f.primaryBalancePctGDP > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {f.primaryBalancePctGDP > 0 ? `+${f.primaryBalancePctGDP}%` : `${f.primaryBalancePctGDP}%`}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2 px-3 text-slate-300 font-sans font-medium">Fiscal Deficit (% of GDP)</td>
                {fiscalData.map(f => (
                  <td key={f.fiscalYear} className="py-2 px-3 text-right text-slate-200">
                    {f.fiscalDeficitPctGDP}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
