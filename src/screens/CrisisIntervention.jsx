import React from 'react';
import { motion } from 'framer-motion';

export default function CrisisIntervention({ onReturn }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 font-body"
      style={{ backgroundColor: '#F5F1EA', color: '#4A4541' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* No nav — Destination Rule */}
      <main className="max-w-xl w-full mx-auto flex flex-col items-center text-center space-y-10">

        {/* Empathy */}
        <div className="flex flex-col items-center space-y-5">
          <div className="text-6xl md:text-7xl drop-shadow-sm" role="img" aria-label="Heart">💛</div>
          <h1 className="text-3xl md:text-5xl font-headline text-[#6B7B6A] tracking-tight italic">
            We hear you. You're not alone.
          </h1>
          <p className="text-lg md:text-xl leading-relaxed max-w-md opacity-90 px-4 font-body">
            It sounds like you might be going through something really difficult right now. Before we continue, we want to make sure you have the support you deserve.
          </p>
        </div>

        {/* Resources */}
        <div className="w-full space-y-5">
          {/* 988 */}
          <div className="bg-white p-8 rounded-xl border-2" style={{ borderColor: '#C8A96A' }}>
            <div className="flex flex-col items-center space-y-4">
              <span className="material-symbols-outlined text-3xl" style={{ color: '#C8A96A' }}>support_agent</span>
              <h2 className="text-xl font-bold text-[#6B7B6A]">988 Suicide &amp; Crisis Lifeline</h2>
              <p className="text-base font-body">Call or text <span className="font-bold">988</span> — free, confidential, 24/7</p>
              <a
                href="https://988lifeline.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-label text-sm uppercase tracking-widest text-[#536252] border-b border-[#536252]/20 pb-1 hover:border-[#536252] transition-colors"
              >
                Chat at 988lifeline.org
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Crisis Text Line */}
          <div className="bg-white p-8 rounded-xl border-2" style={{ borderColor: '#D8A7A0' }}>
            <div className="flex flex-col items-center space-y-4">
              <span className="material-symbols-outlined text-3xl" style={{ color: '#D8A7A0' }}>sms</span>
              <h2 className="text-xl font-bold text-[#6B7B6A]">Crisis Text Line</h2>
              <p className="text-base font-body">
                Text <span className="font-bold">HOME</span> to <span className="font-bold">741741</span>
              </p>
            </div>
          </div>
        </div>

        {/* Return */}
        <div className="pt-4">
          <button
            onClick={onReturn}
            className="flex items-center gap-3 text-[#4A4541] hover:opacity-70 transition-opacity italic text-lg font-body"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to journal
          </button>
        </div>
      </main>

      <footer className="mt-auto py-10 px-8 w-full">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <div className="font-headline italic text-sm text-[#6B7B6A]">Inner Lens</div>
          <p className="font-label text-xs tracking-wide opacity-60">© Mom Words Matter™. All rights reserved.</p>
          <nav className="flex gap-5 font-label text-xs uppercase tracking-tighter opacity-50">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
          </nav>
        </div>
      </footer>
    </motion.div>
  );
}
