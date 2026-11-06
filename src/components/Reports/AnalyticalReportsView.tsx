import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Filter,
  Layers,
  Printer,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react';
import { EconomicReport } from '../../types/economy';

interface AnalyticalReportsViewProps {
  reports: EconomicReport[];
}

export const AnalyticalReportsView: React.FC<AnalyticalReportsViewProps> = ({ reports }) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Monetary' | 'Fiscal' | 'Inflation' | 'External'>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const filteredReports = reports.filter(r => {
    const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.executiveSummary.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Macroeconomic Research & Intelligence</span>
              <span>·</span>
              <span className="font-mono text-emerald-400">Institutional Dossiers</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              SBP & Ministry of Finance Analytical Reports
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive economic evaluations of interest rate decisions, inflation anatomy, and fiscal sustainability.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            Print / Save PDF Dossier
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
          <div className="flex items-center p-0.5 bg-slate-950/80 border border-slate-800 rounded-md text-xs">
            {(['All', 'Monetary', 'Fiscal', 'Inflation', 'External'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-800 text-emerald-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-950/60 border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Report Index & Active Document View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Reports List (4 cols) */}
        <div className="lg:col-span-4 space-y-3 no-print">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Available Dossiers ({filteredReports.length})
            </div>

            <div className="space-y-2">
              {filteredReports.map(report => {
                const isSelected = activeReport?.id === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/60 shadow-md'
                        : 'bg-slate-950/40 border-slate-800/70 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
                      <span className="text-emerald-400">{report.category}</span>
                      <span>{report.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2 mb-1 leading-snug">
                      {report.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {report.executiveSummary}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                      <span>{report.authorAgency}</span>
                      <span>·</span>
                      <span>{report.readTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Full Document Reading View (8 cols) */}
        <div className="lg:col-span-8">
          {activeReport ? (
            <article className="bg-slate-900/80 border border-slate-800 rounded-lg p-6 lg:p-8 space-y-6 print:bg-white print:border-none print:p-0 print:text-slate-900">
              {/* Document Header */}
              <div className="pb-5 border-b border-slate-800 print:border-slate-300">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 print:text-slate-600 mb-2">
                  <span className="text-emerald-400 print:text-emerald-700 font-bold uppercase tracking-wider">
                    {activeReport.category} Research Briefing
                  </span>
                  <span>·</span>
                  <span>{activeReport.date}</span>
                  <span>·</span>
                  <span>{activeReport.authorAgency}</span>
                  <span>·</span>
                  <span>{activeReport.readTime}</span>
                </div>

                <h1 className="text-xl lg:text-2xl font-bold text-slate-100 print:text-slate-900 leading-tight">
                  {activeReport.title}
                </h1>
              </div>

              {/* Executive Summary Box */}
              <div className="bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-300 p-5 rounded-lg space-y-2">
                <div className="text-xs font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-wider">
                  Executive Summary
                </div>
                <p className="text-sm text-slate-200 print:text-slate-800 leading-relaxed font-normal">
                  {activeReport.executiveSummary}
                </p>
              </div>

              {/* Key Highlights Bulleted Box */}
              <div className="bg-slate-950/40 border border-slate-800/80 print:bg-slate-50 print:border-slate-200 p-5 rounded-lg space-y-3">
                <div className="text-xs font-semibold text-slate-300 print:text-slate-700 uppercase tracking-wider">
                  Key Strategic Highlights
                </div>
                <ul className="space-y-2 text-xs text-slate-300 print:text-slate-800">
                  {activeReport.keyHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Analytical Deep Dive Sections */}
              <div className="space-y-6 pt-2">
                {activeReport.analyticalDeepDive.map((section, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-base font-semibold text-slate-100 print:text-slate-900 border-b border-slate-800/60 print:border-slate-200 pb-1.5">
                      {section.sectionTitle}
                    </h3>
                    <p className="text-xs lg:text-sm text-slate-300 print:text-slate-800 leading-relaxed">
                      {section.body}
                    </p>

                    {/* Data Points Grid if present */}
                    {section.dataPoints && section.dataPoints.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {section.dataPoints.map((dp, dIdx) => (
                          <div
                            key={dIdx}
                            className="bg-slate-950/60 border border-slate-800 print:bg-slate-100 print:border-slate-300 p-3 rounded-md"
                          >
                            <div className="text-[11px] text-slate-400 print:text-slate-600 mb-0.5">{dp.label}</div>
                            <div className="text-sm font-bold font-mono text-emerald-400 print:text-emerald-700 tabular-nums">
                              {dp.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Policy Recommendations */}
              <div className="pt-4 border-t border-slate-800 print:border-slate-300 space-y-3">
                <div className="text-xs font-bold text-slate-200 print:text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400 print:text-emerald-600" />
                  Official Policy Implications & Recommendations
                </div>

                <div className="space-y-2 text-xs text-slate-300 print:text-slate-800 leading-relaxed">
                  {activeReport.policyRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/50 border border-slate-800/80 print:bg-slate-50 print:border-slate-200 rounded-md"
                    >
                      <span className="font-semibold text-slate-200 print:text-slate-900 block mb-0.5">
                        {idx + 1}. Recommendation
                      </span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-10 text-center text-slate-400 text-sm">
              Select an analytical report from the index.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
