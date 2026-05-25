'use client';

import React, { useState, useCallback } from 'react';

const THUMB_SIZE = 18;
const TRACK_INSET = THUMB_SIZE / 2;

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  valueMin: number;
  valueMax: number;
  onChange: (mn: number, mx: number) => void;
  theme?: 'light' | 'dark';
}

/** Position thumb / fill along track accounting for horizontal inset */
function trackPosition(percent: number) {
  return `calc(${TRACK_INSET}px + (100% - ${THUMB_SIZE}px) * ${percent / 100})`;
}

export function PriceRangeSlider({
  min,
  max,
  step = 10,
  valueMin,
  valueMax,
  onChange,
  theme = 'light',
}: PriceRangeSliderProps) {
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);
  const isDark = theme === 'dark';
  const range = max - min || 1;

  const leftPct = ((valueMin - min) / range) * 100;
  const rightPct = ((valueMax - min) / range) * 100;

  const minGap = Math.max(step, Math.round(range * 0.02));

  const handleMinChange = useCallback(
    (raw: number) => {
      const next = Math.min(raw, valueMax - minGap);
      onChange(Math.max(min, next), valueMax);
    },
    [min, valueMax, minGap, onChange]
  );

  const handleMaxChange = useCallback(
    (raw: number) => {
      const next = Math.max(raw, valueMin + minGap);
      onChange(valueMin, Math.min(max, next));
    },
    [max, valueMin, minGap, onChange]
  );

  const rangeInputClass =
    'absolute inset-0 w-full h-full appearance-none bg-transparent cursor-pointer ' +
    '[&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-10 ' +
    '[&::-moz-range-track]:appearance-none [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:h-10 ' +
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[22px] [&::-webkit-slider-thumb]:h-[22px] ' +
    '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:border-0 ' +
    '[&::-webkit-slider-thumb]:shadow-none [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing ' +
    '[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[22px] [&::-moz-range-thumb]:h-[22px] ' +
    '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-0 ' +
    '[&::-moz-range-thumb]:cursor-grab';

  const thumbVisualClass = isDark
    ? 'bg-charcoal border-2 border-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.35)]'
    : 'bg-charcoal border-[2.5px] border-[#FAF9F6] shadow-[0_2px_10px_rgba(28,26,23,0.18)]';

  const activeRing = isDark ? 'ring-2 ring-red-400/50 scale-110' : 'ring-2 ring-[#B58D7C]/45 scale-110';

  return (
    <div className="flex flex-col gap-3 select-none">
      {/* Selected range */}
      <div
        className={`flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-sand/80 border border-charcoal/[0.06]'
        }`}
      >
        <span className={`text-xs font-sans font-bold tabular-nums ${isDark ? 'text-white' : 'text-charcoal'}`}>
          ৳{valueMin.toLocaleString('en-IN')}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-stone-400'}`}>
          to
        </span>
        <span className={`text-xs font-sans font-bold tabular-nums ${isDark ? 'text-white' : 'text-charcoal'}`}>
          ৳{valueMax.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Slider track */}
      <div className="relative h-10 w-full">
        {/* Background track */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full ${
            isDark ? 'bg-white/10' : 'bg-stone-200/90'
          }`}
          style={{ left: TRACK_INSET, right: TRACK_INSET }}
        />

        {/* Active range fill */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full ${
            isDark ? 'bg-red-500' : 'bg-charcoal'
          }`}
          style={{
            left: trackPosition(leftPct),
            right: `calc(${TRACK_INSET}px + (100% - ${THUMB_SIZE}px) * ${(100 - rightPct) / 100})`,
          }}
        />

        {/* Custom thumb visuals */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none transition-transform duration-150 ${thumbVisualClass} ${
            activeThumb === 'min' ? activeRing : ''
          }`}
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            left: trackPosition(leftPct),
          }}
        />
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full pointer-events-none transition-transform duration-150 ${thumbVisualClass} ${
            activeThumb === 'max' ? activeRing : ''
          }`}
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            left: trackPosition(rightPct),
          }}
        />

        {/* Interactive range inputs (invisible thumbs) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          onPointerDown={() => setActiveThumb('min')}
          onPointerUp={() => setActiveThumb(null)}
          onPointerCancel={() => setActiveThumb(null)}
          className={rangeInputClass}
          style={{ zIndex: activeThumb === 'min' ? 5 : 3 }}
          aria-label="Minimum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueMin}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          onPointerDown={() => setActiveThumb('max')}
          onPointerUp={() => setActiveThumb(null)}
          onPointerCancel={() => setActiveThumb(null)}
          className={rangeInputClass}
          style={{ zIndex: activeThumb === 'max' ? 5 : 4 }}
          aria-label="Maximum price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={valueMax}
        />
      </div>

      {/* Catalog bounds */}
      <div className="flex justify-between px-0.5">
        <span className={`text-[9px] font-sans font-medium tabular-nums ${isDark ? 'text-white/35' : 'text-stone-400'}`}>
          ৳{min.toLocaleString('en-IN')}
        </span>
        <span className={`text-[9px] font-sans font-medium tabular-nums ${isDark ? 'text-white/35' : 'text-stone-400'}`}>
          ৳{max.toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  );
}

export default PriceRangeSlider;
