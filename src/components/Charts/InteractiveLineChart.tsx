import React, { useId, useState } from 'react';

export interface DataSeries {
  key: string;
  name: string;
  color: string;
  axis?: 'left' | 'right';
  unit?: string;
  strokeWidth?: number;
  dashed?: boolean;
}

interface InteractiveLineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  xLabelKey?: string;
  series: DataSeries[];
  height?: number;
  title?: string;
  subtitle?: string;
  leftUnit?: string;
  rightUnit?: string;
  enableZeroLine?: boolean;
}

export const InteractiveLineChart: React.FC<InteractiveLineChartProps> = ({
  data,
  xKey,
  xLabelKey = xKey,
  series,
  height = 340,
  title,
  subtitle,
  leftUnit = '%',
  rightUnit,
  enableZeroLine = false,
}) => {
  const chartId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-slate-800 rounded-lg bg-slate-900/50 text-slate-500 text-sm">
        No time-series data available
      </div>
    );
  }

  const leftSeries = series.filter(s => s.axis !== 'right');
  const rightSeries = series.filter(s => s.axis === 'right');
  const hasDualAxis = rightSeries.length > 0;

  // Calculate Left Y min and max
  let leftMin = Infinity;
  let leftMax = -Infinity;
  leftSeries.forEach(s => {
    data.forEach(d => {
      const v = Number(d[s.key]);
      if (!isNaN(v)) {
        if (v < leftMin) leftMin = v;
        if (v > leftMax) leftMax = v;
      }
    });
  });

  if (leftMin === Infinity) {
    leftMin = 0;
    leftMax = 10;
  }
  if (enableZeroLine && leftMin > 0) leftMin = 0;
  // Pad bounds
  const leftRange = leftMax - leftMin || 1;
  const yLeftMin = Math.floor(leftMin - leftRange * 0.08);
  const yLeftMax = Math.ceil(leftMax + leftRange * 0.08);

  // Calculate Right Y min and max
  let rightMin = Infinity;
  let rightMax = -Infinity;
  if (hasDualAxis) {
    rightSeries.forEach(s => {
      data.forEach(d => {
        const v = Number(d[s.key]);
        if (!isNaN(v)) {
          if (v < rightMin) rightMin = v;
          if (v > rightMax) rightMax = v;
        }
      });
    });
    if (rightMin === Infinity) {
      rightMin = 0;
      rightMax = 10;
    }
  }
  const rightRange = (rightMax - rightMin) || 1;
  const yRightMin = Math.floor(rightMin - rightRange * 0.08);
  const yRightMax = Math.ceil(rightMax + rightRange * 0.08);

  // Layout coordinates inside SVG
  const paddingLeft = 56;
  const paddingRight = hasDualAxis ? 56 : 24;
  const paddingTop = 28;
  const paddingBottom = 40;
  const svgWidth = 860;
  const svgHeight = height;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + plotWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * plotWidth;
  };

  const getLeftY = (val: number) => {
    const ratio = (val - yLeftMin) / (yLeftMax - yLeftMin || 1);
    return paddingTop + plotHeight - ratio * plotHeight;
  };

  const getRightY = (val: number) => {
    const ratio = (val - yRightMin) / (yRightMax - yRightMin || 1);
    return paddingTop + plotHeight - ratio * plotHeight;
  };

  // Build grid ticks (5 horizontal lines)
  const ticksCount = 5;
  const leftTicks = Array.from({ length: ticksCount }, (_, i) => {
    const val = yLeftMin + (i / (ticksCount - 1)) * (yLeftMax - yLeftMin);
    return {
      value: Number(val.toFixed(1)),
      y: getLeftY(val),
    };
  });

  const rightTicks = hasDualAxis
    ? Array.from({ length: ticksCount }, (_, i) => {
        const val = yRightMin + (i / (ticksCount - 1)) * (yRightMax - yRightMin);
        return {
          value: Number(val.toFixed(1)),
          y: getRightY(val),
        };
      })
    : [];

  // Generate paths
  const seriesPaths = series.map(s => {
    const isRight = s.axis === 'right';
    const getYVal = isRight ? getRightY : getLeftY;

    const points = data.map((d, i) => {
      const x = getX(i);
      const val = Number(d[s.key]);
      const y = isNaN(val) ? getYVal(0) : getYVal(val);
      return `${x},${y}`;
    });

    const d = points.length > 0 ? `M ${points.join(' L ')}` : '';
    return { ...s, pathD: d };
  });

  // Calculate visible X labels
  const xStep = Math.max(1, Math.floor(data.length / 8));
  const xLabels = data
    .map((d, i) => ({ text: d[xLabelKey] || d[xKey], x: getX(i), index: i }))
    .filter((_, i) => i % xStep === 0 || i === data.length - 1);

  // Active hover data point
  const activeData = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800/90 rounded-lg p-4 transition-colors">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-2 border-b border-slate-800/60 gap-2">
          <div>
            {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            {series.map(s => (
              <div key={s.key} className="flex items-center gap-1.5 text-slate-300">
                <span
                  className="w-3 h-0.5 rounded-full"
                  style={{
                    backgroundColor: s.color,
                    borderTop: s.dashed ? '1px dashed' : 'none',
                  }}
                />
                <span className="text-slate-400">{s.name}</span>
                {s.axis === 'right' && (
                  <span className="text-[10px] text-slate-500 font-mono">({rightUnit || 'R'})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible font-mono text-[11px]"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;
            if (mouseX < paddingLeft || mouseX > svgWidth - paddingRight) {
              setHoverIndex(null);
              return;
            }
            const ratio = (mouseX - paddingLeft) / plotWidth;
            const idx = Math.round(ratio * (data.length - 1));
            const clamped = Math.max(0, Math.min(data.length - 1, idx));
            setHoverIndex(clamped);
          }}
        >
          <defs>
            {series.map(s => (
              <linearGradient
                key={`${chartId}-grad-${s.key}`}
                id={`${chartId}-grad-${s.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Horizontal Grid lines */}
          {leftTicks.map((t, idx) => (
            <g key={`grid-${idx}`}>
              <line
                x1={paddingLeft}
                y1={t.y}
                x2={svgWidth - paddingRight}
                y2={t.y}
                stroke={t.value === 0 ? '#475569' : '#1e293b'}
                strokeWidth={t.value === 0 ? 1.5 : 1}
                strokeDasharray={t.value === 0 ? undefined : '3 3'}
              />
              <text
                x={paddingLeft - 8}
                y={t.y + 4}
                textAnchor="end"
                className="fill-slate-500 text-[10px] tabular-nums"
              >
                {t.value}
                {leftUnit}
              </text>
            </g>
          ))}

          {/* Right Y axis ticks if dual-axis */}
          {hasDualAxis &&
            rightTicks.map((t, idx) => (
              <text
                key={`rgrid-${idx}`}
                x={svgWidth - paddingRight + 8}
                y={t.y + 4}
                textAnchor="start"
                className="fill-slate-500 text-[10px] tabular-nums"
              >
                {t.value}
                {rightUnit}
              </text>
            ))}

          {/* Render Series Paths */}
          {seriesPaths.map(s => (
            <path
              key={`path-${s.key}`}
              d={s.pathD}
              fill="none"
              stroke={s.color}
              strokeWidth={s.strokeWidth || 2}
              strokeDasharray={s.dashed ? '4 4' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* X axis labels */}
          {xLabels.map((lbl, idx) => (
            <text
              key={`lbl-${idx}`}
              x={lbl.x}
              y={svgHeight - 12}
              textAnchor="middle"
              className="fill-slate-400 text-[10px]"
            >
              {lbl.text}
            </text>
          ))}

          {/* Crosshair indicator when hovering */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={paddingTop + plotHeight}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="2 2"
              />

              {series.map(s => {
                const isRight = s.axis === 'right';
                const getYVal = isRight ? getRightY : getLeftY;
                const val = Number(data[hoverIndex][s.key]);
                const cy = isNaN(val) ? getYVal(0) : getYVal(val);
                const cx = getX(hoverIndex);

                return (
                  <circle
                    key={`point-${s.key}`}
                    cx={cx}
                    cy={cy}
                    r={4.5}
                    fill={s.color}
                    stroke="#0b1120"
                    strokeWidth={2}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Hover Floating Details Card */}
        {activeData && (
          <div
            className="absolute top-2 bg-slate-950/95 border border-slate-700/80 rounded px-2.5 py-1.5 shadow-xl text-xs pointer-events-none z-10 transition-all duration-75"
            style={{
              left: `${Math.min(
                Math.max(16, (getX(hoverIndex!) / svgWidth) * 100),
                76
              )}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1 text-[11px] font-mono">
              {activeData[xLabelKey] || activeData[xKey]}
            </div>
            <div className="space-y-0.5">
              {series.map(s => {
                const val = activeData[s.key];
                return (
                  <div key={s.key} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: s.color }} />
                      {s.name}:
                    </span>
                    <span className="font-mono font-medium text-slate-100 tabular-nums">
                      {val !== undefined ? `${val}${s.unit || leftUnit}` : 'N/A'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
