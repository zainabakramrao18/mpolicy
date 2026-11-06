import React, { useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Filter,
  Flame,
  Info,
  Layers,
  Percent,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { PolicyRateDecision, RateCorridor } from '../../types/economy';
import { InteractiveLineChart } from '../Charts/InteractiveLineChart';

interface MonetaryPolicyViewProps {
  corridor: RateCorridor;
  decisions: PolicyRateDecision[];
  currentCPI: number;
}

export const MonetaryPolicyView: React.FC<MonetaryPolicyViewProps> = ({
  corridor,
  decisions,
  currentCPI,
}) => {
  const [selectedDecision, setSelectedDecision] = useState<PolicyRateDecision | null>(decisions[0]);
  const [filterStance, setFilterStance] = useState<'All' | 'Easing' | 'Tightening'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const realInterestRate = Number((corridor.policyRate - currentCPI).toFixed(1));

  // Filtered decisions list
  const filteredDecisions = useMemo(() => {
    return decisions.filter(d => {
      const matchesStance = filterStance === 'All' || d.stance === filterStance;
      const matchesSearch =
        d.primaryReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.meetingDate.includes(searchQuery) ||
        d.keyDrivers.inflationOutlook.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.keyDrivers.externalAccount.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStance && matchesSearch;
    });
  }, [decisions, filterStance, searchQuery]);

  // Chart data from decisions chronologically
  const chronologicalData = useMemo(() => {
    return [...decisions].reverse().map(d => ({
      date: d.meetingDate.slice(0, 7),
      displayDate: d.meetingDate,
      policyRate: d.newRate,
      cpi: d.cpiAtAnnouncement,
      realRate: d.realRateAtAnnouncement,
      reserves: d.sbpReservesAtTimeUSD_B,
    }));
  }, [decisions]);

  return (
    <div className="space-y-6">
      {/* Top Banner / SBP Policy Rate & Corridor Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Target Policy Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>SBP Policy Target Rate</span>
            <span className="font-mono text-emerald-400">SBP SBP/MPC</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
              {corridor.policyRate.toFixed(2)}%
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -100 bps
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Effective benchmark rate for interbank repo operations
          </p>
        </div>

        {/* Card 2: Interest Rate Corridor */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Interest Rate Corridor</span>
            <span className="font-mono text-slate-400">+/- 100 bps</span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Ceiling (Reverse Repo):</span>
              <span className="font-semibold text-rose-400 tabular-nums">{corridor.reverseRepoCeiling.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Floor (Repo Facility):</span>
              <span className="font-semibold text-sky-400 tabular-nums">{corridor.repoFloor.toFixed(2)}%</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2 relative">
            <div
              className="absolute bg-emerald-400 h-full w-2 rounded-full"
              style={{ left: '50%', transform: 'translateX(-50%)' }}
            />
          </div>
        </div>

        {/* Card 3: Real Interest Rate Buffer */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Real Interest Rate</span>
            <span className="font-mono text-cyan-400">Policy - CPI</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono tabular-nums">
              +{realInterestRate}%
            </span>
            <span className="text-xs text-slate-400">positive buffer</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Protects savings, stabilizes PKR, anchors 5-7% inflation target
          </p>
        </div>

        {/* Card 4: KIBOR & T-Bill Benchmark */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Market Yields (Cut-offs)</span>
            <span className="font-mono text-slate-400">Secondary</span>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">6-Month KIBOR:</span>
              <span className="font-semibold text-slate-100 tabular-nums">{corridor.kibor6M.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">3-Month MTB:</span>
              <span className="font-semibold text-slate-100 tabular-nums">{corridor.mtb3M.toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">10-Year PIB:</span>
              <span className="font-semibold text-slate-100 tabular-nums">{corridor.pib10Y.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Decisions Chronicle & Selected Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SBP MPC Decisions Chronicle (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">
                  MPC Decisions Chronicle
                </h3>
                <p className="text-xs text-slate-400">
                  State Bank of Pakistan Monetary Policy Committee
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {filteredDecisions.length} meetings
              </span>
            </div>

            {/* Filter buttons & Search */}
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search decisions, reasons, drivers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-md border border-slate-800/80 text-xs">
                {(['All', 'Easing', 'Tightening'] as const).map(stance => (
                  <button
                    key={stance}
                    onClick={() => setFilterStance(stance)}
                    className={`flex-1 py-1 text-center font-medium rounded transition-colors cursor-pointer ${
                      filterStance === stance
                        ? 'bg-slate-800 text-emerald-400 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {stance === 'All' ? 'All Meetings' : stance === 'Easing' ? 'Rate Cuts' : 'Rate Hikes'}
                  </button>
                ))}
              </div>
            </div>

            {/* Decisions List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredDecisions.map(d => {
                const isSelected = selectedDecision?.id === d.id;
                const isCut = d.changeBps < 0;
                const isHike = d.changeBps > 0;

                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDecision(d)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/60 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/70 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-slate-200">
                          {d.meetingDate}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          · {d.mpcConsensus}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-mono text-xs font-bold tabular-nums">
                        {isCut && (
                          <span className="text-emerald-400 flex items-center">
                            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                            {d.changeBps} bps
                          </span>
                        )}
                        {isHike && (
                          <span className="text-rose-400 flex items-center">
                            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                            +{d.changeBps} bps
                          </span>
                        )}
                        {d.changeBps === 0 && (
                          <span className="text-slate-400">Hold</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-xs font-mono">
                        <span className="text-slate-400">{d.previousRate.toFixed(2)}%</span>
                        <span className="text-slate-500 mx-1.5">→</span>
                        <span className="text-slate-100 font-bold text-sm">
                          {d.newRate.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        CPI at announcement: <span className="text-slate-300 font-semibold">{d.cpiAtAnnouncement}%</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {d.primaryReason}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In-Depth Decision Rationale Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedDecision ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span>SBP Monetary Policy Committee</span>
                    <span>·</span>
                    <span className="font-mono text-slate-300">{selectedDecision.meetingDate}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium">{selectedDecision.stance} Stance</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100">
                    Decision: {selectedDecision.changeBps < 0 ? 'Cut' : selectedDecision.changeBps > 0 ? 'Hike' : 'Hold'} to {selectedDecision.newRate.toFixed(2)}%
                    <span className="text-sm font-mono font-medium text-slate-400 ml-2">
                      ({selectedDecision.changeBps > 0 ? `+${selectedDecision.changeBps}` : selectedDecision.changeBps} bps)
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono">
                  <div>
                    <div className="text-slate-400 text-[10px]">Real Rate</div>
                    <div className="text-cyan-400 font-bold tabular-nums">
                      {selectedDecision.realRateAtAnnouncement > 0 ? `+${selectedDecision.realRateAtAnnouncement}` : selectedDecision.realRateAtAnnouncement}%
                    </div>
                  </div>
                  <span className="text-slate-700">|</span>
                  <div>
                    <div className="text-slate-400 text-[10px]">SBP Reserves</div>
                    <div className="text-emerald-400 font-bold tabular-nums">
                      ${selectedDecision.sbpReservesAtTimeUSD_B}B
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Decision Reason Box */}
              <div className="bg-slate-950/60 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                  Primary Decision Rationale
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  "{selectedDecision.primaryReason}"
                </p>
              </div>

              {/* 6 Key Macro Driving Factors */}
              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Key Factor Breakdown (Why Rate Was Adjusted)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Factor 1: Inflation Outlook */}
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-md p-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                      <span>1. Inflation Outlook & Expectations</span>
                      <span className="text-emerald-400 font-mono">Target: 5-7%</span>
                    </div>
                    <p className="text-slate-300 leading-normal">
                      {selectedDecision.keyDrivers.inflationOutlook}
                    </p>
                  </div>

                  {/* Factor 2: Real Interest Rate */}
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-md p-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                      <span>2. Forward-Looking Real Rates</span>
                      <span className="text-cyan-400 font-mono">
                        {selectedDecision.realRateAtAnnouncement > 0 ? `+${selectedDecision.realRateAtAnnouncement}%` : `${selectedDecision.realRateAtAnnouncement}%`}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-normal">
                      {selectedDecision.keyDrivers.realInterestRates}
                    </p>
                  </div>

                  {/* Factor 3: External Account */}
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-md p-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                      <span>3. External Sector & BOP</span>
                      <span className="text-emerald-400 font-mono">Reserves & CAD</span>
                    </div>
                    <p className="text-slate-300 leading-normal">
                      {selectedDecision.keyDrivers.externalAccount}
                    </p>
                  </div>

                  {/* Factor 4: Fiscal Consolidation */}
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-md p-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                      <span>4. Fiscal Discipline & IMF Goals</span>
                      <span className="text-emerald-400 font-mono">Primary Surplus</span>
                    </div>
                    <p className="text-slate-300 leading-normal">
                      {selectedDecision.keyDrivers.fiscalDiscipline}
                    </p>
                  </div>

                  {/* Factor 5: Global Commodities */}
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-md p-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                      <span>5. Global Commodity & Energy</span>
                      <span className="text-slate-400 font-mono">Oil & Freight</span>
                    </div>
                    <p className="text-slate-300 leading-normal">
                      {selectedDecision.keyDrivers.commodityPrices}
                    </p>
                  </div>

                  {/* Factor 6: Domestic Demand */}
                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-md p-3">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                      <span>6. Domestic Demand & Credit</span>
                      <span className="text-slate-400 font-mono">LSM & Loans</span>
                    </div>
                    <p className="text-slate-300 leading-normal">
                      {selectedDecision.keyDrivers.demandPressures}
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Statement Excerpt */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Official Monetary Policy Statement (MPS Excerpt)</span>
                  <span className="text-[11px] text-slate-400 font-mono">SBP Governor Statement</span>
                </div>
                <blockquote className="text-xs text-slate-300 italic border-l-2 border-slate-600 pl-3 leading-relaxed">
                  "{selectedDecision.fullStatementExcerpt}"
                </blockquote>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-8 text-center text-slate-400 text-sm">
              Select an MPC meeting from the left column to view detailed economic drivers.
            </div>
          )}

          {/* Policy Rate Trajectory Chart */}
          <InteractiveLineChart
            data={chronologicalData}
            xKey="date"
            xLabelKey="date"
            title="SBP Policy Rate vs Headline Inflation & Real Rate (Chronicle)"
            subtitle="Historical timeline of interest rate decisions, inflation outturns, and real policy rates"
            series={[
              {
                key: 'policyRate',
                name: 'SBP Policy Rate',
                color: '#10b981',
                strokeWidth: 2.5,
                unit: '%',
              },
              {
                key: 'cpi',
                name: 'CPI Inflation',
                color: '#f43f5e',
                strokeWidth: 2,
                unit: '%',
              },
              {
                key: 'realRate',
                name: 'Real Interest Rate',
                color: '#06b6d4',
                dashed: true,
                strokeWidth: 1.5,
                unit: '%',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};
