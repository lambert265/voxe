"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";

interface ToastData { name: string; size: string; color: string; }

// Simple event bus
type Listener = (data: ToastData) => void;
const listeners: Listener[] = [];
export function triggerCartToast(data: ToastData) {
  listeners.forEach((l) => l(data));
}

export default function CartToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const show = useCallback((data: ToastData) => {
    setToast(data);
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    listeners.push(show);
    return () => { const i = listeners.indexOf(show); if (i > -1) listeners.splice(i, 1); };
  }, [show]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="fixed top-20 right-4 z-[200] flex items-center gap-3 bg-obsidian border border-amber-tan/20 text-linen-cream px-4 py-3.5 shadow-2xl shadow-black/50 max-w-xs w-full rounded-sm"
        >
          <div className="w-8 h-8 bg-amber-tan rounded-full flex items-center justify-center shrink-0">
            <ShoppingBag size={14} className="text-obsidian" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-dm text-xs font-semibold text-linen-cream truncate">{toast.name}</p>
            <p className="font-dm text-[10px] text-linen-cream/45 mt-0.5">{toast.size} · {toast.color} added to cart</p>
          </div>
          <button onClick={() => setToast(null)} className="text-linen-cream/30 hover:text-linen-cream transition-colors shrink-0">
            <X size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
