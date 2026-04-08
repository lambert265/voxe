"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";

type EventColor = "blue" | "green" | "accent" | "red";

type CalEvent = {
  id: number;
  day: number;
  title: string;
  color: EventColor;
  time?: string;
};

const COLOR_STYLES: Record<EventColor, { bg: string; color: string; border: string }> = {
  blue:   { bg: "rgba(96,165,250,0.1)",   color: "#60a5fa", border: "rgba(96,165,250,0.3)"   },
  green:  { bg: "rgba(74,222,128,0.1)",   color: "#4ade80", border: "rgba(74,222,128,0.3)"   },
  accent: { bg: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "rgba(201,169,110,0.3)"  },
  red:    { bg: "rgba(248,113,113,0.1)",  color: "#f87171", border: "rgba(248,113,113,0.3)"  },
};

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const INITIAL_EVENTS: CalEvent[] = [
  { id: 1, day: 8,  title: "Team Sync",        color: "blue",   time: "10:00 AM" },
  { id: 2, day: 8,  title: "System Maint.",     color: "accent", time: "2:00 PM"  },
  { id: 3, day: 15, title: "Product Drop",      color: "green",  time: "12:00 PM" },
  { id: 4, day: 19, title: "Team Sync",         color: "blue",   time: "10:00 AM" },
  { id: 5, day: 25, title: "Feature Release",   color: "red",    time: "9:00 AM"  },
  { id: 6, day: 26, title: "Brand Shoot",       color: "accent", time: "11:00 AM" },
];

const EMPTY_FORM = { title: "", day: "", time: "", color: "blue" as EventColor };

export default function AdminCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [events, setEvents] = useState<CalEvent[]>(INITIAL_EVENTS);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const today = now.getDate();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function addEvent() {
    if (!form.title || !form.day) return;
    setEvents(prev => [...prev, { ...form, id: Date.now(), day: Number(form.day) }]);
    setModal(false);
    setForm(EMPTY_FORM);
  }

  function deleteEvent(id: number) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  const todayEvents = events.filter(e => isCurrentMonth && e.day === today);
  const selectedDayEvents = events; // all for current month view

  // Build calendar grid cells
  const cells: { day: number; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, current: false });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 300, color: "var(--adm-text)" }}>
            {MONTHS[month]} {year}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["‹", prevMonth], ["›", nextMonth]].map(([label, fn]) => (
              <button key={label as string} onClick={fn as () => void}
                style={{ width: 28, height: 28, borderRadius: 6, background: "var(--adm-surface2)", border: "1px solid var(--adm-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--adm-text2)", fontSize: 14 }}>
                {label as string}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setModal(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#c9a96e", color: "#000", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer" }}>
          <Plus size={14} /> Add Event
        </button>
      </div>

      {/* Calendar + Schedule */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        {/* Calendar grid */}
        <div style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: 12, overflow: "hidden" }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "var(--adm-text3)", padding: "10px 0", borderBottom: "1px solid var(--adm-border)" }}>
                {d}
              </div>
            ))}
          </div>
          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
            {cells.map((cell, i) => {
              const isToday = cell.current && isCurrentMonth && cell.day === today;
              const dayEvents = cell.current ? events.filter(e => e.day === cell.day) : [];
              return (
                <div key={i} style={{
                  minHeight: 80, border: "1px solid var(--adm-border)", padding: 8,
                  background: isToday ? "rgba(201,169,110,0.08)" : "transparent",
                  cursor: "pointer",
                }}>
                  <div style={{ fontSize: 12, color: isToday ? "#c9a96e" : cell.current ? "var(--adm-text2)" : "#333", fontWeight: isToday ? 500 : 400, marginBottom: 4, opacity: cell.current ? 1 : 0.25 }}>
                    {cell.day}
                  </div>
                  {dayEvents.slice(0, 2).map(ev => {
                    const s = COLOR_STYLES[ev.color];
                    return (
                      <div key={ev.id} style={{ fontSize: 9, padding: "2px 5px", borderRadius: 3, marginBottom: 2, background: s.bg, color: s.color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ev.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 2 && (
                    <div style={{ fontSize: 9, color: "var(--adm-text3)" }}>+{dayEvents.length - 2} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's schedule */}
        <div style={{ background: "var(--adm-surface)", border: "1px solid var(--adm-border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--adm-border)" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)" }}>Today</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--adm-text)", marginTop: 2 }}>
              {MONTHS[now.getMonth()]} {now.getDate()}, Schedule
            </div>
          </div>
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {todayEvents.length === 0 ? (
              <p style={{ fontSize: 12, color: "var(--adm-text3)", textAlign: "center", padding: "20px 0" }}>No events today</p>
            ) : (
              todayEvents.map(ev => {
                const s = COLOR_STYLES[ev.color];
                return (
                  <div key={ev.id} style={{ background: "var(--adm-surface2)", border: "1px solid var(--adm-border)", borderRadius: 8, padding: 12, borderLeft: `3px solid ${s.color}` }}>
                    <div style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: "var(--adm-text3)" }}>{ev.time}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, marginTop: 2, color: "var(--adm-text)" }}>{ev.title}</div>
                  </div>
                );
              })
            )}

            {/* All month events */}
            <div style={{ marginTop: 8, borderTop: "1px solid var(--adm-border)", paddingTop: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--adm-text3)", marginBottom: 10 }}>This Month</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
                {selectedDayEvents.sort((a, b) => a.day - b.day).map(ev => {
                  const s = COLOR_STYLES[ev.color];
                  return (
                    <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, color: "var(--adm-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.title}</div>
                        <div style={{ fontSize: 10, color: "var(--adm-text3)" }}>Day {ev.day} {ev.time ? `· ${ev.time}` : ""}</div>
                      </div>
                      <button onClick={() => deleteEvent(ev.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--adm-text3)", padding: 2, flexShrink: 0 }}>
                        <X size={11} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={() => setModal(false)}>
          <div style={{ background: "#111", border: "1px solid #333", borderRadius: 14, width: 420, maxWidth: "90vw", overflow: "hidden" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #2a2a2a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: "var(--adm-text)" }}>Add Event</div>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--adm-text3)" }}><X size={16} /></button>
            </div>
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "Event Title", key: "title", type: "text", placeholder: "e.g. Team Sync" },
                { label: "Day of Month", key: "day", type: "number", placeholder: "1–31" },
                { label: "Time (optional)", key: "time", type: "text", placeholder: "e.g. 10:00 AM" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--adm-text3)", marginBottom: 6 }}>{label}</div>
                  <input type={type} placeholder={placeholder}
                    value={form[key as keyof typeof form] as string}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: "100%", background: "#181818", border: "1px solid #2a2a2a", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--adm-text)", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--adm-text3)", marginBottom: 8 }}>Color</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {(Object.keys(COLOR_STYLES) as EventColor[]).map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                      style={{ width: 28, height: 28, borderRadius: "50%", background: COLOR_STYLES[c].color, border: form.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer" }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ padding: "16px 24px", borderTop: "1px solid #2a2a2a", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setModal(false)}
                style={{ padding: "8px 16px", borderRadius: 8, background: "#181818", border: "1px solid #2a2a2a", color: "var(--adm-text2)", fontSize: 12, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={addEvent}
                style={{ padding: "8px 16px", borderRadius: 8, background: "#c9a96e", color: "#000", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer" }}>
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
