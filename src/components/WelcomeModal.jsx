import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WELCOMED_KEY = 'il_welcomed';

export function hasBeenWelcomed() {
  try { return !!localStorage.getItem(WELCOMED_KEY); } catch { return true; }
}

export function markWelcomed() {
  try { localStorage.setItem(WELCOMED_KEY, '1'); } catch {}
}

export default function WelcomeModal({ visible, onSignIn, onDismiss }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(47, 58, 52, 0.6)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md bg-[#fdf9f2] rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[#536252] via-[#C8A96A] to-[#536252]" />

            <div className="px-8 py-10 text-center">
              {/* Wordmark */}
              <p className="font-body italic text-[#2F3A34] text-lg mb-8 opacity-70">Inner Lens</p>

              {/* Headline */}
              <h1 className="font-headline text-3xl md:text-4xl text-[#2F3A34] leading-tight mb-4">
                Welcome to Inner Lens
              </h1>

              {/* Description */}
              <p className="font-body text-[#434842]/80 leading-relaxed mb-2 max-w-sm mx-auto">
                Journal through the lens of history's greatest psychoanalytic thinkers.
              </p>
              <p className="font-body text-[#434842]/80 leading-relaxed mb-2 max-w-sm mx-auto">
                AI reads your words and matches you to the perspective you need most.
              </p>
              <p className="font-body text-[#536252] text-sm leading-relaxed mt-4 mb-8 max-w-xs mx-auto">
                Sign in to save your reflections across sessions.
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={onSignIn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3.5 bg-[#2F3A34] text-[#F5F1EA] rounded-xl font-label text-sm font-bold uppercase tracking-widest shadow-md transition-colors hover:bg-[#1A221E]"
                >
                  Sign in
                </motion.button>
                <p className="font-label text-[10px] text-[#434842]/50 text-center -mt-1">
                  Signing in is free — just enter your email.
                </p>
                <button
                  onClick={onDismiss}
                  className="w-full py-3 font-label text-[11px] uppercase tracking-widest text-[#747872] hover:text-[#434842] transition-colors"
                >
                  Try it first
                </button>
              </div>

              <p className="font-label text-[10px] uppercase tracking-widest text-[#434842]/30 mt-6">
                Free to use · No password required
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
