export default function Loading() {
  return (
    <div className="min-h-screen bg-off-white pt-[68px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-amber-tan/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-tan animate-spin" />
        </div>
        <p className="font-dm text-[10px] text-charcoal/30 tracking-[0.3em] uppercase">Loading</p>
      </div>
    </div>
  );
}
