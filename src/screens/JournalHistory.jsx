import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { getJournalEntries } from '../lib/journal.js';

const PHILOSOPHER_STYLES = {
  freud:      { bg: '#FDF2ED', border: '#A0522D', text: '#A0522D', label: 'Freud',      emoji: '🛋️' },
  anna_freud: { bg: '#EDF2F7', border: '#718096', text: '#718096', label: 'Anna Freud', emoji: '🛡️' },
  winnicott:  { bg: '#E8F5E9', border: '#40916C', text: '#40916C', label: 'Winnicott',  emoji: '🌱' },
  jung:       { bg: '#FAF6E9', border: '#8B6914', text: '#8B6914', label: 'Jung',       emoji: '🌙' },
  klein:      { bg: '#F8E8F8', border: '#9B59B6', text: '#9B59B6', label: 'Klein',      emoji: '🪞' },
  lacan:      { bg: '#EFF6FB', border: '#2E6DA4', text: '#2E6DA4', label: 'Lacan',      emoji: '🔮' },
};

function EntryCard({ philosopher, date, excerpt, reflection, aiInsight }) {
  const style = PHILOSOPHER_STYLES[philosopher] ?? PHILOSOPHER_STYLES.winnicott;

  return (
    <article
      className="rounded-r-lg overflow-hidden shadow-sm"
      style={{ backgroundColor: style.bg, borderLeft: `4px solid ${style.border}` }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{style.emoji}</span>
            <span className="font-label text-[11px] font-bold tracking-widest uppercase" style={{ color: style.text }}>
              {style.label}
            </span>
          </div>
          <time className="font-label text-[10px] text-[#434842]/50">{date}</time>
        </div>
        <p className="font-body italic leading-relaxed mb-5 opacity-80 text-[#434842]">
          "{excerpt}"
        </p>
        {reflection && (
          <div className="space-y-3 pt-4 border-t border-[#c4c8c0]/10">
            <p className="font-body leading-relaxed text-base text-[#1c1c18]">{reflection}</p>
            {aiInsight && (
              <div className="bg-white/50 p-3 rounded flex items-start gap-3">
                <span className="material-symbols-outlined text-sm text-[#C8A96A]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <div>
                  <span className="font-label text-[9px] font-bold text-[#C8A96A] uppercase tracking-tighter">✨ AI Insight</span>
                  <p className="font-body text-xs text-[#434842]/80 italic mt-0.5">{aiInsight}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function JournalHistory({ onBack, onTabChange, user }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getJournalEntries(user.id).then(({ data, error }) => {
      if (error) console.error('[journal] fetch failed:', error.message);
      else setEntries(data.map(row => ({
        philosopher:  row.philosopher,
        date:         new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        excerpt:      row.entry_text?.slice(0, 160) + (row.entry_text?.length > 160 ? '…' : ''),
        reflection:   row.reflection_text ?? null,
        aiInsight:    row.ai_insight ?? null,
      })));
      setLoading(false);
    });
  }, [user]);

  return (
    <motion.div
      className="min-h-screen pb-32 font-body"
      style={{ backgroundColor: '#fdf9f2', color: '#4A4541' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="bg-[#2F3A34] fixed top-0 w-full z-50 shadow-sm backdrop-blur-md">
        <nav className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-[#F5F1EA]/80 hover:text-[#F5F1EA] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-label text-[11px] uppercase tracking-widest">Back</span>
            </button>
            <h1 className="font-body italic text-xl text-[#F5F1EA] flex items-center gap-2">
              <span className="material-symbols-outlined">psychology</span>
              Your Journal
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#C8A96A] font-body italic text-sm">
              {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </div>
        </nav>
      </header>

      <main className="pt-24 pb-32 px-4 max-w-2xl mx-auto space-y-6">
        <div className="mb-10 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#434842]/60 mb-2">Chronicle of the Self</p>
          <h2 className="text-3xl font-headline text-[#2F3A34] italic">Reflections</h2>
        </div>

        {loading ? (
          <div className="text-center py-24 space-y-4">
            <span className="material-symbols-outlined text-4xl text-[#536252] animate-spin">progress_activity</span>
            <p className="font-label text-[10px] uppercase tracking-widest text-[#747872]">Loading your entries…</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="text-5xl opacity-30">📖</div>
            <p className="font-headline italic text-2xl text-[#6B7B6A]">Your journal is waiting.</p>
            <p className="font-body text-[#434842]/60 leading-relaxed max-w-sm mx-auto">
              Complete a session and your entries will appear here, tinted with the color of your matched philosopher.
            </p>
            {!user && (
              <p className="font-label text-[10px] uppercase tracking-widest text-[#747872] mt-6">
                Sign in to save and view your history across devices.
              </p>
            )}
          </div>
        ) : (
          entries.map((entry, i) => <EntryCard key={i} {...entry} />)
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#f1ede6] w-full py-10 px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="font-body italic text-sm text-[#2F3A34]">Inner Lens</div>
          <p className="font-label text-xs tracking-wide leading-relaxed text-[#4A4541] max-w-md">
            If you are experiencing a mental health crisis, text HOME to 741741 or call 988.
          </p>
          <div className="flex gap-4 font-label text-xs tracking-wide text-[#4A4541]/60">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
          </div>
        </div>
      </footer>

      <BottomNav activeTab="library" onTabChange={onTabChange} />
    </motion.div>
  );
}
