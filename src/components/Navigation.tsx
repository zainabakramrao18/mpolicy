import React from 'react';
import { ArrowDownRight, ArrowUpRight, BarChart3, Download, FileText, Landmark, SlidersHorizontal, TrendingDown } from 'lucide-react';

export type ActiveTab = 'monetary' | 'fiscal' | 'inflation' | 'historical' | 'simulator' | 'reports';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentRate: number;
  currentCPI: number;
  onQuickExport: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  currentRate,
  currentCPI,
  onQuickExport,
}) => {
  const realRate = Number((currentRate - currentCPI).toFixed(1));

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand title, single line text element */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0">
            SBP
          </div>
          <button
            onClick={() => onTabChange('monetary')}
            className="text-left group cursor-pointer"
          >
            <span className="text-base font-bold tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors whitespace-nowrap">
              PolicyPulse Pakistan
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 nav links, 1-2 word labels, single line */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <button
            onClick={() => onTabChange('monetary')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'monetary'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Monetary Policy & MPC
          </button>
          <button
            onClick={() => onTabChange('fiscal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'fiscal'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Fiscal Operations
          </button>
          <button
            onClick={() => onTabChange('inflation')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'inflation'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Inflation Dynamics
          </button>
          <button
            onClick={() => onTabChange('historical')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'historical'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Macro History
          </button>
          <button
            onClick={() => onTabChange('simulator')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Policy Simulator
          </button>
          <button
            onClick={() => onTabChange('reports')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Analytical Briefings
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Corridor Quick Ticker */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-md text-xs font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400 text-[11px]">Policy Rate:</span>
              <span className="font-bold text-emerald-400 tabular-nums">{currentRate.toFixed(2)}%</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400 text-[11px]">CPI:</span>
              <span className="font-bold text-slate-200 tabular-nums">{currentCPI.toFixed(1)}%</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="text-slate-400 text-[11px]">Real Rate:</span>
              <span className="font-bold text-cyan-400 tabular-nums">+{realRate}%</span>
            </div>
          </div>

          <button
            onClick={onQuickExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            title="Download or Print Executive Macro Briefing"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Export Brief</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Bar for small screens */}
      <div className="flex lg:hidden overflow-x-auto gap-2 pt-2.5 mt-2 border-t border-slate-800/60 text-xs">
        <button
          onClick={() => onTabChange('monetary')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            activeTab === 'monetary' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Monetary Policy
        </button>
        <button
          onClick={() => onTabChange('fiscal')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            activeTab === 'fiscal' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Fiscal
        </button>
        <button
          onClick={() => onTabChange('inflation')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            activeTab === 'inflation' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Inflation
        </button>
        <button
          onClick={() => onTabChange('historical')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            activeTab === 'historical' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
          }`}
        >
          History
        </button>
        <button
          onClick={() => onTabChange('simulator')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            activeTab === 'simulator' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Simulator
        </button>
        <button
          onClick={() => onTabChange('reports')}
          className={`px-2.5 py-1 whitespace-nowrap rounded ${
            activeTab === 'reports' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'
          }`}
        >
          Reports
        </button>
      </div>
    </header>
  );
};
