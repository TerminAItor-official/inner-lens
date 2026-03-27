import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/BottomNav.jsx';
import { loadStreak } from '../lib/streak.js';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

const settingsItems = [
  { icon: 'notifications', label: 'Daily Reminder',  note: 'Coming soon' },
  { icon: 'download',      label: 'Export Journal',  note: 'Deep Lens only' },
  { icon: 'lock',          label: 'Privacy & Data',  note: '' },
];

export default function ProfileScreen({ onTabChange, onUpgradeClick, onPrivacyClick, onLogoClick, onStreakQuestion, isPaid }) {
  // Phase 2: pull from Supabase auth
  const displayName = 'Reflective Soul';
  const sessionCount = 0;
  const { streak } = loadStreak();
  const joinDate = 'March 2026';

  // Inline notice for settings rows not yet wired to a full screen
  const [notice, setNotice] = useState(null);
  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleSettingClick = (label) => {
    if (label === 'Privacy & Data')  return onPrivacyClick?.();
    if (label === 'Daily Reminder')  return showNotice('Daily reminders are coming soon.');
    if (label === 'Export Journal')  return isPaid
      ? showNotice('Export is coming soon — your entries will be ready to download.')
      : onUpgradeClick?.();
  };

  return (
    <motion.div
      className="min-h-screen pb-32 font-body"
      style={{ backgroundColor: '#fdf9f2', color: '#4A4541' }}
      {...fadeIn}
    >
      {/* Header */}
      <header className="bg-[#2F3A34] fixed top-0 w-full z-50 shadow-sm">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 px-6 py-4 font-body text-[#F5F1EA] italic text-xl hover:opacity-80 transition-opacity"
        >
          <span className="material-symbols-outlined">psychology</span>
          Inner Lens
        </button>
      </header>

      <main className="pt-28 pb-32 px-6 max-w-2xl mx-auto space-y-8">

        {/* Avatar + name */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#536252]/15 border-2 border-[#536252]/30 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-4xl text-[#536252]">person</span>
          </div>
          <div>
            <h1 className="font-headline text-3xl text-[#2F3A34]">{displayName}</h1>
            <p className="font-label text-xs uppercase tracking-widest text-[#747872] mt-1">
              Member since {joinDate}
            </p>
          </div>
        </div>

        {/* Plan status */}
        <div className={`rounded-xl p-6 border ${isPaid ? 'border-[#C8A96A]/40 bg-[#FDF8EF]' : 'border-[#c4c8c0]/30 bg-[#F5F1EA]'}`}>
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="font-label text-[10px] uppercase tracking-widest text-[#747872] mb-1">Current Plan</p>
              <p className="font-headline text-xl text-[#2F3A34]">
                {isPaid ? '✨ Deep Lens' : 'Free'}
              </p>
              <p className="font-body text-sm text-[#434842]/70 mt-1 leading-relaxed">
                {isPaid
                  ? 'Unlimited sessions · AI reflections · Pattern dashboard'
                  : '1 session per day · All 6 thinkers'}
              </p>
            </div>
            {!isPaid && (
              <button
                onClick={onUpgradeClick}
                className="bg-[#C8A96A] text-[#2F3A34] px-4 py-2 rounded-lg font-label text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all flex-shrink-0"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: 'edit_note',      label: 'Sessions',  value: sessionCount },
            { icon: 'local_fire_department', label: 'Day Streak', value: streak },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-white/70 p-6 text-center shadow-sm border border-[#c4c8c0]/20"
            >
              <span className="material-symbols-outlined text-[#536252] text-2xl mb-2 block">{icon}</span>
              <p className="font-headline text-3xl text-[#2F3A34]">{value}</p>
              <p className="font-label text-[10px] uppercase tracking-widest text-[#747872] mt-1">{label}</p>
            </div>
          ))}
        </div>

        <p className="text-center font-label text-[10px] uppercase tracking-widest text-[#747872] leading-relaxed px-4">
          Your streak grows each consecutive day you journal.
          <br />Hit 3 days to unlock deeper Streak Questions.
        </p>

        {/* Streak question shortcut */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.button
            onClick={streak >= 3 ? onStreakQuestion : undefined}
            disabled={streak < 3}
            animate={streak >= 3 ? {
              boxShadow: [
                '0 0 0px rgba(200, 169, 106, 0.0)',
                '0 0 18px rgba(200, 169, 106, 0.55)',
                '0 0 0px rgba(200, 169, 106, 0.0)',
              ],
            } : {}}
            transition={streak >= 3
              ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
              : {}}
            whileHover={streak >= 3 ? { scale: 1.02 } : {}}
            whileTap={streak >= 3 ? { scale: 0.97 } : {}}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl border font-label text-xs font-bold uppercase tracking-widest transition-colors"
            style={streak >= 3 ? {
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
            🔥 Streak Question — dare to go deeper?
          </motion.button>
          {streak < 3 && (
            <p className="font-label text-[10px] tracking-wider text-[#AEABA4]">
              Unlocks after a 3-day streak
            </p>
          )}
        </div>

        {/* Settings list */}
        <div className="rounded-xl border border-[#c4c8c0]/30 overflow-hidden">
          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="px-6 py-3 bg-[#F5F1EA] border-b border-[#c4c8c0]/30 font-body text-sm text-[#536252]"
              >
                {notice}
              </motion.div>
            )}
          </AnimatePresence>
          {settingsItems.map(({ icon, label, note }, i) => (
            <div
              key={label}
              onClick={() => handleSettingClick(label)}
              className={`flex items-center justify-between px-6 py-5 bg-white/70 hover:bg-[#F5F1EA] transition-colors cursor-pointer ${i < settingsItems.length - 1 ? 'border-b border-[#c4c8c0]/20' : ''}`}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#536252]">{icon}</span>
                <span className="font-body text-[#2F3A34]">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                {note && (
                  <span className="font-label text-[10px] uppercase tracking-wider text-[#747872]">{note}</span>
                )}
                <span className="material-symbols-outlined text-[#747872] text-sm">chevron_right</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center font-label text-[10px] uppercase tracking-widest text-[#434842]/40 pt-2">
          Inner Lens · Mom Words Matter™
        </p>
      </main>

      <BottomNav activeTab="profile" onTabChange={onTabChange} />
    </motion.div>
  );
}
