import React from 'react';
import { motion } from 'framer-motion';

export default function AIReflection({ philosopherData, reflection, loading, onClose }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center font-body"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* No nav — Destination Rule */}
      <main className="flex-grow w-full max-w-2xl px-6 py-20 md:py-32 flex flex-col items-center justify-center">

        {/* Philosopher icon */}
        <div className="mb-6 text-4xl opacity-90">
          {philosopherData?.emoji ?? '✨'}
        </div>

        {/* Label */}
        <h2
          className="font-label text-[11px] font-bold mb-10 text-center tracking-[0.2em] uppercase opacity-70"
          style={{ color: 'var(--text-primary)' }}
        >
          {philosopherData?.name ? `${philosopherData.name}'s Reflection` : 'Deep Lens Reflection'}
        </h2>

        {/* Reflection card */}
        <div
          className="w-full p-7 md:p-9 rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden"
          style={{ border: '1px solid var(--accent)' }}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div
                className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <p className="font-body italic text-base opacity-60">Finding the words...</p>
            </div>
          ) : reflection ? (
            <p
              className="font-body italic text-lg md:text-xl leading-[2] text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              "{reflection}"
            </p>
          ) : (
            <p className="font-body italic text-base text-center opacity-60 py-4">
              Something in what you've shared points to a tension still worth sitting with. Stay with it a little longer.
            </p>
          )}
        </div>

        <div className="h-16 md:h-24" />

        {/* Close */}
        <div className="w-full max-w-sm">
          <button
            onClick={onClose}
            className="w-full py-5 flex items-center justify-center gap-3 font-label font-medium tracking-wide text-sm transition-all active:scale-95"
            style={{ backgroundColor: '#2F3A34', color: '#F5F1EA', borderRadius: '0.375rem' }}
          >
            Close session
            <span className="material-symbols-outlined text-[18px]">check</span>
          </button>
        </div>
      </main>

      <footer className="w-full py-10 px-8" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <div className="font-body italic text-sm" style={{ color: '#2F3A34' }}>Inner Lens</div>
          <div className="flex gap-6 font-label text-[11px] uppercase tracking-[0.1em] opacity-50">
            <a href="#" className="hover:opacity-100 transition-opacity">Philosophy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
          </div>
          <div className="font-label text-[10px] tracking-wide opacity-40" style={{ color: 'var(--text-primary)' }}>
            © Mom Words Matter™
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
