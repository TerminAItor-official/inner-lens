/**
 * streak.js — localStorage-backed streak tracking for Inner Lens.
 *
 * Keys:
 *   il_last_journal_date  — 'YYYY-MM-DD' of the last completed session
 *   il_streak_count       — integer, current consecutive-day streak
 *   il_streak_q_index     — integer, which streak question shows next
 */

const K = {
  lastDate : 'il_last_journal_date',
  streak   : 'il_streak_count',
  sqIndex  : 'il_streak_q_index',
};

/** 'YYYY-MM-DD' in local time */
function todayKey() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

/** Calendar-day difference: positive = b is after a */
function daysBetween(isoA, isoB) {
  return Math.round((new Date(isoB) - new Date(isoA)) / 86_400_000);
}

/**
 * Read the current streak state without mutating anything.
 * Returns { streak: number, alreadyTodayJournaled: boolean }
 */
export function loadStreak() {
  try {
    const lastDate = localStorage.getItem(K.lastDate);
    const stored   = parseInt(localStorage.getItem(K.streak) || '0', 10);

    if (!lastDate) return { streak: 0, alreadyTodayJournaled: false };

    const diff = daysBetween(lastDate, todayKey());

    if (diff === 0) return { streak: stored, alreadyTodayJournaled: true };
    if (diff === 1) return { streak: stored, alreadyTodayJournaled: false };

    // Missed at least one day — streak is broken
    return { streak: 0, alreadyTodayJournaled: false };
  } catch {
    return { streak: 0, alreadyTodayJournaled: false };
  }
}

/**
 * Record a completed journal session.
 * Safe to call multiple times in one day — only counts once.
 * Returns the new streak count.
 */
export function recordJournal() {
  try {
    const today    = todayKey();
    const lastDate = localStorage.getItem(K.lastDate);
    const stored   = parseInt(localStorage.getItem(K.streak) || '0', 10);

    if (lastDate === today) return stored; // already counted today

    const diff      = lastDate ? daysBetween(lastDate, today) : null;
    const newStreak = diff === 1 ? stored + 1 : 1;

    localStorage.setItem(K.lastDate, today);
    localStorage.setItem(K.streak,   String(newStreak));
    return newStreak;
  } catch {
    return 1;
  }
}

/**
 * Return the index of the next streak question to show.
 */
export function getStreakQuestionIndex() {
  try {
    return parseInt(localStorage.getItem(K.sqIndex) || '0', 10);
  } catch {
    return 0;
  }
}

/**
 * Advance the streak question index so the next session shows
 * a different question. Call immediately when the button is tapped.
 */
export function advanceStreakQuestionIndex(total) {
  try {
    const next = (getStreakQuestionIndex() + 1) % total;
    localStorage.setItem(K.sqIndex, String(next));
    return next;
  } catch {
    return 0;
  }
}
