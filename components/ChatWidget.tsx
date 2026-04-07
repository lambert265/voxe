"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Minimize2 } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_REPLIES = [
  "Track my order",
  "Sizing help",
  "Delivery info",
  "Payment options",
];

const WELCOME: Message = {
  role: "assistant",
  content: "Welcome to VOXE.\nTake your time. What do you need?",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setShowQuick(false);
    const userMsg: Message = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const { reply } = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Hit us at hello@voxe.com — they'll sort you out." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[340px] bg-[#0A0A0A] border border-amber-tan/20 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 flex flex-col"
            style={{ height: "480px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-tan/10 bg-[#0D0B06] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-tan flex items-center justify-center">
                  <span className="font-playfair text-sm font-bold text-obsidian">V</span>
                </div>
                <div>
                  <p className="font-dm text-sm font-semibold text-linen-cream">VOXE Assistant</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-dm text-[10px] text-linen-cream/35">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-linen-cream/25 hover:text-linen-cream transition-colors">
                <Minimize2 size={15} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl font-dm text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-amber-tan text-obsidian rounded-br-sm"
                      : "bg-white/5 border border-white/8 text-linen-cream/85 rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-tan/50 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick replies */}
              {showQuick && messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.map((q) => (
                    <button key={q} onClick={() => send(q)}
                      className="font-dm text-[11px] px-3 py-1.5 border border-amber-tan/25 text-amber-tan/70 hover:bg-amber-tan hover:text-obsidian hover:border-amber-tan transition-colors rounded-full">
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-amber-tan/10 shrink-0">
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Say something…"
                  className="flex-1 bg-white/5 border border-white/8 rounded-full px-4 py-2.5 font-dm text-sm text-linen-cream placeholder:text-linen-cream/25 focus:outline-none focus:border-amber-tan/40 transition-colors"
                />
                <button type="submit" disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-full bg-amber-tan flex items-center justify-center text-obsidian hover:bg-linen-cream transition-colors disabled:opacity-40 shrink-0">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-amber-tan shadow-lg shadow-amber-tan/25 flex items-center justify-center text-obsidian relative"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
