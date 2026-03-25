import React, { useState } from 'react';
import { motion } from 'framer-motion';
import philosophers from '../data/philosophers.js';

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

// Landing-page card copy (tagline + short desc per philosopher)
const cardCopy = {
  freud:       { desc: 'Uncover the latent meanings behind your daily frustrations through psychoanalytic dreamwork.' },
  anna_freud:  { desc: "Identify the ego's protective layers and how they influence your current interpersonal dynamics." },
  winnicott:   { desc: 'Explore the concept of the "Good Enough" self and the healing power of creative play.' },
  jung:        { desc: 'Map your Shadow self and the collective unconscious patterns manifesting in your life.' },
  klein:       { desc: 'Examine the formative split between love and anger in your earliest memories.' },
  lacan:       { desc: 'Deconstruct the language of desire and how you see yourself reflected in the world.' },
};

const NAV_LINKS = [
  { id: 'method',   label: 'The Method',  href: '#method'   },
  { id: 'thinkers', label: 'The Council', href: '#thinkers' },
  { id: 'pricing',  label: 'Pricing',     href: '#pricing'  },
];

export default function LandingPage({ onStartJournaling, onPhilosopherClick, onUpgradeClick }) {
  const [activeSection, setActiveSection] = useState(null);

  const handleNavClick = (id, href) => {
    setActiveSection(id);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <motion.div className="font-body" {...fadeIn}>

      {/* ── Desktop nav (md+) ── */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 bg-[#fdf9f2]/85 backdrop-blur-xl transition-all duration-300">
        <div className="flex justify-between items-center px-16 py-6 max-w-[1440px] mx-auto w-full">
          <div
            className="text-2xl font-body italic text-[#4A4541] cursor-pointer hover:opacity-70 transition-opacity"
            onClick={scrollToTop}
          >
            Inner Lens
          </div>
          <div className="flex space-x-12 items-center">
            {NAV_LINKS.map(({ id, label, href }) => {
              const active = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id, href)}
                  className={`pb-1 font-medium transition-colors ${
                    active
                      ? 'text-[#536252] border-b-2 border-[#536252]'
                      : 'text-[#4A4541]/70 hover:text-[#536252] border-b-2 border-transparent'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={onStartJournaling}
              className="bg-[#536252] text-white px-6 py-2.5 rounded font-label text-xs uppercase tracking-widest font-semibold hover:bg-[#6b7b6a] transition-all"
            >
              Begin Reflection
            </button>
            <span className="material-symbols-outlined text-[#536252] cursor-pointer">account_circle</span>
          </div>
        </div>
      </nav>

      {/* ── Mobile nav ── */}
      <header className="md:hidden fixed top-0 w-full z-50 bg-[#2F3A34] shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <button
            className="flex items-center gap-2 font-body text-[#F5F1EA] italic tracking-tight text-xl hover:opacity-80 transition-opacity"
            onClick={scrollToTop}
          >
            <span className="material-symbols-outlined">psychology</span>
            Inner Lens
          </button>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#F5F1EA]">menu_book</span>
            <button
              onClick={onStartJournaling}
              className="bg-[#C8A96A] text-[#2F3A34] px-4 py-1.5 rounded-lg font-label text-xs uppercase tracking-widest font-bold"
            >
              Upgrade
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <header className="pt-32 md:pt-48 pb-24 md:pb-32 px-6 md:px-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="font-label text-xs tracking-[0.2em] uppercase text-[#536252] mb-6 block font-medium">
                A Mom Words Matter™ Experience
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline text-[#6B7B6A] leading-[1.1] mb-8 tracking-tight">
                What's really on{' '}
                <br className="hidden md:block" />
                <i className="font-normal italic">your mind?</i>
              </h1>
              <p className="text-xl md:text-2xl font-body text-[#4A4541] leading-relaxed max-w-xl mb-10">
                Journal through the lens of history's greatest thinkers. AI reads your words and matches you to the perspective you need most.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <button
                  onClick={onStartJournaling}
                  className="bg-[#C8A96A] text-[#2F3A34] px-8 py-4 rounded-xl font-label font-bold text-sm uppercase tracking-[0.2em] shadow-lg hover:brightness-110 transition-all flex items-center gap-3 group"
                >
                  Start Journaling — Free
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <a href="#method" className="font-label text-sm font-semibold tracking-widest uppercase text-[#536252] border-b border-[#536252]/20 hover:border-[#536252] transition-all">
                  Explore The Method
                </a>
              </div>
            </div>
            <div className="hidden lg:block lg:col-span-5">
              <div className="bg-surface-container-low rounded-xl p-10 shadow-lg">
                <p className="font-body italic text-2xl leading-relaxed text-[#4A4541]">
                  "The unexamined life is not worth living."
                </p>
                <p className="font-label text-[10px] tracking-widest uppercase mt-6 text-[#4A4541]/60">— Socrates</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── The Council ── */}
      <section id="thinkers" className="py-24 md:py-32 px-6 md:px-16 bg-surface-container">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-headline text-[#4A4541] mb-4">Choose Your Guide</h2>
              <p className="text-lg font-body text-[#4A4541]/70 leading-relaxed">
                All six thinkers are free. AI matches you to the one who speaks to where you are right now.
              </p>
            </div>
            <span className="font-label text-[10px] uppercase tracking-widest text-[#747872]">All 6 free</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {philosophers.map((philosopher) => {
              const { emoji, name, tag, accent, key } = philosopher;
              const { desc } = cardCopy[key];
              return (
                <button
                  key={key}
                  onClick={() => onPhilosopherClick(philosopher)}
                  className="group bg-surface-container-lowest p-8 md:p-10 rounded-xl transition-all hover:-translate-y-1 cursor-pointer text-left w-full"
                  style={{ borderLeft: `3px solid ${accent}` }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="text-3xl">{emoji}</div>
                    <span className="font-label text-[10px] tracking-widest uppercase px-3 py-1 bg-surface-container rounded-full text-[#434842]">
                      {tag}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-headline text-[#1c1c18] mb-3">{name}</h3>
                  <p className="font-body text-[#434842] leading-relaxed mb-4 opacity-70 text-sm md:text-base">{desc}</p>
                  <div
                    className="h-px w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: accent }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="method" className="py-24 md:py-32 px-6 md:px-16">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-headline text-[#1c1c18] mb-6">A Ritual of Awareness</h2>
            <div className="w-24 h-px bg-[#536252]/30 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            {[
              { icon: 'edit_note',      title: '1. Write Freely',  body: 'Begin with a stream of consciousness. Our interface is designed to disappear, leaving only you and your thoughts.' },
              { icon: 'auto_awesome',   title: '2. Get Matched',   body: 'Based on your emotional cadence, Inner Lens suggests the most relevant psychological framework for that moment.' },
              { icon: 'import_contacts',title: '3. Go Deeper',     body: 'Respond to a curated follow-up question from your matched thinker — and unlock a personal AI reflection with Deep Lens.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="text-center">
                <div className="mb-8 inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#536252]/20">
                  <span className="material-symbols-outlined text-[#536252] text-3xl">{icon}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-headline mb-4">{title}</h3>
                <p className="font-body text-[#434842] leading-relaxed opacity-80 px-4">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 md:py-32 px-6 md:px-16 bg-surface-container-low">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline text-center mb-16 text-[#1c1c18]">Choose Your Depth</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#c4c8c0]/20 rounded-xl overflow-hidden shadow-sm">

            {/* Free */}
            <div className="bg-surface p-10 md:p-12 flex flex-col justify-between">
              <div>
                <span className="font-label text-[10px] tracking-widest uppercase font-bold text-[#434842]/60 mb-8 block">Open Access</span>
                <h3 className="text-3xl font-headline mb-2">Free</h3>
                <p className="font-body text-[#434842] mb-10 italic">For the curious mind.</p>
                <ul className="space-y-5 mb-12">
                  {[
                    'All 6 psychoanalytic thinkers',
                    'AI philosopher matching',
                    'Follow-up question per session',
                    '1 journal session per day',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-body">
                      <span className="material-symbols-outlined text-[#536252] text-sm">check</span>
                      <span className="text-[#434842]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onStartJournaling}
                className="w-full py-4 border border-[#747872] text-[#1c1c18] font-label text-xs font-bold tracking-widest uppercase hover:bg-surface-container transition-all"
              >
                Continue for Free
              </button>
            </div>

            {/* Deep Lens */}
            <div className="bg-surface-container-lowest p-10 md:p-12 flex flex-col justify-between relative">
              <div className="absolute top-0 right-0 bg-[#8e733a] text-white px-4 py-1 font-label text-[10px] font-bold tracking-[0.2em] uppercase">
                Most Reflective
              </div>
              <div>
                <span className="font-label text-[10px] tracking-widest uppercase font-bold text-[#735b24] mb-8 block">Member Access</span>
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <h3 className="text-3xl font-headline">Deep Lens</h3>
                  <span className="text-xl font-body text-[#434842]">
                    $6<span className="text-sm">/mo</span>
                  </span>
                  <span className="font-label text-xs text-[#434842]/60">or $49/year</span>
                </div>
                <p className="font-body text-[#434842] mb-10 italic">For the lifelong inquirer.</p>
                <ul className="space-y-5 mb-12">
                  {[
                    'Everything in Free',
                    'AI-generated personal reflection',
                    'Unlimited daily sessions',
                    'Pattern dashboard',
                    'Export your journal',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm font-body font-medium">
                      <span className="material-symbols-outlined text-[#735b24] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onUpgradeClick}
                className="w-full py-4 bg-[#536252] text-white font-label text-xs font-bold tracking-widest uppercase hover:bg-[#6b7b6a] transition-all shadow-md"
              >
                Start 14-Day Deep Trial
              </button>
            </div>
          </div>
          <p className="text-center mt-8 font-label text-[10px] tracking-widest text-[#434842]/60 uppercase">
            Cancel any time. No questions asked.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-16 px-6 md:px-16 bg-[#f1ede6]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="font-body italic text-[#4A4541]">Inner Lens</div>
            <p className="font-body text-[#536252] text-sm leading-relaxed max-w-sm opacity-80">
              © Mom Words Matter™. All rights reserved.
              <br />A sanctuary for those who believe that words carry weight.
            </p>
          </div>
          <div className="space-y-4">
            <div className="bg-[#ba1a1a]/5 border border-[#ba1a1a]/10 p-4 rounded-lg max-w-md">
              <p className="font-label text-xs text-[#4A4541] leading-relaxed">
                <span className="font-bold text-[#ba1a1a]">Important:</span> Inner Lens is a philosophical reflection tool, not a substitute for therapy. If you are in crisis, call or text <span className="font-bold">988</span> (USA).
              </p>
            </div>
            <div className="flex gap-6 font-label text-xs tracking-wide text-[#4A4541]/60">
              <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Philosophy</a>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
