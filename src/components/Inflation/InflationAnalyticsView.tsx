import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Layers,
  PieChart,
  Sliders,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { CPIBasketCategory, InflationDataPoint } from '../../types/economy';
import { InteractiveBarChart } from '../Charts/InteractiveBarChart';
import { InteractiveLineChart } from '../Charts/InteractiveLineChart';

interface InflationAnalyticsViewProps {
  inflationData: InflationDataPoint[];
  basketCategories: CPIBasketCategory[];
}

export const InflationAnalyticsView: React.FC<InflationAnalyticsViewProps> = ({
  inflationData,
  basketCategories,
}) => {
  const [timeRange, setTimeRange] = useState<'12M' | '24M' | 'ALL'>('ALL');
  const [selectedMetric, setSelectedMetric] = useState<'headline' | 'components' | 'core' | 'realRate'>('headline');

  // Filtered inflation data based on range
  const filteredData = useMemo(() => {
    if (timeRange === '12M') return inflationData.slice(-12);
    if (timeRange === '24M') return inflationData.slice(-24);
    return inflationData;
  }, [inflationData, timeRange]);

  const latestPoint = inflationData[inflationData.length - 1];
  const peakPoint = inflationData.reduce((prev, current) =>
    prev.headlineCPI > current.headlineCPI ? prev : current
  );

  const netDropFromPeak = Number((peakPoint.headlineCPI - latestPoint.headlineCPI).toFixed(1));

  // Basket categories for bar display
  const categoryBarItems = useMemo(() => {
    return basketCategories.map(cat => ({
      id: cat.id,
      label: cat.category,
      value: cat.currentYoY,
      secondaryValue: cat.previousYoY,
      weight: cat.weight,
      subtext: `${cat.driverNote} (MoM: ${cat.momChange > 0 ? `+${cat.momChange}` : cat.momChange}%)`,
      color: cat.currentYoY < 0 ? '#06b6d4' : cat.currentYoY > 8 ? '#f59e0b' : '#10b981',
    }));
  }, [basketCategories]);

  return (
    <div className="space-y-6">
      {/* Top Headline Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Headline CPI */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Headline CPI (YoY)</span>
            <span className="font-mono text-emerald-400">{latestPoint.displayDate}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
              {latestPoint.headlineCPI.toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Target: 5-7%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            MoM change: <span className="text-slate-200">+{latestPoint.momCPI}%</span> · PBS 2015-16 Base
          </p>
        </div>

        {/* Card 2: Peak-to-Current Disinflation */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Disinflation from Peak</span>
            <span className="font-mono text-slate-400">May 23 vs Now</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              -{netDropFromPeak} pts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Plunged from <span className="text-rose-400 font-semibold">{peakPoint.headlineCPI}%</span> peak
          </p>
        </div>

        {/* Card 3: Core NFNE */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Core Inflation (NFNE)</span>
            <span className="font-mono text-slate-400">Non-Food Non-Energy</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-200 font-mono tabular-nums">
              {latestPoint.coreNFNE.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">YoY</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Trimmed Mean (20%): <span className="text-cyan-400 font-semibold">{latestPoint.trimmedMean}%</span>
          </p>
        </div>

        {/* Card 4: Real Interest Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Ex-Post Real Policy Rate</span>
            <span className="font-mono text-cyan-400">11.0% - {latestPoint.headlineCPI}%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
              +{latestPoint.realInterestRate.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">positive buffer</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Turned positive in Mar 2024 after 2 years of negative rates
          </p>
        </div>
      </div>

      {/* Interactive Controls & Chart Suite */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Inflation Dynamics & Transmission Time-Series
            </h3>
            <p className="text-xs text-slate-400">
              PBS National Consumer Price Index (Urban & Rural consolidated)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Filter */}
            <div className="flex items-center p-0.5 bg-slate-950/80 border border-slate-800 rounded-md text-xs">
              <button
                onClick={() => setSelectedMetric('headline')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedMetric === 'headline'
                    ? 'bg-slate-800 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CPI vs Core
              </button>
              <button
                onClick={() => setSelectedMetric('components')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedMetric === 'components'
                    ? 'bg-slate-800 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Food vs Energy
              </button>
              <button
                onClick={() => setSelectedMetric('realRate')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedMetric === 'realRate'
                    ? 'bg-slate-800 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Real Rate Shift
              </button>
            </div>

            {/* Time range switcher */}
            <div className="flex items-center p-0.5 bg-slate-950/80 border border-slate-800 rounded-md text-xs font-mono">
              {(['12M', '24M', 'ALL'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    timeRange === range
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Chart Rendering */}
        {selectedMetric === 'headline' && (
          <InteractiveLineChart
            data={filteredData}
            xKey="date"
            xLabelKey="displayDate"
            title="Headline CPI vs Core NFNE vs Trimmed Mean (% YoY)"
            subtitle="Comparing broad headline inflation with underlying sticky non-food non-energy trend"
            series={[
              { key: 'headlineCPI', name: 'Headline CPI', color: '#f43f5e', strokeWidth: 2.5, unit: '%' },
              { key: 'coreNFNE', name: 'Core NFNE', color: '#38bdf8', strokeWidth: 2, unit: '%' },
              { key: 'trimmedMean', name: 'Trimmed Mean (20%)', color: '#a855f7', strokeWidth: 1.5, dashed: true, unit: '%' },
            ]}
          />
        )}

        {selectedMetric === 'components' && (
          <InteractiveLineChart
            data={filteredData}
            xKey="date"
            xLabelKey="displayDate"
            title="Key Supply Drivers: Food vs Energy & Utilities vs Transport (% YoY)"
            subtitle="Food and utility prices accounted for the bulk of volatility in 2023-2024"
            series={[
              { key: 'foodCPI', name: 'Food (34.6% weight)', color: '#10b981', strokeWidth: 2, unit: '%' },
              { key: 'energyCPI', name: 'Housing & Energy (23.6%)', color: '#f59e0b', strokeWidth: 2, unit: '%' },
              { key: 'transportCPI', name: 'Transport (5.9%)', color: '#06b6d4', strokeWidth: 2, unit: '%' },
            ]}
          />
        )}

        {selectedMetric === 'realRate' && (
          <InteractiveLineChart
            data={filteredData}
            xKey="date"
            xLabelKey="displayDate"
            title="SBP Policy Rate vs Real Interest Rate (% YoY)"
            subtitle="Highlighting the shift from deeply negative real interest rates (-17%) to strong positive buffer (+6%)"
            enableZeroLine={true}
            series={[
              { key: 'policyRate', name: 'Policy Rate', color: '#10b981', strokeWidth: 2.5, unit: '%' },
              { key: 'headlineCPI', name: 'CPI Inflation', color: '#f43f5e', strokeWidth: 2, unit: '%' },
              { key: 'realInterestRate', name: 'Real Interest Rate (Policy - CPI)', color: '#06b6d4', strokeWidth: 2.5, unit: '%' },
            ]}
          />
        )}
      </div>

      {/* CPI Basket Decomposition & Weight Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Basket Item Contribution Bar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <InteractiveBarChart
            items={categoryBarItems}
            title="CPI Basket Categories (PBS 2015-16 Weights)"
            subtitle="Current YoY inflation rate vs peak crisis rate (strikethrough) by item category"
            unit="%"
            primaryLabel="Current YoY"
            secondaryLabel="Peak 2023 YoY"
            maxValue={30}
          />
        </div>

        {/* Right Column: Inflation Anatomy & Structural Disinflation Insights (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Analytical Breakdown: Why Did Inflation Drop?
            </h4>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3">
                <span className="font-semibold text-emerald-400 block mb-1">
                  1. High Statistical Base Effect
                </span>
                <p className="text-slate-300">
                  During May 2023, the CPI index surged to historic highs following abrupt fuel subsidy
                  withdrawals and currency devaluation. As subsequent monthly increments normalized to
                  0.0% - 0.5% MoM, the annual percentage rate mechanically tumbled into single digits.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3">
                <span className="font-semibold text-emerald-400 block mb-1">
                  2. Agricultural Supply & Bumper Harvests
                </span>
                <p className="text-slate-300">
                  Food carries the largest weight in the CPI basket (34.58%). Record domestic wheat production
                  (29.5M metric tons), bumper cotton output, and timely arrival of winter vegetables directly
                  compressed food inflation from 48.7% down to 2.3% YoY.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3">
                <span className="font-semibold text-emerald-400 block mb-1">
                  3. Exchange Rate Stability (PKR 278-280/USD)
                </span>
                <p className="text-slate-300">
                  Administrative clampdown on illegal hawala/hundi currency exchanges and open market
                  arbitrage anchored the Pakistani Rupee, putting an end to imported pass-through inflation
                  for raw materials, chemicals, and energy.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800/80 rounded-md p-3">
                <span className="font-semibold text-emerald-400 block mb-1">
                  4. Monetary Tightness and Stagnant M2
                </span>
                <p className="text-slate-300">
                  Holding the policy rate at 22.00% for 12 straight months choked off speculative commodity
                  hoarding and compressed real private sector borrowing, reducing demand-pull pressure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
