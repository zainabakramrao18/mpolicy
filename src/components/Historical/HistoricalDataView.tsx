import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Coins,
  Download,
  Filter,
  Landmark,
  Search,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { HistoricalMacroRecord } from '../../types/economy';
import { InteractiveLineChart } from '../Charts/InteractiveLineChart';

interface HistoricalDataViewProps {
  macroSeries: HistoricalMacroRecord[];
}

export const HistoricalDataView: React.FC<HistoricalDataViewProps> = ({ macroSeries }) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedChartMode, setSelectedChartMode] = useState<'reserves' | 'remittances' | 'exchangeRate' | 'trade'>('reserves');

  const filteredRecords = useMemo(() => {
    return macroSeries.filter(r => {
      return (
        r.displayDate.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.date.includes(searchFilter)
      );
    });
  }, [macroSeries, searchFilter]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Display Date',
      'SBP Policy Rate (%)',
      'CPI YoY (%)',
      'SBP FX Reserves (USD B)',
      'Total FX Reserves (USD B)',
      'PKR / USD Interbank',
      'Current Account (USD M)',
      'Remittances (USD M)',
      'Exports (USD M)',
      'Imports (USD M)',
    ];

    const rows = macroSeries.map(r => [
      r.date,
      r.displayDate,
      r.policyRate,
      r.cpiYoY,
      r.sbpReservesUSD_B,
      r.totalReservesUSD_B,
      r.pkrToUSD,
      r.currentAccountUSD_M,
      r.remittancesUSD_M,
      r.exportsUSD_M,
      r.importsUSD_M,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pakistan_macroeconomic_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Indicators Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: SBP FX Reserves */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>SBP Liquid FX Reserves</span>
            <span className="font-mono text-emerald-400">Current</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
              $12.4 B
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +300% from $3.1B
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Import Cover: <span className="text-slate-200 font-semibold">2.8 months</span> (IMF Target: &gt;2.5m)
          </p>
        </div>

        {/* Card 2: Interbank Exchange Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>PKR / USD Exchange Rate</span>
            <span className="font-mono text-slate-400">Interbank</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
              279.8
            </span>
            <span className="text-xs text-slate-400">Stable range</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Narrow spread with open market (~PKR 281.0)
          </p>
        </div>

        {/* Card 3: Monthly Remittances */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Monthly Remittances</span>
            <span className="font-mono text-emerald-400">Inflows</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
              $3.25 B
            </span>
            <span className="text-xs text-slate-400">/ month</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Digitization & banking channels drove +24% YoY surge
          </p>
        </div>

        {/* Card 4: Current Account Balance */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Current Account (Latest)</span>
            <span className="font-mono text-cyan-400">BOP</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
              +$190 M
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Surplus</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Transformed from historic -$17.5B FY22 deficit
          </p>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Macroeconomic Trajectory & Reserve Dynamics
            </h3>
            <p className="text-xs text-slate-400">
              Historical multi-variable dataset (Jan 2023 - Mar 2026)
            </p>
          </div>

          <div className="flex items-center p-0.5 bg-slate-950/80 border border-slate-800 rounded-md text-xs">
            <button
              onClick={() => setSelectedChartMode('reserves')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedChartMode === 'reserves'
                  ? 'bg-slate-800 text-emerald-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FX Reserves
            </button>
            <button
              onClick={() => setSelectedChartMode('remittances')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedChartMode === 'remittances'
                  ? 'bg-slate-800 text-emerald-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Remittances & CAD
            </button>
            <button
              onClick={() => setSelectedChartMode('exchangeRate')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedChartMode === 'exchangeRate'
                  ? 'bg-slate-800 text-emerald-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PKR / USD Interbank
            </button>
            <button
              onClick={() => setSelectedChartMode('trade')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                selectedChartMode === 'trade'
                  ? 'bg-slate-800 text-emerald-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exports vs Imports
            </button>
          </div>
        </div>

        {selectedChartMode === 'reserves' && (
          <InteractiveLineChart
            data={macroSeries}
            xKey="date"
            xLabelKey="displayDate"
            title="Foreign Exchange Reserves (USD Billions)"
            subtitle="Comparing SBP Central Bank Liquid Reserves vs Commercial Banks Net Reserves"
            leftUnit="B"
            series={[
              { key: 'sbpReservesUSD_B', name: 'SBP Liquid Reserves', color: '#10b981', strokeWidth: 2.5, unit: 'B' },
              { key: 'totalReservesUSD_B', name: 'Total System Reserves', color: '#06b6d4', strokeWidth: 2, unit: 'B' },
            ]}
          />
        )}

        {selectedChartMode === 'remittances' && (
          <InteractiveLineChart
            data={macroSeries}
            xKey="date"
            xLabelKey="displayDate"
            title="Worker Remittances vs Current Account Balance (USD Millions)"
            subtitle="Surging overseas remittances provided the cushion to eliminate current account deficits"
            leftUnit="M"
            series={[
              { key: 'remittancesUSD_M', name: 'Worker Remittances', color: '#10b981', strokeWidth: 2, unit: 'M' },
              { key: 'currentAccountUSD_M', name: 'Current Account Balance', color: '#f59e0b', strokeWidth: 2, dashed: true, unit: 'M' },
            ]}
          />
        )}

        {selectedChartMode === 'exchangeRate' && (
          <InteractiveLineChart
            data={macroSeries}
            xKey="date"
            xLabelKey="displayDate"
            title="PKR / USD Interbank Exchange Rate (PKR per 1 USD)"
            subtitle="Stabilization following IMF SBA approval, anti-smuggling crackdowns, and market discipline"
            leftUnit=""
            series={[
              { key: 'pkrToUSD', name: 'PKR / USD Interbank', color: '#38bdf8', strokeWidth: 2.5, unit: '' },
            ]}
          />
        )}

        {selectedChartMode === 'trade' && (
          <InteractiveLineChart
            data={macroSeries}
            xKey="date"
            xLabelKey="displayDate"
            title="Goods Trade Balance: Exports vs Imports (USD Millions)"
            subtitle="Goods imports stabilized around ~$4.8B - $5.1B/month while exports gradually expanded"
            leftUnit="M"
            series={[
              { key: 'importsUSD_M', name: 'Merchandise Imports', color: '#f43f5e', strokeWidth: 2, unit: 'M' },
              { key: 'exportsUSD_M', name: 'Merchandise Exports', color: '#10b981', strokeWidth: 2, unit: 'M' },
            ]}
          />
        )}
      </div>

      {/* Historical Data Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Macroeconomic Time-Series Ledger
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search dates..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40">
                <th className="py-2.5 px-3 font-semibold">Period</th>
                <th className="py-2.5 px-3 text-right font-semibold">Policy Rate</th>
                <th className="py-2.5 px-3 text-right font-semibold">CPI (YoY)</th>
                <th className="py-2.5 px-3 text-right font-semibold">Real Rate</th>
                <th className="py-2.5 px-3 text-right font-semibold">SBP Reserves</th>
                <th className="py-2.5 px-3 text-right font-semibold">PKR / USD</th>
                <th className="py-2.5 px-3 text-right font-semibold">Remittances</th>
                <th className="py-2.5 px-3 text-right font-semibold">Current Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 tabular-nums">
              {filteredRecords.map(r => {
                const realRate = Number((r.policyRate - r.cpiYoY).toFixed(1));
                return (
                  <tr key={r.date} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-slate-200 font-semibold">{r.displayDate}</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-bold">{r.policyRate.toFixed(2)}%</td>
                    <td className="py-2 px-3 text-right text-slate-300">{r.cpiYoY.toFixed(1)}%</td>
                    <td className={`py-2 px-3 text-right font-semibold ${realRate > 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
                      {realRate > 0 ? `+${realRate}` : realRate}%
                    </td>
                    <td className="py-2 px-3 text-right text-slate-200">${r.sbpReservesUSD_B.toFixed(1)}B</td>
                    <td className="py-2 px-3 text-right text-slate-300">{r.pkrToUSD.toFixed(1)}</td>
                    <td className="py-2 px-3 text-right text-emerald-300">${r.remittancesUSD_M.toLocaleString()}M</td>
                    <td className={`py-2 px-3 text-right font-medium ${r.currentAccountUSD_M >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {r.currentAccountUSD_M >= 0 ? `+$${r.currentAccountUSD_M}M` : `-$${Math.abs(r.currentAccountUSD_M)}M`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
