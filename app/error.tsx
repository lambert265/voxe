"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="min-h-screen bg-off-white flex flex-col items-center justify-center text-center px-6">
      <p className="font-playfair text-[clamp(5rem,15vw,10rem)] leading-none text-obsidian/5 select-none">!</p>
      <h1 className="font-playfair text-3xl text-charcoal -mt-4 mb-3">Something went wrong</h1>
      <p className="font-dm text-charcoal/45 text-sm max-w-xs mb-10 leading-relaxed">
        An unexpected error occurred. Try refreshing or head back to the shop.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-10 py-4 bg-amber-tan text-obsidian font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:bg-obsidian hover:text-linen-cream transition-colors duration-300"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-10 py-4 border border-charcoal/20 text-charcoal font-dm font-semibold text-[11px] tracking-[0.2em] uppercase hover:border-amber-tan hover:text-amber-tan transition-colors duration-300"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
