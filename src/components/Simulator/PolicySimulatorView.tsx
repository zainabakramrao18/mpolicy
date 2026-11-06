import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Cpu,
  DollarSign,
  Flame,
  HelpCircle,
  Info,
  RefreshCw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { MacroeconomicSimulationResult } from '../../types/economy';

interface PolicySimulatorViewProps {
  currentRate: number;
  currentCPI: number;
  currentReservesUSD_B: number;
  currentGDP_PKR_T: number;
}

export const PolicySimulatorView: React.FC<PolicySimulatorViewProps> = ({
  currentRate,
  currentCPI,
  currentReservesUSD_B,
  currentGDP_PKR_T,
}) => {
  // Simulator input parameters
  const [deltaRateBps, setDeltaRateBps] = useState<number>(-100);
  const [fbrTargetAdjustmentPct, setFbrTargetAdjustmentPct] = useState<number>(5);
  const [psdpAdjustmentPct, setPsdpAdjustmentPct] = useState<number>(10);
  const [oilPriceUSD, setOilPriceUSD] = useState<number>(75);
  const [remittanceGrowthPct, setRemittanceGrowthPct] = useState<number>(8);

  // Quick preset scenarios
  const applyPreset = (preset: 'calibrated' | 'aggressive' | 'pause' | 'oilShock') => {
    if (preset === 'calibrated') {
      setDeltaRateBps(-100);
      setFbrTargetAdjustmentPct(5);
      setPsdpAdjustmentPct(10);
      setOilPriceUSD(75);
      setRemittanceGrowthPct(8);
    } else if (preset === 'aggressive') {
      setDeltaRateBps(-200);
      setFbrTargetAdjustmentPct(2);
      setPsdpAdjustmentPct(20);
      setOilPriceUSD(70);
      setRemittanceGrowthPct(10);
    } else if (preset === 'pause') {
      setDeltaRateBps(0);
      setFbrTargetAdjustmentPct(5);
      setPsdpAdjustmentPct(5);
      setOilPriceUSD(80);
      setRemittanceGrowthPct(6);
    } else if (preset === 'oilShock') {
      setDeltaRateBps(100);
      setFbrTargetAdjustmentPct(-2);
      setPsdpAdjustmentPct(-10);
      setOilPriceUSD(95);
      setRemittanceGrowthPct(3);
    }
  };

  // Econometric Transmission Calculation Engine
  const simulation: MacroeconomicSimulationResult = useMemo(() => {
    const newRate = Number((currentRate + deltaRateBps / 100).toFixed(2));

    // Domestic sovereign debt: ~PKR 49.8 Trillion (75% floating)
    // 100 bps cut saves approx PKR 465 Billion annually
    const annualDebtServicingImpactPKR_B = Math.round((-deltaRateBps / 100) * 465);

    // Inflation transmission elasticity:
    // Rate cuts boost credit & aggregate demand: ~0.15% higher CPI per 100 bps cut
    // Oil price: base is $75. Every $10 above $75 adds ~0.65% to CPI
    const oilImpact = ((oilPriceUSD - 75) / 10) * 0.65;
    const rateCutInflationPassThrough = (-deltaRateBps / 100) * 0.22;
    const projectedYearEndCPI = Number(
      Math.max(3.2, currentCPI + rateCutInflationPassThrough + oilImpact).toFixed(1)
    );

    const realInterestRateGap = Number((newRate - projectedYearEndCPI).toFixed(1));

    // Private sector credit elasticity:
    // Rate cuts stimulate corporate borrowing: 100 bps cut yields ~PKR 280B new credit
    const creditToPrivateSectorGrowthPct = Number(
      (6.5 + (-deltaRateBps / 100) * 2.8).toFixed(1)
    );

    // Exchange rate risk classification
    let exchangeRateRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
    if (realInterestRateGap < 1.0 || oilPriceUSD > 90) {
      exchangeRateRiskLevel = 'Severe';
    } else if (realInterestRateGap < 2.5 || oilPriceUSD > 82) {
      exchangeRateRiskLevel = 'High';
    } else if (realInterestRateGap < 4.0) {
      exchangeRateRiskLevel = 'Moderate';
    }

    // Fiscal deficit calculation
    // Base deficit is -5.9% of GDP.
    // Markup savings reduce deficit:
    const markupFiscalReliefPct = (annualDebtServicingImpactPKR_B / (currentGDP_PKR_T * 1000)) * 100;
    const fbrImpactPct = (fbrTargetAdjustmentPct / 100) * 0.45;
    const psdpCostPct = (psdpAdjustmentPct / 100) * 0.25;

    const projectedFiscalDeficitPctGDP = Number(
      (-5.9 + markupFiscalReliefPct + fbrImpactPct - psdpCostPct).toFixed(2)
    );

    const projectedPrimaryBalancePctGDP = Number(
      (1.5 + fbrImpactPct - psdpCostPct).toFixed(2)
    );

    // Advisory stance & Detailed Macro Rationale
    let mpcAdvisoryStance = 'Prudent Calibrated Easing';
    const recommendationRationale: string[] = [];

    if (deltaRateBps < -150) {
      mpcAdvisoryStance = 'Aggressive Stimulus (Caution Advised)';
      recommendationRationale.push(
        `A steep ${Math.abs(deltaRateBps)} bps cut injects PKR ${annualDebtServicingImpactPKR_B}B into federal coffers but compresses the real rate buffer to +${realInterestRateGap}%.`
      );
      recommendationRationale.push(
        'Risk of stimulating import demand ahead of industrial export capacity, potentially exerting pressure on SBP FX reserves.'
      );
      recommendationRationale.push(
        'Appropriate only if global Brent crude remains securely below $75/bbl and FBR revenue targets are exceeded.'
      );
    } else if (deltaRateBps < 0) {
      mpcAdvisoryStance = 'Optimal SBP Baseline (Recommended)';
      recommendationRationale.push(
        `A measured cut of ${Math.abs(deltaRateBps)} bps reduces the policy rate to ${newRate.toFixed(2)}%, saving PKR ${annualDebtServicingImpactPKR_B}B in annual domestic sovereign mark-up.`
      );
      recommendationRationale.push(
        `Maintains a healthy forward-looking real positive interest rate of +${realInterestRateGap}%, comfortably above the SBP medium-term inflation target band (5-7%).`
      );
      recommendationRationale.push(
        'Stimulates private sector investment and textile/manufacturing credit without endangering exchange rate stability.'
      );
    } else if (deltaRateBps === 0) {
      mpcAdvisoryStance = 'Cautious Hold / Watchful Waiting';
      recommendationRationale.push(
        `Holding the policy rate at ${newRate.toFixed(2)}% preserves a robust +${realInterestRateGap}% real interest rate buffer against unforeseen commodity or geopolitical shocks.`
      );
      recommendationRationale.push(
        'However, maintaining rates unchanged foregoes immediate debt-servicing relief for the federal budget.'
      );
    } else {
      mpcAdvisoryStance = 'Pre-emptive Tightening / Shock Defense';
      recommendationRationale.push(
        `Hiking rates by +${deltaRateBps} bps to ${newRate.toFixed(2)}% defends the Pakistani Rupee against external commodity or exchange rate pressures.`
      );
      recommendationRationale.push(
        `Increases annual federal debt mark-up costs by PKR ${Math.abs(annualDebtServicingImpactPKR_B)}B, narrowing fiscal space for development spending.`
      );
    }

    return {
      deltaRateBps,
      newRate,
      annualDebtServicingImpactPKR_B,
      projectedYearEndCPI,
      realInterestRateGap,
      creditToPrivateSectorGrowthPct,
      exchangeRateRiskLevel,
      projectedFiscalDeficitPctGDP,
      projectedPrimaryBalancePctGDP,
      mpcAdvisoryStance,
      recommendationRationale,
    };
  }, [
    currentRate,
    currentCPI,
    currentGDP_PKR_T,
    deltaRateBps,
    fbrTargetAdjustmentPct,
    psdpAdjustmentPct,
    oilPriceUSD,
    remittanceGrowthPct,
  ]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Interactive Econometric Engine</span>
              <span>·</span>
              <span className="font-mono text-emerald-400">SBP MPC & MoF Fiscal Policy Simulator</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Monetary & Fiscal Policy Decision Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Model interest rate cuts or hikes, observe the exact macroeconomic reasons and trade-offs,
              and calculate federal sovereign debt mark-up savings vs inflation transmission in real-time.
            </p>
          </div>

          {/* Quick Scenario Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 mr-1">Scenarios:</span>
            <button
              onClick={() => applyPreset('calibrated')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-medium transition-colors cursor-pointer"
            >
              SBP Baseline (-100 bps)
            </button>
            <button
              onClick={() => applyPreset('aggressive')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 font-medium transition-colors cursor-pointer"
            >
              Growth Stimulus (-200 bps)
            </button>
            <button
              onClick={() => applyPreset('pause')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors cursor-pointer"
            >
              Hawkish Pause (0 bps)
            </button>
            <button
              onClick={() => applyPreset('oilShock')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 font-medium transition-colors cursor-pointer"
            >
              Oil Shock (+100 bps)
            </button>
          </div>
        </div>

        {/* Live Simulator Transmission Outcome Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Simulated SBP Rate</div>
            <div className="text-3xl font-extrabold font-mono text-slate-100 tabular-nums">
              {simulation.newRate.toFixed(2)}%
            </div>
            <div className="text-xs text-emerald-400 mt-1 font-mono">
              Delta: {simulation.deltaRateBps > 0 ? `+${simulation.deltaRateBps}` : simulation.deltaRateBps} bps
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Federal Markup Impact</div>
            <div
              className={`text-2xl font-extrabold font-mono tabular-nums ${
                simulation.annualDebtServicingImpactPKR_B >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {simulation.annualDebtServicingImpactPKR_B >= 0
                ? `+PKR ${simulation.annualDebtServicingImpactPKR_B} B`
                : `-PKR ${Math.abs(simulation.annualDebtServicingImpactPKR_B)} B`}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {simulation.annualDebtServicingImpactPKR_B >= 0 ? 'Annual Treasury Savings' : 'Additional Markup Cost'}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Projected Real Rate Gap</div>
            <div className="text-2xl font-extrabold font-mono text-cyan-400 tabular-nums">
              +{simulation.realInterestRateGap}%
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              Projected CPI: {simulation.projectedYearEndCPI}%
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4">
            <div className="text-xs text-slate-400 mb-1">Projected Fiscal Deficit</div>
            <div className="text-2xl font-extrabold font-mono text-slate-200 tabular-nums">
              {simulation.projectedFiscalDeficitPctGDP}%
            </div>
            <div className="text-xs text-emerald-400 mt-1 font-mono">
              Primary: +{simulation.projectedPrimaryBalancePctGDP}% of GDP
            </div>
          </div>
        </div>
      </div>

      {/* Main Two Column Controller & Outcome Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Policy Sliders (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  Policy Levers & Exogenous Macro Assumptions
                </h3>
              </div>
              <button
                onClick={() => applyPreset('calibrated')}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Defaults
              </button>
            </div>

            {/* Lever 1: SBP Policy Rate Adjustment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-200">
                  1. SBP Key Policy Rate Delta:
                </label>
                <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                  {deltaRateBps > 0 ? `+${deltaRateBps}` : deltaRateBps} bps (New Rate: {(currentRate + deltaRateBps / 100).toFixed(2)}%)
                </span>
              </div>
              <input
                type="range"
                min={-300}
                max={200}
                step={25}
                value={deltaRateBps}
                onChange={e => setDeltaRateBps(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-300 bps</span>
                <span>-150 bps</span>
                <span>0 (Hold)</span>
                <span>+200 bps</span>
              </div>
            </div>

            {/* Lever 2: FBR Tax Mobilization Target Adjustment */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-200">
                  2. FBR Tax Revenue Growth Target:
                </label>
                <span className="font-mono font-bold text-slate-200 text-sm tabular-nums">
                  {fbrTargetAdjustmentPct > 0 ? `+${fbrTargetAdjustmentPct}` : fbrTargetAdjustmentPct}%
                </span>
              </div>
              <input
                type="range"
                min={-5}
                max={25}
                step={1}
                value={fbrTargetAdjustmentPct}
                onChange={e => setFbrTargetAdjustmentPct(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-5% (Revenue Shortfall)</span>
                <span>+10% (Target Baseline)</span>
                <span>+25% (Broadened Net)</span>
              </div>
            </div>

            {/* Lever 3: PSDP Infrastructure Spending */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-200">
                  3. PSDP Development Outlay Growth:
                </label>
                <span className="font-mono font-bold text-cyan-400 text-sm tabular-nums">
                  {psdpAdjustmentPct > 0 ? `+${psdpAdjustmentPct}` : psdpAdjustmentPct}%
                </span>
              </div>
              <input
                type="range"
                min={-20}
                max={30}
                step={5}
                value={psdpAdjustmentPct}
                onChange={e => setPsdpAdjustmentPct(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-20% (Austerity)</span>
                <span>+10% (Planned)</span>
                <span>+30% (Aggressive Capex)</span>
              </div>
            </div>

            {/* Lever 4: Global Brent Crude Oil Price */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-200">
                  4. Global Brent Crude Oil Benchmark:
                </label>
                <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">
                  ${oilPriceUSD} / barrel
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={110}
                step={5}
                value={oilPriceUSD}
                onChange={e => setOilPriceUSD(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>$60 (Subdued)</span>
                <span>$75 (Base Model)</span>
                <span>$110 (Geopolitical Shock)</span>
              </div>
            </div>

            {/* Lever 5: Worker Remittances Growth */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-medium text-slate-200">
                  5. Worker Remittances Growth (YoY):
                </label>
                <span className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                  +{remittanceGrowthPct}%
                </span>
              </div>
              <input
                type="range"
                min={-5}
                max={20}
                step={1}
                value={remittanceGrowthPct}
                onChange={e => setRemittanceGrowthPct(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>-5%</span>
                <span>+8% (Trend)</span>
                <span>+20% (Surge)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SBP MPC Advisory & Econometric Rationale (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">
                  SBP MPC Advisory & Transmission Rationale
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {simulation.mpcAdvisoryStance}
              </span>
            </div>

            {/* Why This Rate Decision? (Exact Reason Explainer) */}
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Official Analytical Reason & SBP Justification
              </div>
              <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
                {simulation.recommendationRationale.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Macroeconomic Stress Meters */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                <div className="text-slate-400 text-[11px] mb-1">Exchange Rate Vulnerability</div>
                <div
                  className={`text-base font-bold font-mono ${
                    simulation.exchangeRateRiskLevel === 'Low'
                      ? 'text-emerald-400'
                      : simulation.exchangeRateRiskLevel === 'Moderate'
                      ? 'text-sky-400'
                      : simulation.exchangeRateRiskLevel === 'High'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {simulation.exchangeRateRiskLevel} Risk
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Based on real rate buffer and oil bill sensitivity
                </p>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                <div className="text-slate-400 text-[11px] mb-1">Private Credit Expansion</div>
                <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                  +{simulation.creditToPrivateSectorGrowthPct}% YoY
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Manufacturing borrowing stimulus elasticity
                </p>
              </div>
            </div>

            {/* IMF Extended Fund Facility Compatibility Check */}
            <div className="bg-slate-950/70 border border-slate-800/90 rounded-lg p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  IMF $7B EFF Compliance Assessment
                </span>
                <span className="text-[11px] font-mono text-emerald-400">Compliant</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Primary balance of <span className="text-emerald-400 font-mono">+{simulation.projectedPrimaryBalancePctGDP}%</span> meets the &gt;1.5% EFF threshold. Positive real rate (+{simulation.realInterestRateGap}%) satisfies monetary policy performance criteria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
