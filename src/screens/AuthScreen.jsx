import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signUp } from '../lib/auth.js';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
};

export default function AuthScreen({ onBack }) {
  const [email, setEmail]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [sent, setSent]             = useState(false);
  const [error, setError]           = useState(null);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const { error: authError } = await signUp(email.trim());

    setLoading(false);
    if (authError) {
      setError(authError.message ?? 'Something went wrong. Please try again.');
    } else {
      // TODO: persist to user_preferences table in Supabase (Phase 2)
      console.log('[auth] marketingOptIn:', marketingOptIn);
      setSent(true);
    }
  };

  return (
    <motion.div
      className="min-h-screen font-body flex flex-col"
      style={{ backgroundColor: '#fdf9f2', color: '#4A4541' }}
      {...fadeIn}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#c4c8c0]/20">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-label text-[11px] uppercase tracking-widest text-[#747872] hover:text-[#4A4541] transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <span className="font-body italic text-[#2F3A34] text-lg">Inner Lens</span>
        <div className="w-16" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-sm mx-auto w-full">

        <span
          className="material-symbols-outlined text-4xl text-[#536252] mb-6"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          psychology
        </span>

        <h1 className="font-headline text-3xl text-[#2F3A34] text-center mb-3 leading-snug">
          Sign in to save<br />your reflections
        </h1>

        <div className="w-10 h-px bg-[#536252]/30 mx-auto mb-6" />

        <p className="font-body text-sm text-[#434842]/70 text-center leading-relaxed mb-10">
          We'll send a magic link to your email — no password needed.
        </p>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <span className="material-symbols-outlined text-4xl text-[#536252]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mark_email_read
              </span>
              <p className="font-headline text-xl text-[#2F3A34]">Check your email</p>
              <p className="font-body text-sm text-[#434842]/70 leading-relaxed">
                We sent a sign-in link to <span className="text-[#2F3A34] font-semibold">{email}</span>.
                <br />Tap it to continue.
              </p>
              <p className="font-label text-[10px] uppercase tracking-widest text-[#747872] pt-2">
                No email? Check your spam folder.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="w-full space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="font-label text-[10px] uppercase tracking-widest text-[#747872] block mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/70 border border-[#c4c8c0]/40 font-body text-[#2F3A34] placeholder:text-[#747872]/60 focus:outline-none focus:ring-2 focus:ring-[#536252]/40 transition-all"
                  required
                />
              </div>

              {error && (
                <p className="font-body text-sm text-[#ba1a1a] text-center">{error}</p>
              )}

              {/* Marketing opt-in */}
              <div className="space-y-1.5">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={e => setMarketingOptIn(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#c4c8c0] text-[#536252] focus:ring-[#536252]/40 transition-colors cursor-pointer flex-shrink-0"
                  />
                  <span className="font-body text-sm text-[#434842]/80 leading-snug group-hover:text-[#434842] transition-colors">
                    Send me updates about new features and Inner Lens news.
                  </span>
                </label>
                <p className="font-label text-[10px] text-[#434842]/50 pl-7">
                  We'll never share your email. Unsubscribe anytime.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-4 bg-[#2F3A34] text-[#F5F1EA] rounded-xl font-label text-sm font-bold uppercase tracking-widest hover:bg-[#1A221E] hover:scale-[1.02] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send Magic Link'}
              </button>

              <p className="font-label text-[10px] uppercase tracking-widest text-[#434842]/40 text-center pt-1">
                Free to use · No password · No spam
              </p>
            </motion.form>
          )}
        </AnimatePresence>

      </main>
    </motion.div>
  );
}
