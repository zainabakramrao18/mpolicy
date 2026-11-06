import React, { useState } from 'react';

export interface BarItem {
  id: string;
  label: string;
  value: number;
  secondaryValue?: number;
  weight?: number;
  color?: string;
  category?: string;
  subtext?: string;
}

interface InteractiveBarChartProps {
  items: BarItem[];
  title?: string;
  subtitle?: string;
  unit?: string;
  maxValue?: number;
  secondaryLabel?: string;
  primaryLabel?: string;
  showZeroLine?: boolean;
}

export const InteractiveBarChart: React.FC<InteractiveBarChartProps> = ({
  items,
  title,
  subtitle,
  unit = '%',
  maxValue,
  secondaryLabel,
  primaryLabel = 'Rate',
  showZeroLine = true,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const values = items.map(i => i.value);
  const maxVal = maxValue !== undefined ? maxValue : Math.max(...values, 10);
  const minVal = showZeroLine ? Math.min(0, ...values) : Math.min(...values);

  const range = maxVal - minVal || 1;

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800/90 rounded-lg p-4">
      {(title || subtitle) && (
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60">
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {secondaryLabel && (
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
                {primaryLabel}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block" />
                {secondaryLabel}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => {
          const isNegative = item.value < 0;
          const positiveWidth = isNegative
            ? 0
            : Math.min(100, Math.max(2, (item.value / maxVal) * 100));
          const negativeWidth = isNegative
            ? Math.min(100, (Math.abs(item.value) / Math.abs(minVal || 1)) * 50)
            : 0;

          const defaultColor = item.value > 15
            ? '#ef4444'
            : item.value > 8
            ? '#f59e0b'
            : item.value < 0
            ? '#06b6d4'
            : '#10b981';

          const barColor = item.color || defaultColor;
          const isHovered = hoveredId === item.id;

          return (
            <div
              key={item.id}
              className={`p-2 rounded transition-colors ${
                isHovered ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'
              }`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-200">{item.label}</span>
                  {item.weight !== undefined && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      (Weight: {item.weight}%)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 font-mono font-medium tabular-nums text-xs">
                  {item.secondaryValue !== undefined && (
                    <span className="text-slate-400 line-through text-[11px]">
                      {item.secondaryValue > 0 ? `+${item.secondaryValue}` : item.secondaryValue}
                      {unit}
                    </span>
                  )}
                  <span
                    className={
                      item.value < 0
                        ? 'text-cyan-400'
                        : item.value > 10
                        ? 'text-amber-400 font-semibold'
                        : 'text-emerald-400'
                    }
                  >
                    {item.value > 0 ? `+${item.value}` : item.value}
                    {unit}
                  </span>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden flex items-center">
                {isNegative ? (
                  <div className="w-full flex justify-end">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${negativeWidth}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${positiveWidth}%`,
                      backgroundColor: barColor,
                    }}
                  />
                )}
              </div>

              {item.subtext && (
                <div className="text-[11px] text-slate-400 mt-1 pl-0.5 line-clamp-1">
                  {item.subtext}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
