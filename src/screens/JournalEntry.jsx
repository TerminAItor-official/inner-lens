import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';
import philosophers from '../data/philosophers.js';
import {
  loadStreak,
  recordJournal,
  getStreakQuestionIndex,
  advanceStreakQuestionIndex,
} from '../lib/streak.js';

// ─── Prompts ────────────────────────────────────────────────────────────────

/** Core daily questions — cycle by day-of-year % 3 */
const DAILY_PROMPTS = [
  "What am I pretending isn't bothering me?",
  "What did I feel today that I didn't show?",
  "What mattered most to me today?",
];

/** Streak questions — unlocked at 3+ consecutive days */
const STREAK_QUESTIONS = [
  "What did I almost say today?",
  "Where did I betray myself today?",
  "What did I need today that I didn't give myself?",
  "Where did I act out of fear today?",
  "What am I tolerating that I don't have to?",
];

function getDailyPrompt() {
  const now        = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear  = Math.floor((now - startOfYear) / 86_400_000) + 1;
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
}

// ─── Animation variants ──────────────────────────────────────────────────────

const screenFade = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function JournalEntry({
  onSubmit,
  onHistoryClick,
  isPaid,
  onPhilosopherClick,
  onTabChange,
  onLogoClick,
}) {
  // Prompt state — mutable so streak question can replace it
  const [prompt, setPrompt]         = useState(getDailyPrompt);
  const [isStreakPrompt, setIsStreakPrompt] = useState(false);

  // Streak state — loaded once on mount from localStorage
  const [{ streak }]                = useState(loadStreak);

  // Whether the streak button has been tapped this session (no undo)
  const [streakUsed, setStreakUsed] = useState(false);

  // Text input
  const [text, setText]             = useState('');
  const [submitting, setSubmitting] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Button visible whenever it hasn't been tapped this session;
  // unlocked (gold/glowing) only at 3+ consecutive days.
  const showStreakButton = !streakUsed;
  const streakUnlocked  = streak >= 3;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleStreakQuestion = () => {
    const idx = getStreakQuestionIndex();
    setPrompt(STREAK_QUESTIONS[idx]);
    setIsStreakPrompt(true);
    setStreakUsed(true);
    advanceStreakQuestionIndex(STREAK_QUESTIONS.length);
  };

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    recordJournal(); // persist streak before navigating away
    await onSubmit(text.trim());
    setSubmitting(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div className="min-h-screen pb-32 font-body" {...screenFade}>
      <Header
        onHistoryClick={onHistoryClick}
        isPaid={isPaid}
        onLogoClick={onLogoClick}
      />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto min-h-screen flex flex-col">

        {/* ── Prompt header ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-[#6b7b6a]">
              {isStreakPrompt ? 'Streak Question' : "Today's Session"}
            </span>

            {/* Streak badge — subtle, always visible when streak > 0 */}
            {streak > 0 && (
              <span className="font-label text-[11px] text-[#C8A96A] tracking-wide">
                🔥 {streak}-day streak
              </span>
            )}
          </div>

          {/* Prompt text — keyed so Framer re-animates on replacement */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={prompt}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-3xl md:text-4xl leading-tight font-headline text-[#434842]"
            >
              {prompt}
            </motion.h1>
          </AnimatePresence>

          {/* ── Streak question button ── always rendered; fades out only after tap ── */}
          <div className="mt-6">
            <AnimatePresence>
              {!streakUsed && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  <motion.button
                    onClick={streakUnlocked ? handleStreakQuestion : undefined}
                    disabled={!streakUnlocked}
                    animate={streakUnlocked ? {
                      boxShadow: [
                        '0 0 0px rgba(200, 169, 106, 0.0)',
                        '0 0 18px rgba(200, 169, 106, 0.55)',
                        '0 0 0px rgba(200, 169, 106, 0.0)',
                      ],
                    } : {}}
                    transition={streakUnlocked
                      ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                      : {}}
                    whileHover={streakUnlocked ? { scale: 1.02 } : {}}
                    whileTap={streakUnlocked ? { scale: 0.97 } : {}}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-xl border font-label text-xs font-bold uppercase tracking-widest transition-colors"
                    style={streakUnlocked ? {
                      borderColor: '#C8A96A',
                      color: '#8e6e2a',
                      backgroundColor: '#FDF8EF',
                      cursor: 'pointer',
                    } : {
                      borderColor: '#D4D0CA',
                      color: '#AEABA4',
                      backgroundColor: '#F8F6F2',
                      cursor: 'not-allowed',
                    }}
                  >
                    <span
                      className="material-symbols-outlined text-base"
                      style={{
                        color: streakUnlocked ? '#C8A96A' : '#C8C4BC',
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      auto_awesome
                    </span>
                    Streak Question — dare to go deeper?
                  </motion.button>
                  {!streakUnlocked && (
                    <p className="mt-1.5 font-label text-[10px] tracking-wider text-[#AEABA4]">
                      Unlocks after a 3-day streak
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Textarea ── */}
        <div className="relative flex-grow flex flex-col group">
          <textarea
            className="w-full flex-grow bg-transparent border-none resize-none text-xl md:text-2xl leading-relaxed font-body text-[#434842] placeholder-[#c4c8c0] focus:ring-0 p-0 min-h-[200px]"
            placeholder="Write freely... there are no wrong answers."
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
          />
          <div className="mt-4 flex justify-between items-center border-t border-[#c4c8c0]/20 pt-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#ffdad5] text-[#7b534e] font-label text-[10px] font-bold uppercase tracking-wider">
                {isStreakPrompt ? 'Deep Reflection' : 'Reflection'}
              </span>
            </div>
            <span className="font-label text-[11px] uppercase tracking-widest text-[#747872]">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
          </div>
        </div>

        {/* ── Free tier notice ── */}
        {!isPaid && (
          <div className="mt-10 p-5 bg-surface-container-low border-l-4 border-[#ffdad5] rounded-r-lg">
            <p className="font-label text-[11px] font-semibold text-[#536252] uppercase tracking-wider mb-1">Free Plan</p>
            <p className="text-[#434842] text-sm leading-relaxed">
              1 session per day ·{' '}
              <button className="text-[#7c544f] font-bold underline underline-offset-4 decoration-[#7c544f]/30 hover:decoration-[#7c544f]">
                Upgrade to Deep Lens
              </button>{' '}
              for AI reflections &amp; unlimited sessions.
            </p>
          </div>
        )}

        {/* ── Explore perspectives ── */}
        <div className="mt-14 mb-10">
          <h3 className="font-label text-[10px] font-bold text-[#747872] uppercase tracking-[0.2em] mb-5">
            Explore Perspectives
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {philosophers.map((philosopher) => {
              const { emoji, shortName, tag, accent, key } = philosopher;
              return (
                <button
                  key={key}
                  onClick={() => onPhilosopherClick?.(philosopher)}
                  className="p-4 bg-surface-container-lowest shadow-sm text-left hover:brightness-95 transition-all active:scale-[0.98]"
                  style={{ borderLeft: `2px solid ${accent}` }}
                >
                  <span className="text-xl mb-2 block">{emoji}</span>
                  <p className="font-label text-[11px] font-bold text-[#1c1c18] uppercase tracking-tighter">{shortName}</p>
                  <p className="font-body text-[13px] italic text-[#747872] leading-snug">{tag}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Submit CTA ── */}
        <div className="sticky bottom-24 z-40">
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className="w-full py-4 bg-[#2F3A34] text-[#F5F1EA] rounded-lg shadow-lg flex items-center justify-center gap-2 hover:bg-[#1A221E] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed font-label text-sm font-bold uppercase tracking-widest"
          >
            {submitting ? 'Finding your lens...' : 'Take me to the couch'}
            {!submitting && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </div>
      </main>

      <BottomNav activeTab="reflect" onTabChange={onTabChange} />
    </motion.div>
  );
}
