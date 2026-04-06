"use client";
import { useCallback, useRef } from "react";
import { formatNGN, PRICE_MIN, PRICE_MAX } from "@/lib/products";

interface Props {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

export default function PriceSlider({ min, max, onChange }: Props) {
  const rangeRef = useRef<HTMLDivElement>(null);

  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const handleMin = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), max - 5000);
    onChange(v, max);
  }, [max, onChange]);

  const handleMax = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), min + 5000);
    onChange(min, v);
  }, [min, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between font-dm text-xs text-obsidian/60">
        <span>{formatNGN(min)}</span>
        <span>{formatNGN(max)}</span>
      </div>

      <div ref={rangeRef} className="relative h-1 bg-obsidian/15 rounded-full">
        {/* Active track */}
        <div
          className="absolute h-full bg-amber-tan rounded-full"
          style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5000}
          value={min}
          onChange={handleMin}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: min > PRICE_MAX - 10000 ? 5 : 3 }}
        />
        {/* Max thumb */}
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={5000}
          value={max}
          onChange={handleMax}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
        {/* Visual thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-tan border-2 border-white rounded-full shadow pointer-events-none"
          style={{ left: `calc(${pct(min)}% - 8px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-tan border-2 border-white rounded-full shadow pointer-events-none"
          style={{ left: `calc(${pct(max)}% - 8px)` }}
        />
      </div>
    </div>
  );
}
